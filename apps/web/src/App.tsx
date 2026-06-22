import {
  Activity,
  Boxes,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  GitBranch,
  GitPullRequestArrow,
  History,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  RadioTower,
  ScrollText,
  Search,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
  UsersRound,
  Workflow,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'
import {
  a2aTasks,
  auditEvents,
  configSources,
  evidenceItems,
  mcpServers,
  personas,
  runtimeSandboxes,
  settingsNav,
  topologyNodes,
  type SettingKey,
} from './platformData'

const settingIcons: Record<SettingKey, React.ComponentType<{ size?: number }>> = {
  personas: UsersRound,
  skills: ScrollText,
  mcp: Boxes,
  git: GitBranch,
  identity: KeyRound,
  runtime: TerminalSquare,
  knowledge: Brain,
  observability: Activity,
}

function getInitialView(): 'console' | 'settings' {
  const view = new URLSearchParams(globalThis.location.search).get('view')
  return view === 'settings' ? 'settings' : 'console'
}

function getInitialSetting(): SettingKey {
  const setting = new URLSearchParams(globalThis.location.search).get('setting')
  return settingsNav.some((item) => item.key === setting)
    ? (setting as SettingKey)
    : 'mcp'
}

function App() {
  const [view, setView] = useState<'console' | 'settings'>(getInitialView)
  const [setting, setSetting] = useState<SettingKey>(getInitialSetting)

  const activeServerCount = useMemo(
    () => mcpServers.filter((server) => server.status === 'healthy').length,
    [],
  )

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div>
            <strong>NetMesh</strong>
            <span>Agentic Network Platform</span>
          </div>
        </div>

        <nav className="primary-nav" aria-label="Primary">
          <button
            className={view === 'console' ? 'active' : ''}
            type="button"
            onClick={() => setView('console')}
          >
            <RadioTower size={17} />
            Operations Console
          </button>
          <button
            className={view === 'settings' ? 'active' : ''}
            type="button"
            onClick={() => setView('settings')}
          >
            <ServerCog size={17} />
            Settings
          </button>
        </nav>

        <div className="sidebar-section">
          <p>Runtime</p>
          <StatusPill tone="ok" label="Broker healthy" />
          <StatusPill tone="warn" label="Lab environment" />
          <StatusPill tone="info" label="OpenShell workers 4" />
        </div>

        <div className="identity-card">
          <div>
            <span>Acting user</span>
            <strong>j.rivera</strong>
          </div>
          <em>OBO</em>
        </div>
      </aside>

      <section
        className={`workspace ${
          view === 'console' ? 'workspace-dark' : 'workspace-light'
        }`}
      >
        <TopBar
          activeServerCount={activeServerCount}
          view={view}
          onSwitch={setView}
        />
        {view === 'console' ? (
          <OperationsConsole />
        ) : (
          <SettingsWorkspace active={setting} onChange={setSetting} />
        )}
      </section>
    </main>
  )
}

function TopBar({
  activeServerCount,
  view,
  onSwitch,
}: {
  activeServerCount: number
  view: 'console' | 'settings'
  onSwitch: (view: 'console' | 'settings') => void
}) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">The Agentic Network Platform</span>
        <h1>{view === 'console' ? 'Operations Console' : 'Platform Settings'}</h1>
      </div>
      <div className="topbar-actions">
        <div className="segmented" aria-label="Workspace view">
          <button
            className={view === 'console' ? 'selected' : ''}
            type="button"
            onClick={() => onSwitch('console')}
          >
            Console
          </button>
          <button
            className={view === 'settings' ? 'selected' : ''}
            type="button"
            onClick={() => onSwitch('settings')}
          >
            Settings
          </button>
        </div>
        <div className="system-chip">
          <CheckCircle2 size={15} />
          {activeServerCount} MCP servers healthy
        </div>
      </div>
    </header>
  )
}

function OperationsConsole() {
  return (
    <div className="console-grid">
      <section className="chat-panel">
        <PanelHeader
          icon={Workflow}
          title="Coordinator Agent"
          meta="9 personas online"
          tone="dark"
        />
        <div className="message-list">
          <div className="message user-message">
            <span>You - 14:02</span>
            <p>
              core-rtr-02 keeps dropping its eBGP session to the upstream
              provider AS65010. Investigate and show me the topology around it.
            </p>
          </div>

          <div className="message agent-message">
            <div className="agent-avatar">C</div>
            <div>
              <span>Coordinator - Engineering, Operations, Graph Steward</span>
              <p>
                I queried topology, ran read-only Nornir collection, checked
                telemetry, and found related config drift near the uplink path.
              </p>
              <div className="evidence-stack">
                {evidenceItems.map((item) => (
                  <EvidenceCard key={item.id} item={item} />
                ))}
              </div>
              <div className="audit-strip">
                <span>audit aud-7f3c91</span>
                <span>identity j.rivera OBO</span>
                <span>policy read-only</span>
              </div>
            </div>
          </div>
        </div>
        <div className="composer">
          <Search size={16} />
          <span>Ask the agent to continue with a safe next step...</span>
        </div>
      </section>

      <section className="right-rail">
        <TopologyPanel />
        <TaskBoard />
        <DeploymentBoundary />
      </section>
    </div>
  )
}

