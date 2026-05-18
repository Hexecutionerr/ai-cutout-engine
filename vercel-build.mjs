// vercel-build.mjs
// Builds the app and creates a proper Vercel Build Output API v3 structure
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Ensure strict production mode for Vite, Vinxi and all packages
process.env.NODE_ENV = 'production';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Step 1: Run the normal vite build
console.log('🔨 Running vite build...');
execSync('npm run build', { stdio: 'inherit', cwd: __dirname });

// Step 2: Create the Vercel output structure
const outputDir = path.join(__dirname, '.vercel', 'output');
const staticDir = path.join(outputDir, 'static');
const fnDir = path.join(outputDir, 'functions', 'index.func');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(staticDir, { recursive: true });
fs.mkdirSync(fnDir, { recursive: true });

// Step 3: Copy dist/client -> .vercel/output/static
console.log('📂 Copying static client files...');
copyDir(path.join(__dirname, 'dist', 'client'), staticDir);

// Step 4: Write the thin wrapper entry point at root temporarily
console.log('🔧 Writing wrapper entry point...');
const tempWrapperPath = path.join(__dirname, 'vercel-handler-src.js');
fs.writeFileSync(
  tempWrapperPath,
  `
// Vercel Node.js serverless function entry
// Wraps the TanStack Start Web Fetch handler, fixing the ERR_INVALID_URL issue
// by constructing an absolute URL from Vercel's forwarded headers.

let serverInstance = null;

async function getServer() {
  if (!serverInstance) {
    const mod = await import('./dist/server/server.js');
    serverInstance = mod.default;
  }
  return serverInstance;
}

export default async function handler(req, res) {
  try {
    const server = await getServer();

    // Build absolute URL - Vercel passes relative paths which crash h3-v2's URL parser
    const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const absoluteUrl = new URL(req.url || '/', \`\${proto}://\${host}\`).toString();

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (Array.isArray(val)) {
        for (const v of val) headers.append(key, v);
      } else if (val != null) {
        headers.set(key, val);
      }
    }

    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      if (chunks.length > 0) body = Buffer.concat(chunks);
    }

    const request = new Request(absoluteUrl, {
      method: req.method,
      headers,
      body: body ?? null,
      ...(body ? { duplex: 'half' } : {}),
    });

    const response = await server.fetch(request);

    res.statusCode = response.status;
    res.statusMessage = response.statusText || '';
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error('[vercel-handler] Fatal error:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
    }
    res.end('Internal Server Error: ' + (err?.message || String(err)));
  }
}
`
);

// Step 5: Bundle using esbuild to make a single self-contained serverless file
console.log('⚡ Bundling serverless function using esbuild...');
const bundleOut = path.join(fnDir, 'vercel-handler.js');
try {
  execSync(`npx esbuild "${tempWrapperPath}" --bundle --platform=node --target=node20 --format=esm "--banner:js=import { createRequire as __createRequire } from 'module'; const require = __createRequire(import.meta.url);" --define:process.env.NODE_ENV=\\"production\\" --outfile="${bundleOut}"`, { stdio: 'inherit' });
  console.log('✅ Successfully compiled standalone serverless bundle.');
} catch (e) {
  console.error('❌ esbuild bundling failed:', e);
  process.exit(1);
} finally {
  // Clean up temp wrapper file
  if (fs.existsSync(tempWrapperPath)) {
    fs.unlinkSync(tempWrapperPath);
  }
}

// Step 6: Write the function config
fs.writeFileSync(
  path.join(fnDir, '.vc-config.json'),
  JSON.stringify({
    runtime: 'nodejs20.x',
    handler: 'vercel-handler.js',
    launcherType: 'Nodejs',
    shouldAddHelpers: true,
    supportsResponseStreaming: false,
  }, null, 2)
);

// Step 7: Write the Vercel output config.json
fs.writeFileSync(
  path.join(outputDir, 'config.json'),
  JSON.stringify({
    version: 3,
    routes: [
      // Static assets - serve with long cache
      {
        src: '/_build/(.+)',
        dest: '/_build/$1',
        headers: { 'cache-control': 'public, max-age=31536000, immutable' }
      },
      {
        src: '/assets/(.+)',
        dest: '/assets/$1',
        headers: { 'cache-control': 'public, max-age=31536000, immutable' }
      },
      // Favicon and robots
      { src: '/favicon\\.ico', dest: '/favicon.ico' },
      { src: '/robots\\.txt', dest: '/robots.txt' },
      // All other requests -> SSR function
      { src: '/(.*)', dest: '/index' },
    ],
  }, null, 2)
);

console.log('✅ Vercel Build Output API structure ready at .vercel/output/');
console.log('   Run: npx vercel deploy --prebuilt --prod');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
