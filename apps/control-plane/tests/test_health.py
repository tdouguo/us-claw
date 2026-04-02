from __future__ import annotations

from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[3]
CONTROL_PLANE_DIR = ROOT / "apps" / "control-plane"
if str(CONTROL_PLANE_DIR) not in sys.path:
    sys.path.insert(0, str(CONTROL_PLANE_DIR))


try:
    from fastapi.testclient import TestClient

    from app.main import create_app

    HAVE_FASTAPI = True
except ImportError:
    HAVE_FASTAPI = False


@unittest.skipUnless(HAVE_FASTAPI, "fastapi/testclient is not installed")
class HealthApiTests(unittest.TestCase):
    def test_health_endpoint(self) -> None:
        client = TestClient(create_app())
        self.addCleanup(client.close)
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")
