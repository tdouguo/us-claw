# US Claw Control Plane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在当前 `US Federal SOUL` 知识库之上，落地一套可运行的控制面系统，包含三页签统一看板、Docker 启动机制、OpenClaw 安装/桥接机制，以及完整的任务处理流程。

**Architecture:** 首版采用“前后端分离控制面 + OpenClaw Bridge + 知识库事实源”的混合架构。`agents/` 和 `docs/` 继续作为事实源；新增 `apps/web` 提供三页签看板，`apps/control-plane` 提供任务与组织 API，`services/openclaw-bridge` 负责安装检测、workspace 同步与运行时状态采集，`deploy/` 提供 `demo/full` 双模式 Docker 启动。

**Tech Stack:** React + Vite + TypeScript、FastAPI + Pydantic、Node/TypeScript OpenClaw Bridge、SQLite（本地演示）/可扩展 Postgres、Docker Compose、PowerShell/Bash 安装脚本

---

## 范围与边界

- 当前仓库本质上仍是知识库，不存在现成前后端或容器骨架；本计划按“新增运行层，不重写知识层”执行。
- 首版目标是“能跑通控制面与运行桥接”，不是一次性完成完整生产级多租户平台。
- `agents/`、`docs/`、`.ai/` 现有正式资产不做结构性重写，只新增运行时目录并补最小文档链接。
- OpenClaw 安装流程优先复用官方安装脚本与官方目录约定，不自创替代安装器。
- Windows 平台安装文档明确区分：原生 PowerShell 支持与 `WSL2` 推荐路径。

## 执行模式

- 后续实现默认启用：
  - `多Agent模式`
  - `SubAgent模式`
  - `fast模式`
  - `多线程模式`
- 但上述模式仅用于独立且有收益的子任务，不得绕过：
  - `P3` 范围门禁
  - 依赖顺序
  - 风险控制
  - 回滚边界
- 推荐执行口径：
  - 骨架搭建、只读扫描、测试与 review 可并行
  - 共享写集、同目录高耦合改动、状态机核心逻辑应串行
  - 每完成一个阶段都应把关键信息回写到 `.ai/plans/` 与 `.ai/memory/`，以压缩会话上下文并降低后续执行对长聊天历史的依赖

## 目标系统

### 页签视图

1. `Mission Control`
   任务编排/执行中心，展示任务列表、状态列、审批链、升级链、回滚链、日志与执行节点。
2. `Organization`
   组织架构浏览入口，支持按实体、岗位家族、任命类型浏览，并从角色详情直接发起任务。
3. `OpenClaw Runtime`
   OpenClaw 节点/运行时监控中心，展示安装状态、版本、workspace、bridge 状态、最近同步、最近错误。

### 产品交互补充

- 参考 `golutra/golutra`，首版界面不只提供“纯表格式列表”，而是要保留一体化控制面的感觉：
  - 左侧或顶部保留稳定导航
  - 中央为任务/组织/运行态主视图
  - 右侧或底部预留详情、日志、事件流、终端输出抽屉
- `Mission Control` 与 `OpenClaw Runtime` 之间需要共享：
  - 当前任务关联节点
  - 最近执行日志
  - workspace / runtime 健康状态
- `Organization` 不只是知识浏览，还要承担“从组织模型进入执行”的入口职责

### 运行模式

- `demo mode`
  只依赖本仓库事实源与样例任务数据，启动 `web + control-plane`，用于演示与开发。
- `full mode`
  启动 `web + control-plane + openclaw-bridge`，接入真实 OpenClaw 安装与 workspace，同步任务到运行时。

### 任务处理总流程

`Intake -> Classification -> Coordination -> Jurisdiction -> Planning Bundle -> Review Gates -> Dispatch -> Execution -> Integration Review -> Approval / Rework / Rollback -> Archive`

---

