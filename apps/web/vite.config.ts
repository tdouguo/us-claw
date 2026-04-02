import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const controlPlaneUrl = env.US_CLAW_CONTROL_PLANE_URL || "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    test: {
      environment: "jsdom"
    },
    server: {
      host: "0.0.0.0",
      port: 4173,
      proxy: {
        "/api": {
          target: controlPlaneUrl,
          changeOrigin: true
        }
      }
    }
  };
});
