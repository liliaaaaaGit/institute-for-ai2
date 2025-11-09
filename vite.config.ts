// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT:
// - Only variables that start with VITE_ are exposed to the client.
// - Anything else (e.g. RESEND_API_KEY) must never be imported in client code.
//   Our email-sending code lives in /src/emails and is not imported by the UI.

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",            // what Vercel will serve
    sourcemap: false,
    target: "es2019",
    emptyOutDir: true,
  },
  define: {
    // prevents "process is not defined" errors if some lib references it
    "process.env": {},
  },
  // Optional but nice: keep server-only files from being optimized by Vite
  optimizeDeps: {
    exclude: ["resend"],
  },
});