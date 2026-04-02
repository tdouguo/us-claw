export type TaskState =
  | "draft"
  | "intake_review"
  | "jurisdiction_pending"
  | "planning"
  | "policy_review"
  | "legal_review"
  | "budget_or_security_review"
  | "approved_for_dispatch"
  | "dispatched"
  | "in_progress"
  | "waiting_external"
  | "blocked"
  | "integration_review"
  | "needs_rework"
  | "approved"
  | "rolled_back"
  | "cancelled"
  | "archived";

export type TaskRecord = {
  id: string;
  title: string;
  description: string;
  mission_type: string;
  risk_level: string;
  owning_entity: string;
  initiating_entity: string;
  initiating_role: string;
  launch_context: string;
  review_requirements: string[];
  state: TaskState;
  created_at: string;
  updated_at: string;
};

export type TaskEventRecord = {
  id: string;
  task_id: string;
  task_title: string;
  event_type: string;
  message: string;
  details: string;
  from_state: TaskState | "";
  to_state: TaskState;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type EntitySummary = {
  entity_slug: string;
  phase: string;
  entity_type: string;
  role_count: number;
  status: string;
};

export type RoleRecord = {
  entity_slug: string;
  role_slug: string;
  title_cn: string;
  title_en: string;
  entity_cn: string;
  entity_en: string;
  reference_level: string;
  reference_level_name: string;
  phase: string;
  entity_type: string;
  status: string;
  path: string;
  family?: string;
  appointment_type?: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  mission_type?: string;
  risk_level?: string;
  owning_entity?: string;
  initiating_entity?: string;
  initiating_role?: string;
  launch_context?: string;
  review_requirements?: string[];
};

export type TransitionTaskPayload = {
  to_state: TaskState;
};

export type RuntimeStatusResponse = {
  status: string;
  installed: boolean;
  bridge_status: string;
  bridge_url: string;
  openclaw_home: string;
  workspace_path: string;
  openclaw_workspace_path: string;
  workspace_exists: boolean;
  workspace_registered: boolean;
  database_path: string;
  task_count: number;
  entity_count: number;
  latest_sync_at: string | null;
  latest_error: string | null;
};

export type RuntimeEventRecord = {
  timestamp: string | null;
  level: string;
  event_type: string;
  message: string;
  source: string | null;
  details: Record<string, unknown>;
};

export type RuntimeLogRecord = {
  timestamp: string | null;
  level: string;
  message: string;
  source: string | null;
  details: Record<string, unknown>;
};

export type DashboardSummaryResponse = {
  metrics: {
    total_tasks: number;
    awaiting_review: number;
    active_tasks: number;
    blocked_tasks: number;
    tasks_by_state: Record<string, number>;
    tasks_by_risk: Record<string, number>;
    tasks_by_entity: Record<string, number>;
    review_requirements: string[];
  };
  tasks: TaskRecord[];
  recent_tasks: TaskRecord[];
  recent_events: TaskEventRecord[];
  runtime: RuntimeStatusResponse;
};

async function readErrorMessage(response: Response) {
  const fallback = `Request failed: ${response.status}`;

  try {
    const payload = (await response.clone().json()) as {
      detail?: unknown;
      error?: unknown;
    };
    if (typeof payload.detail === "string" && payload.detail.trim()) {
      return payload.detail;
    }
    if (Array.isArray(payload.detail)) {
      const messages = payload.detail
        .map((item) =>
          item && typeof item === "object" && "msg" in item && typeof item.msg === "string"
            ? item.msg
            : null
        )
        .filter((item): item is string => Boolean(item));
      if (messages.length) {
        return messages.join("; ");
      }
    }
    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Fall through to plain-text fallback.
  }

  try {
    const text = (await response.text()).trim();
    if (text) {
      return text;
    }
  } catch {
    // Keep the generic fallback below.
  }

  return fallback;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

export function fetchJson<T>(path: string): Promise<T> {
  return requestJson<T>(path);
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return requestJson<T>(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function fetchDashboardSummary() {
  return fetchJson<DashboardSummaryResponse>("/api/dashboard/summary");
}

export function fetchTaskEvents(taskId: string) {
  return fetchJson<TaskEventRecord[]>(`/api/tasks/${encodeURIComponent(taskId)}/events`);
}

export function fetchOrganizationEntities() {
  return fetchJson<EntitySummary[]>("/api/organization/entities");
}

export function fetchOrganizationRoles(entitySlug: string) {
  return fetchJson<RoleRecord[]>(
    `/api/organization/entities/${encodeURIComponent(entitySlug)}/roles`
  );
}

export function fetchOrganizationRole(entitySlug: string, roleSlug: string) {
  return fetchJson<RoleRecord>(
    `/api/organization/roles/${encodeURIComponent(entitySlug)}/${encodeURIComponent(roleSlug)}`
  );
}

export function createTask(payload: CreateTaskPayload) {
  return postJson<TaskRecord>("/api/tasks", payload);
}

export function transitionTask(taskId: string, payload: TransitionTaskPayload) {
  return postJson<TaskRecord>(`/api/tasks/${encodeURIComponent(taskId)}/transition`, payload);
}

export function fetchRuntimeStatus() {
  return fetchJson<RuntimeStatusResponse>("/api/runtime/status");
}

export function fetchRuntimeEvents() {
  return fetchJson<RuntimeEventRecord[]>("/api/runtime/events");
}

export function fetchRuntimeLogs() {
  return fetchJson<RuntimeLogRecord[]>("/api/runtime/logs");
}
