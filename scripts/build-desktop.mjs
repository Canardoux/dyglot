// scripts/build-desktop.mjs
import { spawnSync } from 'node:child_process';

process.env.BUILD_TARGET = 'desktop';
process.env.VITE_BUILD_TARGET = 'desktop';

// Run vite in a child process, inheriting THIS env for all sub-processes
const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', 'build'],
  { stdio: 'inherit', env: process.env }
);

process.exit(result.status ?? 1);
