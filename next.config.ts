import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import * as path from 'node:path';
import type { NextConfig } from 'next';

import withSerwistInit from '@serwist/next';

const getSafePath = (): string => {
  if (process.platform === 'win32') {
    const systemRoot = process.env.SystemRoot ?? String.raw`C:\Windows`;
    const programFiles =
      process.env.ProgramFiles ?? String.raw`C:\Program Files`;
    const programFilesX86 =
      process.env['ProgramFiles(x86)'] ?? String.raw`C:\Program Files (x86)`;
    return [
      path.join(systemRoot, 'System32'),
      systemRoot,
      path.join(programFiles, 'Git', 'cmd'),
      path.join(programFilesX86, 'Git', 'cmd'),
    ].join(path.delimiter);
  }
  return '/usr/bin:/bin:/usr/local/bin';
};

const revision =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  process.env.CF_PAGES_COMMIT_SHA ??
  spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf-8',
    env: { ...process.env, PATH: getSafePath() },
  }).stdout?.trim() ??
  randomUUID();

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  register: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== 'production',
  additionalPrecacheEntries: [{ url: '/offline', revision }],
  exclude: [/.map$/, /^manifest.*\.js$/],
  globPublicPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}'],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/api-lulus-app.appspot.com/o/image/**',
      },
    ],
  },
};

export default withSerwist(nextConfig);
