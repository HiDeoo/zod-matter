import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: {
    banner: `/// <reference path="../types/gray-matter.d.ts" />`,
  },
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  minify: false,
})
