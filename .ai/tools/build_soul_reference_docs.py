# -*- coding: utf-8 -*-
from __future__ import annotations

from collections import Counter, defaultdict
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
DOCS_DIR = ROOT / "docs"
MATRIX_PATH = DOCS_DIR / "us-federal-soul-coverage-matrix.md"
INDEX_PATH = DOCS_DIR / "us-federal-soul-index.md"
QC_PATH = DOCS_DIR / "us-federal-soul-department-qc-sampling.md"
LEVEL_PATH = DOCS_DIR / "us-federal-soul-reference-levels.md"


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


def load_entity_meta() -> dict[str, dict[str, str]]:
    text = MATRIX_PATH.read_text(encoding="utf-8")
    rows = parse_table(text, "## Entity Coverage")
    meta: dict[str, dict[str, str]] = {}
    for row in rows:
        meta[row[1].strip("`")] = {
            "phase": row[0],
            "type": row[2],
            "role_count": row[3],
            "status": row[7],
        }
    return meta


def parse_soul(path: Path, entity_meta: dict[str, dict[str, str]]) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    title_match = re.match(r"^\#\s+(.+?)\s+\(`(.+)`\)$", lines[0].lstrip("\ufeff").strip())
    entity_match = re.search(r"- 所属实体：`([^`]+)` / `([^`]+)`", text)
    appointment_match = re.search(r"- 任命方式：(.*)", text)
    superior_match = re.search(r"- 上级：(.*)", text)
    removal_match = re.search(r"- 免职规则：(.*)", text)
    focus_match = re.search(r"- 岗位焦点：(.*)", text)

    entity_slug = path.parent.parent.name
    role_slug = path.parent.name
    meta = entity_meta[entity_slug]
    return {
        "entity_slug": entity_slug,
        "role_slug": role_slug,
        "title_cn": title_match.group(1),
        "title_en": title_match.group(2),
        "entity_cn": entity_match.group(1),
        "entity_en": entity_match.group(2),
        "phase": meta["phase"],
        "entity_type": meta["type"],
        "status": meta["status"],
        "appointment": appointment_match.group(1).strip() if appointment_match else "",
        "superior": superior_match.group(1).strip() if superior_match else "",
        "removal": removal_match.group(1).strip() if removal_match else "",
        "focus": focus_match.group(1).strip() if focus_match else "",
        "path": path.as_posix(),
    }


def is_entity_head(role: dict[str, str]) -> bool:
    slug = role["role_slug"]
    return slug in {
        "president",
        "vice_president",
        "white_house_chief_of_staff",
        "omb_director",
        "ostp_director",
        "national_security_advisor",
        "domestic_policy_council_director",
        "national_economic_council_director",
        "secretary_of_state",
        "secretary_of_the_treasury",
        "secretary_of_defense",
        "attorney_general",
        "secretary_of_homeland_security",
        "secretary_of_health_and_human_services",
        "secretary_of_education",
        "secretary_of_energy",
        "secretary_of_the_interior",
        "secretary_of_agriculture",
        "secretary_of_commerce",
        "secretary_of_labor",
        "secretary_of_transportation",
        "secretary_of_housing_and_urban_development",
        "secretary_of_veterans_affairs",
        "administrator",
        "director",
        "commissioner",
        "director_of_national_intelligence",
        "director_of_the_central_intelligence_agency",
        "united_states_trade_representative",
        "chair",
    }


