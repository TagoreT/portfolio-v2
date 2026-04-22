(() => {
  'use strict';

  const qs = (sel, root = document) => root.querySelector(sel);

  const safeText = (value) => (typeof value === 'string' ? value.trim() : '');

  const formatMonthYear = (yyyyMm) => {
    if (!yyyyMm) return '';
    const [y, m] = String(yyyyMm).split('-').map((v) => Number(v));
    if (!y || !m) return String(yyyyMm);
    const date = new Date(Date.UTC(y, m - 1, 1));
    return date.toLocaleString(undefined, { month: 'short', year: 'numeric' });
  };

  const formatRange = (startDate, endDate) => {
    const start = formatMonthYear(startDate);
    const end = endDate ? formatMonthYear(endDate) : 'Present';
    if (!start && !endDate) return '';
    if (!start) return end;
    return `${start} — ${end}`;
  };

  const joinNonEmpty = (items, sep = ' · ') =>
    (Array.isArray(items) ? items : []).map(safeText).filter(Boolean).join(sep);

  const createTimelineItem = ({ title, range, textLines, bodyNode }) => {
    const li = document.createElement('li');
    li.className = 'timeline-item';

    const h4 = document.createElement('h4');
    h4.className = 'h4 timeline-item-title';
    h4.textContent = safeText(title);

    const span = document.createElement('span');
    span.textContent = safeText(range);

    li.append(h4, span);

    if (bodyNode) {
      li.appendChild(bodyNode);
      return li;
    }

    const p = document.createElement('p');
    p.className = 'timeline-text';
    p.textContent = joinNonEmpty(textLines, ' ');
    li.appendChild(p);
    return li;
  };

  const renderEducation = (education, root) => {
    if (!root) return;
    const items = (Array.isArray(education) ? education : []).map((e) => {
      const institution = safeText(e?.institution);
      const degree = safeText(e?.degree) || safeText(e?.degreeShort);
      const grade =
        e?.grade?.type && typeof e?.grade?.value === 'number'
          ? `${safeText(e.grade.type)}: ${e.grade.value}${e.grade.scale ? `/${e.grade.scale}` : ''}`
          : '';

      const title = [degree, institution].filter(Boolean).join(' — ');
      const range = formatRange(e?.startDate, e?.endDate);
      const location = [safeText(e?.state), safeText(e?.country)].filter(Boolean).join(', ');

      const textLines = [
        [location, grade].filter(Boolean).join(' • '),
      ].filter(Boolean);

      return createTimelineItem({ title, range, textLines });
    });

    root.replaceChildren(...items);
  };

  const renderExperience = (experience, root) => {
    if (!root) return;
    const items = (Array.isArray(experience) ? experience : []).map((x) => {
      const role = safeText(x?.role);
      const company = safeText(x?.company);
      const title = [role, company].filter(Boolean).join(' — ');
      const range = formatRange(x?.startDate, x?.endDate);

      const highlights = (Array.isArray(x?.highlights) ? x.highlights : [])
        .map(safeText)
        .filter(Boolean)
        .slice(0, 4);
      const stack = joinNonEmpty(x?.stack);
      const tools = joinNonEmpty(x?.tools);

      const body = document.createElement('div');
      body.className = 'timeline-body';

      if (highlights.length) {
        const ul = document.createElement('ul');
        ul.className = 'timeline-bullets';
        highlights.forEach((h) => {
          const li = document.createElement('li');
          li.textContent = h;
          ul.appendChild(li);
        });
        body.appendChild(ul);
      }

      const metaParts = [
        stack ? `Stack: ${stack}` : '',
        tools ? `Tools: ${tools}` : '',
      ].filter(Boolean);

      if (metaParts.length) {
        const p = document.createElement('p');
        p.className = 'timeline-meta';
        p.textContent = metaParts.join(' • ');
        body.appendChild(p);
      }

      return createTimelineItem({ title, range, bodyNode: body });
    });

    root.replaceChildren(...items);
  };

  const renderAchievements = (achievements, root) => {
    if (!root) return;
    const items = (Array.isArray(achievements) ? achievements : []).map((a) =>
      createTimelineItem({
        title: 'Highlight',
        range: '',
        textLines: [safeText(a)],
      }),
    );
    root.replaceChildren(...items);
  };

  const renderSkills = (skills, root) => {
    if (!root) return;

    const configGroups = window.siteConfig?.skills?.groups;
    const groups = Array.isArray(configGroups)
      ? configGroups
      : [
        { key: 'webDevelopment', label: 'Web Development', icon: 'layers-outline' },
        { key: 'programmingLanguages', label: 'Languages', icon: 'code-slash-outline' },
        { key: 'backendAndDatabases', label: 'Backend & Databases', icon: 'server-outline' },
        { key: 'devTools', label: 'Dev Tools', icon: 'hammer-outline' },
        { key: 'platforms', label: 'Platforms', icon: 'cloud-outline' },
        { key: 'concepts', label: 'Concepts', icon: 'sparkles-outline' },
      ];

    const header = document.createElement('div');
    header.className = 'title-wrapper';

    const h5 = document.createElement('h5');
    h5.className = 'h5';
    h5.textContent = 'Tech Toolkit';
    header.appendChild(h5);

    const grid = document.createElement('div');
    grid.className = 'skill-groups';

    groups.forEach(({ key, label, icon }) => {
      const items = (Array.isArray(skills?.[key]) ? skills[key] : []).map(safeText).filter(Boolean);
      if (!items.length) return;

      const card = document.createElement('div');
      card.className = 'skill-group';

      const cardHeader = document.createElement('div');
      cardHeader.className = 'skill-group-header';

      const iconBox = document.createElement('span');
      iconBox.className = 'skill-group-icon';
      const ion = document.createElement('ion-icon');
      ion.setAttribute('name', safeText(icon) || 'ellipse-outline');
      iconBox.appendChild(ion);

      const title = document.createElement('div');
      title.className = 'skill-group-title';
      title.textContent = safeText(label);

      cardHeader.append(iconBox, title);

      const tags = document.createElement('div');
      tags.className = 'skill-tags';
      items.forEach((t) => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = t;
        tags.appendChild(tag);
      });

      card.append(cardHeader, tags);
      grid.appendChild(card);
    });

    root.replaceChildren(header, grid);
  };

  const renderSummary = (summary, rootSection, rootText) => {
    if (!rootSection || !rootText) return;
    const s = safeText(summary);
    if (!s) return;
    rootText.textContent = s;
    rootSection.hidden = false;
  };

  const renderAbout = (data, aboutRoot) => {
    if (!aboutRoot) return;
    const nodes = Array.from(aboutRoot.querySelectorAll('[data-about-paragraph]'));
    if (!nodes.length) return;

    const paragraphs = Array.isArray(data?.person?.about?.paragraphs)
      ? data.person.about.paragraphs.map(safeText).filter(Boolean)
      : [];

    const fallback = safeText(data?.person?.summary) ? [safeText(data?.person?.summary)] : [];
    const content = paragraphs.length ? paragraphs : fallback;
    if (!content.length) return;

    nodes.forEach((node, idx) => {
      const text = content[idx] ?? '';
      node.textContent = text;
      node.toggleAttribute('hidden', !text);
    });
  };

  const renderServices = (data, aboutRoot) => {
    if (!aboutRoot) return;
    const list = qs('[data-service-list]', aboutRoot);
    if (!list) return;

    const servicesRaw = Array.isArray(data?.person?.services) ? data.person.services : [];
    const services = servicesRaw
      .map((s) => ({
        key: safeText(s?.key),
        title: safeText(s?.title),
        description: safeText(s?.description),
        icon: safeText(s?.icon),
        iconAlt: safeText(s?.iconAlt),
      }))
      .filter((s) => s.title && s.description)
      .slice(0, 6);

    if (!services.length) return;

    const items = services.map((s) => {
      const li = document.createElement('li');
      li.className = 'service-item';

      const iconBox = document.createElement('div');
      iconBox.className = 'service-icon-box';

      const img = document.createElement('img');
      img.src = s.icon || './assets/images/icon-dev.svg';
      img.alt = s.iconAlt || s.title;
      img.width = 40;
      img.loading = 'lazy';
      iconBox.appendChild(img);

      const contentBox = document.createElement('div');
      contentBox.className = 'service-content-box';

      const h4 = document.createElement('h4');
      h4.className = 'h4 service-item-title';
      h4.textContent = s.title;

      const p = document.createElement('p');
      p.className = 'service-item-text';
      p.textContent = s.description;

      contentBox.append(h4, p);
      li.append(iconBox, contentBox);
      return li;
    });

    list.replaceChildren(...items);
  };

  const renderSidebar = (data) => {
    const nameNode = qs('[data-person-name]');
    const headlineNode = qs('[data-person-headline]');
    const emailNode = qs('[data-contact-email]');
    const phoneNode = qs('[data-contact-phone]');
    const birthdayNode = qs('[data-contact-birthday]');
    const locationNode = qs('[data-contact-location]');

    const person = data?.person ?? {};
    const contact = data?.contact ?? {};

    const fullName = safeText(person?.fullName);
    const headline = safeText(person?.headline);
    const email = safeText(contact?.email);
    const phoneE164 = safeText(contact?.phone?.e164);
    const phoneDisplay = safeText(contact?.phone?.display) || phoneE164;
    const location = [safeText(contact?.location?.city), safeText(contact?.location?.state), safeText(contact?.location?.country)]
      .filter(Boolean)
      .join(', ');

    if (nameNode && fullName) nameNode.textContent = fullName;
    if (headlineNode && headline) headlineNode.textContent = headline;

    if (emailNode && email) {
      emailNode.textContent = email;
      emailNode.setAttribute('href', `mailto:${email}`);
    }

    if (phoneNode && (phoneE164 || phoneDisplay)) {
      phoneNode.textContent = phoneDisplay || phoneE164;
      if (phoneE164) phoneNode.setAttribute('href', `tel:${phoneE164}`);
    }

    const birthdayIso = safeText(data?.person?.birthday?.iso) || safeText(data?.person?.birthday);
    const birthdayDisplay = safeText(data?.person?.birthday?.display) || '';
    if (birthdayNode && (birthdayIso || birthdayDisplay)) {
      if (birthdayIso) birthdayNode.setAttribute('datetime', birthdayIso);
      if (birthdayDisplay) birthdayNode.textContent = birthdayDisplay;
    }

    if (locationNode && location) locationNode.textContent = location;
  };

  const init = async () => {
    const about = qs('[data-page="about"]');
    const resume = qs('[data-page="resume"]');
    if (!about && !resume) return;

    try {
      const data =
        window.profileContext ??
        (await (async () => {
          const res = await fetch('./data/profile-context.json', { cache: 'no-store' });
          if (!res.ok) return null;
          return await res.json();
        })());
      if (!data) return;

      renderSidebar(data);
      renderAbout(data, about);
      renderServices(data, about);

      if (resume) {
        renderSummary(
          data?.person?.summary,
          qs('[data-resume-summary]', resume),
          qs('[data-resume-summary-text]', resume),
        );
        renderEducation(data?.education, qs('[data-resume-education]', resume));
        renderExperience(data?.experience, qs('[data-resume-experience]', resume));
        renderAchievements(data?.achievements, qs('[data-resume-achievements]', resume));
        renderSkills(data?.skills, qs('[data-resume-skills]', resume));
      }
    } catch {
      // noop: resume can remain empty if fetch fails
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

