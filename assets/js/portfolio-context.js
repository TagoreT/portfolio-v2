(() => {
  'use strict';

  const qs = (sel, root = document) => root.querySelector(sel);

  const safeText = (value) => (typeof value === 'string' ? value.trim() : '');

  const slugify = (value) =>
    safeText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const titleCase = (value) =>
    safeText(value)
      .split(/[\s_-]+/g)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const uniqueBy = (items, keyFn) => {
    const seen = new Set();
    return items.filter((item) => {
      const k = keyFn(item);
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  const getPortfolioConfig = () => window.siteConfig?.portfolio ?? {};

  const getProfileProjects = () => {
    const projects = window.profileContext?.projects;
    if (!projects) return [];

    const flatten = [];

    const portfolioAndClientWork = Array.isArray(projects.portfolioAndClientWork)
      ? projects.portfolioAndClientWork
      : [];
    portfolioAndClientWork.forEach((p) => {
      flatten.push({
        sourceGroup: 'portfolioAndClientWork',
        name: safeText(p?.name),
        type: safeText(p?.type),
        description: safeText(p?.description),
        tech: Array.isArray(p?.tech) ? p.tech : [],
        links: Array.isArray(p?.links) ? p.links : [],
      });
    });

    const academic = Array.isArray(projects.academic) ? projects.academic : [];
    academic.forEach((p) => {
      flatten.push({
        sourceGroup: 'academic',
        name: safeText(p?.name),
        type: safeText(p?.type),
        description: safeText(p?.problem) || safeText(p?.timeframe),
        tech: Array.isArray(p?.tech) ? p.tech : [],
        links: Array.isArray(p?.links) ? p.links : [],
      });
    });

    return flatten.filter((p) => p.name);
  };

  const normalizeCategory = (project) => {
    const config = getPortfolioConfig();
    const categoryOverrides = config?.categoryOverrides ?? {};
    const override = safeText(categoryOverrides?.[project.type]) || safeText(categoryOverrides?.[project.sourceGroup]);
    const raw = override || safeText(project.type) || safeText(project.sourceGroup) || 'project';
    return raw.toLowerCase();
  };

  const getProjectMeta = (projectName) => {
    const config = getPortfolioConfig();
    const meta = config?.projects?.[projectName] ?? config?.projects?.[slugify(projectName)] ?? null;
    return meta && typeof meta === 'object' ? meta : null;
  };

  const getProjectPrimaryUrl = (project) => {
    const meta = getProjectMeta(project.name);
    const metaUrl = safeText(meta?.url);
    if (metaUrl) return metaUrl;

    const links = Array.isArray(project.links) ? project.links : [];
    const firstLink = links.find((l) => safeText(l?.url))?.url;
    if (firstLink) return safeText(firstLink);

    const config = getPortfolioConfig();
    const fallbackUrl = safeText(config?.fallbackUrl);
    return fallbackUrl || '#';
  };

  const getProjectImage = (project, index) => {
    const meta = getProjectMeta(project.name);
    const img = safeText(meta?.image);
    if (img) return img;

    const config = getPortfolioConfig();
    const defaultImages = Array.isArray(config?.defaultImages) ? config.defaultImages : [];
    return safeText(defaultImages[index % Math.max(defaultImages.length, 1)]) || './assets/images/project-1.jpg';
  };

  const getProjectSubtitle = (project) => {
    const meta = getProjectMeta(project.name);
    const subtitle = safeText(meta?.subtitle);
    if (subtitle) return subtitle;
    return safeText(project.description);
  };

  const getCategoryLabel = (categoryKey) => {
    const config = getPortfolioConfig();
    const labels = config?.categoryLabels ?? {};
    const label = safeText(labels?.[categoryKey]);
    return label || titleCase(categoryKey);
  };

  const buildFilterButton = ({ label, isActive }) => {
    const li = document.createElement('li');
    li.className = 'filter-item';

    const btn = document.createElement('button');
    btn.setAttribute('data-filter-btn', '');
    btn.textContent = label;
    if (isActive) btn.classList.add('active');

    li.appendChild(btn);
    return li;
  };

  const buildSelectItem = ({ label }) => {
    const li = document.createElement('li');
    li.className = 'select-item';

    const btn = document.createElement('button');
    btn.setAttribute('data-select-item', '');
    btn.textContent = label;

    li.appendChild(btn);
    return li;
  };

  const buildProjectCard = ({ project, categoryKey, categoryLabel, index }) => {
    const li = document.createElement('li');
    li.className = 'project-item active';
    li.setAttribute('data-filter-item', '');
    li.dataset.category = categoryKey;

    const url = getProjectPrimaryUrl(project);
    const projectSlug = slugify(project.name);

    const figure = document.createElement('figure');
    figure.className = 'project-img';

    const iconBox = document.createElement('div');
    iconBox.className = 'project-item-icon-box';
    const ion = document.createElement('ion-icon');
    ion.setAttribute('name', 'open-outline');
    iconBox.appendChild(ion);

    const config = getPortfolioConfig();
    const uiText = config?.uiText ?? {};
    const embedConfig = config?.embed ?? {};
    const embedEnabled = Boolean(embedConfig?.enabled);

    if (embedEnabled && url && url !== '#') {
      const viewportWidth = Number(embedConfig?.viewport?.width) || 1280;
      const viewportHeight = Number(embedConfig?.viewport?.height) || 720;

      const embedWrap = document.createElement('div');
      embedWrap.className = 'project-embed-wrap';
      embedWrap.style.setProperty('--embed-viewport-width', `${viewportWidth}px`);
      embedWrap.style.setProperty('--embed-viewport-height', `${viewportHeight}px`);
      embedWrap.dataset.embedViewportWidth = String(viewportWidth);

      const iframe = document.createElement('iframe');
      iframe.className = 'project-embed';
      iframe.src = url;
      iframe.title = project.name;
      iframe.loading = safeText(embedConfig?.loading) || 'eager';
      iframe.referrerPolicy = safeText(embedConfig?.referrerPolicy) || 'no-referrer';
      iframe.setAttribute(
        'sandbox',
        safeText(embedConfig?.sandbox) ||
        'allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation',
      );
      iframe.style.pointerEvents = 'none';
      iframe.style.transform = 'scale(1)';

      const fallback = document.createElement('div');
      fallback.className = 'project-embed-fallback';
      fallback.textContent = safeText(uiText?.previewUnavailableLabel) || 'Preview not available. Open project.';
      fallback.dataset.embedFallback = 'true';

      embedWrap.appendChild(iframe);
      figure.append(iconBox, embedWrap, fallback);
    } else {
      const img = document.createElement('img');
      img.src = getProjectImage(project, index);
      img.alt = project.name;
      img.loading = 'lazy';
      figure.append(iconBox, img);
    }

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.name;

    const category = document.createElement('p');
    category.className = 'project-category';
    category.textContent = categoryLabel;

    const subtitle = getProjectSubtitle(project);
    const openLink = document.createElement('a');
    openLink.className = 'project-open-link';
    openLink.href = url;
    openLink.target = url === '#' ? '_self' : '_blank';
    openLink.rel = url === '#' ? '' : 'noopener noreferrer';
    openLink.dataset.project = projectSlug;
    openLink.dataset.projectUrl = url;
    openLink.setAttribute('aria-label', subtitle ? `${project.name} — ${subtitle}` : project.name);
    if (subtitle) openLink.title = subtitle;

    openLink.append(figure);

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    meta.append(title, category);

    li.append(openLink, meta);
    return li;
  };

  const initEmbeds = (root) => {
    const wraps = (root ?? document).querySelectorAll('.project-embed-wrap');
    wraps.forEach((wrap) => {
      const iframe = wrap.querySelector('iframe.project-embed');
      if (!iframe) return;

      const fallback = wrap.parentElement?.querySelector('[data-embed-fallback="true"]');

      const viewportWidth = Number(wrap.dataset.embedViewportWidth) || 1280;

      const setScale = () => {
        const w = wrap.getBoundingClientRect().width;
        if (!w || !Number.isFinite(w)) return;
        const scale = Math.max(0.01, w / viewportWidth);
        iframe.style.transform = `scale(${scale})`;
      };

      setScale();

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => setScale());
        ro.observe(wrap);
      } else {
        window.addEventListener('resize', setScale, { passive: true });
      }

      if (fallback instanceof HTMLElement) {
        fallback.style.opacity = '0';
      }

      let loaded = false;
      const showFallback = () => {
        if (loaded) return;
        if (fallback instanceof HTMLElement) fallback.style.opacity = '1';
      };

      const timer = window.setTimeout(showFallback, 2500);
      iframe.addEventListener(
        'load',
        () => {
          loaded = true;
          window.clearTimeout(timer);
          if (fallback instanceof HTMLElement) fallback.style.opacity = '0';
        },
        { once: true },
      );
    });
  };

  const scheduleEmbedRefresh = () => {
    const portfolio = qs('[data-page="portfolio"]');
    if (!portfolio || !portfolio.classList.contains('active')) return;
    const projectList = qs('[data-portfolio-project-list]', portfolio);
    if (!projectList) return;
    requestAnimationFrame(() => initEmbeds(projectList));
  };

  const setSelectedCategoryLabel = (label) => {
    const selectValue = qs('[data-selecct-value]');
    if (!selectValue) return;
    selectValue.textContent = label;
  };

  const getInitialProjectSlug = () => {
    const url = new URL(window.location.href);
    const fromQuery = safeText(url.searchParams.get('project'));
    if (fromQuery) return slugify(fromQuery);
    const hash = safeText(url.hash || '');
    const match = hash.match(/project=([^&]+)/i);
    return match?.[1] ? slugify(decodeURIComponent(match[1])) : '';
  };

  const navigateToPage = (pageKey) => {
    const pages = document.querySelectorAll('[data-page]');
    const navLinks = document.querySelectorAll('[data-nav-link]');
    for (let i = 0; i < pages.length; i += 1) {
      const isMatch = safeText(pages[i].dataset.page).toLowerCase() === safeText(pageKey).toLowerCase();
      pages[i].classList.toggle('active', isMatch);
      navLinks[i]?.classList.toggle('active', isMatch);
    }
    window.scrollTo(0, 0);
  };

  const init = () => {
    const filterList = qs('[data-portfolio-filter-list]');
    const selectList = qs('[data-portfolio-select-list]');
    const projectList = qs('[data-portfolio-project-list]');
    const titleNode = qs('[data-portfolio-title]');

    if (!filterList || !selectList || !projectList) return;

    const config = getPortfolioConfig();
    const uiText = config?.uiText ?? {};

    if (titleNode) {
      titleNode.textContent = safeText(uiText?.title) || 'Portfolio';
    }

    const projects = getProfileProjects();
    const normalizedProjects = projects.map((p) => ({
      ...p,
      categoryKey: normalizeCategory(p),
    }));

    const categories = uniqueBy(
      normalizedProjects.map((p) => p.categoryKey).filter(Boolean),
      (k) => k,
    );

    const orderedCategories = (() => {
      const order = Array.isArray(config?.categoryOrder) ? config.categoryOrder.map((c) => safeText(c).toLowerCase()) : [];
      if (!order.length) return categories;
      const inOrder = order.filter((k) => categories.includes(k));
      const rest = categories.filter((k) => !inOrder.includes(k));
      return [...inOrder, ...rest];
    })();

    const allLabel = safeText(uiText?.allLabel) || 'All';
    const selectPlaceholder = safeText(uiText?.selectPlaceholder) || allLabel;

    filterList.replaceChildren(
      buildFilterButton({ label: allLabel, isActive: true }),
      ...orderedCategories.map((categoryKey) =>
        buildFilterButton({ label: getCategoryLabel(categoryKey), isActive: false }),
      ),
    );

    selectList.replaceChildren(
      buildSelectItem({ label: allLabel }),
      ...orderedCategories.map((categoryKey) => buildSelectItem({ label: getCategoryLabel(categoryKey) })),
    );

    setSelectedCategoryLabel(selectPlaceholder);

    projectList.replaceChildren(
      ...normalizedProjects.map((p, index) =>
        buildProjectCard({
          project: p,
          categoryKey: p.categoryKey,
          categoryLabel: getCategoryLabel(p.categoryKey),
          index,
        }),
      ),
    );

    if (Boolean(config?.embed?.enabled)) {
      requestAnimationFrame(() => initEmbeds(projectList));
      document.addEventListener('click', scheduleEmbedRefresh);
      window.addEventListener('resize', scheduleEmbedRefresh, { passive: true });
    }

    const initialSlug = getInitialProjectSlug();
    if (initialSlug) {
      const target = projectList.querySelector(`[data-project="${CSS.escape(initialSlug)}"]`);
      const href = safeText(target?.getAttribute('href')) || safeText(target?.dataset.projectUrl);
      if (href && href !== '#') {
        navigateToPage('portfolio');
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        navigateToPage('portfolio');
      }
    }
  };

  init();
})();

