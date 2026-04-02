# Deploy

当前目录已经提供运行层的最小 Docker 启动定义，入口是 `deploy/docker-compose.yml`。

当前文件包括：

- `deploy/docker-compose.yml`
- `deploy/web.Dockerfile`
- `deploy/control-plane.Dockerfile`
- `deploy/openclaw-bridge.Dockerfile`

## 运行模式

- `demo`：启动 `web + control-plane`
- `full`：启动 `web + control-plane + openclaw-bridge`

建议从仓库根目录执行以下命令；如果切到 `deploy/` 目录执行，也要保持 `build.context: ..` 与 `dockerfile: deploy/*.Dockerfile` 这组相对路径约定不变：

```powershell
docker compose -f .\deploy\docker-compose.yml --profile demo up --build
docker compose -f .\deploy\docker-compose.yml --profile full up --build
```

如需先做静态配置检查，可使用：

```powershell
docker compose -f .\deploy\docker-compose.yml --profile demo config
docker compose -f .\deploy\docker-compose.yml --profile full config
```

## 端口覆盖

默认宿主机端口如下：

- `web`：`4173`
- `control-plane`：`8000`
- `openclaw-bridge`：`8787`

如果宿主机端口已被占用，可在启动前覆盖环境变量：

```powershell
$env:US_CLAW_WEB_PORT = "14173"
$env:US_CLAW_CONTROL_PLANE_PORT = "18000"
$env:US_CLAW_BRIDGE_PORT = "18787"
docker compose -f .\deploy\docker-compose.yml --profile full up --build
```

如需为 `full` 模式传入 OpenClaw 相关环境变量，也可以结合 `--env-file`：

```powershell
docker compose --env-file .\.env -f .\deploy\docker-compose.yml --profile full up --build
```

## 边界说明

- `deploy/docker-compose.yml` 负责组织 `demo/full` 两种运行模式
- 各服务镜像仍分别由 `deploy/*.Dockerfile` 构建
- `control-plane` 镜像会连同 `agents/` 与 `docs/` 一起打包，用于在容器内解析组织事实源
- `full` 模式下的 `OPENCLAW_HOME`、`OPENCLAW_WORKSPACE` 由环境变量传入
- `full` 模式是否能完整跑通，仍取决于宿主机是否已具备 Docker 与 OpenClaw 运行条件
