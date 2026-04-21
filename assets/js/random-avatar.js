(() => {
  'use strict';

  const safeString = (value) => (typeof value === 'string' ? value.trim() : '');

  const getRandomIndex = (maxExclusive) => {
    if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) return 0;

    const cryptoObj = window.crypto;
    if (cryptoObj?.getRandomValues) {
      const arr = new Uint32Array(1);
      cryptoObj.getRandomValues(arr);
      return arr[0] % maxExclusive;
    }

    return Math.floor(Math.random() * maxExclusive);
  };

  const initRandomAvatar = () => {
    const config = window.siteConfig?.avatar ?? {};
    const selector = safeString(config?.selector);
    if (!selector) return;

    const avatarImg = document.querySelector(selector);
    if (!(avatarImg instanceof HTMLImageElement)) return;

    const images = Array.isArray(config?.images) ? config.images.map(safeString).filter(Boolean) : [];
    if (!images.length) return;

    const idx = getRandomIndex(images.length);
    const nextSrc = images[idx];
    if (!nextSrc) return;

    avatarImg.decoding = 'async';
    avatarImg.loading = 'eager';
    avatarImg.src = nextSrc;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRandomAvatar, { once: true });
  } else {
    initRandomAvatar();
  }
})();

