# US Federal SOUL Phase 3 Final Plan

> 面向当前 [agents](/C:/Users/Administrator/Documents/Playground/agents) 目录的正式收口计划文档。该计划已执行完成，本文档用于保存最终范围、实施口径、验收标准与产物边界，便于后续继续扩展或复核。

**Status:** completed  
**Workspace:** `C:/Users/Administrator/Documents/Playground`  
**Primary Outputs:** [agents](/C:/Users/Administrator/Documents/Playground/agents), [us-federal-soul-coverage-matrix.md](/C:/Users/Administrator/Documents/Playground/docs/us-federal-soul-coverage-matrix.md), [validate_soul_catalog.py](../tools/validate_soul_catalog.py), [render_soul_matrix.py](../tools/render_soul_matrix.py)

## 目标

- 建立一套可扩展的美国联邦行政体系岗位 SOUL 知识库。
- 目录固定为 `agents/{department_slug}/{role_slug}/SOUL.md`。
- 所有 `SOUL.md` 统一使用正式章节，不写非 SOUL 元信息。
- 每个岗位都覆盖以下内容：
  `身份与定位`、`法定/组织位置`、`汇报关系与任命免职`、`职责`、`任职要求`、`任职边界`、`沟通与协作`、`决策权与升级路径`、`考核规则`、`speaking_style`、`personality`、`sources`
- `speaking_style` 与 `personality` 采用“每个 SOUL 全量内嵌”的方式，不依赖外部词库文件。

## 分期范围

### Phase 1

- 覆盖 `presidency`、`vice_presidency`、`executive_office_of_the_president`
- 覆盖 `15` 个 Cabinet departments
- 每个部门首版固定 `6` 个关键岗位
- EOP 固定 `6` 个关键岗位

### Phase 2

- 在 Phase 1 基础上扩展独立机构与独立委员会
- 优先把“功能位”收紧为真实正式岗位名
- 统一补齐任命、任期、免职边界

### Phase 3

- 扩展 Cabinet 共享治理岗位：
  `Inspector General / CFO / CIO / CISO / CHCO`
- 扩展 EOP 高价值岗位：
  `Counsel to the President / Cabinet Secretary / Homeland Security Advisor / Administrator of OIRA`
- 扩展 Independent agencies：
  `Inspector General`、治理线岗位、数字服务、透明事务、情报支撑线
- 扩展 Commissions：
  `Inspector General`、经济分析、行政审理支持、核心执法/倡导岗位

## 执行口径

- 中文为主，岗位官方英文名保留。
- 路径统一使用英文 `snake_case`。
- 目录和矩阵必须同步收口，禁止“目录有新增岗位，但矩阵没同步”。
- 所有校验以“结构 + 覆盖矩阵 + 角色集合”三重一致为准。
- 非正式元信息一律禁止写入 `SOUL.md`，包括：
  `- Phase:`
  `- Department / Entity:`
  `- Role Slug:`
- 对有法律争议的独立机构免职边界，不做绝对化断言，统一写为“依授权法与判例约束”。

## 关键实现规则

### SOUL 文档规则

- 第一行必须是正式岗位标题，例如 `# 国务卿 (`Secretary of State`)`
- 不允许出现占位式标题，例如：
  `Head`
  `Deputy Head`
  `Chief Operating / Management Role`
  `Flagship Mission Role`
  `Vice Chair if statutory`
  `Chief of Staff or Equivalent`
  `Executive Director or Secretary`
- `sources` 中必须保留官方来源链接与 framework 来源链接。

### 矩阵规则

- [us-federal-soul-coverage-matrix.md](/C:/Users/Administrator/Documents/Playground/docs/us-federal-soul-coverage-matrix.md) 作为权威覆盖矩阵。
- 必须同时维护：
  `Entity Coverage`
  `Entity Role Sets`
  `Phase 3 Queue`
- `Entity Coverage` 的角色数、`Entity Role Sets` 的 role slugs、磁盘上的实际目录树必须一致。

### 校验规则

- [validate_soul_catalog.py](../tools/validate_soul_catalog.py) 必须校验：
  required headings
  forbidden metadata lines
  placeholder titles
  matrix entity parity
  role-set parity
  on-disk role ordering / presence
- [render_soul_matrix.py](../tools/render_soul_matrix.py) 负责根据 `agents/` 目录重建矩阵。

## 最终结果

- 当前总量：`342` 份 `SOUL.md`
- `Cabinet departments`：implemented
- `EOP and White House`：implemented
- `Independent agencies`：implemented
- `Commissions`：implemented

## 验收标准

- `python .\.ai\tools\validate_soul_catalog.py` 必须通过
- `agents/` 下所有 `SOUL.md` 必须具备固定章节
- 不允许存在占位式标题
- 不允许存在非正式元信息行
- `Phase 3 Queue` 中四个 target 都必须为 `implemented`
- reviewer 子代理抽查新增波次后无 findings

## 回滚方式

- 文档层回滚：删除本轮新增的岗位目录，并重新运行 [render_soul_matrix.py](../tools/render_soul_matrix.py)
- 校验层回滚：若矩阵或目录不一致，先恢复矩阵与磁盘一致，再运行 [validate_soul_catalog.py](../tools/validate_soul_catalog.py)
- 不使用全仓重置类危险命令；按目录级、文件级定向处理

## 后续建议

- 可继续按部门做更深一层的 Assistant Secretary、局署首长、地区负责人扩展
- 可新增索引页，支持按 `部门 / 岗位家族 / 任命类型` 浏览
- 可增加抽样质检清单，对高敏岗位做人工复核
