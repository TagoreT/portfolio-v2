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
})();

