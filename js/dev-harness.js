// dev-harness.js - developer build only: exposes the game internals as window.__dev for the test harnesses / console.
export function install(ctx) { window.__dev = ctx; }
