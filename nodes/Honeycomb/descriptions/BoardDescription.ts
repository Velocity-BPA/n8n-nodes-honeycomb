/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const boardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['board'],
			},
		},
		options: [
			{
				name: 'Add Query',
				value: 'addQuery',
				description: 'Add a query to a board',
				action: 'Add query to board',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new board',
				action: 'Create a board',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a board',
				action: 'Delete a board',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get board details',
				action: 'Get a board',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all boards',
				action: 'Get many boards',
			},
			{
				name: 'Remove Query',
				value: 'removeQuery',
				description: 'Remove a query from a board',
				action: 'Remove query from board',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a board',
				action: 'Update a board',
			},
		],
		default: 'getAll',
	},
];

export const boardFields: INodeProperties[] = [
	// Board ID for get, update, delete, addQuery, removeQuery
	{
		displayName: 'Board ID',
		name: 'boardId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the board',
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['get', 'update', 'delete', 'addQuery', 'removeQuery'],
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
		description: 'Name for the board',
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['create'],
			},
		},
	},
	// Query ID for addQuery
	{
		displayName: 'Query ID',
		name: 'queryId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the query to add',
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['addQuery'],
			},
		},
	},
	// Dataset for addQuery
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The dataset slug for the query',
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['addQuery'],
			},
		},
	},
	// Query Annotation ID for removeQuery
	{
		displayName: 'Query Annotation ID',
		name: 'queryAnnotationId',
		type: 'string',
		required: true,
		default: '',
		description: 'The query annotation ID to remove from the board',
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['removeQuery'],
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
				resource: ['board'],
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
				resource: ['board'],
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
				resource: ['board'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the board',
			},
			{
				displayName: 'Style',
				name: 'style',
				type: 'options',
				options: [
					{ name: 'Visual', value: 'visual' },
					{ name: 'List', value: 'list' },
				],
				default: 'visual',
				description: 'Display style for the board',
			},
			{
				displayName: 'Column Layout',
				name: 'column_layout',
				type: 'options',
				options: [
					{ name: 'Multi', value: 'multi' },
					{ name: 'Single', value: 'single' },
				],
				default: 'multi',
				description: 'Column layout for the board',
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
				resource: ['board'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the board',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the board',
			},
			{
				displayName: 'Style',
				name: 'style',
				type: 'options',
				options: [
					{ name: 'Visual', value: 'visual' },
					{ name: 'List', value: 'list' },
				],
				default: 'visual',
				description: 'Display style for the board',
			},
			{
				displayName: 'Column Layout',
				name: 'column_layout',
				type: 'options',
				options: [
					{ name: 'Multi', value: 'multi' },
					{ name: 'Single', value: 'single' },
				],
				default: 'multi',
				description: 'Column layout for the board',
			},
		],
	},
	// Add query additional options
	{
		displayName: 'Query Options',
		name: 'queryOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['board'],
				operation: ['addQuery'],
			},
		},
		options: [
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',
				description: 'Caption for the query on the board',
			},
			{
				displayName: 'Query Style',
				name: 'query_style',
				type: 'options',
				options: [
					{ name: 'Graph', value: 'graph' },
					{ name: 'Table', value: 'table' },
					{ name: 'Combo', value: 'combo' },
				],
				default: 'graph',
				description: 'Display style for the query',
			},
		],
	},
];
