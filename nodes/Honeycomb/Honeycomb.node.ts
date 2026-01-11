/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	honeycombApiRequest,
	honeycombApiRequestAllItems,
	pollQueryResult,
	sendEventBatch,
	buildQueryObject,
	showLicensingNotice,
} from './transport/honeycombClient';

import {
	queryOperations,
	queryFields,
	datasetOperations,
	datasetFields,
	columnOperations,
	columnFields,
	boardOperations,
	boardFields,
	triggerOperations,
	triggerFields,
	sloOperations,
	sloFields,
	burnAlertOperations,
	burnAlertFields,
	markerOperations,
	markerFields,
	markerSettingOperations,
	markerSettingFields,
	environmentOperations,
	environmentFields,
	eventOperations,
	eventFields,
} from './descriptions';

export class Honeycomb implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Honeycomb',
		name: 'honeycomb',
		icon: 'file:honeycomb.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Honeycomb observability platform',
		defaults: {
			name: 'Honeycomb',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'honeycombApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Board', value: 'board' },
					{ name: 'Burn Alert', value: 'burnAlert' },
					{ name: 'Column', value: 'column' },
					{ name: 'Dataset', value: 'dataset' },
					{ name: 'Environment', value: 'environment' },
					{ name: 'Event', value: 'event' },
					{ name: 'Marker', value: 'marker' },
					{ name: 'Marker Setting', value: 'markerSetting' },
					{ name: 'Query', value: 'query' },
					{ name: 'SLO', value: 'slo' },
					{ name: 'Trigger', value: 'trigger' },
				],
				default: 'query',
			},
			...queryOperations,
			...queryFields,
			...datasetOperations,
			...datasetFields,
			...columnOperations,
			...columnFields,
			...boardOperations,
			...boardFields,
			...triggerOperations,
			...triggerFields,
			...sloOperations,
			...sloFields,
			...burnAlertOperations,
			...burnAlertFields,
			...markerOperations,
			...markerFields,
			...markerSettingOperations,
			...markerSettingFields,
			...environmentOperations,
			...environmentFields,
			...eventOperations,
			...eventFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		showLicensingNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// Query operations
				if (resource === 'query') {
					responseData = await executeQueryOperation.call(this, operation, i);
				}
				// Dataset operations
				else if (resource === 'dataset') {
					responseData = await executeDatasetOperation.call(this, operation, i);
				}
				// Column operations
				else if (resource === 'column') {
					responseData = await executeColumnOperation.call(this, operation, i);
				}
				// Board operations
				else if (resource === 'board') {
					responseData = await executeBoardOperation.call(this, operation, i);
				}
				// Trigger operations
				else if (resource === 'trigger') {
					responseData = await executeTriggerOperation.call(this, operation, i);
				}
				// SLO operations
				else if (resource === 'slo') {
					responseData = await executeSloOperation.call(this, operation, i);
				}
				// Burn Alert operations
				else if (resource === 'burnAlert') {
					responseData = await executeBurnAlertOperation.call(this, operation, i);
				}
				// Marker operations
				else if (resource === 'marker') {
					responseData = await executeMarkerOperation.call(this, operation, i);
				}
				// Marker Setting operations
				else if (resource === 'markerSetting') {
					responseData = await executeMarkerSettingOperation.call(this, operation, i);
				}
				// Environment operations
				else if (resource === 'environment') {
					responseData = await executeEnvironmentOperation.call(this, operation, i);
				}
				// Event operations
				else if (resource === 'event') {
					responseData = await executeEventOperation.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex: i,
					});
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// Query operations
async function executeQueryOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;

	if (operation === 'create') {
		const calculations = this.getNodeParameter('calculations.calculationValues', itemIndex, []) as IDataObject[];
		const breakdowns = this.getNodeParameter('breakdowns', itemIndex, []) as string[];
		const filters = this.getNodeParameter('filters.filterValues', itemIndex, []) as IDataObject[];
		const filterCombination = this.getNodeParameter('filterCombination', itemIndex, 'AND') as string;
		const timeRangeType = this.getNodeParameter('timeRangeType', itemIndex, 'relative') as string;
		const granularity = this.getNodeParameter('granularity', itemIndex, 0) as number;
		const orders = this.getNodeParameter('orders.orderValues', itemIndex, []) as IDataObject[];
		const havings = this.getNodeParameter('havings.havingValues', itemIndex, []) as IDataObject[];
		const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as IDataObject;

		const queryParams: IDataObject = {
			calculations,
			breakdowns,
			filters,
			filterCombination,
			orders,
			havings,
		};

		if (timeRangeType === 'relative') {
			queryParams.timeRange = this.getNodeParameter('timeRange', itemIndex, 7200) as number;
		} else {
			queryParams.startTime = this.getNodeParameter('startTime', itemIndex, 0) as number;
			queryParams.endTime = this.getNodeParameter('endTime', itemIndex, 0) as number;
		}

		if (granularity > 0) {
			queryParams.granularity = granularity;
		}

		if (additionalOptions.limit) {
			queryParams.limit = additionalOptions.limit;
		}

		const query = buildQueryObject(queryParams);
		return await honeycombApiRequest.call(this, 'POST', `/queries/${datasetSlug}`, query) as IDataObject;
	}

	if (operation === 'get') {
		const queryId = this.getNodeParameter('queryId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/queries/${datasetSlug}/${queryId}`) as IDataObject;
	}

	if (operation === 'createResult') {
		const calculations = this.getNodeParameter('calculations.calculationValues', itemIndex, []) as IDataObject[];
		const breakdowns = this.getNodeParameter('breakdowns', itemIndex, []) as string[];
		const filters = this.getNodeParameter('filters.filterValues', itemIndex, []) as IDataObject[];
		const filterCombination = this.getNodeParameter('filterCombination', itemIndex, 'AND') as string;
		const timeRangeType = this.getNodeParameter('timeRangeType', itemIndex, 'relative') as string;
		const granularity = this.getNodeParameter('granularity', itemIndex, 0) as number;
		const orders = this.getNodeParameter('orders.orderValues', itemIndex, []) as IDataObject[];
		const havings = this.getNodeParameter('havings.havingValues', itemIndex, []) as IDataObject[];
		const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as IDataObject;
		const waitForCompletion = this.getNodeParameter('waitForCompletion', itemIndex, true) as boolean;

		const queryParams: IDataObject = {
			calculations,
			breakdowns,
			filters,
			filterCombination,
			orders,
			havings,
		};

		if (timeRangeType === 'relative') {
			queryParams.timeRange = this.getNodeParameter('timeRange', itemIndex, 7200) as number;
		} else {
			queryParams.startTime = this.getNodeParameter('startTime', itemIndex, 0) as number;
			queryParams.endTime = this.getNodeParameter('endTime', itemIndex, 0) as number;
		}

		if (granularity > 0) {
			queryParams.granularity = granularity;
		}

		if (additionalOptions.limit) {
			queryParams.limit = additionalOptions.limit;
		}

		const query = buildQueryObject(queryParams);
		const body: IDataObject = { query };

		if (additionalOptions.disableSeries) {
			body.disable_series = true;
		}

		const result = await honeycombApiRequest.call(this, 'POST', `/query_results/${datasetSlug}`, body) as IDataObject;

		if (waitForCompletion && result.id) {
			const maxWaitTime = this.getNodeParameter('maxWaitTime', itemIndex, 30) as number;
			return await pollQueryResult.call(this, datasetSlug, result.id as string, maxWaitTime);
		}

		return result;
	}

	if (operation === 'getResult') {
		const queryId = this.getNodeParameter('queryId', itemIndex) as string;
		const resultId = this.getNodeParameter('resultId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/query_results/${datasetSlug}/${resultId}?query_id=${queryId}`) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown query operation: ${operation}`, { itemIndex });
}

// Dataset operations
async function executeDatasetOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { name, ...additionalFields };
		return await honeycombApiRequest.call(this, 'POST', '/datasets', body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', '/datasets');
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const datasets = await honeycombApiRequestAllItems.call(this, 'GET', '/datasets');
		return datasets.slice(0, limit);
	}

	if (operation === 'get') {
		const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/datasets/${datasetSlug}`) as IDataObject;
	}

	if (operation === 'update') {
		const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		return await honeycombApiRequest.call(this, 'PUT', `/datasets/${datasetSlug}`, updateFields) as IDataObject;
	}

	if (operation === 'delete') {
		const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/datasets/${datasetSlug}`);
		return { success: true };
	}

	throw new NodeOperationError(this.getNode(), `Unknown dataset operation: ${operation}`, { itemIndex });
}

