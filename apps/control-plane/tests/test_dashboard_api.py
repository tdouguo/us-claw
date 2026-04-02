from __future__ import annotations

from pathlib import Path
import tempfile
import sys
import unittest


ROOT = Path(__file__).resolve().parents[3]
CONTROL_PLANE_DIR = ROOT / "apps" / "control-plane"
if str(CONTROL_PLANE_DIR) not in sys.path:
    sys.path.insert(0, str(CONTROL_PLANE_DIR))


try:
    from fastapi.testclient import TestClient

    from app.main import create_app
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
                "event_type": "workspace_registered",
                "message": "Workspace registered",
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


@unittest.skipUnless(HAVE_FASTAPI, "fastapi/testclient is not installed")
class DashboardApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        app = create_app(task_store=TaskStore(Path(self.temp_dir.name) / "tasks.db"))
        app.state.runtime_gateway = FakeRuntimeGateway()
        self.client = TestClient(app)

    def tearDown(self) -> None:
        self.client.close()
        self.temp_dir.cleanup()

    def test_dashboard_summary_returns_metrics_tasks_and_runtime(self) -> None:
        created = self.client.post(
            "/api/tasks",
            json={
                "title": "Prepare runtime dashboard",
                "risk_level": "high",
                "owning_entity": "department_of_state",
                "review_requirements": ["legal_review"],
            },
        ).json()
        self.client.post(
            f"/api/tasks/{created['id']}/transition",
            json={"to_state": "intake_review"},
        )

        response = self.client.get("/api/dashboard/summary")

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["metrics"]["total_tasks"], 1)
        self.assertEqual(body["metrics"]["tasks_by_state"]["intake_review"], 1)
        self.assertEqual(body["metrics"]["tasks_by_state"]["draft"], 0)
        self.assertEqual(body["metrics"]["tasks_by_state"]["archived"], 0)
        self.assertEqual(body["runtime"]["status"], "ready")
        self.assertEqual(body["recent_events"][0]["event_type"], "task_state_changed")
