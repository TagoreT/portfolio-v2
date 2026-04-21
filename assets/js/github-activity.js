(() => {
  'use strict';

  const qs = (sel, root = document) => root.querySelector(sel);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const createLegend = (container, text) => {
    const less = document.createElement('span');
    less.className = 'github-legend-label';
    less.textContent = text.legendLess;

    const more = document.createElement('span');
    more.className = 'github-legend-label';
    more.textContent = text.legendMore;

    const stops = ['github-legend-stop-0', 'github-legend-stop-1', 'github-legend-stop-2', 'github-legend-stop-3'];
    const stopWrap = document.createElement('div');
    stopWrap.className = 'github-legend-stops';
    stops.forEach((cls) => {
      const s = document.createElement('span');
      s.className = `github-legend-stop ${cls}`;
      stopWrap.appendChild(s);
    });

    container.replaceChildren(less, stopWrap, more);
  };

  const getRectTooltipText = (rect) => {
    const title = rect.querySelector('title')?.textContent?.trim();
    if (title) return title;

    const count = rect.getAttribute('data-count');
    const date = rect.getAttribute('data-date');
    if (count && date) return `${count} on ${date}`;
    if (date) return date;
    return '';
  };

  const parseDateFromTooltipText = (text) => {
    if (!text) return null;

    // Common formats we might encounter:
    // - "5 contributions on 2026-04-21"
    // - "No contributions on 2026-04-21"
    // - "5 contributions on Apr 21, 2026"
    // - "Apr 21, 2026"
    const iso = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    if (iso?.[1]) return iso[1];

    const human = text.match(/\b([A-Za-z]{3,9})\s+(\d{1,2}),\s+(\d{4})\b/);
    if (!human) return null;

    const monthNames = {
      jan: 1,
      january: 1,
      feb: 2,
      february: 2,
      mar: 3,
      march: 3,
      apr: 4,
      april: 4,
      may: 5,
      jun: 6,
      june: 6,
      jul: 7,
      july: 7,
      aug: 8,
      august: 8,
      sep: 9,
      sept: 9,
      september: 9,
      oct: 10,
      october: 10,
      nov: 11,
      november: 11,
      dec: 12,
      december: 12,
    };

    const monthKey = human[1].toLowerCase();
    const month = monthNames[monthKey];
    if (!month) return null;

    const day = Number(human[2]);
    const year = Number(human[3]);
    if (!day || !year) return null;

    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getCssVar = (name, fallback) => {
    try {
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || fallback;
    } catch {
      return fallback;
    }
  };

  const applyThemeToSvg = (svg) => {
    // Make the imported SVG blend into the portfolio theme.
    svg.style.background = 'transparent';

    const surface = getCssVar('--eerie-black-1', '#111318');
    const textMuted = getCssVar('--light-gray-70', 'rgba(180,180,180,0.7)');
    const accent = getCssVar('--orange-yellow-crayola', '#2fbf71');
    const accent2 = getCssVar('--vegas-gold', '#34d399');

    // Most GH-chart SVGs use these GitHub colors; map them into the site palette.
    const fillMap = new Map([
      ['#ebedf0', surface], // empty
      ['#c6e48b', accent],
      ['#7bc96f', accent],
      ['#239a3b', accent2],
      ['#196127', accent2], // highest
    ]);

    svg.querySelectorAll('rect[fill]').forEach((r) => {
      const fill = r.getAttribute('fill')?.toLowerCase();
      const mapped = fill ? fillMap.get(fill) : null;
      if (mapped) r.setAttribute('fill', mapped);
    });

    // Dim month/week labels if present.
    svg.querySelectorAll('text').forEach((t) => {
      t.setAttribute('fill', textMuted);
      t.setAttribute('font-family', 'Poppins, sans-serif');
      t.setAttribute('font-size', t.getAttribute('font-size') ?? '10');
    });
  };

  const enhanceSvgInteractivity = (svg, username) => {
    svg.classList.add('github-activity-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `GitHub contributions for ${username}`);

    const rects = svg.querySelectorAll('rect');
    rects.forEach((r) => {
      const text = getRectTooltipText(r);
      if (!text) return;
      r.setAttribute('tabindex', '0');
      r.classList.add('github-activity-cell');
      if (!r.querySelector('title')) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        t.textContent = text;
        r.appendChild(t);
      }
    });

    const tooltip = document.createElement('div');
    tooltip.className = 'github-activity-tooltip';
    tooltip.setAttribute('role', 'status');
    tooltip.setAttribute('aria-live', 'polite');
    document.body.appendChild(tooltip);

    const hide = () => tooltip.classList.remove('is-visible');
    const show = (text, x, y) => {
      tooltip.textContent = text;
      tooltip.classList.add('is-measuring');
      tooltip.classList.add('is-visible');

      const rect = tooltip.getBoundingClientRect();
      const paddedX = clamp(x, 12 + rect.width / 2, window.innerWidth - 12 - rect.width / 2);
      const paddedY = clamp(y, 12 + rect.height, window.innerHeight - 12);

      tooltip.style.left = `${paddedX}px`;
      tooltip.style.top = `${paddedY}px`;

      tooltip.classList.remove('is-measuring');
      tooltip.classList.add('is-visible');
    };

    const getPointerPos = (e) => {
      const x = 'clientX' in e ? e.clientX : 0;
      const y = 'clientY' in e ? e.clientY : 0;
      return { x, y };
    };

    const onEnterOrMove = (e) => {
      const rect = e.target?.closest?.('rect');
      if (!rect) return hide();

      const text = getRectTooltipText(rect);
      if (!text) return hide();

      const { x, y } = getPointerPos(e);
      show(text, x, y - 12);
    };

    svg.addEventListener('pointermove', onEnterOrMove);
    svg.addEventListener('pointerenter', onEnterOrMove);
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('focusin', (e) => onEnterOrMove(e));
    svg.addEventListener('focusout', hide);

    svg.addEventListener('click', (e) => {
      const rect = e.target?.closest?.('rect');
      if (!rect) return;

      const tip = getRectTooltipText(rect);
      const date = parseDateFromTooltipText(tip);
      const base = `https://github.com/${encodeURIComponent(username)}`;
      const url = date
        ? `${base}?tab=overview&from=${encodeURIComponent(date)}&to=${encodeURIComponent(date)}`
        : base;

      window.open(url, '_blank', 'noopener,noreferrer');
    });
  };

  const tryLoadInlineSvg = async (username) => {
    const url = `https://ghchart.rshah.org/${encodeURIComponent(username)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const svgText = await res.text();
    if (!svgText.includes('<svg')) return null;
    return svgText;
  };

  const fallbackImage = (container, username) => {
    const img = document.createElement('img');
    img.className = 'github-activity-img';
    img.alt = `GitHub contributions for ${username}`;
    img.loading = 'lazy';
    img.src = `https://ghchart.rshah.org/${encodeURIComponent(username)}`;
    container.replaceChildren(img);
  };

  const initGithubActivity = async () => {
    const section = qs('[data-github-activity]');
    if (!section) return;

    const cfg = window.siteConfig?.github;
    const username = cfg?.username?.trim();
    if (!username) {
      section.setAttribute('hidden', 'true');
      return;
    }

    const titleEl = qs('[data-github-title]', section);
    const subtitleEl = qs('[data-github-subtitle]', section);
    const chartEl = qs('[data-github-chart]', section);
    const legendEl = qs('[data-github-legend]', section);
    const profileLink = qs('[data-github-profile-link]', section);
    const reposLink = qs('[data-github-repos-link]', section);

    const text = cfg?.uiText ?? {};
    if (titleEl) titleEl.textContent = text.activityTitle ?? '';
    if (subtitleEl) subtitleEl.textContent = text.activitySubtitle ?? '';

    if (profileLink) profileLink.href = cfg?.urls?.profile ?? `https://github.com/${encodeURIComponent(username)}`;
    if (reposLink) reposLink.href = cfg?.urls?.repositories ?? `https://github.com/${encodeURIComponent(username)}?tab=repositories`;

    if (legendEl) createLegend(legendEl, text);

    if (!chartEl) return;
    chartEl.innerHTML = '<div class="github-activity-skeleton"></div>';

    try {
      const svgText = await tryLoadInlineSvg(username);
      if (!svgText) return fallbackImage(chartEl, username);

      chartEl.innerHTML = svgText;
      const svg = chartEl.querySelector('svg');
      if (svg) {
        applyThemeToSvg(svg);
        enhanceSvgInteractivity(svg, username);
      }
    } catch {
      fallbackImage(chartEl, username);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGithubActivity, { once: true });
  } else {
    initGithubActivity();
  }
})();

