# iPad A1430 Compatibility Design

## Context

The camera-grid PWA needs to work on an iPad A1430 (iPad 3rd gen, max iOS 9.3.6, Safari 9). The iPad will be wall-mounted as an always-on dashboard — no interactive use.

## Constraints (Safari 9 / iOS 9.3.6)

- No CSS Grid (requires Safari 10.1)
- No `inset` shorthand (requires Safari 14.1)
- No arrow functions, template literals, `const`/`let` (ES6 syntax)
- No Service Workers
- No `env()` safe-area-insets
- `classList.add()`/`.remove()` only accept single arguments

## Approach

Manual ES5 + pre-Grid CSS rewrite of `index.html`. No build tools — the codebase is ~370 lines and stays zero-dependency.

## CSS Changes

- Replace `display: grid` with absolute positioning using percentage-based cells
  - Portrait (2 cols x 3 rows): each cell 50% wide, 33.333% tall
  - Landscape (3 cols x 2 rows): each cell 33.333% wide, 50% tall
  - Gap via padding on each cell instead of grid `gap`
- Add `-webkit-` prefixes for `transform`, `transition`, `border-radius`, `animation`
- Replace `inset: 0` with `top:0;right:0;bottom:0;left:0`
- Replace `100vh` with `100%`
- Replace `display: flex` in overlay with absolute positioning
- Remove `env()` safe-area-insets (iPad 3 has no notch)

## JS Changes

- All `const`/`let` to `var`
- All arrow functions to `function()` expressions
- All template literals to string concatenation
- Remove motion detection entirely (canvas diffing, detectMotion, getPixels)
- Remove service worker registration
- Ensure `classList.add()`/`.remove()` use single arguments only

## Fullscreen Overlay

Simplify to a larger JPEG snapshot view instead of fMP4 `<video>` streaming. Keep tap handler functional but show a refreshing snapshot rather than a live stream.

## Unchanged

- PWA manifest and apple-mobile-web-app meta tags
- Nginx config / Docker setup
- JPEG refresh loop via `<img>` tags
- Stale-feed indicators (green/red dots)