def classify_family(role: dict[str, str]) -> str:
    slug = role["role_slug"]
    entity = role["entity_slug"]

    if slug in {"president", "vice_president"}:
        return "constitutional"
    if "inspector_general" in slug:
        return "oversight"
    if any(token in slug for token in ["general_counsel", "legal_adviser", "solicitor", "counsel_to_the_president", "office_of_legal_counsel"]):
        return "legal"
    if slug in {"chair", "commissioner", "governor", "vice_chair"}:
        return "commission_principal"
    if slug in {"white_house_chief_of_staff", "national_security_advisor", "omb_director", "ostp_director", "domestic_policy_council_director", "national_economic_council_director", "cabinet_secretary", "homeland_security_advisor", "administrator_of_oira"}:
        return "eop_core"
    if any(token in slug for token in ["chief_administrative_law_judge", "appellate_adjudication", "office_of_federal_operations"]):
        return "adjudication"
    if any(token in slug for token in ["economic_and_risk_analysis", "policy_planning", "chief_economist", "research_and_statistics", "monetary_affairs"]):
        return "economics_and_analysis"
    if any(token in slug for token in ["investor_advocate", "transparency", "civil_liberties_privacy_and_transparency"]):
        return "transparency_and_advocacy"
    if slug in {"chief_financial_officer", "chief_information_officer", "chief_information_security_officer", "chief_human_capital_officer", "chief_management_officer", "chief_operating_officer", "executive_director", "executive_director_for_operations", "executive_secretary", "managing_director", "chief_of_staff", "secretary", "secretary_of_the_board", "secretary_of_the_commission"}:
        return "management_and_operations"
    if slug.startswith("deputy_") or slug.startswith("principal_deputy") or slug in {"associate_attorney_general"}:
        return "deputy_leadership"
    if is_entity_head(role):
        return "head_of_entity"
    if any(token in slug for token in ["chief_of_digital_services", "chief_of_security_and_resiliency", "director_of_the_directorate_of_support", "director_of_the_directorate_of_digital_innovation"]):
        return "management_and_operations"
    if entity == "executive_office_of_the_president":
        return "eop_core"
    return "mission_delivery"


def classify_appointment_type(role: dict[str, str]) -> str:
    appointment = role["appointment"]
    removal = role["removal"]
    slug = role["role_slug"]

    if slug in {"president", "vice_president"} or "选举" in appointment:
        return "Election"
    if "先由总统提名并经参议院确认成为委员，再由总统指定为主席" in appointment:
        return "PAS + Presidential Designation"
    if "由总统直接任命，不经参议院确认" in appointment or "总统直接任命，不经参议院确认" in appointment:
        return "Presidential Direct"
    if "总统提名并经参议院确认" in appointment or "由总统提名并经参议院确认" in appointment:
        return "PAS"
    if "行政审判" in appointment or "公务员制度" in appointment or "ALJ" in appointment or "MSPB" in removal:
        return "Career Adjudication"
    if any(token in appointment for token in ["机构内部领导链任命", "委员会管理链任命", "依机构管理架构设置", "首长授权设置", "内部授权设置", "主管管理链授权任命", "内部领导链任命"]):
        return "Agency / Internal Appointment"
    if "不经参议院确认" in appointment:
        return "Non-Senate Appointment"
    return "Mixed / Institution-Specific"


def classify_level(role: dict[str, str]) -> str:
    slug = role["role_slug"]
    family = role["family"]
    entity = role["entity_slug"]

    if slug in {"president", "vice_president"}:
        return "L0"
    if family == "head_of_entity" or slug in {"white_house_chief_of_staff", "national_security_advisor", "omb_director", "ostp_director", "domestic_policy_council_director", "national_economic_council_director"}:
        return "L1"
    if family in {"commission_principal", "deputy_leadership"}:
        return "L2"
    if slug in {
        "chairman_of_the_joint_chiefs_of_staff",
        "fbi_director",
        "cbp_commissioner",
        "fema_administrator",
        "cdc_director",
        "nih_director",
        "cms_administrator",
        "faa_administrator",
        "fhwa_administrator",
        "nhtsa_administrator",
        "director_of_the_national_park_service",
        "commissioner_of_labor_statistics",
        "under_secretary_for_health",
        "under_secretary_for_benefits",
        "under_secretary_for_nuclear_security_and_nsa_administrator",
        "under_secretary_of_commerce_for_intellectual_property_and_director_of_the_uspto",
        "director_of_the_census_bureau",
        "chief_agricultural_negotiator",
    }:
        return "L2"
    if family in {"oversight", "legal"}:
        return "L3"
    if family == "mission_delivery":
        if slug.startswith("under_secretary") or slug.startswith("assistant_secretary") or "assistant_administrator" in slug or "associate_administrator" in slug or slug.startswith("assistant_director"):
            return "L3"
        if any(token in slug for token in ["director_of_the_division", "director_of_the_bureau", "director_of_the_office", "director_of_the_directorate"]):
            return "L4"
        return "L3"
    if family in {"management_and_operations", "economics_and_analysis", "transparency_and_advocacy", "eop_core"}:
        if slug in {"cabinet_secretary", "homeland_security_advisor", "administrator_of_oira", "counsel_to_the_president"}:
            return "L2"
        return "L4"
    if family == "adjudication":
        return "L5"
    if entity == "executive_office_of_the_president":
        return "L2"
    return "L4"


