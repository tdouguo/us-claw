import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { App } from "./App";

type MockJsonResponse = {
  body: unknown;
  status?: number;
};

type RouteHandler =
  | MockJsonResponse
  | ((request: { url: string; method: string; init?: RequestInit }) => MockJsonResponse);

type RouteMap = Record<string, RouteHandler>;

const MISSION_SUMMARY = {
  metrics: {
    total_tasks: 4,
    awaiting_review: 1,
    active_tasks: 2,
    blocked_tasks: 1,
    tasks_by_state: {
      draft: 1,
      intake_review: 1,
      in_progress: 1,
      blocked: 1
    },
    tasks_by_risk: {
      high: 2,
      normal: 2
    },
    tasks_by_entity: {
      department_of_state: 2,
      supreme_court: 2
    },
    review_requirements: ["integration_review", "legal_review"]
  },
  tasks: [
    {
      id: "task-1",
      title: "Draft legal brief",
      description: "Prepare filing package for the treaty hearing.",
      mission_type: "litigation",
      risk_level: "high",
      owning_entity: "department_of_state",
      initiating_entity: "department_of_state",
      initiating_role: "secretary_of_state",
      launch_context: "Treaty hearing escalated overnight.",
      review_requirements: ["legal_review"],
      state: "draft",
      created_at: "2026-04-02T08:00:00+00:00",
      updated_at: "2026-04-02T08:00:00+00:00"
    },
    {
      id: "task-2",
      title: "Coordinate inter-agency briefing",
      description: "Align policy, comms, and legal owners.",
      mission_type: "coordination",
      risk_level: "normal",
      owning_entity: "department_of_state",
      initiating_entity: "department_of_state",
      initiating_role: "deputy_secretary_of_state",
      launch_context: "Morning policy review agenda.",
      review_requirements: ["integration_review"],
      state: "intake_review",
      created_at: "2026-04-02T07:30:00+00:00",
      updated_at: "2026-04-02T07:45:00+00:00"
    },
    {
      id: "task-3",
      title: "Monitor court injunction",
      description: "Track injunction updates and notify principals.",
      mission_type: "monitoring",
      risk_level: "high",
      owning_entity: "supreme_court",
      initiating_entity: "supreme_court",
      initiating_role: "chief_justice",
      launch_context: "Live docket watch.",
      review_requirements: ["legal_review"],
      state: "in_progress",
      created_at: "2026-04-02T06:00:00+00:00",
      updated_at: "2026-04-02T08:10:00+00:00"
    },
    {
      id: "task-4",
      title: "Bridge outage mitigation",
      description: "Hold dispatches while runtime bridge recovers.",
      mission_type: "incident",
      risk_level: "normal",
      owning_entity: "supreme_court",
      initiating_entity: "supreme_court",
      initiating_role: "marshal_of_the_court",
      launch_context: "Bridge warning acknowledged.",
      review_requirements: [],
      state: "blocked",
      created_at: "2026-04-02T05:00:00+00:00",
      updated_at: "2026-04-02T08:20:00+00:00"
    }
  ],
  recent_tasks: [],
  recent_events: [
    {
      id: "evt-global-1",
      task_id: "task-2",
      task_title: "Coordinate inter-agency briefing",
      event_type: "task_state_changed",
      message: "Task moved to intake_review",
      details: "Task state transition",
      from_state: "draft",
      to_state: "intake_review",
      metadata: {},
      created_at: "2026-04-02T08:15:00+00:00"
    }
  ],
  runtime: {
    status: "ready",
    installed: true,
    bridge_status: "reachable",
    bridge_url: "http://127.0.0.1:8787",
    openclaw_home: "C:/Users/Administrator/.openclaw",
    workspace_path: "F:/Workspace/Github/US-claw",
    openclaw_workspace_path: "C:/Users/Administrator/.openclaw/workspace",
    workspace_exists: true,
    workspace_registered: true,
    database_path: "F:/Workspace/Github/US-claw/.ai/state/us-claw.db",
    task_count: 4,
    entity_count: 2,
    latest_sync_at: "2026-04-02T08:20:00+00:00",
    latest_error: null
  }
};

const ORGANIZATION_ENTITIES = [
  {
    entity_slug: "department_of_state",
    phase: "phase-1",
    entity_type: "department",
    role_count: 2,
    status: "active"
  },
  {
    entity_slug: "supreme_court",
    phase: "phase-2",
    entity_type: "judicial",
    role_count: 1,
    status: "active"
  }
];

