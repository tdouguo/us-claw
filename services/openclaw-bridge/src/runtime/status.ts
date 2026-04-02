import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { detectInstallStatus } from "../install/check.js";

const DEFAULT_WORKSPACE_SLUG = "us-claw";
const BOOTSTRAP_FILE = "us-claw-bootstrap.json";
const EVENTS_FILE = "us-claw-runtime-events.jsonl";
const LOGS_FILE = "us-claw-runtime-logs.jsonl";

export type RuntimeOptions = {
  openclawHome?: string;
  workspaceRoot?: string;
  workspaceSlug?: string;
  limit?: number;
};

export type RuntimeStatus = {
  service: string;
  bridgeStatus: "reachable";
  status: "not_installed" | "installed_not_bootstrapped" | "workspace_registered" | "ready";
  installed: boolean;
  openclawHome: string;
  workspaceRoot: string;
  workspacePath: string;
  workspaceExists: boolean;
  workspaceRegistered: boolean;
  repoRoot: string | null;
  repoRootExists: boolean;
  openclawRepoPath: string;
  openclawRepoExists: boolean;
  latestSyncAt: string | null;
  latestError: string | null;
};

export type RuntimeEvent = {
  timestamp: string;
  level: string;
  eventType: string;
  message: string;
  source: string | null;
  details: Record<string, unknown>;
};

export type RuntimeLog = {
  timestamp: string;
  level: string;
  message: string;
  source: string | null;
  details: Record<string, unknown>;
};

export function detectRuntimeStatus(options: RuntimeOptions = {}): RuntimeStatus {
  const install = detectInstallStatus();
  const paths = resolveRuntimePaths(options);
  const bootstrap = readJsonObject(paths.bootstrapPath);
  const events = readRuntimeEvents(options);
  const logs = readRuntimeLogs(options);
  const workspaceExists = exists(paths.workspacePath);
  const repoRoot = typeof bootstrap?.repo_root === "string" ? bootstrap.repo_root : null;
  const repoRootExists = repoRoot ? exists(repoRoot) : false;
  const installed = exists(paths.openclawHome);
  const latestError = logs.find((item) => item.level === "error")?.message ?? null;
  const latestSyncAt = logs[0]?.timestamp ?? events[0]?.timestamp ?? readGeneratedAt(bootstrap);
  return {
    service: "us-claw-openclaw-bridge",
    bridgeStatus: "reachable",
    status: resolveRuntimeStatus(installed, !!bootstrap, repoRootExists),
    installed,
    openclawHome: paths.openclawHome,
    workspaceRoot: paths.workspaceRoot,
    workspacePath: paths.workspacePath,
    workspaceExists,
    workspaceRegistered: !!bootstrap,
    repoRoot,
    repoRootExists,
    openclawRepoPath: install.openclawRepoPath,
    openclawRepoExists: install.openclawRepoExists,
    latestSyncAt,
    latestError: installed ? latestError : "OpenClaw home not found"
  };
}

export function listRuntimeEvents(options: RuntimeOptions = {}): RuntimeEvent[] {
  return readRuntimeEvents(options).slice(0, resolveLimit(options.limit, 10));
}

export function listRuntimeLogs(options: RuntimeOptions = {}): RuntimeLog[] {
  return readRuntimeLogs(options).slice(0, resolveLimit(options.limit, 20));
}

function readRuntimeEvents(options: RuntimeOptions): RuntimeEvent[] {
  const paths = resolveRuntimePaths(options);
  return readJsonLines(paths.eventsPath)
    .map(normalizeEvent)
    .sort(compareNewestFirst);
}

function readRuntimeLogs(options: RuntimeOptions): RuntimeLog[] {
  const paths = resolveRuntimePaths(options);
  return readJsonLines(paths.logsPath)
    .map(normalizeLog)
    .sort(compareNewestFirst);
}

function resolveRuntimeStatus(
  installed: boolean,
  workspaceRegistered: boolean,
  repoRootExists: boolean
): RuntimeStatus["status"] {
  if (!installed) {
    return "not_installed";
  }
  if (!workspaceRegistered) {
    return "installed_not_bootstrapped";
  }
  if (!repoRootExists) {
    return "workspace_registered";
  }
  return "ready";
}

function resolveRuntimePaths(options: RuntimeOptions) {
  const install = detectInstallStatus();
  const openclawHome = options.openclawHome ?? process.env.OPENCLAW_HOME ?? install.openclawHome ?? path.join(os.homedir(), ".openclaw");
  const workspaceRoot =
    options.workspaceRoot ?? process.env.OPENCLAW_WORKSPACE ?? path.join(openclawHome, "workspace");
  const workspaceSlug = options.workspaceSlug ?? process.env.US_CLAW_WORKSPACE_SLUG ?? DEFAULT_WORKSPACE_SLUG;
  const workspacePath = path.join(workspaceRoot, workspaceSlug);
  return {
    openclawHome,
    workspaceRoot,
    workspacePath,
    bootstrapPath: path.join(workspacePath, BOOTSTRAP_FILE),
    eventsPath: path.join(workspacePath, EVENTS_FILE),
    logsPath: path.join(workspacePath, LOGS_FILE)
  };
}

function readJsonObject(targetPath: string): Record<string, unknown> | null {
  if (!exists(targetPath)) {
    return null;
  }
  try {
    return JSON.parse(stripBom(fs.readFileSync(targetPath, "utf8"))) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readJsonLines(targetPath: string): Record<string, unknown>[] {
  if (!exists(targetPath)) {
    return [];
  }
  try {
    return stripBom(fs.readFileSync(targetPath, "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as Record<string, unknown>];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}

function normalizeEvent(value: Record<string, unknown>): RuntimeEvent {
  return {
    timestamp: readString(value.timestamp),
    level: readString(value.level, "info"),
    eventType: readString(value.eventType ?? value.event_type),
    message: readString(value.message),
    source: readNullableString(value.source),
    details: readDetails(value)
  };
}

function normalizeLog(value: Record<string, unknown>): RuntimeLog {
  return {
    timestamp: readString(value.timestamp),
    level: readString(value.level, "info"),
    message: readString(value.message),
    source: readNullableString(value.source),
    details: readDetails(value)
  };
}

function readDetails(value: Record<string, unknown>): Record<string, unknown> {
  const details = value.details;
  if (details && typeof details === "object" && !Array.isArray(details)) {
    return details as Record<string, unknown>;
  }
  return {};
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readGeneratedAt(value: Record<string, unknown> | null): string | null {
  return value && typeof value.generated_at === "string" ? value.generated_at : null;
}

function compareNewestFirst<T extends { timestamp: string }>(left: T, right: T) {
  const leftTimestamp = Date.parse(left.timestamp);
  const rightTimestamp = Date.parse(right.timestamp);
  if (!Number.isNaN(leftTimestamp) && !Number.isNaN(rightTimestamp) && leftTimestamp !== rightTimestamp) {
    return rightTimestamp - leftTimestamp;
  }
  return right.timestamp.localeCompare(left.timestamp);
}

function resolveLimit(limit: number | undefined, fallback: number) {
  return typeof limit === "number" && Number.isInteger(limit) && limit > 0 ? limit : fallback;
}

function stripBom(value: string) {
  return value.replace(/^\uFEFF/, "");
}

function exists(targetPath: string) {
  try {
    return fs.existsSync(targetPath);
  } catch {
    return false;
  }
}
