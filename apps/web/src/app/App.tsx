import { useEffect, useMemo, useState } from "react";

import { MissionControlView } from "../features/mission-control/MissionControlView";
import { OrganizationView } from "../features/organization/OrganizationView";
import { RuntimeView } from "../features/runtime/RuntimeView";

const TABS = [
  {
    id: "mission-control",
    hash: "",
    label: "Mission Control",
    render: () => <MissionControlView />
  },
  {
    id: "organization",
    hash: "#organization",
    label: "Organization",
    render: () => <OrganizationView />
  },
  {
    id: "runtime",
    hash: "#runtime",
    label: "OpenClaw Runtime",
    render: () => <RuntimeView />
  }
] as const;

function tabFromHash(hash: string) {
  return TABS.find((tab) => tab.hash === hash) ?? TABS[0];
}

export function App() {
  const [activeTabId, setActiveTabId] = useState(() => tabFromHash(window.location.hash).id);

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

  const handleTabChange = (tabId: (typeof TABS)[number]["id"]) => {
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
          Runtime skeleton initialized
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
        {activeTab.render()}
        <aside className="panel panel--side">
          <h2>Observer Sidecar</h2>
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
