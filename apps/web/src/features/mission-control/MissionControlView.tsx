import { useEffect, useMemo, useState } from "react";

import type { SetSidecarState } from "../../app/sidecar";
import {
  fetchDashboardSummary,
  fetchTaskEvents,
  transitionTask,
  type DashboardSummaryResponse,
  type TaskEventRecord,
  type TaskRecord
} from "../../shared/api";

const STATE_LABELS: Record<string, string> = {
  draft: "Draft",
  intake_review: "Intake Review",
  jurisdiction_pending: "Jurisdiction Pending",
  planning: "Planning",
  policy_review: "Policy Review",
  legal_review: "Legal Review",
  budget_or_security_review: "Budget or Security Review",
  approved_for_dispatch: "Approved for Dispatch",
  dispatched: "Dispatched",
  in_progress: "In Progress",
  waiting_external: "Waiting External",
  blocked: "Blocked",
  integration_review: "Integration Review",
  needs_rework: "Needs Rework",
  approved: "Approved",
  rolled_back: "Rolled Back",
  cancelled: "Cancelled",
  archived: "Archived"
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  draft: ["intake_review"],
  intake_review: ["jurisdiction_pending"],
  jurisdiction_pending: ["planning"],
  planning: [
    "policy_review",
    "legal_review",
    "budget_or_security_review",
    "approved_for_dispatch"
  ],
  policy_review: ["approved_for_dispatch", "needs_rework"],
  legal_review: ["approved_for_dispatch", "needs_rework"],
  budget_or_security_review: ["approved_for_dispatch", "needs_rework"],
  approved_for_dispatch: ["dispatched"],
  dispatched: ["in_progress"],
  in_progress: ["waiting_external", "blocked", "integration_review"],
  waiting_external: ["in_progress", "blocked", "cancelled"],
  blocked: ["in_progress", "cancelled"],
  integration_review: ["approved", "needs_rework", "rolled_back"],
  needs_rework: ["planning", "in_progress"],
  approved: ["archived"],
  rolled_back: ["archived"],
  cancelled: ["archived"],
  archived: []
};

type MissionControlViewProps = {
  setSidecar: SetSidecarState;
};

type MissionFilters = {
  query: string;
  entity: string;
  risk: string;
  reviewRequirement: string;
};

type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
};

type TaskCardProps = {
  task: TaskRecord;
  isSelected: boolean;
  onOpen: (taskId: string) => void;
};

type TimelineProps = {
  events: TaskEventRecord[];
  isLoading: boolean;
  error: string | null;
};

const EMPTY_FILTERS: MissionFilters = {
  query: "",
  entity: "all",
  risk: "all",
  reviewRequirement: "all"
};

function formatLabel(value: string) {
  return (
    STATE_LABELS[value] ??
    value.split("_").join(" ").replace(/\b\w/g, (char: string) => char.toUpperCase())
  );
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

function buildTaskSearchIndex(task: TaskRecord) {
  return [
    task.id,
    task.title,
    task.description,
    task.mission_type,
    task.owning_entity,
    task.initiating_entity,
    task.initiating_role,
    task.launch_context
  ]
    .join(" ")
    .toLowerCase();
}

function metricCards(summary: DashboardSummaryResponse) {
  return [
    {
      label: "Total Tasks",
      value: summary.metrics.total_tasks,
      detail: `${Object.keys(summary.metrics.tasks_by_state).length} tracked workflow states`
    },
    {
      label: "Awaiting Review",
      value: summary.metrics.awaiting_review,
      detail: "Tasks currently in review-oriented states"
    },
    {
      label: "Active Tasks",
      value: summary.metrics.active_tasks,
      detail: "Work that is dispatched, running, or blocked"
    },
    {
      label: "Blocked Tasks",
      value: summary.metrics.blocked_tasks,
      detail: "Items waiting for bridge, policy, or operator action"
    },
    {
      label: "Runtime Status",
      value: summary.runtime.status,
      detail: `${summary.runtime.bridge_status} bridge${summary.runtime.latest_error ? ` • ${summary.runtime.latest_error}` : ""}`
    }
  ];
}

function MissionMetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="metric-card">
      <p className="metric-card__label">{label}</p>
      <strong className="metric-card__value">{value}</strong>
      <span className="metric-card__detail">{detail}</span>
    </article>
  );
}

