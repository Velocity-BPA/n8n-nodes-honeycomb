/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const markerSettingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['markerSetting'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create new marker settings',
				action: 'Create marker settings',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete marker settings',
				action: 'Delete marker settings',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get marker settings details',
				action: 'Get marker settings',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all marker settings',
				action: 'Get many marker settings',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update marker settings',
				action: 'Update marker settings',
			},
		],
		default: 'getAll',
	},
];

export const markerSettingFields: INodeProperties[] = [
	// Dataset slug for all operations
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The slug of the dataset (use "__all__" for environment-wide settings)',
		displayOptions: {
			show: {
				resource: ['markerSetting'],
			},
		},
	},
	// Marker Setting ID for get, update, delete
	{
		displayName: 'Marker Setting ID',
		name: 'markerSettingId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the marker setting',
		displayOptions: {
			show: {
				resource: ['markerSetting'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},
	// Type for create
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		required: true,
		default: 'deploy',
		description: 'Type of marker (e.g., deploy, feature_flag, incident)',
		displayOptions: {
			show: {
				resource: ['markerSetting'],
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
				resource: ['markerSetting'],
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
				resource: ['markerSetting'],
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
				resource: ['markerSetting'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '#3388FF',
				description: 'Color for the marker type (hex format)',
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
				resource: ['markerSetting'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '#3388FF',
				description: 'Color for the marker type (hex format)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Type of marker',
			},
		],
	},
];
