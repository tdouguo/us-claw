from __future__ import annotations

from pathlib import Path
from urllib import error, request
import json
import os

from app.services.soul_catalog import SoulCatalog
from app.services.task_store import TaskStore


class RuntimeGateway:
    def __init__(self, bridge_url: str | None = None) -> None:
        self.bridge_url = (bridge_url or os.environ.get("US_CLAW_BRIDGE_URL") or "http://127.0.0.1:8787").rstrip("/")

    def get_runtime_status(
        self,
        *,
        workspace_root: Path,
        task_store: TaskStore,
        catalog: SoulCatalog,
    ) -> dict[str, object]:
        openclaw_home = detect_openclaw_home()
        workspace_root_path = detect_openclaw_workspace_root(openclaw_home)
        workspace_slug = detect_openclaw_workspace_slug()
        workspace_path = detect_openclaw_workspace_path(workspace_root_path, workspace_slug)
        installed = openclaw_home.exists()
        base = {
            "status": "not_installed" if not installed else "bridge_unreachable",
            "installed": installed,
            "bridge_status": "unreachable",
            "bridge_url": self.bridge_url,
            "openclaw_home": str(openclaw_home),
            "workspace_path": str(workspace_root),
            "openclaw_workspace_path": str(workspace_path),
            "workspace_exists": workspace_path.exists(),
            "workspace_registered": False,
            "database_path": str(task_store.db_path),
            "task_count": len(task_store.list_tasks()),
            "entity_count": len(catalog.list_entities()),
            "latest_sync_at": None,
            "latest_error": None if not installed else "OpenClaw bridge is unreachable",
        }
        payload = self._fetch_json("/status")
        if payload is None:
            if not installed:
                base["latest_error"] = "OpenClaw home not found"
            return base
        runtime = payload.get("runtime", payload)
        base.update(
            {
                "status": runtime.get("status", "ready"),
                "bridge_status": runtime.get("bridge_status", runtime.get("bridgeStatus", "reachable")),
                "openclaw_home": runtime.get("openclaw_home", runtime.get("openclawHome", base["openclaw_home"])),
                "openclaw_workspace_path": runtime.get(
                    "openclaw_workspace_path",
                    runtime.get("workspacePath", base["openclaw_workspace_path"]),
                ),
                "workspace_exists": runtime.get(
                    "workspace_exists",
                    runtime.get("workspaceExists", base["workspace_exists"]),
                ),
                "workspace_registered": runtime.get(
                    "workspace_registered",
                    runtime.get("workspaceRegistered", False),
                ),
                "latest_sync_at": runtime.get("latest_sync_at", runtime.get("latestSyncAt")),
                "latest_error": runtime.get("latest_error", runtime.get("latestError")),
                "installed": runtime.get("installed", installed),
            }
        )
        return base

    def list_events(self, limit: int = 10) -> list[dict[str, object]]:
        payload = self._fetch_json(f"/events?limit={limit}")
        if payload is None:
            return []
        items = list(payload.get("items", payload))
        return [normalize_event(item) for item in items]

    def list_logs(self, limit: int = 20) -> list[dict[str, object]]:
        payload = self._fetch_json(f"/logs?limit={limit}")
        if payload is None:
            return []
        items = list(payload.get("items", payload))
        return [normalize_log(item) for item in items]

    def _fetch_json(self, path: str) -> dict[str, object] | None:
        try:
            with request.urlopen(f"{self.bridge_url}{path}", timeout=1.5) as response:
                return json.loads(response.read().decode("utf-8"))
        except (error.URLError, TimeoutError, json.JSONDecodeError, ValueError):
            return None


def detect_openclaw_home() -> Path:
    configured = os.environ.get("OPENCLAW_HOME")
    if configured:
        return Path(configured).expanduser()
    return Path.home() / ".openclaw"


def detect_openclaw_workspace_root(openclaw_home: Path) -> Path:
    configured = os.environ.get("OPENCLAW_WORKSPACE")
    if configured:
        return Path(configured).expanduser()
    return openclaw_home / "workspace"


def detect_openclaw_workspace_slug() -> str:
    return os.environ.get("US_CLAW_WORKSPACE_SLUG", "us-claw")


def detect_openclaw_workspace_path(workspace_root: Path, workspace_slug: str) -> Path:
    return workspace_root / workspace_slug


def normalize_event(item: dict[str, object]) -> dict[str, object]:
    return {
        "timestamp": item.get("timestamp"),
        "level": item.get("level", "info"),
        "event_type": item.get("event_type", item.get("eventType", "")),
        "message": item.get("message", ""),
        "source": item.get("source"),
        "details": item.get("details", {}),
    }


def normalize_log(item: dict[str, object]) -> dict[str, object]:
    return {
        "timestamp": item.get("timestamp"),
        "level": item.get("level", "info"),
        "message": item.get("message", ""),
        "source": item.get("source"),
        "details": item.get("details", {}),
    }
