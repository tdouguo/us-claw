# US-claw Runtime Phase B Memory

## 主题

在 `Runtime Phase A` 已完成最小骨架的基础上，推进 `Phase B`：

- control-plane 增加 `task_events` / `dashboard summary` / `runtime events + logs`
- openclaw-bridge 从静态状态探测升级为可读 manifest / events / logs 的运行时观测服务
- bootstrap 从只写 manifest 升级为写 manifest + runtime seed files
- Web 从占位三标签升级为数据驱动统一控制台

## 本轮关键结论

- 当前仓库不是“还没支持 OpenClaw”，而是“已有 bridge 和 bootstrap 骨架，但缺少真实 runtime observability”。
- `edict` 的主要吸纳点是：
  - Mission Control 看板
  - 任务时间线 / 审计链
  - dashboard summary 聚合接口
- `golutra` 的主要吸纳点是：
  - runtime / logs / events 一体化观测
  - sidecar / details panel 的操作视角
  - 本地 workspace 导向的 runtime 集成
- 不吸纳：
  - `edict` 的制度叙事与产品壳
  - `golutra` 的桌面端壳与重型执行框架

## 已落地实现

### 1. control-plane

- 新增：
  - `app/api/dashboard.py`
  - `app/services/dashboard_summary.py`
  - `app/services/runtime_gateway.py`
- `TaskStore` 新增：
  - `task_events` 表
  - `list_task_events()`
  - `list_events()`
- `api/tasks.py` 新增：
  - `GET /api/tasks/{task_id}/events`
- `api/runtime.py` 新增：
  - `GET /api/runtime/events`
  - `GET /api/runtime/logs`
- `api/runtime.py` 改为由 `RuntimeGateway` 聚合 bridge 状态，并补回本地：
  - `workspace_path`
  - `database_path`
  - `task_count`
  - `entity_count`

### 2. bridge

- `services/openclaw-bridge/src/index.ts` 新增：
  - `/events`
  - `/logs`
- `services/openclaw-bridge/src/runtime/status.ts` 现在负责：
  - 读取 bootstrap manifest
  - 读取 runtime events / logs
  - 判定 `not_installed / installed_not_bootstrapped / workspace_registered / ready`
  - 提取 `latestSyncAt / latestError`
- 额外修复：
  - 兼容 PowerShell 5 产生的 UTF-8 BOM manifest

### 3. bootstrap

- `scripts/bootstrap-us-claw.ps1`
- `scripts/bootstrap-us-claw.sh`

现在会写出：

- `us-claw-bootstrap.json`
- `us-claw-runtime-events.jsonl`
- `us-claw-runtime-logs.jsonl`

manifest 中额外记录：

- `workspace_slug`
- `bridge_url`
- `control_plane_url`
- `runtime_files`

### 4. web

- `Mission Control` 已不再只是观察面：
  - 支持 sidecar 直接触发合法状态流转
  - 状态流转后会刷新 dashboard 与 timeline
  - 提供手动 `Refresh Dashboard`

## 验证记录

- 后端：
  - `python -m unittest discover apps/control-plane/tests -v`
  - 结果：通过
- bridge：
  - `npm test`
  - `npm run build`
  - 结果：通过
- bootstrap / bridge 冒烟：
  - 使用临时 `OPENCLAW_HOME`
  - 先运行 `bootstrap-us-claw.ps1`
  - 再启动 bridge 访问 `/status`
  - 结果：`runtime.status = ready`

## 关键 bug 与根因

### 1. 任务时间线顺序错误

- 现象：
  - `task_created` 与 `task_state_changed` 在 SQLite 查询结果中偶发乱序
- 根因：
  - 使用 `datetime()` 排序会把 ISO 时间压到秒级
- 处理：
  - 改成基于插入顺序的 `rowid DESC`

### 2. bridge 误判为 `installed_not_bootstrapped`

- 现象：
  - bootstrap 明明写出了 manifest / events / logs
  - `/events` 和 `/logs` 可读
  - `/status` 却显示 `workspaceRegistered = false`
- 根因：
  - PowerShell 5 `Set-Content -Encoding UTF8` 写出带 BOM 的 JSON
  - Node `JSON.parse` 直接解析 manifest 时失败
- 处理：
  - bridge 读取 JSON / JSONL 前统一剥离 BOM
  - 增加 BOM 回归测试

## 当前剩余工作

- Web 三页看板与 sidecar 仍需收口并做完整验证
- README / docs/README / scripts/README / deploy/README 需要同步新的 runtime 口径
- 若进入下一轮，默认顺序：
  1. 收口 `apps/web`
  2. 跑全套验证
  3. 做代码评审
  4. 再考虑 commit / push

## 延续口径

- 默认继续沿用三标签结构：
  - `Mission Control`
  - `Organization`
  - `OpenClaw Runtime`
- 默认继续用 bridge 隔离 OpenClaw
- 默认继续把 `.ai/plans/` 当作计划主入口，把 `.ai/memory/` 当作上下文压缩记忆
