# Security Policy

The Agentic Network Platform is intended to run network AI agents with enterprise-grade controls. Security reports should be handled privately and with enough detail to reproduce the issue safely.

## Reporting a Vulnerability

Do not open a public GitHub issue for suspected vulnerabilities.

Until GitHub private vulnerability reporting is enabled for this repository, report security issues directly to the project maintainer through a private channel. Include:

- affected component or document
- version, commit SHA, or branch
- reproduction steps
- expected impact
- logs, screenshots, or evidence where safe to share
- whether the issue affects credentials, identity, sandbox escape, policy bypass, network access, or customer data

## Scope

Security-sensitive areas include:

- OpenShell Gateway and Supervisor integration
- sandbox escape or filesystem/network policy bypass
- delegated identity, agent-owned identity, and on-behalf-of authorization
- secret-provider integrations and secret reference resolution
- MCP broker and tool authorization
- Nornir, Ansible, shell, and local script execution
- generated deployment artifacts
- audit, evidence, memory, and retention controls

## Expectations

- Vulnerability reports should receive an initial maintainer acknowledgement before public disclosure.
- Fixes should be developed through private branches or coordinated disclosure when needed.
- Public issues and PRs should avoid exposing exploit details, credentials, tokens, customer data, or live network identifiers.
- Security fixes should include regression tests, policy tests, or documented evidence wherever possible.

## Supported Versions

The project is pre-release. Security fixes should target the active development branch and any published release branches once releases begin.