function EvidenceCard({
  item,
}: {
  item: (typeof evidenceItems)[number]
}) {
  return (
    <article className={`evidence-card ${item.severity}`}>
      <div>
        <strong>{item.source}</strong>
        <span>{item.target}</span>
      </div>
      <code>{item.summary}</code>
    </article>
  )
}

function TopologyPanel() {
  return (
    <article className="panel topology-panel">
      <PanelHeader icon={Network} title="Neo4j topology snapshot" meta="14:01" />
      <div className="topology-canvas" aria-label="Topology around core-rtr-02">
        <div className="topology-link link-a" />
        <div className="topology-link link-b" />
        <div className="topology-link link-c" />
        {topologyNodes.map((node) => (
          <div
            className={`topology-node ${node.state}`}
            key={node.id}
            style={{ left: node.x, top: node.y }}
          >
            <span>{node.name}</span>
            <em>{node.role}</em>
          </div>
        ))}
      </div>
    </article>
  )
}

function TaskBoard() {
  return (
    <article className="panel">
      <PanelHeader icon={Layers3} title="A2A task board" meta="live" />
      <div className="task-list">
        {a2aTasks.map((task) => (
          <div className="task-row" key={task.persona}>
            <div>
              <strong>{task.persona}</strong>
              <span>{task.work}</span>
            </div>
            <StatusPill tone={task.tone} label={task.state} />
          </div>
        ))}
      </div>
    </article>
  )
}

function DeploymentBoundary() {
  return (
    <article className="panel boundary-panel">
      <PanelHeader icon={ShieldCheck} title="Deployment boundary" meta="draft" />
      <div className="boundary-flow">
        <BoundaryNode icon={Code2} title="Web UI" subtitle="Dedicated service" />
        <ChevronRight size={18} />
        <BoundaryNode icon={LockKeyhole} title="Platform API" subtitle="OBO authz" />
        <ChevronRight size={18} />
        <BoundaryNode icon={TerminalSquare} title="OpenShell" subtitle="Agent runtime" />
      </div>
      <p>
        The UI is intentionally separate from OpenShell sandboxes. It calls the
        platform API with delegated identity while agents execute behind runtime
        policy.
      </p>
    </article>
  )
}

function BoundaryNode({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ size?: number }>
  title: string
  subtitle: string
}) {
  return (
    <div className="boundary-node">
      <Icon size={17} />
      <strong>{title}</strong>
      <span>{subtitle}</span>
    </div>
  )
}

