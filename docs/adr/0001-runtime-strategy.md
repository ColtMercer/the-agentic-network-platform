# ADR-0001: Runtime Strategy

Status: proposed
Date: 2026-06-25

## Context

The Agentic Network Platform needs a secure execution environment for autonomous network agents, local Nornir and Ansible workflows, governed terminal access, secret-reference resolution, model routing, evidence capture, and customer deployment flexibility.

NVIDIA OpenShell is the strongest first runtime fit because it is designed around autonomous agent execution, with a Gateway control plane, sandbox-local Supervisor enforcement, provider records, inference routing, policy delivery, relays, and sandbox lifecycle. At the same time, the project does not yet have a first customer, and customers may already be committed to Kubernetes, OpenShift, Docker, Podman, Nomad, or hosted sandbox providers.

Analysis: [Runtime Execution Environment Evaluation](../architecture/runtime-execution-environment-evaluation.md)

Canonical deployment layout: [UI and Agent Deployment Framework Architecture](../architecture/ui-agent-deployment-framework.md#codebase-architecture)

## Decision

The platform will be OpenShell-first and runtime-adapter-driven.

- OpenShell is the recommended secure reference runtime and initial enterprise-grade runtime adapter.
- Docker or Podman local mode is the required contributor and lab adapter.
- Kubernetes and OpenShift are mandatory enterprise deployment targets.
- Non-OpenShell runtimes must implement the runtime adapter contract and declare missing or degraded controls.
- The product-level UI and API should expose runtime-neutral concepts first: runtime bundle, runtime profile, terminal session, secret reference, model route, local tool policy, and evidence bundle.
- OpenShell-specific fields may appear in advanced settings, deployment previews, and generated artifacts, but they should not become the only platform contract.

## Consequences

Positive:

- The project can start with the strongest agent-specific runtime without locking the entire product to one vendor or runtime.
- Customers with existing Kubernetes, OpenShift, Nomad, or local-container investments have a path to integration.
- Runtime capability gaps become explicit deployment-planning data instead of hidden assumptions.
- The `network-agent-runtime` image can remain OCI-grounded and portable across multiple execution environments.

Negative:

- Runtime adapter contracts add design and testing surface area.
- Non-OpenShell adapters may not provide equivalent security controls.
- The UI must explain supported, degraded, unsupported, and customer-supplied runtime capabilities clearly.
- Documentation and code layout must keep deployment artifact adapters separate from runtime lifecycle adapters.

## Implementation Notes

- `packages/deployment-adapters` emit target-specific artifacts such as Compose, Helm, Kustomize, OpenShift overlays, Nomad job specs, and CI/CD bundles.
- `packages/runtime-contracts` owns runtime-neutral bundle, session, terminal, secret-reference, model-route, evidence, capability, and health schemas.
- `packages/runtime-adapters/*` owns launch, terminal attach, file sync, secret-reference mapping, model routing, evidence readback, teardown, and health for each runtime family.
- `packages/runtime-adapters/openshell` is the first gold-standard runtime adapter.
- `packages/runtime-adapters/local-containers` is the first contributor and lab adapter.

## Open Questions

- Should the first Kubernetes adapter always deploy OpenShell, or should a native Kubernetes fallback ship at the same time?
- What minimum runtime capability level is required before state-changing network automation can be enabled?
- Should hosted sandbox adapters be community plugins, enterprise features, or lab-only utilities?
