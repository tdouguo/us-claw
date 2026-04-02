import http from "node:http";
import { URL } from "node:url";

import { detectInstallStatus } from "./install/check.js";
import { detectRuntimeStatus, listRuntimeEvents, listRuntimeLogs } from "./runtime/status.js";

const port = Number(process.env.US_CLAW_BRIDGE_PORT ?? 8787);

const server = http.createServer((request, response) => {
  if (!request.url) {
    writeJson(response, 400, { error: "missing request url" });
    return;
  }

  const url = new URL(request.url, "http://127.0.0.1");

  if (url.pathname === "/health") {
    writeJson(response, 200, {
      status: "ok",
      service: "us-claw-openclaw-bridge"
    });
    return;
  }

  if (url.pathname === "/status") {
    writeJson(response, 200, {
      service: "us-claw-openclaw-bridge",
      bridgeStatus: "reachable",
      install: detectInstallStatus(),
      runtime: detectRuntimeStatus()
    });
    return;
  }

  if (url.pathname === "/events") {
    const limit = parsePositiveLimit(url.searchParams.get("limit"), 10);
    if (limit === null) {
      writeJson(response, 400, { error: "limit must be a positive integer" });
      return;
    }
    writeJson(response, 200, {
      items: listRuntimeEvents({ limit })
    });
    return;
  }

  if (url.pathname === "/logs") {
    const limit = parsePositiveLimit(url.searchParams.get("limit"), 20);
    if (limit === null) {
      writeJson(response, 400, { error: "limit must be a positive integer" });
      return;
    }
    writeJson(response, 200, {
      items: listRuntimeLogs({ limit })
    });
    return;
  }

  writeJson(response, 404, { error: "not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`US Claw OpenClaw Bridge listening on http://0.0.0.0:${port}`);
});

function writeJson(response: http.ServerResponse, statusCode: number, payload: object) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function parsePositiveLimit(raw: string | null, fallback: number) {
  if (raw === null) {
    return fallback;
  }
  const limit = Number(raw);
  if (!Number.isInteger(limit) || limit <= 0) {
    return null;
  }
  return limit;
}
