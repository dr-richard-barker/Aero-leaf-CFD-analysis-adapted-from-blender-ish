import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keyless static build — `base: './'` keeps asset URLs relative so the site
// works from the GitHub Pages project sub-path (fixes the previous hard-coded /
// duplicated base that 404'd all assets).
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
