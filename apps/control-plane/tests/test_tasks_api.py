from __future__ import annotations

from pathlib import Path
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[3]
CONTROL_PLANE_DIR = ROOT / "apps" / "control-plane"
if str(CONTROL_PLANE_DIR) not in sys.path:
    sys.path.insert(0, str(CONTROL_PLANE_DIR))

from app.services.task_store import TaskStore


try:
    from fastapi.testclient import TestClient

    from app.main import create_app

    HAVE_FASTAPI = True
except ImportError:
    HAVE_FASTAPI = False


class TaskStoreTests(unittest.TestCase):
    def test_store_can_create_and_transition_task(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store = TaskStore(db_path=Path(temp_dir) / "tasks.db")
            task = store.create_task({"title": "Test task", "review_requirements": ["legal_review"]})
            self.assertEqual(task["state"], "draft")
            transitioned = store.transition_task(task["id"], "intake_review")
            self.assertEqual(transitioned["state"], "intake_review")


@unittest.skipUnless(HAVE_FASTAPI, "fastapi/testclient is not installed")
class TasksApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.client = TestClient(create_app(task_store=TaskStore(Path(self.temp_dir.name) / "tasks.db")))

    def tearDown(self) -> None:
        self.client.close()
        self.temp_dir.cleanup()

    def test_tasks_round_trip(self) -> None:
        create_response = self.client.post(
            "/api/tasks",
            json={"title": "Integration task", "review_requirements": ["legal_review"]},
        )
        self.assertEqual(create_response.status_code, 200)
        created = create_response.json()
        transition_response = self.client.post(
            f"/api/tasks/{created['id']}/transition",
            json={"to_state": "intake_review"},
        )
        self.assertEqual(transition_response.status_code, 200)
        tasks_response = self.client.get("/api/tasks")
        self.assertEqual(tasks_response.status_code, 200)
        self.assertTrue(any(item["id"] == created["id"] for item in tasks_response.json()))
