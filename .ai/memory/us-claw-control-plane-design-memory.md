# US Claw Control Plane Design Memory

## 主题

围绕当前 `US Federal SOUL` 知识库，规划一个可运行的控制面系统，吸收 `edict`、`golutra/golutra` 与 `OpenClaw` 的优点，但不复刻任何单一项目的原始产品形态。

## 当前结论

- 该项目不再只被定义为“美国联邦行政岗位知识库”。
- 新的目标定位是：
  **以美国现代联邦行政组织架构为母体的 AI 多 agent 控制面与组织协作系统。**

## 已确认的产品方向

### 1. 统一三页签入口

用户已明确确认三类视图都需要成为首屏一级能力，并通过页签切换：

- `任务编排 / 执行中心`
- `组织架构浏览 + 任务入口`
- `OpenClaw 节点 / 运行时监控中心`

对应英文命名建议固定为：

- `Mission Control`
- `Organization`
- `OpenClaw Runtime`

### 2. 技术路线

用户确认采用：

- `前后端分离版`
- `OpenClaw 优先嵌入版`

而不是：

- Python 单体式控制面
- 纯知识库不落地运行层

### 3. 推荐架构

当前已达成的推荐方案为：

- `apps/web`
  React/Vite 三页签统一看板
- `apps/control-plane`
  FastAPI 控制面 API，负责组织、任务、审批链与运行态聚合
- `services/openclaw-bridge`
  OpenClaw 安装检测、workspace 同步、bridge 状态与错误采集
- `deploy/docker-compose.yml`
  `demo/full` 双模式启动

### 3.1 执行口径

后续实现默认可启用：

- `多Agent模式`
- `SubAgent模式`
- `fast模式`
- `多线程模式`

但仅限：

- 独立扫描
- reviewer / explorer / checker
- 测试与验证
- 分离写集的模块化实现

不适用于：

- 共享写集的大范围重构
- 高耦合状态机核心改动
- 未锁定回滚边界的跨目录修改

已确认的原则是：

- 并行是默认可用能力，不是默认必须并行
- 每个阶段落盘计划与记忆文件，用来压缩上下文，降低对长聊天历史的依赖

### 4. 知识层与运行层边界

- `agents/` 继续作为事实源
- `docs/` 继续作为正式阅读层
- `.ai/` 继续作为内部计划/记忆/工具层
- 运行时能力通过新增目录提供，不反向重写知识库结构

## 为什么不是直接复刻 `edict`

- `edict` 的价值主要在：
  - 看板入口
  - 安装脚本
  - Docker 启动
  - 运行时同步
  - 任务制度化流转
- 本项目不会复刻其“三省六部”制度隐喻。
- 本项目把其产品面吸收进来，但角色建模与组织逻辑改为：
  `Constitutional Apex / EOP / Departments / Independent Agencies / Commissions`

## 为什么要吸收 `golutra/golutra`

吸收点不是其具体界面风格，而是以下产品组织思路：

- 任务中心、组织中心、运行中心可以共存在同一个操作面
- workspace / runtime / task / terminal 应该是一体化视角，而不是孤立工具页
- 本地开发体验与运行桥接体验需要同等重视
- 运行时桥接层应成为独立服务，而不是把所有外部 CLI / runtime 逻辑塞进主控制面

### 具体吸收结论

不是直接照搬 `golutra` 的壳体，而是把这些能力并入当前规划：

- `Mission Control` 不只看任务列表，还要能看到事件流、节点、日志、执行上下文
- `OpenClaw Runtime` 不只看安装状态，还要能看到 workspace、最近同步、最近错误、最近任务关联
- 看板整体要保留“一体化操作面”感受，而不是把任务、组织、运行时做成完全孤立的后台页面
- 前端设计要为终端输出、日志流、事件流留出空间，即使 V1 先放占位面板

## 为什么仍然把 OpenClaw 作为桥接对象而不是主框架

- OpenClaw 的安装、配置、workspace、CLI 生命周期有其官方约定
- 本项目的重点不是替代 OpenClaw，而是：
  - 用组织知识库驱动任务编排
  - 通过桥接层把组织模型映射到 OpenClaw runtime

因此结论固定为：

- `install-openclaw.*`
  负责安装与检测 OpenClaw
- `bootstrap-us-claw.*`
  负责把当前项目同步到 OpenClaw

## 已确认的任务处理总流程

```text
Intake
-> Classification
-> Coordination
-> Jurisdiction
-> Planning Bundle
-> Review Gates
-> Dispatch
-> Execution
-> Integration Review
-> Approval / Rework / Rollback
-> Archive
```

### 首版任务状态机

- `draft`
- `intake_review`
- `jurisdiction_pending`
- `planning`
- `policy_review`
- `legal_review`
- `budget_or_security_review`
- `approved_for_dispatch`
- `dispatched`
- `in_progress`
- `waiting_external`
- `blocked`
- `integration_review`
- `needs_rework`
- `approved`
- `rolled_back`
- `cancelled`
- `archived`

## Docker 与启动机制结论

### demo mode

- 只启动：
  - `web`
  - `control-plane`
- 不要求真实 OpenClaw
- 用样例任务数据与现有知识库跑通看板

### full mode

- 启动：
  - `web`
  - `control-plane`
  - `openclaw-bridge`
- 与真实 OpenClaw 安装和 workspace 对接

### 界面层结论

首版控制台建议按如下信息密度组织：

- 顶部：页签和全局状态
- 主区：任务 / 组织 / 运行时主视图
- 辅区：详情抽屉、日志面板、事件流、错误摘要

这部分明确吸收 `golutra` 的“任务与运行视角不分家”的优点。

## 当前仓库的关键事实

- 当前仓库主要由：
  - `agents/`
  - `docs/`
  - `.ai/`
  组成
- 尚无：
  - `frontend`
  - `backend`
  - `docker-compose`
  - `runtime bridge`
  骨架
- 因此实现必须从新增运行层开始，而不是在现有目录里做微调

## 当前推荐的下一步

1. 按 `.ai/plans/us-claw-control-plane-implementation-plan.md` 执行基础骨架搭建
2. 先打通 `Mission Control / Organization / Runtime` 三页签壳层
3. 在壳层阶段就补入 `golutra` 风格的详情/日志/事件流观察区
4. 再接任务状态机与组织发起任务
5. 最后接入 OpenClaw Bridge 与 Docker 双模式

## 风险记忆

- 如果直接照搬 `edict`，会把古代制度隐喻强行套到现代联邦组织结构上，导致概念失真。
- 如果直接照搬 `golutra`，会把本地运行壳层和任务桥接做得太重，反而偏离当前仓库“知识库先行”的基础。
- 如果把 OpenClaw 直接嵌入主控制面，不做 bridge 隔离，后续 CLI / 版本变化会导致控制面过度耦合。

## 推荐保留的设计原则

- 先把“知识层 -> 控制层 -> 运行层”分清楚，再开发
- 先支持 `demo mode`，保证没有 OpenClaw 时也能演示完整产品面
- 安装逻辑与项目 bootstrap 逻辑分离
- 任务编排、组织浏览、运行监控三者并列，不做从属页面
- 参考 `golutra` 预留日志、终端、事件流与节点观察位，避免首版产品退化成纯静态后台
