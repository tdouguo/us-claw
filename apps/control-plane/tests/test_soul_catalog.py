from __future__ import annotations

from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[3]
CONTROL_PLANE_DIR = ROOT / "apps" / "control-plane"
if str(CONTROL_PLANE_DIR) not in sys.path:
    sys.path.insert(0, str(CONTROL_PLANE_DIR))

from app.services.soul_catalog import SoulCatalog


class SoulCatalogTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.catalog = SoulCatalog.from_workspace(ROOT)

    def test_can_load_role_from_agents_catalog(self) -> None:
        role = self.catalog.get_role("department_of_state", "secretary_of_state")
        self.assertEqual(role.role_slug, "secretary_of_state")
        self.assertEqual(role.reference_level, "L1")
        self.assertEqual(role.title_en, "Secretary of State")

    def test_can_list_entities_from_coverage_matrix(self) -> None:
        entities = {entity.entity_slug: entity for entity in self.catalog.list_entities()}
        self.assertIn("department_of_state", entities)
        self.assertEqual(entities["department_of_state"].role_count, 11)

    def test_can_list_reference_levels(self) -> None:
        levels = {level.level: level for level in self.catalog.list_reference_levels()}
        self.assertIn("L1", levels)
        self.assertEqual(levels["L1"].name, "National Principal Leadership")


if __name__ == "__main__":
    unittest.main()
