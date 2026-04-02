export function RuntimeView() {
  return (
    <section className="panel panel--main">
      <h2>OpenClaw Runtime</h2>
      <p>
        这里将承载 OpenClaw 安装状态、bridge 状态、workspace、节点与最近事件。
        当前阶段先固定运行态观察面的主布局。
      </p>
      <ul>
        <li>安装 / bridge / workspace 健康状态</li>
        <li>节点卡片与最近任务关联</li>
        <li>日志、事件流与错误摘要</li>
      </ul>
    </section>
  );
}
