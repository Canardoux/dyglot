// scripts/build-desktop.mjs
import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  BUILD_TARGET: "desktop",
  VITE_BUILD_TARGET: "desktop",
};

// Use npx so it's consistent across machines
function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32", // important on Windows
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log("[build-desktop] BUILD_TARGET =", env.BUILD_TARGET);

run("npx", ["svelte-kit", "sync"]);
run("npx", ["vite", "build"]);