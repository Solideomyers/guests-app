import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3001,
      host: '0.0.0.0',
    },
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Code splitting para mejor rendimiento
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React y React-DOM en un chunk separado
            if (
              id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom')
            ) {
              return 'react-vendor';
            }
            // TanStack Query en su propio chunk
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            // Radix UI components en un chunk
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            // Lucide icons separado
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
          },
        },
      },
      // Aumentar límite de advertencia (los chunks ahora serán más pequeños)
      chunkSizeWarningLimit: 600,
    },
  };
});
