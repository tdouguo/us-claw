import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { detectRuntimeStatus, listRuntimeEvents, listRuntimeLogs } from "../src/runtime/status.js";

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "us-claw-bridge-"));
}

function writeJson(filePath: string, value: object) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeJsonLines(filePath: string, values: object[]) {
  fs.writeFileSync(
    filePath,
    `${values.map((value) => JSON.stringify(value)).join("\n")}\n`,
    "utf8"
  );
}

test("detectRuntimeStatus returns not_installed when OpenClaw home is missing", () => {
  const root = makeTempDir();
  const missingHome = path.join(root, "missing-home");

  const status = detectRuntimeStatus({
    openclawHome: missingHome,
    workspaceRoot: path.join(missingHome, "workspace"),
    workspaceSlug: "us-claw"
  });

  assert.equal(status.status, "not_installed");
  assert.equal(status.workspaceRegistered, false);
});

test("detectRuntimeStatus returns ready when bootstrap manifest points to a real repo", () => {
  const root = makeTempDir();
  const openclawHome = path.join(root, ".openclaw");
  const workspaceRoot = path.join(openclawHome, "workspace");
  const targetWorkspace = path.join(workspaceRoot, "us-claw");
  const repoRoot = path.join(root, "repo");
  fs.mkdirSync(targetWorkspace, { recursive: true });
  fs.mkdirSync(repoRoot, { recursive: true });
  writeJson(path.join(targetWorkspace, "us-claw-bootstrap.json"), {
    repo_root: repoRoot,
    openclaw_home: openclawHome,
    workspace_root: workspaceRoot,
    target_workspace: targetWorkspace,
    generated_at: "2026-04-02T10:00:00+00:00"
  });
  writeJsonLines(path.join(targetWorkspace, "us-claw-runtime-events.jsonl"), [
    {
      timestamp: "2026-04-02T10:00:00+00:00",
      level: "info",
      event_type: "workspace_registered",
      message: "Workspace registered"
    }
  ]);
  writeJsonLines(path.join(targetWorkspace, "us-claw-runtime-logs.jsonl"), [
    {
      timestamp: "2026-04-02T10:00:01+00:00",
      level: "info",
      message: "Bridge ready"
    }
  ]);

  const status = detectRuntimeStatus({
    openclawHome,
    workspaceRoot,
    workspaceSlug: "us-claw"
  });

  assert.equal(status.status, "ready");
  assert.equal(status.workspaceRegistered, true);
  assert.equal(status.latestSyncAt, "2026-04-02T10:00:01+00:00");
  assert.equal(status.latestError, null);
});

test("listRuntimeEvents and listRuntimeLogs return newest entries first with limits", () => {
  const root = makeTempDir();
  const openclawHome = path.join(root, ".openclaw");
  const workspaceRoot = path.join(openclawHome, "workspace");
  const targetWorkspace = path.join(workspaceRoot, "us-claw");
  fs.mkdirSync(targetWorkspace, { recursive: true });
  writeJsonLines(path.join(targetWorkspace, "us-claw-runtime-events.jsonl"), [
    {
      timestamp: "2026-04-02T10:00:00+00:00",
      level: "info",
      event_type: "workspace_registered",
      message: "Workspace registered"
    },
    {
      timestamp: "2026-04-02T10:05:00+00:00",
      level: "info",
      event_type: "sync_completed",
      message: "Runtime synced"
    }
  ]);
  writeJsonLines(path.join(targetWorkspace, "us-claw-runtime-logs.jsonl"), [
    {
      timestamp: "2026-04-02T10:00:01+00:00",
      level: "info",
      message: "Bridge booting"
    },
    {
      timestamp: "2026-04-02T10:06:00+00:00",
      level: "warn",
      message: "OpenClaw bridge degraded"
    }
  ]);

  const events = listRuntimeEvents({
    openclawHome,
    workspaceRoot,
    workspaceSlug: "us-claw",
    limit: 1
  });
  const logs = listRuntimeLogs({
    openclawHome,
    workspaceRoot,
    workspaceSlug: "us-claw",
    limit: 1
  });

  assert.equal(events.length, 1);
  assert.equal(events[0]?.eventType, "sync_completed");
  assert.equal(logs.length, 1);
  assert.equal(logs[0]?.message, "OpenClaw bridge degraded");
});

