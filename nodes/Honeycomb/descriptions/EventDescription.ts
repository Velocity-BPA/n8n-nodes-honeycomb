/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Send a single event to Honeycomb',
				action: 'Send an event',
			},
			{
				name: 'Send Batch',
				value: 'sendBatch',
				description: 'Send multiple events to Honeycomb',
				action: 'Send batch of events',
			},
		],
		default: 'send',
	},
];

export const eventFields: INodeProperties[] = [
	// Dataset slug for all operations
	{
		displayName: 'Dataset Slug',
		name: 'datasetSlug',
		type: 'string',
		required: true,
		default: '',
		description: 'The slug of the dataset to send events to',
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
	},
	// Event data for send
	{
		displayName: 'Event Data',
		name: 'eventData',
		type: 'json',
		required: true,
		default: '{}',
		description: 'JSON object containing the event data',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send'],
			},
		},
	},
	// Batch events for sendBatch
	{
		displayName: 'Events',
		name: 'events',
		type: 'json',
		required: true,
		default: '[]',
		description: 'JSON array of event objects to send',
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['sendBatch'],
			},
		},
	},
	// Additional options for send
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['event'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Timestamp',
				name: 'time',
				type: 'string',
				default: '',
				description: 'ISO8601 timestamp for the event (defaults to now)',
			},
			{
				displayName: 'Sample Rate',
				name: 'samplerate',
				type: 'number',
				default: 1,
				description: 'Sample rate for the event (1 = 100%, 10 = 10%, etc.)',
			},
		],
	},
];
