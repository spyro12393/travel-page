# Travel Page — Design & Architecture Document

> **Purpose:** Authoritative reference for the codebase. Read this to fully catch up in a new session before touching any file.

---

## 1. Project Overview

A static travel-itinerary website for a **6-day Japan trip (Nagoya, April 16–21 2026)**.
Deployed to **GitHub Pages** at `https://spyro12393.github.io/travel-page`.

Every day shows:
- Weather forecast (Open-Meteo, no key)
- An interactive Google Map with route polyline
- A timeline of activities with business hours, transit durations, and Google Maps links
- Buffer schedule chips (T-2 … T+2) for every public-transport leg

Global features: pre-departure checklist, live JPY → TWD/USD currency converter, animated falling cherry blossom petals.

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 13.5.6** — App Router, `output: 'export'` (fully static) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 3.4** with custom `journal` and `japan` colour tokens |
| Maps | **Google Maps JS API** via `@googlemaps/js-api-loader ^1.16.8` |
| Weather | **Open-Meteo** REST API (no key, free) |
| Currency | **open.er-api.com** REST API (no key, free) |
| Hosting | **GitHub Pages** — deployed by GitHub Actions on every push to `main` |
| Node | **18.16.x** (constraint: Next.js 14+ requires ≥ 18.17, so pinned to 13.x) |

---

## 3. Repository Layout

```
travel-page/
├── .github/
│   └── workflows/deploy.yml      # CI: build → upload → deploy-pages
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind directives + cream body bg + sakura-fall keyframe
│   │   ├── layout.tsx             # HTML shell, metadata
│   │   └── page.tsx               # Root page — assembles hero, nav, Checklist, CurrencyConverter, DaySections
│   ├── components/
│   │   ├── ActivityCard.tsx       # Single timeline card — hours, transit time, map link, TransitBufferBadge
│   │   ├── Checklist.tsx          # Interactive pre-departure checklist (client)
│   │   ├── CurrencyConverter.tsx  # Live JPY→TWD/USD widget (client)
│   │   ├── DayMap.tsx             # Google Maps per-day instance (client)
│   │   ├── DayNav.tsx             # Sticky scrollspy day-navigation tabs (client)
│   │   ├── DaySection.tsx         # One day: header card + WeatherWidget + DayMap + timeline
│   │   ├── Petals.tsx             # 12 CSS-animated falling sakura petals (client)
│   │   ├── TransitBufferBadge.tsx # T-2…T+2 departure chips
│   │   └── WeatherWidget.tsx      # Open-Meteo forecast for one day (client)
│   ├── data/
│   │   └── itinerary.ts           # All trip data — single source of truth
│   └── lib/
│       └── googleMapsLoader.ts    # Singleton Loader — prevents double script injection
├── .env.local.example             # Documents required env vars
├── next.config.js                 # basePath '/travel-page', output 'export', trailingSlash
├── tailwind.config.ts             # journal + japan colour tokens
└── DESIGN.md                      # This file
```

---

## 4. Design System

### 4.1 Colour Palette — `journal` (cream)

| Token | Hex | Usage |
|-------|-----|-------|
| `journal-50` | `#FDFAF4` | Hover backgrounds, lightest fill |
| `journal-100` | `#F7F2EA` | **Body background** |
| `journal-200` | `#EFE5D2` | Card borders, dividers |
| `journal-300` | `#E2D1B8` | Timeline line, input borders |
| `journal-400` | `#CFBA98` | Muted decorative elements |
| `journal-500` | `#B09278` | Muted / secondary text |
| `journal-600` | `#8D6F55` | Body text, labels |
| `journal-700` | `#6B5040` | Medium headings |
| `journal-800` | `#4A3328` | Section headings |
| `journal-900` | `#2D1E14` | Primary / dark text |

### 4.2 Accent Palette — `japan`

| Token | Hex | Usage |
|-------|-----|-------|
| `japan-red` | `#9B2C2C` | Primary CTA, active nav tab, booked transit chip, checklist check |
| `japan-darkred` | `#7A1F1F` | Hero gradient mid-stop |
| `japan-navy` | `#1C2951` | Hero gradient end |
| `japan-gold` | `#B5832A` | (available for future use) |
| `japan-sage` | `#6B8F71` | (available for future use) |
| `japan-sakura` | `#F0B8C8` | (available for future use) |

### 4.3 Activity-Category Colours (ActivityCard)

Each category has a `bg-*-50 / text-*-700 / border-*-200 / dot-*` set:

| Category | Colour family | Dot |
|----------|--------------|-----|
| `flight` | sky | `bg-sky-400` |
| `transport` | violet | `bg-violet-400` |
| `food` | orange | `bg-orange-400` |
| `attraction` | emerald | `bg-emerald-500` |
| `shopping` | rose | `bg-rose-400` |
| `hotel` | indigo | `bg-indigo-400` |
| `task` | amber | `bg-amber-500` |

### 4.4 Background Texture

`globals.css` sets `body` to a 220 × 220 px repeating SVG tile of scattered cherry-blossom petals (muted pink `#E8A0B0` and sage-green `#A8C8A0` touches) on the cream base. The `sakura-fall` CSS keyframe animates 12 fixed-position `<div>` petals via the `Petals` client component.

### 4.5 Day-Header Gradients (stored in data)

Each `DayItinerary.gradient` is a Tailwind class pair used as `bg-gradient-to-r ${gradient}`:

| Day | Gradient |
|-----|----------|
| 1 | `from-red-700 to-rose-500` |
| 2 | `from-orange-500 to-amber-400` |
| 3 | `from-sky-600 to-blue-400` |
| 4 | `from-emerald-600 to-teal-400` |
| 5 | `from-violet-600 to-purple-400` |
| 6 | `from-slate-700 to-slate-500` |

---

## 5. Data Model (`src/data/itinerary.ts`)

```typescript
type ActivityCategory = 'flight' | 'transport' | 'food' | 'attraction' | 'shopping' | 'hotel' | 'task'

interface TransitSchedule {
  line: string          // Display name of the transit line
  departures: string[]  // Ordered JST times, e.g. ["08:43", "09:43", ...]
  bookedIndex: number   // 0-based index of the reserved slot
}

interface Activity {
  time?: string         // Display time range, e.g. "08:43 – 11:00"
  icon: string          // Emoji
  title: string
  subtitle?: string
  mapQuery?: string     // Passed to Google Maps search URL
  category: ActivityCategory
  lat?: number          // WGS-84 — used by DayMap
  lng?: number
  businessHours?: string  // e.g. "09:00–17:00（火曜休）"
  transitMinutes?: number // Travel time FROM the previous activity (non-transport only)
  schedule?: TransitSchedule
}

interface DayItinerary {
  day: number
  date: string          // "04.16"
  weekday: string       // "四"
  theme: string
  themeIcon: string
  gradient: string      // Tailwind gradient class pair
  activities: Activity[]
  weatherLat: number    // Representative lat for Open-Meteo query
  weatherLng: number
  weatherLocation: string  // Display name for weather label
}
```

`checklist` is a plain `{ id, icon, text }[]` array in the same file.

---

## 6. Component Reference

### `page.tsx` (Server Component)
Top-level layout. Renders:
`<Petals>` → `<header>` (hero) → `<DayNav>` → `<main>` containing `<Checklist>` + `<CurrencyConverter>` + `<DaySection>` × 6.

### `DaySection.tsx` (Server Component)
Receives a full `DayItinerary`. Filters activities to `MapPoint[]` (those with `lat`/`lng`), then renders:
`<WeatherWidget>` → `<DayMap>` → `<ActivityCard>` timeline.

### `ActivityCard.tsx` (Server Component)
Renders one activity. Shows:
1. Travel-time pill (`transitMinutes`) if category ≠ `transport`
2. Icon + time + title + subtitle
3. Business hours (`businessHours`)
4. Google Maps link button (`mapQuery`)
5. `<TransitBufferBadge>` if `schedule` is present

### `TransitBufferBadge.tsx` (Server Component)
Slices `departures[bookedIndex-2 … bookedIndex+2]` (clamped), renders labelled chips. The booked chip uses `bg-japan-red`.

### `DayMap.tsx` (Client Component)
- Calls `getGoogleMaps()` (singleton) on mount.
- Uses `window.google.maps.Map` with `MAP_STYLE` (cream paper look).
- Places numbered circle markers coloured by `ActivityCategory`.
- Draws a `Polyline` (colour `#9B2C2C`, opacity 0.55) through all points in order.
- Shows a `journal-100` placeholder card when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is absent.

### `WeatherWidget.tsx` (Client Component)
- Fetches `https://api.open-meteo.com/v1/forecast?…&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` on mount.
- Converts `"04.16"` → `"2026-04-16"` internally.
- Decodes WMO codes via a local lookup table (codes 0–99 covered).
- Shows loading skeleton → weather card, or returns `null` on error.

