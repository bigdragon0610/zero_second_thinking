import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000, // CRAと同じデフォルトポート
  },
  build: {
    outDir: "build", // CRAと同じディレクトリ名
  },
  publicDir: "public", // 明示的に公開ディレクトリを指定
});
