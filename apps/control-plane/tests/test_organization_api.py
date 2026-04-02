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
class OrganizationApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(create_app())

    def test_entities_endpoint_returns_department_of_state(self) -> None:
        response = self.client.get("/api/organization/entities")
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertTrue(any(item["entity_slug"] == "department_of_state" for item in body))

    def test_role_detail_endpoint_returns_secretary_of_state(self) -> None:
        response = self.client.get("/api/organization/roles/department_of_state/secretary_of_state")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["reference_level"], "L1")
