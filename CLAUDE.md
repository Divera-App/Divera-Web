# Divera Web — Repo Context

Marketing landing page (`divera.app`) and Supabase auth-callback pages.

## Stack

- Static HTML + CSS only. **No build step.** No framework, no bundler, no JS framework.
- Hosted on **Cloudflare Pages**. Every push to `main` auto-deploys.
- Local preview: open `landing/index.html` directly in a browser.

## Structure

```
landing/
  index.html          # Single-page marketing site for divera.app
  privacy/            # Privacy policy
  *.png / *.jpg       # Hero images, app screenshots, logos
  *.otf               # Galano Grotesque font files
  sitemap.xml
  robots.txt
  _headers            # Cloudflare Pages response headers
auth/
  confirm.html        # Supabase email-confirmation landing page
wrangler.jsonc        # Cloudflare config
```

## Conventions

- **Single-page landing.** Add new sections to `landing/index.html` rather than creating new HTML files. Fragmenting into separate pages breaks the SPA-like marketing flow and forces sitemap maintenance.
- **Reuse existing assets** in `landing/` (logos, screenshots, fonts) before adding new ones. Inventory: hero backgrounds (`hero-*.jpg`), app screenshots (`screen-*.png/PNG`), brand logos (`divera-logo*.png`, `logo-full.png`, `diver-icon*.png`), Galano Grotesque OTF family.
- **Brand voice:** "Life, understood underwater." Match the existing tone in `index.html`.
- **Visual language:** coral-on-dark monochromatic (matches iOS app and Dashboard).
- **No JS frameworks.** Vanilla `<script>` only if absolutely needed. Prefer pure CSS solutions.
- **Image optimization:** screenshots are large; if adding new ones, keep dimensions reasonable and prefer `.png` for UI mocks, `.jpg` for photos.
- **Response headers:** edit `landing/_headers` for cache / security headers (Cloudflare Pages syntax).

## What this repo does NOT do

- Does **not** consume the backend API. No fetches, no auth flows beyond rendering Supabase's confirmation redirect.
- Does **not** participate in `/contract-sync`.
- Does **not** have a dedicated `web-engineer` specialist agent. Cross-repo planner uses `general-purpose` scoped to `Divera-Web/`, or the parent agent edits directly for trivial copy/asset changes.

## When to touch this repo

- New public-facing app feature that should be advertised on `divera.app`.
- Marketing copy, screenshots, hero updates, privacy/legal page updates.
- Auth-callback HTML changes (only if Supabase redirect contract changes).
- Sitemap / robots / Cloudflare headers.

## Workflow

1. Edit files directly. No install, no build, no lint.
2. Open `landing/index.html` in a browser to preview.
3. Commit + push to `main` → Cloudflare auto-deploys.
4. Verify on `divera.app` after deploy.
