from __future__ import annotations

from enum import Enum


try:
    from enum import StrEnum
except ImportError:
    class StrEnum(str, Enum):
        """Compatibility shim for Python < 3.11."""


class TaskState(StrEnum):
    DRAFT = "draft"
    INTAKE_REVIEW = "intake_review"
    JURISDICTION_PENDING = "jurisdiction_pending"
    PLANNING = "planning"
    POLICY_REVIEW = "policy_review"
    LEGAL_REVIEW = "legal_review"
    BUDGET_OR_SECURITY_REVIEW = "budget_or_security_review"
    APPROVED_FOR_DISPATCH = "approved_for_dispatch"
    DISPATCHED = "dispatched"
    IN_PROGRESS = "in_progress"
    WAITING_EXTERNAL = "waiting_external"
    BLOCKED = "blocked"
    INTEGRATION_REVIEW = "integration_review"
    NEEDS_REWORK = "needs_rework"
    APPROVED = "approved"
    ROLLED_BACK = "rolled_back"
    CANCELLED = "cancelled"
    ARCHIVED = "archived"
