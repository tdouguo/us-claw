from __future__ import annotations

from pathlib import Path
import re

from app.domain.org_models import EntitySummary, ReferenceLevel, RoleRecord


ENTITY_LINE_RE = re.compile(r"^- 所属实体：`([^`]+)` / `([^`]+)`$", re.MULTILINE)
LEVEL_LINE_RE = re.compile(r"^- 参考级别：`([^`]+)` / `([^`]+)`$", re.MULTILINE)
TITLE_LINE_RE = re.compile(r"^\#\s+(.+?)\s+\(`(.+)`\)$")
INDEX_ENTITY_RE = re.compile(r"^### .*?\(`([^`]+)`\)$")
INDEX_ROLE_LINK_RE = re.compile(r"\[.+?\]\(\.\./agents/([^/]+)/([^/]+)/SOUL\.md\)")


class SoulCatalog:
    def __init__(
        self,
        root: Path,
        entities: dict[str, EntitySummary],
        roles: dict[tuple[str, str], RoleRecord],
        reference_levels: dict[str, ReferenceLevel],
    ) -> None:
        self.root = root
        self._entities = entities
        self._roles = roles
        self._reference_levels = reference_levels

    @classmethod
    def from_workspace(cls, root: Path) -> "SoulCatalog":
        root = root.resolve()
        entities = cls._load_entities(root / "docs" / "us-federal-soul-coverage-matrix.md")
        reference_levels = cls._load_reference_levels(root / "docs" / "us-federal-soul-reference-levels.md")
        index_meta = cls._load_index_meta(root / "docs" / "us-federal-soul-index.md")
        roles = cls._load_roles(root / "agents", entities, index_meta, reference_levels)
        return cls(root=root, entities=entities, roles=roles, reference_levels=reference_levels)

    @staticmethod
    def _parse_markdown_table(text: str, heading: str) -> list[list[str]]:
        rows: list[list[str]] = []
        active = False
        for line in text.splitlines():
            if line.strip() == heading:
                active = True
                continue
            if active and line.startswith("## "):
                break
            if not active or not line.startswith("| "):
                continue
            if line.startswith("| ---") or line.startswith("| Phase |") or line.startswith("| Level |"):
                continue
            rows.append([cell.strip() for cell in line.strip().strip("|").split("|")])
        return rows

    @classmethod
    def _load_entities(cls, matrix_path: Path) -> dict[str, EntitySummary]:
        text = matrix_path.read_text(encoding="utf-8")
        rows = cls._parse_markdown_table(text, "## Entity Coverage")
        entities: dict[str, EntitySummary] = {}
        for row in rows:
            entity_slug = row[1].strip("`")
            entities[entity_slug] = EntitySummary(
                entity_slug=entity_slug,
                phase=row[0],
                entity_type=row[2],
                role_count=int(row[3]),
                status=row[7],
            )
        return entities

    @classmethod
    def _load_reference_levels(cls, levels_path: Path) -> dict[str, ReferenceLevel]:
        text = levels_path.read_text(encoding="utf-8")
        rows = cls._parse_markdown_table(text, "## 等级框架")
        levels: dict[str, ReferenceLevel] = {}
        for row in rows:
            levels[row[0].strip("`")] = ReferenceLevel(
                level=row[0].strip("`"),
                name=row[1],
                meaning=row[2],
                current_count=int(row[3]),
            )
        return levels

    @staticmethod
    def _load_index_meta(index_path: Path) -> dict[tuple[str, str], tuple[str, str]]:
        lines = index_path.read_text(encoding="utf-8").splitlines()
        current_entity = ""
        metadata: dict[tuple[str, str], tuple[str, str]] = {}
        in_table = False
        for line in lines:
            entity_match = INDEX_ENTITY_RE.match(line.strip())
            if entity_match:
                current_entity = entity_match.group(1)
                in_table = False
                continue
            if line.startswith("| Role | Family | Appointment Type | Reference Level |"):
                in_table = True
                continue
            if in_table and line.startswith("| ---"):
                continue
            if in_table and line.startswith("| ["):
                cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
                link_match = INDEX_ROLE_LINK_RE.search(cells[0])
                if not link_match:
                    continue
                entity_slug, role_slug = link_match.groups()
                if current_entity and current_entity != entity_slug:
                    continue
                metadata[(entity_slug, role_slug)] = (cells[1], cells[2])
            elif in_table and not line.startswith("| "):
                in_table = False
        return metadata

    @classmethod
    def _load_roles(
        cls,
        agents_dir: Path,
        entities: dict[str, EntitySummary],
        index_meta: dict[tuple[str, str], tuple[str, str]],
        reference_levels: dict[str, ReferenceLevel],
    ) -> dict[tuple[str, str], RoleRecord]:
        roles: dict[tuple[str, str], RoleRecord] = {}
        for path in sorted(agents_dir.glob("*/*/SOUL.md")):
            text = path.read_text(encoding="utf-8")
            lines = text.splitlines()
            title_match = TITLE_LINE_RE.match(lines[0].lstrip("\ufeff").strip())
            entity_match = ENTITY_LINE_RE.search(text)
            level_match = LEVEL_LINE_RE.search(text)
            entity_slug = path.parent.parent.name
            role_slug = path.parent.name
            if not title_match:
                raise ValueError(f"failed to parse SOUL title: {path}")
            if not entity_match:
                raise ValueError(f"failed to parse entity metadata: {path}")
            if not level_match:
                raise ValueError(f"failed to parse reference level metadata: {path}")
            if entity_slug not in entities:
                raise KeyError(f"entity {entity_slug} is missing from coverage matrix")
            entity = entities[entity_slug]
            level_key = level_match.group(1)
            if level_key not in reference_levels:
                raise KeyError(f"reference level {level_key} is missing from level catalog")
            level = reference_levels[level_key]
            family, appointment_type = index_meta.get((entity_slug, role_slug), ("", ""))
            roles[(entity_slug, role_slug)] = RoleRecord(
                entity_slug=entity_slug,
                role_slug=role_slug,
                title_cn=title_match.group(1),
                title_en=title_match.group(2),
                entity_cn=entity_match.group(1),
                entity_en=entity_match.group(2),
                reference_level=level.level,
                reference_level_name=level.name,
                phase=entity.phase,
                entity_type=entity.entity_type,
                status=entity.status,
                path=path.as_posix(),
                family=family,
                appointment_type=appointment_type,
            )
        return roles

    def list_entities(self) -> list[EntitySummary]:
        return sorted(self._entities.values(), key=lambda item: item.entity_slug)

    def list_roles(self, entity_slug: str) -> list[RoleRecord]:
        return sorted(
            [
                role
                for role in self._roles.values()
                if role.entity_slug == entity_slug
            ],
            key=lambda item: item.role_slug,
        )

    def get_role(self, entity_slug: str, role_slug: str) -> RoleRecord:
        return self._roles[(entity_slug, role_slug)]

    def list_reference_levels(self) -> list[ReferenceLevel]:
        return sorted(self._reference_levels.values(), key=lambda item: item.level)
