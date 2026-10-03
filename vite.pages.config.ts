import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const root=fileURLToPath(new URL('.',import.meta.url));

export default defineConfig({
  root:fileURLToPath(new URL('./github-pages',import.meta.url)),
  base:'./',
  publicDir:fileURLToPath(new URL('./public',import.meta.url)),
  plugins:[react()],
  resolve:{alias:{'@':root}},
  css:{postcss:root},
  build:{outDir:fileURLToPath(new URL('./docs',import.meta.url)),emptyOutDir:true},
});