### `CurrencyConverter.tsx` (Client Component)
- Fetches `https://open.er-api.com/v6/latest/JPY` on mount (free tier, ~1500 req/month).
- Input: JPY amount (number). Quick buttons: ¥1,000 / ¥3,000 / ¥5,000 / ¥10,000.
- Outputs: NT$ TWD and $ USD.
- Shows loading skeleton and silently ignores fetch errors.

### `DayNav.tsx` (Client Component)
Sticky top navbar. Uses `IntersectionObserver` (`rootMargin: '-64px 0px -55% 0px'`) to track the active day as the user scrolls. Clicking a tab calls `scrollIntoView({ behavior: 'smooth' })`.

### `Checklist.tsx` (Client Component)
Three-item interactive checklist. Uses `useState<Set<number>>`. Checked items get `line-through text-journal-400`; all-checked shows a green "準備完成！" badge.

### `Petals.tsx` (Client Component)
Renders 12 `position: fixed` petal divs, each driven by `animation: sakura-fall Xs linear Ys infinite` (delay, duration, size vary per petal). Uses negative delays so petals are visible immediately on load. `pointer-events: none`, `z-index: 5` (below sticky nav at z-50, above content cards).

### `googleMapsLoader.ts`
Module-level singleton: creates a `Loader` and caches `loader.load()` as `mapsPromise`. All six `DayMap` instances call `getGoogleMaps()` — only the first invocation injects the `<script>`, subsequent calls return the cached promise.

---

## 7. External API Integrations

| API | Key required | Rate limit | What we use |
|-----|-------------|------------|-------------|
| **Google Maps JS** | **Yes** — `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Billing-based | Map render, Marker, Polyline |
| **Open-Meteo** | No | Generous (no documented cap) | `daily` forecast: `weathercode`, `temperature_2m_max/min` |
| **open.er-api.com** | No | 1,500 requests/month | `GET /v6/latest/JPY` → `rates.TWD`, `rates.USD` |
| **Google Maps Search** | No (URL only) | N/A | `mapQuery` fields open `maps.google.com/maps/search/` |

---

## 8. Deployment

### GitHub Actions (`.github/workflows/deploy.yml`)

1. **build** job: `npm ci` → `npm run build` (env: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` from secret `GOOGLE_MAPS_API_KEY`) → upload `./out` as Pages artifact.
2. **deploy** job: `actions/deploy-pages@v4`.

Triggered on push to `main`. GitHub Pages source must be set to **GitHub Actions** (repo Settings → Pages).

### To add the Google Maps key

1. Go to repo **Settings → Secrets and variables → Actions**.
2. Add secret: Name = `GOOGLE_MAPS_API_KEY`, Value = your key.
3. Push any commit to `main` to trigger a re-deploy.

### Local development

```bash
cp .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
npm run dev          # http://localhost:3000/travel-page
npm run build        # Verify static export to ./out/
```

---

## 9. Known Constraints & Decisions

| Constraint | Reason |
|-----------|--------|
| Next.js **13.5.6** (not 14+) | Local Node is 18.16.1; Next 14 requires ≥ 18.17.0 |
| `output: 'export'` — no SSR | GitHub Pages serves static files only |
| `basePath: '/travel-page'` | Deployed as a project page, not a user page |
| Maps API key is `NEXT_PUBLIC_*` | Must be available in the browser bundle; restrict by HTTP referrer in GCP Console |
| Google Maps polylines are straight-line | Road-routing requires Directions API (paid); straight lines suffice for day overviews |
| Transit schedules are **hardcoded approximations** | Real-time transit data APIs are paid; schedules verified against published JR/Nohi timetables |
| Weather available for all 6 days | Trip is 3–8 days from today (Apr 13); Open-Meteo 16-day forecast covers the full range |

---

## 10. Itinerary Summary (shared across both implementations)

| Day | Date | Base | Key stops |
|-----|------|------|-----------|
| 1 | 04.16 (四) | 名古屋 | Centrair → 犬山城 → 山本屋総本家 → ドンキ |
| 2 | 04.17 (五) | 高山 | JR飛驒 → 坂口屋 → 古い町並み → 丸明 |
| 3 | 04.18 (六) | 高山 | 上高地健行（大正池→河童橋）→ 新穂高ロープウェイ |
| 4 | 04.19 (日) | 名古屋 | 宮川朝市 → 白川郷 → 弁才天大福 |
| 5 | 04.20 (一) | 名古屋 | 喫茶ツヅキ → ジブリパーク → 熱田神宮 → 蓬萊軒 |
| 6 | 04.21 (二) | NGO | μ-SKY → えびせんべいの里 → CI0155 |

