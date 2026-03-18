# Cloud-Native ETL Orchestrator

> **Problem:** Our legacy telemetry system was dropping 5% of events during peak traffic, leading to inconsistent downstream reporting for the ML team.

## 🚀 The Solution
I engineered a resilient, horizontally scalable ETL pipeline using a **Buffer-First Architecture**. By decoupling ingestion from processing, we eliminated data loss and provided a "replayable" event stream.

### Key Technical Achievements:
- **Backpressure Management:** Implemented a custom Kinesis-to-Lambda throttler to prevent downstream database saturation.
- **Idempotent Processing:** Designed the transformation layer to handle "at-least-once" delivery semantics, ensuring zero duplicate records in the Data Lake.
- **Cost Optimization:** Reduced AWS compute costs by 30% by transitioning long-running EC2 workers to event-driven Fargate tasks.

## 🛠 Engineering Decisions
Refer to the **Architecture Diagram** and **Visual Demos** below to see how the system handles partition rebalancing and schema evolution.

1. **Schema Registry:** We used Confluent Schema Registry to ensure that upstream changes didn't break downstream Spark jobs.
2. **Observability:** Integrated OpenTelemetry for distributed tracing, allowing us to identify a 200ms bottleneck in the third-party validation API.

## 📈 Impact & Results
- **Zero Data Loss:** Successfully maintained 100% ingestion uptime during a 10x traffic spike in Q4.
- **Latency Reduction:** P99 processing time dropped from 15 minutes to under 45 seconds.
- **Team Velocity:** The automated CI/CD for DAG deployments reduced the release cycle from 2 days to 15 minutes.
