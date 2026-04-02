import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { detectInstallStatus } from "../install/check.js";

export type RuntimeStatus = {
  service: string;
  bridgeStatus: "configured" | "not_configured";
  installed: boolean;
  openclawHome: string;
  workspacePath: string;
  workspaceExists: boolean;
  openclawRepoPath: string;
  openclawRepoExists: boolean;
  latestError: string | null;
};

export function detectRuntimeStatus(): RuntimeStatus {
  const install = detectInstallStatus();
  const workspacePath = process.env.OPENCLAW_WORKSPACE ?? path.join(install.openclawHome, "workspace");
  const workspaceExists = exists(workspacePath);
  const installed = install.openclawHomeExists;
  return {
    service: "us-claw-openclaw-bridge",
    bridgeStatus: installed ? "configured" : "not_configured",
    installed,
    openclawHome: install.openclawHome,
    workspacePath,
    workspaceExists,
    openclawRepoPath: install.openclawRepoPath,
    openclawRepoExists: install.openclawRepoExists,
    latestError: installed ? null : "OpenClaw home not found"
  };
}

function exists(targetPath: string) {
  try {
    return fs.existsSync(targetPath);
  } catch {
    return false;
  }
}
