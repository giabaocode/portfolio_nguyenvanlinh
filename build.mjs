import { mkdir, copyFile, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'public');
const files = [
  'index.html', 'style.css', 'motion.css', 'hero.css', 'responsive.css',
  'script.js', 'petals.js', 'hero.js', '_headers', 'robots.txt',
];
await mkdir(output, { recursive: true });
const extras = (await readdir(output)).filter(name => !files.includes(name));
if (extras.length) throw new Error('public/ contains unexpected files. Inspect the output before deploying.');
for (const name of files) await copyFile(path.join(root, name), path.join(output, name));
const html = await readFile(path.join(output, 'index.html'), 'utf8');
for (const name of files.filter(name => /\.(css|js)$/.test(name))) {
  if (!html.includes(`"${name}"`)) throw new Error(`Unreferenced asset: ${name}`);
}
console.log(`Ready to deploy: ${files.length} public files. Local secrets and repository files excluded.`);
