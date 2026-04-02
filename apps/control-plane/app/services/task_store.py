from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import json
import sqlite3
import uuid

from app.domain.task_state import TaskState


ALLOWED_TRANSITIONS = {
    TaskState.DRAFT: {TaskState.INTAKE_REVIEW},
    TaskState.INTAKE_REVIEW: {TaskState.JURISDICTION_PENDING},
    TaskState.JURISDICTION_PENDING: {TaskState.PLANNING},
    TaskState.PLANNING: {
        TaskState.POLICY_REVIEW,
        TaskState.LEGAL_REVIEW,
        TaskState.BUDGET_OR_SECURITY_REVIEW,
        TaskState.APPROVED_FOR_DISPATCH,
    },
    TaskState.POLICY_REVIEW: {TaskState.APPROVED_FOR_DISPATCH, TaskState.NEEDS_REWORK},
    TaskState.LEGAL_REVIEW: {TaskState.APPROVED_FOR_DISPATCH, TaskState.NEEDS_REWORK},
    TaskState.BUDGET_OR_SECURITY_REVIEW: {TaskState.APPROVED_FOR_DISPATCH, TaskState.NEEDS_REWORK},
    TaskState.APPROVED_FOR_DISPATCH: {TaskState.DISPATCHED},
    TaskState.DISPATCHED: {TaskState.IN_PROGRESS},
    TaskState.IN_PROGRESS: {
        TaskState.WAITING_EXTERNAL,
        TaskState.BLOCKED,
        TaskState.INTEGRATION_REVIEW,
    },
    TaskState.WAITING_EXTERNAL: {TaskState.IN_PROGRESS, TaskState.BLOCKED, TaskState.CANCELLED},
    TaskState.BLOCKED: {TaskState.IN_PROGRESS, TaskState.CANCELLED},
    TaskState.INTEGRATION_REVIEW: {
        TaskState.APPROVED,
        TaskState.NEEDS_REWORK,
        TaskState.ROLLED_BACK,
    },
    TaskState.NEEDS_REWORK: {TaskState.PLANNING, TaskState.IN_PROGRESS},
    TaskState.APPROVED: {TaskState.ARCHIVED},
    TaskState.ROLLED_BACK: {TaskState.ARCHIVED},
    TaskState.CANCELLED: {TaskState.ARCHIVED},
    TaskState.ARCHIVED: set(),
}


def find_workspace_root() -> Path:
    current = Path(__file__).resolve().parent
    for candidate in (current, *current.parents):
        if (candidate / "agents").is_dir() and (candidate / "docs").is_dir():
            return candidate
    raise RuntimeError(f"workspace root not found from {__file__}")


class TaskStore:
    def __init__(self, db_path: Path | None = None) -> None:
        root = find_workspace_root()
        self.db_path = db_path or root / ".ai" / "state" / "us-claw.db"
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _init_db(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    mission_type TEXT NOT NULL,
                    risk_level TEXT NOT NULL,
                    owning_entity TEXT NOT NULL,
                    initiating_entity TEXT NOT NULL,
                    initiating_role TEXT NOT NULL,
                    launch_context TEXT NOT NULL,
                    review_requirements TEXT NOT NULL,
                    state TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )

    def list_tasks(self) -> list[dict[str, object]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT *
                FROM tasks
                ORDER BY datetime(created_at) DESC, id DESC
                """
            ).fetchall()
        return [self._row_to_task(row) for row in rows]

    def create_task(self, payload: dict[str, object]) -> dict[str, object]:
        now = datetime.now(timezone.utc).isoformat()
        task_id = str(uuid.uuid4())
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO tasks (
                    id, title, description, mission_type, risk_level, owning_entity,
                    initiating_entity, initiating_role, launch_context,
                    review_requirements, state, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    task_id,
                    str(payload["title"]),
                    str(payload.get("description", "")),
                    str(payload.get("mission_type", "general")),
                    str(payload.get("risk_level", "normal")),
                    str(payload.get("owning_entity", "")),
                    str(payload.get("initiating_entity", "")),
                    str(payload.get("initiating_role", "")),
                    str(payload.get("launch_context", "")),
                    json.dumps(payload.get("review_requirements", []), ensure_ascii=False),
                    TaskState.DRAFT.value,
                    now,
                    now,
                ),
            )
            row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
        return self._row_to_task(row)

    def transition_task(self, task_id: str, to_state: str) -> dict[str, object]:
        target = TaskState(to_state)
        with self._connect() as connection:
            row = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
            if row is None:
                raise KeyError(f"task not found: {task_id}")
            current = TaskState(row["state"])
            if target not in ALLOWED_TRANSITIONS[current]:
                raise ValueError(f"invalid task transition: {current.value} -> {target.value}")
            updated_at = datetime.now(timezone.utc).isoformat()
            connection.execute(
                "UPDATE tasks SET state = ?, updated_at = ? WHERE id = ?",
                (target.value, updated_at, task_id),
            )
            updated = connection.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
        return self._row_to_task(updated)

    @staticmethod
    def _row_to_task(row: sqlite3.Row) -> dict[str, object]:
        return {
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "mission_type": row["mission_type"],
            "risk_level": row["risk_level"],
            "owning_entity": row["owning_entity"],
            "initiating_entity": row["initiating_entity"],
            "initiating_role": row["initiating_role"],
            "launch_context": row["launch_context"],
            "review_requirements": json.loads(row["review_requirements"]),
            "state": row["state"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
