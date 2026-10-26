# Design Decisions

- Entry mode: Step-by-step (User directed)
- Genre: Sci-Fi / Avant-Garde Surrealist Fashion
- Director: Denis Villeneuve (with Jonathan Glazer *Under the Skin* absence-as-design)
- Film: *Blade Runner 2049* / *Dune*
- Niche: High-fashion aesthetic wear & sculptural artefacts (Pheonix)
- Platform Priority: **Mobile-First Responsive** (100svh snap-frame scene progression, thumb-ergonomic HUD)
- Pages: Single monolithic mobile-first cinematic experience with dual modes:
  1. `REEL` (100svh Scene-by-Scene cinematic immersive mobile runway)
  2. `INDEX` (Brutalist archival dossier table)
- Major page roles:
  - Opening Prologue: Monolithic title sequence with ambient drone
  - Specimen 01: The Monster Maw Stiletto (interactive kinetic rear-jaw predator heel)
  - Specimen 02: Vortex Asymmetric Gabardine Trench
  - Specimen 03: Vertebral Embossed Moto Jacket
  - Specimen 04: Liquid Obsidian Slit Gown
  - Specimen 05: Ash Rebirth Deconstructed Mohair
  - Specimen 06: Carapace Exoskeleton Bodice
  - Dossier / Vault Drawer: Bottom-sheet acquisition manifest
- Image placeholders: None (High-res curated photography + SVG kinetic animation)

## Demo Uniqueness Audit

- Previous-work audit: Initial attempt had standard Shopify tropes (announcement bar, 4-column product grid, 5-star ratings, promo code boxes, multiple badges).
- Recurring traits to avoid:
  - 3-column or 4-column product card matrices
  - Star ratings, review counts, and badges
  - Generic sticky top navs with 8 category tabs
  - Rounded pill cards and cluttered filters
- Shell-ban list:
  - BANNED: Standard e-commerce product grids
  - BANNED: Discount announcement banners
  - BANNED: Star ratings & review counts
  - BANNED: Card-in-card nested layouts
  - BANNED: Heavy non-cinematic form controls
- Primary composition family: **Full-bleed 100svh Mobile Reel & Vertical Tower**
- Why this family differs: Replaces horizontal webshop browsing with a vertical 100svh IMAX reel where each garment is a standalone monumental film scene.
- Wireframe-level uniqueness test: When stripped of color, the site reads as a sequenced 35mm film strip or museum installation, not an online shop.

## Research Notes

### Research Boundary
- Film research is observational input: Denis Villeneuve's use of colossal scale, stark brutalist architecture, silence, and sudden violent organic textures (e.g. *Arrival* heptapod ink, *Blade Runner 2049* Wallace archive).
- What is being translated: 100svh framed scenes, stark monochrome contrast, hairline borders, atmospheric sub-bass audio, and thumb-first interaction ergonomics.
- What must not be flattened: Must NOT collapse into a thumbnail gallery or standard responsive grid on mobile.

### Film Palette
- Primary: Void Black (`#020204`)
- Secondary: Basalt Obsidian (`#0a0a0f`)
- Accent: Predatory Ember (`#ff3e1f`)
- Shadow: Absolute Black (`#000000`)
- Text: Bleached Bone (`#f3efe8`) and Technical Zinc (`#71717a`)

### Director Signatures
1. **Colossal Scale vs Solitary Subject**: Giant monolithic typography framing solitary, highly textured garments.
2. **Absence as Design**: Heavy negative space, slow deliberate breathing room between elements.
3. **Tactile Biomechanics**: Clean clinical geometry broken by startling organic/predatory features (the monster jaw heel).

---

## Revision 2026-10-25: "Ash to Flame"

- Entry mode: Step-by-step (owner approved the "Ash to Flame" plan).
- Thesis: the phoenix life cycle as a scroll. The page opens cold and ash-grey and heats up section by section, ending fully lit at the footer.
- Owner: AJ Shield (Assamese rapper, Jorhat). Copy voice stays: "Bars from the hills. Threads for the street."
- Previous-work audit (v1 of this site): centered logo + wordmark split hero, 3-column card grid with corner marks, soft 8-14px radii, two marquees, eyebrow above every section, Syne/Cinzel fonts never used consistently.
- Shell-ban list for this revision:
  - BANNED: 3/4-column product grids, pill buttons, star ratings, discount banners, card-in-card
  - BANNED: rounded corners anywhere (shape lock = 0px)
  - BANNED: marquees (removed completely)
  - BANNED: scroll cues, em-dashes in UI copy, decorative status dots
  - BANNED: window scroll listeners (motion values / IntersectionObserver only)
- Primary composition family: mobile = full-bleed 100svh vertical reel; desktop = pinned horizontal film strip.
- Palette tokens: Void #030305, Bone #f3efe8, Ember #ff441f, Ash #8a8580 (cold start), Molten Gold #f2a541 (prices and edition numbers only).
- Type: nistha (display), Space Mono (labels, codes, prices), Plus Jakarta Sans (body). Syne and Cinzel dropped.
- Skills applied: cinematic-ui (phases, anti-garbage, premium calibration), design-taste-frontend (pre-flight bans), gravitas (evidence-backed verification), motion-framer (layoutId, drag, scroll hooks).
- Vault lessons applied (my brain / Problems solved): never put overflow-x-hidden on a wrapper (breaks sticky and useScroll), use overflow-x: clip on html/body; keep parallax ranges percentage-based and small; pointer-events-none on swipeable images.
