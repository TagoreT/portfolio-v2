# Tagore Athikela — Personal Portfolio

A responsive personal portfolio built with **HTML + CSS + JavaScript**, designed as a single-page experience.

## Key features

- **Single-page navigation** (About / Resume / Portfolio / Contact)
- **Mobile-first responsive layout**
- **Data-driven sections** (Resume + Portfolio) powered by `data/profile-context.json`
- **Config-driven UI labels & portfolio mapping** via `assets/js/site-config.js`
- **Works on simple static hosting** (no build step required)

## Project structure

```txt
personal-portfolio/
  index.html
  assets/
    css/
    images/
    js/
      script.js              # UI interactions (sidebar, filters, navigation)
      profile-context.js     # Renders About/Resume from profile context (JSON or window fallback)
      portfolio-context.js   # Builds Portfolio grid from profile context + siteConfig
      site-config.js         # Central config (labels, GitHub username, portfolio metadata)
  data/
    profile-context.json     # Primary content source (recommended)
    profile-context.data.js  # Auto-generated fallback for file:// usage (window.profileContext)
  website-demo-image/
```

## Run locally

You can open `index.html` directly, but **some browsers block `fetch()` on local files**. The project includes a fallback (`data/profile-context.data.js`) to avoid that — however, the most reliable approach is to serve it locally.

### Code Live Server

- Open the folder `personal-portfolio/`
- Start Live Server on `index.html`

## Customize content (no hardcoding workflow)

This repo is set up so **content lives in `data/` and configuration lives in `assets/js/site-config.js`**.

### 1) Update profile/resume data

- **Edit**: `data/profile-context.json`
- **Used by**: `assets/js/profile-context.js` (and `assets/js/portfolio-context.js` for projects)

If you want the site to also work cleanly when opened via `file://`, regenerate/update:

- `data/profile-context.data.js` (it sets `window.profileContext`)

### 2) Update portfolio behavior & labels

- **Edit**: `assets/js/site-config.js`
- Common changes:
  - GitHub username + URLs (`window.siteConfig.github`)
  - Skill group labels/icons (`window.siteConfig.skills.groups`)
  - Portfolio categories, ordering, labels (`window.siteConfig.portfolio.*`)
  - Per-project metadata (URL, image, subtitle) (`window.siteConfig.portfolio.projects`)

### 3) Update assets

- **Images**: `assets/images/` (avatar, project thumbnails, icons)
- **Resume PDF**: `assets/tagore-resume.pdf` (replace with your latest resume)

## Deploy

Because it’s static, you can deploy almost anywhere:

- **GitHub Pages**: push and enable Pages for the repo (serve from root or `/docs`)
- **Netlify / Vercel**: import repo and deploy as a static site (no build command required)
