from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI

from app.api.dashboard import router as dashboard_router
from app.api.health import router as health_router
from app.api.organization import router as organization_router
from app.api.runtime import router as runtime_router
from app.api.tasks import router as tasks_router
from app.services.runtime_gateway import RuntimeGateway
from app.services.soul_catalog import SoulCatalog
from app.services.task_store import TaskStore


def find_workspace_root() -> Path:
    current = Path(__file__).resolve().parent
    for candidate in (current, *current.parents):
        if (candidate / "agents").is_dir() and (candidate / "docs").is_dir():
            return candidate
    raise RuntimeError(f"workspace root not found from {__file__}")


def create_app(
    workspace_root: Path | None = None,
    catalog: SoulCatalog | None = None,
    task_store: TaskStore | None = None,
    runtime_gateway: RuntimeGateway | None = None,
) -> FastAPI:
    root = workspace_root.resolve() if workspace_root else find_workspace_root()
    app = FastAPI(title="US Claw Control Plane", version="0.2.0")
    app.state.workspace_root = root
    app.state.catalog = catalog or SoulCatalog.from_workspace(root)
    app.state.task_store = task_store or TaskStore(root / ".ai" / "state" / "us-claw.db")
    app.state.runtime_gateway = runtime_gateway or RuntimeGateway()
    app.include_router(health_router)
    app.include_router(dashboard_router)
    app.include_router(organization_router)
    app.include_router(tasks_router)
    app.include_router(runtime_router)
    return app


app = create_app()
