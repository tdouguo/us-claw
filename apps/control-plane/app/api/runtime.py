from __future__ import annotations

from fastapi import APIRouter, Request

router = APIRouter(prefix="/api/runtime", tags=["runtime"])


@router.get("/status")
def runtime_status(request: Request) -> dict[str, object]:
    runtime = request.app.state.runtime_gateway.get_runtime_status(
        workspace_root=request.app.state.workspace_root,
        task_store=request.app.state.task_store,
        catalog=request.app.state.catalog,
    )
    runtime["workspace_path"] = str(request.app.state.workspace_root)
    runtime["database_path"] = str(request.app.state.task_store.db_path)
    runtime["task_count"] = len(request.app.state.task_store.list_tasks())
    runtime["entity_count"] = len(request.app.state.catalog.list_entities())
    return runtime


@router.get("/events")
def runtime_events(request: Request, limit: int = 10) -> list[dict[str, object]]:
    return request.app.state.runtime_gateway.list_events(limit=limit)


@router.get("/logs")
def runtime_logs(request: Request, limit: int = 20) -> list[dict[str, object]]:
    return request.app.state.runtime_gateway.list_logs(limit=limit)
