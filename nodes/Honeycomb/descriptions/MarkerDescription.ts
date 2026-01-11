/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const markerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['marker'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new marker',
				action: 'Create a marker',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a marker',
				action: 'Delete a marker',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get marker details',
				action: 'Get a marker',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all markers',
				action: 'Get many markers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a marker',
				action: 'Update a marker',
			},
		],
		default: 'getAll',
	},
];

export const markerFields: INodeProperties[] = [
	// Dataset slug for all operations
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The slug of the dataset (use "__all__" for environment-wide markers)',
		displayOptions: {
			show: {
				resource: ['marker'],
			},
		},
	},
	// Marker ID for get, update, delete
	{
		displayName: 'Marker ID',
		name: 'markerId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the marker',
		displayOptions: {
			show: {
				resource: ['marker'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},
	// Type for create (required)
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		required: true,
		default: 'deploy',
		description: 'Type of marker (e.g., deploy, feature_flag, incident)',
		displayOptions: {
			show: {
				resource: ['marker'],
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
				resource: ['marker'],
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
				resource: ['marker'],
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
				resource: ['marker'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'Message for the marker',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Related URL (e.g., PR, deployment link)',
			},
			{
				displayName: 'Start Time',
				name: 'start_time',
				type: 'number',
				default: 0,
				description: 'Unix timestamp for start (defaults to now if not set)',
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'number',
				default: 0,
				description: 'Unix timestamp for end (creates a time range marker)',
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
				resource: ['marker'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'Message for the marker',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Type of marker',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Related URL',
			},
			{
				displayName: 'Start Time',
				name: 'start_time',
				type: 'number',
				default: 0,
				description: 'Unix timestamp for start',
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'number',
				default: 0,
				description: 'Unix timestamp for end',
			},
		],
	},
];
