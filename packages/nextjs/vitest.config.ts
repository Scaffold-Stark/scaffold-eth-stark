import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "~~": path.resolve(__dirname, "./"),
      "@scaffold-stark-2": path.resolve(__dirname, "./lib/scaffold-stark-2"),
      "@scaffold-eth-2": path.resolve(__dirname, "./lib/scaffold-eth-2"),
    },
  },
});
