# MSD Apartments

Catalogue of seaside apartments for rent and sale. MSD Apartments handles
property rental and selling in cities near the sea since 2019 — seven
apartments in Koszalin by the Baltic Sea and one on Costa del Sol in Spain.

An installable, offline-capable PWA built with React, Vite, Tailwind CSS and
Framer Motion, in white and light blue, with the company's YouTube films woven
through every page.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build (needed to test the PWA)
```

Node 20.19+ or 22.12+ is required by Vite 8.

## What is in here

| Page                    | Route                | Highlights                                                          |
| ----------------------- | -------------------- | ------------------------------------------------------------------- |
| Landing                 | `/`                  | Looping YouTube film behind the hero, animated stats, film reel      |
| Catalogue               | `/apartments`        | Location / offer / capacity filters, animated grid, sorting          |
| Apartment               | `/apartments/:slug`  | Parallax hero, 8-photo gallery with lightbox, both films, booking card |
| About                   | `/about`             | Company story, parallax collage, counters                            |
| Contact                 | `/contact`           | Phone as the loudest element, WhatsApp, e-mail, hours, map, form     |

Everything is bilingual (English / Polish) — the toggle sits in the header and
the choice is remembered in `localStorage`.

## Content you will want to edit

### Company details — `src/data/site.ts`

**The phone number, e-mail, office address and social links are placeholders.**
Replace them before going live; they are used by the header, footer, contact
page, the sticky mobile call bar and every call-to-action.

### Apartments — `src/data/apartments.ts`

One entry per apartment: nickname, bilingual tagline and description, size,
capacity, price, amenities, coordinates and YouTube video ids.

Two entries are marked with a `TODO` because the real names were not available:
the seventh Koszalin apartment (currently **Bryza**) and the Spanish one
(currently **Marina**, placed in Fuengirola). Rename them and adjust
`street`/`coords` when you have the details, and remember to rename the matching
folder under `public/apartments/`.

### Photos — `public/apartments/<slug>/01.jpg … 08.jpg`

See [`public/apartments/README.md`](public/apartments/README.md). Missing
photos degrade gracefully: the first slot borrows a still from the apartment's
film, the rest show a branded placeholder.

### Films

The nine videos from [youtube.com/@msdapartments6010](https://www.youtube.com/@msdapartments6010)
are wired up by id. Each apartment can have a `presentation` and a `pov` film:

| Apartment | Presentation  | POV walkthrough |
| --------- | ------------- | --------------- |
| Żagiel    | `JiDVGROMxqQ` | `lWZSBCnC00s`   |
| Latarnia  | `mC3kKnE5nMQ` | `S_HH_PhOepY`   |
| Łódź      | `sBWYsI9pejg` | `XO3isQPx3Vo`   |
| Promenada | `VETQRa2nhbI` | `lhJNXaWSExc`   |
| Mewa      | —             | `6-MAlsbBHlE`   |
| Fala, Bryza, Marina | — | — |

Missing films show a "being edited" card instead of an empty space. Add new
ones by pasting the id into the `videos` object — the film reel on the landing
page, the counters and the apartment pages all pick it up automatically.

### Copy — `src/i18n/dictionary.ts`

Every string on the site, in `en` and `pl`. Keys are typed, so a missing
translation is a compile error.

## Architecture

```
src/
  components/
    apartments/   apartment card and amenity icons
    layout/       header, footer, page shell, mobile call bar
    media/        YouTube background, lightbox, facade embeds, photo gallery
    pwa/          install and update prompts
    ui/           animation and layout primitives
  data/           apartments and company details
  i18n/           locale provider and the full dictionary
  lib/            formatting, hooks, YouTube helpers
  pages/          one file per route
```

### Notes on the media handling

- **Films are never eagerly embedded.** Cards and grids render a still frame
  and only swap in the real player on click, so nine videos cost nothing until
  someone wants to watch one.
- **The hero plays a muted, looping film** and rotates through the four
  presentation videos every 40 seconds. On phones and for visitors who prefer
  reduced motion it falls back to a still, since mobile browsers block
  background video anyway.
- **YouTube only stores 4:3 stills for most of these uploads**, padded with
  black bars. `isLetterboxed()` in `src/lib/youtube.ts` detects those and the
  image is zoomed by 4/3 so the bars fall outside the frame.

### PWA

`vite-plugin-pwa` generates the service worker and manifest. Google Fonts,
YouTube thumbnails and apartment photos get their own runtime caches. The
install prompt appears six seconds after the browser offers it and is not shown
again once dismissed. Test it with `npm run build && npm run preview` — the
service worker does not run under `npm run dev`.

The icons in `public/icons/` are generated from the company logo
(`public/logo.png`, cropped to `public/logo-mark.png` for the header).

### Contact form

There is no backend yet: the form composes a message and hands it to the
visitor's mail client. Point it at a real endpoint (Formspree, Resend, a small
serverless function) in `ContactPage.tsx` when one exists.

## Deployment

Any static host works. The app uses client-side routing, so rewrite all
unmatched paths to `index.html`:

- **Netlify** — `/*  /index.html  200`
- **Vercel** — `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
- **Nginx** — `try_files $uri $uri/ /index.html;`