const ORGANIZATION_ROLES = [
  {
    entity_slug: "department_of_state",
    role_slug: "secretary_of_state",
    title_cn: "国务卿",
    title_en: "Secretary of State",
    entity_cn: "国务院",
    entity_en: "Department of State",
    reference_level: "L1",
    reference_level_name: "Cabinet",
    phase: "phase-1",
    entity_type: "department",
    status: "active",
    path: "agents/department_of_state/secretary_of_state/SOUL.md",
    family: "Cabinet",
    appointment_type: "Presidential"
  },
  {
    entity_slug: "department_of_state",
    role_slug: "deputy_secretary_of_state",
    title_cn: "副国务卿",
    title_en: "Deputy Secretary of State",
    entity_cn: "国务院",
    entity_en: "Department of State",
    reference_level: "L2",
    reference_level_name: "Deputy Cabinet",
    phase: "phase-1",
    entity_type: "department",
    status: "active",
    path: "agents/department_of_state/deputy_secretary_of_state/SOUL.md",
    family: "Cabinet",
    appointment_type: "Presidential"
  }
];

const SECRETARY_OF_STATE = ORGANIZATION_ROLES[0];

const RUNTIME_STATUS = {
  status: "ready",
  installed: true,
  bridge_status: "reachable",
  bridge_url: "http://127.0.0.1:8787",
  openclaw_home: "C:/Users/Administrator/.openclaw",
  workspace_path: "F:/Workspace/Github/US-claw",
  openclaw_workspace_path: "C:/Users/Administrator/.openclaw/workspace",
  workspace_exists: true,
  workspace_registered: true,
  database_path: "F:/Workspace/Github/US-claw/.ai/state/us-claw.db",
  task_count: 4,
  entity_count: 2,
  latest_sync_at: "2026-04-02T08:20:00+00:00",
  latest_error: "Bridge latency spiked above SLA."
};

const RUNTIME_EVENTS = [
  {
    timestamp: "2026-04-02T08:19:00+00:00",
    level: "error",
    event_type: "bridge_warning",
    message: "Bridge latency spiked",
    source: "bridge",
    details: {
      latency_ms: 912
    }
  },
  {
    timestamp: "2026-04-02T08:10:00+00:00",
    level: "info",
    event_type: "runtime_ready",
    message: "Runtime ready",
    source: "bridge",
    details: {}
  }
];

const RUNTIME_LOGS = [
  {
    timestamp: "2026-04-02T08:20:00+00:00",
    level: "error",
    message: "Task worker disconnected",
    source: "worker",
    details: {}
  },
  {
    timestamp: "2026-04-02T08:12:00+00:00",
    level: "info",
    message: "Bridge ready",
    source: "bridge",
    details: {}
  }
];

