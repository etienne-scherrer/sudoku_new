import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const isProd =
    process.env.BUILD_ENV === 'production' ||
    process.env.BUILD_ENV === 'staging';

  return {
    base: isProd ? '/projects/sudoku-solver/' : '/',
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.js'],
    },
  };
});
