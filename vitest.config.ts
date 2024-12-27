import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/**/*.ts'],
    exclude: ['tests/**/example/**/*'],
    globals: true,
    watch: false,
  },
});
