from __future__ import annotations

from pathlib import Path
import sys
from tempfile import TemporaryDirectory
import unittest

ROOT = Path(__file__).resolve().parents[3]
CONTROL_PLANE_DIR = ROOT / "apps" / "control-plane"
if str(CONTROL_PLANE_DIR) not in sys.path:
    sys.path.insert(0, str(CONTROL_PLANE_DIR))

try:
    from fastapi.testclient import TestClient

    from app.main import create_app
    from app.services.soul_catalog import SoulCatalog
    from app.services.task_store import TaskStore

    HAVE_FASTAPI = True
except ImportError:
    HAVE_FASTAPI = False


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
        self.assertEqual(payload["bridge_status"], "not_configured")
        self.assertEqual(payload["workspace_path"], str(ROOT))
        self.assertEqual(payload["database_path"], str(self.db_path))
        self.assertEqual(payload["task_count"], 1)
        self.assertGreater(payload["entity_count"], 0)


if __name__ == "__main__":
    unittest.main()
