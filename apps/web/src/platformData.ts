export type Tone = 'ok' | 'warn' | 'danger' | 'info'

export type SettingKey =
  | 'personas'
  | 'skills'
  | 'mcp'
  | 'git'
  | 'identity'
  | 'runtime'
  | 'knowledge'
  | 'observability'

export const evidenceItems = [
  {
    id: 'ev-1',
    source: 'nornir.command.run_readonly',
    target: 'core-rtr-02',
    summary: 'neighbor 203.0.113.1 Idle, was Established 2h12m',
    severity: 'danger',
  },
  {
    id: 'ev-2',
    source: 'nornir.config.plan',
    target: 'dist-sw-01',
    summary: '+ route-map RM-UPLINK, 3 lines drift',
    severity: 'warn',
  },
  {
    id: 'ev-3',
    source: 'telemetry.query',
    target: 'prometheus',
    summary: 'bgp_session_flaps = 12 over 2h, peer AS65010',
    severity: 'info',
  },
] as const

export const topologyNodes = [
  { id: 'provider', name: 'AS65010', role: 'provider', state: 'warn', x: '8%', y: '18%' },
  { id: 'core', name: 'core-rtr-02', role: 'border', state: 'danger', x: '42%', y: '44%' },
  { id: 'dist', name: 'dist-sw-01', role: 'distribution', state: 'warn', x: '66%', y: '18%' },
  { id: 'apps', name: 'svc-payments', role: 'service', state: 'ok', x: '70%', y: '68%' },
] as const

export const a2aTasks: Array<{
  persona: string
  work: string
  state: string
  tone: Tone
}> = [
  {
    persona: 'Engineering',
    work: 'Drafting route-map remediation plan',
    state: 'working',
    tone: 'info',
  },
  {
    persona: 'Operations',
    work: 'Checking recent incidents and maintenance windows',
    state: 'ready',
    tone: 'ok',
  },
  {
    persona: 'Graph Steward',
    work: 'Verifying affected services and stale edges',
    state: 'review',
    tone: 'warn',
  },
]

export const mcpServers = [
  {
    name: 'nornir-mcp',
    description: 'Inventory-backed network command and config planning.',
    status: 'healthy',
    source: 'github.com/ColtMercer/the-agentic-network-platform',
    tools: 7,
    identity: 'delegated OBO',
    policy: 'read default, write approval',
  },
  {
    name: 'knowledge-graph-mcp',
    description: 'Neo4j topology, ownership, and dependency queries.',
    status: 'healthy',
    source: 'git-backed manifest',
    tools: 9,
    identity: 'tenant scoped',
    policy: 'read default',
  },
  {
    name: 'docs-ingestion-mcp',
    description: 'Git and document ingestion pipeline.',
    status: 'warning',
    source: 'pending connector',
    tools: 5,
    identity: 'connector scoped',
    policy: 'review required',
  },
] as const

export const configSources: Array<{
  name: string
  repo: string
  path: string
  branch: string
  lastSync: string
  changePath: string
  status: string
  statusTone: Tone
}> = [
  {
    name: 'Persona registry',
    repo: 'ColtMercer/the-agentic-network-platform',
    path: 'agents/**/persona.yaml',
    branch: 'main',
    lastSync: '2 minutes ago',
    changePath: 'pull request',
    status: 'synced',
    statusTone: 'ok',
  },
  {
    name: 'MCP manifests',
    repo: 'ColtMercer/the-agentic-network-platform',
    path: 'projects/**/mcp.manifest.yaml',
    branch: 'main',
    lastSync: '7 minutes ago',
    changePath: 'pull request',
    status: 'synced',
    statusTone: 'ok',
  },
  {
    name: 'Runtime policy',
    repo: 'platform-security/policies',
    path: 'openshell/*.yaml',
    branch: 'release/lab',
    lastSync: 'pending approval',
    changePath: 'security review',
    status: 'blocked',
    statusTone: 'warn',
  },
]

export const auditEvents = [
  {
    id: 'aud-7f3c91',
    decision: 'allowed',
    detail: 'j.rivera -> nornir.command.run_readonly',
  },
  {
    id: 'aud-17ac22',
    decision: 'denied',
    detail: 'write action missing approval evidence',
  },
  {
    id: 'aud-0019bf',
    decision: 'allowed',
    detail: 'graph.query scoped to lab tenant',
  },
] as const

export const runtimeSandboxes: Array<{
  name: string
  policy: string
  status: string
  tone: Tone
  filesystem: string
  network: string
  inference: string
  sessions: string
}> = [
  {
    name: 'engineering-agent',
    policy: 'policies/openshell/network-engineering.yaml',
    status: 'healthy',
    tone: 'ok',
    filesystem: 'repo read, temp write',
    network: 'api, mcp broker',
    inference: 'private route',
    sessions: '3 active',
  },
  {
    name: 'operations-agent',
    policy: 'policies/openshell/network-operations.yaml',
    status: 'healthy',
    tone: 'ok',
    filesystem: 'evidence read/write',
    network: 'api, telemetry',
    inference: 'private route',
    sessions: '2 active',
  },
]

export const personas: Array<{
  name: string
  mission: string
  state: string
  tone: Tone
  capabilities: string[]
}> = [
  {
    name: 'Engineering Agent',
    mission: 'Design and validate network changes.',
    state: 'enabled',
    tone: 'ok',
    capabilities: ['nornir.config.plan', 'git.propose_change', 'graph.query'],
  },
  {
    name: 'Operations Agent',
    mission: 'Triage incidents and coordinate restore actions.',
    state: 'enabled',
    tone: 'ok',
    capabilities: ['telemetry.query', 'nornir.command.run_readonly', 'memory.recall'],
  },
  {
    name: 'Security Agent',
    mission: 'Review identity, policy, and risky tool use.',
    state: 'approval required',
    tone: 'warn',
    capabilities: ['policy.evaluate', 'audit.search', 'secrets.review'],
  },
]

export const settingsNav: Array<{
  key: SettingKey
  label: string
  description: string
}> = [
  {
    key: 'personas',
    label: 'Personas',
    description: 'Agent missions, skills, allowed tools, model routes, and approvals.',
  },
  {
    key: 'skills',
    label: 'Skills',
    description: 'Procedural packages, validators, examples, tests, and source policy.',
  },
  {
    key: 'mcp',
    label: 'MCP Servers and Tools',
    description: 'Capability manifests, tool schemas, health, identity scopes, and policies.',
  },
  {
    key: 'git',
    label: 'Git-backed Config',
    description: 'Configuration sources, sync status, proposed changes, diffs, and overrides.',
  },
  {
    key: 'identity',
    label: 'Identity and Delegation',
    description: 'On-behalf-of authorization, effective permissions, approvals, and audit.',
  },
  {
    key: 'runtime',
    label: 'OpenShell Runtime',
    description: 'Agent sandboxes, runtime policy, filesystem, network, and inference routing.',
  },
  {
    key: 'knowledge',
    label: 'Knowledge and Memory',
    description: 'Knowledge graph, RAG, episodic memory, provenance, and retention.',
  },
  {
    key: 'observability',
    label: 'Observability',
    description: 'Telemetry, traces, agent sessions, policy decisions, and evidence flows.',
  },
]