function MissionTaskCard({ task, isSelected, onOpen }: TaskCardProps) {
  const reviewSummary = task.review_requirements.length
    ? `${task.review_requirements.length} review gate${task.review_requirements.length > 1 ? "s" : ""}`
    : "No review gates";

  return (
    <button
      aria-label={`Open task ${task.id}`}
      className={`task-card${isSelected ? " task-card--selected" : ""}`}
      onClick={() => onOpen(task.id)}
      type="button"
    >
      <div className="task-card__header">
        <span className="task-card__meta">{task.id}</span>
        <span className={`tag tag--${task.risk_level}`}>{task.risk_level}</span>
      </div>
      <strong>{task.title}</strong>
      <p>{task.description || "No task description provided."}</p>
      <div className="task-card__footer">
        <span>{task.owning_entity || "Unassigned entity"}</span>
        <span>{reviewSummary}</span>
      </div>
    </button>
  );
}

function MissionTimeline({ events, isLoading, error }: TimelineProps) {
  if (isLoading) {
    return <p className="subtle-text">Loading task timeline…</p>;
  }

  if (error) {
    return <p className="error-banner">{error}</p>;
  }

  if (!events.length) {
    return <p className="subtle-text">No timeline events recorded for this task.</p>;
  }

  return (
    <ol className="timeline">
      {events.map((event) => (
        <li className="timeline__item" key={event.id}>
          <div className="timeline__meta">
            <span>{formatLabel(event.event_type)}</span>
            <span>{formatTimestamp(event.created_at)}</span>
          </div>
          <strong>{event.message}</strong>
          <p>{event.details}</p>
        </li>
      ))}
    </ol>
  );
}

