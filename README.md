# The Agentic Network Platform

The Agentic Network Platform is an open source design effort for secure, enterprise-ready network AI agents.

This repository is currently a design repo. It captures the architecture, security model, runtime strategy, UI management plane, governance workflow, and standalone project boundaries needed to build an "OpenClaw for networks": a platform where network agents can reason over topology, documentation, telemetry, configuration, incidents, and procedural knowledge, then act through governed tools.

The design position is:

- The UI, Platform API, and settings database are a standalone management plane.
- Agents run in secured execution environments modeled around Kubernetes-native agent sandbox semantics.
- NVIDIA OpenShell is the first reference adapter and security baseline, while other runtimes can be supported through runtime adapters when customer environments require them.
- The orchestrator agent coordinates specialized persona agents over A2A.
- MCP and local runtime tools expose controlled capabilities such as Nornir, Ansible, graph query, document search, telemetry, Git, source-of-truth, and change systems.
- Durable configuration is Git-backed and hydrated into the database for UI, validation, effective-state computation, rendering, audit, and runtime delivery.
- Identity is explicit: interactive workflows use user-delegated credentials, while autonomous agentic workflows use scoped persona-owned credentials with FID/access governance.

## Design Map

| Area | Start here | Purpose |
| --- | --- | --- |
| Runtime strategy | [ADR-0001: Runtime Strategy](docs/adr/0001-runtime-strategy.md) | Kubernetes-native-agent-sandbox-first, OpenShell-reference-adapter-backed, runtime-adapter-driven decision. |
| Design principles | [Design Principles and Roadmap](docs/architecture/design-principles.md) | North star, platform principles, and MVP phase plan. |
| Runtime evaluation | [Runtime Execution Environment Evaluation](docs/architecture/runtime-execution-environment-evaluation.md) | Competitor landscape covering Kubernetes-native agent runtimes, cloud agent sandboxes, developer sandbox infrastructure, enterprise appliance stacks, and base isolation technology. |
| Agent runtime | [OpenShell Nornir Agent Runtime Architecture](docs/architecture/openshell-nornir-agent-runtime.md) | Secure terminal, OpenShell Gateway/Supervisor model, Nornir-first local runtime, Ansible, personas, and skills. |
| UI and deployment | [UI and Agent Deployment Framework Architecture](docs/architecture/ui-agent-deployment-framework.md) | How UI settings hydrate DB state, render bundles, and hand off deployment artifacts. |
| UI boundary | [Web UI Deployment Architecture](docs/architecture/web-ui-deployment.md) | Why the UI is a dedicated service, not a process inside the agent sandbox. |
| Threat model | [Threat Model](docs/architecture/threat-model.md) | Security invariant, assets, trust boundaries, and initial mitigations. |
| MCP integration | [MCP Integration Model](docs/architecture/mcp-integration.md) | Capability manifests, server lifecycle, broker policy, and audit requirements. |
| Skills | [Skills for Procedural Knowledge](docs/architecture/skills.md) | Skill package format, lifecycle, validation, and policy binding. |
| Knowledge graph | [Knowledge Graph and Documentation Ingestion](docs/architecture/knowledge-graph-and-ingestion.md) | Connector pipeline, graph entities, relationships, provenance, and quality gates. |
| Governance | [Issue-Driven Development Workflow](docs/governance/issue-driven-development.md) | Public issue, PR, review, and merge trail for open source trust. |
| ADR process | [Architecture Decision Records](docs/adr/README.md) | Long-lived decisions that affect security, runtime, identity, storage, or deployment. |
| Vocabulary | [Glossary](docs/glossary.md) | Shared terms for contributors and reviewers. |
| UI design reference | [Network Agent Platform UI Design](docs/design/network-agent-platform-ui/README.md) | Imported design reference and production UI direction. |
| Standalone projects | [Projects](projects/README.md) | Monorepo project model. |
| Nornir MCP | [Nornir MCP](projects/nornir-mcp/README.md) | Standalone MCP server for governed Nornir network interaction. |
| Contribution | [CONTRIBUTING.md](CONTRIBUTING.md) | How contributors should work in this repository. |
| Security reporting | [SECURITY.md](SECURITY.md) | Vulnerability reporting scope and process. |

## High-Level Architecture

The platform separates the human-facing management plane from the secured agent runtime. The management plane owns settings, identity, policy, deployment planning, and audit. The runtime executes agents and tools inside a constrained environment.

