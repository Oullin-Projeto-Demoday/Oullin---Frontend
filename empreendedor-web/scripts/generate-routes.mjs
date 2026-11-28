import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatedRouteFiles } from '../src/routes.js';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const buildDirectory = resolve(projectDirectory, 'dist');
const indexHtml = await readFile(resolve(buildDirectory, 'index.html'), 'utf8');

for (const outputPath of generatedRouteFiles) {
  const destination = resolve(buildDirectory, outputPath);
  const depth = outputPath.split('/').length - 1;
  const assetPrefix = `${'../'.repeat(depth)}assets/`;
  const html = indexHtml.replaceAll('./assets/', assetPrefix);

  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
}