export function MissionControlView({ setSidecar }: MissionControlViewProps) {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MissionFilters>(EMPTY_FILTERS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TaskEventRecord[]>([]);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const loadSummary = async () => {
    const payload = await fetchDashboardSummary();
    setSummary(payload);
    setError(null);
    return payload;
  };

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    loadSummary()
      .then((payload) => {
        if (cancelled) {
          return;
        }
        if (!selectedTaskId) {
          setSelectedTaskId(payload.tasks[0]?.id ?? null);
        }
      })
      .catch((reason: Error) => {
        if (cancelled) {
          return;
        }
        setError(reason.message);
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

  const filteredTasks = useMemo(() => {
    if (!summary) {
      return [];
    }

    const query = filters.query.trim().toLowerCase();
    return summary.tasks.filter((task) => {
      if (query && !buildTaskSearchIndex(task).includes(query)) {
        return false;
      }
      if (filters.entity !== "all" && task.owning_entity !== filters.entity) {
        return false;
      }
      if (filters.risk !== "all" && task.risk_level !== filters.risk) {
        return false;
      }
      if (
        filters.reviewRequirement !== "all" &&
        !task.review_requirements.includes(filters.reviewRequirement)
      ) {
        return false;
      }
      return true;
    });
  }, [filters, summary]);

  const columns = useMemo(() => {
    if (!summary) {
      return [];
    }

    return Object.keys(summary.metrics.tasks_by_state).map((state) => ({
      state,
      tasks: filteredTasks.filter((task) => task.state === state)
    }));
  }, [filteredTasks, summary]);

  useEffect(() => {
    if (!filteredTasks.length) {
      if (selectedTaskId !== null) {
        setSelectedTaskId(null);
      }
      return;
    }

    if (!selectedTaskId || !filteredTasks.some((task) => task.id === selectedTaskId)) {
      setSelectedTaskId(filteredTasks[0]?.id ?? null);
    }
  }, [filteredTasks, selectedTaskId]);

  useEffect(() => {
    setActionFeedback(null);
    setActionError(null);
  }, [selectedTaskId]);

  const selectedTask = useMemo(
    () => filteredTasks.find((task) => task.id === selectedTaskId) ?? null,
    [filteredTasks, selectedTaskId]
  );

  useEffect(() => {
    if (!selectedTask) {
      setTimeline([]);
      setTimelineError(null);
      setTimelineLoading(false);
      return;
    }

    let cancelled = false;

    setTimelineLoading(true);
    fetchTaskEvents(selectedTask.id)
      .then((items) => {
        if (cancelled) {
          return;
        }
        setTimeline(items);
        setTimelineError(null);
      })
      .catch((reason: Error) => {
        if (cancelled) {
          return;
        }
        setTimeline([]);
        setTimelineError(reason.message);
      })
      .finally(() => {
        if (!cancelled) {
          setTimelineLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTask]);

  useEffect(() => {
    if (!summary) {
      return;
    }

    if (!selectedTask) {
      setSidecar({
        eyebrow: "Mission Overview",
        title: "Mission Focus",
        description: `${filteredTasks.length} tasks match the current filters.`,
        content: (
          <>
            <div className="detail-grid">
              <div>
                <span className="detail-grid__label">Entities</span>
                <strong>{Object.keys(summary.metrics.tasks_by_entity).length}</strong>
              </div>
              <div>
                <span className="detail-grid__label">Review Gates</span>
                <strong>{summary.metrics.review_requirements.length}</strong>
              </div>
            </div>
            <h4 className="section-heading">Recent Activity</h4>
            <MissionTimeline
              error={null}
              events={summary.recent_events}
              isLoading={false}
            />
          </>
        )
      });
      return;
    }

    setSidecar({
      eyebrow: selectedTask.id,
      title: selectedTask.title,
      description: `${formatLabel(selectedTask.state)} • ${selectedTask.risk_level} risk • ${selectedTask.owning_entity || "unassigned"}`,
      content: (
        <>
          <div className="detail-grid">
            <div>
              <span className="detail-grid__label">Mission Type</span>
              <strong>{selectedTask.mission_type}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Initiating Role</span>
              <strong>{selectedTask.initiating_role || "Not captured"}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Created</span>
              <strong>{formatTimestamp(selectedTask.created_at)}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Updated</span>
              <strong>{formatTimestamp(selectedTask.updated_at)}</strong>
            </div>
          </div>
          <h4 className="section-heading">Launch Context</h4>
          <p className="sidecar-description">
            {selectedTask.launch_context || "No launch context was recorded for this task."}
          </p>
          <h4 className="section-heading">Review Requirements</h4>
          <div className="tag-row">
            {(selectedTask.review_requirements.length
              ? selectedTask.review_requirements
              : ["none"]
            ).map((requirement) => (
              <span className="tag tag--neutral" key={requirement}>
                {requirement}
              </span>
            ))}
          </div>
          <h4 className="section-heading">Next Actions</h4>
          {actionFeedback ? <p className="success-banner">{actionFeedback}</p> : null}
          {actionError ? <p className="error-banner">{actionError}</p> : null}
          <div className="tag-row">
            {(ALLOWED_TRANSITIONS[selectedTask.state] ?? []).length ? (
              (ALLOWED_TRANSITIONS[selectedTask.state] ?? []).map((state) => (
                <button
                  className="secondary-button"
                  disabled={isTransitioning}
                  key={state}
                  onClick={async () => {
                    setIsTransitioning(true);
                    setActionFeedback(null);
                    setActionError(null);
                    try {
                      await transitionTask(selectedTask.id, {
                        to_state: state as typeof selectedTask.state
                      });
                      await loadSummary();
                      const items = await fetchTaskEvents(selectedTask.id);
                      setTimeline(items);
                      setTimelineError(null);
                      setActionFeedback(`Task ${selectedTask.id} moved to ${state}.`);
                    } catch (reason) {
                      setActionError(
                        reason instanceof Error ? reason.message : "Task transition failed."
                      );
                    } finally {
                      setIsTransitioning(false);
                    }
                  }}
                  type="button"
                >
                  {`Move to ${formatLabel(state)}`}
                </button>
              ))
            ) : (
              <span className="subtle-text">No legal transitions available from this state.</span>
            )}
          </div>
          <h4 className="section-heading">Timeline</h4>
          <MissionTimeline
            error={timelineError}
            events={timeline}
            isLoading={timelineLoading}
          />
        </>
      )
    });
  }, [
    actionFeedback,
    actionError,
    filteredTasks.length,
    isTransitioning,
    selectedTask,
    setSidecar,
    summary,
    timeline,
    timelineError,
    timelineLoading
  ]);

  const entities = summary ? Object.keys(summary.metrics.tasks_by_entity) : [];
  const risks = summary ? Object.keys(summary.metrics.tasks_by_risk) : [];
  const reviewRequirements = summary?.metrics.review_requirements ?? [];

  return (
    <section className="panel panel--main">
      <div className="section-header">
        <div>
          <h2>Mission Control</h2>
          <p className="section-intro">
            Dashboard telemetry, grouped kanban lanes, and operator-focused task inspection in one place.
          </p>
        </div>
        <button
          className="secondary-button"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            setActionFeedback(null);
            setActionError(null);
            try {
              await loadSummary();
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : "Dashboard refresh failed.");
            } finally {
              setIsLoading(false);
            }
          }}
          type="button"
        >
          Refresh Dashboard
        </button>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}
      {isLoading ? <p className="subtle-text">Loading mission dashboard…</p> : null}

      {summary ? (
        <>
          <div className="metrics-grid">
            {metricCards(summary).map((metric) => (
              <MissionMetricCard
                detail={metric.detail}
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>

          <div className="filter-grid">
            <label className="field">
              <span>Keyword</span>
              <input
                onChange={(event) =>
                  setFilters((current) => ({ ...current, query: event.target.value }))
                }
                placeholder="Search task id, title, entity, or context"
                type="search"
                value={filters.query}
              />
            </label>
            <label className="field">
              <span>Owning Entity</span>
              <select
                onChange={(event) =>
                  setFilters((current) => ({ ...current, entity: event.target.value }))
                }
                value={filters.entity}
              >
                <option value="all">All entities</option>
                {entities.map((entity) => (
                  <option key={entity} value={entity}>
                    {entity}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Risk Level</span>
              <select
                onChange={(event) =>
                  setFilters((current) => ({ ...current, risk: event.target.value }))
                }
                value={filters.risk}
              >
                <option value="all">All risks</option>
                {risks.map((risk) => (
                  <option key={risk} value={risk}>
                    {risk}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Review Requirement</span>
              <select
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    reviewRequirement: event.target.value
                  }))
                }
                value={filters.reviewRequirement}
              >
                <option value="all">All review gates</option>
                {reviewRequirements.map((requirement) => (
                  <option key={requirement} value={requirement}>
                    {formatLabel(requirement)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="kanban-grid">
            {columns.map((column) => (
              <section className="kanban-column" key={column.state}>
                <header className="kanban-column__header">
                  <h3>{formatLabel(column.state)}</h3>
                  <span>{column.tasks.length}</span>
                </header>
                <div className="kanban-column__body">
                  {column.tasks.length ? (
                    column.tasks.map((task) => (
                      <MissionTaskCard
                        isSelected={task.id === selectedTaskId}
                        key={task.id}
                        onOpen={setSelectedTaskId}
                        task={task}
                      />
                    ))
                  ) : (
                    <p className="subtle-text">No tasks in this lane with the current filters.</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