```mermaid
flowchart TB
    user["Network engineer, operator, or maintainer"]

    subgraph management["Standalone management plane"]
        ui["Web UI, CLI, or chat surface"]
        api["Platform API"]
        settingsdb["Settings database"]
        gitcfg["Git-backed configuration"]
        policy["Policy engine"]
        identity["Identity and delegation broker"]
        renderer["Bundle renderer and deployment planner"]
        audit["Audit and evidence store"]
    end

    subgraph runtimecontrol["Runtime control plane"]
        adapter["Runtime adapter contract"]
        openshellgw["NVIDIA OpenShell Gateway"]
        otheradapters["Other runtime adapters"]
    end

    subgraph runtime["Secured agent execution"]
        supervisor["OpenShell Supervisor or adapter enforcement"]
        orchestrator["Orchestrator agent"]
        personas["A2A persona agents"]
        localtools["Local tools: Nornir, Ansible, Python, shell"]
        mcp["MCP broker and tool servers"]
    end

    subgraph knowledge["Knowledge and evidence"]
        knowledgegraph["Knowledge graph"]
        rag["RAG and vector indexes"]
        memory["Episodic memory"]
        objectstore["Raw docs and evidence objects"]
    end

    subgraph targets["Network and enterprise targets"]
        devices["Network devices and controllers"]
        sot["Nautobot, NetBox, Infrahub"]
        docs["Confluence, SharePoint, Git, Drive"]
        telemetry["Telemetry and observability"]
        change["ITSM and change systems"]
    end

    user --> ui
    ui --> api
    api --> identity
    api --> settingsdb
    gitcfg --> settingsdb
    settingsdb --> policy
    identity --> policy
    policy --> renderer
    renderer --> adapter
    adapter --> openshellgw
    adapter --> otheradapters
    openshellgw --> supervisor
    otheradapters --> supervisor
    supervisor --> orchestrator
    orchestrator <--> personas
    orchestrator --> localtools
    orchestrator --> mcp
    personas --> localtools
    personas --> mcp
    mcp --> knowledgegraph
    mcp --> rag
    mcp --> memory
    mcp --> objectstore
    localtools --> devices
    mcp --> sot
    mcp --> docs
    mcp --> telemetry
    mcp --> change
    supervisor --> audit
    api --> audit
```

## Management Plane and OpenShell Gateway

The UI does not mutate agent sandboxes directly. UI changes become drafts, Git changes, effective settings snapshots, rendered bundles, and policy-checked runtime deliveries. For the OpenShell reference adapter, the platform delivers desired state through the NVIDIA OpenShell Gateway.

```mermaid
sequenceDiagram
    participant Admin as "Admin or maintainer"
    participant UI as "Management UI"
    participant API as "Platform API"
    participant DB as "Settings DB"
    participant Git as "Git config repo"
    participant Policy as "Policy engine"
    participant Renderer as "Renderer and planner"
    participant Gateway as "OpenShell Gateway"
    participant Supervisor as "Sandbox Supervisor"
    participant Agent as "Orchestrator and personas"

    Admin->>UI: Configure persona, skill, model provider, runtime, or policy
    UI->>API: Save draft or propose Git-backed change
    API->>Git: Create or update pull request for durable config
    Git-->>API: Merge event with commit SHA
    API->>DB: Hydrate imported settings and effective snapshot
    DB->>Policy: Evaluate persona, identity, tool, model, and runtime scope
    Policy->>Renderer: Approve render input with policy decision ID
    Renderer->>Gateway: Deliver runtime bundle and OpenShell desired state
    Gateway->>Supervisor: Apply sandbox policy, providers, relays, and session rules
    Supervisor->>Agent: Start or update orchestrator and persona runtime config
```

Runtime-delivered settings include:

- persona definitions, prompts, tools, skills, and A2A cards
- model provider routes and inference policy
- runtime image, filesystem, network, process, and terminal policy
- secret references and credential mappings
- MCP registry entries and tool scopes
- Nornir, Ansible, Python, and shell capability profiles
- memory, graph, RAG, evidence, and observability endpoints

## Runtime Strategy

The default product architecture is Kubernetes-native agent sandbox semantics: stable identity, persistent workspace, controlled network reachability, mediated terminal/session access, external secret references, and policy-visible execution. NVIDIA OpenShell is the first reference adapter and security baseline because it is purpose-built for policy-governed autonomous agent execution.

