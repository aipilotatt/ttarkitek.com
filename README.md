# Arkitek Tan & Tan Sdn Bhd — Website

**Design. Purpose. People.**

Static website (HTML / CSS / JS — no build step, no dependencies).

## Pages
| File | Page |
|------|------|
| `index.html` | Home — photo-carousel hero, services, featured projects, philosophy, values |
| `about.html` | About the studio |
| `services.html` | Services |
| `projects.html` | Projects (11, filterable by type) |
| `contact.html` | Contact |

Nav: Projects · About · Services · Contact. (Insights/journal deliberately omitted
until there's content — an empty blog costs more credibility than it earns.)

## View it locally
Double-click `index.html` — it opens in any browser. No server needed.

## Adding real project images
1. Drop photos into `assets/img/projects/` (JPG or WebP; portrait ~1200×1500 for the
   project cards, landscape ~2400×1350 for the hero).
2. **Project cards** (`projects.html`, `index.html`) — inside a card, change:
   ```html
   <div class="project__media project__media--ph">
   ```
   to
   ```html
   <div class="project__media">
     <img src="assets/img/projects/m-resort-hotel.jpg" alt="M Resort Hotel" loading="lazy" />
   ```
3. **Hero slides** (`index.html`) — replace each
   `<div class="hero__slide hero__slide--ph"></div>` with
   `<div class="hero__slide"><img src="assets/img/hero-1.jpg" alt="…" /></div>`
   (keep `is-active` on the first one).
4. **Feature strip** (`index.html`) — drop the `feature-strip--ph` class and add an `<img>`.
5. **Locations** — replace each `.project__place` text with the project's location.

The `--ph` classes are warm tonal placeholders. Removing them and adding an `<img>`
is all that's needed — no CSS changes.

## Brand
**Palette** — 90% neutral / ~8% Wood / 2% Deep Teal signature:

| Purpose | Name | Hex |
|---|---|---|
| Darkest / dark bands | Onyx | `#111111` |
| Primary text | Charcoal | `#333333` |
| Hairlines & dividers | Stone | `#B9B6B1` |
| Panel fills | Sand | `#DCD6CB` |
| Structural accent | Wood | `#A87C5A` |
| Signature accent (2%) | Deep Teal | `#0F766E` |
| Page ground *(derived)* | Paper | `#F7F5F1` |
| Caption text *(derived)* | Muted | `#6B6560` |

Two colours are **derived, not from the board**: `Paper` (a warm off-white page ground
tinted from Sand — the board has no white) and `Muted` (caption text; Stone `#B9B6B1`
fails accessibility contrast as text at ~1.9:1, so it's used only for hairlines).
Deep Teal appears in exactly two places site-wide, by design.

The cool set from the earlier brand kit (Graphite/Steel Blue) is reserved for the
AI dashboard / product UI — it is not used on this site.

**Fonts** — headings use **Neue Haas Grotesk**. It's a *licensed commercial font*, not
on Google Fonts, so the stack falls back to **Helvetica Neue → Arial** (a close match —
Neue Haas is the basis of Helvetica). Buy a webfont licence and self-host the files and
it's already first in the stack. Body/UI = **Inter** (Google Fonts). No mono face is
used on the marketing site.

All tokens live in the `:root` block at the top of `assets/css/styles.css`.

## Still to add
- Project photography and locations (placeholders in place).
- Studio street address (Contact shows "address to follow").
- Contact form is front-end only — needs Formspree/Netlify Forms to actually send.
- A real domain (the brand board's `arkitantt.com.my` was mockup filler).

## Deploying (free)
- **Netlify** or **Cloudflare Pages**: drag-and-drop this folder.
- **GitHub Pages**: push to a repo, enable Pages.

## Design notes
- Fully responsive, keyboard-accessible, respects `prefers-reduced-motion`
  (the hero carousel does not autoplay for users who ask for reduced motion).
- Hero carousel: 3 slides, click indicators, auto-advances every 6s, pauses on hover.
