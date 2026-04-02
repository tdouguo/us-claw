# -*- coding: utf-8 -*-
from __future__ import annotations

import re
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

ENTITY_LINE_RE = re.compile(r"^(- 所属实体：`[^`]+` / `[^`]+`)$", re.MULTILINE)
LEVEL_LINE_RE = re.compile(r"^- 参考级别：`([^`]+)` / `([^`]+)`$", re.MULTILINE)


def sync_one(path: Path, level: str, level_name: str) -> bool:
    text = path.read_text(encoding="utf-8")
    level_line = f"- 参考级别：`{level}` / `{level_name}`"

    if LEVEL_LINE_RE.search(text):
        updated = LEVEL_LINE_RE.sub(level_line, text, count=1)
    else:
        updated = ENTITY_LINE_RE.sub(r"\1\n" + level_line, text, count=1)

    if updated == text:
        return False

    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = 0
    for role in collect_roles():
        level_name, _ = LEVEL_DESCRIPTIONS[role["level"]]
        soul_path = AGENTS_DIR / role["entity_slug"] / role["role_slug"] / "SOUL.md"
        if sync_one(soul_path, role["level"], level_name):
            changed += 1
    print(f"updated reference levels in {changed} SOUL files")


if __name__ == "__main__":
    main()
