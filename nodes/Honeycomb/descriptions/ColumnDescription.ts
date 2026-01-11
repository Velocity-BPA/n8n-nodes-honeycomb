/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const columnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['column'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new column',
				action: 'Create a column',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a column',
				action: 'Delete a column',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get column details',
				action: 'Get a column',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all columns in a dataset',
				action: 'Get many columns',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update column metadata',
				action: 'Update a column',
			},
		],
		default: 'getAll',
	},
];

export const columnFields: INodeProperties[] = [
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
				resource: ['column'],
			},
		},
	},
	// Key name for create
	{
		displayName: 'Key Name',
		name: 'keyName',
		type: 'string',
		required: true,
		default: '',
		description: 'The key name for the column',
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create', 'get', 'update', 'delete'],
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
				resource: ['column'],
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
				resource: ['column'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Create/Update fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Alias',
				name: 'alias',
				type: 'string',
				default: '',
				description: 'Display alias for the column',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the column',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Boolean', value: 'boolean' },
					{ name: 'Float', value: 'float' },
					{ name: 'Integer', value: 'integer' },
					{ name: 'String', value: 'string' },
				],
				default: 'string',
				description: 'Data type of the column',
			},
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether to hide this column from the UI',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['column'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Alias',
				name: 'alias',
				type: 'string',
				default: '',
				description: 'Display alias for the column',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the column',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Boolean', value: 'boolean' },
					{ name: 'Float', value: 'float' },
					{ name: 'Integer', value: 'integer' },
					{ name: 'String', value: 'string' },
				],
				default: 'string',
				description: 'Data type of the column',
			},
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether to hide this column from the UI',
			},
		],
	},
];
