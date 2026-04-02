# Scripts

当前目录提供 OpenClaw 安装检测与 `us-claw` workspace bootstrap 脚本。

## 文件

- `scripts/install-openclaw.ps1`
- `scripts/install-openclaw.sh`
- `scripts/bootstrap-us-claw.ps1`
- `scripts/bootstrap-us-claw.sh`

## 职责

- `install-openclaw.*`
  - 检查本机是否具备 OpenClaw 运行前置条件
  - 只做检测与提示，不替代官方安装器
- `bootstrap-us-claw.*`
  - 把当前仓库注册到 `OPENCLAW_WORKSPACE/us-claw`
  - 写出 bootstrap manifest
  - 在 runtime event / log 文件缺失或为空时写入 seed
  - 重跑时刷新 manifest，但保留已有 runtime history

## 使用方式

执行目录：
- 仓库根目录 `F:\Workspace\Github\US-claw`

PowerShell:

```powershell
.\scripts\install-openclaw.ps1
.\scripts\bootstrap-us-claw.ps1
```

Shell:

```sh
./scripts/install-openclaw.sh
./scripts/bootstrap-us-claw.sh
```

## 环境变量

- `OPENCLAW_HOME`
- `OPENCLAW_WORKSPACE`
- `OPENCLAW_REPO`
- `US_CLAW_BRIDGE_URL`
- `US_CLAW_CONTROL_PLANE_URL`

默认值：

- `OPENCLAW_HOME` -> `$HOME/.openclaw`
- `OPENCLAW_WORKSPACE` -> `$OPENCLAW_HOME/workspace`
- `OPENCLAW_REPO` -> `$HOME/dev/docker/openclaw`
- `US_CLAW_BRIDGE_URL` -> `http://127.0.0.1:8787`
- `US_CLAW_CONTROL_PLANE_URL` -> `http://127.0.0.1:8000`

## 预期产物

### `install-openclaw.*`

- 输出 OpenClaw 安装检测结果
- 返回码：
  - `0`：检测到可用 OpenClaw
  - `1`：未安装
  - `2`：只发现源码 checkout，仍需官方安装

### `bootstrap-us-claw.*`

成功后会在 `OPENCLAW_WORKSPACE/us-claw/` 写出：

- `us-claw-bootstrap.json`
- `us-claw-runtime-events.jsonl`
- `us-claw-runtime-logs.jsonl`

其中：

- `us-claw-bootstrap.json`
  - 记录 `repo_root`、`workspace_root`、`target_workspace`
  - 记录 `workspace_slug`、`bridge_url`、`control_plane_url`
  - 记录 `runtime_files`
- `us-claw-runtime-events.jsonl`
  - 缺失或空文件时写入一条 `workspace_registered` 事件
  - 已有内容时保持原样，不做覆盖
- `us-claw-runtime-logs.jsonl`
  - 缺失或空文件时写入一条 bootstrap 刷新日志
  - 已有内容时保持原样，不做覆盖

## 失败处理

- 若 `install-openclaw.*` 返回 `1`
  - 先完成官方 OpenClaw 安装，再重跑脚本
- 若 `install-openclaw.*` 返回 `2`
  - 不要把源码 checkout 当作已安装，仍需走官方安装
- 若 `bootstrap-us-claw.*` 提示 `OpenClaw home not found`
  - 先检查 `OPENCLAW_HOME`
  - 再运行 `install-openclaw.*`
- 若 bootstrap 写文件失败
  - 先检查 `OPENCLAW_WORKSPACE`
  - 再检查目标目录权限

## 边界

- `install-openclaw.*` 不负责安装 OpenClaw
- `bootstrap-us-claw.*` 不负责启动 Docker 服务
- 容器启动与运行模式请回到 [deploy/README.md](../deploy/README.md)