// Column operations
async function executeColumnOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;

	if (operation === 'create') {
		const keyName = this.getNodeParameter('keyName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { key_name: keyName, ...additionalFields };
		return await honeycombApiRequest.call(this, 'POST', `/columns/${datasetSlug}`, body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', `/columns/${datasetSlug}`);
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const columns = await honeycombApiRequestAllItems.call(this, 'GET', `/columns/${datasetSlug}`);
		return columns.slice(0, limit);
	}

	if (operation === 'get') {
		const keyName = this.getNodeParameter('keyName', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/columns/${datasetSlug}/${keyName}`) as IDataObject;
	}

	if (operation === 'update') {
		const keyName = this.getNodeParameter('keyName', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		return await honeycombApiRequest.call(this, 'PUT', `/columns/${datasetSlug}/${keyName}`, updateFields) as IDataObject;
	}

	if (operation === 'delete') {
		const keyName = this.getNodeParameter('keyName', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/columns/${datasetSlug}/${keyName}`);
		return { success: true };
	}

	throw new NodeOperationError(this.getNode(), `Unknown column operation: ${operation}`, { itemIndex });
}

// Board operations
async function executeBoardOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { name, ...additionalFields };
		return await honeycombApiRequest.call(this, 'POST', '/boards', body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', '/boards');
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const boards = await honeycombApiRequestAllItems.call(this, 'GET', '/boards');
		return boards.slice(0, limit);
	}

	if (operation === 'get') {
		const boardId = this.getNodeParameter('boardId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/boards/${boardId}`) as IDataObject;
	}

	if (operation === 'update') {
		const boardId = this.getNodeParameter('boardId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		return await honeycombApiRequest.call(this, 'PUT', `/boards/${boardId}`, updateFields) as IDataObject;
	}

	if (operation === 'delete') {
		const boardId = this.getNodeParameter('boardId', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/boards/${boardId}`);
		return { success: true };
	}

	if (operation === 'addQuery') {
		const boardId = this.getNodeParameter('boardId', itemIndex) as string;
		const queryId = this.getNodeParameter('queryId', itemIndex) as string;
		const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;
		const queryOptions = this.getNodeParameter('queryOptions', itemIndex, {}) as IDataObject;

		// First get the current board
		const board = await honeycombApiRequest.call(this, 'GET', `/boards/${boardId}`) as IDataObject;

		// Add the new query
		const queries = (board.queries as IDataObject[]) || [];
		queries.push({
			query_id: queryId,
			dataset: datasetSlug,
			...queryOptions,
		});

		return await honeycombApiRequest.call(this, 'PUT', `/boards/${boardId}`, { queries }) as IDataObject;
	}

	if (operation === 'removeQuery') {
		const boardId = this.getNodeParameter('boardId', itemIndex) as string;
		const queryAnnotationId = this.getNodeParameter('queryAnnotationId', itemIndex) as string;

		// Get the current board
		const board = await honeycombApiRequest.call(this, 'GET', `/boards/${boardId}`) as IDataObject;

		// Filter out the query
		const queries = ((board.queries as IDataObject[]) || []).filter(
			(q) => q.query_annotation_id !== queryAnnotationId,
		);

		return await honeycombApiRequest.call(this, 'PUT', `/boards/${boardId}`, { queries }) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown board operation: ${operation}`, { itemIndex });
}

// Trigger operations
async function executeTriggerOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;

	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const thresholdOp = this.getNodeParameter('thresholdOp', itemIndex) as string;
		const thresholdValue = this.getNodeParameter('thresholdValue', itemIndex) as number;
		const querySpec = this.getNodeParameter('querySpec', itemIndex, '{}') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
		const recipients = this.getNodeParameter('recipients.recipientValues', itemIndex, []) as IDataObject[];

		let query: IDataObject;
		try {
			query = JSON.parse(querySpec);
		} catch {
			throw new NodeOperationError(this.getNode(), 'Invalid JSON in Query Specification', { itemIndex });
		}

		const body: IDataObject = {
			name,
			query,
			threshold: { op: thresholdOp, value: thresholdValue },
			...additionalFields,
		};

		if (recipients.length > 0) {
			body.recipients = recipients;
		}

		return await honeycombApiRequest.call(this, 'POST', `/triggers/${datasetSlug}`, body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', `/triggers/${datasetSlug}`);
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const triggers = await honeycombApiRequestAllItems.call(this, 'GET', `/triggers/${datasetSlug}`);
		return triggers.slice(0, limit);
	}

	if (operation === 'get') {
		const triggerId = this.getNodeParameter('triggerId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/triggers/${datasetSlug}/${triggerId}`) as IDataObject;
	}

	if (operation === 'update') {
		const triggerId = this.getNodeParameter('triggerId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { ...updateFields };

		if (updateFields.thresholdOp || updateFields.thresholdValue) {
			body.threshold = {
				op: updateFields.thresholdOp,
				value: updateFields.thresholdValue,
			};
			delete body.thresholdOp;
			delete body.thresholdValue;
		}

		return await honeycombApiRequest.call(this, 'PUT', `/triggers/${datasetSlug}/${triggerId}`, body) as IDataObject;
	}

	if (operation === 'delete') {
		const triggerId = this.getNodeParameter('triggerId', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/triggers/${datasetSlug}/${triggerId}`);
		return { success: true };
	}

	throw new NodeOperationError(this.getNode(), `Unknown trigger operation: ${operation}`, { itemIndex });
}

// SLO operations
async function executeSloOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;

	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const sliAlias = this.getNodeParameter('sliAlias', itemIndex) as string;
		const targetPercentage = this.getNodeParameter('targetPercentage', itemIndex) as number;
		const timePeriodDays = this.getNodeParameter('timePeriodDays', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		// Convert percentage to per million (e.g., 99.9% = 999000)
		const targetPerMillion = Math.round(targetPercentage * 10000);

		const body: IDataObject = {
			name,
			sli: { alias: sliAlias },
			target_per_million: targetPerMillion,
			time_period_days: timePeriodDays,
			...additionalFields,
		};

		return await honeycombApiRequest.call(this, 'POST', `/slos/${datasetSlug}`, body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', `/slos/${datasetSlug}`);
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const slos = await honeycombApiRequestAllItems.call(this, 'GET', `/slos/${datasetSlug}`);
		return slos.slice(0, limit);
	}

	if (operation === 'get') {
		const sloId = this.getNodeParameter('sloId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/slos/${datasetSlug}/${sloId}`) as IDataObject;
	}

	if (operation === 'update') {
		const sloId = this.getNodeParameter('sloId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { ...updateFields };

		if (updateFields.sliAlias) {
			body.sli = { alias: updateFields.sliAlias };
			delete body.sliAlias;
		}

		if (updateFields.targetPercentage) {
			body.target_per_million = Math.round((updateFields.targetPercentage as number) * 10000);
			delete body.targetPercentage;
		}

		if (updateFields.timePeriodDays) {
			body.time_period_days = updateFields.timePeriodDays;
			delete body.timePeriodDays;
		}

		return await honeycombApiRequest.call(this, 'PUT', `/slos/${datasetSlug}/${sloId}`, body) as IDataObject;
	}

	if (operation === 'delete') {
		const sloId = this.getNodeParameter('sloId', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/slos/${datasetSlug}/${sloId}`);
		return { success: true };
	}

	if (operation === 'getHistory') {
		const sloId = this.getNodeParameter('sloId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/slos/${datasetSlug}/${sloId}/history`) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown SLO operation: ${operation}`, { itemIndex });
}

// Burn Alert operations
async function executeBurnAlertOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;
	const sloId = this.getNodeParameter('sloId', itemIndex) as string;

	if (operation === 'create') {
		const exhaustionMinutes = this.getNodeParameter('exhaustionMinutes', itemIndex) as number;
		const recipients = this.getNodeParameter('recipients.recipientValues', itemIndex, []) as IDataObject[];

		const body: IDataObject = {
			exhaustion_minutes: exhaustionMinutes,
		};

		if (recipients.length > 0) {
			body.recipients = recipients;
		}

		return await honeycombApiRequest.call(this, 'POST', `/slos/${datasetSlug}/${sloId}/burn_alerts`, body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', `/slos/${datasetSlug}/${sloId}/burn_alerts`);
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const alerts = await honeycombApiRequestAllItems.call(this, 'GET', `/slos/${datasetSlug}/${sloId}/burn_alerts`);
		return alerts.slice(0, limit);
	}

	if (operation === 'get') {
		const burnAlertId = this.getNodeParameter('burnAlertId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/slos/${datasetSlug}/${sloId}/burn_alerts/${burnAlertId}`) as IDataObject;
	}

	if (operation === 'update') {
		const burnAlertId = this.getNodeParameter('burnAlertId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		return await honeycombApiRequest.call(this, 'PUT', `/slos/${datasetSlug}/${sloId}/burn_alerts/${burnAlertId}`, updateFields) as IDataObject;
	}

	if (operation === 'delete') {
		const burnAlertId = this.getNodeParameter('burnAlertId', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/slos/${datasetSlug}/${sloId}/burn_alerts/${burnAlertId}`);
		return { success: true };
	}

	throw new NodeOperationError(this.getNode(), `Unknown burn alert operation: ${operation}`, { itemIndex });
}

// Marker operations
async function executeMarkerOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;

	if (operation === 'create') {
		const type = this.getNodeParameter('type', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { type, ...additionalFields };

		// Remove empty values
		Object.keys(body).forEach((key) => {
			if (body[key] === '' || body[key] === 0) {
				delete body[key];
			}
		});

		return await honeycombApiRequest.call(this, 'POST', `/markers/${datasetSlug}`, body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', `/markers/${datasetSlug}`);
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const markers = await honeycombApiRequestAllItems.call(this, 'GET', `/markers/${datasetSlug}`);
		return markers.slice(0, limit);
	}

	if (operation === 'get') {
		const markerId = this.getNodeParameter('markerId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/markers/${datasetSlug}/${markerId}`) as IDataObject;
	}

	if (operation === 'update') {
		const markerId = this.getNodeParameter('markerId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		// Remove empty values
		Object.keys(updateFields).forEach((key) => {
			if (updateFields[key] === '' || updateFields[key] === 0) {
				delete updateFields[key];
			}
		});

		return await honeycombApiRequest.call(this, 'PUT', `/markers/${datasetSlug}/${markerId}`, updateFields) as IDataObject;
	}

	if (operation === 'delete') {
		const markerId = this.getNodeParameter('markerId', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/markers/${datasetSlug}/${markerId}`);
		return { success: true };
	}

	throw new NodeOperationError(this.getNode(), `Unknown marker operation: ${operation}`, { itemIndex });
}

// Marker Setting operations
async function executeMarkerSettingOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;

	if (operation === 'create') {
		const type = this.getNodeParameter('type', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { type, ...additionalFields };
		return await honeycombApiRequest.call(this, 'POST', `/marker_settings/${datasetSlug}`, body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', `/marker_settings/${datasetSlug}`);
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const settings = await honeycombApiRequestAllItems.call(this, 'GET', `/marker_settings/${datasetSlug}`);
		return settings.slice(0, limit);
	}

	if (operation === 'get') {
		const markerSettingId = this.getNodeParameter('markerSettingId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/marker_settings/${datasetSlug}/${markerSettingId}`) as IDataObject;
	}

	if (operation === 'update') {
		const markerSettingId = this.getNodeParameter('markerSettingId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		return await honeycombApiRequest.call(this, 'PUT', `/marker_settings/${datasetSlug}/${markerSettingId}`, updateFields) as IDataObject;
	}

	if (operation === 'delete') {
		const markerSettingId = this.getNodeParameter('markerSettingId', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/marker_settings/${datasetSlug}/${markerSettingId}`);
		return { success: true };
	}

	throw new NodeOperationError(this.getNode(), `Unknown marker setting operation: ${operation}`, { itemIndex });
}

// Environment operations
async function executeEnvironmentOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { name, ...additionalFields };
		return await honeycombApiRequest.call(this, 'POST', '/environments', body) as IDataObject;
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			return await honeycombApiRequestAllItems.call(this, 'GET', '/environments');
		}

		const limit = this.getNodeParameter('limit', itemIndex) as number;
		const environments = await honeycombApiRequestAllItems.call(this, 'GET', '/environments');
		return environments.slice(0, limit);
	}

	if (operation === 'get') {
		const environmentId = this.getNodeParameter('environmentId', itemIndex) as string;
		return await honeycombApiRequest.call(this, 'GET', `/environments/${environmentId}`) as IDataObject;
	}

	if (operation === 'update') {
		const environmentId = this.getNodeParameter('environmentId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		return await honeycombApiRequest.call(this, 'PUT', `/environments/${environmentId}`, updateFields) as IDataObject;
	}

	if (operation === 'delete') {
		const environmentId = this.getNodeParameter('environmentId', itemIndex) as string;
		await honeycombApiRequest.call(this, 'DELETE', `/environments/${environmentId}`);
		return { success: true };
	}

	throw new NodeOperationError(this.getNode(), `Unknown environment operation: ${operation}`, { itemIndex });
}

// Event operations
async function executeEventOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const datasetSlug = this.getNodeParameter('datasetSlug', itemIndex) as string;

	if (operation === 'send') {
		const eventDataStr = this.getNodeParameter('eventData', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

		let eventData: IDataObject;
		try {
			eventData = JSON.parse(eventDataStr);
		} catch {
			throw new NodeOperationError(this.getNode(), 'Invalid JSON in Event Data', { itemIndex });
		}

		const body: IDataObject = { data: eventData };

		if (options.time) {
			body.time = options.time;
		}
		if (options.samplerate) {
			body.samplerate = options.samplerate;
		}

		return await honeycombApiRequest.call(this, 'POST', `/events/${datasetSlug}`, body) as IDataObject;
	}

	if (operation === 'sendBatch') {
		const eventsStr = this.getNodeParameter('events', itemIndex) as string;

		let events: IDataObject[];
		try {
			events = JSON.parse(eventsStr);
		} catch {
			throw new NodeOperationError(this.getNode(), 'Invalid JSON in Events', { itemIndex });
		}

		if (!Array.isArray(events)) {
			throw new NodeOperationError(this.getNode(), 'Events must be an array', { itemIndex });
		}

		const results = await sendEventBatch.call(this, datasetSlug, events);
		return { results };
	}

	throw new NodeOperationError(this.getNode(), `Unknown event operation: ${operation}`, { itemIndex });
}
