import http from "node:http";

import { detectInstallStatus } from "./install/check.js";
import { detectRuntimeStatus } from "./runtime/status.js";

const port = Number(process.env.US_CLAW_BRIDGE_PORT ?? 8787);

const server = http.createServer((request, response) => {
  if (!request.url) {
    writeJson(response, 400, { error: "missing request url" });
    return;
  }

  if (request.url === "/health") {
    writeJson(response, 200, {
      status: "ok",
      service: "us-claw-openclaw-bridge"
    });
    return;
  }

  if (request.url === "/status") {
    writeJson(response, 200, {
      install: detectInstallStatus(),
      runtime: detectRuntimeStatus()
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
