import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { routeByPath } from './src/routes.js';

const routePaths = new Set(Object.keys(routeByPath));

function portalRoutesPlugin() {
  return {
    name: 'portal-routes',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url) {
          const url = new URL(request.url, 'http://localhost');
          if (url.pathname !== '/' && routePaths.has(url.pathname)) {
            request.url = `/index.html${url.search}`;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), portalRoutesPlugin()],
  build: {
    outDir: 'dist',
  },
});
