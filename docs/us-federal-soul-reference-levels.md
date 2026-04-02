# US Federal SOUL Reference Levels

> 这是一套面向 `SOUL` 目录维护的内部参考等级体系，用于检索、人工复核优先级和后续扩展分层。它**不是**美国联邦政府的法定官阶、薪级或 SES 等级映射。

## 等级框架

| Level | Name | Meaning | Current Count |
| --- | --- | --- | --- |
| `L0` | Constitutional Apex | 宪制顶层岗位。仅用于总统与副总统。 | 2 |
| `L1` | National Principal Leadership | 国家级 principal leadership。通常是 Cabinet/独立机构首长或白宫核心主任。 | 30 |
| `L2` | National Deputy / Principal Member | 国家级副手、委员会 principal member 或具有全国性业务统筹权的高位岗位。 | 68 |
| `L3` | Department / Entity Senior Executive | 部门或实体级 senior executive，通常直接承接首长决策并统管关键链路。 | 98 |
| `L4` | Enterprise / Specialized Executive | 企业治理型或专业化 executive，强调横向治理、专业支撑和专题统筹。 | 140 |
| `L5` | Adjudication / Protected Specialist | 行政审理或受特殊程序保护的专业岗位，强调程序独立性与记录完整性。 | 4 |

## 使用建议

- `L0-L1`：优先作为首轮人工复核样本，重点看任命/免职、法定边界与 sources。
- `L2-L3`：优先检查职责边界、上下级关系与跨部门沟通线。
- `L4-L5`：优先检查命名贴合度、组织位置、专业程序与是否与上级岗位重叠。

## 全量参考级别清单

### L0 - Constitutional Apex

- 定义：宪制顶层岗位。仅用于总统与副总统。
- 当前数量：`2`

| Role | Entity | Family | Appointment Type |
| --- | --- | --- | --- |
| [美国总统 (`President of the United States`)](../agents/presidency/president/SOUL.md) | `presidency` | Constitutional | Election |
| [美国副总统 (`Vice President of the United States`)](../agents/vice_presidency/vice_president/SOUL.md) | `vice_presidency` | Constitutional | Election |

### L1 - National Principal Leadership

- 定义：国家级 principal leadership。通常是 Cabinet/独立机构首长或白宫核心主任。
- 当前数量：`30`

