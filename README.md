# Camera Grid

A lightweight PWA for viewing security camera feeds on iOS. Built as a companion to [Frigate NVR](https://frigate.video/) and [go2rtc](https://github.com/AlexxIT/go2rtc).

Frigate's own UI is unreliable on iOS Safari — streams frequently fail to connect. This app uses simple, universally-supported approaches instead.

## How it works

- **Grid view**: JPEG snapshots refreshing every second, works everywhere
- **Fullscreen**: Tap a camera for a high-res refreshing snapshot
- **PWA**: Add to Home Screen for standalone app experience with no browser chrome

## Compatibility

Designed to work on old iOS devices (iPad 3 / iOS 9.3.6 and up):
- No CSS Grid — uses absolute positioning with `calc()` and `nth-child`
- ES5 JavaScript only — no arrow functions, template literals, or const/let
- No canvas/motion detection — simple center-cropped feeds
- Fullscreen uses refreshing JPEG snapshot (no fMP4 video streaming)
- Service Worker is feature-gated — works where supported, gracefully skipped elsewhere

## Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ iPhone/iPad  │      │  nginx:8080  │      │ go2rtc:1984  │
│   Safari     │─────▶│  camera-grid │─────▶│  (in Frigate)│
│              │      │  /api/* proxy│      │              │
└──────────────┘      └──────────────┘      └──────────────┘
```

Nginx serves the static HTML and reverse-proxies `/api/*` to go2rtc — keeping everything same-origin to avoid CORS issues.

### Why not WebRTC/MSE?

| Method | Issue on iOS |
|--------|-------------|
| MSE (`MediaSource`) | Not supported on iOS Safari |
| WebRTC (`video-rtc.js`) | Needs direct UDP (port 8555) — can't proxy through nginx |
| fMP4 (`stream.mp4`) | Works natively in `<video>` tag |
| JPEG (`frame.jpeg`) | Works everywhere via `<img>` tag |

## Setup

Requires a running Frigate instance with go2rtc.

1. Clone this repo onto your Frigate server:
   ```bash
   git clone https://github.com/constantm/camera-grid.git
   cd camera-grid
   ```

2. Edit `index.html` — update the `CAMERAS` array with your camera names (must match your go2rtc stream names).

3. Start the container:
   ```bash
   docker compose up -d
   ```

4. Open `http://YOUR_SERVER:8080` on your phone and Add to Home Screen.

The container joins the `frigate_default` Docker network to reach go2rtc. If your Frigate stack uses a different network name, update `docker-compose.yml`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Single-page app with grid view and fullscreen snapshot overlay |
| `nginx.conf` | Serves static files + proxies `/api/*` to go2rtc |
| `docker-compose.yml` | nginx:alpine container config |
| `manifest.json` | PWA manifest |
| `sw.js` | Service worker (caches shell, never caches API) |
| `icon.svg` | App icon source |
| `icon-192.png` / `icon-512.png` | Rasterized PWA icons |
