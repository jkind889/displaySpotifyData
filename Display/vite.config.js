import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/spotify": {
        target: "https://api.spotify.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/spotify/, ""),
      },
    },
  },
});