| Role | Entity | Family | Appointment Type |
| --- | --- | --- | --- |
| [中央情报局局长 (`Director of the Central Intelligence Agency`)](../agents/central_intelligence_agency/director_of_the_central_intelligence_agency/SOUL.md) | `central_intelligence_agency` | Head of Entity | PAS |
| [农业部长 (`Secretary of Agriculture`)](../agents/department_of_agriculture/secretary_of_agriculture/SOUL.md) | `department_of_agriculture` | Head of Entity | PAS |
| [商务部长 (`Secretary of Commerce`)](../agents/department_of_commerce/secretary_of_commerce/SOUL.md) | `department_of_commerce` | Head of Entity | PAS |
| [国防部长 (`Secretary of Defense`)](../agents/department_of_defense/secretary_of_defense/SOUL.md) | `department_of_defense` | Head of Entity | PAS |
| [教育部长 (`Secretary of Education`)](../agents/department_of_education/secretary_of_education/SOUL.md) | `department_of_education` | Head of Entity | PAS |
| [能源部长 (`Secretary of Energy`)](../agents/department_of_energy/secretary_of_energy/SOUL.md) | `department_of_energy` | Head of Entity | PAS |
| [卫生与公众服务部长 (`Secretary of Health and Human Services`)](../agents/department_of_health_and_human_services/secretary_of_health_and_human_services/SOUL.md) | `department_of_health_and_human_services` | Head of Entity | PAS |
| [国土安全部长 (`Secretary of Homeland Security`)](../agents/department_of_homeland_security/secretary_of_homeland_security/SOUL.md) | `department_of_homeland_security` | Head of Entity | PAS |
| [住房与城市发展部长 (`Secretary of Housing and Urban Development`)](../agents/department_of_housing_and_urban_development/secretary_of_housing_and_urban_development/SOUL.md) | `department_of_housing_and_urban_development` | Head of Entity | PAS |
| [司法部长（总检察长） (`Attorney General`)](../agents/department_of_justice/attorney_general/SOUL.md) | `department_of_justice` | Head of Entity | PAS |
| [劳工部长 (`Secretary of Labor`)](../agents/department_of_labor/secretary_of_labor/SOUL.md) | `department_of_labor` | Head of Entity | PAS |
| [国务卿 (`Secretary of State`)](../agents/department_of_state/secretary_of_state/SOUL.md) | `department_of_state` | Head of Entity | PAS |
| [内政部长 (`Secretary of the Interior`)](../agents/department_of_the_interior/secretary_of_the_interior/SOUL.md) | `department_of_the_interior` | Head of Entity | PAS |
| [财政部长 (`Secretary of the Treasury`)](../agents/department_of_the_treasury/secretary_of_the_treasury/SOUL.md) | `department_of_the_treasury` | Head of Entity | PAS |
| [交通部长 (`Secretary of Transportation`)](../agents/department_of_transportation/secretary_of_transportation/SOUL.md) | `department_of_transportation` | Head of Entity | PAS |
| [退伍军人事务部长 (`Secretary of Veterans Affairs`)](../agents/department_of_veterans_affairs/secretary_of_veterans_affairs/SOUL.md) | `department_of_veterans_affairs` | Head of Entity | PAS |
| [署长 (`Administrator`)](../agents/environmental_protection_agency/administrator/SOUL.md) | `environmental_protection_agency` | Head of Entity | PAS |
| [国内政策委员会主任 (`Director of the Domestic Policy Council`)](../agents/executive_office_of_the_president/domestic_policy_council_director/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | Presidential Direct |
| [国家经济委员会主任 (`Director of the National Economic Council`)](../agents/executive_office_of_the_president/national_economic_council_director/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | Presidential Direct |
| [国家安全顾问 (`National Security Advisor`)](../agents/executive_office_of_the_president/national_security_advisor/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | Presidential Direct |
| [行政管理和预算局局长 (`Director of the Office of Management and Budget`)](../agents/executive_office_of_the_president/omb_director/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | PAS |
| [科技政策办公室主任 (`Director of the Office of Science and Technology Policy`)](../agents/executive_office_of_the_president/ostp_director/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | Mixed / Institution-Specific |
| [白宫幕僚长 (`White House Chief of Staff`)](../agents/executive_office_of_the_president/white_house_chief_of_staff/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | Presidential Direct |
| [署长 (`Administrator`)](../agents/general_services_administration/administrator/SOUL.md) | `general_services_administration` | Head of Entity | PAS |
| [署长 (`Administrator`)](../agents/national_aeronautics_and_space_administration/administrator/SOUL.md) | `national_aeronautics_and_space_administration` | Head of Entity | PAS |
| [主任 (`Director`)](../agents/national_science_foundation/director/SOUL.md) | `national_science_foundation` | Head of Entity | PAS |
| [局长 (`Director`)](../agents/office_of_personnel_management/director/SOUL.md) | `office_of_personnel_management` | Head of Entity | PAS |
| [国家情报总监 (`Director of National Intelligence`)](../agents/office_of_the_director_of_national_intelligence/director_of_national_intelligence/SOUL.md) | `office_of_the_director_of_national_intelligence` | Head of Entity | PAS |
| [美国贸易代表 (`United States Trade Representative`)](../agents/office_of_the_united_states_trade_representative/united_states_trade_representative/SOUL.md) | `office_of_the_united_states_trade_representative` | Head of Entity | PAS |
| [署长 (`Administrator`)](../agents/small_business_administration/administrator/SOUL.md) | `small_business_administration` | Head of Entity | PAS |

### L2 - National Deputy / Principal Member

- 定义：国家级副手、委员会 principal member 或具有全国性业务统筹权的高位岗位。
- 当前数量：`68`

| Role | Entity | Family | Appointment Type |
| --- | --- | --- | --- |
| [行动副局长 (`Deputy Director for Operations`)](../agents/central_intelligence_agency/deputy_director_for_operations/SOUL.md) | `central_intelligence_agency` | Deputy Leadership | Mixed / Institution-Specific |
| [中央情报局副局长 (`Deputy Director of the Central Intelligence Agency`)](../agents/central_intelligence_agency/deputy_director_of_the_central_intelligence_agency/SOUL.md) | `central_intelligence_agency` | Deputy Leadership | PAS |
| [主席 (`Chair`)](../agents/consumer_product_safety_commission/chair/SOUL.md) | `consumer_product_safety_commission` | Commission Principal | PAS + Presidential Designation |
| [委员 (`Commissioner`)](../agents/consumer_product_safety_commission/commissioner/SOUL.md) | `consumer_product_safety_commission` | Commission Principal | PAS |
| [副农业部长 (`Deputy Secretary of Agriculture`)](../agents/department_of_agriculture/deputy_secretary_of_agriculture/SOUL.md) | `department_of_agriculture` | Deputy Leadership | PAS |
| [副商务部长 (`Deputy Secretary of Commerce`)](../agents/department_of_commerce/deputy_secretary_of_commerce/SOUL.md) | `department_of_commerce` | Deputy Leadership | PAS |
| [人口普查局局长 (`Director of the Census Bureau`)](../agents/department_of_commerce/director_of_the_census_bureau/SOUL.md) | `department_of_commerce` | Mission Delivery | PAS |
| [主管知识产权副部长兼美国专利商标局局长 (`Under Secretary of Commerce for Intellectual Property and Director of the USPTO`)](../agents/department_of_commerce/under_secretary_of_commerce_for_intellectual_property_and_director_of_the_uspto/SOUL.md) | `department_of_commerce` | Mission Delivery | PAS |
| [参谋长联席会议主席 (`Chairman of the Joint Chiefs of Staff`)](../agents/department_of_defense/chairman_of_the_joint_chiefs_of_staff/SOUL.md) | `department_of_defense` | Mission Delivery | PAS |
| [副国防部长 (`Deputy Secretary of Defense`)](../agents/department_of_defense/deputy_secretary_of_defense/SOUL.md) | `department_of_defense` | Deputy Leadership | PAS |
| [副教育部长 (`Deputy Secretary of Education`)](../agents/department_of_education/deputy_secretary_of_education/SOUL.md) | `department_of_education` | Deputy Leadership | PAS |
| [副能源部长 (`Deputy Secretary of Energy`)](../agents/department_of_energy/deputy_secretary_of_energy/SOUL.md) | `department_of_energy` | Deputy Leadership | PAS |
| [主管核安全副部长兼国家核安全局局长 (`Under Secretary for Nuclear Security and Administrator of the NNSA`)](../agents/department_of_energy/under_secretary_for_nuclear_security_and_nsa_administrator/SOUL.md) | `department_of_energy` | Mission Delivery | PAS |
| [疾病控制与预防中心主任 (`Director of the Centers for Disease Control and Prevention`)](../agents/department_of_health_and_human_services/cdc_director/SOUL.md) | `department_of_health_and_human_services` | Mission Delivery | PAS |
| [医疗保险和医疗补助服务中心主任 (`Administrator of the Centers for Medicare & Medicaid Services`)](../agents/department_of_health_and_human_services/cms_administrator/SOUL.md) | `department_of_health_and_human_services` | Mission Delivery | PAS |
| [副卫生与公众服务部长 (`Deputy Secretary of Health and Human Services`)](../agents/department_of_health_and_human_services/deputy_secretary_of_health_and_human_services/SOUL.md) | `department_of_health_and_human_services` | Deputy Leadership | PAS |
| [国立卫生研究院院长 (`Director of the National Institutes of Health`)](../agents/department_of_health_and_human_services/nih_director/SOUL.md) | `department_of_health_and_human_services` | Mission Delivery | PAS |
| [海关与边境保护局局长 (`Commissioner of U.S. Customs and Border Protection`)](../agents/department_of_homeland_security/cbp_commissioner/SOUL.md) | `department_of_homeland_security` | Mission Delivery | PAS |
| [副国土安全部长 (`Deputy Secretary of Homeland Security`)](../agents/department_of_homeland_security/deputy_secretary_of_homeland_security/SOUL.md) | `department_of_homeland_security` | Deputy Leadership | PAS |
| [联邦紧急事务管理署署长 (`Administrator of FEMA`)](../agents/department_of_homeland_security/fema_administrator/SOUL.md) | `department_of_homeland_security` | Mission Delivery | PAS |
| [副住房与城市发展部长 (`Deputy Secretary of Housing and Urban Development`)](../agents/department_of_housing_and_urban_development/deputy_secretary_of_housing_and_urban_development/SOUL.md) | `department_of_housing_and_urban_development` | Deputy Leadership | PAS |
| [协理副司法部长 (`Associate Attorney General`)](../agents/department_of_justice/associate_attorney_general/SOUL.md) | `department_of_justice` | Deputy Leadership | PAS |
| [副司法部长 (`Deputy Attorney General`)](../agents/department_of_justice/deputy_attorney_general/SOUL.md) | `department_of_justice` | Deputy Leadership | PAS |
| [联邦调查局局长 (`Director of the Federal Bureau of Investigation`)](../agents/department_of_justice/fbi_director/SOUL.md) | `department_of_justice` | Mission Delivery | PAS |
| [劳工统计局局长 (`Commissioner of Labor Statistics`)](../agents/department_of_labor/commissioner_of_labor_statistics/SOUL.md) | `department_of_labor` | Mission Delivery | PAS |
| [副劳工部长 (`Deputy Secretary of Labor`)](../agents/department_of_labor/deputy_secretary_of_labor/SOUL.md) | `department_of_labor` | Deputy Leadership | PAS |
| [副国务卿 (`Deputy Secretary of State`)](../agents/department_of_state/deputy_secretary_of_state/SOUL.md) | `department_of_state` | Deputy Leadership | PAS |
| [副内政部长 (`Deputy Secretary of the Interior`)](../agents/department_of_the_interior/deputy_secretary_of_the_interior/SOUL.md) | `department_of_the_interior` | Deputy Leadership | PAS |
| [国家公园管理局局长 (`Director of the National Park Service`)](../agents/department_of_the_interior/director_of_the_national_park_service/SOUL.md) | `department_of_the_interior` | Mission Delivery | PAS |
| [副财政部长 (`Deputy Secretary of the Treasury`)](../agents/department_of_the_treasury/deputy_secretary_of_the_treasury/SOUL.md) | `department_of_the_treasury` | Deputy Leadership | PAS |
| [副交通部长 (`Deputy Secretary of Transportation`)](../agents/department_of_transportation/deputy_secretary_of_transportation/SOUL.md) | `department_of_transportation` | Deputy Leadership | PAS |
| [联邦航空管理局局长 (`Administrator of the Federal Aviation Administration`)](../agents/department_of_transportation/faa_administrator/SOUL.md) | `department_of_transportation` | Mission Delivery | PAS |
| [联邦公路管理局局长 (`Administrator of the Federal Highway Administration`)](../agents/department_of_transportation/fhwa_administrator/SOUL.md) | `department_of_transportation` | Mission Delivery | PAS |
| [国家公路交通安全管理局局长 (`Administrator of the National Highway Traffic Safety Administration`)](../agents/department_of_transportation/nhtsa_administrator/SOUL.md) | `department_of_transportation` | Mission Delivery | PAS |
| [副退伍军人事务部长 (`Deputy Secretary of Veterans Affairs`)](../agents/department_of_veterans_affairs/deputy_secretary_of_veterans_affairs/SOUL.md) | `department_of_veterans_affairs` | Deputy Leadership | PAS |
| [主管福利副部长 (`Under Secretary for Benefits`)](../agents/department_of_veterans_affairs/under_secretary_for_benefits/SOUL.md) | `department_of_veterans_affairs` | Mission Delivery | PAS |
| [主管医疗副部长 (`Under Secretary for Health`)](../agents/department_of_veterans_affairs/under_secretary_for_health/SOUL.md) | `department_of_veterans_affairs` | Mission Delivery | PAS |
| [副署长 (`Deputy Administrator`)](../agents/environmental_protection_agency/deputy_administrator/SOUL.md) | `environmental_protection_agency` | Deputy Leadership | PAS |
| [主席 (`Chair`)](../agents/equal_employment_opportunity_commission/chair/SOUL.md) | `equal_employment_opportunity_commission` | Commission Principal | PAS + Presidential Designation |
| [委员 (`Commissioner`)](../agents/equal_employment_opportunity_commission/commissioner/SOUL.md) | `equal_employment_opportunity_commission` | Commission Principal | PAS |
| [副主席 (`Vice Chair`)](../agents/equal_employment_opportunity_commission/vice_chair/SOUL.md) | `equal_employment_opportunity_commission` | Commission Principal | PAS |
| [信息与监管事务办公室主任 (`Administrator of the Office of Information and Regulatory Affairs`)](../agents/executive_office_of_the_president/administrator_of_oira/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | PAS |
| [内阁秘书 (`Cabinet Secretary`)](../agents/executive_office_of_the_president/cabinet_secretary/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | Presidential Direct |
| [国土安全顾问 (`Homeland Security Advisor`)](../agents/executive_office_of_the_president/homeland_security_advisor/SOUL.md) | `executive_office_of_the_president` | White House / EOP Core | Presidential Direct |
| [主席 (`Chair`)](../agents/federal_communications_commission/chair/SOUL.md) | `federal_communications_commission` | Commission Principal | PAS + Presidential Designation |
| [委员 (`Commissioner`)](../agents/federal_communications_commission/commissioner/SOUL.md) | `federal_communications_commission` | Commission Principal | PAS |
| [主席 (`Chair`)](../agents/federal_reserve_board/chair/SOUL.md) | `federal_reserve_board` | Commission Principal | PAS |
| [理事 (`Governor`)](../agents/federal_reserve_board/governor/SOUL.md) | `federal_reserve_board` | Commission Principal | PAS |
| [副主席 (`Vice Chair`)](../agents/federal_reserve_board/vice_chair/SOUL.md) | `federal_reserve_board` | Commission Principal | PAS |
| [主席 (`Chair`)](../agents/federal_trade_commission/chair/SOUL.md) | `federal_trade_commission` | Commission Principal | PAS + Presidential Designation |
| [委员 (`Commissioner`)](../agents/federal_trade_commission/commissioner/SOUL.md) | `federal_trade_commission` | Commission Principal | PAS |
| [副署长 (`Deputy Administrator`)](../agents/general_services_administration/deputy_administrator/SOUL.md) | `general_services_administration` | Deputy Leadership | PAS |
| [副署长 (`Deputy Administrator`)](../agents/national_aeronautics_and_space_administration/deputy_administrator/SOUL.md) | `national_aeronautics_and_space_administration` | Deputy Leadership | PAS |
| [副主任 (`Deputy Director`)](../agents/national_science_foundation/deputy_director/SOUL.md) | `national_science_foundation` | Deputy Leadership | PAS |
| [主席 (`Chair`)](../agents/nuclear_regulatory_commission/chair/SOUL.md) | `nuclear_regulatory_commission` | Commission Principal | PAS + Presidential Designation |
| [委员 (`Commissioner`)](../agents/nuclear_regulatory_commission/commissioner/SOUL.md) | `nuclear_regulatory_commission` | Commission Principal | PAS |
| [副局长 (`Deputy Director`)](../agents/office_of_personnel_management/deputy_director/SOUL.md) | `office_of_personnel_management` | Deputy Leadership | PAS |
| [使命整合副国家情报总监 (`Deputy Director of National Intelligence for Mission Integration`)](../agents/office_of_the_director_of_national_intelligence/deputy_director_of_national_intelligence_for_mission_integration/SOUL.md) | `office_of_the_director_of_national_intelligence` | Deputy Leadership | Mixed / Institution-Specific |
| [首席副国家情报总监 (`Principal Deputy Director of National Intelligence`)](../agents/office_of_the_director_of_national_intelligence/principal_deputy_director_of_national_intelligence/SOUL.md) | `office_of_the_director_of_national_intelligence` | Deputy Leadership | PAS |
| [首席农业谈判代表 (`Chief Agricultural Negotiator`)](../agents/office_of_the_united_states_trade_representative/chief_agricultural_negotiator/SOUL.md) | `office_of_the_united_states_trade_representative` | Mission Delivery | PAS |
| [副美国贸易代表 (`Deputy United States Trade Representative`)](../agents/office_of_the_united_states_trade_representative/deputy_united_states_trade_representative/SOUL.md) | `office_of_the_united_states_trade_representative` | Deputy Leadership | PAS |
| [主席 (`Chair`)](../agents/securities_and_exchange_commission/chair/SOUL.md) | `securities_and_exchange_commission` | Commission Principal | PAS + Presidential Designation |
| [委员 (`Commissioner`)](../agents/securities_and_exchange_commission/commissioner/SOUL.md) | `securities_and_exchange_commission` | Commission Principal | PAS |
| [副署长 (`Deputy Administrator`)](../agents/small_business_administration/deputy_administrator/SOUL.md) | `small_business_administration` | Deputy Leadership | PAS |
| [专员 (`Commissioner`)](../agents/social_security_administration/commissioner/SOUL.md) | `social_security_administration` | Commission Principal | PAS |
| [副专员 (`Deputy Commissioner`)](../agents/social_security_administration/deputy_commissioner/SOUL.md) | `social_security_administration` | Deputy Leadership | PAS |
| [预算财务与管理副专员 (`Deputy Commissioner for Budget, Finance, and Management`)](../agents/social_security_administration/deputy_commissioner_for_budget_finance_and_management/SOUL.md) | `social_security_administration` | Deputy Leadership | Mixed / Institution-Specific |
| [运营副专员 (`Deputy Commissioner for Operations`)](../agents/social_security_administration/deputy_commissioner_for_operations/SOUL.md) | `social_security_administration` | Deputy Leadership | Mixed / Institution-Specific |

### L3 - Department / Entity Senior Executive

- 定义：部门或实体级 senior executive，通常直接承接首长决策并统管关键链路。
- 当前数量：`98`

| Role | Entity | Family | Appointment Type |
| --- | --- | --- | --- |
| [总法律顾问 (`General Counsel`)](../agents/central_intelligence_agency/general_counsel/SOUL.md) | `central_intelligence_agency` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/central_intelligence_agency/inspector_general/SOUL.md) | `central_intelligence_agency` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/consumer_product_safety_commission/general_counsel/SOUL.md) | `consumer_product_safety_commission` | Legal | Non-Senate Appointment |
| [监察长 (`Inspector General`)](../agents/consumer_product_safety_commission/inspector_general/SOUL.md) | `consumer_product_safety_commission` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_agriculture/general_counsel/SOUL.md) | `department_of_agriculture` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_agriculture/inspector_general/SOUL.md) | `department_of_agriculture` | Oversight | PAS |
| [主管食品、营养与消费者服务副部长 (`Under Secretary for Food, Nutrition, and Consumer Services`)](../agents/department_of_agriculture/under_secretary_for_food_nutrition_and_consumer_services/SOUL.md) | `department_of_agriculture` | Mission Delivery | PAS |
| [主管自然资源与环境副部长 (`Under Secretary for Natural Resources and Environment`)](../agents/department_of_agriculture/under_secretary_for_natural_resources_and_environment/SOUL.md) | `department_of_agriculture` | Mission Delivery | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_commerce/inspector_general/SOUL.md) | `department_of_commerce` | Oversight | PAS |
| [主管经济事务副部长 (`Under Secretary for Economic Affairs`)](../agents/department_of_commerce/under_secretary_for_economic_affairs/SOUL.md) | `department_of_commerce` | Mission Delivery | PAS |
| [主管工业与安全副部长 (`Under Secretary for Industry and Security`)](../agents/department_of_commerce/under_secretary_for_industry_and_security/SOUL.md) | `department_of_commerce` | Mission Delivery | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_defense/general_counsel/SOUL.md) | `department_of_defense` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_defense/inspector_general/SOUL.md) | `department_of_defense` | Oversight | PAS |
| [主管采办与维持副国防部长 (`Under Secretary of Defense for Acquisition and Sustainment`)](../agents/department_of_defense/under_secretary_of_defense_for_acquisition_and_sustainment/SOUL.md) | `department_of_defense` | Mission Delivery | PAS |
| [主管政策副国防部长 (`Under Secretary of Defense for Policy`)](../agents/department_of_defense/under_secretary_of_defense_for_policy/SOUL.md) | `department_of_defense` | Mission Delivery | PAS |
| [民权事务助理部长 (`Assistant Secretary for Civil Rights`)](../agents/department_of_education/assistant_secretary_for_civil_rights/SOUL.md) | `department_of_education` | Mission Delivery | PAS |
| [联邦学生资助首席运营官 (`Chief Operating Officer of Federal Student Aid`)](../agents/department_of_education/federal_student_aid_coo/SOUL.md) | `department_of_education` | Mission Delivery | Non-Senate Appointment |
| [总法律顾问 (`General Counsel`)](../agents/department_of_education/general_counsel/SOUL.md) | `department_of_education` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_education/inspector_general/SOUL.md) | `department_of_education` | Oversight | PAS |
| [副教育部长（Under Secretary） (`Under Secretary of Education`)](../agents/department_of_education/under_secretary_of_education/SOUL.md) | `department_of_education` | Mission Delivery | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_energy/general_counsel/SOUL.md) | `department_of_energy` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_energy/inspector_general/SOUL.md) | `department_of_energy` | Oversight | PAS |
| [主管科学与创新副部长 (`Under Secretary for Science and Innovation`)](../agents/department_of_energy/under_secretary_for_science_and_innovation/SOUL.md) | `department_of_energy` | Mission Delivery | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_health_and_human_services/general_counsel/SOUL.md) | `department_of_health_and_human_services` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_health_and_human_services/inspector_general/SOUL.md) | `department_of_health_and_human_services` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_homeland_security/general_counsel/SOUL.md) | `department_of_homeland_security` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_homeland_security/inspector_general/SOUL.md) | `department_of_homeland_security` | Oversight | PAS |
| [社区规划与发展助理部长 (`Assistant Secretary for Community Planning and Development`)](../agents/department_of_housing_and_urban_development/assistant_secretary_for_community_planning_and_development/SOUL.md) | `department_of_housing_and_urban_development` | Mission Delivery | PAS |
| [住房助理部长兼联邦住房专员 (`Assistant Secretary for Housing and Federal Housing Commissioner`)](../agents/department_of_housing_and_urban_development/assistant_secretary_for_housing_and_federal_housing_commissioner/SOUL.md) | `department_of_housing_and_urban_development` | Mission Delivery | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_housing_and_urban_development/general_counsel/SOUL.md) | `department_of_housing_and_urban_development` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_housing_and_urban_development/inspector_general/SOUL.md) | `department_of_housing_and_urban_development` | Oversight | PAS |
| [法律顾问办公室助理司法部长 (`Assistant Attorney General, Office of Legal Counsel`)](../agents/department_of_justice/assistant_attorney_general_office_of_legal_counsel/SOUL.md) | `department_of_justice` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_justice/inspector_general/SOUL.md) | `department_of_justice` | Oversight | PAS |
| [诉讼总长 (`Solicitor General`)](../agents/department_of_justice/solicitor_general/SOUL.md) | `department_of_justice` | Legal | PAS |
| [职业安全与健康助理部长 (`Assistant Secretary for Occupational Safety and Health`)](../agents/department_of_labor/assistant_secretary_for_occupational_safety_and_health/SOUL.md) | `department_of_labor` | Mission Delivery | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_labor/inspector_general/SOUL.md) | `department_of_labor` | Oversight | PAS |
| [劳工部首席法律顾问（Solicitor） (`Solicitor of Labor`)](../agents/department_of_labor/solicitor_of_labor/SOUL.md) | `department_of_labor` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_state/inspector_general/SOUL.md) | `department_of_state` | Oversight | PAS |
| [法律顾问 (`Legal Adviser`)](../agents/department_of_state/legal_adviser/SOUL.md) | `department_of_state` | Legal | PAS |
| [主管管理事务副国务卿 (`Under Secretary for Management`)](../agents/department_of_state/under_secretary_for_management/SOUL.md) | `department_of_state` | Mission Delivery | PAS |
| [主管政治事务副国务卿 (`Under Secretary for Political Affairs`)](../agents/department_of_state/under_secretary_for_political_affairs/SOUL.md) | `department_of_state` | Mission Delivery | PAS |
| [印第安事务助理部长 (`Assistant Secretary for Indian Affairs`)](../agents/department_of_the_interior/assistant_secretary_for_indian_affairs/SOUL.md) | `department_of_the_interior` | Mission Delivery | PAS |
| [土地与矿产管理助理部长 (`Assistant Secretary for Land and Minerals Management`)](../agents/department_of_the_interior/assistant_secretary_for_land_and_minerals_management/SOUL.md) | `department_of_the_interior` | Mission Delivery | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_the_interior/inspector_general/SOUL.md) | `department_of_the_interior` | Oversight | PAS |
| [内政部首席法律顾问（Solicitor） (`Solicitor of the Department of the Interior`)](../agents/department_of_the_interior/solicitor/SOUL.md) | `department_of_the_interior` | Legal | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_the_treasury/general_counsel/SOUL.md) | `department_of_the_treasury` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_the_treasury/inspector_general/SOUL.md) | `department_of_the_treasury` | Oversight | PAS |
| [主管国内金融副财政部长 (`Under Secretary for Domestic Finance`)](../agents/department_of_the_treasury/under_secretary_for_domestic_finance/SOUL.md) | `department_of_the_treasury` | Mission Delivery | PAS |
| [主管恐怖主义和金融情报副财政部长 (`Under Secretary for Terrorism and Financial Intelligence`)](../agents/department_of_the_treasury/under_secretary_for_terrorism_and_financial_intelligence/SOUL.md) | `department_of_the_treasury` | Mission Delivery | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_transportation/general_counsel/SOUL.md) | `department_of_transportation` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_transportation/inspector_general/SOUL.md) | `department_of_transportation` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/department_of_veterans_affairs/general_counsel/SOUL.md) | `department_of_veterans_affairs` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/department_of_veterans_affairs/inspector_general/SOUL.md) | `department_of_veterans_affairs` | Oversight | PAS |
| [空气与辐射办公室助理署长 (`Assistant Administrator for Air and Radiation`)](../agents/environmental_protection_agency/assistant_administrator_for_air_and_radiation/SOUL.md) | `environmental_protection_agency` | Mission Delivery | PAS |
| [任务支持办公室助理署长 (`Assistant Administrator for Mission Support`)](../agents/environmental_protection_agency/assistant_administrator_for_mission_support/SOUL.md) | `environmental_protection_agency` | Mission Delivery | PAS |
| [总法律顾问 (`General Counsel`)](../agents/environmental_protection_agency/general_counsel/SOUL.md) | `environmental_protection_agency` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/environmental_protection_agency/inspector_general/SOUL.md) | `environmental_protection_agency` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/equal_employment_opportunity_commission/general_counsel/SOUL.md) | `equal_employment_opportunity_commission` | Legal | PAS |
| [监察长 (`Inspector General`)](../agents/equal_employment_opportunity_commission/inspector_general/SOUL.md) | `equal_employment_opportunity_commission` | Oversight | PAS |
| [总统法律顾问 (`Counsel to the President`)](../agents/executive_office_of_the_president/counsel_to_the_president/SOUL.md) | `executive_office_of_the_president` | Legal | Presidential Direct |
| [执法局局长 (`Chief of the Enforcement Bureau`)](../agents/federal_communications_commission/chief_of_the_enforcement_bureau/SOUL.md) | `federal_communications_commission` | Mission Delivery | Agency / Internal Appointment |
| [有线竞争局局长 (`Chief of the Wireline Competition Bureau`)](../agents/federal_communications_commission/chief_of_the_wireline_competition_bureau/SOUL.md) | `federal_communications_commission` | Mission Delivery | Non-Senate Appointment |
| [总法律顾问 (`General Counsel`)](../agents/federal_communications_commission/general_counsel/SOUL.md) | `federal_communications_commission` | Legal | Non-Senate Appointment |
| [监察长 (`Inspector General`)](../agents/federal_communications_commission/inspector_general/SOUL.md) | `federal_communications_commission` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/federal_reserve_board/general_counsel/SOUL.md) | `federal_reserve_board` | Legal | Non-Senate Appointment |
| [监察长 (`Inspector General`)](../agents/federal_reserve_board/inspector_general/SOUL.md) | `federal_reserve_board` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/federal_trade_commission/general_counsel/SOUL.md) | `federal_trade_commission` | Legal | Non-Senate Appointment |
| [监察长 (`Inspector General`)](../agents/federal_trade_commission/inspector_general/SOUL.md) | `federal_trade_commission` | Oversight | PAS |
| [联邦采购服务专员 (`Commissioner of the Federal Acquisition Service`)](../agents/general_services_administration/commissioner_of_the_federal_acquisition_service/SOUL.md) | `general_services_administration` | Mission Delivery | Mixed / Institution-Specific |
| [公共建筑服务专员 (`Commissioner of the Public Buildings Service`)](../agents/general_services_administration/commissioner_of_the_public_buildings_service/SOUL.md) | `general_services_administration` | Mission Delivery | Mixed / Institution-Specific |
| [总法律顾问 (`General Counsel`)](../agents/general_services_administration/general_counsel/SOUL.md) | `general_services_administration` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/general_services_administration/inspector_general/SOUL.md) | `general_services_administration` | Oversight | PAS |
| [副署长级业务统筹官 (`Associate Administrator`)](../agents/national_aeronautics_and_space_administration/associate_administrator/SOUL.md) | `national_aeronautics_and_space_administration` | Mission Delivery | Mixed / Institution-Specific |
| [科学任务局副署长级负责人 (`Associate Administrator for the Science Mission Directorate`)](../agents/national_aeronautics_and_space_administration/associate_administrator_for_the_science_mission_directorate/SOUL.md) | `national_aeronautics_and_space_administration` | Mission Delivery | Mixed / Institution-Specific |
| [总法律顾问 (`General Counsel`)](../agents/national_aeronautics_and_space_administration/general_counsel/SOUL.md) | `national_aeronautics_and_space_administration` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/national_aeronautics_and_space_administration/inspector_general/SOUL.md) | `national_aeronautics_and_space_administration` | Oversight | PAS |
| [技术创新与伙伴关系助理主任 (`Assistant Director for Technology, Innovation and Partnerships`)](../agents/national_science_foundation/assistant_director_for_technology_innovation_and_partnerships/SOUL.md) | `national_science_foundation` | Mission Delivery | Mixed / Institution-Specific |
| [总法律顾问 (`General Counsel`)](../agents/national_science_foundation/general_counsel/SOUL.md) | `national_science_foundation` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/national_science_foundation/inspector_general/SOUL.md) | `national_science_foundation` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/nuclear_regulatory_commission/general_counsel/SOUL.md) | `nuclear_regulatory_commission` | Legal | Non-Senate Appointment |
| [监察长 (`Inspector General`)](../agents/nuclear_regulatory_commission/inspector_general/SOUL.md) | `nuclear_regulatory_commission` | Oversight | PAS |
| [退休服务副局级负责人 (`Associate Director for Retirement Services`)](../agents/office_of_personnel_management/associate_director_for_retirement_services/SOUL.md) | `office_of_personnel_management` | Mission Delivery | Mixed / Institution-Specific |
| [总法律顾问 (`General Counsel`)](../agents/office_of_personnel_management/general_counsel/SOUL.md) | `office_of_personnel_management` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/office_of_personnel_management/inspector_general/SOUL.md) | `office_of_personnel_management` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/office_of_the_director_of_national_intelligence/general_counsel/SOUL.md) | `office_of_the_director_of_national_intelligence` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/office_of_the_director_of_national_intelligence/inspector_general/SOUL.md) | `office_of_the_director_of_national_intelligence` | Oversight | PAS |
| [情报共同体首席财务官 (`Intelligence Community Chief Financial Officer`)](../agents/office_of_the_director_of_national_intelligence/intelligence_community_chief_financial_officer/SOUL.md) | `office_of_the_director_of_national_intelligence` | Mission Delivery | Non-Senate Appointment |
| [情报共同体首席信息官 (`Intelligence Community Chief Information Officer`)](../agents/office_of_the_director_of_national_intelligence/intelligence_community_chief_information_officer/SOUL.md) | `office_of_the_director_of_national_intelligence` | Mission Delivery | Non-Senate Appointment |
| [负责行政事务的助理美国贸易代表 (`Assistant United States Trade Representative for Administration`)](../agents/office_of_the_united_states_trade_representative/assistant_united_states_trade_representative_for_administration/SOUL.md) | `office_of_the_united_states_trade_representative` | Mission Delivery | Mixed / Institution-Specific |
| [总法律顾问 (`General Counsel`)](../agents/office_of_the_united_states_trade_representative/general_counsel/SOUL.md) | `office_of_the_united_states_trade_representative` | Legal | Mixed / Institution-Specific |
| [总法律顾问 (`General Counsel`)](../agents/securities_and_exchange_commission/general_counsel/SOUL.md) | `securities_and_exchange_commission` | Legal | Non-Senate Appointment |
| [监察长 (`Inspector General`)](../agents/securities_and_exchange_commission/inspector_general/SOUL.md) | `securities_and_exchange_commission` | Oversight | PAS |
| [资本获取副署级负责人 (`Associate Administrator for Capital Access`)](../agents/small_business_administration/associate_administrator_for_capital_access/SOUL.md) | `small_business_administration` | Mission Delivery | Mixed / Institution-Specific |
| [外勤运营副署级负责人 (`Associate Administrator for Field Operations`)](../agents/small_business_administration/associate_administrator_for_field_operations/SOUL.md) | `small_business_administration` | Mission Delivery | Mixed / Institution-Specific |
| [总法律顾问 (`General Counsel`)](../agents/small_business_administration/general_counsel/SOUL.md) | `small_business_administration` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/small_business_administration/inspector_general/SOUL.md) | `small_business_administration` | Oversight | PAS |
| [总法律顾问 (`General Counsel`)](../agents/social_security_administration/general_counsel/SOUL.md) | `social_security_administration` | Legal | Mixed / Institution-Specific |
| [监察长 (`Inspector General`)](../agents/social_security_administration/inspector_general/SOUL.md) | `social_security_administration` | Oversight | PAS |

