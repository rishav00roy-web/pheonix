# Compiled Spec: Ash to Flame

## Tokens
- Colors (tailwind): void #030305, bone-100 #f3efe8, ember-500 #ff441f, ash #8a8580, gold #f2a541.
- Radius: every borderRadius key = 0.
- Fonts: font-nistha, font-mono (Space Mono), font-sans (Plus Jakarta Sans).

## Motion
- Lenis (src/lib/smoothScroll.ts): lerp 0.09, smoothWheel, syncTouch false; null under reduced motion.
- All scroll motion = motion values (useScroll / useTransform / useSpring). No state per frame.
- Sparks: one fixed canvas (src/lib/sparks.ts), rAF loop only while particles exist or emission > 0, paused when the tab is hidden.
- Reduced motion: no Lenis, no intro, no parallax / scatter, no snap, runway falls back to the vertical reel.

## Layout
- Hero: min-height 100svh, wordmark letters are spans with background-clip:text, background offsets measured on resize (not on scroll).
- Reel: panels h-[100svh], html.reel-snap { scroll-snap-type: y proximity } on mobile only.
- Runway: section height = N * 70vh, sticky inner h-[100svh], track x from section progress, per-item scale/opacity from distance to the active index.
- Dossier: AnimatePresence, layoutId `frame-${id}`, drag="y" via drag controls on the handle/image.
- Thumb bar + floating WhatsApp: fixed bottom with safe-area insets; WhatsApp hides while the thumb bar shows.