## 目标目录结构

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/app/App.tsx`
- Create: `apps/web/src/features/mission-control/*`
- Create: `apps/web/src/features/organization/*`
- Create: `apps/web/src/features/runtime/*`
- Create: `apps/control-plane/pyproject.toml`
- Create: `apps/control-plane/app/main.py`
- Create: `apps/control-plane/app/api/*`
- Create: `apps/control-plane/app/domain/*`
- Create: `apps/control-plane/app/services/*`
- Create: `services/openclaw-bridge/package.json`
- Create: `services/openclaw-bridge/src/index.ts`
- Create: `services/openclaw-bridge/src/install/*`
- Create: `services/openclaw-bridge/src/runtime/*`
- Create: `packages/task-model/README.md`
- Create: `packages/org-graph/README.md`
- Create: `packages/soul-parser/README.md`
- Create: `deploy/docker-compose.yml`
- Create: `deploy/web.Dockerfile`
- Create: `deploy/control-plane.Dockerfile`
- Create: `deploy/openclaw-bridge.Dockerfile`
- Create: `scripts/install-openclaw.ps1`
- Create: `scripts/install-openclaw.sh`
- Create: `scripts/bootstrap-us-claw.ps1`
- Create: `scripts/bootstrap-us-claw.sh`
- Create: `docs/us-claw-control-plane-spec.md`
- Modify: `README.md`
- Modify: `docs/README.md`

---

### Task 1: 建立运行层目录与最小工程骨架

**Files:**
- Create: `apps/web/*`
- Create: `apps/control-plane/*`
- Create: `services/openclaw-bridge/*`
- Create: `deploy/*`
- Create: `scripts/*`
- Modify: `README.md`

- [ ] **Step 1: 创建运行层目录骨架**

创建以下空目录与占位文件：

```text
apps/web
apps/control-plane
services/openclaw-bridge
deploy
scripts
```

- [ ] **Step 2: 写根级运行层说明**

在 `README.md` 增加“Runtime / Control Plane”章节，说明知识层与运行层的边界。

- [ ] **Step 3: 补最小忽略规则**

根据新增前后端栈，按需更新 `.gitignore`，仅补运行层必要项，例如：

```gitignore
node_modules/
dist/
.venv/
.pytest_cache/
```

- [ ] **Step 4: 验证目录结构**

Run:

```powershell
Get-ChildItem -LiteralPath '.\apps','.\services','.\deploy','.\scripts'
```

Expected: 以上目录全部存在，且未破坏 `agents/`、`docs/`、`.ai/`。

- [ ] **Step 5: Commit**

```bash
git add README.md .gitignore apps services deploy scripts
git commit -m "chore: scaffold control plane runtime layout"
```

---

### Task 2: 定义共享域模型与事实源读取规则

**Files:**
- Create: `packages/task-model/README.md`
- Create: `packages/org-graph/README.md`
- Create: `packages/soul-parser/README.md`
- Create: `apps/control-plane/app/domain/task_state.py`
- Create: `apps/control-plane/app/domain/org_models.py`
- Create: `apps/control-plane/app/services/soul_catalog.py`
- Test: `apps/control-plane/tests/test_soul_catalog.py`

- [ ] **Step 1: 定义任务状态机**

在 `task_state.py` 固定以下状态：

```text
draft
intake_review
jurisdiction_pending
planning
policy_review
legal_review
budget_or_security_review
approved_for_dispatch
dispatched
in_progress
waiting_external
blocked
integration_review
needs_rework
approved
rolled_back
cancelled
archived
```

- [ ] **Step 2: 定义组织图读取模型**

在 `org_models.py` 中定义实体、岗位、岗位家族、任命类型、参考级别的统一结构。

- [ ] **Step 3: 写 SOUL 解析服务**

`soul_catalog.py` 负责读取：
- `agents/`
- `docs/us-federal-soul-coverage-matrix.md`
- `docs/us-federal-soul-index.md`

并暴露：
- `list_entities()`
- `list_roles(entity_slug)`
- `get_role(entity_slug, role_slug)`
- `list_reference_levels()`

- [ ] **Step 4: 写失败用例与最小通过实现**

```python
def test_can_load_role_from_agents_catalog():
    catalog = SoulCatalog.from_workspace(ROOT)
    role = catalog.get_role("department_of_state", "secretary_of_state")
    assert role.role_slug == "secretary_of_state"
    assert role.reference_level == "L1"
```

- [ ] **Step 5: 运行测试**

Run:

```powershell
pytest .\apps\control-plane\tests\test_soul_catalog.py -v
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages apps/control-plane
git commit -m "feat: add shared task and organization domain models"
```

---

### Task 3: 落地 Control Plane API

**Files:**
- Create: `apps/control-plane/pyproject.toml`
- Create: `apps/control-plane/app/main.py`
- Create: `apps/control-plane/app/api/health.py`
- Create: `apps/control-plane/app/api/organization.py`
- Create: `apps/control-plane/app/api/tasks.py`
- Create: `apps/control-plane/app/api/runtime.py`
- Create: `apps/control-plane/app/services/task_store.py`
- Test: `apps/control-plane/tests/test_health.py`
- Test: `apps/control-plane/tests/test_organization_api.py`
- Test: `apps/control-plane/tests/test_tasks_api.py`

- [ ] **Step 1: 建立 FastAPI 应用**

暴露以下基础路由：

```text
GET /health
GET /api/organization/entities
GET /api/organization/entities/{entity_slug}/roles
GET /api/organization/roles/{entity_slug}/{role_slug}
GET /api/tasks
POST /api/tasks
POST /api/tasks/{task_id}/transition
GET /api/runtime/status
```

- [ ] **Step 2: 用本地持久层保存任务**

首版支持 SQLite，本地文件建议放到：

```text
.ai/state/us-claw.db
```

- [ ] **Step 3: 为任务状态迁移加约束**

只允许合法状态转换，不允许前端直接任意跳转。

- [ ] **Step 4: 跑 API 测试**

Run:

```powershell
pytest .\apps\control-plane\tests -v
```

Expected: health、organization、tasks 路由均通过

- [ ] **Step 5: 手工启动 API**

Run:

```powershell
uvicorn app.main:app --reload --app-dir .\apps\control-plane
```

Expected: `GET /health` 返回 `200`

- [ ] **Step 6: Commit**

```bash
git add apps/control-plane
git commit -m "feat: add control plane API for org, tasks, and runtime"
```

---

### Task 4: 落地三页签统一看板

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/app/App.tsx`
- Create: `apps/web/src/app/routes.tsx`
- Create: `apps/web/src/features/mission-control/*`
- Create: `apps/web/src/features/organization/*`
- Create: `apps/web/src/features/runtime/*`
- Create: `apps/web/src/shared/api.ts`
- Test: `apps/web/src/app/App.test.tsx`

- [ ] **Step 1: 建立页签框架**

首版统一使用顶部页签：

```text
Mission Control
Organization
OpenClaw Runtime
```

- [ ] **Step 2: 先做静态壳层**

即使 API 还未完全接通，也先保证三页签、布局和导航完成。

- [ ] **Step 2.1: 吸收 `golutra` 的控制面体验**

首版壳层应预留：
- 详情抽屉
- 事件流/日志区
- 节点状态侧栏或卡片区
- 后续可接终端输出的面板占位

避免只做成“静态管理后台列表页”。

- [ ] **Step 3: 接通 Organization**

从 `control-plane` 读取实体列表、岗位列表、岗位详情。

- [ ] **Step 4: 接通 Mission Control**

展示任务列表、任务详情、状态流转、审批链。

- [ ] **Step 5: 接通 Runtime**

展示 bridge 状态、OpenClaw 安装状态、最近同步、最近错误。

- [ ] **Step 5.1: 补节点与工作区视图**

参考 `golutra` 的 runtime 操作面思路，Runtime 页签首版就应至少展示：
- 节点列表
- 工作区路径
- 最近同步状态
- 最近任务关联关系
- 关键错误摘要

- [ ] **Step 6: 组件测试**

Run:

```powershell
npm test -- --runInBand
```

Expected: App 壳层与页签切换测试通过

- [ ] **Step 7: 本地开发启动**

Run:

```powershell
npm run dev
```

Expected: 浏览器中可切换三页签并显示基础数据

- [ ] **Step 8: Commit**

```bash
git add apps/web
git commit -m "feat: add unified three-tab dashboard shell"
```

---

### Task 5: 实现任务编排与处理流程

**Files:**
- Create: `apps/control-plane/app/domain/task_router.py`
- Create: `apps/control-plane/app/domain/review_gates.py`
- Create: `apps/control-plane/app/domain/dispatch_planner.py`
- Create: `apps/control-plane/app/services/task_engine.py`
- Test: `apps/control-plane/tests/test_task_engine.py`

- [ ] **Step 1: 建模 Intake 与 Classification**

任务创建时必须生成：
- `mission_type`
- `risk_level`
- `owning_entity`
- `review_requirements`

- [ ] **Step 2: 建模 Coordination 与 Jurisdiction**

对跨实体任务生成：
- `lead_role`
- `supporting_roles`
- `required_review_roles`

- [ ] **Step 3: 建模 Dispatch Bundle**

输出执行包：

```json
{
  "task_id": "...",
  "lead_role": "...",
  "supporting_roles": ["..."],
  "review_gates": ["legal_review"],
  "rollback_owner": "..."
}
```

- [ ] **Step 3.1: 增加执行观察维度**

参考 `golutra` 的 task/runtime 一体化体验，Dispatch Bundle 还应为前端观察层保留：
- `execution_channel`
- `runtime_node_id`
- `workspace_ref`
- `latest_event_cursor`

- [ ] **Step 4: 为关键转换写测试**

覆盖：
- `draft -> intake_review`
- `planning -> legal_review`
- `approved_for_dispatch -> dispatched`
- `integration_review -> approved`
- `integration_review -> needs_rework`

- [ ] **Step 5: 运行任务引擎测试**

Run:

```powershell
pytest .\apps\control-plane\tests\test_task_engine.py -v
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/control-plane
git commit -m "feat: add task orchestration and review gate engine"
```

---

### Task 6: 实现从组织角色直接发起任务

**Files:**
- Modify: `apps/web/src/features/organization/*`
- Modify: `apps/web/src/features/mission-control/*`
- Modify: `apps/control-plane/app/api/tasks.py`
- Test: `apps/web/src/features/organization/role-launch.test.tsx`

- [ ] **Step 1: 在角色详情页加入入口**

按钮文案建议：

```text
以该角色发起任务
加入现有任务编排
查看该角色历史任务
```

- [ ] **Step 2: 任务创建时携带来源角色**

任务模型增加：
- `initiating_role`
- `initiating_entity`
- `launch_context`

- [ ] **Step 3: 前端联通**

从 `Organization` 页签可以直接跳转到 `Mission Control` 的任务创建表单，并带入角色上下文。

- [ ] **Step 4: 跑前端与 API 联调**

Expected: 从角色页发起任务后，任务中心可见新任务，且上下文已带入。

- [ ] **Step 5: Commit**

```bash
git add apps/web apps/control-plane
git commit -m "feat: allow tasks to be launched from organization roles"
```

---

### Task 7: 落地 OpenClaw Bridge 与安装检测

**Files:**
- Create: `services/openclaw-bridge/package.json`
- Create: `services/openclaw-bridge/src/index.ts`
- Create: `services/openclaw-bridge/src/install/check.ts`
- Create: `services/openclaw-bridge/src/install/bootstrap.ts`
- Create: `services/openclaw-bridge/src/runtime/status.ts`
- Create: `services/openclaw-bridge/src/runtime/workspace-sync.ts`
- Create: `scripts/install-openclaw.ps1`
- Create: `scripts/install-openclaw.sh`
- Create: `scripts/bootstrap-us-claw.ps1`
- Create: `scripts/bootstrap-us-claw.sh`
- Test: `services/openclaw-bridge/tests/status.test.ts`

- [ ] **Step 1: 只复用官方安装逻辑，不自写替代安装器**

安装检查至少覆盖：
- Node 版本
- Docker
- `openclaw` 命令是否存在
- `~/.openclaw/openclaw.json`
- `~/.openclaw/workspace`

- [ ] **Step 2: 分离两个脚本职责**

```text
install-openclaw.*    -> 安装或检测 OpenClaw
bootstrap-us-claw.*   -> 同步本项目到 OpenClaw
```

- [ ] **Step 3: workspace 同步逻辑**

将 `agents/` 与任务模板同步到工作目录，不直接改写现有知识库。

- [ ] **Step 4: 运行时状态 API**

Bridge 向控制面暴露：
- installed
- version
- workspace_path
- last_sync_at
- bridge_status
- latest_error

- [ ] **Step 4.1: 补事件与日志聚合**

参考 `golutra` 的运行观察思路，Bridge 还应预留：
- 最近任务事件
- 最近节点日志
- workspace 同步日志
- 安装/bootstrap 最近执行记录

- [ ] **Step 5: 运行 bridge 测试**

Run:

```powershell
npm test -- --runInBand
```

Expected: 安装检测与状态组装逻辑通过

- [ ] **Step 6: Commit**

```bash
git add services/openclaw-bridge scripts
git commit -m "feat: add OpenClaw bridge and bootstrap scripts"
```

---

### Task 8: 落地 Docker 启动机制

**Files:**
- Create: `deploy/docker-compose.yml`
- Create: `deploy/web.Dockerfile`
- Create: `deploy/control-plane.Dockerfile`
- Create: `deploy/openclaw-bridge.Dockerfile`
- Create: `docs/us-claw-control-plane-spec.md`
- Modify: `README.md`
- Modify: `docs/README.md`

- [ ] **Step 1: 定义 demo/full 双模式**

`docker-compose.yml` 至少包含：
- `web`
- `control-plane`
- `openclaw-bridge`（`full` profile）

- [ ] **Step 2: 定义环境变量契约**

至少包括：

```text
US_CLAW_MODE
US_CLAW_DB_PATH
US_CLAW_BRIDGE_URL
OPENCLAW_HOME
OPENCLAW_WORKSPACE
```

- [ ] **Step 3: 保证 demo mode 可独立运行**

Run:

```powershell
docker compose -f .\deploy\docker-compose.yml --profile demo up --build
```

Expected: 只启动 `web + control-plane` 也能看到完整三页签壳层和样例数据。

- [ ] **Step 4: 保证 full mode 能接 bridge**

Run:

```powershell
docker compose -f .\deploy\docker-compose.yml --profile full up --build
```

Expected: `Runtime` 页签能看到 bridge 状态。

- [ ] **Step 5: 补正式规格文档**

`docs/us-claw-control-plane-spec.md` 必须写清：
- 页签结构
- 任务状态机
- Docker 模式
- OpenClaw 脚本职责
- 事实源与运行层边界

- [ ] **Step 6: Commit**

```bash
git add deploy docs README.md
git commit -m "feat: add dockerized control plane startup flows"
```

---

### Task 9: 验证与收口

**Files:**
- Modify: `README.md`
- Modify: `docs/README.md`
- Modify: `.ai/memory/*.md`（如需追加）

- [ ] **Step 1: 跑后端测试**

```powershell
pytest .\apps\control-plane\tests -v
```

- [ ] **Step 2: 跑前端测试**

```powershell
npm test -- --runInBand
```

- [ ] **Step 3: 跑 bridge 测试**

```powershell
npm test -- --runInBand
```

- [ ] **Step 4: 跑 Docker 冒烟**

```powershell
docker compose -f .\deploy\docker-compose.yml --profile demo up --build
```

- [ ] **Step 5: 核对入口文档**

确认 `README.md` 与 `docs/README.md` 能回答：
- 怎么启动
- 怎么看三页签
- 怎么安装 OpenClaw
- 任务如何流转

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "docs: finalize control plane runtime onboarding and validation notes"
```

---

## 吸纳参考项目的方式

### 来自 `edict`

- 吸纳 `dashboard + install + sync + runtime` 的整体产品面，而不是复刻三省六部隐喻。
- 吸纳统一入口看板、安装脚本、Docker 启动与运行状态同步的产品节奏。

### 来自 `golutra`

- 吸纳“workspace / runtime / task / terminal 是一体化操作面”的思路。
- 吸纳“多视图切换、任务中心与运行监控并重”的产品组织方式。
- 吸纳“本地开发体验优先、桥接 CLI/runtime” 的实现思路。
- 不在 V1 直接照搬其桌面壳体；首版仍以 `web + docker + bridge` 为主，桌面壳体作为后续增强项。
- 具体吸纳到 V1 的点包括：
  - 三页签统一控制台而不是散乱工具集合
  - 任务、节点、workspace、日志之间的联动观察模型
  - 预留终端/事件流面板，而不是只做 CRUD 式列表页
  - 运行态桥接与控制面解耦，避免把 runtime 细节直接塞进主 API

### 来自 `OpenClaw`

- 官方安装与配置逻辑优先，不自造新的安装协议。
- `~/.openclaw` 继续作为 OpenClaw 事实目录，本项目只做桥接与补充配置。

---

## 风险与回滚

- 风险 1：当前仓库没有运行时代码，`Task 1-3` 是从零起步，第一阶段最容易出现目录和技术栈分裂。
- 风险 2：OpenClaw CLI 与目录约定可能演进，bridge 需要隔离，不应让主控制面直接耦死 CLI 细节。
- 风险 3：Windows 原生 Docker/Node/OpenClaw 组合可能不如 `WSL2` 稳定，安装脚本必须给出平台差异提示。
- 回滚方式：新增目录按 `apps/`、`services/`、`deploy/`、`scripts/` 独立回滚；不改 `agents/` 原始事实层即可保留知识库完整性。

## 验收标准

- 三页签看板可切换并展示真实或样例数据。
- 任务可以创建、状态流转、升级、退回和归档。
- 组织页可从角色详情发起任务。
- Runtime 页可显示 OpenClaw 安装/同步/错误状态。
- Runtime 页可展示节点、workspace、最近事件或日志摘要，不只是健康检查布尔值。
- `demo mode` 与 `full mode` 都可通过 Docker 启动。
- OpenClaw 安装脚本与本项目 bootstrap 脚本职责分离。
- 文档能清楚解释“如何启动、如何安装、如何处理任务”。
