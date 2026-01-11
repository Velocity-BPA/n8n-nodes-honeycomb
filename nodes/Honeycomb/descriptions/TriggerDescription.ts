/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const triggerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['trigger'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new trigger (alert)',
				action: 'Create a trigger',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a trigger',
				action: 'Delete a trigger',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get trigger details',
				action: 'Get a trigger',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all triggers',
				action: 'Get many triggers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a trigger',
				action: 'Update a trigger',
			},
		],
		default: 'getAll',
	},
];

export const triggerFields: INodeProperties[] = [
	// Dataset slug - required for all operations
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The slug of the dataset',
		displayOptions: {
			show: {
				resource: ['trigger'],
			},
		},
	},
	// Trigger ID for get, update, delete
	{
		displayName: 'Trigger ID',
		name: 'triggerId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the trigger',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},
	// Name for create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name for the trigger',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
	},
	// Threshold for create
	{
		displayName: 'Threshold Operator',
		name: 'thresholdOp',
		type: 'options',
		options: [
			{ name: '>', value: '>' },
			{ name: '>=', value: '>=' },
			{ name: '<', value: '<' },
			{ name: '<=', value: '<=' },
			{ name: '==', value: '==' },
			{ name: '!=', value: '!=' },
		],
		default: '>',
		description: 'Threshold comparison operator',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Threshold Value',
		name: 'thresholdValue',
		type: 'number',
		default: 0,
		description: 'Threshold value for the trigger',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
	},
	// Query specification for create
	{
		displayName: 'Query Specification',
		name: 'querySpec',
		type: 'json',
		default: '{}',
		description: 'JSON query specification for the trigger. Should match Honeycomb query format.',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
	},
	// Return all for getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Create additional fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the trigger',
			},
			{
				displayName: 'Disabled',
				name: 'disabled',
				type: 'boolean',
				default: false,
				description: 'Whether the trigger is disabled',
			},
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'number',
				default: 900,
				description: 'Evaluation frequency in seconds',
			},
			{
				displayName: 'Alert Type',
				name: 'alert_type',
				type: 'options',
				options: [
					{ name: 'On Change', value: 'on_change' },
					{ name: 'On True', value: 'on_true' },
				],
				default: 'on_change',
				description: 'When to fire the trigger',
			},
		],
	},
	// Recipients for create
	{
		displayName: 'Recipients',
		name: 'recipients',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Notification recipients',
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'recipientValues',
				displayName: 'Recipient',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Email', value: 'email' },
							{ name: 'Marker', value: 'marker' },
							{ name: 'MS Teams', value: 'msteams' },
							{ name: 'PagerDuty', value: 'pagerduty' },
							{ name: 'Slack', value: 'slack' },
							{ name: 'Webhook', value: 'webhook' },
						],
						default: 'email',
						description: 'Type of recipient',
					},
					{
						displayName: 'Target',
						name: 'target',
						type: 'string',
						default: '',
						description: 'Target for the notification (email, webhook URL, channel, etc.)',
					},
				],
			},
		],
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['trigger'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the trigger',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the trigger',
			},
			{
				displayName: 'Disabled',
				name: 'disabled',
				type: 'boolean',
				default: false,
				description: 'Whether the trigger is disabled',
			},
			{
				displayName: 'Threshold Operator',
				name: 'thresholdOp',
				type: 'options',
				options: [
					{ name: '>', value: '>' },
					{ name: '>=', value: '>=' },
					{ name: '<', value: '<' },
					{ name: '<=', value: '<=' },
					{ name: '==', value: '==' },
					{ name: '!=', value: '!=' },
				],
				default: '>',
				description: 'Threshold comparison operator',
			},
			{
				displayName: 'Threshold Value',
				name: 'thresholdValue',
				type: 'number',
				default: 0,
				description: 'Threshold value for the trigger',
			},
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'number',
				default: 900,
				description: 'Evaluation frequency in seconds',
			},
			{
				displayName: 'Alert Type',
				name: 'alert_type',
				type: 'options',
				options: [
					{ name: 'On Change', value: 'on_change' },
					{ name: 'On True', value: 'on_true' },
				],
				default: 'on_change',
				description: 'When to fire the trigger',
			},
		],
	},
];
