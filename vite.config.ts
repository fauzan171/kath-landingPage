import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  // Use '/' for Cloudflare Pages (not './')
  base: '/',
  plugins: [inspectAttr(), react(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for Cloudflare Pages
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production (smaller build)
    rollupOptions: {
      output: {
        // Optimize chunk size for Cloudflare
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          gsap: ['gsap'],
          lucide: ['lucide-react'],
          radix: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        },
        // Add content hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const info = name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Minification settings
    minify: 'esbuild',
    target: 'es2020',
    // Improve performance
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
  // Server config for local development
  server: {
    port: 3000,
    host: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'lucide-react'],
  },
});