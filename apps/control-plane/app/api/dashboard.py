from __future__ import annotations

from fastapi import APIRouter, Request

from app.services.dashboard_summary import build_dashboard_summary


router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
def dashboard_summary(request: Request) -> dict[str, object]:
    task_store = request.app.state.task_store
    tasks = task_store.list_tasks()
    recent_events = task_store.list_events(limit=10)
    runtime = request.app.state.runtime_gateway.get_runtime_status(
        workspace_root=request.app.state.workspace_root,
        task_store=task_store,
        catalog=request.app.state.catalog,
    )
    return build_dashboard_summary(
        tasks=tasks,
        recent_events=recent_events,
        runtime=runtime,
    )