function setupFetchMock(routes: RouteMap) {
  const fetchMock = vi.fn(
    async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
      const rawUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? `${input.pathname}${input.search}`
            : input.url;
      const url = rawUrl.startsWith("http") ? new URL(rawUrl).pathname + new URL(rawUrl).search : rawUrl;
      const method = (init?.method ?? "GET").toUpperCase();
      const key = `${method} ${url}`;
      const handler = routes[key] ?? routes[url];

      if (!handler) {
        throw new Error(`Unhandled fetch request: ${key}`);
      }

      const response = typeof handler === "function" ? handler({ url, method, init }) : handler;
      return new Response(JSON.stringify(response.body), {
        status: response.status ?? 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  );

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

function setupDefaultFetchMock(overrides: RouteMap = {}) {
  return setupFetchMock({
    "/api/dashboard/summary": {
      body: MISSION_SUMMARY
    },
    "/api/tasks/task-1/events": {
      body: [
        {
          id: "evt-1",
          task_id: "task-1",
          task_title: "Draft legal brief",
          event_type: "task_state_changed",
          message: "Task moved to intake_review",
          details: "Task state transition",
          from_state: "draft",
          to_state: "intake_review",
          metadata: {},
          created_at: "2026-04-02T08:16:00+00:00"
        },
        {
          id: "evt-2",
          task_id: "task-1",
          task_title: "Draft legal brief",
          event_type: "task_created",
          message: "Task created",
          details: "Draft legal brief",
          from_state: "",
          to_state: "draft",
          metadata: {
            review_requirements: ["legal_review"]
          },
          created_at: "2026-04-02T08:00:00+00:00"
        }
      ]
    },
    "/api/organization/entities": {
      body: ORGANIZATION_ENTITIES
    },
    "/api/organization/entities/department_of_state/roles": {
      body: ORGANIZATION_ROLES
    },
    "/api/organization/roles/department_of_state/secretary_of_state": {
      body: SECRETARY_OF_STATE
    },
    "POST /api/tasks": {
      body: {
        id: "role-task-1",
        title: "Launch treaty task force",
        description: "Coordinate counsel and policy response.",
        mission_type: "coordination",
        risk_level: "high",
        owning_entity: "department_of_state",
        initiating_entity: "department_of_state",
        initiating_role: "secretary_of_state",
        launch_context: "Role launch from organization console",
        review_requirements: ["legal_review"],
        state: "draft",
        created_at: "2026-04-02T08:30:00+00:00",
        updated_at: "2026-04-02T08:30:00+00:00"
      }
    },
    "/api/runtime/status": {
      body: RUNTIME_STATUS
    },
    "/api/runtime/events": {
      body: RUNTIME_EVENTS
    },
    "/api/runtime/logs": {
      body: RUNTIME_LOGS
    },
    ...overrides
  });
}

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("switches between the three control-plane views", async () => {
    setupDefaultFetchMock();

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Mission Control" })).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Organization" }));
    expect(await screen.findByRole("heading", { name: "Organization" })).toBeTruthy();
    expect(window.location.hash).toBe("#organization");

    fireEvent.click(screen.getByRole("tab", { name: "OpenClaw Runtime" }));
    expect(await screen.findByRole("heading", { name: "OpenClaw Runtime" })).toBeTruthy();
    expect(window.location.hash).toBe("#runtime");
  });

  it("renders mission dashboard data and loads task details in the sidecar", async () => {
    setupDefaultFetchMock();

    render(<App />);

    expect(await screen.findByText("Total Tasks")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("Runtime Status")).toBeTruthy();
    expect(screen.getByText("Draft legal brief")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /open task task-1/i }));

    expect(await screen.findByText("Task moved to intake_review")).toBeTruthy();
    expect(screen.getByText("Treaty hearing escalated overnight.")).toBeTruthy();
    expect(screen.getByText("legal_review")).toBeTruthy();
  });

  it("keeps empty workflow lanes visible in mission control", async () => {
    setupDefaultFetchMock({
      "/api/dashboard/summary": {
        body: {
          ...MISSION_SUMMARY,
          metrics: {
            ...MISSION_SUMMARY.metrics,
            tasks_by_state: {
              draft: 1,
              intake_review: 1,
              jurisdiction_pending: 0,
              planning: 0,
              policy_review: 0,
              legal_review: 0,
              budget_or_security_review: 0,
              approved_for_dispatch: 0,
              dispatched: 0,
              in_progress: 1,
              waiting_external: 0,
              blocked: 1,
              integration_review: 0,
              needs_rework: 0,
              approved: 0,
              rolled_back: 0,
              cancelled: 0,
              archived: 0
            }
          }
        }
      }
    });

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Jurisdiction Pending" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Archived" })).toBeTruthy();
    expect(screen.getAllByText("No tasks in this lane with the current filters.").length).toBeGreaterThan(0);
  });

  it("transitions a mission task from the sidecar and refreshes dashboard state", async () => {
    const summaryState = structuredClone(MISSION_SUMMARY) as typeof MISSION_SUMMARY;
    const taskEvents: Record<string, Array<Record<string, unknown>>> = {
      "task-1": [
        {
          id: "evt-task-1-created",
          task_id: "task-1",
          task_title: "Draft legal brief",
          event_type: "task_created",
          message: "Task created",
          details: "Draft legal brief",
          from_state: "",
          to_state: "draft",
          metadata: {},
          created_at: "2026-04-02T08:00:00+00:00"
        }
      ]
    };

    setupDefaultFetchMock({
      "/api/dashboard/summary": {
        body: summaryState
      },
      "/api/tasks/task-1/events": () => ({
        body: taskEvents["task-1"]
      }),
      "POST /api/tasks/task-1/transition": ({ init }) => {
        const body = JSON.parse(String(init?.body)) as { to_state: string };
        summaryState.tasks = summaryState.tasks.map((task) =>
          task.id === "task-1"
            ? {
                ...task,
                state: body.to_state,
                updated_at: "2026-04-02T08:35:00+00:00"
              }
            : task
        );
        summaryState.metrics.tasks_by_state = {
          draft: 0,
          intake_review: 2,
          in_progress: 1,
          blocked: 1
        };
        taskEvents["task-1"] = [
          {
            id: "evt-task-1-transition",
            task_id: "task-1",
            task_title: "Draft legal brief",
            event_type: "task_state_changed",
            message: `Task moved to ${body.to_state}`,
            details: "Task state transition",
            from_state: "draft",
            to_state: body.to_state,
            metadata: {},
            created_at: "2026-04-02T08:35:00+00:00"
          },
          ...taskEvents["task-1"]
        ];

        return {
          body: summaryState.tasks.find((task) => task.id === "task-1") ?? {}
        };
      }
    });

    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: /open task task-1/i }));

    const transitionButton = await screen.findByRole("button", { name: "Move to Intake Review" });
    fireEvent.click(transitionButton);

    expect(await screen.findByText("Task task-1 moved to intake_review.")).toBeTruthy();
    expect(await screen.findByText("Task moved to intake_review")).toBeTruthy();
  });

  it("loads organization roles and submits a task launch request", async () => {
    const fetchMock = setupDefaultFetchMock();

    render(<App />);

    fireEvent.click(await screen.findByRole("tab", { name: "Organization" }));

    expect(await screen.findByText("Secretary of State")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /open role secretary of state/i }));

    fireEvent.change(await screen.findByLabelText("Task Title"), {
      target: { value: "Launch treaty task force" }
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Coordinate counsel and policy response." }
    });
    fireEvent.change(screen.getByLabelText("Risk Level"), {
      target: { value: "high" }
    });
    fireEvent.click(screen.getByLabelText("Legal review"));

    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    expect(await screen.findByText("Task role-task-1 created from Secretary of State.")).toBeTruthy();

    const createTaskCall = fetchMock.mock.calls.find((call) => {
      const [input, init] = call as [string | URL | Request, RequestInit | undefined];
      const url = typeof input === "string" ? input : input instanceof URL ? `${input.pathname}${input.search}` : input.url;
      return url === "/api/tasks" && init?.method === "POST";
    });

    expect(createTaskCall).toBeTruthy();

    const [, requestInit] = createTaskCall as [string | URL | Request, RequestInit];
    const requestBody = JSON.parse(String(requestInit.body)) as Record<string, unknown>;

    expect(requestBody.initiating_entity).toBe("department_of_state");
    expect(requestBody.initiating_role).toBe("secretary_of_state");
    expect(requestBody.review_requirements).toEqual(["legal_review"]);
  });

  it("prevents launching a task with a stale role after switching entities", async () => {
    setupDefaultFetchMock({
      "/api/organization/entities/supreme_court/roles": {
        status: 500,
        body: {
          detail: "Supreme Court roles unavailable."
        }
      }
    });

    render(<App />);

    fireEvent.click(await screen.findByRole("tab", { name: "Organization" }));

    fireEvent.change(await screen.findByLabelText("Task Title"), {
      target: { value: "Cross-entity launch attempt" }
    });

    fireEvent.click(screen.getByRole("button", { name: /supreme court/i }));

    expect(await screen.findByText("Supreme Court roles unavailable.")).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Create Task" }).hasAttribute("disabled")).toBe(true);
    });
  });

  it("switches the sidecar to a visible task when filters exclude the current selection", async () => {
    setupDefaultFetchMock();

    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: /open task task-1/i }));
    expect(await screen.findByText("Treaty hearing escalated overnight.")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Owning Entity"), {
      target: { value: "supreme_court" }
    });

    expect(await screen.findByText("Live docket watch.")).toBeTruthy();
    expect(screen.queryByText("Treaty hearing escalated overnight.")).toBeNull();
  });

  it("surfaces backend error detail for failed task creation", async () => {
    setupDefaultFetchMock({
      "POST /api/tasks": {
        status: 422,
        body: {
          detail: "Role payload invalid."
        }
      }
    });

    render(<App />);

    fireEvent.click(await screen.findByRole("tab", { name: "Organization" }));
    fireEvent.change(await screen.findByLabelText("Task Title"), {
      target: { value: "Broken launch" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    expect(await screen.findByText("Role payload invalid.")).toBeTruthy();
    expect(screen.queryByText("Request failed: 422")).toBeNull();
  });

  it("renders runtime status, events, logs, and error summary", async () => {
    setupDefaultFetchMock();

    render(<App />);

    fireEvent.click(await screen.findByRole("tab", { name: "OpenClaw Runtime" }));

    expect(await screen.findByText("Bridge latency spiked above SLA.")).toBeTruthy();
    expect(screen.getByText("Task worker disconnected")).toBeTruthy();
    expect(screen.getByText("Bridge latency spiked")).toBeTruthy();
    expect(screen.getByText("reachable")).toBeTruthy();
  });

  it("keeps runtime status visible when events telemetry fails", async () => {
    setupDefaultFetchMock({
      "/api/runtime/events": {
        status: 503,
        body: {
          detail: "Events feed unavailable."
        }
      }
    });

    render(<App />);

    fireEvent.click(await screen.findByRole("tab", { name: "OpenClaw Runtime" }));

    expect(await screen.findByText(/Events feed unavailable\./i)).toBeTruthy();
    expect(screen.getByText("Installation")).toBeTruthy();
    expect(screen.getByText("reachable")).toBeTruthy();
    expect(screen.getByText("No runtime events are currently available.")).toBeTruthy();
  });
});
