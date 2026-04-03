from __future__ import annotations

from pathlib import Path
import sys
from tempfile import TemporaryDirectory
from unittest.mock import patch
import unittest

ROOT = Path(__file__).resolve().parents[3]
CONTROL_PLANE_DIR = ROOT / "apps" / "control-plane"
if str(CONTROL_PLANE_DIR) not in sys.path:
    sys.path.insert(0, str(CONTROL_PLANE_DIR))

try:
    from fastapi.testclient import TestClient

    from app.main import create_app
    from app.services.runtime_gateway import RuntimeTelemetryUnavailable
    from app.services.soul_catalog import SoulCatalog
    from app.services.task_store import TaskStore

    HAVE_FASTAPI = True
except ImportError:
    HAVE_FASTAPI = False


class FakeRuntimeGateway:
    def get_runtime_status(self, **_: object) -> dict[str, object]:
        return {
            "status": "ready",
            "installed": True,
            "bridge_status": "reachable",
            "openclaw_home": "C:/Users/Administrator/.openclaw",
            "openclaw_workspace_path": "C:/Users/Administrator/.openclaw/workspace",
            "workspace_exists": True,
            "workspace_registered": True,
            "latest_sync_at": "2026-04-02T10:00:00+00:00",
            "latest_error": None,
            "bridge_url": "http://127.0.0.1:8787",
        }

    def list_events(self, limit: int = 10) -> list[dict[str, object]]:
        return [
            {
                "timestamp": "2026-04-02T10:00:00+00:00",
                "level": "info",
                "event_type": "runtime_ready",
                "message": "Runtime ready",
            }
        ][:limit]

    def list_logs(self, limit: int = 20) -> list[dict[str, object]]:
        return [
            {
                "timestamp": "2026-04-02T10:00:00+00:00",
                "level": "info",
                "message": "Bridge ready",
            }
        ][:limit]


class FailingRuntimeGateway(FakeRuntimeGateway):
    def list_events(self, limit: int = 10) -> list[dict[str, object]]:
        raise RuntimeTelemetryUnavailable("Runtime events are unavailable from the OpenClaw bridge.")

    def list_logs(self, limit: int = 20) -> list[dict[str, object]]:
        raise RuntimeTelemetryUnavailable("Runtime logs are unavailable from the OpenClaw bridge.")


@unittest.skipUnless(HAVE_FASTAPI, "fastapi/testclient is not installed")
class RuntimeApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.catalog = SoulCatalog.from_workspace(ROOT)

    def setUp(self) -> None:
        self.temp_dir = TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "tasks.db"
        app = create_app(
            workspace_root=ROOT,
            catalog=self.catalog,
            task_store=TaskStore(self.db_path),
        )
        app.state.runtime_gateway = FakeRuntimeGateway()
        self.client = TestClient(app)

    def tearDown(self) -> None:
        self.client.close()
        self.temp_dir.cleanup()

    def test_runtime_status_reports_workspace_and_task_counts(self) -> None:
        self.client.post(
            "/api/tasks",
            json={
                "title": "Inspect runtime telemetry",
                "description": "Seed one task for runtime metrics.",
            },
        )

        response = self.client.get("/api/runtime/status")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["bridge_status"], "reachable")
        self.assertEqual(payload["status"], "ready")
        self.assertEqual(payload["workspace_path"], str(ROOT))
        self.assertEqual(payload["database_path"], str(self.db_path))
        self.assertEqual(payload["task_count"], 1)
        self.assertGreater(payload["entity_count"], 0)

    def test_runtime_events_endpoint_returns_recent_events(self) -> None:
        response = self.client.get("/api/runtime/events")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload[0]["event_type"], "runtime_ready")

    def test_runtime_logs_endpoint_returns_recent_logs(self) -> None:
        response = self.client.get("/api/runtime/logs")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload[0]["message"], "Bridge ready")

    def test_runtime_events_endpoint_returns_502_when_bridge_feed_fails(self) -> None:
        self.client.close()
        app = create_app(
            workspace_root=ROOT,
            catalog=self.catalog,
            task_store=TaskStore(self.db_path),
        )
        app.state.runtime_gateway = FailingRuntimeGateway()
        self.client = TestClient(app)

        response = self.client.get("/api/runtime/events")

        self.assertEqual(response.status_code, 502)
        self.assertEqual(
            response.json()["detail"],
            "Runtime events are unavailable from the OpenClaw bridge.",
        )

    def test_runtime_logs_endpoint_returns_502_when_bridge_feed_fails(self) -> None:
        self.client.close()
        app = create_app(
            workspace_root=ROOT,
            catalog=self.catalog,
            task_store=TaskStore(self.db_path),
        )
        app.state.runtime_gateway = FailingRuntimeGateway()
        self.client = TestClient(app)

        response = self.client.get("/api/runtime/logs")

        self.assertEqual(response.status_code, 502)
        self.assertEqual(
            response.json()["detail"],
            "Runtime logs are unavailable from the OpenClaw bridge.",
        )

    def test_runtime_endpoints_reject_non_positive_limits(self) -> None:
        events_response = self.client.get("/api/runtime/events?limit=-1")
        logs_response = self.client.get("/api/runtime/logs?limit=0")

        self.assertEqual(events_response.status_code, 400)
        self.assertEqual(logs_response.status_code, 400)
        self.assertEqual(events_response.json()["detail"], "limit must be a positive integer")
        self.assertEqual(logs_response.json()["detail"], "limit must be a positive integer")

    def test_runtime_status_reports_not_installed_when_openclaw_home_is_missing(self) -> None:
        self.client.close()
        missing_home = Path(self.temp_dir.name) / "missing-openclaw-home"

        with patch.dict(
            "os.environ",
            {
                "OPENCLAW_HOME": str(missing_home),
                "OPENCLAW_WORKSPACE": str(missing_home / "workspace"),
                "US_CLAW_BRIDGE_URL": "http://127.0.0.1:37999",
            },
            clear=False,
        ):
            app = create_app(
                workspace_root=ROOT,
                catalog=self.catalog,
                task_store=TaskStore(self.db_path),
            )
            self.client = TestClient(app)
            response = self.client.get("/api/runtime/status")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["status"], "not_installed")
        self.assertEqual(payload["bridge_status"], "unreachable")

    def test_runtime_status_reports_bridge_unreachable_when_openclaw_home_exists(self) -> None:
        self.client.close()
        openclaw_home = Path(self.temp_dir.name) / ".openclaw"
        workspace_root = openclaw_home / "workspace"
        workspace_root.mkdir(parents=True, exist_ok=True)

        with patch.dict(
            "os.environ",
            {
                "OPENCLAW_HOME": str(openclaw_home),
                "OPENCLAW_WORKSPACE": str(workspace_root),
                "US_CLAW_BRIDGE_URL": "http://127.0.0.1:37999",
            },
            clear=False,
        ):
            app = create_app(
                workspace_root=ROOT,
                catalog=self.catalog,
                task_store=TaskStore(self.db_path),
            )
            self.client = TestClient(app)
            response = self.client.get("/api/runtime/status")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["status"], "bridge_unreachable")
        self.assertEqual(payload["bridge_status"], "unreachable")


if __name__ == "__main__":
    unittest.main()
