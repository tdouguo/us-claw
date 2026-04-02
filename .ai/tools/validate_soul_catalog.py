from __future__ import annotations

from pathlib import Path
import re


def find_root() -> Path:
    current = Path(__file__).resolve().parent
    for candidate in (current, *current.parents):
        if (candidate / "agents").is_dir() and (candidate / "docs").is_dir():
            return candidate
    raise RuntimeError(f"workspace root not found from {__file__}")


ROOT = find_root()
AGENTS_DIR = ROOT / "agents"
MATRIX_PATH = ROOT / "docs" / "us-federal-soul-coverage-matrix.md"

REQUIRED_HEADINGS = [
    "## 身份与定位",
    "## 法定/组织位置",
    "## 汇报关系与任命免职",
    "## 职责",
    "## 任职要求",
    "## 任职边界",
    "## 沟通与协作",
    "## 决策权与升级路径",
    "## 考核规则",
    "## speaking_style",
    "### style_library",
    "### role_profile",
    "## personality",
    "### framework_library",
    "## sources",
    "### official",
    "### framework",
]

FORBIDDEN_LINES = [
    "- Phase:",
    "- Department / Entity:",
    "- Role Slug:",
]

FORBIDDEN_TITLE_PATTERN = re.compile(
    r"^\# .*"
    r"\((Head|Deputy Head|Chief Operating / Management Role|Flagship Mission Role|Vice Chair if statutory|Chief of Staff or Equivalent|Executive Director or Secretary)\)$"
)
REFERENCE_LEVEL_PATTERN = re.compile(r"^- 参考级别：`([^`]+)` / `([^`]+)`$", re.MULTILINE)


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


