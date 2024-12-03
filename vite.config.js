const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/.netlify': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      }
    }
  }
});
