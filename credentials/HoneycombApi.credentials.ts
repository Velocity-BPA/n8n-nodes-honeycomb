/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HoneycombApi implements ICredentialType {
	name = 'honeycombApi';
	displayName = 'Honeycomb API';
	documentationUrl = 'https://docs.honeycomb.io/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Honeycomb API Key. Obtain from Team Settings > API Keys in Honeycomb.',
		},
		{
			displayName: 'Key Type',
			name: 'keyType',
			type: 'options',
			options: [
				{
					name: 'Configuration',
					value: 'configuration',
					description: 'For managing settings, queries, triggers, SLOs, etc.',
				},
				{
					name: 'Ingest',
					value: 'ingest',
					description: 'For sending events to Honeycomb',
				},
				{
					name: 'Query',
					value: 'query',
					description: 'For running queries only',
				},
			],
			default: 'configuration',
			required: true,
			description: 'The type of API key determines what operations are permitted',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'string',
			default: '',
			description: 'Optional environment slug for environment-scoped operations. Leave empty for classic Honeycomb.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Honeycomb-Team': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.honeycomb.io',
			url: '/1/auth',
			method: 'GET',
		},
	};
}
