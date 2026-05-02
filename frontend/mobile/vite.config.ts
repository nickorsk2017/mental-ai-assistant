import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const sharedEnvironment = loadEnv(mode, resolve(__dirname, '../../_common'), '');
  const backendUrl = sharedEnvironment.BACKEND_URL ?? process.env.BACKEND_URL ?? 'http://localhost:4000';

  return {
    plugins: [react()],
    define: {
      'process.env.BACKEND_URL': JSON.stringify(backendUrl),
      'process.env.NEXT_PUBLIC_RUNTIME_PLATFORM': JSON.stringify('mobile'),
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@common/shared': resolve(__dirname, '../_common'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1300,
    },
  };
});
