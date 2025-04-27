import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-react",
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React dependencies into their own chunk
          "vendor-react": ["react", "react-dom"],
          // Split Mantine dependencies
          "vendor-mantine": [
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/form",
          ],
          // Split Iconify dependencies
          "vendor-iconify": ["@iconify/react"],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