Flight: **CI0154** TPE→NGO (07:30–11:20) / **CI0155** NGO→TPE (12:20–14:30)
Hotel nights: **三井花園名古屋普米爾** (D1–D2, D4–D5) · **eph TAKAYAMA** (D2–D3)

---

# Part 2 — PWA Redesign (`pwa/`)

> Added after the Next.js implementation. Deployed from `./pwa` instead of `./out`.
> The Next.js source remains in `src/` for reference but is no longer built or deployed.

---

## 11. PWA Overview

A fully static Progressive Web App that replaces the Next.js deployment.
Same 6-day Japan itinerary, rebuilt with zero build tooling.

Key goals:
- Installable on mobile (manifest + service worker)
- Works offline after first visit
- Earth-tone visual identity — no framework, no bundler
- Visited-place persistence via `localStorage`

---

## 12. PWA Tech Stack

| Layer | Choice |
|-------|--------|
| Reactivity | **Alpine.js 3.14.1** via jsDelivr CDN (`defer`) |
| Styling | Vanilla CSS with **4 CSS custom properties** |
| Maps | URL-based Google Maps links — no API key |
| Weather | **Open-Meteo** REST API (same as Next.js version) |
| Currency | **open.er-api.com** REST API (same as Next.js version) |
| Offline | **service-worker.js** — cache-first for local assets, network-first for APIs |
| Hosting | **GitHub Pages** — `deploy.yml` uploads `./pwa` directly (no build step) |
| Data | `itinerary.json` — converted from `src/data/itinerary.ts` |

---

## 13. PWA File Layout

```
pwa/
├── index.html          # Single-page shell — Alpine x-data="app" template
├── style.css           # All styles; earth-tone CSS variables
├── app.js              # Alpine.data('app') component — all logic
├── itinerary.json      # Full trip data (6 days, checklist)
├── service-worker.js   # PWA offline caching
└── manifest.json       # PWA metadata (name, theme, start_url)
```

Deploy workflow (`.github/workflows/deploy.yml`) was simplified to:
```
checkout → upload-pages-artifact (path: ./pwa) → deploy-pages
```
No `npm ci`, no `npm run build`, no Node.js setup required.

---

## 14. PWA Color Palette (CSS Variables)

The entire UI uses exactly four custom properties — no hardcoded hex values elsewhere.

| Variable | Hex | Usage |
|----------|-----|-------|
| `--bg` | `#F3EEEA` | Page background |
| `--surface` | `#EBE3D5` | Cards, buttons, nav |
| `--accent` | `#B0A695` | Borders, dividers, icons |
| `--text-main` | `#776B5D` | All text — headings, body, labels |

All text (including H1–H3) uses `--text-main`. No white text; all combinations pass WCAG AA contrast against their backgrounds.

Derived values used in the stylesheet:
- `rgba(176, 166, 149, 0.3)` — subtle transport card background tint
- `rgba(119, 107, 93, 0.08)` — hover / pressed state
- Day-header left-border accent stripe (3px solid `--accent`)

---

## 15. PWA Data Model (`itinerary.json`)

The JSON mirrors the TypeScript interfaces from `src/data/itinerary.ts` with two differences:
1. TypeScript types removed (plain JSON objects)
2. `gradient` field removed from `DayItinerary` (no longer used)

Top-level shape:
```json
{
  "checklist": [ { "id": 1, "icon": "📶", "text": "..." } ],
  "days": [ DayItinerary, … ]
}
```

`DayItinerary` fields: `day`, `date`, `weekday`, `theme`, `themeIcon`, `weatherLat`, `weatherLng`, `weatherLocation`, `activities[]`

`Activity` fields: `time?`, `icon`, `title`, `subtitle?`, `mapQuery?`, `category`, `lat?`, `lng?`, `businessHours?`, `transitMinutes?`, `schedule?`

`schedule` shape: `{ line: string, departures: string[], bookedIndex: number }`

---

## 16. Alpine.js Component (`app.js`)

Single `Alpine.data('app', …)` component registered in `app.js` before Alpine loads.

