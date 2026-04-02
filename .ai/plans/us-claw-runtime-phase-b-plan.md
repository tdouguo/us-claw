# US-claw Runtime Phase B Implementation Plan

> Phase A 已完成 `web + control-plane + openclaw-bridge + scripts + deploy` 的最小骨架。本计划承接 Phase A，聚焦把 OpenClaw 运行时接入、任务时间线、dashboard 聚合接口和三页看板补成可演示、可验证、可继续扩展的第二阶段实现。

## 1. 当前快照

- 基线提交：`0ba09d4`
- 已落地：
  - `apps/control-plane`：organization/tasks/runtime/health API、SQLite `TaskStore`
  - `apps/web`：三标签框架与基础样式
  - `services/openclaw-bridge`：最小 bridge 服务
  - `scripts/install-openclaw.*` / `scripts/bootstrap-us-claw.*`
  - `deploy/docker-compose.yml`：`demo/full` profile
- 本阶段目标：
  - 支持 `Web -> Control Plane -> OpenClaw Bridge -> OpenClaw` 的运行时观测链路
  - 用 `edict` 的任务看板思路补齐 Mission Control
  - 用 `golutra` 的 runtime / logs / events 一体化观测思路补齐 Runtime 页

## 2. 影响范围

- 代码目录：
  - `apps/control-plane/app/api/*`
  - `apps/control-plane/app/services/*`
  - `apps/control-plane/tests/*`
  - `apps/web/src/**`
  - `services/openclaw-bridge/src/**`
  - `services/openclaw-bridge/tests/**`
  - `scripts/bootstrap-us-claw.*`
- 文档目录：
  - `README.md`
  - `docs/README.md`
  - `scripts/README.md`
  - `deploy/README.md`
  - `.ai/memory/us-claw-runtime-phase-b-memory.md`

## 3. 任务拆解

### Task A: Control Plane runtime / timeline / dashboard

- 新增 `task_events` 持久化表，记录任务创建与状态迁移。
- 新增 `GET /api/tasks/{task_id}/events`，为右侧 sidecar 的任务时间线提供数据。
- 新增 `GET /api/dashboard/summary`，统一返回：
  - dashboard metrics
  - tasks / recent_tasks
  - recent_events
  - runtime summary
- `GET /api/runtime/status` 改成优先走 bridge，失败时分层降级为：
  - `not_installed`
  - `bridge_unreachable`
  - 其余 bridge 返回状态
- 新增：
  - `GET /api/runtime/events`
  - `GET /api/runtime/logs`

### Task B: OpenClaw bridge observability

- `services/openclaw-bridge` 从 `/health` + `/status` 扩展为：
  - `/status`
  - `/events`
  - `/logs`
- bridge 读取 OpenClaw workspace 下的：
  - `us-claw-bootstrap.json`
  - `us-claw-runtime-events.jsonl`
  - `us-claw-runtime-logs.jsonl`
- 运行时状态细化为：
  - `not_installed`
  - `installed_not_bootstrapped`
  - `workspace_registered`
  - `ready`
- 兼容 Windows PowerShell 5 写出的 UTF-8 BOM manifest。

### Task C: Bootstrap registration artifacts

- `bootstrap-us-claw.*` 不再只写 manifest。
- 现在同时写出：
  - `us-claw-bootstrap.json`
  - `us-claw-runtime-events.jsonl`
  - `us-claw-runtime-logs.jsonl`
- manifest 额外记录：
  - `workspace_slug`
  - `bridge_url`
  - `control_plane_url`
  - `runtime_files`

### Task D: Web unified console

- Mission Control：
  - summary cards
  - kanban state columns
  - entity / risk / review requirement / keyword filters
  - click card -> sidecar task details + timeline
  - sidecar legal next-state actions
  - manual dashboard refresh
- Organization：
  - entities -> roles -> role detail
  - 从角色发起任务
  - 创建后反馈到控制台
- OpenClaw Runtime：
  - runtime status cards
  - event stream
  - log panel
  - latest error summary
- App 级 sidecar 从静态说明改为按页面驱动的动态内容容器。

## 4. 验证命令

### 后端

执行目录：仓库根目录 `F:\Workspace\Github\US-claw`

前置依赖：
- Python 环境中已安装 `fastapi` / `testclient`

命令：

```powershell
python -m unittest discover apps/control-plane/tests -v
```

预期产物：
- `apps/control-plane` 全量测试通过

失败处理：
- 先看具体是 API 路由、runtime 分层还是 `task_events` 顺序问题
- 禁止直接跳过失败用例

### Bridge

执行目录：`F:\Workspace\Github\US-claw\services\openclaw-bridge`

前置依赖：
- 已执行 `npm install`

命令：

```powershell
npm test
npm run build
```

预期产物：
- `runtime-status.test.ts` 全绿
- `dist/` 构建成功

失败处理：
- 先区分是 TS 编译问题、路径解析问题、还是 workspace manifest / JSONL 读取问题

### Bootstrap smoke

执行目录：仓库根目录

前置依赖：
- 手动指定临时 `OPENCLAW_HOME`

命令：

```powershell
.\scripts\bootstrap-us-claw.ps1
```

预期产物：
- 目标 workspace 下出现：
  - `us-claw-bootstrap.json`
  - `us-claw-runtime-events.jsonl`
  - `us-claw-runtime-logs.jsonl`

失败处理：
- 先确认 `OPENCLAW_HOME` 是否存在
- 再确认脚本输出路径与写入权限

### Web

执行目录：`F:\Workspace\Github\US-claw\apps\web`

前置依赖：
- 已执行 `npm install`

命令：

```powershell
npm test
npm run build
```

预期产物：
- React/Vitest 用例通过
- Vite 构建成功

失败处理：
- 先区分是测试依赖缺失、mock 数据 shape 不一致，还是 sidecar / fetch 流程问题

## 5. 风险与回滚

- 风险：
  - runtime 状态被本地目录与 bridge 状态混淆
  - Windows PowerShell 5 写出的 UTF-8 BOM 破坏 manifest 读取
  - 任务事件时间线排序因 SQLite 秒级比较失真
  - Web 新增数据流后，sidecar 与 tab 之间的状态耦合变高
- 回滚方式：
  - 后端可回滚到不含 `dashboard.py` / `runtime_gateway.py` / `task_events` 的 Phase A 状态
  - bridge 可回滚到 `/health` + `/status` 最小服务
  - bootstrap 可回滚到仅写 manifest 的旧版本
  - Web 可回滚到静态三标签壳层

## 6. 当前阻塞与默认口径

- `apps/web` 在初始快照中没有 `node_modules`，执行前必须先 `npm install`
- Python 环境里未安装 `pytest` 不阻塞本阶段；当前默认以后端 `unittest` 为准
- 本阶段默认通过 bridge 隔离 OpenClaw，不把 CLI 直接塞进 control-plane
- 本阶段默认保持三标签信息架构，不重做路由
