import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/redteamer403.github.io/',  // Set this to your repo name
  build: {
    outDir: 'docs'  // GitHub Pages expects files in 'docs' folder
  }
});
