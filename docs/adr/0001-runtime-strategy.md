# ADR-0001: Runtime Strategy

Status: proposed
Date: 2026-06-25
Updated: 2026-06-26 - reconciled with the runtime competitor landscape evaluation (#27) and the Kubernetes-native default architecture recommendation.

## Context

The Agentic Network Platform needs a secure execution environment for autonomous network agents, local Nornir and Ansible workflows, governed terminal access, secret-reference resolution, model routing, evidence capture, and customer deployment flexibility.

NVIDIA OpenShell is the strongest first reference adapter because it is designed around autonomous agent execution, with a Gateway control plane, sandbox-local Supervisor enforcement, provider records, inference routing, policy delivery, relays, and sandbox lifecycle. At the same time, the project does not yet have a first customer, and customers may already be committed to Kubernetes, OpenShift, Docker, Podman, or hosted sandbox providers.

The runtime competitor landscape evaluation found that the strongest architecture and portability pressure is the emerging class of Kubernetes-native agent sandboxes: isolated, stateful, singleton agent workloads modeled by the Kubernetes SIG Agent Sandbox, GKE Agent Sandbox, Agyn, and Northflank patterns. That shifts the product default architecture from OpenShell-centered deployment toward Kubernetes-native agent sandbox semantics, while keeping OpenShell as the first reference adapter and security baseline.

Analysis: [Runtime Execution Environment Evaluation](../architecture/runtime-execution-environment-evaluation.md)

Canonical deployment layout: [UI and Agent Deployment Framework Architecture](../architecture/ui-agent-deployment-framework.md#codebase-architecture)

## Decision

The platform will be Kubernetes-native-agent-sandbox-first, OpenShell-reference-adapter-backed, and runtime-adapter-driven.

- Kubernetes-native agent sandbox semantics are the default product architecture: stable identity, persistent workspace, controlled network reachability, mediated terminal/session access, external secret references, and policy-visible execution. The Kubernetes adapter should model isolated, stateful, singleton agent sandboxes (for example the Kubernetes SIG Agent Sandbox, GKE Agent Sandbox, Agyn, and Northflank patterns) rather than generic pods.
- OpenShell is the first reference adapter and security baseline. It should prove policy, evidence, terminal mediation, provider routing, and sandbox lifecycle semantics without becoming the only product contract.
- OpenShift is a first-class enterprise target, served either by OpenShell-on-Kubernetes or the Kubernetes-native agent sandbox adapter with declared control differences.
- Docker or Podman is a contributor and lab runtime only. It is not an enterprise security answer or a portability target.
- Cloud agent sandboxes, developer sandbox platforms, and enterprise appliance stacks are later, opt-in adapters, supported only where their controls are explicit and policy gaps are visible in deployment planning. Base isolation technologies such as Kata, Firecracker, and gVisor are substrate choices behind adapters, not product-level runtimes.
- Non-OpenShell runtimes must implement the runtime adapter contract and declare missing or degraded controls.
- The product-level UI and API should expose runtime-neutral concepts first: runtime bundle, runtime profile, terminal session, secret reference, model route, local tool policy, and evidence bundle.
- OpenShell-specific fields may appear in advanced settings, deployment previews, and generated artifacts, but they should not become the only platform contract.

## Consequences

Positive:

- The project can align with enterprise Kubernetes and OpenShift adoption without losing a strong OpenShell-backed security reference implementation.
- Customers with existing Kubernetes, OpenShift, or local-container investments have a path to integration, and other runtimes can be added later through the adapter contract.
- Runtime capability gaps become explicit deployment-planning data instead of hidden assumptions.
- The `network-agent-runtime` image can remain OCI-grounded and portable across multiple execution environments.

Negative:

- Runtime adapter contracts add design and testing surface area.
- Non-OpenShell adapters may not provide equivalent security controls.
- The UI must explain supported, degraded, unsupported, and customer-supplied runtime capabilities clearly.
- Documentation and code layout must keep deployment artifact adapters separate from runtime lifecycle adapters.

## Implementation Notes

- `packages/deployment-adapters` emit target-specific artifacts such as Compose, Helm, Kustomize, OpenShift overlays, and CI/CD bundles.
- `packages/runtime-contracts` owns runtime-neutral bundle, session, terminal, secret-reference, model-route, evidence, capability, and health schemas.
- `packages/runtime-adapters/*` owns launch, terminal attach, file sync, secret-reference mapping, model routing, evidence readback, teardown, and health for each runtime family.
- `packages/runtime-adapters/kubernetes` is the default architecture adapter and should model stateful singleton agent sandboxes, persistent workspace, controlled network egress, external secret references, and audited session mediation rather than generic pods.
- `packages/runtime-adapters/openshell` is the first reference adapter and the reference implementation for policy and evidence semantics.
- `packages/runtime-adapters/local-containers` is a contributor and lab adapter only.
- Cloud, developer-sandbox, and appliance adapters are later additions; Nomad is deprioritized and is no longer a near-term target.

## Open Questions

- Should the first Kubernetes adapter target Kubernetes SIG Agent Sandbox/GKE-style resources directly, deploy OpenShell on Kubernetes, or support both paths in the same milestone?
- What minimum runtime capability level is required before state-changing network automation can be enabled?
- Should hosted sandbox adapters be community plugins, enterprise features, or lab-only utilities?
