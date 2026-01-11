/**
 * Velocity BPA - n8n-nodes-honeycomb
 * SPDX-License-Identifier: BUSL-1.1
 *
 * Integration tests for n8n-nodes-honeycomb
 *
 * These tests verify the node structure and configuration.
 * For full API integration tests, set HONEYCOMB_API_KEY environment variable.
 */

import { Honeycomb } from '../../nodes/Honeycomb/Honeycomb.node';
import { HoneycombTrigger } from '../../nodes/Honeycomb/HoneycombTrigger.node';
import { HoneycombApi } from '../../credentials/HoneycombApi.credentials';

// Type helpers for accessing nested node properties
interface FixedCollectionOption {
  name: string;
  displayName: string;
  values: Array<{
    name: string;
    options?: Array<{ value: string }>;
  }>;
}

describe('Honeycomb Node Integration', () => {
  let honeycombNode: Honeycomb;
  let honeycombTrigger: HoneycombTrigger;
  let honeycombCredentials: HoneycombApi;

  beforeAll(() => {
    honeycombNode = new Honeycomb();
    honeycombTrigger = new HoneycombTrigger();
    honeycombCredentials = new HoneycombApi();
  });

  describe('Honeycomb Node Structure', () => {
    it('should have correct node description', () => {
      const description = honeycombNode.description;

      expect(description.displayName).toBe('Honeycomb');
      expect(description.name).toBe('honeycomb');
      expect(description.group).toContain('transform');
      expect(description.version).toBe(1);
    });

    it('should have honeycombApi credentials configured', () => {
      const description = honeycombNode.description;
      const credentials = description.credentials;

      expect(credentials).toBeDefined();
      expect(credentials!.some((c: any) => c.name === 'honeycombApi')).toBe(true);
    });

    it('should have all required resources', () => {
      const description = honeycombNode.description;
      const resourceProperty = description.properties.find(
        (p: any) => p.name === 'resource'
      );

      expect(resourceProperty).toBeDefined();
      expect(resourceProperty!.options).toBeDefined();

      const resourceNames = resourceProperty!.options!.map((o: any) => o.value);

      expect(resourceNames).toContain('query');
      expect(resourceNames).toContain('dataset');
      expect(resourceNames).toContain('column');
      expect(resourceNames).toContain('board');
      expect(resourceNames).toContain('trigger');
      expect(resourceNames).toContain('slo');
      expect(resourceNames).toContain('burnAlert');
      expect(resourceNames).toContain('marker');
      expect(resourceNames).toContain('markerSetting');
      expect(resourceNames).toContain('environment');
      expect(resourceNames).toContain('event');
    });

    it('should have query operations', () => {
      const description = honeycombNode.description;
      const operationProperty = description.properties.find(
        (p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('query')
      );

      expect(operationProperty).toBeDefined();

      const operations = operationProperty!.options!.map((o: any) => o.value);

      expect(operations).toContain('create');
      expect(operations).toContain('get');
      expect(operations).toContain('createResult');
      expect(operations).toContain('getResult');
    });

    it('should have dataset operations', () => {
      const description = honeycombNode.description;
      const operationProperty = description.properties.find(
        (p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('dataset')
      );

      expect(operationProperty).toBeDefined();

      const operations = operationProperty!.options!.map((o: any) => o.value);

      expect(operations).toContain('create');
      expect(operations).toContain('getAll');
      expect(operations).toContain('get');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
    });

    it('should have board operations including query management', () => {
      const description = honeycombNode.description;
      const operationProperty = description.properties.find(
        (p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('board')
      );

      expect(operationProperty).toBeDefined();

      const operations = operationProperty!.options!.map((o: any) => o.value);

      expect(operations).toContain('create');
      expect(operations).toContain('getAll');
      expect(operations).toContain('get');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
      expect(operations).toContain('addQuery');
      expect(operations).toContain('removeQuery');
    });

    it('should have SLO operations including history', () => {
      const description = honeycombNode.description;
      const operationProperty = description.properties.find(
        (p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('slo')
      );

      expect(operationProperty).toBeDefined();

      const operations = operationProperty!.options!.map((o: any) => o.value);

      expect(operations).toContain('create');
      expect(operations).toContain('getAll');
      expect(operations).toContain('get');
      expect(operations).toContain('update');
      expect(operations).toContain('delete');
      expect(operations).toContain('getHistory');
    });

    it('should have event operations for ingestion', () => {
      const description = honeycombNode.description;
      const operationProperty = description.properties.find(
        (p: any) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('event')
      );

      expect(operationProperty).toBeDefined();

      const operations = operationProperty!.options!.map((o: any) => o.value);

      expect(operations).toContain('send');
      expect(operations).toContain('sendBatch');
    });

    it('should have correct node icon', () => {
      const description = honeycombNode.description;

      expect(description.icon).toBe('file:honeycomb.svg');
    });

    it('should have required defaults', () => {
      const description = honeycombNode.description;

      expect(description.defaults).toBeDefined();
      expect(description.defaults.name).toBe('Honeycomb');
    });

    it('should have correct input/output configuration', () => {
      const description = honeycombNode.description;

      expect(description.inputs).toEqual(['main']);
      expect(description.outputs).toEqual(['main']);
    });
  });

  describe('HoneycombTrigger Node Structure', () => {
    it('should have correct trigger node description', () => {
      const description = honeycombTrigger.description;

      expect(description.displayName).toBe('Honeycomb Trigger');
      expect(description.name).toBe('honeycombTrigger');
      expect(description.group).toContain('trigger');
    });

    it('should be configured as webhook', () => {
      const description = honeycombTrigger.description;

      expect(description.webhooks).toBeDefined();
      expect(description.webhooks!.length).toBeGreaterThan(0);
    });

    it('should have event filter options', () => {
      const description = honeycombTrigger.description;
      const eventProperty = description.properties.find(
        (p: any) => p.name === 'event'
      );

      expect(eventProperty).toBeDefined();
      expect(eventProperty!.options).toBeDefined();

      const eventTypes = eventProperty!.options!.map((o: any) => o.value);

      expect(eventTypes).toContain('all');
      expect(eventTypes).toContain('triggered');
      expect(eventTypes).toContain('resolved');
    });
  });

  describe('Honeycomb Credentials Structure', () => {
    it('should have correct credential name', () => {
      expect(honeycombCredentials.name).toBe('honeycombApi');
      expect(honeycombCredentials.displayName).toBe('Honeycomb API');
    });

    it('should have apiKey property', () => {
      const properties = honeycombCredentials.properties;
      const apiKeyProp = properties.find((p: any) => p.name === 'apiKey');

      expect(apiKeyProp).toBeDefined();
      expect(apiKeyProp!.type).toBe('string');
      expect(apiKeyProp!.typeOptions?.password).toBe(true);
    });

    it('should have keyType property with correct options', () => {
      const properties = honeycombCredentials.properties;
      const keyTypeProp = properties.find((p: any) => p.name === 'keyType');

      expect(keyTypeProp).toBeDefined();
      expect(keyTypeProp!.type).toBe('options');

      const options = keyTypeProp!.options!.map((o: any) => o.value);

      expect(options).toContain('configuration');
      expect(options).toContain('ingest');
      expect(options).toContain('query');
    });

    it('should have test request configured', () => {
      expect(honeycombCredentials.test).toBeDefined();
    });
  });

  describe('Node Property Validation', () => {
    it('should have proper displayOptions for query parameters', () => {
      const description = honeycombNode.description;

      // Find calculation property
      const calculationsProp = description.properties.find(
        (p: any) => p.name === 'calculations'
      );

      expect(calculationsProp).toBeDefined();
      expect(calculationsProp!.displayOptions).toBeDefined();
      expect(calculationsProp!.displayOptions!.show!.resource).toContain('query');
    });

    it('should have datasetSlug parameter for dataset-scoped resources', () => {
      const description = honeycombNode.description;

      // Find datasetSlug property
      const datasetSlugProp = description.properties.find(
        (p: any) => p.name === 'datasetSlug'
      );

      expect(datasetSlugProp).toBeDefined();
      expect(datasetSlugProp!.type).toBe('string');
    });

    it('should have returnAll option for list operations', () => {
      const description = honeycombNode.description;

      const returnAllProp = description.properties.find(
        (p: any) => p.name === 'returnAll'
      );

      expect(returnAllProp).toBeDefined();
      expect(returnAllProp!.type).toBe('boolean');
    });

    it('should have limit option when returnAll is false', () => {
      const description = honeycombNode.description;

      const limitProp = description.properties.find(
        (p: any) => p.name === 'limit'
      );

      expect(limitProp).toBeDefined();
      expect(limitProp!.displayOptions!.show!.returnAll).toContain(false);
    });
  });

  describe('Calculation Operators', () => {
    it('should have all supported calculation operators', () => {
      const description = honeycombNode.description;

      // Find the calculation op property
      const calculationsProp = description.properties.find(
        (p: any) => p.name === 'calculations'
      );

      expect(calculationsProp).toBeDefined();

      // The op field should be within the fixedCollection - cast to access nested structure
      const options = calculationsProp?.options as FixedCollectionOption[] | undefined;
      const opField = options?.[0]?.values?.find(
        (v: any) => v.name === 'op'
      );

      if (opField) {
        const operators = opField.options?.map((o: any) => o.value) || [];

        expect(operators).toContain('COUNT');
        expect(operators).toContain('SUM');
        expect(operators).toContain('AVG');
        expect(operators).toContain('MAX');
        expect(operators).toContain('MIN');
        expect(operators).toContain('P50');
        expect(operators).toContain('P95');
        expect(operators).toContain('P99');
      }
    });
  });

  describe('Filter Operators', () => {
    it('should have all supported filter operators', () => {
      const description = honeycombNode.description;

      // Find the filters property
      const filtersProp = description.properties.find(
        (p: any) => p.name === 'filters'
      );

      expect(filtersProp).toBeDefined();

      // The op field should be within the fixedCollection - cast to access nested structure
      const options = filtersProp?.options as FixedCollectionOption[] | undefined;
      const opField = options?.[0]?.values?.find(
        (v: any) => v.name === 'op'
      );

      if (opField) {
        const operators = opField.options?.map((o: any) => o.value) || [];

        expect(operators).toContain('=');
        expect(operators).toContain('!=');
        expect(operators).toContain('>');
        expect(operators).toContain('<');
        expect(operators).toContain('contains');
        expect(operators).toContain('exists');
      }
    });
  });
});

// Skip API integration tests if no API key is provided
const apiKey = process.env.HONEYCOMB_API_KEY;

(apiKey ? describe : describe.skip)('Honeycomb API Integration', () => {
  // These tests would make actual API calls
  // They are skipped by default and only run when HONEYCOMB_API_KEY is set

  it.todo('should authenticate with valid API key');
  it.todo('should list datasets');
  it.todo('should create and delete a test dataset');
  it.todo('should run a simple query');
  it.todo('should create and delete a test board');
  it.todo('should send a test event');
});
