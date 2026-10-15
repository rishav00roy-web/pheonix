# Compiled Spec

## Mobile-First Architecture
- Container: Full-height viewport stack with `h-svh snap-y snap-mandatory overflow-y-auto`
- Section items: `h-svh snap-start snap-always relative flex flex-col justify-between p-6 sm:p-12 overflow-hidden`
- View Modes:
  - `REEL`: The 100svh cinematic scene stream
  - `INDEX`: The brutalist archival registry
- HUD Overlays:
  - Top: Fixed hairline header with `PHEONIX` and view toggles
  - Bottom: Floating thumb-level action deck (`[01/06]`, `INSPECT DOSSIER`, `ACQUIRE $1,480`)

## Typography & Color Tokens
- Font: `Syne` (display titles), `Cinzel` (poetic subtitles), `Space Mono` (technical coordinates)
- Palette:
  - `--void`: `#020204`
  - `--bone`: `#f3efe8`
  - `--ember`: `#ff3e1f`
  - `--zinc-hud`: `#71717a`

## Entrance & Motion
- Mobile swipe/scroll: CSS scroll snapping (`scroll-snap-type: y mandatory`) for smooth, film-strip-like frame progression.
- Interactive Monster Maw:
  - Touch-responsive jaw rotation (`rotate(-24deg)` and `rotate(30deg)`) with Web Audio API mechanical transient snap.
