import { cpSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const src = join(
  __dirname,
  '..',
  'node_modules',
  '@lottiefiles',
  'dotlottie-web',
  'dist',
  'dotlottie-player.wasm'
);
const destDir = join(__dirname, '..', 'public', 'wasm');
const dest = join(destDir, 'dotlottie-player.wasm');

mkdirSync(destDir, { recursive: true });
cpSync(src, dest);
console.log('✔ dotlottie-player.wasm copiado para public/wasm/');
