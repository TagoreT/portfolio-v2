(() => {
  'use strict';

  window.siteConfig = window.siteConfig ?? {};

  window.siteConfig.github = {
    username: 'TagoreT',
    urls: {
      profile: 'https://github.com/TagoreT',
      repositories: 'https://github.com/TagoreT?tab=repositories',
    },
    uiText: {
      activityTitle: 'GitHub activity',
      activitySubtitle: 'Last 12 months of contributions',
      legendLess: 'Less',
      legendMore: 'More',
    },
  };

  window.siteConfig.skills = {
    groups: [
      { key: 'webDevelopment', label: 'Web Development', icon: 'layers-outline' },
      { key: 'programmingLanguages', label: 'Languages', icon: 'code-slash-outline' },
      { key: 'mobileDevelopment', label: 'Mobile', icon: 'phone-portrait-outline' },
      { key: 'backendAndDatabases', label: 'Backend & Databases', icon: 'server-outline' },
      { key: 'cloudAndInfra', label: 'Cloud & Infra', icon: 'cloud-outline' },
      { key: 'platforms', label: 'Platforms', icon: 'cloud-outline' },
      { key: 'devTools', label: 'Dev Tools', icon: 'hammer-outline' },
      { key: 'concepts', label: 'Concepts', icon: 'sparkles-outline' },
    ],
  };

  window.siteConfig.portfolio = {
    uiText: {
      title: 'Portfolio',
      allLabel: 'All',
      selectPlaceholder: 'Select category',
      openProjectLabel: 'Open project',
      previewUnavailableLabel: 'Preview not available. Open project.',
    },
    embed: {
      enabled: false,
      sandbox: 'allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation',
      referrerPolicy: 'no-referrer',
      loading: 'eager',
      viewport: {
        width: 1280,
        height: 720,
      },
    },
    categoryLabels: {
      web: 'Web',
      ui: 'UI / UX',
      academic: 'Academic',
      project: 'Projects',
    },
    categoryOverrides: {
      portfolioAndClientWork: 'projects',
      academic: 'academic',
    },
    categoryOrder: ['projects', 'web', 'ui', 'project', 'academic'],
    fallbackUrl: window.siteConfig?.github?.urls?.repositories ?? 'https://github.com',
    projects: {
      'Biosure Lab Landing Page': { url: 'https://biosure.vercel.app/', image: './assets/images/projects/biosure.png', subtitle: '' },
      'Lavish Mandi Restaurant': { url: 'https://lavish-mandi.vercel.app/', image: './assets/images/projects/lavish-mandi.png', subtitle: '' },
      'QR Code Generator': { url: 'https://qr-code-generator-seven-nu.vercel.app/', image: './assets/images/projects/qr-code-generator.png', subtitle: '' },
      'QR Menu Manager': { url: 'https://qr-menu-tan.vercel.app/login', image: './assets/images/projects/qr-menu-manager.png', subtitle: '' },
      'Hyderabad Tattoo Studio': { url: 'https://tattoo-studio-gold.vercel.app/', image: './assets/images/projects/hyderabad-tattoo-studio.png', subtitle: '' },
      'ServiceNow UX Services': { url: 'https://servicesnow-ux.vercel.app/', image: './assets/images/projects/servicenow-ux-services.png', subtitle: '' },
      'Money Lender Project': { url: 'https://v0-moneylender-application.vercel.app/', image: './assets/images/projects/money-lender-project.png', subtitle: '' },
      'ElectroBike Landing Page': { url: 'https://electrobike-landing.vercel.app/', image: './assets/images/projects/electrobike.png', subtitle: '' },
      'Toola Product': { url: 'https://toola-landing-page.vercel.app/', image: './assets/images/projects/toola-product.png', subtitle: '' },
      'EduCon': { url: 'https://educon-three.vercel.app/', image: './assets/images/projects/educon.png', subtitle: '' },
      'Viswa Handyman': { url: 'https://viswa-jade.vercel.app/', image: './assets/images/projects/viswa-handyman.png', subtitle: '' },
      'Mandapeta Sweet Mart Landing Page': { url: 'https://mandapetasweetmart.vercel.app/', image: './assets/images/projects/mandapeta-sweet-mart.png', subtitle: '' },
    },
  };

  window.siteConfig.avatar = {
    selector: '[data-avatar-img]',
    images: ['./assets/images/avatar/coder.png', './assets/images/avatar/cooder.webp', './assets/images/avatar/coooder.webp'],
  };
})();

