import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const target = env.VITE_API_TARGET || "http://localhost:8080";

  return defineConfig({
    plugins: [react()],
    server: {
      host: "localhost",
      port: 5173,
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
