import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '/variora/' нужен для деплоя на GitHub Pages (https://<user>.github.io/variora/).
// Для локальной разработки путь не мешает.
export default defineConfig({
  base: '/variora/',
  plugins: [react()],
});
