from __future__ import annotations

from pathlib import Path
import os

from fastapi import APIRouter, Request


router = APIRouter(prefix="/api/runtime", tags=["runtime"])


def detect_openclaw_home() -> Path:
    configured = os.environ.get("OPENCLAW_HOME")
    if configured:
        return Path(configured).expanduser()
    return Path.home() / ".openclaw"


@router.get("/status")
def runtime_status(request: Request) -> dict[str, object]:
    openclaw_home = detect_openclaw_home()
    workspace_path = openclaw_home / "workspace"
    installed = openclaw_home.exists()
    task_store = request.app.state.task_store
    catalog = request.app.state.catalog
    return {
        "installed": installed,
        "version": None,
        "openclaw_home": str(openclaw_home),
        "workspace_path": str(request.app.state.workspace_root),
        "openclaw_workspace_path": str(workspace_path),
        "workspace_exists": workspace_path.exists(),
        "database_path": str(task_store.db_path),
        "task_count": len(task_store.list_tasks()),
        "entity_count": len(catalog.list_entities()),
        "bridge_status": "configured" if installed else "not_configured",
        "latest_error": None if installed else "OpenClaw home not found",
    }
