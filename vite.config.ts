import { defineConfig } from 'vite'
import type { ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import type { IncomingMessage, ServerResponse } from 'http' // Standard node types

// Custom Plugin for Map File I/O
const mapServerPlugin = () => ({
  name: 'map-server-plugin',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/api/maps', async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const mapsDir = path.resolve(__dirname, 'src/assets/maps');
      
      // Ensure directory exists
      if (!fs.existsSync(mapsDir)) {
        fs.mkdirSync(mapsDir, { recursive: true });
      }

      // GET /api/maps -> List files
      if (req.method === 'GET' && req.url === '/') {
        try {
          const files = fs.readdirSync(mapsDir).filter(f => f.endsWith('.json'));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(files));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to list maps' }));
        }
        return;
      }

      // GET /api/maps/:name -> Read file
      if (req.method === 'GET' && req.url && req.url.length > 1) {
        const filename = req.url.slice(1); // Remove leading slash
        const filePath = path.join(mapsDir, filename);
        
        // Basic security check
        if (!filePath.startsWith(mapsDir)) {
             res.statusCode = 403;
             res.end(JSON.stringify({ error: 'Access denied' }));
             return;
        }

        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.end(content);
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Map not found' }));
        }
        return;
      }

      // POST /api/maps -> Save file
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const { name, data } = JSON.parse(body);
            if (!name || !data) throw new Error('Invalid data');
            
            // Sanitize filename
            const safeName = name.replace(/[^a-zA-Z0-9-_]/g, '') + '.json';
            const filePath = path.join(mapsDir, safeName);

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, filename: safeName }));
          } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save map' }));
          }
        });
        return;
      }

      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  base: '/poke-survivor/',
  plugins: [react(), tailwindcss(), mapServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
