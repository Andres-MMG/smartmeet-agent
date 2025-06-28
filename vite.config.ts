import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Base configuration
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  
  // Development server
  server: {
    port: 5173,
    strictPort: true
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@renderer': resolve(__dirname, './src/renderer'),
      '@main': resolve(__dirname, './src/main'),
      '@shared': resolve(__dirname, './src/shared')
    }
  },
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js'
  }
});