LEVEL_DESCRIPTIONS = {
    "L0": ("Constitutional Apex", "宪制顶层岗位。仅用于总统与副总统。"),
    "L1": ("National Principal Leadership", "国家级 principal leadership。通常是 Cabinet/独立机构首长或白宫核心主任。"),
    "L2": ("National Deputy / Principal Member", "国家级副手、委员会 principal member 或具有全国性业务统筹权的高位岗位。"),
    "L3": ("Department / Entity Senior Executive", "部门或实体级 senior executive，通常直接承接首长决策并统管关键链路。"),
    "L4": ("Enterprise / Specialized Executive", "企业治理型或专业化 executive，强调横向治理、专业支撑和专题统筹。"),
    "L5": ("Adjudication / Protected Specialist", "行政审理或受特殊程序保护的专业岗位，强调程序独立性与记录完整性。"),
}


def family_label(family: str) -> str:
    labels = {
        "constitutional": "Constitutional",
        "head_of_entity": "Head of Entity",
        "commission_principal": "Commission Principal",
        "deputy_leadership": "Deputy Leadership",
        "oversight": "Oversight",
        "legal": "Legal",
        "management_and_operations": "Management & Operations",
        "eop_core": "White House / EOP Core",
        "mission_delivery": "Mission Delivery",
        "economics_and_analysis": "Economics & Analysis",
        "adjudication": "Adjudication",
        "transparency_and_advocacy": "Transparency & Advocacy",
    }
    return labels[family]


def family_label_cn(family: str) -> str:
    labels = {
        "constitutional": "宪制岗位",
        "head_of_entity": "实体首长",
        "commission_principal": "委员会主成员",
        "deputy_leadership": "副手领导层",
        "oversight": "监察监督",
        "legal": "法律法务",
        "management_and_operations": "管理与运营",
        "eop_core": "白宫 / EOP 核心",
        "mission_delivery": "任务执行",
        "economics_and_analysis": "经济与分析",
        "adjudication": "行政审理",
        "transparency_and_advocacy": "透明与倡导",
    }
    return labels[family]


def appointment_type_cn(appointment_type: str) -> str:
    labels = {
        "Election": "选举产生",
        "PAS": "总统提名并经参议院确认",
        "PAS + Presidential Designation": "先确认后由总统指定",
        "Presidential Direct": "总统直接任命",
        "Career Adjudication": "职业审理任命",
        "Agency / Internal Appointment": "机构内部任命",
        "Non-Senate Appointment": "无需参议院确认",
        "Mixed / Institution-Specific": "混合 / 机构特定",
    }
    return labels[appointment_type]


def qc_reasons(role: dict[str, str]) -> tuple[int, str, str]:
    family = role["family"]
    level = role["level"]
    slug = role["role_slug"]
    appointment = role["appointment_type"]
    score = 0
    reasons: list[str] = []
    focus: list[str] = []

    if level in {"L0", "L1"}:
        score += 100
        reasons.append("顶层或实体首长岗位")
        focus.append("任命/免职与法定职责边界")
    if family == "commission_principal":
        score += 90
        reasons.append("合议制成员或主席岗位")
        focus.append("固定任期、投票边界与合议程序")
    if family == "oversight":
        score += 88
        reasons.append("监察独立性要求高")
        focus.append("Inspector General Act、对国会报告与独立性")
    if family == "legal":
        score += 85
        reasons.append("法律解释与程序边界敏感")
        focus.append("授权法、判例与法务链接口")
    if family == "adjudication":
        score += 82
        reasons.append("行政审理独立性和程序要求高")
        focus.append("ALJ/审理程序、MSPB 或记录规则")
    if family == "transparency_and_advocacy":
        score += 78
        reasons.append("新建专题岗位，命名贴合度需复核")
        focus.append("官方组织图/官网称谓与职责边界")
    if appointment in {"PAS", "PAS + Presidential Designation"}:
        score += 72
        reasons.append("PAS 岗位，公开问责与确认链复杂")
        focus.append("总统提名/参院确认与代理顺位")
    if slug in {
        "director_of_the_directorate_of_support",
        "director_of_the_directorate_of_digital_innovation",
        "chief_transparency_officer",
        "director_of_the_office_of_commission_appellate_adjudication",
        "director_of_the_office_of_federal_operations",
        "chief_of_digital_services",
        "chief_of_security_and_resiliency",
    }:
        score += 76
        reasons.append("自定义或高度实体化岗位")
        focus.append("官方岗位命名与组织位置")
    if family == "management_and_operations":
        score += 55
        reasons.append("跨办公室治理接口多")
        focus.append("职责是否过宽或与上级岗位重叠")
    if not reasons:
        score += 40
        reasons.append("代表性样本岗位")
        focus.append("正文质量与 sources 组织方式")
    return score, "；".join(dict.fromkeys(reasons)), "；".join(dict.fromkeys(focus))


