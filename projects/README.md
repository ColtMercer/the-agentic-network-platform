# Projects

Standalone projects in The Agentic Network Platform monorepo.

Each project should be independently useful, independently testable, and able to run in two modes:

- Standalone mode for open source users and lab testing.
- Platform-integrated mode through the MCP registry, delegated identity, policy, audit, and observability.

## Current Projects

- [Nornir MCP](nornir-mcp/README.md): Nornir-based MCP server for safe network inventory, collection, command execution, driver selection, config planning, and evidence generation.

## Expected Project Contract

Every project should define:

- README and threat model.
- MCP capability manifest.
- Identity and authorization requirements.
- Policy profile.
- Evidence format.
- Local fixtures.
- Unit, policy, and integration tests.
- Standalone and platform-integrated run instructions.
