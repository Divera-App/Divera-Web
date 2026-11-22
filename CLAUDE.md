# Divera Web — Repo Context

Marketing landing page (`divera.app`) and Supabase auth-callback pages.

## Stack

- Static HTML + CSS only. **No build step.** No framework, no bundler, no JS framework.
- Served by a **Cloudflare Worker** with static assets from `landing/` (`wrangler.jsonc`). Every push to `main` auto-deploys.
- Local preview: `cd landing && python3 -m http.server 8765` (pages load shared `/site.css`, `/site.js`, `/i18n.js`, so `file://` does not work).

## Structure

```
landing/
  index.html          # Home: hero, AI block, partner strip, feature cards → /app/, CTA, contact
  app/                # App features: one showcase per feature (#registro, #comunidad, #especies, #sitios, #planificar, #perfil, #web)
  ciencia/            # Citizen science: partners, "Qué reconoce Divera", manifesto
  centros/            # Dive-centre pitch (own dictionary + shared nav keys)
  site.css            # Shared styles for /, /app/, /ciencia/
  site.js             # Shared nav, lang switcher, reveal, per-page title/description
  i18n.js             # Shared es/en/fr/ca dictionary (one key per text)
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

- **Short home, topic pages.** The home stays short (~6 desktop screens); feature detail goes in `/app/`, science in `/ciencia/`, dive centres in `/centros/`. Tell each topic once: link to the page that owns it instead of repeating it. A new page needs a sitemap entry, canonical, hreflang and og tags, and the shared nav/footer.
- **Shared CSS/JS.** Put styles in `site.css` and texts in `i18n.js` (all 4 languages); never copy the dictionary or styles inline into a page.
- **Old anchors redirect.** Old home anchors (`/#ordenador`, `#species`, …) are mapped to the new pages in `site.js`; keep the map when renaming anchors.
- **Reuse existing assets** in `landing/` (logos, screenshots, fonts) before adding new ones. Inventory: hero backgrounds (`hero-*.jpg`), app screenshots (`screen-*.png/PNG`), brand logos (`divera-logo*.png`, `logo-full.png`, `diver-icon*.png`), Galano Grotesque OTF family.
- **Brand voice:** "Life, understood underwater." Match the existing tone in `index.html`.
- **Visual language:** coral-on-dark monochromatic (matches iOS app and Dashboard).
- **No JS frameworks.** Vanilla `<script>` only if absolutely needed. Prefer pure CSS solutions.
- **Image optimization:** screenshots are large; if adding new ones, keep dimensions reasonable and prefer `.png` for UI mocks, `.jpg` for photos.
- **Response headers:** edit `landing/_headers` for cache / security headers (Cloudflare `_headers` syntax).

## What this repo does NOT do

- Does **not** consume the backend API. No fetches, no auth flows beyond rendering Supabase's confirmation redirect.
- Does **not** participate in `/contract-sync`.
- Owned by the `web-engineer` specialist agent; the parent agent edits directly only for trivial copy/asset changes.

## When to touch this repo

- New public-facing app feature that should be advertised on `divera.app`.
- Marketing copy, screenshots, hero updates, privacy/legal page updates.
- Auth-callback HTML changes (only if Supabase redirect contract changes).
- Sitemap / robots / Cloudflare headers.

## Workflow

1. Edit files directly. No install, no build, no lint.
2. Serve `landing/` locally and check `/`, `/app/`, `/ciencia/`, `/centros/` in each language (`?lang=en|es|fr|ca`).
3. Commit + push to `main` → Cloudflare auto-deploys.
4. Verify on `divera.app` after deploy.
