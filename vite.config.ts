import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default function defineConfig() {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          configure: (proxy, options) => {
            // Fallback for development - return mock response
            proxy.on('error', (err, req, res) => {
              console.log('API proxy error, using mock response');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, mock: true }));
            });
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    define: {
      // Ensure environment variables are available in production
      'import.meta.env.PROD': JSON.stringify(process.env.NODE_ENV === 'production'),
    },
  }
}