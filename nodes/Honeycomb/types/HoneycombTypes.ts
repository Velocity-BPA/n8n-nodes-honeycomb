/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// Query types
export interface IHoneycombQueryCalculation {
	op: string;
	column?: string;
}

export interface IHoneycombQueryFilter {
	column: string;
	op: string;
	value?: string | number | boolean;
}

export interface IHoneycombQueryOrder {
	column?: string;
	op?: string;
	order?: 'ascending' | 'descending';
}

export interface IHoneycombQueryHaving {
	calculate_op: string;
	column?: string;
	op: string;
	value: number;
}

export interface IHoneycombQuery {
	calculations?: IHoneycombQueryCalculation[];
	breakdowns?: string[];
	filters?: IHoneycombQueryFilter[];
	filter_combination?: 'AND' | 'OR';
	time_range?: number;
	start_time?: number;
	end_time?: number;
	granularity?: number;
	orders?: IHoneycombQueryOrder[];
	limit?: number;
	havings?: IHoneycombQueryHaving[];
}

export interface IHoneycombQueryResponse {
	id: string;
	query: IHoneycombQuery;
	created_at: string;
}

// Query Result types
export interface IHoneycombQueryResultData {
	series?: IDataObject[];
	results?: IDataObject[];
}

export interface IHoneycombQueryResult {
	id: string;
	complete: boolean;
	query_id: string;
	data?: IHoneycombQueryResultData;
	links?: {
		query_url?: string;
		graph_image_url?: string;
	};
}

// Dataset types
export interface IHoneycombDataset {
	name: string;
	slug: string;
	description?: string;
	expand_json_depth?: number;
	delete_protected?: boolean;
	created_at?: string;
	last_written_at?: string;
	regular_columns_count?: number;
}

// Column types
export interface IHoneycombColumn {
	id?: string;
	key_name: string;
	alias?: string;
	description?: string;
	type?: 'string' | 'float' | 'integer' | 'boolean';
	hidden?: boolean;
	created_at?: string;
	updated_at?: string;
}

// Board types
export interface IHoneycombBoardQuery {
	query_id?: string;
	query_annotation_id?: string;
	caption?: string;
	graph_settings?: IDataObject;
	query_style?: string;
}

export interface IHoneycombBoard {
	id?: string;
	name: string;
	description?: string;
	style?: 'visual' | 'list';
	column_layout?: 'multi' | 'single';
	queries?: IHoneycombBoardQuery[];
	created_at?: string;
	updated_at?: string;
}

// Trigger types
export interface IHoneycombTriggerThreshold {
	op: '>' | '<' | '>=' | '<=' | '==' | '!=';
	value: number;
}

export interface IHoneycombTriggerRecipient {
	type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'msteams' | 'marker';
	target?: string;
	id?: string;
}

export interface IHoneycombTrigger {
	id?: string;
	name: string;
	description?: string;
	disabled?: boolean;
	query?: IHoneycombQuery;
	threshold?: IHoneycombTriggerThreshold;
	frequency?: number;
	alert_type?: 'on_change' | 'on_true';
	recipients?: IHoneycombTriggerRecipient[];
	created_at?: string;
	updated_at?: string;
}

// SLO types
export interface IHoneycombSli {
	alias?: string;
}

export interface IHoneycombSlo {
	id?: string;
	name: string;
	description?: string;
	dataset_slug?: string;
	sli?: IHoneycombSli;
	target_per_million?: number;
	time_period_days?: number;
	created_at?: string;
	updated_at?: string;
}

export interface IHoneycombSloHistory {
	budget_start_time?: string;
	budget_end_time?: string;
	exhausted_budget_per_million?: number;
	remaining_budget_per_million?: number;
}

// Burn Alert types
export interface IHoneycombBurnAlert {
	id?: string;
	slo_id?: string;
	exhaustion_minutes?: number;
	recipients?: IHoneycombTriggerRecipient[];
	created_at?: string;
	updated_at?: string;
}

// Marker types
export interface IHoneycombMarker {
	id?: string;
	message?: string;
	type?: string;
	url?: string;
	start_time?: number;
	end_time?: number;
	created_at?: string;
	updated_at?: string;
}

// Marker Settings types
export interface IHoneycombMarkerSetting {
	id?: string;
	type: string;
	color?: string;
	created_at?: string;
	updated_at?: string;
}

// Environment types
export interface IHoneycombEnvironment {
	id?: string;
	name: string;
	slug?: string;
	description?: string;
	color?: string;
	delete_protected?: boolean;
	created_at?: string;
}

// Event types
export interface IHoneycombEvent {
	data: IDataObject;
	time?: string;
	samplerate?: number;
}

export interface IHoneycombBatchEvent {
	data: IDataObject;
	time?: string;
	samplerate?: number;
}

export interface IHoneycombBatchResponse {
	status: number;
	error?: string;
}

// API Response types
export interface IHoneycombPaginatedResponse<T> {
	data: T[];
	links?: {
		next?: string;
	};
}

export interface IHoneycombApiError {
	error: string;
	status?: number;
}

// Webhook payload types
export interface IHoneycombWebhookPayload {
	version: string;
	name: string;
	id: string;
	trigger_url: string;
	status: 'triggered' | 'resolved';
	summary?: string;
	description?: string;
	result_url?: string;
	result_groups?: IDataObject[];
	timestamp?: string;
}

// Resource and operation types
export type HoneycombResource =
	| 'query'
	| 'queryResult'
	| 'dataset'
	| 'column'
	| 'board'
	| 'trigger'
	| 'slo'
	| 'burnAlert'
	| 'marker'
	| 'markerSetting'
	| 'environment'
	| 'event';

export type QueryOperation = 'create' | 'get' | 'createResult' | 'getResult';
export type QueryResultOperation = 'create' | 'get' | 'poll';
export type DatasetOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete';
export type ColumnOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete';
export type BoardOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete' | 'addQuery' | 'removeQuery';
export type TriggerOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete';
export type SloOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete' | 'getHistory';
export type BurnAlertOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete';
export type MarkerOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete';
export type MarkerSettingOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete';
export type EnvironmentOperation = 'create' | 'getAll' | 'get' | 'update' | 'delete';
export type EventOperation = 'send' | 'sendBatch';

// Calculation operators
export const CALCULATION_OPS = [
	'COUNT',
	'SUM',
	'AVG',
	'COUNT_DISTINCT',
	'MAX',
	'MIN',
	'P001',
	'P01',
	'P05',
	'P10',
	'P25',
	'P50',
	'P75',
	'P90',
	'P95',
	'P99',
	'P999',
	'RATE_AVG',
	'RATE_SUM',
	'RATE_MAX',
	'HEATMAP',
] as const;

// Filter operators
export const FILTER_OPS = [
	'=',
	'!=',
	'>',
	'>=',
	'<',
	'<=',
	'starts-with',
	'does-not-start-with',
	'ends-with',
	'does-not-end-with',
	'contains',
	'does-not-contain',
	'exists',
	'does-not-exist',
	'in',
	'not-in',
] as const;

// Threshold operators
export const THRESHOLD_OPS = ['>', '<', '>=', '<=', '==', '!='] as const;
