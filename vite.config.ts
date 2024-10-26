import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ModernClippy',
      formats: ['es', 'umd'],
      fileName: (format) => `modern-clippy.${format === 'umd' ? 'umd.cjs' : 'js'}`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  },
  plugins: [dts()],
  css: {
    postcss: './postcss.config.js'
  }
})