# US Federal SOUL Execution Backlog

> 面向当前 `agents/` 目录的后续补强执行清单。目标不是重写整库，而是按优先级把最影响可用性的缺口先补齐，再进入 Phase 3 扩展。

**Goal:** 把当前 `35` 个实体、`200` 份 `SOUL.md` 从“结构完整的阶段性交付”推进到“正式职位名更准确、任命边界更实、校验更强、Phase 3 可持续扩展”的状态。

**Architecture:** 先修 schema 与命名一致性，再补 Phase 2 实体化内容，最后进入 Phase 3 长尾扩展。每个批次都要求“目录树、覆盖矩阵、校验脚本”三者同步收口，避免文档和校验漂移。

**Tech Stack:** Markdown、PowerShell、Python 3.9

---

## 须先补

### Batch A: 收紧 Phase 2 的职位命名与槽位映射

**Why:** 当前 Phase 2 里仍有一批 `Head / Deputy Head / Chief Operating / Management Role / Flagship Mission Role / Vice Chair if statutory` 这类功能位文档。它们结构完整，但离“正式职位知识库”还有一步。

**Targets:**
- `agents/environmental_protection_agency/*`
- `agents/central_intelligence_agency/*`
- `agents/national_aeronautics_and_space_administration/*`
- `agents/office_of_personnel_management/*`
- `agents/social_security_administration/*`
- `agents/general_services_administration/*`
- `agents/small_business_administration/*`
- `agents/office_of_the_director_of_national_intelligence/*`
- `agents/national_science_foundation/*`
- `agents/office_of_the_united_states_trade_representative/*`
- `agents/*commission*/vice_chair_if_statutory/*`

**Action:**
- 把功能位标题优先替换为机构真实正式职位名。
- 若目录 slug 也需要从功能位改成正式岗位名，目录、覆盖矩阵和校验逻辑必须一起改。
- 若暂时不能改目录 slug，至少在文档头部明确写出“目录槽位名”和“真实职位名”的正式映射，并在覆盖矩阵中同步标注。

**Acceptance:**
- 不再出现 `# 机构首长 (`Head`)`、`# 副首长 (`Deputy Head`)`、`# 首席运营/管理岗位 (`Chief Operating / Management Role`)`、`# 旗舰任务岗位 (`Flagship Mission Role`)` 这类标题。
- `federal_reserve_board` 不再只靠正文解释 `commissioner -> Governor`，而是目录/矩阵/文档三者至少达到一种一致方案。
- 覆盖矩阵能清楚反映 Phase 2 每个实体当前使用的真实岗位名或受控映射。

### Batch B: 收紧独立机构/独立委员会的任命、任期、免职边界

**Why:** 当前很多 Phase 2 文档仍使用“通常由总统提名……少数机构可能有法定任期或额外限制”这类模板句，信息够用但不够定稿。

**Targets:**
- `environmental_protection_agency`
- `office_of_personnel_management`
- `social_security_administration`
- `office_of_the_united_states_trade_representative`
- `office_of_the_director_of_national_intelligence`
- `federal_reserve_board`
- `securities_and_exchange_commission`
- `federal_trade_commission`
- `federal_communications_commission`
- `nuclear_regulatory_commission`
- `equal_employment_opportunity_commission`
- `consumer_product_safety_commission`

**Action:**
- 逐实体核对官方来源与 CRS/OPM 资料，把“任命方式 / 任期 / 免职规则”从模板句收紧到机构特定口径。
- 对确实存在法定争议或判例分歧的岗位，只保留“依授权法与判例约束”这种明确但不绝对化的写法，不再写模糊保底句。

**Acceptance:**
- 抽样复核不再出现“少数机构可能……”这类泛保留语。
- Commission 类文档能区分 `chair / commissioner / executive director / vice chair` 的任命来源和权力边界。
- 机构首长文档不再依赖读者自行推断任期保护。

### Batch C: 升级校验脚本为“结构 + 覆盖矩阵 + 角色集合”三重校验

**Why:** 当前 [validate_soul_catalog.py](../tools/validate_soul_catalog.py) 只保证单文件结构，不检查覆盖矩阵和目录树是否一致。

**Targets:**
- [validate_soul_catalog.py](../tools/validate_soul_catalog.py)
- [us-federal-soul-coverage-matrix.md](/C:/Users/Administrator/Documents/Playground/docs/us-federal-soul-coverage-matrix.md)

