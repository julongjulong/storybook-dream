import { defineConfig } from 'vite';

// Relative base so the built game loads from file:// inside the Windows app.
export default defineConfig({
  base: './',
  publicDir: false,
  build: { outDir: 'dist', assetsInlineLimit: 0, target: 'chrome130' },
  server: { port: 4181, strictPort: true },
});
