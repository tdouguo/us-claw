from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class EntitySummary:
    entity_slug: str
    phase: str
    entity_type: str
    role_count: int
    status: str


@dataclass(frozen=True)
class RoleRecord:
    entity_slug: str
    role_slug: str
    title_cn: str
    title_en: str
    entity_cn: str
    entity_en: str
    reference_level: str
    reference_level_name: str
    phase: str
    entity_type: str
    status: str
    path: str
    family: str = ""
    appointment_type: str = ""


@dataclass(frozen=True)
class ReferenceLevel:
    level: str
    name: str
    meaning: str
    current_count: int