def is_novel_review_role(role: dict[str, str]) -> bool:
    slug = role["role_slug"]
    family = role["family"]
    return slug in {
        "director_of_the_directorate_of_support",
        "director_of_the_directorate_of_digital_innovation",
        "chief_of_digital_services",
        "chief_of_security_and_resiliency",
        "intelligence_community_chief_financial_officer",
        "intelligence_community_chief_information_officer",
        "chief_of_the_office_of_civil_liberties_privacy_and_transparency",
        "chief_transparency_officer",
        "director_of_the_division_of_economic_and_risk_analysis",
        "director_of_the_office_of_the_investor_advocate",
        "director_of_the_bureau_of_consumer_protection",
        "director_of_the_office_of_policy_planning",
        "chief_economist",
        "chief_of_the_enforcement_bureau",
        "director_of_the_division_of_research_and_statistics",
        "director_of_the_division_of_monetary_affairs",
        "director_of_the_office_of_commission_appellate_adjudication",
        "director_of_the_office_of_federal_operations",
        "director_of_the_office_of_compliance_and_field_operations",
        "chief_administrative_law_judge",
    } or family in {"adjudication", "economics_and_analysis", "transparency_and_advocacy"}


def collect_roles() -> list[dict[str, str]]:
    entity_meta = load_entity_meta()
    roles: list[dict[str, str]] = []
    for soul in sorted(AGENTS_DIR.glob("*/**/SOUL.md")):
        role = parse_soul(soul, entity_meta)
        role["family"] = classify_family(role)
        role["family_label"] = family_label(role["family"])
        role["family_label_cn"] = family_label_cn(role["family"])
        role["appointment_type"] = classify_appointment_type(role)
        role["appointment_type_cn"] = appointment_type_cn(role["appointment_type"])
        role["level"] = classify_level(role)
        roles.append(role)
    return roles


def role_link(role: dict[str, str]) -> str:
    return f"[{role['title_cn']} (`{role['title_en']}`)](../agents/{role['entity_slug']}/{role['role_slug']}/SOUL.md)"


