import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize bundle size
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: true,
    
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          // React core libraries
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          
          // UI and icon libraries
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-vendor';
          }
          
          // Animation libraries
          if (id.includes('node_modules/motion') || 
              id.includes('node_modules/framer-motion')) {
            return 'motion-vendor';
          }
          
          // Virtual scrolling
          if (id.includes('node_modules/@tanstack/react-virtual') ||
              id.includes('node_modules/@tanstack/virtual-core')) {
            return 'virtual-vendor';
          }
          
          // Other large dependencies
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  
  // Optimize development server
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion/react', 'lucide-react'],
    exclude: [],
  },
})