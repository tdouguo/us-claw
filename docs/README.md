# US Federal SOUL Docs

`docs/` 是仓库的正式阅读入口，负责索引、架构图、覆盖矩阵与阅读顺序。

## 一眼看明白

- 想先理解整体结构：
  - [us-federal-soul-docs-architecture.md](./us-federal-soul-docs-architecture.md)
- 想按实体 / 岗位家族 / 任命类型浏览：
  - [us-federal-soul-index.md](./us-federal-soul-index.md)
- 想看全量覆盖与统一总表：
  - [us-federal-soul-coverage-matrix.md](./us-federal-soul-coverage-matrix.md)
- 想看参考等级体系：
  - [us-federal-soul-reference-levels.md](./us-federal-soul-reference-levels.md)
- 想看人工抽样复核建议：
  - [us-federal-soul-department-qc-sampling.md](./us-federal-soul-department-qc-sampling.md)

## 目录分工

- `docs/`
  - 正式索引、图示、覆盖矩阵、参考资料
- `agents/`
  - 每个岗位的正式 `SOUL.md`
- `.ai/plans/`
  - 计划、backlog、阶段收口文档
- `.ai/memory/`
  - 结构化执行记录与上下文压缩
- `.ai/tools/`
  - 生成、同步、校验脚本

## 推荐阅读顺序

1. [us-federal-soul-docs-architecture.md](./us-federal-soul-docs-architecture.md)
2. [us-federal-soul-index.md](./us-federal-soul-index.md)
3. [us-federal-soul-coverage-matrix.md](./us-federal-soul-coverage-matrix.md)
4. [us-federal-soul-reference-levels.md](./us-federal-soul-reference-levels.md)
5. [us-federal-soul-department-qc-sampling.md](./us-federal-soul-department-qc-sampling.md)

## Runtime / Control Plane Snapshot

如果你的目标不是继续补 `SOUL.md`，而是推进运行时与控制面，请直接补充阅读：

- [../.ai/plans/us-claw-runtime-phase-b-plan.md](../.ai/plans/us-claw-runtime-phase-b-plan.md)
- [../.ai/memory/us-claw-runtime-phase-b-memory.md](../.ai/memory/us-claw-runtime-phase-b-memory.md)
- [../scripts/README.md](../scripts/README.md)
- [../deploy/README.md](../deploy/README.md)

当前运行时口径：

- `apps/control-plane`
  - 任务、组织、runtime 聚合 API
- `apps/web`
  - `Mission Control / Organization / OpenClaw Runtime`
- `services/openclaw-bridge`
  - 读取 workspace manifest / events / logs 的 bridge
- `scripts/bootstrap-us-claw.*`
  - 写出 bootstrap manifest 与 runtime seed files

建议顺序：

1. 先看 `.ai` 计划与记忆
2. 再看 `scripts/README.md` 与 `deploy/README.md`
3. 最后进入 `apps/` 与 `services/` 代码实现

## 内部工作文档

- [../.ai/plans/us-federal-soul-phase3-final-plan.md](../.ai/plans/us-federal-soul-phase3-final-plan.md)
- [../.ai/plans/us-federal-soul-execution-backlog.md](../.ai/plans/us-federal-soul-execution-backlog.md)
- [../.ai/memory/us-federal-soul-conversation-record.md](../.ai/memory/us-federal-soul-conversation-record.md)