def render_index(roles: list[dict[str, str]]) -> str:
    by_entity: dict[str, list[dict[str, str]]] = defaultdict(list)
    by_family: dict[str, list[dict[str, str]]] = defaultdict(list)
    by_appointment: dict[str, list[dict[str, str]]] = defaultdict(list)
    entity_names: dict[str, str] = {}
    for role in roles:
        by_entity[role["entity_slug"]].append(role)
        by_family[role["family_label"]].append(role)
        by_appointment[role["appointment_type"]].append(role)
        entity_names[role["entity_slug"]] = role["entity_cn"]

    lines = [
        "# US Federal SOUL Index",
        "",
        "> 基于当前 `agents/` 目录自动生成的浏览入口。目标不是替代原始 `SOUL.md`，而是提供按 `部门/实体`、`岗位家族`、`任命类型` 的快速导航。",
        "",
        f"**Total SOULs:** `{len(roles)}`  ",
        f"**Entities:** `{len(by_entity)}`  ",
        f"**Families:** `{len(by_family)}`  ",
        f"**Appointment Types:** `{len(by_appointment)}`",
        "",
        "## 快速导航",
        "",
        "- [按部门 / 实体](#section-by-entity)",
        "- [按岗位家族](#section-by-family)",
        "- [按任命类型](#section-by-appointment)",
        "",
        '<a id="section-by-entity"></a>',
        "## 按部门 / 实体",
        "",
        "| Entity | 中文名称 | Phase | Type | Roles | Anchor |",
        "| --- | --- | --- | --- | --- | --- |",
    ]

    for entity, entity_roles in sorted(by_entity.items(), key=lambda item: (item[1][0]["phase"], item[0])):
        first = entity_roles[0]
        anchor = f"entity-{entity.replace('_', '-')}"
        lines.append(f"| `{entity}` | {first['entity_cn']} | {first['phase']} | {first['entity_type']} | {len(entity_roles)} | [查看](#{anchor}) |")

    for entity, entity_roles in sorted(by_entity.items(), key=lambda item: (item[1][0]["phase"], item[0])):
        first = entity_roles[0]
        lines.extend(
            [
                "",
                f'<a id="entity-{entity.replace("_", "-")}"></a>',
                f"### {first['entity_cn']} (`{entity}`)",
                "",
                f"- Phase: `{first['phase']}`",
                f"- Type: `{first['entity_type']}`",
                f"- Roles: `{len(entity_roles)}`",
                "",
                "| Role | Family | Appointment Type | Reference Level |",
                "| --- | --- | --- | --- |",
            ]
        )
        for role in entity_roles:
            lines.append(f"| {role_link(role)} | {role['family_label']} / {role['family_label_cn']} | {role['appointment_type']} / {role['appointment_type_cn']} | `{role['level']}` |")

    lines.extend(["", '<a id="section-by-family"></a>', "## 按岗位家族", "", "| Family | 中文名称 | Roles | Anchor |", "| --- | --- | --- | --- |"])
    for family, family_roles in sorted(by_family.items()):
        anchor = f"family-{family.lower().replace(' ', '-').replace('&', 'and').replace('/', '-')}"
        sample = family_roles[0]
        lines.append(f"| {family} | {sample['family_label_cn']} | {len(family_roles)} | [查看](#{anchor}) |")

    for family, family_roles in sorted(by_family.items()):
        sample = family_roles[0]
        lines.extend(
            [
                "",
                f'<a id="family-{family.lower().replace(" ", "-").replace("&", "and").replace("/", "-")}"></a>',
                f"### {family} / {sample['family_label_cn']}",
                "",
                "| Role | Entity | Appointment Type | Reference Level |",
                "| --- | --- | --- | --- |",
            ]
        )
        for role in sorted(family_roles, key=lambda item: (item["entity_slug"], item["role_slug"])):
            lines.append(f"| {role_link(role)} | `{role['entity_slug']}` / {role['entity_cn']} | {role['appointment_type']} / {role['appointment_type_cn']} | `{role['level']}` |")

    lines.extend(["", '<a id="section-by-appointment"></a>', "## 按任命类型", "", "| Appointment Type | 中文说明 | Roles | Anchor |", "| --- | --- | --- | --- |"])
    for appt, appt_roles in sorted(by_appointment.items()):
        anchor = f"appt-{appt.lower().replace(' ', '-').replace('/', '-').replace('+', 'plus')}"
        lines.append(f"| {appt} | {appointment_type_cn(appt)} | {len(appt_roles)} | [查看](#{anchor}) |")

    for appt, appt_roles in sorted(by_appointment.items()):
        lines.extend(
            [
                "",
                f'<a id="appt-{appt.lower().replace(" ", "-").replace("/", "-").replace("+", "plus")}"></a>',
                f"### {appt} / {appointment_type_cn(appt)}",
                "",
                "| Role | Entity | Family | Reference Level |",
                "| --- | --- | --- | --- |",
            ]
        )
        for role in sorted(appt_roles, key=lambda item: (item["entity_slug"], item["role_slug"])):
            lines.append(f"| {role_link(role)} | `{role['entity_slug']}` / {role['entity_cn']} | {role['family_label']} / {role['family_label_cn']} | `{role['level']}` |")

    return "\n".join(lines) + "\n"


