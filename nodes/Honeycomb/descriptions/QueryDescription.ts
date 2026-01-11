/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const queryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a query specification',
				action: 'Create a query',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a query by ID',
				action: 'Get a query',
			},
			{
				name: 'Create and Run',
				value: 'createResult',
				description: 'Create a query and run it immediately',
				action: 'Create and run a query',
			},
			{
				name: 'Get Result',
				value: 'getResult',
				description: 'Get the result of a query',
				action: 'Get query result',
			},
		],
		default: 'create',
	},
];

export const queryFields: INodeProperties[] = [
	// Dataset Slug - common to all operations
	{
		displayName: 'Dataset',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'Dataset slug or "__all__" for environment-wide queries',
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
	},
	// Query ID - for get and getResult operations
	{
		displayName: 'Query ID',
		name: 'queryId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the query',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['get', 'getResult'],
			},
		},
	},
	// Result ID - for getResult operation
	{
		displayName: 'Result ID',
		name: 'resultId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the query result',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['getResult'],
			},
		},
	},
	// Calculations
	{
		displayName: 'Calculations',
		name: 'calculations',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Aggregation calculations for the query',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
		options: [
			{
				name: 'calculationValues',
				displayName: 'Calculation',
				values: [
					{
						displayName: 'Operation',
						name: 'op',
						type: 'options',
						options: [
							{ name: 'AVG', value: 'AVG' },
							{ name: 'COUNT', value: 'COUNT' },
							{ name: 'COUNT_DISTINCT', value: 'COUNT_DISTINCT' },
							{ name: 'HEATMAP', value: 'HEATMAP' },
							{ name: 'MAX', value: 'MAX' },
							{ name: 'MIN', value: 'MIN' },
							{ name: 'P001', value: 'P001' },
							{ name: 'P01', value: 'P01' },
							{ name: 'P05', value: 'P05' },
							{ name: 'P10', value: 'P10' },
							{ name: 'P25', value: 'P25' },
							{ name: 'P50', value: 'P50' },
							{ name: 'P75', value: 'P75' },
							{ name: 'P90', value: 'P90' },
							{ name: 'P95', value: 'P95' },
							{ name: 'P99', value: 'P99' },
							{ name: 'P999', value: 'P999' },
							{ name: 'RATE_AVG', value: 'RATE_AVG' },
							{ name: 'RATE_MAX', value: 'RATE_MAX' },
							{ name: 'RATE_SUM', value: 'RATE_SUM' },
							{ name: 'SUM', value: 'SUM' },
						],
						default: 'COUNT',
						description: 'The aggregation operation',
					},
					{
						displayName: 'Column',
						name: 'column',
						type: 'string',
						default: '',
						description: 'Column to aggregate (not required for COUNT)',
					},
				],
			},
		],
	},
	// Breakdowns
	{
		displayName: 'Breakdowns',
		name: 'breakdowns',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Fields to group by',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
	},
	// Filters
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Filter conditions for the query',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
		options: [
			{
				name: 'filterValues',
				displayName: 'Filter',
				values: [
					{
						displayName: 'Column',
						name: 'column',
						type: 'string',
						default: '',
						description: 'Column to filter on',
					},
					{
						displayName: 'Operator',
						name: 'op',
						type: 'options',
						options: [
							{ name: '=', value: '=' },
							{ name: '!=', value: '!=' },
							{ name: '>', value: '>' },
							{ name: '>=', value: '>=' },
							{ name: '<', value: '<' },
							{ name: '<=', value: '<=' },
							{ name: 'Contains', value: 'contains' },
							{ name: 'Does Not Contain', value: 'does-not-contain' },
							{ name: 'Does Not End With', value: 'does-not-end-with' },
							{ name: 'Does Not Exist', value: 'does-not-exist' },
							{ name: 'Does Not Start With', value: 'does-not-start-with' },
							{ name: 'Ends With', value: 'ends-with' },
							{ name: 'Exists', value: 'exists' },
							{ name: 'In', value: 'in' },
							{ name: 'Not In', value: 'not-in' },
							{ name: 'Starts With', value: 'starts-with' },
						],
						default: '=',
						description: 'Filter operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Filter value (not required for exists/does-not-exist)',
					},
				],
			},
		],
	},
	// Filter combination
	{
		displayName: 'Filter Combination',
		name: 'filterCombination',
		type: 'options',
		options: [
			{ name: 'AND', value: 'AND' },
			{ name: 'OR', value: 'OR' },
		],
		default: 'AND',
		description: 'How to combine multiple filters',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
	},
	// Time range options
	{
		displayName: 'Time Range Type',
		name: 'timeRangeType',
		type: 'options',
		options: [
			{ name: 'Relative', value: 'relative' },
			{ name: 'Absolute', value: 'absolute' },
		],
		default: 'relative',
		description: 'How to specify the time range',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
	},
	{
		displayName: 'Time Range (Seconds)',
		name: 'timeRange',
		type: 'number',
		default: 7200,
		description: 'Relative time range in seconds (e.g., 7200 = 2 hours)',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
				timeRangeType: ['relative'],
			},
		},
	},
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'number',
		default: 0,
		description: 'Unix timestamp for start of query range',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
				timeRangeType: ['absolute'],
			},
		},
	},
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'number',
		default: 0,
		description: 'Unix timestamp for end of query range',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
				timeRangeType: ['absolute'],
			},
		},
	},
	// Granularity
	{
		displayName: 'Granularity (Seconds)',
		name: 'granularity',
		type: 'number',
		default: 0,
		description: 'Graph resolution in seconds. Set to 0 for automatic.',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
	},
	// Additional Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 1000,
				description: 'Maximum number of results to return',
			},
			{
				displayName: 'Disable Series',
				name: 'disableSeries',
				type: 'boolean',
				default: false,
				description: 'Whether to disable time series data in results',
			},
		],
	},
	// Orders
	{
		displayName: 'Orders',
		name: 'orders',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Sort order for results',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
		options: [
			{
				name: 'orderValues',
				displayName: 'Order',
				values: [
					{
						displayName: 'Column',
						name: 'column',
						type: 'string',
						default: '',
						description: 'Column to order by (for breakdown columns)',
					},
					{
						displayName: 'Operation',
						name: 'op',
						type: 'string',
						default: '',
						description: 'Calculation operation to order by',
					},
					{
						displayName: 'Direction',
						name: 'order',
						type: 'options',
						options: [
							{ name: 'Ascending', value: 'ascending' },
							{ name: 'Descending', value: 'descending' },
						],
						default: 'descending',
						description: 'Sort direction',
					},
				],
			},
		],
	},
	// Havings
	{
		displayName: 'Havings',
		name: 'havings',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Having clause filters (applied after aggregation)',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['create', 'createResult'],
			},
		},
		options: [
			{
				name: 'havingValues',
				displayName: 'Having',
				values: [
					{
						displayName: 'Calculate Operation',
						name: 'calculateOp',
						type: 'string',
						default: 'COUNT',
						description: 'The calculation operation to filter on',
					},
					{
						displayName: 'Column',
						name: 'column',
						type: 'string',
						default: '',
						description: 'Column used in calculation (if applicable)',
					},
					{
						displayName: 'Operator',
						name: 'op',
						type: 'options',
						options: [
							{ name: '>', value: '>' },
							{ name: '>=', value: '>=' },
							{ name: '<', value: '<' },
							{ name: '<=', value: '<=' },
							{ name: '=', value: '=' },
							{ name: '!=', value: '!=' },
						],
						default: '>',
						description: 'Comparison operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number',
						default: 0,
						description: 'Value to compare against',
					},
				],
			},
		],
	},
	// Poll for completion (createResult only)
	{
		displayName: 'Wait for Completion',
		name: 'waitForCompletion',
		type: 'boolean',
		default: true,
		description: 'Whether to wait for query results to complete before returning',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['createResult'],
			},
		},
	},
	{
		displayName: 'Max Wait Time (Seconds)',
		name: 'maxWaitTime',
		type: 'number',
		default: 30,
		description: 'Maximum time to wait for query completion',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['createResult'],
				waitForCompletion: [true],
			},
		},
	},
];
