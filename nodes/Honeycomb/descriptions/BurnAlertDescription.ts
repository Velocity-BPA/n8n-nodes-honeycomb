/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const burnAlertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['burnAlert'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new burn alert',
				action: 'Create a burn alert',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a burn alert',
				action: 'Delete a burn alert',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get burn alert details',
				action: 'Get a burn alert',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all burn alerts for an SLO',
				action: 'Get many burn alerts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a burn alert',
				action: 'Update a burn alert',
			},
		],
		default: 'getAll',
	},
];

export const burnAlertFields: INodeProperties[] = [
	// Dataset slug for all operations
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The slug of the dataset',
		displayOptions: {
			show: {
				resource: ['burnAlert'],
			},
		},
	},
	// SLO ID for all operations
	{
		displayName: 'SLO ID',
		name: 'sloId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the SLO',
		displayOptions: {
			show: {
				resource: ['burnAlert'],
			},
		},
	},
	// Burn Alert ID for get, update, delete
	{
		displayName: 'Burn Alert ID',
		name: 'burnAlertId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the burn alert',
		displayOptions: {
			show: {
				resource: ['burnAlert'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},
	// Exhaustion minutes for create
	{
		displayName: 'Exhaustion Minutes',
		name: 'exhaustionMinutes',
		type: 'number',
		required: true,
		default: 240,
		description: 'Budget exhaustion threshold in minutes (e.g., 240 = alert when budget will exhaust in 4 hours)',
		displayOptions: {
			show: {
				resource: ['burnAlert'],
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
				resource: ['burnAlert'],
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
				resource: ['burnAlert'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
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
				resource: ['burnAlert'],
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
				resource: ['burnAlert'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Exhaustion Minutes',
				name: 'exhaustion_minutes',
				type: 'number',
				default: 240,
				description: 'Budget exhaustion threshold in minutes',
			},
		],
	},
];
