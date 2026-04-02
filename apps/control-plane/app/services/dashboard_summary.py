from __future__ import annotations

from collections import Counter

from app.domain.task_state import TaskState


REVIEW_STATES = {
    "intake_review",
    "jurisdiction_pending",
    "planning",
    "policy_review",
    "legal_review",
    "budget_or_security_review",
    "integration_review",
}
ACTIVE_STATES = {
    "approved_for_dispatch",
    "dispatched",
    "in_progress",
    "waiting_external",
    "blocked",
    "integration_review",
}


def build_dashboard_summary(
    *,
    tasks: list[dict[str, object]],
    recent_events: list[dict[str, object]],
    runtime: dict[str, object],
) -> dict[str, object]:
    state_counts = Counter(str(task["state"]) for task in tasks)
    risk_counts = Counter(str(task["risk_level"]) for task in tasks)
    entity_counts = Counter(str(task["owning_entity"]) for task in tasks if task["owning_entity"])
    tasks_by_state = {state.value: state_counts[state.value] for state in TaskState}
    review_requirements = sorted(
        {
            requirement
            for task in tasks
            for requirement in task.get("review_requirements", [])
        }
    )
    return {
        "metrics": {
            "total_tasks": len(tasks),
            "awaiting_review": sum(state_counts[state] for state in REVIEW_STATES),
            "active_tasks": sum(state_counts[state] for state in ACTIVE_STATES),
            "blocked_tasks": state_counts["blocked"],
            "tasks_by_state": tasks_by_state,
            "tasks_by_risk": dict(sorted(risk_counts.items())),
            "tasks_by_entity": dict(sorted(entity_counts.items())),
            "review_requirements": review_requirements,
        },
        "tasks": tasks,
        "recent_tasks": tasks[:8],
        "recent_events": recent_events,
        "runtime": runtime,
    }
