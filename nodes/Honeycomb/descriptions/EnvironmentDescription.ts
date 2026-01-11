/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const environmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['environment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new environment',
				action: 'Create an environment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an environment',
				action: 'Delete an environment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get environment details',
				action: 'Get an environment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all environments',
				action: 'Get many environments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an environment',
				action: 'Update an environment',
			},
		],
		default: 'getAll',
	},
];

export const environmentFields: INodeProperties[] = [
	// Environment ID for get, update, delete
	{
		displayName: 'Environment ID',
		name: 'environmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the environment',
		displayOptions: {
			show: {
				resource: ['environment'],
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
		description: 'Name for the environment',
		displayOptions: {
			show: {
				resource: ['environment'],
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
				resource: ['environment'],
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
				resource: ['environment'],
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
				resource: ['environment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the environment',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '',
				description: 'Color for the environment (hex format)',
			},
			{
				displayName: 'Delete Protected',
				name: 'delete_protected',
				type: 'boolean',
				default: false,
				description: 'Whether to protect the environment from deletion',
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
				resource: ['environment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the environment',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the environment',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '',
				description: 'Color for the environment (hex format)',
			},
			{
				displayName: 'Delete Protected',
				name: 'delete_protected',
				type: 'boolean',
				default: false,
				description: 'Whether to protect the environment from deletion',
			},
		],
	},
];