function SettingsWorkspace({
  active,
  onChange,
}: {
  active: SettingKey
  onChange: (key: SettingKey) => void
}) {
  return (
    <div className="settings-layout">
      <aside className="settings-nav" aria-label="Settings">
        {settingsNav.map((item) => {
          const Icon = settingIcons[item.key]
          return (
            <button
              className={active === item.key ? 'active' : ''}
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </aside>
      <section className="settings-content">
        <SettingsSummary active={active} />
        <SettingsPanel active={active} />
      </section>
    </div>
  )
}

function SettingsSummary({ active }: { active: SettingKey }) {
  const item = settingsNav.find((entry) => entry.key === active) ?? settingsNav[0]
  return (
    <div className="settings-heading">
      <span className="eyebrow">Configuration</span>
      <h2>{item.label}</h2>
      <p>{item.description}</p>
    </div>
  )
}

function SettingsPanel({ active }: { active: SettingKey }) {
  if (active === 'mcp') return <McpSettings />
  if (active === 'git') return <GitSettings />
  if (active === 'identity') return <IdentitySettings />
  if (active === 'runtime') return <RuntimeSettings />
  if (active === 'personas') return <PersonaSettings />
  return <GeneralSettings active={active} />
}

function McpSettings() {
  return (
    <div className="content-grid">
      {mcpServers.map((server) => (
        <article className="panel light-card" key={server.name}>
          <div className="card-title-row">
            <div>
              <strong>{server.name}</strong>
              <span>{server.description}</span>
            </div>
            <StatusPill tone={server.status === 'healthy' ? 'ok' : 'warn'} label={server.status} />
          </div>
          <dl className="metadata-grid">
            <div>
              <dt>Source</dt>
              <dd>{server.source}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>{server.tools}</dd>
            </div>
            <div>
              <dt>Identity</dt>
              <dd>{server.identity}</dd>
            </div>
            <div>
              <dt>Policy</dt>
              <dd>{server.policy}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function GitSettings() {
  return (
    <div className="content-grid">
      {configSources.map((source) => (
        <article className="panel light-card" key={source.name}>
          <div className="card-title-row">
            <div>
              <strong>{source.name}</strong>
              <span>{source.path}</span>
            </div>
            <StatusPill tone={source.statusTone} label={source.status} />
          </div>
          <dl className="metadata-grid">
            <div>
              <dt>Repository</dt>
              <dd>{source.repo}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{source.branch}</dd>
            </div>
            <div>
              <dt>Last sync</dt>
              <dd>{source.lastSync}</dd>
            </div>
            <div>
              <dt>Change path</dt>
              <dd>{source.changePath}</dd>
            </div>
          </dl>
        </article>
      ))}
      <article className="panel light-card callout-card">
        <GitPullRequestArrow size={20} />
        <div>
          <strong>Preferred write path</strong>
          <p>
            UI edits should create Git changes and pull requests. Runtime-only
            overrides stay scoped, audited, and time-bound.
          </p>
        </div>
      </article>
    </div>
  )
}

function IdentitySettings() {
  return (
    <div className="content-grid two-column">
      <article className="panel light-card">
        <PanelHeader icon={KeyRound} title="Delegated identity envelope" meta="required" />
        <ul className="check-list">
          <li>User, groups, tenant, session, and request ID</li>
          <li>Persona, MCP server, target, action, and runtime policy</li>
          <li>Downstream identity mode and approval evidence</li>
        </ul>
      </article>
      <article className="panel light-card">
        <PanelHeader icon={History} title="Recent audit decisions" meta="live" />
        <div className="audit-list">
          {auditEvents.map((event) => (
            <div className="audit-row" key={event.id}>
              <span>{event.id}</span>
              <strong>{event.decision}</strong>
              <em>{event.detail}</em>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

function RuntimeSettings() {
  return (
    <div className="content-grid">
      {runtimeSandboxes.map((sandbox) => (
        <article className="panel light-card" key={sandbox.name}>
          <div className="card-title-row">
            <div>
              <strong>{sandbox.name}</strong>
              <span>{sandbox.policy}</span>
            </div>
            <StatusPill tone={sandbox.tone} label={sandbox.status} />
          </div>
          <dl className="metadata-grid">
            <div>
              <dt>Filesystem</dt>
              <dd>{sandbox.filesystem}</dd>
            </div>
            <div>
              <dt>Network</dt>
              <dd>{sandbox.network}</dd>
            </div>
            <div>
              <dt>Inference</dt>
              <dd>{sandbox.inference}</dd>
            </div>
            <div>
              <dt>Sessions</dt>
              <dd>{sandbox.sessions}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function PersonaSettings() {
  return (
    <div className="content-grid">
      {personas.map((persona) => (
        <article className="panel light-card" key={persona.name}>
          <div className="card-title-row">
            <div>
              <strong>{persona.name}</strong>
              <span>{persona.mission}</span>
            </div>
            <StatusPill tone={persona.tone} label={persona.state} />
          </div>
          <div className="tag-row">
            {persona.capabilities.map((capability) => (
              <span key={capability}>{capability}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

function GeneralSettings({ active }: { active: SettingKey }) {
  const item = settingsNav.find((entry) => entry.key === active) ?? settingsNav[0]
  return (
    <article className="panel light-card callout-card">
      <Clock3 size={20} />
      <div>
        <strong>{item.label} implementation queue</strong>
        <p>
          This surface is tracked as a follow-on issue. The app shell already
          defines the route, navigation, and configuration category.
        </p>
      </div>
    </article>
  )
}

function PanelHeader({
  icon: Icon,
  title,
  meta,
  tone = 'light',
}: {
  icon: React.ComponentType<{ size?: number }>
  title: string
  meta: string
  tone?: 'light' | 'dark'
}) {
  return (
    <div className={`panel-header ${tone}`}>
      <div>
        <Icon size={17} />
        <strong>{title}</strong>
      </div>
      <span>{meta}</span>
    </div>
  )
}

function StatusPill({
  tone,
  label,
}: {
  tone: 'ok' | 'warn' | 'danger' | 'info'
  label: string
}) {
  return <span className={`status-pill ${tone}`}>{label}</span>
}

export default App
