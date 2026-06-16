import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import path from 'path';

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      '@configbuilder/threeDEngine': path.resolve(__dirname, '../../packages/threeDEngine/src')
    }
  },
  server: { port: 3000 }
});
