from __future__ import annotations

from pathlib import Path
import json
import os
import shutil
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

ROOT = Path(__file__).resolve().parents[3]
BOOTSTRAP_PS1 = ROOT / "scripts" / "bootstrap-us-claw.ps1"
POWERSHELL = shutil.which("powershell.exe") or shutil.which("powershell")


@unittest.skipUnless(POWERSHELL, "powershell is not installed")
class BootstrapScriptTests(unittest.TestCase):
    def test_powershell_bootstrap_preserves_existing_runtime_history(self) -> None:
        with TemporaryDirectory() as temp_dir:
            temp_root = Path(temp_dir)
            openclaw_home = temp_root / ".openclaw"
            workspace_root = openclaw_home / "workspace"
            target_workspace = workspace_root / "us-claw"
            target_workspace.mkdir(parents=True, exist_ok=True)

            events_path = target_workspace / "us-claw-runtime-events.jsonl"
            logs_path = target_workspace / "us-claw-runtime-logs.jsonl"
            original_events = [
                {
                    "timestamp": "2026-04-02T09:00:00+00:00",
                    "level": "info",
                    "event_type": "workspace_registered",
                    "message": "Existing workspace registration",
                },
                {
                    "timestamp": "2026-04-02T09:30:00+00:00",
                    "level": "info",
                    "event_type": "sync_completed",
                    "message": "Existing runtime sync",
                },
            ]
            original_logs = [
                {
                    "timestamp": "2026-04-02T09:00:01+00:00",
                    "level": "info",
                    "message": "Existing bootstrap log",
                },
                {
                    "timestamp": "2026-04-02T09:30:01+00:00",
                    "level": "warn",
                    "message": "Existing runtime warning",
                },
            ]
            events_path.write_text(
                "\n".join(json.dumps(item) for item in original_events) + "\n",
                encoding="utf-8",
            )
            logs_path.write_text(
                "\n".join(json.dumps(item) for item in original_logs) + "\n",
                encoding="utf-8",
            )

            env = os.environ.copy()
            env["OPENCLAW_HOME"] = str(openclaw_home)
            env["OPENCLAW_WORKSPACE"] = str(workspace_root)
            env["US_CLAW_BRIDGE_URL"] = "http://127.0.0.1:8787"
            env["US_CLAW_CONTROL_PLANE_URL"] = "http://127.0.0.1:8000"

            result = subprocess.run(
                [
                    POWERSHELL,
                    "-ExecutionPolicy",
                    "Bypass",
                    "-File",
                    str(BOOTSTRAP_PS1),
                ],
                cwd=str(ROOT),
                env=env,
                capture_output=True,
                text=True,
                check=False,
            )

            if result.returncode != 0:
                self.fail(
                    "bootstrap-us-claw.ps1 failed with "
                    f"exit code {result.returncode}\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
                )

            self.assertEqual(
                events_path.read_text(encoding="utf-8"),
                "\n".join(json.dumps(item) for item in original_events) + "\n",
            )
            self.assertEqual(
                logs_path.read_text(encoding="utf-8"),
                "\n".join(json.dumps(item) for item in original_logs) + "\n",
            )


if __name__ == "__main__":
    unittest.main()
