# n8n-nodes-honeycomb

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for [Honeycomb](https://www.honeycomb.io/), the modern observability platform designed for high-cardinality, high-dimensionality data. This node enables workflow automation for querying telemetry data, managing datasets, creating boards, configuring triggers, and working with SLOs.

![n8n](https://img.shields.io/badge/n8n-community--node-brightgreen)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Features

- **12 Resource Categories** with 50+ operations for complete Honeycomb API coverage
- **Advanced Query Builder** with 21 calculation operators and comprehensive filtering
- **SLO Management** including burn alerts and budget tracking
- **Real-time Event Ingestion** with batch support for high-throughput scenarios
- **Webhook Triggers** for alert notifications and incident automation
- **Environment-wide Operations** using `__all__` dataset scope
- **Full TypeScript Support** with comprehensive type definitions

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-honeycomb`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-honeycomb

# Restart n8n
```

### Development Installation

```bash
# Clone and enter the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-honeycomb.git
cd n8n-nodes-honeycomb

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-honeycomb

# Restart n8n
```

## Credentials Setup

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `apiKey` | string | Yes | Honeycomb API Key |
| `keyType` | options | Yes | Key type: Configuration, Ingest, or Query |
| `environmentSlug` | string | No | Default environment slug for operations |

### Obtaining API Keys

1. Log into [Honeycomb](https://ui.honeycomb.io/)
2. Navigate to **Team Settings** → **API Keys**
3. Create a key with appropriate permissions:
   - **Configuration Keys**: For managing datasets, boards, triggers, SLOs
   - **Ingest Keys**: For sending events
   - **Query Keys**: For running queries

## Resources & Operations

### Query

Create and run ad-hoc queries against your Honeycomb data.

| Operation | Description |
|-----------|-------------|
| `create` | Create a query specification |
| `get` | Get query by ID |
| `createResult` | Run query and get results |
| `getResult` | Get query result by ID |

**Supported Calculations:**
- Basic: `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`
- Percentiles: `P50`, `P75`, `P90`, `P95`, `P99`, `P999`
- Advanced: `COUNT_DISTINCT`, `HEATMAP`, `RATE_AVG`, `RATE_SUM`, `RATE_MAX`

**Filter Operators:**
- Comparison: `=`, `!=`, `>`, `>=`, `<`, `<=`
- String: `contains`, `does-not-contain`, `starts-with`, `ends-with`
- Existence: `exists`, `does-not-exist`
- Set: `in`, `not-in`

### Dataset

Manage datasets for organizing your telemetry data.

| Operation | Description |
|-----------|-------------|
| `create` | Create a new dataset |
| `getAll` | List all datasets |
| `get` | Get dataset details |
| `update` | Update dataset settings |
| `delete` | Delete a dataset |

### Column

Manage column metadata within datasets.

| Operation | Description |
|-----------|-------------|
| `create` | Create a column |
| `getAll` | List columns in dataset |
| `get` | Get column details |
| `update` | Update column metadata |
| `delete` | Delete a column |

### Board

Create and manage dashboards for visualizing your data.

| Operation | Description |
|-----------|-------------|
| `create` | Create a board |
| `getAll` | List all boards |
| `get` | Get board details |
| `update` | Update board |
| `delete` | Delete a board |
| `addQuery` | Add query to board |
| `removeQuery` | Remove query from board |

### Trigger (Alerts)

Configure alerting rules based on query results.

| Operation | Description |
|-----------|-------------|
| `create` | Create a trigger |
| `getAll` | List all triggers |
| `get` | Get trigger details |
| `update` | Update trigger |
| `delete` | Delete a trigger |

**Threshold Operators:** `>`, `>=`, `<`, `<=`, `==`, `!=`

**Recipient Types:** `email`, `slack`, `pagerduty`, `webhook`, `msteams`, `marker`

### SLO (Service Level Objectives)

Track and manage service level objectives.

| Operation | Description |
|-----------|-------------|
| `create` | Create an SLO |
| `getAll` | List all SLOs |
| `get` | Get SLO details |
| `update` | Update SLO |
| `delete` | Delete an SLO |
| `getHistory` | Get SLO history data |

### Burn Alert

Configure budget burn rate alerts for SLOs.

| Operation | Description |
|-----------|-------------|
| `create` | Create a burn alert |
| `getAll` | List burn alerts for SLO |
| `get` | Get burn alert details |
| `update` | Update burn alert |
| `delete` | Delete a burn alert |

### Marker

Add visual markers to your graphs for deployments, incidents, etc.

| Operation | Description |
|-----------|-------------|
| `create` | Create a marker |
| `getAll` | List markers |
| `get` | Get marker details |
| `update` | Update marker |
| `delete` | Delete a marker |

### Marker Setting

Configure marker type appearance.

| Operation | Description |
|-----------|-------------|
| `create` | Create marker settings |
| `getAll` | List marker settings |
| `get` | Get marker settings |
| `update` | Update marker settings |
| `delete` | Delete marker settings |

### Environment

Manage Honeycomb environments.

| Operation | Description |
|-----------|-------------|
| `create` | Create an environment |
| `getAll` | List all environments |
| `get` | Get environment details |
| `update` | Update environment |
| `delete` | Delete an environment |

### Event (Ingest)

Send telemetry events to Honeycomb.

| Operation | Description |
|-----------|-------------|
| `send` | Send a single event |
| `sendBatch` | Send multiple events |

## Trigger Node

The **Honeycomb Trigger** node receives webhook notifications from Honeycomb alerts.

### Configuration

| Property | Description |
|----------|-------------|
| `events` | Filter events: All, Triggered only, Resolved only |
| `triggerName` | Optional: Filter by trigger name |
| `triggerId` | Optional: Filter by trigger ID |

### Webhook Setup in Honeycomb

1. Create or edit a trigger in Honeycomb
2. Add a **Webhook** recipient
3. Set the URL to your n8n webhook endpoint
4. Save the trigger

### Webhook Payload

```json
{
  "name": "High Error Rate",
  "id": "trigger-id",
  "status": "triggered",
  "trigger_url": "https://ui.honeycomb.io/...",
  "result_url": "https://ui.honeycomb.io/...",
  "result_groups": [
    {
      "Group": { "service.name": "api-gateway" },
      "Result": 150
    }
  ]
}
```

## Usage Examples

### Run a Query

```javascript
// Count requests by service with error filtering
{
  "resource": "query",
  "operation": "createResult",
  "datasetSlug": "production-traces",
  "calculations": [
    { "op": "COUNT" },
    { "op": "P99", "column": "duration_ms" }
  ],
  "breakdowns": "service.name",
  "filters": [
    { "column": "http.status_code", "op": ">=", "value": "400" }
  ],
  "timeRange": 3600,
  "waitForCompletion": true
}
```

### Send Events

```javascript
// Send a single event
{
  "resource": "event",
  "operation": "send",
  "datasetSlug": "application-logs",
  "eventData": {
    "service.name": "payment-service",
    "event.type": "transaction",
    "amount": 99.99,
    "currency": "USD"
  }
}
```

### Create an SLO

```javascript
// Create 99.9% availability SLO
{
  "resource": "slo",
  "operation": "create",
  "datasetSlug": "api-traces",
  "name": "API Availability",
  "sliAlias": "successful_requests",
  "targetPercentage": 99.9,
  "timePeriodDays": 30
}
```

## Honeycomb Concepts

### High-Cardinality Data

Honeycomb excels at storing and querying high-cardinality data—fields with many unique values like user IDs, request IDs, or trace IDs. Traditional monitoring tools struggle with this, but Honeycomb's columnar storage handles it efficiently.

### Traces and Spans

Honeycomb supports distributed tracing with traces (complete request journeys) composed of spans (individual operations). Use `trace.trace_id` and `trace.parent_id` fields for trace analysis.

### SLIs and SLOs

- **SLI (Service Level Indicator)**: A measurement of service behavior (e.g., "successful requests")
- **SLO (Service Level Objective)**: A target for the SLI (e.g., "99.9% successful")
- **Error Budget**: The allowed failure rate (e.g., 0.1% of requests can fail)

### Burn Alerts

Burn alerts notify you when your error budget is being consumed too quickly. For example, alert when the budget will be exhausted in less than 60 minutes at the current rate.

## Error Handling

The node handles common Honeycomb API errors:

| Code | Description | Resolution |
|------|-------------|------------|
| 400 | Bad Request | Check query syntax and parameters |
| 401 | Unauthorized | Verify API key is correct |
| 403 | Forbidden | API key lacks required permissions |
| 404 | Not Found | Check dataset/resource IDs |
| 422 | Validation Error | Review field values |
| 429 | Rate Limited | Reduce request frequency |

## Security Best Practices

1. **Use Appropriate Key Types**: Use query keys for read-only operations, ingest keys only for sending events
2. **Rotate Keys Regularly**: Update API keys periodically
3. **Limit Key Permissions**: Create keys with minimal required scopes
4. **Secure Webhooks**: Use HTTPS endpoints for trigger webhooks
5. **Monitor API Usage**: Watch for unexpected spikes in API calls

## Rate Limits

- **Configuration/Query**: 10 requests/second
- **Events (Ingest)**: 100 requests/second

The node respects rate limit headers and implements exponential backoff.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-honeycomb/issues)
- **Documentation**: [Honeycomb API Docs](https://docs.honeycomb.io/api/)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Honeycomb](https://www.honeycomb.io/) for their excellent observability platform and API
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- The open-source community for inspiration and support