def validate_file(path: Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    for heading in REQUIRED_HEADINGS:
        if heading not in text:
            errors.append(f"[structure] {path}: missing heading {heading}")
    for prefix in FORBIDDEN_LINES:
        if any(line.startswith(prefix) for line in lines):
            errors.append(f"[structure] {path}: contains non-SOUL metadata line {prefix}")
    if text.count("### role_profile") < 2:
        errors.append(f"[structure] {path}: expected both speaking_style and personality role_profile blocks")
    if "[" not in text or "](" not in text:
        errors.append(f"[structure] {path}: expected markdown links in sources")
    if lines and FORBIDDEN_TITLE_PATTERN.match(lines[0].lstrip("\ufeff").strip()):
        errors.append(f"[structure] {path}: contains placeholder title pattern")
    if not REFERENCE_LEVEL_PATTERN.search(text):
        errors.append(f"[structure] {path}: missing Reference Level metadata line")
    return errors


def load_matrix() -> tuple[dict[str, dict[str, str]], dict[str, list[str]], dict[tuple[str, str], str], list[str]]:
    if not MATRIX_PATH.exists():
        return {}, {}, {}, [f"[matrix] missing coverage matrix: {MATRIX_PATH}"]

    text = MATRIX_PATH.read_text(encoding="utf-8")
    coverage_rows = parse_table(text, "## Entity Coverage")
    role_rows = parse_table(text, "## Entity Role Sets")
    unified_rows = parse_table(text, "## Unified Role Catalog")
    errors: list[str] = []

    if not coverage_rows:
        errors.append("[matrix] missing Entity Coverage rows")
    if not role_rows:
        errors.append("[matrix] missing Entity Role Sets rows")
    if not unified_rows:
        errors.append("[matrix] missing Unified Role Catalog rows")

    coverage: dict[str, dict[str, str]] = {}
    for row in coverage_rows:
        if len(row) != 8:
            errors.append(f"[matrix] malformed Entity Coverage row: {row}")
            continue
        coverage[row[1].strip("`")] = {
            "phase": row[0],
            "type": row[2],
            "roles": row[3],
        }

    role_sets: dict[str, list[str]] = {}
    for row in role_rows:
        if len(row) < 6:
            errors.append(f"[matrix] malformed Entity Role Sets row: {row}")
            continue
        entity = row[0].strip("`")
        slugs = [item.strip().strip("`") for item in row[4].split(",") if item.strip()]
        role_sets[entity] = slugs
        if entity in coverage and str(len(slugs)) != coverage[entity]["roles"]:
            errors.append(
                f"[matrix] role count mismatch for {entity}: coverage={coverage[entity]['roles']} role_sets={len(slugs)}"
            )

    if set(coverage) != set(role_sets):
        missing_in_role_sets = sorted(set(coverage) - set(role_sets))
        missing_in_coverage = sorted(set(role_sets) - set(coverage))
        if missing_in_role_sets:
            errors.append(f"[matrix] entities missing in Entity Role Sets: {missing_in_role_sets}")
        if missing_in_coverage:
            errors.append(f"[matrix] entities missing in Entity Coverage: {missing_in_coverage}")

    unified_catalog: dict[tuple[str, str], str] = {}
    for row in unified_rows:
        if len(row) != 7:
            errors.append(f"[matrix] malformed Unified Role Catalog row: {row}")
            continue
        entity = row[0].strip("`")
        slug = row[3].strip("`")
        level = row[5].strip("`")
        unified_catalog[(entity, slug)] = level

    return coverage, role_sets, unified_catalog, errors


def scan_catalog() -> dict[str, list[str]]:
    catalog: dict[str, list[str]] = {}
    for entity_dir in sorted(p for p in AGENTS_DIR.iterdir() if p.is_dir()):
        roles = []
        for role_dir in sorted(p for p in entity_dir.iterdir() if p.is_dir()):
            if (role_dir / "SOUL.md").exists():
                roles.append(role_dir.name)
        catalog[entity_dir.name] = roles
    return catalog


def main() -> int:
    if not AGENTS_DIR.exists():
        print(f"[role_set] missing catalog root: {AGENTS_DIR}")
        return 1

    soul_files = sorted(AGENTS_DIR.glob("*/**/SOUL.md"))
    if not soul_files:
        print(f"[structure] no SOUL files found under {AGENTS_DIR}")
        return 1

    coverage, role_sets, unified_catalog, errors = load_matrix()

    for soul in soul_files:
        errors.extend(validate_file(soul))

    catalog = scan_catalog()
    if coverage and set(catalog) != set(coverage):
        missing_dirs = sorted(set(coverage) - set(catalog))
        extra_dirs = sorted(set(catalog) - set(coverage))
        if missing_dirs:
            errors.append(f"[role_set] entities declared in matrix but missing on disk: {missing_dirs}")
        if extra_dirs:
            errors.append(f"[role_set] entities present on disk but missing in matrix: {extra_dirs}")

    for entity, expected_roles in role_sets.items():
        actual_roles = catalog.get(entity, [])
        if actual_roles != expected_roles:
            missing_roles = sorted(set(expected_roles) - set(actual_roles))
            extra_roles = sorted(set(actual_roles) - set(expected_roles))
            if missing_roles:
                errors.append(f"[role_set] {entity}: missing role directories {missing_roles}")
            if extra_roles:
                errors.append(f"[role_set] {entity}: unexpected role directories {extra_roles}")
            if not missing_roles and not extra_roles:
                errors.append(f"[role_set] {entity}: role ordering mismatch between matrix and disk")

    for soul in soul_files:
        entity = soul.parent.parent.name
        slug = soul.parent.name
        text = soul.read_text(encoding="utf-8")
        level_match = REFERENCE_LEVEL_PATTERN.search(text)
        if not level_match:
            continue
        file_level = level_match.group(1)
        matrix_level = unified_catalog.get((entity, slug))
        if matrix_level is None:
            errors.append(f"[matrix] missing Unified Role Catalog entry for {entity}/{slug}")
        elif matrix_level != file_level:
            errors.append(
                f"[matrix] Reference Level mismatch for {entity}/{slug}: soul={file_level} matrix={matrix_level}"
            )

    if unified_catalog and len(unified_catalog) != len(soul_files):
        errors.append(
            f"[matrix] Unified Role Catalog count mismatch: matrix={len(unified_catalog)} souls={len(soul_files)}"
        )

    if errors:
        print("\n".join(errors))
        return 1

    print(f"validated {len(soul_files)} SOUL files with structure + matrix + role-set checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
