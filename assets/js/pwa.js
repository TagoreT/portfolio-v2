(() => {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      // Intentionally ignore registration errors on unsupported/static preview contexts.
    });
  });
})();