The product contract is still runtime-neutral: the platform renders an agent runtime bundle, then a runtime adapter translates it for the selected environment.

The main competitor pressure is not generic Docker or Kubernetes. It is the emerging class of isolated, stateful agent sandboxes and the enterprise stacks that package them. The detailed analysis lives in the [Runtime Execution Environment Evaluation](docs/architecture/runtime-execution-environment-evaluation.md).

```mermaid
flowchart TB
    snapshot["Effective settings snapshot"]
    bundle["Runtime-neutral agent bundle"]
    contract["Runtime adapter contract<br/>sessions, secrets, model routes, tools, evidence"]

    subgraph defaultArchitecture["Default architecture target"]
        k8sNative["Kubernetes-native agent runtimes<br/>Kubernetes SIG Agent Sandbox, Agyn, Northflank patterns"]
    end

    subgraph reference["Reference adapter"]
        openshell["NVIDIA OpenShell"]
    end

    subgraph competitorLandscape["Additional runtime landscape"]
        cloudSandboxes["Cloud agent sandboxes<br/>AWS AgentCore, Google Agent Sandbox, Cloudflare, Vercel"]
        devSandboxes["Developer sandbox infrastructure<br/>E2B, Daytona, Runloop, CodeSandbox SDK, Microsandbox, Modal"]
        appliances["Enterprise appliance stacks<br/>Dell Deskside Agentic AI, HPE Private Cloud AI"]
        substrates["Base isolation technology<br/>Kata Containers, Firecracker, gVisor, Docker and Kubernetes sandboxing"]
    end

    snapshot --> bundle
    bundle --> contract
    contract --> k8sNative
    contract --> openshell
    contract --> cloudSandboxes
    contract --> devSandboxes
    contract --> appliances
    contract --> substrates
```

Kubernetes-native agent sandboxes are the default architecture target because they map most closely to enterprise Kubernetes and OpenShift environments. OpenShell remains the recommended first adapter and security baseline. Cloud and developer sandboxes are useful expansion paths, appliance stacks are likely enterprise deployment channels, and base isolation technologies are implementation substrates rather than full platform competitors.

Adapters must declare missing or degraded controls. Portability should be honest: a runtime that cannot enforce terminal audit, model routing, network egress, secret references, or evidence capture is not equivalent to OpenShell.

## A2A Persona Control

The orchestrator is the default agent. It routes work to downstream personas over A2A and uses policy to decide which persona, identity mode, tools, model route, and runtime scope are valid for a task.

```mermaid
flowchart TB
    request["User request, event, or scheduled job"]
    orchestrator["Orchestrator agent"]
    registry["Persona registry and A2A cards"]
    policy["Policy and identity decision"]

    subgraph personas["A2A persona agents"]
        engineering["Engineering agent"]
        operations["Operations agent"]
        security["Security agent"]
        docs["Documentation agent"]
        graphsteward["Graph steward"]
        memorysteward["Memory steward"]
        changeagent["Change agent"]
    end

    evidence["Evidence bundle"]
    audit["Audit event"]

    request --> orchestrator
    orchestrator --> registry
    registry --> policy
    policy --> engineering
    policy --> operations
    policy --> security
    policy --> docs
    policy --> graphsteward
    policy --> memorysteward
    policy --> changeagent
    engineering --> evidence
    operations --> evidence
    security --> evidence
    docs --> evidence
    graphsteward --> evidence
    memorysteward --> evidence
    changeagent --> evidence
    evidence --> orchestrator
    orchestrator --> audit
```

Example personas:

| Persona | Primary role | Typical tools |
| --- | --- | --- |
| Orchestrator | Route tasks, coordinate A2A agents, assemble evidence | A2A, policy, registry, evidence APIs |
| Engineering | Design, validate, and propose network changes | Nornir, Ansible, Git, graph query, validators |
| Operations | Triage incidents and run read-only diagnostics | Telemetry, Nornir read-only commands, memory recall |
| Security | Review identity, secrets, policy, and risky actions | Policy engine, audit search, secrets review |
| Documentation | Retrieve and reconcile operational documentation | Confluence, SharePoint, Git, RAG |
| Graph Steward | Maintain topology and relationship context | Knowledge graph, source-of-truth, evidence |
| Memory Steward | Govern recall and memory writes | Episodic memory, retention, redaction |
| Change Agent | Prepare and track controlled change workflows | ITSM, GitOps, approvals, validation |

