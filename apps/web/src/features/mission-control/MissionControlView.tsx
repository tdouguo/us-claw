export function MissionControlView() {
  return (
    <section className="panel panel--main">
      <h2>Mission Control</h2>
      <p>
        这里将承载任务编排、审批链、升级链、回滚链与执行日志。当前阶段先固定
        统一控制面的主视图边界。
      </p>
      <ul>
        <li>任务状态列与执行节奏</li>
        <li>审批链 / 升级链 / 回滚责任链</li>
        <li>跨实体任务协调上下文</li>
      </ul>
    </section>
  );
}