### L4 - Enterprise / Specialized Executive

- 定义：企业治理型或专业化 executive，强调横向治理、专业支撑和专题统筹。
- 当前数量：`140`

| Role | Entity | Family | Appointment Type |
| --- | --- | --- | --- |
| [幕僚长 (`Chief of Staff`)](../agents/central_intelligence_agency/chief_of_staff/SOUL.md) | `central_intelligence_agency` | Management & Operations | Non-Senate Appointment |
| [数字创新局局长 (`Director of the Directorate of Digital Innovation`)](../agents/central_intelligence_agency/director_of_the_directorate_of_digital_innovation/SOUL.md) | `central_intelligence_agency` | Management & Operations | Agency / Internal Appointment |
| [支援局局长 (`Director of the Directorate of Support`)](../agents/central_intelligence_agency/director_of_the_directorate_of_support/SOUL.md) | `central_intelligence_agency` | Management & Operations | Agency / Internal Appointment |
| [执行主任 (`Executive Director`)](../agents/central_intelligence_agency/executive_director/SOUL.md) | `central_intelligence_agency` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/consumer_product_safety_commission/chief_financial_officer/SOUL.md) | `consumer_product_safety_commission` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/consumer_product_safety_commission/chief_information_officer/SOUL.md) | `consumer_product_safety_commission` | Management & Operations | Agency / Internal Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/consumer_product_safety_commission/chief_of_staff/SOUL.md) | `consumer_product_safety_commission` | Management & Operations | Non-Senate Appointment |
| [合规与外勤业务办公室主任 (`Director of the Office of Compliance and Field Operations`)](../agents/consumer_product_safety_commission/director_of_the_office_of_compliance_and_field_operations/SOUL.md) | `consumer_product_safety_commission` | Mission Delivery | Agency / Internal Appointment |
| [执行主任 (`Executive Director`)](../agents/consumer_product_safety_commission/executive_director/SOUL.md) | `consumer_product_safety_commission` | Management & Operations | Non-Senate Appointment |
| [秘书 (`Secretary`)](../agents/consumer_product_safety_commission/secretary/SOUL.md) | `consumer_product_safety_commission` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_agriculture/chief_financial_officer/SOUL.md) | `department_of_agriculture` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_agriculture/chief_human_capital_officer/SOUL.md) | `department_of_agriculture` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_agriculture/chief_information_officer/SOUL.md) | `department_of_agriculture` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_agriculture/chief_information_security_officer/SOUL.md) | `department_of_agriculture` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_agriculture/chief_of_staff/SOUL.md) | `department_of_agriculture` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_commerce/chief_financial_officer/SOUL.md) | `department_of_commerce` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_commerce/chief_human_capital_officer/SOUL.md) | `department_of_commerce` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_commerce/chief_information_officer/SOUL.md) | `department_of_commerce` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_commerce/chief_information_security_officer/SOUL.md) | `department_of_commerce` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_defense/chief_financial_officer/SOUL.md) | `department_of_defense` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_defense/chief_human_capital_officer/SOUL.md) | `department_of_defense` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_defense/chief_information_officer/SOUL.md) | `department_of_defense` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_defense/chief_information_security_officer/SOUL.md) | `department_of_defense` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_education/chief_financial_officer/SOUL.md) | `department_of_education` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_education/chief_human_capital_officer/SOUL.md) | `department_of_education` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_education/chief_information_officer/SOUL.md) | `department_of_education` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_education/chief_information_security_officer/SOUL.md) | `department_of_education` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_energy/chief_financial_officer/SOUL.md) | `department_of_energy` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_energy/chief_human_capital_officer/SOUL.md) | `department_of_energy` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_energy/chief_information_officer/SOUL.md) | `department_of_energy` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_energy/chief_information_security_officer/SOUL.md) | `department_of_energy` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_energy/chief_of_staff/SOUL.md) | `department_of_energy` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_health_and_human_services/chief_financial_officer/SOUL.md) | `department_of_health_and_human_services` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_health_and_human_services/chief_human_capital_officer/SOUL.md) | `department_of_health_and_human_services` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_health_and_human_services/chief_information_officer/SOUL.md) | `department_of_health_and_human_services` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_health_and_human_services/chief_information_security_officer/SOUL.md) | `department_of_health_and_human_services` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_homeland_security/chief_financial_officer/SOUL.md) | `department_of_homeland_security` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_homeland_security/chief_human_capital_officer/SOUL.md) | `department_of_homeland_security` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_homeland_security/chief_information_officer/SOUL.md) | `department_of_homeland_security` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_homeland_security/chief_information_security_officer/SOUL.md) | `department_of_homeland_security` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_homeland_security/chief_of_staff/SOUL.md) | `department_of_homeland_security` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_housing_and_urban_development/chief_financial_officer/SOUL.md) | `department_of_housing_and_urban_development` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_housing_and_urban_development/chief_human_capital_officer/SOUL.md) | `department_of_housing_and_urban_development` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_housing_and_urban_development/chief_information_officer/SOUL.md) | `department_of_housing_and_urban_development` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_housing_and_urban_development/chief_information_security_officer/SOUL.md) | `department_of_housing_and_urban_development` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_housing_and_urban_development/chief_of_staff/SOUL.md) | `department_of_housing_and_urban_development` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_justice/chief_financial_officer/SOUL.md) | `department_of_justice` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_justice/chief_human_capital_officer/SOUL.md) | `department_of_justice` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_justice/chief_information_officer/SOUL.md) | `department_of_justice` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_justice/chief_information_security_officer/SOUL.md) | `department_of_justice` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_labor/chief_financial_officer/SOUL.md) | `department_of_labor` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_labor/chief_human_capital_officer/SOUL.md) | `department_of_labor` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_labor/chief_information_officer/SOUL.md) | `department_of_labor` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_labor/chief_information_security_officer/SOUL.md) | `department_of_labor` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_labor/chief_of_staff/SOUL.md) | `department_of_labor` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_state/chief_financial_officer/SOUL.md) | `department_of_state` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_state/chief_human_capital_officer/SOUL.md) | `department_of_state` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_state/chief_information_officer/SOUL.md) | `department_of_state` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_state/chief_information_security_officer/SOUL.md) | `department_of_state` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_state/chief_of_staff/SOUL.md) | `department_of_state` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_the_interior/chief_financial_officer/SOUL.md) | `department_of_the_interior` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_the_interior/chief_human_capital_officer/SOUL.md) | `department_of_the_interior` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_the_interior/chief_information_officer/SOUL.md) | `department_of_the_interior` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_the_interior/chief_information_security_officer/SOUL.md) | `department_of_the_interior` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_the_treasury/chief_financial_officer/SOUL.md) | `department_of_the_treasury` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_the_treasury/chief_human_capital_officer/SOUL.md) | `department_of_the_treasury` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_the_treasury/chief_information_officer/SOUL.md) | `department_of_the_treasury` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_the_treasury/chief_information_security_officer/SOUL.md) | `department_of_the_treasury` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_the_treasury/chief_of_staff/SOUL.md) | `department_of_the_treasury` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_transportation/chief_financial_officer/SOUL.md) | `department_of_transportation` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_transportation/chief_human_capital_officer/SOUL.md) | `department_of_transportation` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_transportation/chief_information_officer/SOUL.md) | `department_of_transportation` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_transportation/chief_information_security_officer/SOUL.md) | `department_of_transportation` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/department_of_veterans_affairs/chief_financial_officer/SOUL.md) | `department_of_veterans_affairs` | Management & Operations | Mixed / Institution-Specific |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/department_of_veterans_affairs/chief_human_capital_officer/SOUL.md) | `department_of_veterans_affairs` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/department_of_veterans_affairs/chief_information_officer/SOUL.md) | `department_of_veterans_affairs` | Management & Operations | Mixed / Institution-Specific |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/department_of_veterans_affairs/chief_information_security_officer/SOUL.md) | `department_of_veterans_affairs` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/department_of_veterans_affairs/chief_of_staff/SOUL.md) | `department_of_veterans_affairs` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/environmental_protection_agency/chief_financial_officer/SOUL.md) | `environmental_protection_agency` | Management & Operations | Agency / Internal Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/environmental_protection_agency/chief_human_capital_officer/SOUL.md) | `environmental_protection_agency` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/environmental_protection_agency/chief_information_officer/SOUL.md) | `environmental_protection_agency` | Management & Operations | Agency / Internal Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/environmental_protection_agency/chief_of_staff/SOUL.md) | `environmental_protection_agency` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/equal_employment_opportunity_commission/chief_financial_officer/SOUL.md) | `equal_employment_opportunity_commission` | Management & Operations | Agency / Internal Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/equal_employment_opportunity_commission/chief_human_capital_officer/SOUL.md) | `equal_employment_opportunity_commission` | Management & Operations | Agency / Internal Appointment |
| [外勤项目办公室主任 (`Director of the Office of Field Programs`)](../agents/equal_employment_opportunity_commission/director_of_the_office_of_field_programs/SOUL.md) | `equal_employment_opportunity_commission` | Mission Delivery | Non-Senate Appointment |
| [执行秘书 (`Executive Secretary`)](../agents/equal_employment_opportunity_commission/executive_secretary/SOUL.md) | `equal_employment_opportunity_commission` | Management & Operations | Non-Senate Appointment |
| [首席经济学家 (`Chief Economist`)](../agents/federal_communications_commission/chief_economist/SOUL.md) | `federal_communications_commission` | Economics & Analysis | Agency / Internal Appointment |
| [管理主任 (`Managing Director`)](../agents/federal_communications_commission/managing_director/SOUL.md) | `federal_communications_commission` | Management & Operations | Non-Senate Appointment |
| [秘书 (`Secretary`)](../agents/federal_communications_commission/secretary/SOUL.md) | `federal_communications_commission` | Management & Operations | Non-Senate Appointment |
| [货币事务司司长 (`Director of the Division of Monetary Affairs`)](../agents/federal_reserve_board/director_of_the_division_of_monetary_affairs/SOUL.md) | `federal_reserve_board` | Economics & Analysis | Non-Senate Appointment |
| [研究与统计司司长 (`Director of the Division of Research and Statistics`)](../agents/federal_reserve_board/director_of_the_division_of_research_and_statistics/SOUL.md) | `federal_reserve_board` | Economics & Analysis | Non-Senate Appointment |
| [监管与监督司主任 (`Director of the Division of Supervision and Regulation`)](../agents/federal_reserve_board/director_of_the_division_of_supervision_and_regulation/SOUL.md) | `federal_reserve_board` | Mission Delivery | Non-Senate Appointment |
| [理事会秘书 (`Secretary of the Board`)](../agents/federal_reserve_board/secretary_of_the_board/SOUL.md) | `federal_reserve_board` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/federal_trade_commission/chief_of_staff/SOUL.md) | `federal_trade_commission` | Management & Operations | Non-Senate Appointment |
| [竞争局主任 (`Director of the Bureau of Competition`)](../agents/federal_trade_commission/director_of_the_bureau_of_competition/SOUL.md) | `federal_trade_commission` | Mission Delivery | Non-Senate Appointment |
| [消费者保护局主任 (`Director of the Bureau of Consumer Protection`)](../agents/federal_trade_commission/director_of_the_bureau_of_consumer_protection/SOUL.md) | `federal_trade_commission` | Mission Delivery | Agency / Internal Appointment |
| [政策规划办公室主任 (`Director of the Office of Policy Planning`)](../agents/federal_trade_commission/director_of_the_office_of_policy_planning/SOUL.md) | `federal_trade_commission` | Economics & Analysis | Agency / Internal Appointment |
| [执行主任 (`Executive Director`)](../agents/federal_trade_commission/executive_director/SOUL.md) | `federal_trade_commission` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/general_services_administration/chief_financial_officer/SOUL.md) | `general_services_administration` | Management & Operations | Agency / Internal Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/general_services_administration/chief_human_capital_officer/SOUL.md) | `general_services_administration` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/general_services_administration/chief_information_officer/SOUL.md) | `general_services_administration` | Management & Operations | Agency / Internal Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/general_services_administration/chief_of_staff/SOUL.md) | `general_services_administration` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/national_aeronautics_and_space_administration/chief_financial_officer/SOUL.md) | `national_aeronautics_and_space_administration` | Management & Operations | Agency / Internal Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/national_aeronautics_and_space_administration/chief_human_capital_officer/SOUL.md) | `national_aeronautics_and_space_administration` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/national_aeronautics_and_space_administration/chief_information_officer/SOUL.md) | `national_aeronautics_and_space_administration` | Management & Operations | Agency / Internal Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/national_aeronautics_and_space_administration/chief_of_staff/SOUL.md) | `national_aeronautics_and_space_administration` | Management & Operations | Non-Senate Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/national_science_foundation/chief_human_capital_officer/SOUL.md) | `national_science_foundation` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/national_science_foundation/chief_information_officer/SOUL.md) | `national_science_foundation` | Management & Operations | Agency / Internal Appointment |
| [首席信息安全官 (`Chief Information Security Officer`)](../agents/national_science_foundation/chief_information_security_officer/SOUL.md) | `national_science_foundation` | Management & Operations | Non-Senate Appointment |
| [首席管理官 (`Chief Management Officer`)](../agents/national_science_foundation/chief_management_officer/SOUL.md) | `national_science_foundation` | Management & Operations | Mixed / Institution-Specific |
| [幕僚长 (`Chief of Staff`)](../agents/national_science_foundation/chief_of_staff/SOUL.md) | `national_science_foundation` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/nuclear_regulatory_commission/chief_financial_officer/SOUL.md) | `nuclear_regulatory_commission` | Management & Operations | Agency / Internal Appointment |
| [核反应堆监管办公室主任 (`Director of the Office of Nuclear Reactor Regulation`)](../agents/nuclear_regulatory_commission/director_of_the_office_of_nuclear_reactor_regulation/SOUL.md) | `nuclear_regulatory_commission` | Mission Delivery | Non-Senate Appointment |
| [运营执行主任 (`Executive Director for Operations`)](../agents/nuclear_regulatory_commission/executive_director_for_operations/SOUL.md) | `nuclear_regulatory_commission` | Management & Operations | Non-Senate Appointment |
| [委员会秘书 (`Secretary of the Commission`)](../agents/nuclear_regulatory_commission/secretary_of_the_commission/SOUL.md) | `nuclear_regulatory_commission` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/office_of_personnel_management/chief_financial_officer/SOUL.md) | `office_of_personnel_management` | Management & Operations | Agency / Internal Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/office_of_personnel_management/chief_human_capital_officer/SOUL.md) | `office_of_personnel_management` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/office_of_personnel_management/chief_information_officer/SOUL.md) | `office_of_personnel_management` | Management & Operations | Agency / Internal Appointment |
| [首席管理官 (`Chief Management Officer`)](../agents/office_of_personnel_management/chief_management_officer/SOUL.md) | `office_of_personnel_management` | Management & Operations | Mixed / Institution-Specific |
| [幕僚长 (`Chief of Staff`)](../agents/office_of_personnel_management/chief_of_staff/SOUL.md) | `office_of_personnel_management` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/office_of_the_director_of_national_intelligence/chief_of_staff/SOUL.md) | `office_of_the_director_of_national_intelligence` | Management & Operations | Non-Senate Appointment |
| [民权、隐私与透明办公室主任 (`Chief of the Office of Civil Liberties, Privacy, and Transparency`)](../agents/office_of_the_director_of_national_intelligence/chief_of_the_office_of_civil_liberties_privacy_and_transparency/SOUL.md) | `office_of_the_director_of_national_intelligence` | Transparency & Advocacy | Agency / Internal Appointment |
| [首席运营官 (`Chief Operating Officer`)](../agents/office_of_the_director_of_national_intelligence/chief_operating_officer/SOUL.md) | `office_of_the_director_of_national_intelligence` | Management & Operations | Mixed / Institution-Specific |
| [首席信息官 (`Chief Information Officer`)](../agents/office_of_the_united_states_trade_representative/chief_information_officer/SOUL.md) | `office_of_the_united_states_trade_representative` | Management & Operations | Agency / Internal Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/office_of_the_united_states_trade_representative/chief_of_staff/SOUL.md) | `office_of_the_united_states_trade_representative` | Management & Operations | Non-Senate Appointment |
| [首席透明事务官 (`Chief Transparency Officer`)](../agents/office_of_the_united_states_trade_representative/chief_transparency_officer/SOUL.md) | `office_of_the_united_states_trade_representative` | Transparency & Advocacy | Non-Senate Appointment |
| [首席运营官 (`Chief Operating Officer`)](../agents/securities_and_exchange_commission/chief_operating_officer/SOUL.md) | `securities_and_exchange_commission` | Management & Operations | Non-Senate Appointment |
| [经济与风险分析部主任 (`Director of the Division of Economic and Risk Analysis`)](../agents/securities_and_exchange_commission/director_of_the_division_of_economic_and_risk_analysis/SOUL.md) | `securities_and_exchange_commission` | Economics & Analysis | Agency / Internal Appointment |
| [执法部主任 (`Director of the Division of Enforcement`)](../agents/securities_and_exchange_commission/director_of_the_division_of_enforcement/SOUL.md) | `securities_and_exchange_commission` | Mission Delivery | Non-Senate Appointment |
| [投资者倡导办公室主任 (`Director of the Office of the Investor Advocate`)](../agents/securities_and_exchange_commission/director_of_the_office_of_the_investor_advocate/SOUL.md) | `securities_and_exchange_commission` | Transparency & Advocacy | Agency / Internal Appointment |
| [秘书 (`Secretary`)](../agents/securities_and_exchange_commission/secretary/SOUL.md) | `securities_and_exchange_commission` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/small_business_administration/chief_financial_officer/SOUL.md) | `small_business_administration` | Management & Operations | Agency / Internal Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/small_business_administration/chief_human_capital_officer/SOUL.md) | `small_business_administration` | Management & Operations | Agency / Internal Appointment |
| [首席信息官 (`Chief Information Officer`)](../agents/small_business_administration/chief_information_officer/SOUL.md) | `small_business_administration` | Management & Operations | Agency / Internal Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/small_business_administration/chief_of_staff/SOUL.md) | `small_business_administration` | Management & Operations | Non-Senate Appointment |
| [首席财务官 (`Chief Financial Officer`)](../agents/social_security_administration/chief_financial_officer/SOUL.md) | `social_security_administration` | Management & Operations | Agency / Internal Appointment |
| [首席人力资源官 (`Chief Human Capital Officer`)](../agents/social_security_administration/chief_human_capital_officer/SOUL.md) | `social_security_administration` | Management & Operations | Agency / Internal Appointment |
| [数字服务主管 (`Chief of Digital Services`)](../agents/social_security_administration/chief_of_digital_services/SOUL.md) | `social_security_administration` | Management & Operations | Non-Senate Appointment |
| [安全与韧性平台主管 (`Chief of Security and Resiliency`)](../agents/social_security_administration/chief_of_security_and_resiliency/SOUL.md) | `social_security_administration` | Management & Operations | Non-Senate Appointment |
| [幕僚长 (`Chief of Staff`)](../agents/social_security_administration/chief_of_staff/SOUL.md) | `social_security_administration` | Management & Operations | Non-Senate Appointment |

### L5 - Adjudication / Protected Specialist

- 定义：行政审理或受特殊程序保护的专业岗位，强调程序独立性与记录完整性。
- 当前数量：`4`

| Role | Entity | Family | Appointment Type |
| --- | --- | --- | --- |
| [联邦业务办公室主任 (`Director of the Office of Federal Operations`)](../agents/equal_employment_opportunity_commission/director_of_the_office_of_federal_operations/SOUL.md) | `equal_employment_opportunity_commission` | Adjudication | Agency / Internal Appointment |
| [首席行政法法官 (`Chief Administrative Law Judge`)](../agents/federal_trade_commission/chief_administrative_law_judge/SOUL.md) | `federal_trade_commission` | Adjudication | Career Adjudication |
| [委员会上诉裁决办公室主任 (`Director of the Office of Commission Appellate Adjudication`)](../agents/nuclear_regulatory_commission/director_of_the_office_of_commission_appellate_adjudication/SOUL.md) | `nuclear_regulatory_commission` | Adjudication | Agency / Internal Appointment |
| [首席行政法法官 (`Chief Administrative Law Judge`)](../agents/securities_and_exchange_commission/chief_administrative_law_judge/SOUL.md) | `securities_and_exchange_commission` | Adjudication | Career Adjudication |
