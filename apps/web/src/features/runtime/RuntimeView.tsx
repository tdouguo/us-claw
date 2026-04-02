import { useEffect, useMemo, useState } from "react";

import type { SetSidecarState } from "../../app/sidecar";
import {
  fetchRuntimeEvents,
  fetchRuntimeLogs,
  fetchRuntimeStatus,
  type RuntimeEventRecord,
  type RuntimeLogRecord,
  type RuntimeStatusResponse
} from "../../shared/api";

type RuntimeViewProps = {
  setSidecar: SetSidecarState;
};

type RuntimeSelection =
  | { type: "event"; item: RuntimeEventRecord }
  | { type: "log"; item: RuntimeLogRecord }
  | null;

type StatusCardProps = {
  label: string;
  value: string | number;
  detail: string;
};

function formatTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString() : "n/a";
}

function messageFromReason(reason: unknown) {
  return reason instanceof Error ? reason.message : "Runtime telemetry request failed.";
}

function RuntimeStatusCard({ label, value, detail }: StatusCardProps) {
  return (
    <article className="metric-card">
      <p className="metric-card__label">{label}</p>
      <strong className="metric-card__value">{value}</strong>
      <span className="metric-card__detail">{detail}</span>
    </article>
  );
}

function runtimeCards(status: RuntimeStatusResponse) {
  return [
    {
      label: "Installation",
      value: status.installed ? "Installed" : "Missing",
      detail: status.openclaw_home
    },
    {
      label: "Bridge",
      value: status.bridge_status,
      detail: status.bridge_url
    },
    {
      label: "Workspace",
      value: status.workspace_registered ? "Registered" : "Pending",
      detail: status.openclaw_workspace_path
    },
    {
      label: "Tracked Tasks",
      value: status.task_count,
      detail: `${status.entity_count} entities in the catalog`
    }
  ];
}