**Action:**
- 增加对覆盖矩阵实体集合的读取或等效对照逻辑。
- 校验每个实体目录是否存在、角色数是否匹配、是否出现矩阵未登记的额外角色目录。
- 若保留“目录槽位 -> 正式职位”的映射方案，则把映射规则纳入校验输入。

**Acceptance:**
- 结构错误、矩阵漂移、角色集漂移至少能命中其中一种失败。
- 校验输出能指出是“文件结构问题”“矩阵问题”还是“角色集合问题”。

## 建议补

### Batch D: 降低模板味，提升实体特异性

**Why:** 当前 Phase 1 整体已经可用，但 Phase 2 仍能明显看出大量统一模板骨架，影响知识库的真实感和专业感。

**Targets:**
- 全部 Phase 2 文档
- Phase 1 中仍带明显“泛业务”措辞的少数文档

**Action:**
- 把“将 X 转化为明确的政策、项目或执行指令”“组织预算、法务、绩效、人员和跨机构资源”等通用句，按实体特点局部改写。
- 优先替换 `职责 / 任职要求 / 任职边界 / 沟通与协作` 四节中的套模板语言。

**Acceptance:**
- 抽样阅读 `USTR / FTC / OPM / CIA / NASA` 时，能明显看出岗位特性，而不是同一段模板换名词。
- `职责` 和 `任职边界` 中至少各有 2 条是实体特有而不是库级通用句。

### Batch E: 强化来源组织与引用质量

**Why:** 当前每份文档都有 `official` 和 `framework` 两段，但没有区分“实体官方组织页”“任命规则来源”“人格框架来源”的作用。

**Action:**
- 把 `official` 来源至少分出：组织/职责、任命/确认、专项机构页。
- 对人格与说话风格保留“岗位原型不是心理诊断”的提示，并减少不必要重复。

**Acceptance:**
- 抽样 10 份文档时，读者可以直接知道每条治理判断大致来自哪类官方来源。
- 不再出现只有机构首页、但没有任命规则来源的高层岗位文档。

## 可后补

### Batch F: 进入 Phase 3 实体扩展

**Scope:**
- Cabinet departments: `Assistant Secretary`、`Inspector General`、`CFO/CIO/CISO/CHCO`、关键局署首长、地区负责人
- EOP / White House: `Counsel to the President`、`Cabinet Secretary`、`Homeland Security Advisor`、`OIRA` 关键副手
- Independent agencies: 各机构真实管理线与旗舰任务线岗位
- Commissions: 常设秘书长、执法局负责人、经济分析负责人、行政法官支持链

**Action:**
- 每次扩展一个实体族群，不要全库同时扩。
- 每一批先补覆盖矩阵，再补目录，再跑校验。

**Acceptance:**
- 新增岗位必须是正式常设职位，不补个人助理、短期代理头衔或现任人名化岗位。
- 校验脚本始终能覆盖新增目录。

### Batch G: 优化目录与数据消费体验

**Action:**
- 视后续使用场景决定是否补充索引页、按实体导览页、或可供程序消费的轻量元数据。
- 若未来要给 agent/tool 做自动选角，再考虑引入结构化索引文件。

**Acceptance:**
- 不为“看起来完整”而额外生成低价值索引。
- 只有在确实需要下游程序消费时才增加结构化索引层。

## 执行顺序

1. 先做 `Batch A`。
2. 再做 `Batch B`。
3. 然后做 `Batch C`。
4. `Batch D` 和 `Batch E` 可以穿插，但必须排在前三批之后。
5. `Batch F`、`Batch G` 进入后续扩展阶段，不和当前修订混做。

## 验收命令

```powershell
python .\.ai\tools\validate_soul_catalog.py
```

```powershell
(Select-String -Path '.\agents\*\*\SOUL.md' -Pattern '^- Phase:|^- Department / Entity:|^- Role Slug:' -Encoding UTF8 | Measure-Object).Count
```

```powershell
Get-ChildItem -LiteralPath '.\agents' -Recurse -File -Filter SOUL.md | Measure-Object | Select-Object -ExpandProperty Count
```

## 完成定义

- `须先补` 三个批次全部完成后，Phase 2 不再以功能位标题为主，校验脚本能检查矩阵与角色集合一致性。
- `建议补` 完成后，文档的实体特异性和来源解释质量明显提升。
- `可后补` 进入滚动扩展后，任何新增岗位都不破坏现有结构和校验闭环。
