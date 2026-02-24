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
  register: false,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== 'production',
  additionalPrecacheEntries: [{ url: '/offline', revision }],
  exclude: [/.map$/, /^manifest.*\.js$/],
  globPublicPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}'],
});

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      [
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        'https://apis.google.com',
        'https://accounts.google.com',
      ].join(' '),
      "style-src 'self' 'unsafe-inline' https://accounts.google.com",
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://*.google.com https://*.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      [
        "connect-src 'self'",
        'https://*.googleapis.com',
        'https://*.firebaseio.com',
        'wss://*.firebaseio.com',
        'https://firebasestorage.googleapis.com',
        'https://identitytoolkit.googleapis.com',
        'https://accounts.google.com',
        'https://apis.google.com',
      ].join(' '),
      "frame-src 'self' https://accounts.google.com https://apis.google.com https://*.firebaseapp.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default withSerwist(nextConfig);
