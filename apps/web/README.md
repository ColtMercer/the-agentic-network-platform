# Agentic Network Platform Web

Production web app for The Agentic Network Platform.

This app translates the static UI export in `docs/design/network-agent-platform-ui/` into maintainable React and TypeScript code.

## Development

From the repository root:

```bash
npm install
npm run web:dev
```

From this directory:

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm run lint
```

## Architecture Position

The web UI is a dedicated service. It should not run inside an NVIDIA OpenShell agent sandbox.

The UI talks to the Platform API using delegated user identity. The Platform API authorizes requests, calls the MCP broker, and starts or observes OpenShell agent runtime work through controlled APIs.

OpenShell remains the isolated agent execution plane. The UI remains the human-facing control plane.
