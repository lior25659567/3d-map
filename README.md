# 3D Map — Photoreal

Interactive photorealistic 3D city map (Google Earth-style) built on Google
Photorealistic 3D Tiles, rendered with deck.gl over a MapLibre base. Pick a city,
orbit/zoom the 3D skyline, click a building to zoom toward it.

## Run

```bash
npm install
cp .env.example .env     # then add your Google Maps key (see below)
npm run dev              # http://localhost:5173
```

The map needs a Google Maps key — without one it shows a notice instead of the map.

## Google Maps key (required)

Photorealistic 3D Tiles are Google's proprietary streamed data; there is no free
or self-hosted equivalent.

1. [Google Cloud Console](https://console.cloud.google.com/) → create/pick a project.
2. **Enable billing** (required even for the free tier).
3. APIs & Services → enable **Map Tiles API** (and **Maps JavaScript API** if you
   want Google Street View from the "Street level" button).
4. Credentials → **Create API key**. Restrict it to those APIs and to your domain.
5. Put it in `.env` (gitignored — never commit it):
   ```
   VITE_GOOGLE_MAPS_KEY=your_key_here
   ```
6. `npm run dev`.

> ⚠️ Photorealistic 3D Tiles is an Enterprise SKU with only ~1,000 free tile
> loads/month — effectively paid for real traffic. Watch usage in the Cloud
> Console and set a budget alert before going public.

### Optional: Mapillary (free street-level fallback)

Only used if you have **no** Google key. Create an app at the
[Mapillary dashboard](https://www.mapillary.com/dashboard/developers) and set
`VITE_MAPILLARY_TOKEN` in `.env`. With a Google key, Street level uses Google
Street View instead.

## Configuration

Everything lives in [`src/config/map-config.js`](src/config/map-config.js):

- **`PLACES`** — cities in the picker. Add one with `{ id, name, center: [lng, lat], zoom, pitch, bearing }`.
- **`VIEW_LIMITS`** — bounds the camera to one city so the 3D tiles stay a finite,
  cached set (smooth movement, no rebuilding). Smaller `radiusKm` = tighter area
  that caches fully; `minZoom`/`maxZoom` cap the zoom range.
- **`PHOTOREAL`** — load tuning. `screenSpaceError` (higher = faster/coarser,
  lower = sharper/more detail) and `maxMemoryMB` (tile cache size).
- **`CLICK_ZOOM`** — how far a building click zooms in.

## How it works

- [`MapView`](src/components/MapView/MapView.jsx) — MapLibre base map (empty dark
  style; the 3D mesh covers the ground) with bounds + zoom limits applied.
- [`Photoreal3DLayer`](src/components/Photoreal3DLayer/Photoreal3DLayer.jsx) —
  deck.gl `Tile3DLayer` of Google's 3D Tiles via an interleaved `MapboxOverlay`;
  sets cache size + detail level and handles click-to-zoom.
- [`PlacePicker`](src/components/PlacePicker/PlacePicker.jsx) — jumps between
  cities and re-bounds the camera.
- [`StreetView`](src/components/StreetView/StreetView.jsx) — Google Street View
  (or Mapillary fallback) opened from the "Street level" button.
