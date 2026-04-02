# US Federal SOUL Docs Architecture

> 这份文档用图把当前资料体系讲清楚。目标不是替代详细说明，而是让人“看一眼就知道目录怎么分、数据怎么流、遇到问题该打开哪份文档”。

## 1. 信息架构图

```mermaid
flowchart TD
    A["Workspace Root<br/>./"] --> B["agents/<br/>岗位原始 SOUL 库"]
    A --> C["docs/<br/>正式汇总、索引、总表、图示"]
    A --> D[".ai/plans/<br/>计划、backlog、实施路线"]
    A --> E[".ai/memory/<br/>对话记录、结构化记忆"]
    A --> F[".ai/tools/<br/>生成、同步、校验脚本"]

    B --> B1["agents/{entity}/{role}/SOUL.md<br/>单岗位正式文档"]
    C --> C1["README.md<br/>总入口"]
    C --> C2["us-federal-soul-index.md<br/>浏览入口"]
    C --> C3["us-federal-soul-coverage-matrix.md<br/>权威总表"]
    C --> C4["us-federal-soul-reference-levels.md<br/>等级总表"]
    C --> C5["us-federal-soul-department-qc-sampling.md<br/>抽样复核清单"]
    C --> C6["us-federal-soul-docs-architecture.md<br/>图形说明"]
```

## 2. 数据生成关系图

```mermaid
flowchart LR
    A["agents/{entity}/{role}/SOUL.md<br/>原始岗位文档"] --> B["sync_reference_levels.py<br/>回写 Reference Level"]
    B --> A
    A --> C["render_soul_matrix.py<br/>生成覆盖矩阵"]
    A --> D["build_soul_reference_docs.py<br/>生成索引 / 抽样 / 等级文档"]
    C --> E["us-federal-soul-coverage-matrix.md"]
    D --> F["us-federal-soul-index.md"]
    D --> G["us-federal-soul-department-qc-sampling.md"]
    D --> H["us-federal-soul-reference-levels.md"]
    A --> I["validate_soul_catalog.py<br/>结构 + 矩阵 + 角色集合 + 等级一致性校验"]
    E --> I
```

## 3. 浏览路径图

```mermaid
flowchart TD
    S["我现在想查什么?"] --> A["想按部门找岗位"]
    S --> B["想看全库覆盖情况"]
    S --> C["想知道哪个岗位最该人工复核"]
    S --> D["想理解 L0-L5 等级"]
    S --> E["想理解目录和数据流"]
    S --> F["想进入单个岗位详情"]

    A --> A1["打开 us-federal-soul-index.md"]
    B --> B1["打开 us-federal-soul-coverage-matrix.md"]
    C --> C1["打开 us-federal-soul-department-qc-sampling.md"]
    D --> D1["打开 us-federal-soul-reference-levels.md"]
    E --> E1["打开 us-federal-soul-docs-architecture.md"]
    F --> F1["从 index 或 matrix 跳到 agents/{entity}/{role}/SOUL.md"]
```

## 4. 正式文档与内部文档的边界

```mermaid
flowchart LR
    A["正式对外/正式归档阅读层"] --> B["docs/"]
    A --> C["agents/"]

    D["内部工作过程层"] --> E[".ai/plans/"]
    D --> F[".ai/memory/"]

    G["自动化支撑层"] --> H[".ai/tools/"]

    B --> B1["入口、索引、总表、图示"]
    C --> C1["单岗位 SOUL"]
    E --> E1["phase plan / backlog"]
    F --> F1["conversation record"]
    H --> H1["render / sync / validate / build"]
```

## 5. 一句话理解当前结构

- `agents/` 是事实来源层
- `.ai/tools/` 是生成与校验层
- `docs/` 是正式阅读层
- `.ai/` 是内部过程记录层

## 6. 推荐操作顺序

1. 先看 [README.md](./README.md)
2. 再看 [us-federal-soul-docs-architecture.md](./us-federal-soul-docs-architecture.md)
3. 如果要查岗位，跳到 [us-federal-soul-index.md](./us-federal-soul-index.md)
4. 如果要做核对，跳到 [us-federal-soul-coverage-matrix.md](./us-federal-soul-coverage-matrix.md)
5. 如果要做人工抽样复核，跳到 [us-federal-soul-department-qc-sampling.md](./us-federal-soul-department-qc-sampling.md)
