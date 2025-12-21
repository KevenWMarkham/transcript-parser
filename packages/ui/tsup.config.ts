import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: [
    'react',
    'react-dom',
    '@transcript-parser/ai-services',
    '@transcript-parser/types',
    '@google/genai',
    '@radix-ui/react-dialog',
    '@radix-ui/react-progress',
    '@radix-ui/react-slot',
    '@tanstack/react-virtual',
    'lucide-react',
    'framer-motion'
  ]
})
