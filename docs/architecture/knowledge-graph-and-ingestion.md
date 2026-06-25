# Knowledge Graph and Documentation Ingestion

Status: draft for review
Date: 2026-06-25
Issue: https://github.com/ColtMercer/the-agentic-network-platform/issues/25

The platform needs a product-quality ingestion pipeline, not a pile of ad hoc scrapers. Connectors should normalize documents into traceable evidence, then feed both retrieval indexes and the network knowledge graph.

## Ingestion Pipeline

```mermaid
flowchart LR
    sources["Documentation sources: Confluence, SharePoint, Git, PDFs, ITSM, wikis"]
    crawl["Connector crawlers"]
    normalize["Normalize HTML, Markdown, text, and tables"]
    classify["Classify domain, sensitivity, and owner"]
    chunk["Chunk and preserve structure"]
    extract["Entity and relationship extraction"]
    reconcile["Entity resolution: device, interface, prefix, circuit, app"]
    index["Vector and keyword index"]
    graphupsert["Graph upsert"]
    evals["Quality checks: citations, drift, duplicates"]
    publish["Queryable knowledge products"]

    sources --> crawl
    crawl --> normalize
    normalize --> classify
    classify --> chunk
    chunk --> extract
    chunk --> index
    extract --> reconcile
    reconcile --> graphupsert
    index --> publish
    graphupsert --> publish
    extract --> evals
    reconcile --> evals
    evals --> publish
```

## Core Entities

The initial graph schema should represent network, operational, documentation, and service context.

| Entity | Examples |
| --- | --- |
| Network infrastructure | Device, interface, VRF, VLAN, prefix, circuit, provider, site, rack, cluster |
| Service context | Service, application, owner, dependency, SLO, customer impact |
| Operations context | Incident, change, maintenance window, validation, rollback plan |
| Knowledge context | Document, procedure, runbook, policy, config artifact, telemetry signal |
| Identity context | Team, owner, approver, persona, credential reference |

## Core Relationships

Important graph relationships:

- `CONNECTS_TO`
- `DEPENDS_ON`
- `OWNED_BY`
- `DOCUMENTED_BY`
- `OBSERVED_IN`
- `CHANGED_BY`
- `VALIDATED_BY`
- `IMPLEMENTS_POLICY`
- `HAS_RUNBOOK`
- `HAS_RISK`
- `AFFECTS_SERVICE`

```mermaid
flowchart TB
    device["Device"]
    interface["Interface"]
    prefix["Prefix"]
    service["Service"]
    app["Application"]
    owner["Owner"]
    doc["Document"]
    incident["Incident"]
    change["Change"]
    telemetry["Telemetry signal"]
    policy["Policy"]

    device -->|CONNECTS_TO| interface
    interface -->|OBSERVED_IN| telemetry
    interface -->|USES| prefix
    service -->|DEPENDS_ON| device
    app -->|DEPENDS_ON| service
    service -->|OWNED_BY| owner
    service -->|DOCUMENTED_BY| doc
    incident -->|AFFECTS_SERVICE| service
    change -->|CHANGED_BY| device
    device -->|IMPLEMENTS_POLICY| policy
```

## Provenance on Every Edge

Every graph edge should store provenance:

- source system
- source URL or object ID
- extraction method
- confidence score
- observed timestamp
- last verified timestamp
- owning connector
- source document hash or evidence object reference
- policy and sensitivity labels

## Quality Gates

Graph and ingestion quality should be tested continuously:

| Gate | Purpose |
| --- | --- |
| Citation coverage | Every extracted fact should point to source evidence. |
| Duplicate detection | Avoid duplicate devices, services, owners, and documents. |
| Drift detection | Detect when graph facts conflict with current source-of-truth or observed state. |
| Sensitivity filtering | Prevent restricted documents from becoming broadly visible graph facts. |
| Edge confidence | Rank extracted relationships by confidence and verification status. |
| Stale-edge review | Surface relationships that have not been observed or verified recently. |

## Initial Connectors

Recommended connector order:

1. Git and local Markdown.
2. Source-of-truth systems such as Nautobot, NetBox, or Infrahub.
3. Confluence or SharePoint.
4. Telemetry and observability systems.
5. ITSM and change systems.

