# Deploy

当前目录提供 `US-claw` 运行层的 Docker 启动定义，入口是 `deploy/docker-compose.yml`。

## 文件

- `deploy/docker-compose.yml`
- `deploy/web.Dockerfile`
- `deploy/control-plane.Dockerfile`
- `deploy/openclaw-bridge.Dockerfile`

## 运行模式

- `demo`
  - 启动 `web + control-plane`
- `full`
  - 启动 `web + control-plane + openclaw-bridge`
  - 通过容器内 `/api` 代理与 bridge DNS 完成 runtime 聚合链路

## 使用方式

执行目录：
- 推荐在仓库根目录 `F:\Workspace\Github\US-claw` 执行

启动：

```powershell
docker compose -f .\deploy\docker-compose.yml --profile demo up --build
docker compose -f .\deploy\docker-compose.yml --profile full up --build
```

静态检查：

```powershell
docker compose -f .\deploy\docker-compose.yml --profile demo config
docker compose -f .\deploy\docker-compose.yml --profile full config
```

## 端口

默认宿主机端口：

- `web` -> `4173`
- `control-plane` -> `8000`
- `openclaw-bridge` -> `8787`

覆盖示例：

```powershell
$env:US_CLAW_WEB_PORT = "14173"
$env:US_CLAW_CONTROL_PLANE_PORT = "18000"
$env:US_CLAW_BRIDGE_PORT = "18787"
docker compose -f .\deploy\docker-compose.yml --profile full up --build
```

## 环境变量

`full` 模式常用：

- `OPENCLAW_HOME`
- `OPENCLAW_WORKSPACE`
- `US_CLAW_WEB_PORT`
- `US_CLAW_CONTROL_PLANE_PORT`
- `US_CLAW_BRIDGE_PORT`

也可以配合：

```powershell
docker compose --env-file .\.env -f .\deploy\docker-compose.yml --profile full up --build
```

说明：

- `web` 容器会把 `/api/*` 代理到 `control-plane`
- `control-plane` 会通过 `http://openclaw-bridge:8787` 访问 bridge
- `OPENCLAW_HOME` / `OPENCLAW_WORKSPACE` 会被挂载到容器内：
  - `/openclaw-host/home`
  - `/openclaw-host/workspace`
- 如果未显式设置这两个变量，compose 会回退到仓库根目录的 `../.codex-temp/openclaw-home` 与 `../.codex-temp/openclaw-workspace`
  - 因为相对路径按 `deploy/docker-compose.yml` 所在目录解析，最终对应的宿主机位置仍是仓库根 `.codex-temp/...`

## 预期产物

- `demo`
  - 提供三标签 Web 控制台
  - 提供 organization / tasks / runtime API
- `full`
  - 在 `demo` 基础上再提供 OpenClaw bridge
  - 让 control-plane 能聚合 runtime `status / events / logs`
  - 让 bridge 读取宿主机挂载进容器的 OpenClaw home / workspace

## 失败处理

- 若 `docker compose ... config` 就失败
  - 先检查环境变量是否正确展开
- 若 bridge 端口冲突
  - 先覆盖 `US_CLAW_BRIDGE_PORT`
- 若 `full` 模式无法读取 OpenClaw 目录
  - 回到 [scripts/README.md](../scripts/README.md)
  - 先确认 `install-openclaw.*` 与 `bootstrap-us-claw.*`
  - 再确认 `OPENCLAW_HOME` 与 `OPENCLAW_WORKSPACE` 指向的是宿主机真实目录，而不是容器内路径
- 若前端页面能打开但 `/api/*` 返回错误
  - 先检查 `web` 容器里的 `US_CLAW_CONTROL_PLANE_URL`
- 若 `full` 模式下 bridge 一直 `unreachable`
  - 先检查 `control-plane` 容器里的 `US_CLAW_BRIDGE_URL`
- 若宿主机没有准备好 Docker 或 OpenClaw
  - `full` 模式不能视为可用

## 边界

- `deploy/docker-compose.yml` 只负责编排 `demo/full`
- 各镜像仍由 `deploy/*.Dockerfile` 单独构建
- `control-plane` 镜像会连同 `agents/` 与 `docs/` 一起打包
- OpenClaw 是否真正可跑通，仍取决于宿主机环境
