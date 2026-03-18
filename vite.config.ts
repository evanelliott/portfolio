import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { fileURLToPath, URL } from 'node:url'

/**
 * Senior Portfolio Vite Configuration
 * Focuses on build-time asset optimization and GitHub Pages compatibility.
 */
export default defineConfig({
  // 1. Base URL: Critical for GitHub Pages sub-folder deployment
  // Replace 'your-repo-name' with your actual repository name
  base: '/portfolio/',

  plugins: [
    vue(),
    
    // 2. Automated Asset Pipeline: Compresses WebP/SVG at build-time
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      exclude: undefined,
      include: undefined,
      includePublic: true, // Also optimizes files in /public/images
      logStats: true,      // Outputs a compression report in the CI logs
      
      // Sharp engine configuration for modern formats
      webp: {
        lossless: false,
        quality: 80,
      },
      svg: {
        multipass: true,
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'sortAttrs' },
        ],
      },
      // Fallback for standard formats
      png: { quality: 80 },
      jpeg: { quality: 75 },
    }),
  ],

  resolve: {
    // 3. Path Aliasing: Maintains clean imports (e.g., import X from '@/components/X')
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  css: {
    // Force Vite to use PostCSS for the transformation so Tailwind can run
    transformer: 'postcss', 
  },

  build: {
    // 2. Use esbuild for minification (avoids Lightning CSS @apply errors)
    cssMinify: 'esbuild',
    
    // 4. Performance: Inline small assets as base64 to reduce HTTP requests
    assetsInlineLimit: 4096, 
    // Increases the limit to 2.6MB to silence the vendor-utils warning
    chunkSizeWarningLimit: 3000, 
    
    // 5. Chunking Strategy: Separates vendor code from project logic
    rollupOptions: {
      output: {
        codeSplitting: { // Use this instead of advancedChunks
          groups: [
            {
              name: 'vendor-vue',
              test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
            },
            {
              name: 'vendor-utils',
              test: /[\\/]node_modules[\\/](marked|mermaid|zod)[\\/]/,
            },
          ],
        },
      },
    },
  },
})
