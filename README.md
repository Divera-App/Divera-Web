# Divera Web

Landing page and static web assets for [divera.app](https://divera.app) — *Life, understood underwater.*

Divera is a diving companion app that lets you log dives, identify marine species with AI, and explore underwater life.

## Structure

```
├── landing/        # Main landing page (served at divera.app)
│   └── index.html
└── auth/           # Auth flow pages
    └── confirm.html
```

## Hosting

Deployed on **Cloudflare Pages** via GitHub integration.
Every push to `main` triggers an automatic deployment.

## Local Preview

No build step required. Open `landing/index.html` directly in a browser.
