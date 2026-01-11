/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const datasetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dataset'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new dataset',
				action: 'Create a dataset',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a dataset',
				action: 'Delete a dataset',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get dataset details',
				action: 'Get a dataset',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all datasets',
				action: 'Get many datasets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update dataset settings',
				action: 'Update a dataset',
			},
		],
		default: 'getAll',
	},
];

export const datasetFields: INodeProperties[] = [
	// Dataset name for create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name for the new dataset',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['create'],
			},
		},
	},
	// Dataset slug for get, update, delete
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The slug of the dataset',
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['get', 'update', 'delete'],
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
				resource: ['dataset'],
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
				resource: ['dataset'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	// Create options
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['dataset'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the dataset',
			},
			{
				displayName: 'Expand JSON Depth',
				name: 'expand_json_depth',
				type: 'number',
				default: 0,
				description: 'Depth to expand nested JSON fields',
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
				resource: ['dataset'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the dataset',
			},
			{
				displayName: 'Expand JSON Depth',
				name: 'expand_json_depth',
				type: 'number',
				default: 0,
				description: 'Depth to expand nested JSON fields',
			},
			{
				displayName: 'Delete Protected',
				name: 'delete_protected',
				type: 'boolean',
				default: false,
				description: 'Whether to protect the dataset from deletion',
			},
		],
	},
];