## Identity and Credential Modes

The platform must not give users elevated access just because an agent or MCP server has powerful credentials. Every request is authorized by intersecting principal scope, persona policy, runtime policy, local tool policy, MCP tool policy, target permissions, credential scope, action risk, and approval state.

```mermaid
flowchart TB
    action["Requested action"]
    classifier["Workflow classifier"]
    usermode["User-delegated mode"]
    agentmode["Agent-owned mode"]
    hybrid["Hybrid mode"]
    policy["Effective authorization"]
    secrets["Secret references and credential broker"]
    runtime["Runtime adapter and sandbox policy"]
    target["Network, document, graph, or enterprise target"]
    audit["Audit and evidence"]

    action --> classifier
    classifier --> usermode
    classifier --> agentmode
    classifier --> hybrid

    usermode --> policy
    agentmode --> policy
    hybrid --> policy
    secrets --> policy
    policy --> runtime
    runtime --> target
    target --> audit
    runtime --> audit
```

Credential modes:

| Mode | Used for | Rule |
| --- | --- | --- |
| User-delegated | Interactive and non-agentic workflows, chat-driven diagnostics, user-requested reads, approval actions | The agent acts on behalf of the authenticated user and cannot exceed the user's effective permissions. |
| Agent-owned | Autonomous scheduled collection, background graph enrichment, documentation ingestion, memory maintenance | The persona uses an explicit FID/service identity with owner, purpose, scopes, rotation, audit, and policy. |
| Hybrid | Workflows that start autonomously but need user authority for sensitive targets or state-changing actions | Background steps use persona identity; sensitive reads, plans, writes, and approvals require user delegation or change-control evidence. |

Secret values should not live in Git or normal database fields. Git and the database store secret references, provider metadata, certificate identifiers, and access policy. Runtime material is resolved through an approved secrets broker, OpenShell provider path, or customer secret system.

## Configuration and Deployment Flow

Git is the durable source for platform-impacting configuration. The database is the hydrated, queryable substrate for UI drafts, imported settings, effective runtime state, secret references, session state, sync status, and audit.

```mermaid
flowchart TB
    git["Git-backed config"]
    ui["UI drafts and approvals"]
    db["Settings database"]
    effective["Effective settings snapshot"]
    policy["Policy validation"]
    renderer["Template renderer"]
    deploypkg["Deployment package"]
    runtimepkg["Runtime bundle"]
    gateway["OpenShell Gateway or runtime adapter"]
    sandbox["Secured agent runtime"]

    git --> db
    ui --> db
    db --> effective
    effective --> policy
    policy --> renderer
    renderer --> deploypkg
    renderer --> runtimepkg
    deploypkg --> gateway
    runtimepkg --> gateway
    gateway --> sandbox
```

Deployment modes:

| Mode | Purpose |
| --- | --- |
| Local contributor | Docker or Podman, local DB, fixture inventory, and local development secrets. |
| Lab | Compose-based platform stack with OpenShell, Nornir, MCP servers, graph, memory, and observability defaults. |
| Kubernetes or OpenShift | Enterprise-style cluster deployment through generated Helm, Kustomize, OpenShift overlays, or customer GitOps. |
| Customer CI/CD handoff | The platform generates artifacts and PRs; the customer controls promotion, scanning, approval, and apply. |
| Hosted sandbox adapter | Optional future path for code execution or analysis where private network reachability is solved separately. |

## Capability Plan

The first capabilities should prove trust before write automation:

1. Read-only runtime with orchestrator and initial personas.
2. Nornir and Ansible available as governed local runtime tools.
3. MCP registry for source-of-truth, docs, graph, telemetry, Git, and network capabilities.
4. Git-backed settings imported into the database and rendered into runtime bundles.
5. Evidence bundles for every tool run, collection job, and agent recommendation.
6. Episodic memory with scope, provenance, redaction, retention, and review.
7. Config planning, dry-run, diff, and validation before any approved change execution.

## Open Source Trust Model

The project uses an issue-driven workflow so every material change has public process evidence:

```text
maintainer prompt -> issue -> branch -> pull request -> review -> validation -> merge -> issue closed
```

See [Issue-Driven Development Workflow](docs/governance/issue-driven-development.md), [CONTRIBUTING.md](CONTRIBUTING.md), and [SECURITY.md](SECURITY.md).