def render_qc(roles: list[dict[str, str]]) -> str:
    by_entity: dict[str, list[dict[str, str]]] = defaultdict(list)
    for role in roles:
        by_entity[role["entity_slug"]].append(role)

    lines = [
        "# US Federal SOUL Department QC Sampling",
        "",
        "> 面向人工复核的抽样质检清单。这里不追求覆盖所有岗位，而是优先列出每个实体中最值得人工复核的样本岗位。",
        "",
        "## 抽样方法",
        "",
        "- 每个实体默认抽取 `3` 个岗位。",
        "- 优先级综合考虑：`首长/副手层级`、`任命与免职边界复杂度`、`合议制或固定任期`、`监察独立性`、`法律/审理程序敏感度`、`Phase 3 新增实体化岗位`。",
        "- 抽样目的不是证明其余岗位没有问题，而是用最少人工成本优先覆盖最容易出现叙事漂移的岗位。",
        "",
        "## 按部门 / 实体",
    ]

    for entity, entity_roles in sorted(by_entity.items(), key=lambda item: (item[1][0]["phase"], item[0])):
        scored = []
        for role in entity_roles:
            score, why, focus = qc_reasons(role)
            scored.append((score, role, why, focus))
        scored.sort(key=lambda item: (-item[0], item[1]["role_slug"]))
        picks = scored[:3]
        if not any(is_novel_review_role(item[1]) for item in picks):
            novel_pool = [item for item in scored if is_novel_review_role(item[1])]
            if novel_pool:
                picks = picks[:2] + [novel_pool[0]]
        first = entity_roles[0]
        lines.extend(
            [
                "",
                f"### {first['entity_cn']} (`{entity}`)",
                "",
                f"- Phase: `{first['phase']}`",
                f"- Type: `{first['entity_type']}`",
                "",
                "| Priority | Role | Reference Level | Why Review | Suggested Focus |",
                "| --- | --- | --- | --- | --- |",
            ]
        )
        for idx, (score, role, why, focus) in enumerate(picks, start=1):
            priority = f"P{idx}"
            lines.append(f"| {priority} | {role_link(role)} | `{role['level']}` | {why} | {focus} |")

    return "\n".join(lines) + "\n"


def render_levels(roles: list[dict[str, str]]) -> str:
    by_level: dict[str, list[dict[str, str]]] = defaultdict(list)
    for role in roles:
        by_level[role["level"]].append(role)
    counts = Counter(role["level"] for role in roles)

    lines = [
        "# US Federal SOUL Reference Levels",
        "",
        "> 这是一套面向 `SOUL` 目录维护的内部参考等级体系，用于检索、人工复核优先级和后续扩展分层。它**不是**美国联邦政府的法定官阶、薪级或 SES 等级映射。",
        "",
        "## 等级框架",
        "",
        "| Level | Name | Meaning | Current Count |",
        "| --- | --- | --- | --- |",
    ]
    for level in ["L0", "L1", "L2", "L3", "L4", "L5"]:
        name, meaning = LEVEL_DESCRIPTIONS[level]
        lines.append(f"| `{level}` | {name} | {meaning} | {counts[level]} |")

    lines.extend(
        [
            "",
            "## 使用建议",
            "",
            "- `L0-L1`：优先作为首轮人工复核样本，重点看任命/免职、法定边界与 sources。",
            "- `L2-L3`：优先检查职责边界、上下级关系与跨部门沟通线。",
            "- `L4-L5`：优先检查命名贴合度、组织位置、专业程序与是否与上级岗位重叠。",
            "",
            "## 全量参考级别清单",
        ]
    )

    for level in ["L0", "L1", "L2", "L3", "L4", "L5"]:
        name, meaning = LEVEL_DESCRIPTIONS[level]
        lines.extend(
            [
                "",
                f"### {level} - {name}",
                "",
                f"- 定义：{meaning}",
                f"- 当前数量：`{counts[level]}`",
                "",
                "| Role | Entity | Family | Appointment Type |",
                "| --- | --- | --- | --- |",
            ]
        )
        for role in sorted(by_level[level], key=lambda item: (item["entity_slug"], item["role_slug"])):
            lines.append(f"| {role_link(role)} | `{role['entity_slug']}` | {role['family_label']} | {role['appointment_type']} |")

    return "\n".join(lines) + "\n"


def main() -> None:
    roles = collect_roles()
    INDEX_PATH.write_text(render_index(roles), encoding="utf-8")
    QC_PATH.write_text(render_qc(roles), encoding="utf-8")
    LEVEL_PATH.write_text(render_levels(roles), encoding="utf-8")
    print(f"generated {INDEX_PATH.name}, {QC_PATH.name}, {LEVEL_PATH.name} from {len(roles)} SOUL files")


if __name__ == "__main__":
    main()
