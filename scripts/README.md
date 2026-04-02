# Scripts

当前目录已经提供 OpenClaw 安装检测与项目 bootstrap 的最小脚本集合。

当前文件包括：

- `scripts/install-openclaw.ps1`
- `scripts/install-openclaw.sh`
- `scripts/bootstrap-us-claw.ps1`
- `scripts/bootstrap-us-claw.sh`

## 脚本职责

- `scripts/install-openclaw.*`
  当前职责是检测本机是否已具备 OpenClaw 运行条件，并提示是否需要先走官方安装器；它不会替代官方安装流程。
- `scripts/bootstrap-us-claw.*`
  当前职责是把当前仓库注册为 OpenClaw workspace，并写出最小 bootstrap manifest。

## 使用方式

从仓库根目录执行时，可使用：

```powershell
.\scripts\install-openclaw.ps1
.\scripts\bootstrap-us-claw.ps1
```

```sh
./scripts/install-openclaw.sh
./scripts/bootstrap-us-claw.sh
```

## 环境变量

- `OPENCLAW_HOME`
- `OPENCLAW_WORKSPACE`
- `OPENCLAW_REPO`

脚本会优先读取这些环境变量；未设置时，回退到默认约定：

- `OPENCLAW_HOME`：`$HOME/.openclaw`
- `OPENCLAW_WORKSPACE`：`$OPENCLAW_HOME/workspace`
- `OPENCLAW_REPO`：`$HOME/dev/docker/openclaw`

## 返回码与输出

- `scripts/install-openclaw.*`
  返回 `0` 表示已检测到 OpenClaw 命令或 OpenClaw 家目录；返回 `1` 表示未安装；返回 `2` 表示只检测到源码 checkout，仍需先走官方安装器。
- `scripts/bootstrap-us-claw.*`
  成功时会在 `OPENCLAW_WORKSPACE/us-claw/us-claw-bootstrap.json` 写出 manifest，内容包含当前仓库根目录、workspace 目录和目标 workspace 路径。

## 边界说明

- `scripts/install-openclaw.*` 通过检查 `node`、`docker`、`openclaw` 或 OpenClaw 家目录来给出状态
- `scripts/bootstrap-us-claw.*` 当前只负责创建 `us-claw` workspace 目录并写入 manifest，不负责启动 Docker 服务
- 如果要启动运行层容器，应回到 `deploy/docker-compose.yml`
