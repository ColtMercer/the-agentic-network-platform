# Glossary

This glossary keeps project language consistent for contributors, reviewers, and enterprise partners.

## Agent and Runtime Terms

- **A2A**: Agent-to-Agent communication and discovery. The orchestrator uses A2A to coordinate downstream persona agents.
- **Agent-owned identity**: A non-human principal assigned to a persona for autonomous work such as scheduled collection or background enrichment. It must have an owner, purpose, scopes, credential source, rotation policy, and audit trail.
- **Delegated identity**: A request path where the agent acts on behalf of an authenticated user and cannot exceed that user's effective permissions.
- **Hybrid identity**: A persona mode where background work may use an agent-owned identity, but sensitive or state-changing actions require user-delegated identity.
- **MCP**: Model Context Protocol. The platform uses MCP to expose tools, data, workflow integrations, and governed capability adapters.
- **OBO**: On-behalf-of authorization. A downstream request preserves the requesting user, session, tenant, persona, and policy context.
- **Orchestrator Agent**: The default coordinating agent. It routes work to downstream personas, evaluates available capabilities, and coordinates evidence collection.
- **Persona**: Configuration that defines an agent mission, identity mode, allowed tools, skills, model routes, memory scopes, approval requirements, and runtime policy.
- **Skill**: A versioned procedural knowledge package with instructions, examples, validators, required tools, and tests.

## OpenShell Terms

- **OpenShell**: NVIDIA's runtime for running autonomous agents in sandboxed environments with declarative policy.
- **Gateway**: The OpenShell control plane. It owns API access, durable state, sandbox lifecycle, provider and inference config, policy/settings delivery, authorization decisions, and relay coordination.
- **Supervisor**: The OpenShell component running inside every sandbox. It launches the restricted agent child process and enforces local filesystem, process, network, credential, inference, logging, exec, file-transfer, and relay controls.
- **Sandbox**: The isolated execution environment where the agent process and allowed local tools run.
- **Relay**: Gateway-mediated access for terminal, exec, file sync, logs, and related sandbox interactions.

## Network and Deployment Terms

- **Batfish**: A network validation and digital-twin analysis system.
- **Infrahub**: A source-of-truth and infrastructure data platform.
- **Nautobot**: A network source-of-truth and automation platform.
- **NetBox**: A network source-of-truth platform.
- **NetObs**: A network observability-as-code pattern used in this project's design discussions, where source-of-truth records and templates render collector configuration.
- **OKD**: The community distribution of Kubernetes that underpins OpenShift.
- **OpenShift**: Red Hat's Kubernetes platform.
- **SCC**: SecurityContextConstraints, an OpenShift security control for pod permissions.
- **pyVmomi**: VMware's Python SDK for vSphere APIs.

## Security and Policy Terms

- **Cedar**: A policy language commonly associated with fine-grained authorization.
- **Effective authorization**: The final allow or deny decision after intersecting principal scope, persona policy, runtime policy, tool policy, target permissions, credential scope, action risk, and approval state.
- **FID/access management**: The organization's federated identity and access-management process for assigning, rotating, and governing persona or service credentials.
- **OPA**: Open Policy Agent, a policy engine for policy-as-code.
- **Secret reference**: A pointer to secret material in an external provider. The reference can be stored in Git or the database; the secret value should not be.
- **Threat model**: A structured document describing assets, trust boundaries, threats, mitigations, assumptions, and open risks.

## Project Terms

- **OpenClaw for networks**: The project shorthand for an open, extensible agent framework focused on network operations, similar in spirit to a tool-capable agent platform but specialized for network engineering.
- **Settings hydration**: Importing Git-backed configuration into normalized database records so the UI, API, renderer, policy engine, and audit pipeline all query the same state.
- **Template rendering**: Producing deterministic config and deployment artifacts from effective settings snapshots and versioned templates.
