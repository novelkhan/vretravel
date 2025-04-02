import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['bootstrap'], // Bootstrap-কে প্রি-বান্ডল করার জন্য
  },
  build: {
    rollupOptions: {
      external: ['bootstrap'], // Bootstrap-কে বান্ডলের বাইরে রাখা
    },
  },
});