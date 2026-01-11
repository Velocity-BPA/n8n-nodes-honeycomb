/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.honeycomb.io/1';

/**
 * Make an authenticated request to the Honeycomb API
 */
export async function honeycombApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	uri?: string,
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('honeycombApi');

	const options: IRequestOptions = {
		method,
		uri: uri || `${BASE_URL}${endpoint}`,
		headers: {
			'X-Honeycomb-Team': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: (error as JsonObject).error as string || 'Honeycomb API request failed',
		});
	}
}

/**
 * Make a paginated request to the Honeycomb API
 */
export async function honeycombApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	let uri: string | undefined;

	do {
		responseData = (await honeycombApiRequest.call(
			this,
			method,
			endpoint,
			body,
			query,
			uri,
		)) as IDataObject;

		if (Array.isArray(responseData)) {
			returnData.push(...responseData);
			break;
		}

		if (responseData.data && Array.isArray(responseData.data)) {
			returnData.push(...(responseData.data as IDataObject[]));
		} else {
			returnData.push(responseData);
			break;
		}

		if (responseData.links && (responseData.links as IDataObject).next) {
			uri = `${BASE_URL}${(responseData.links as IDataObject).next}`;
		} else {
			uri = undefined;
		}
	} while (uri);

	return returnData;
}

/**
 * Poll for query result completion
 */
export async function pollQueryResult(
	this: IExecuteFunctions,
	datasetSlug: string,
	resultId: string,
	maxAttempts = 30,
	intervalMs = 1000,
): Promise<IDataObject> {
	let attempts = 0;

	while (attempts < maxAttempts) {
		const result = (await honeycombApiRequest.call(
			this,
			'GET',
			`/query_results/${datasetSlug}/${resultId}`,
		)) as IDataObject;

		if (result.complete === true) {
			return result;
		}

		await new Promise((resolve) => setTimeout(resolve, intervalMs));
		attempts++;
	}

	throw new Error(`Query result did not complete within ${maxAttempts * intervalMs / 1000} seconds`);
}

/**
 * Send a batch of events to Honeycomb
 */
export async function sendEventBatch(
	this: IExecuteFunctions,
	datasetSlug: string,
	events: IDataObject[],
): Promise<IDataObject[]> {
	const credentials = await this.getCredentials('honeycombApi');

	const options: IRequestOptions = {
		method: 'POST',
		uri: `${BASE_URL}/batch/${datasetSlug}`,
		headers: {
			'X-Honeycomb-Team': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body: events,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to send batch events to Honeycomb',
		});
	}
}

/**
 * Build a query object from node parameters
 * Handles both direct arrays and n8n fixedCollection format
 */
export function buildQueryObject(params: IDataObject): IDataObject {
	const query: IDataObject = {};

	// Calculations - handle fixedCollection format (calculations.calculation) or direct array
	const calculations = params.calculations as IDataObject | IDataObject[] | undefined;
	if (calculations) {
		let calcArray: IDataObject[];
		if (Array.isArray(calculations)) {
			calcArray = calculations;
		} else if (calculations.calculation && Array.isArray(calculations.calculation)) {
			calcArray = calculations.calculation as IDataObject[];
		} else {
			calcArray = [];
		}
		query.calculations = calcArray.map((calc) => {
			const calculation: IDataObject = { op: calc.op };
			if (calc.column) {
				calculation.column = calc.column;
			}
			return calculation;
		});
	}

	// Breakdowns - handle string or array format
	if (params.breakdowns) {
		if (typeof params.breakdowns === 'string') {
			query.breakdowns = params.breakdowns.split(',').map((b: string) => b.trim()).filter((b: string) => b);
		} else if (Array.isArray(params.breakdowns)) {
			query.breakdowns = params.breakdowns;
		}
	}

	// Filters - handle fixedCollection format or direct array
	const filters = params.filters as IDataObject | IDataObject[] | undefined;
	if (filters) {
		let filterArray: IDataObject[];
		if (Array.isArray(filters)) {
			filterArray = filters;
		} else if (filters.filter && Array.isArray(filters.filter)) {
			filterArray = filters.filter as IDataObject[];
		} else {
			filterArray = [];
		}
		query.filters = filterArray.map((filter) => {
			const f: IDataObject = {
				column: filter.column,
				op: filter.op,
			};
			if (filter.value !== undefined && filter.value !== '') {
				f.value = filter.value;
			}
			return f;
		});
	}

	// Filter combination
	if (params.filterCombination) {
		query.filter_combination = params.filterCombination;
	}

	// Time range - handle relative vs absolute
	if (params.timeRangeType === 'relative' && params.timeRange) {
		query.time_range = params.timeRange;
	} else if (params.timeRange && !params.timeRangeType) {
		// Direct time_range value
		query.time_range = params.timeRange;
	}

	// Start/end time for absolute ranges
	if (params.timeRangeType === 'absolute' || (!params.timeRangeType && params.startTime)) {
		if (params.startTime) {
			query.start_time = params.startTime;
		}
		if (params.endTime) {
			query.end_time = params.endTime;
		}
	}

	// Granularity
	if (params.granularity !== undefined) {
		query.granularity = params.granularity;
	}

	// Orders - handle fixedCollection format or direct array
	const orders = params.orders as IDataObject | IDataObject[] | undefined;
	if (orders) {
		let orderArray: IDataObject[];
		if (Array.isArray(orders)) {
			orderArray = orders;
		} else if (orders.order && Array.isArray(orders.order)) {
			orderArray = orders.order as IDataObject[];
		} else {
			orderArray = [];
		}
		if (orderArray.length > 0) {
			query.orders = orderArray.map((order) => {
				const o: IDataObject = {};
				if (order.column) o.column = order.column;
				if (order.op) o.op = order.op;
				if (order.order) o.order = order.order;
				return o;
			});
		}
	}

	// Limit
	if (params.limit) {
		query.limit = params.limit;
	}

	// Havings - handle fixedCollection format or direct array
	const havings = params.havings as IDataObject | IDataObject[] | undefined;
	if (havings) {
		let havingArray: IDataObject[];
		if (Array.isArray(havings)) {
			havingArray = havings;
		} else if (havings.having && Array.isArray(havings.having)) {
			havingArray = havings.having as IDataObject[];
		} else {
			havingArray = [];
		}
		if (havingArray.length > 0) {
			query.havings = havingArray.map((having) => ({
				calculate_op: having.calculate_op || having.calculateOp,
				column: having.column,
				op: having.op,
				value: typeof having.value === 'string' ? parseFloat(having.value) : having.value,
			}));
		}
	}

	return query;
}

/**
 * Validate dataset slug
 */
export function validateDatasetSlug(slug: string): void {
	if (!slug || slug.trim() === '') {
		throw new Error('Dataset slug is required');
	}
}

/**
 * Simple logging function for licensing notice (called once per load)
 */
let licensingNoticeShown = false;

export function showLicensingNotice(): void {
	if (!licensingNoticeShown) {
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
		licensingNoticeShown = true;
	}
}
