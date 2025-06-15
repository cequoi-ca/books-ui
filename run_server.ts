import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const adapter = path.resolve('./adapter');

export async function run_server() {

    const root = fileURLToPath(new URL(".", import.meta.url));
    
    console.log("Adapter Directory: ", adapter);
    
    process.chdir(root);

    const server = await createServer({
        configFile: false,

  plugins: [solid()],
  server: {
    fs: {
      strict: false,
      allow: [adapter]
    },
    host: '0.0.0.0',
    allowedHosts: ['front-end', 'localhost', '127.0.0.1']
  },
    resolve: {
      alias: {
        adapter
      }
    }
    });
    await server.listen(9080);
    server.printUrls();
    server.bindCLIShortcuts({ print: true});
}