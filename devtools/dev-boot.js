// dev-boot.js - DEVELOPER BUILD ONLY. Lives in the fatalbananas7/coreburn-dev repo (devtools/) and is injected
// by scripts/publish-dev.mjs; it never exists in the public game repo, its Pages site or the Android app.
// Runs BEFORE the game modules: swaps window.localStorage for a sandbox kept in sessionStorage under
// 'cbdev:' so a dev session can never write to (or alter) the real saved profile / progression.
// The sandbox starts as a copy of the real profile (read once) and is thrown away when the tab closes.
(function () {
  var C = window.Capacitor; if (C && C.isNativePlatform && C.isNativePlatform()) return; // never inside an app
  var P = 'cbdev:', ss = window.sessionStorage, real = window.localStorage;
  if (!ss.getItem(P + '__seeded')) {
    for (var i = 0; i < real.length; i++) { var k = real.key(i); ss.setItem(P + k, real.getItem(k)); }
    if (!ss.getItem(P + 'coreburn-rules')) ss.setItem(P + 'coreburn-rules', 'z'); // Phase 5 content is CoreBurnZ-only
    ss.setItem(P + '__seeded', '1');
  }
  var keys = function () { var a = []; for (var i = 0; i < ss.length; i++) { var k = ss.key(i); if (k.indexOf(P) === 0 && k !== P + '__seeded') a.push(k.slice(P.length)); } return a; };
  var box = {
    getItem: function (k) { return ss.getItem(P + k); },
    setItem: function (k, v) { ss.setItem(P + k, String(v)); },
    removeItem: function (k) { ss.removeItem(P + k); },
    clear: function () { keys().forEach(function (k) { ss.removeItem(P + k); }); },
    key: function (i) { return keys()[i] ?? null; },
    get length() { return keys().length; },
  };
  Object.defineProperty(window, 'localStorage', { value: box, configurable: true });
  window.__CB_DEV = { sandbox: true, resetSandbox: function () { keys().forEach(function (k) { ss.removeItem(P + k); }); ss.removeItem(P + '__seeded'); location.reload(); } };
  // visible DEV BUILD badge (bottom-left, out of the HUD's way, tap-through)
  var badge = function () { var d = document.createElement('div'); d.id = 'cbdev-badge'; d.textContent = 'DEV BUILD ' + (window.__CB_DEV_BUILD || '');
    d.style.cssText = 'position:fixed;left:4px;bottom:4px;z-index:2147483646;pointer-events:none;background:#ff2d6f;color:#fff;font:700 10px/1 monospace;padding:3px 5px;border-radius:3px;opacity:.85';
    document.body.appendChild(d); };
  if (document.body) badge(); else document.addEventListener('DOMContentLoaded', badge);
})();
