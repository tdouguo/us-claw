const TABS = [
  "Mission Control",
  "Organization",
  "OpenClaw Runtime"
];

export function App() {
  return (
    <div className="shell">
      <header className="shell__header">
        <div>
          <p className="eyebrow">US Claw Control Plane</p>
          <h1>Mission / Organization / Runtime Unified Console</h1>
        </div>
        <div className="status-card">
          <span className="status-dot" />
          Runtime skeleton initialized
        </div>
      </header>
      <nav className="tabs" aria-label="Primary views">
        {TABS.map((tab) => (
          <button className="tab" key={tab} type="button">
            {tab}
          </button>
        ))}
      </nav>
      <main className="layout">
        <section className="panel panel--main">
          <h2>Control Plane Skeleton</h2>
          <p>
            当前阶段只初始化三页签统一控制台骨架。后续任务会依次接入任务编排、
            组织角色浏览、OpenClaw bridge 与运行时监控。
          </p>
          <ul>
            <li>Mission Control: 任务编排、审批链、回滚链</li>
            <li>Organization: 实体/岗位/角色详情与任务入口</li>
            <li>OpenClaw Runtime: 安装、bridge、workspace 与节点状态</li>
          </ul>
        </section>
        <aside className="panel panel--side">
          <h2>Reserved Sidecar Areas</h2>
          <ul>
            <li>Role details drawer</li>
            <li>Task event stream</li>
            <li>Runtime node cards</li>
            <li>Logs / terminal panel</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
