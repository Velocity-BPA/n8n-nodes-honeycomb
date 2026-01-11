/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const sloOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['slo'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new SLO',
				action: 'Create an SLO',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an SLO',
				action: 'Delete an SLO',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get SLO details',
				action: 'Get an SLO',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				description: 'Get SLO history data',
				action: 'Get SLO history',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all SLOs',
				action: 'Get many SLOs',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an SLO',
				action: 'Update an SLO',
			},
		],
		default: 'getAll',
	},
];

export const sloFields: INodeProperties[] = [
	// Dataset slug for all operations
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The slug of the dataset for the SLO',
		displayOptions: {
			show: {
				resource: ['slo'],
			},
		},
	},
	// SLO ID for get, update, delete, getHistory
	{
		displayName: 'SLO ID',
		name: 'sloId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the SLO',
		displayOptions: {
			show: {
				resource: ['slo'],
				operation: ['get', 'update', 'delete', 'getHistory'],
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
		description: 'Name for the SLO',
		displayOptions: {
			show: {
				resource: ['slo'],
				operation: ['create'],
			},
		},
	},
	// SLI Alias for create
	{
		displayName: 'SLI Alias',
		name: 'sliAlias',
		type: 'string',
		required: true,
		default: '',
		description: 'The derived column alias representing the SLI',
		displayOptions: {
			show: {
				resource: ['slo'],
				operation: ['create'],
			},
		},
	},
	// Target for create
	{
		displayName: 'Target Percentage',
		name: 'targetPercentage',
		type: 'number',
		required: true,
		default: 99.9,
		description: 'Target percentage (e.g., 99.9 for 99.9%)',
		typeOptions: {
			minValue: 0,
			maxValue: 100,
			numberPrecision: 3,
		},
		displayOptions: {
			show: {
				resource: ['slo'],
				operation: ['create'],
			},
		},
	},
	// Time period for create
	{
		displayName: 'Time Period (Days)',
		name: 'timePeriodDays',
		type: 'options',
		options: [
			{ name: '7 Days', value: 7 },
			{ name: '14 Days', value: 14 },
			{ name: '30 Days', value: 30 },
		],
		default: 30,
		description: 'SLO window in days',
		displayOptions: {
			show: {
				resource: ['slo'],
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
				resource: ['slo'],
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
				resource: ['slo'],
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
				resource: ['slo'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the SLO',
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
				resource: ['slo'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the SLO',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the SLO',
			},
			{
				displayName: 'SLI Alias',
				name: 'sliAlias',
				type: 'string',
				default: '',
				description: 'The derived column alias representing the SLI',
			},
			{
				displayName: 'Target Percentage',
				name: 'targetPercentage',
				type: 'number',
				default: 99.9,
				description: 'Target percentage (e.g., 99.9 for 99.9%)',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
					numberPrecision: 3,
				},
			},
			{
				displayName: 'Time Period (Days)',
				name: 'timePeriodDays',
				type: 'options',
				options: [
					{ name: '7 Days', value: 7 },
					{ name: '14 Days', value: 14 },
					{ name: '30 Days', value: 30 },
				],
				default: 30,
				description: 'SLO window in days',
			},
		],
	},
];
