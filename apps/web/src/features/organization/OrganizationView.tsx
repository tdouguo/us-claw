export function OrganizationView() {
  return (
    <section className="panel panel--main">
      <h2>Organization</h2>
      <p>
        这里将承载实体、岗位、角色详情与从组织模型发起任务的入口。当前阶段先
        固定“组织浏览 + 任务入口”的页签边界。
      </p>
      <ul>
        <li>按实体和岗位家族浏览</li>
        <li>角色详情抽屉</li>
        <li>从角色发起任务的入口位</li>
      </ul>
    </section>
  );
}
