/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { showLicensingNotice } from './transport/honeycombClient';

export class HoneycombTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Honeycomb Trigger',
		name: 'honeycombTrigger',
		icon: 'file:honeycomb.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts a workflow when a Honeycomb trigger fires',
		defaults: {
			name: 'Honeycomb Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'All Events',
						value: 'all',
						description: 'Trigger on any Honeycomb webhook event',
					},
					{
						name: 'Trigger Fired',
						value: 'triggered',
						description: 'When a trigger threshold is breached',
					},
					{
						name: 'Trigger Resolved',
						value: 'resolved',
						description: 'When a trigger returns to normal',
					},
				],
				default: 'all',
				description: 'The event type to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Filter by Trigger Name',
						name: 'triggerName',
						type: 'string',
						default: '',
						description: 'Only process webhooks from triggers with this name (leave empty for all)',
					},
					{
						displayName: 'Filter by Trigger ID',
						name: 'triggerId',
						type: 'string',
						default: '',
						description: 'Only process webhooks from this specific trigger ID (leave empty for all)',
					},
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		showLicensingNotice();

		const event = this.getNodeParameter('event') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		const req = this.getRequestObject();
		const body = req.body as IDataObject;

		// Validate that this is a Honeycomb webhook
		if (!body.name && !body.id) {
			// Not a valid Honeycomb webhook payload
			return {
				webhookResponse: { status: 'ok', message: 'Not a Honeycomb webhook' },
			};
		}

		// Filter by event type
		const webhookStatus = body.status as string;
		if (event !== 'all') {
			if (event === 'triggered' && webhookStatus !== 'triggered') {
				return {
					webhookResponse: { status: 'ok', message: 'Event type filtered' },
				};
			}
			if (event === 'resolved' && webhookStatus !== 'resolved') {
				return {
					webhookResponse: { status: 'ok', message: 'Event type filtered' },
				};
			}
		}

		// Filter by trigger name
		if (options.triggerName && body.name !== options.triggerName) {
			return {
				webhookResponse: { status: 'ok', message: 'Trigger name filtered' },
			};
		}

		// Filter by trigger ID
		if (options.triggerId && body.id !== options.triggerId) {
			return {
				webhookResponse: { status: 'ok', message: 'Trigger ID filtered' },
			};
		}

		// Process the webhook
		const responseData: IDataObject = {
			triggerName: body.name,
			triggerId: body.id,
			status: body.status,
			triggerUrl: body.trigger_url,
			resultUrl: body.result_url,
			summary: body.summary,
			description: body.description,
			timestamp: body.timestamp || new Date().toISOString(),
			version: body.version,
			resultGroups: body.result_groups || [],
		};

		return {
			workflowData: [this.helpers.returnJsonArray(responseData)],
		};
	}
}
