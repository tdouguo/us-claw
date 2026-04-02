# US Federal SOUL Docs

> `docs/` 目录的正式入口页。目标是让人第一次进入就知道“先看什么、每份文档解决什么问题、数据是怎么长出来的”。

## 一眼看明白

- 如果你想快速理解整套资料怎么组织，先看 [us-federal-soul-docs-architecture.md](./us-federal-soul-docs-architecture.md)
- 如果你想按 `部门 / 实体 / 岗位家族 / 任命类型` 浏览，先看 [us-federal-soul-index.md](./us-federal-soul-index.md)
- 如果你想看全量覆盖矩阵、角色集合和统一总表，先看 [us-federal-soul-coverage-matrix.md](./us-federal-soul-coverage-matrix.md)
- 如果你想看人工抽样复核优先级，先看 [us-federal-soul-department-qc-sampling.md](./us-federal-soul-department-qc-sampling.md)
- 如果你想理解 `L0-L5` 的内部参考等级体系，先看 [us-federal-soul-reference-levels.md](./us-federal-soul-reference-levels.md)

## 文档分工

| 文档 | 作用 | 适合什么时候看 |
| --- | --- | --- |
| [us-federal-soul-docs-architecture.md](./us-federal-soul-docs-architecture.md) | 图形化说明 `docs / .ai / agents / .ai/tools` 如何分层，以及数据流怎么走 | 第一次进入、交接、复盘 |
| [us-federal-soul-index.md](./us-federal-soul-index.md) | 面向浏览的主入口，支持按实体、岗位家族、任命类型查找 | 想快速定位某个岗位 |
| [us-federal-soul-coverage-matrix.md](./us-federal-soul-coverage-matrix.md) | 面向核对的权威总表，包含 `Entity Coverage`、`Entity Role Sets`、`Unified Role Catalog` | 想做全库盘点、结构校验、导出 |
| [us-federal-soul-department-qc-sampling.md](./us-federal-soul-department-qc-sampling.md) | 人工质检建议清单，告诉你“每个实体最值得先复核哪几个岗位” | 想做人工复核 |
| [us-federal-soul-reference-levels.md](./us-federal-soul-reference-levels.md) | `Reference Level` 的定义、分布和全量清单 | 想按等级分层阅读或安排审阅顺序 |

## 目录边界

- `docs/`：正式汇总、索引、图示、总表
- `.ai/plans/`：计划、backlog、实施路线
- `.ai/memory/`：结构化对话记录、执行记忆
- `agents/`：每个岗位的正式 `SOUL.md`
- `.ai/tools/`：生成、同步、校验脚本

## 推荐阅读顺序

1. [us-federal-soul-docs-architecture.md](./us-federal-soul-docs-architecture.md)
2. [us-federal-soul-index.md](./us-federal-soul-index.md)
3. [us-federal-soul-coverage-matrix.md](./us-federal-soul-coverage-matrix.md)
4. [us-federal-soul-reference-levels.md](./us-federal-soul-reference-levels.md)
5. [us-federal-soul-department-qc-sampling.md](./us-federal-soul-department-qc-sampling.md)

## 内部工作文档

- [us-federal-soul-phase3-final-plan.md](../.ai/plans/us-federal-soul-phase3-final-plan.md)
- [us-federal-soul-execution-backlog.md](../.ai/plans/us-federal-soul-execution-backlog.md)
- [us-federal-soul-conversation-record.md](../.ai/memory/us-federal-soul-conversation-record.md)