test("detectRuntimeStatus keeps the most recent error even after newer info logs", () => {
  const root = makeTempDir();
  const openclawHome = path.join(root, ".openclaw");
  const workspaceRoot = path.join(openclawHome, "workspace");
  const targetWorkspace = path.join(workspaceRoot, "us-claw");
  const repoRoot = path.join(root, "repo");
  fs.mkdirSync(targetWorkspace, { recursive: true });
  fs.mkdirSync(repoRoot, { recursive: true });
  writeJson(path.join(targetWorkspace, "us-claw-bootstrap.json"), {
    repo_root: repoRoot,
    openclaw_home: openclawHome,
    workspace_root: workspaceRoot,
    target_workspace: targetWorkspace,
    generated_at: "2026-04-02T10:00:00+00:00"
  });
  writeJsonLines(
    path.join(targetWorkspace, "us-claw-runtime-logs.jsonl"),
    [
      {
        timestamp: "2026-04-02T10:00:00+00:00",
        level: "error",
        message: "Bridge worker failed"
      },
      ...Array.from({ length: 20 }, (_, index) => ({
        timestamp: `2026-04-02T10:${String(index + 1).padStart(2, "0")}:00+00:00`,
        level: "info",
        message: `Noise ${index + 1}`
      }))
    ]
  );

  const status = detectRuntimeStatus({
    openclawHome,
    workspaceRoot,
    workspaceSlug: "us-claw"
  });

  assert.equal(status.latestError, "Bridge worker failed");
  assert.equal(status.latestSyncAt, "2026-04-02T10:20:00+00:00");
});

test("negative limits fall back to the default list size instead of truncating strangely", () => {
  const root = makeTempDir();
  const openclawHome = path.join(root, ".openclaw");
  const workspaceRoot = path.join(openclawHome, "workspace");
  const targetWorkspace = path.join(workspaceRoot, "us-claw");
  fs.mkdirSync(targetWorkspace, { recursive: true });
  writeJsonLines(path.join(targetWorkspace, "us-claw-runtime-events.jsonl"), [
    {
      timestamp: "2026-04-02T10:00:00+00:00",
      level: "info",
      event_type: "event_one",
      message: "Event 1"
    },
    {
      timestamp: "2026-04-02T10:01:00+00:00",
      level: "info",
      event_type: "event_two",
      message: "Event 2"
    },
    {
      timestamp: "2026-04-02T10:02:00+00:00",
      level: "info",
      event_type: "event_three",
      message: "Event 3"
    }
  ]);

  const events = listRuntimeEvents({
    openclawHome,
    workspaceRoot,
    workspaceSlug: "us-claw",
    limit: -1
  });

  assert.equal(events.length, 3);
  assert.deepEqual(events.map((event) => event.eventType), ["event_three", "event_two", "event_one"]);
});

test("detectRuntimeStatus accepts bootstrap manifests written with UTF-8 BOM", () => {
  const root = makeTempDir();
  const openclawHome = path.join(root, ".openclaw");
  const workspaceRoot = path.join(openclawHome, "workspace");
  const targetWorkspace = path.join(workspaceRoot, "us-claw");
  const repoRoot = path.join(root, "repo");
  fs.mkdirSync(targetWorkspace, { recursive: true });
  fs.mkdirSync(repoRoot, { recursive: true });
  const manifestPath = path.join(targetWorkspace, "us-claw-bootstrap.json");
  fs.writeFileSync(
    manifestPath,
    `\ufeff${JSON.stringify(
      {
        repo_root: repoRoot,
        openclaw_home: openclawHome,
        workspace_root: workspaceRoot,
        target_workspace: targetWorkspace,
        generated_at: "2026-04-02T10:00:00+00:00"
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const status = detectRuntimeStatus({
    openclawHome,
    workspaceRoot,
    workspaceSlug: "us-claw"
  });

  assert.equal(status.workspaceRegistered, true);
  assert.equal(status.status, "ready");
});
