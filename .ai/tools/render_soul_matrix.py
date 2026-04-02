from __future__ import annotations

from collections import defaultdict
from pathlib import Path

from build_soul_reference_docs import LEVEL_DESCRIPTIONS, collect_roles


def find_root() -> Path:
    current = Path(__file__).resolve().parent
    for candidate in (current, *current.parents):
        if (candidate / "agents").is_dir() and (candidate / "docs").is_dir():
            return candidate
    raise RuntimeError(f"workspace root not found from {__file__}")


ROOT = find_root()
AGENTS_DIR = ROOT / "agents"
MATRIX_PATH = ROOT / "docs" / "us-federal-soul-coverage-matrix.md"

PHASE3_QUEUE = """## Phase 3 Queue

| Target | Expansion Rule | Status |
| --- | --- | --- |
| Cabinet departments | 已补共享治理岗位 `Inspector General / CFO / CIO / CISO / CHCO`；后续如需再细化，可继续补特定 Assistant Secretary、关键局署首长与地区负责人。 | implemented |
| EOP and White House | 已补 Counsel to the President、Cabinet Secretary、Homeland Security Advisor、Administrator of OIRA。 | implemented |
| Independent agencies | 已补 `Inspector General`、高频治理岗与高价值任务支撑岗，包括 `CFO / CIO / CISO / CHCO`、数字服务、透明事务与情报支撑线。 | implemented |
| Commissions | 已补 `Inspector General`、经济分析、行政审理支持与核心执法/倡导岗位，包括 `DERA / ALJ / Consumer Protection / Economics / Appellate Adjudication`。 | implemented |
"""


def parse_table(text: str, heading: str) -> list[list[str]]:
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
        if line.startswith("| ---") or line.startswith("| Phase |") or line.startswith("| Entity |"):
            continue
        rows.append([cell.strip() for cell in line.strip().strip("|").split("|")])
    return rows


def title_from_doc(path: Path) -> str:
    first = path.read_text(encoding="utf-8").splitlines()[0]
    return first.lstrip("\ufeff").lstrip("#").strip()


def main() -> None:
    text = MATRIX_PATH.read_text(encoding="utf-8")
    coverage_rows = parse_table(text, "## Entity Coverage")
    ordered_meta = [(row[1].strip("`"), row[0], row[2]) for row in coverage_rows]
    roles = collect_roles()
    roles_by_entity: dict[str, list[dict[str, str]]] = defaultdict(list)
    for role in roles:
        roles_by_entity[role["entity_slug"]].append(role)

    entity_rows: list[str] = []
    role_rows: list[str] = []
    unified_rows: list[str] = []
    for entity, phase, entity_type in ordered_meta:
        entity_roles = sorted(roles_by_entity[entity], key=lambda item: item["role_slug"])
        entity_rows.append(
            f"| {phase} | `{entity}` | {entity_type} | {len(entity_roles)} | official + CRS/OPM + framework | yes | yes | implemented |"
        )
        role_rows.append(
            f"| `{entity}` | {phase} | {entity_type} | {len(entity_roles)} | "
            + ", ".join(f"`{role['role_slug']}`" for role in entity_roles)
            + " | "
            + ", ".join(f"`{role['title_cn']} (`{role['title_en']}`)`" for role in entity_roles)
            + " | "
            + ", ".join(f"`{role['role_slug']}: {role['level']}`" for role in entity_roles)
            + " |"
        )
        for role in entity_roles:
            level_name, _ = LEVEL_DESCRIPTIONS[role["level"]]
            unified_rows.append(
                f"| `{entity}` | {phase} | {entity_type} | `{role['role_slug']}` | "
                f"`{role['title_cn']} (`{role['title_en']}`)` | `{role['level']}` | {level_name} |"
            )

    content = (
        "# US Federal SOUL Coverage Matrix\n\n"
        "## Entity Coverage\n\n"
        "| Phase | Entity | Type | Roles | Source Types | 任命/免职说明 | 风格/人格块 | Status |\n"
        "| --- | --- | --- | --- | --- | --- | --- | --- |\n"
        + "\n".join(entity_rows)
        + "\n\n## Entity Role Sets\n\n"
        "| Entity | Phase | Type | Role Count | Role Slugs | Display Roles | Reference Levels |\n"
        "| --- | --- | --- | --- | --- | --- | --- |\n"
        + "\n".join(role_rows)
        + "\n\n## Unified Role Catalog\n\n"
        "| Entity | Phase | Type | Role Slug | Display Role | Reference Level | Level Name |\n"
        "| --- | --- | --- | --- | --- | --- | --- |\n"
        + "\n".join(unified_rows)
        + "\n\n"
        + PHASE3_QUEUE
    )
    MATRIX_PATH.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
