import { useEffect, useMemo, useState } from "react";

import type { SetSidecarState, SidecarState } from "./sidecar";
import { MissionControlView } from "../features/mission-control/MissionControlView";
import { OrganizationView } from "../features/organization/OrganizationView";
import { RuntimeView } from "../features/runtime/RuntimeView";

type TabId = "mission-control" | "organization" | "runtime";

type TabViewProps = {
  setSidecar: SetSidecarState;
};

const DEFAULT_SIDECARS: Record<TabId, SidecarState> = {
  "mission-control": {
    eyebrow: "Mission Overview",
    title: "Mission Focus",
    description: "Select a task card to inspect owners, review gates, and timeline activity.",
    content: (
      <ul className="sidecar-list">
        <li>Summary metrics for total, review, active, and blocked work.</li>
        <li>Kanban columns grouped by control-plane task state.</li>
        <li>Task-level details and timeline once a card is opened.</li>
      </ul>
    )
  },
  organization: {
    eyebrow: "Organization Intel",
    title: "Role Intelligence",
    description: "Browse an entity, inspect the selected role, and launch mission work from it.",
    content: (
      <ul className="sidecar-list">
        <li>Entity and role context comes from the control-plane catalog.</li>
        <li>Role metadata stays visible while the launch form is prepared.</li>
        <li>Successful task launches feed back into the current view.</li>
      </ul>
    )
  },
  runtime: {
    eyebrow: "Runtime Observer",
    title: "Runtime Health",
    description: "Track installation, bridge reachability, workspace registration, and recent telemetry.",
    content: (
      <ul className="sidecar-list">
        <li>Status cards summarize install, bridge, and workspace readiness.</li>
        <li>Recent events and logs can be inspected without leaving the tab.</li>
        <li>Errors surface as a dedicated summary instead of getting buried in logs.</li>
      </ul>
    )
  }
};

const TABS: Array<{
  id: TabId;
  hash: string;
  label: string;
  render: (props: TabViewProps) => JSX.Element;
}> = [
  {
    id: "mission-control",
    hash: "",
    label: "Mission Control",
    render: ({ setSidecar }) => <MissionControlView setSidecar={setSidecar} />
  },
  {
    id: "organization",
    hash: "#organization",
    label: "Organization",
    render: ({ setSidecar }) => <OrganizationView setSidecar={setSidecar} />
  },
  {
    id: "runtime",
    hash: "#runtime",
    label: "OpenClaw Runtime",
    render: ({ setSidecar }) => <RuntimeView setSidecar={setSidecar} />
  }
];

function tabFromHash(hash: string) {
  return TABS.find((tab) => tab.hash === hash) ?? TABS[0];
}

export function App() {
  const [activeTabId, setActiveTabId] = useState<TabId>(() => tabFromHash(window.location.hash).id);
  const [sidecar, setSidecar] = useState<SidecarState>(() => DEFAULT_SIDECARS[activeTabId]);

  useEffect(() => {
    const onHashChange = () => {
      setActiveTabId(tabFromHash(window.location.hash).id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const activeTab = useMemo(
    () => TABS.find((tab) => tab.id === activeTabId) ?? TABS[0],
    [activeTabId]
  );

  useEffect(() => {
    setSidecar(DEFAULT_SIDECARS[activeTab.id]);
  }, [activeTab.id]);

  const handleTabChange = (tabId: TabId) => {
    const target = TABS.find((tab) => tab.id === tabId) ?? TABS[0];
    window.history.replaceState({}, "", target.hash || "/");
    setActiveTabId(target.id);
  };

  return (
    <div className="shell">
      <header className="shell__header">
        <div>
          <p className="eyebrow">US Claw Control Plane</p>
          <h1>Mission / Organization / Runtime Unified Console</h1>
        </div>
        <div className="status-card">
          <span className="status-dot" />
          Dynamic observer sidecar online
        </div>
      </header>
      <nav className="tabs" aria-label="Primary views" role="tablist">
        {TABS.map((tab) => (
          <button
            aria-selected={activeTab.id === tab.id}
            className={`tab${activeTab.id === tab.id ? " tab--active" : ""}`}
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="layout">
        {activeTab.render({ setSidecar })}
        <aside className="panel panel--side">
          <p className="eyebrow eyebrow--compact">{sidecar.eyebrow}</p>
          <h2>Observer Sidecar</h2>
          <h3 className="sidecar-title">{sidecar.title}</h3>
          {sidecar.description ? <p className="sidecar-description">{sidecar.description}</p> : null}
          {sidecar.content}
        </aside>
      </main>
    </div>
  );
}