export function RuntimeView({ setSidecar }: RuntimeViewProps) {
  const [status, setStatus] = useState<RuntimeStatusResponse | null>(null);
  const [events, setEvents] = useState<RuntimeEventRecord[]>([]);
  const [logs, setLogs] = useState<RuntimeLogRecord[]>([]);
  const [selection, setSelection] = useState<RuntimeSelection>(null);
  const [error, setError] = useState<string | null>(null);
  const [telemetryWarning, setTelemetryWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    Promise.allSettled([fetchRuntimeStatus(), fetchRuntimeEvents(), fetchRuntimeLogs()])
      .then(([statusPayload, eventPayload, logPayload]) => {
        if (!cancelled) {
          if (statusPayload.status === "rejected") {
            setStatus(null);
            setEvents([]);
            setLogs([]);
            setTelemetryWarning(null);
            setError(messageFromReason(statusPayload.reason));
            return;
          }

          setStatus(statusPayload.value);
          setEvents(eventPayload.status === "fulfilled" ? eventPayload.value : []);
          setLogs(logPayload.status === "fulfilled" ? logPayload.value : []);
          const warnings: string[] = [];
          if (eventPayload.status === "rejected") {
            warnings.push(`Runtime events unavailable: ${messageFromReason(eventPayload.reason)}`);
          }
          if (logPayload.status === "rejected") {
            warnings.push(`Runtime logs unavailable: ${messageFromReason(logPayload.reason)}`);
          }
          setTelemetryWarning(warnings.length ? warnings.join(" ") : null);
          setError(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const errorSummary = useMemo(() => {
    if (!status) {
      return [];
    }

    const items: Array<{ id: string; message: string }> = [];
    if (status.latest_error) {
      items.push({ id: "latest", message: status.latest_error });
    }
    events.forEach((event, index) => {
      if (event.level === "error" || event.level === "warn") {
        items.push({ id: `event-${index}`, message: `Event signal: ${event.message}` });
      }
    });
    logs.forEach((log, index) => {
      if (log.level === "error" || log.level === "warn") {
        items.push({ id: `log-${index}`, message: `Log signal: ${log.message}` });
      }
    });
    return items;
  }, [events, logs, status]);

  useEffect(() => {
    if (!status) {
      return;
    }

    if (selection?.type === "event") {
      setSidecar({
        eyebrow: "Runtime Event",
        title: selection.item.event_type,
        description: `${selection.item.level} • ${formatTimestamp(selection.item.timestamp)}`,
        content: <p className="sidecar-description">{selection.item.message}</p>
      });
      return;
    }

    if (selection?.type === "log") {
      setSidecar({
        eyebrow: "Runtime Log",
        title: selection.item.source || "runtime",
        description: `${selection.item.level} • ${formatTimestamp(selection.item.timestamp)}`,
        content: <p className="sidecar-description">{selection.item.message}</p>
      });
      return;
    }

    setSidecar({
      eyebrow: "Runtime Observer",
      title: "Runtime Health",
      description: `${status.status} • ${status.bridge_status} bridge`,
      content: (
        <>
          <div className="detail-grid">
            <div>
              <span className="detail-grid__label">Workspace</span>
              <strong>{status.workspace_path}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Latest Sync</span>
              <strong>{formatTimestamp(status.latest_sync_at)}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Database</span>
              <strong>{status.database_path}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Errors</span>
              <strong>{errorSummary.length}</strong>
            </div>
          </div>
        </>
      )
    });
  }, [errorSummary.length, selection, setSidecar, status]);

  return (
    <section className="panel panel--main">
      <div className="section-header">
        <div>
          <h2>OpenClaw Runtime</h2>
          <p className="section-intro">
            Watch install status, bridge reachability, workspace registration, and recent telemetry.
          </p>
        </div>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}
      {telemetryWarning ? <p className="error-banner">{telemetryWarning}</p> : null}
      {isLoading ? <p className="subtle-text">Loading runtime telemetry…</p> : null}

      {status ? (
        <>
          <div className="metrics-grid">
            {runtimeCards(status).map((card) => (
              <RuntimeStatusCard
                detail={card.detail}
                key={card.label}
                label={card.label}
                value={card.value}
              />
            ))}
          </div>

          {errorSummary.length ? (
            <section className="runtime-error-summary">
              <h3>Error Summary</h3>
              <ul className="stack">
                {errorSummary.map((item) => (
                  <li className="error-banner" key={item.id}>
                    {item.message}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="runtime-grid">
            <section className="runtime-panel">
              <div className="org-panel__header">
                <h3>Recent Events</h3>
                <span className="subtle-text">{events.length} items</span>
              </div>
              <div className="stack">
                {events.length ? (
                  events.map((event) => (
                    <button
                      className="runtime-item"
                      key={`${event.event_type}-${event.timestamp}`}
                      onClick={() => setSelection({ type: "event", item: event })}
                      type="button"
                    >
                      <div className="runtime-item__header">
                        <strong>{event.message}</strong>
                        <span>{event.level}</span>
                      </div>
                      <span>{event.event_type}</span>
                      <span>{formatTimestamp(event.timestamp)}</span>
                    </button>
                  ))
                ) : (
                  <p className="subtle-text">No runtime events are currently available.</p>
                )}
              </div>
            </section>

            <section className="runtime-panel">
              <div className="org-panel__header">
                <h3>Recent Logs</h3>
                <span className="subtle-text">{logs.length} items</span>
              </div>
              <div className="stack">
                {logs.length ? (
                  logs.map((log) => (
                    <button
                      className="runtime-item"
                      key={`${log.message}-${log.timestamp}`}
                      onClick={() => setSelection({ type: "log", item: log })}
                      type="button"
                    >
                      <div className="runtime-item__header">
                        <strong>{log.message}</strong>
                        <span>{log.level}</span>
                      </div>
                      <span>{log.source || "runtime"}</span>
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </button>
                  ))
                ) : (
                  <p className="subtle-text">No runtime logs are currently available.</p>
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </section>
  );
}