### State
| Property | Type | Purpose |
|----------|------|---------|
| `loading` | `boolean` | Shows spinner until `itinerary.json` resolves |
| `days` | `DayItinerary[]` | Populated from `itinerary.json` |
| `checklist` | `ChecklistItem[]` | Pre-departure items |
| `activeDay` | `number` | Driven by IntersectionObserver scroll-spy |
| `visited` | `{ [id]: boolean }` | Persisted to `localStorage` key `jp26_visited` |
| `checklistDone` | `{ [id]: boolean }` | Persisted to `localStorage` key `jp26_checklist` |
| `weather` | `{ [day]: WeatherData }` | Keyed by day number; null until fetch resolves |
| `jpy` | `number` | JPY input for currency converter |
| `liveRate` | `number \| null` | TWD rate from open.er-api.com |

### Computed
- `effectiveRate` — `liveRate ?? DEFAULT_EXCHANGE_RATE (0.217)`
- `twd` — `Math.round(jpy * effectiveRate)`
- `allChecked` — true when every checklist item is checked

### Key methods
| Method | Description |
|--------|-------------|
| `init()` | Loads JSON, hydrates localStorage, kicks off weather + rate fetches, sets up scroll-spy |
| `fetchWeather(day)` | Open-Meteo one-day forecast; silently swallows errors |
| `fetchExchangeRate()` | `open.er-api.com/v6/latest/JPY`; silently swallows errors |
| `setupScrollSpy()` | `IntersectionObserver` with `rootMargin: -72px 0px -55% 0px` |
| `buildChips(schedule)` | Returns T-2…T+2 chip objects clamped to array bounds |
| `navigateUrl(activity)` | Google Maps Directions URL (`travelmode=transit`) |
| `mapUrl(activity)` | Google Maps Search URL |
| `toggleVisited(id)` | Flips visited state; syncs to localStorage |
| `toggleChecklist(id)` | Flips checklist state; syncs to localStorage |

Activity IDs are stable strings in the form `d{dayNum}a{index}`.

---

## 17. PWA Card Types

### Transport card (`交通`)
Categories: `flight`, `transport`

```
background: transparent (rgba(176,166,149,0.3) tint)
border:     1px dashed var(--accent)
```

Shows: time range, from→to subtitle, transit schedule chips (T-2…T+2), "🧭 導航前往" button → Google Maps Directions.

### General card
Categories: `attraction`→景點, `food`→早餐, `shopping`→景點, `task`→景點, `hotel`→住宿

```
background: var(--surface)
border:     1px solid var(--accent)
```

Shows: category badge, visited checkbox (persisted), business hours, "📍 Google Maps" link.

### Category badge colours (earth-tone only)
All badges use tints derived from the 4-variable palette; no external colour families.

| Label | Background | Text |
|-------|-----------|------|
| 交通 | `rgba(176,166,149,0.25)` | `--text-main` |
| 景點 | `rgba(176,166,149,0.18)` | `--text-main` |
| 早餐 | `rgba(176,166,149,0.18)` | `--text-main` |
| 住宿 | `rgba(176,166,149,0.18)` | `--text-main` |

---

## 18. PWA Service Worker

File: `pwa/service-worker.js` — registered from `app.js` `init()`.

Strategy:
- **Install**: pre-caches `./`, `./index.html`, `./style.css`, `./app.js`, `./itinerary.json`, `./manifest.json`
- **Activate**: deletes old caches by name comparison
- **Fetch (same-origin)**: cache-first, then network; successful responses are cached
- **Fetch (cross-origin/APIs)**: network-first, fall back to cached response

Cache name: `japan-trip-v1` — bump the version string to force a cache refresh on deploy.

---

## 19. PWA Deployment

`deploy.yml` no longer runs a build step:

```yaml
jobs:
  deploy:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./pwa
      - uses: actions/deploy-pages@v4
```

No secrets needed (no Google Maps API key; all map links are URL-only).
Weather and currency APIs require no key.

---

## 20. PWA vs Next.js Feature Comparison

| Feature | Next.js (`src/`) | PWA (`pwa/`) |
|---------|-----------------|-------------|
| Build step | `npm run build` | None |
| Bundle size | ~300 KB JS | ~50 KB (Alpine CDN cached) |
| Google Maps | Interactive SDK map | URL link only |
| Offline support | No | Yes (service worker) |
| Visited state | No | Yes (localStorage) |
| Checklist | Interactive (React state) | Interactive (Alpine + localStorage) |
| Weather | Per-day widget | Per-day in day header |
| Currency | Converter widget | Converter widget |
| Transit chips | T-2…T+2 | T-2…T+2 |
| Color system | Tailwind `journal.*` + `japan.*` | 4 CSS custom properties |
