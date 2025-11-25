import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
      base: '/Aero-leaf-CFD-analysis-adapted-from-blender-ish/',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
