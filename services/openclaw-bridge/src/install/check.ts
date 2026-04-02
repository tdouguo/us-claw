import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type InstallStatus = {
  nodeVersion: string;
  openclawHome: string;
  openclawHomeExists: boolean;
  openclawRepoPath: string;
  openclawRepoExists: boolean;
  openclawCommand: string | null;
};

export function detectInstallStatus(): InstallStatus {
  const home = process.env.OPENCLAW_HOME ?? path.join(os.homedir(), ".openclaw");
  const repo = process.env.OPENCLAW_REPO ?? path.join(os.homedir(), "dev", "docker", "openclaw");
  return {
    nodeVersion: process.version,
    openclawHome: home,
    openclawHomeExists: exists(home),
    openclawRepoPath: repo,
    openclawRepoExists: exists(repo),
    openclawCommand: process.env.OPENCLAW_COMMAND ?? null
  };
}

function exists(targetPath: string) {
  try {
    return fs.existsSync(targetPath);
  } catch {
    return false;
  }
}
