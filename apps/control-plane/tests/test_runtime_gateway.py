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

from app.services.runtime_gateway import RuntimeGateway
from app.services.soul_catalog import SoulCatalog
from app.services.task_store import TaskStore


class RuntimeGatewayTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.catalog = SoulCatalog.from_workspace(ROOT)

    def setUp(self) -> None:
        self.temp_dir = TemporaryDirectory()
        self.task_store = TaskStore(Path(self.temp_dir.name) / "tasks.db")

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_bridge_payload_wins_even_when_local_openclaw_home_is_missing(self) -> None:
        missing_home = Path(self.temp_dir.name) / "missing-openclaw-home"
        gateway = RuntimeGateway("http://openclaw-bridge:8787")

        with patch.dict(
            "os.environ",
            {
                "OPENCLAW_HOME": str(missing_home),
                "OPENCLAW_WORKSPACE": str(missing_home / "workspace"),
            },
            clear=False,
        ):
            with patch.object(
                gateway,
                "_fetch_json",
                return_value={
                    "runtime": {
                        "status": "ready",
                        "bridgeStatus": "reachable",
                        "openclawHome": "/remote/.openclaw",
                        "workspacePath": "/remote/.openclaw/workspace/us-claw",
                        "workspaceExists": True,
                        "workspaceRegistered": True,
                        "latestSyncAt": "2026-04-02T10:00:00+00:00",
                        "latestError": None,
                        "installed": True,
                    }
                },
            ) as fetch_json:
                payload = gateway.get_runtime_status(
                    workspace_root=ROOT,
                    task_store=self.task_store,
                    catalog=self.catalog,
                )

        fetch_json.assert_called_once_with("/status")
        self.assertEqual(payload["status"], "ready")
        self.assertEqual(payload["bridge_status"], "reachable")
        self.assertEqual(payload["openclaw_home"], "/remote/.openclaw")
        self.assertEqual(
            payload["openclaw_workspace_path"],
            "/remote/.openclaw/workspace/us-claw",
        )

    def test_fallback_workspace_path_points_to_repo_workspace_directory(self) -> None:
        openclaw_home = Path(self.temp_dir.name) / ".openclaw"
        workspace_root = openclaw_home / "workspace"
        workspace_root.mkdir(parents=True, exist_ok=True)
        gateway = RuntimeGateway("http://openclaw-bridge:8787")

        with patch.dict(
            "os.environ",
            {
                "OPENCLAW_HOME": str(openclaw_home),
                "OPENCLAW_WORKSPACE": str(workspace_root),
            },
            clear=False,
        ):
            with patch.object(gateway, "_fetch_json", return_value=None):
                payload = gateway.get_runtime_status(
                    workspace_root=ROOT,
                    task_store=self.task_store,
                    catalog=self.catalog,
                )

        self.assertEqual(
            payload["openclaw_workspace_path"],
            str(workspace_root / "us-claw"),
        )
        self.assertFalse(payload["workspace_exists"])


if __name__ == "__main__":
    unittest.main()
