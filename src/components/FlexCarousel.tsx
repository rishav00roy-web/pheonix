import React, { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/smoothScroll';
import './FlexCarousel.css';

export interface FlexItem {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
}

interface Glass {
  /** How much taller the cards stretch at the edges (0 is none) */
  stretch: number;
  /** How far the edges pull the rest of the row in, as a share of the width */
  pull: number;
  /** Height of the wave along the edges, in px */
  wave: number;
  /** Colour split at the edges */
  split: number;
  /** Where the glass starts, as a share of the half-width from the centre */
  start: number;
}

const PRESETS: Record<'liquid' | 'ribbon' | 'arch', Glass> = {
  liquid: { stretch: 0.85, pull: 0.15, wave: 12, split: 0.035, start: 0.3 },
  ribbon: { stretch: 0.5, pull: 0.1, wave: 30, split: 0.03, start: 0.2 },
  arch: { stretch: 0.8, pull: 0.12, wave: 0, split: 0.04, start: 0.1 },
};

interface FlexCarouselProps {
  items: FlexItem[];
  preset?: keyof typeof PRESETS;
  /** How the cards arrive the first time the row comes into view */
  intro?: 'rise' | 'none';
  /** Card height as a share of the stage height */
  cardHeight?: number;
  gap?: number;
  /** How much the cards compress while the row moves fast (0 to 1) */
  squeeze?: number;
  focusOnClick?: boolean;
  captions?: boolean;
  /** Number printed before each card's counter, so plates keep their numbering */
  firstNo?: number;
  /** Called with a card's index when its focused view asks to go full screen */
  onOpen?: (index: number) => void;
  label?: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const wrap = (v: number, len: number) => ((((v + len / 2) % len) + len) % len) - len / 2;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Atlas: every photo cover-cropped to 4:5 in a grid of cells on one texture
const CELL_W = 512;
const CELL_H = 640;
const ASPECT = CELL_W / CELL_H;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

// One pass over the stage. Each pixel finds where it looks into the row:
// flat in the middle, and through liquid glass toward the edges, where the
// row stretches tall, waves, is pulled inward and splits into colour.
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uDpr, uOffset, uStep, uCardW, uCardH, uN, uCols, uRows, uTime;
uniform float uFlat, uZoom, uPart, uSqueeze, uRise;
uniform float uStretch, uPull, uWave, uSplit, uStart;
uniform sampler2D uAtlas;

vec4 look(vec2 p, float k) {
  float nx = p.x / (uRes.x * 0.5);
  float e = smoothstep(uStart, 1.0, abs(nx)) * uFlat;
  float y = p.y - sin(nx * 3.2 + uTime * 1.3) * uWave * e;
  y /= 1.0 + uStretch * e * e * k;
  float x = p.x + sign(nx) * e * e * uRes.x * uPull * k;
  vec2 q = vec2(x, y) / uZoom;
  q.x *= 1.0 + uSqueeze;
  float hw = uCardW * 0.5;
  if (uPart > 0.0 && abs(q.x) > hw) {
    if (abs(q.x) < hw + uPart) return vec4(0.0);
    q.x -= sign(q.x) * uPart;
  }
  float rx = q.x + uOffset;
  float idx = floor(rx / uStep + 0.5);
  float local = rx - idx * uStep;
  if (abs(local) > hw) return vec4(0.0);
  float r = clamp(uRise * 1.8 - abs(idx * uStep - uOffset) / uRes.x, 0.0, 1.0);
  r = 1.0 - pow(1.0 - r, 3.0);
  q.y -= (1.0 - r) * uCardH * 1.1;
  if (abs(q.y) > uCardH * 0.5) return vec4(0.0);
  float ci = mod(idx, uN);
  float col = mod(ci, uCols);
  float row = floor(ci / uCols);
  vec2 uv = clamp(vec2(local / uCardW, q.y / uCardH) + 0.5, 0.004, 0.996);
  vec4 c = texture2D(uAtlas, (vec2(col, row) + uv) / vec2(uCols, uRows));
  return c * r * (1.0 - 0.22 * e);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x / uDpr - uRes.x * 0.5, uRes.y * 0.5 - gl_FragCoord.y / uDpr);
  vec4 g = look(p, 1.0);
  float s = uSplit;
  float red = look(p, 1.0 - s).r;
  float blue = look(p, 1.0 + s).b;
  gl_FragColor = vec4(red, g.g, blue, max(g.a, 0.0));
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader');
  return sh;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// An endless row of photographs that flows through invisible liquid glass at
// its edges. Drawn by WebGL on one canvas, so the page has a single layer to
// composite; the loop only runs while the row is on screen. Drag or flick it,
// use the arrow keys, click a card to bring it forward.
export const FlexCarousel: React.FC<FlexCarouselProps> = ({
  items,
  preset = 'liquid',
  intro = 'rise',
  cardHeight = 0.5,
  gap = 12,
  squeeze = 0.2,
  focusOnClick = false,
  captions = false,
  firstNo = 1,
  onOpen,
  label = 'Photographs',
}) => {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);
  const [fallback, setFallback] = useState(false);
  const n = items.length;

  // Motion state lives outside React
  const m = useRef({
    offset: 0, // px the row has travelled
    v: 0, // px per ms
    dragging: false,
    focusT: 0,
    focusIdx: -1,
    rise: intro === 'rise' && !prefersReducedMotion ? 0 : 1,
    w: 0,
    h: 0,
    cardW: 0,
    cardH: 0,
    step: 0,
    active: 0,
    snap: null as gsap.core.Tween | null,
    dirty: true,
  });

  useEffect(() => {
    const el = stage.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) {
      setFallback(true);
      return;
    }
    const s = m.current;
    const glass = PRESETS[preset];

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch {
      setFallback(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: u('uRes'), dpr: u('uDpr'), offset: u('uOffset'), step: u('uStep'), cardW: u('uCardW'), cardH: u('uCardH'),
      n: u('uN'), cols: u('uCols'), rows: u('uRows'), time: u('uTime'), flat: u('uFlat'), zoom: u('uZoom'),
      part: u('uPart'), squeeze: u('uSqueeze'), rise: u('uRise'), stretch: u('uStretch'), pull: u('uPull'),
      wave: u('uWave'), split: u('uSplit'), start: u('uStart'),
    };
    gl.uniform1f(U.n, n);
    gl.uniform1f(U.pull, glass.pull);
    gl.uniform1f(U.wave, prefersReducedMotion ? 0 : glass.wave);
    gl.uniform1f(U.split, glass.split);
    gl.uniform1f(U.start, glass.start);
    gl.clearColor(0, 0, 0, 0);

    // The atlas: drawn once the photos arrive
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    gl.uniform1f(U.cols, cols);
    gl.uniform1f(U.rows, rows);
    const tex = gl.createTexture();
    let ready = false;
    let disposed = false;
    Promise.all(items.map((it) => loadImage(it.src)))
      .then((imgs) => {
        if (disposed) return;
        const atlas = document.createElement('canvas');
        atlas.width = cols * CELL_W;
        atlas.height = rows * CELL_H;
        const ctx = atlas.getContext('2d')!;
        imgs.forEach((img, i) => {
          const r = img.naturalWidth / img.naturalHeight;
          const sw = r > ASPECT ? img.naturalHeight * ASPECT : img.naturalWidth;
          const sh = r > ASPECT ? img.naturalHeight : img.naturalWidth / ASPECT;
          ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, (i % cols) * CELL_W, Math.floor(i / cols) * CELL_H, CELL_W, CELL_H);
        });
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        ready = true;
        s.dirty = true;
      })
      .catch(() => setFallback(true));

    // Phones get fewer pixels: the glass is soft anyway
    let dpr = 1;
    const measure = () => {
      s.w = el.clientWidth;
      s.h = el.clientHeight;
      s.cardH = s.h * cardHeight;
      s.cardW = s.cardH * ASPECT;
      s.step = s.cardW + gap;
      dpr = Math.min(window.devicePixelRatio || 1, s.w < 768 ? 1.25 : 1.5);
      cv.width = Math.round(s.w * dpr);
      cv.height = Math.round(s.h * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      // A phone's stage is short: the edges stretch less so they stay inside it
      gl.uniform1f(U.stretch, glass.stretch * (s.w < 768 ? 0.5 : 1));
      s.dirty = true;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    let last = performance.now();
    const render = () => {
      const now = performance.now();
      const dt = Math.min(48, now - last);
      last = now;

      // Momentum after a flick, then settle on the nearest card
      if (!s.dragging && !s.snap && Math.abs(s.v) > 0.002) {
        s.offset += s.v * dt;
        s.v *= Math.pow(0.94, dt / 16);
        if (Math.abs(s.v) < 0.05) settle();
      } else if (!s.dragging && !s.snap) {
        s.v = 0;
      }

      const nearest = (((Math.round(s.offset / s.step) % n) + n) % n);
      if (nearest !== s.active) {
        s.active = nearest;
        setActive(nearest);
      }
      if (!ready) return;

      const focusZoom = Math.min((s.h * 0.92) / s.cardH, (s.w * 0.9) / s.cardW);
      gl.uniform2f(U.res, s.w, s.h);
      gl.uniform1f(U.dpr, dpr);
      gl.uniform1f(U.offset, s.offset);
      gl.uniform1f(U.step, s.step);
      gl.uniform1f(U.cardW, s.cardW);
      gl.uniform1f(U.cardH, s.cardH);
      gl.uniform1f(U.time, prefersReducedMotion ? 0 : now / 1000);
      gl.uniform1f(U.flat, 1 - s.focusT);
      gl.uniform1f(U.zoom, 1 + (focusZoom - 1) * s.focusT);
      gl.uniform1f(U.part, s.focusT * s.w * 0.25);
      gl.uniform1f(U.squeeze, Math.min(squeeze, Math.abs(s.v) * squeeze));
      gl.uniform1f(U.rise, s.rise);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const settle = () => {
      const target = Math.round(s.offset / s.step) * s.step;
      s.v = 0;
      s.snap = gsap.to(s, {
        offset: target,
        duration: 0.7,
        ease: 'power3.out',
        onComplete: () => {
          s.snap = null;
        },
      });
    };

    // Run only while the row is on screen
    let running = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        last = performance.now();
        gsap.ticker.add(render);
        if (s.rise < 1) gsap.to(s, { rise: 1, duration: 1.6, ease: 'none', delay: 0.1 });
      } else if (!e.isIntersecting && running) {
        running = false;
        gsap.ticker.remove(render);
      }
    });
    io.observe(el);

    // Which card a point on the stage shows, following the glass the same way the shader does
    const cardAt = (clientX: number) => {
      const r = el.getBoundingClientRect();
      const px = clientX - r.left - s.w / 2;
      const nx = px / (s.w / 2);
      const e = smooth(glass.start, 1, Math.abs(nx)) * (1 - s.focusT);
      const x = px + Math.sign(nx) * e * e * s.w * glass.pull;
      const idx = Math.round((x + s.offset) / s.step);
      return ((idx % n) + n) % n;
    };

    // Dragging. Touch lets the page scroll vertically until a sideways drag is clear.
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastT = 0;
    let axis: 'x' | 'y' | null = null;
    let moved = 0;
    let pid = -1;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pid = e.pointerId;
      startX = lastX = e.clientX;
      startY = e.clientY;
      lastT = performance.now();
      axis = e.pointerType === 'mouse' ? 'x' : null;
      moved = 0;
      s.dragging = true;
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging || e.pointerId !== pid) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'y') {
          s.dragging = false;
          return;
        }
      }
      if (axis !== 'x') return;
      if (moved === 0) {
        el.setPointerCapture(pid);
        s.snap?.kill();
        s.snap = null;
      }
      const now = performance.now();
      const step = e.clientX - lastX;
      s.offset -= step;
      s.v = -step / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      moved += Math.abs(step);
      if (moved > 6 && s.focusIdx >= 0) unfocusRef.current();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid || !s.dragging) return;
      s.dragging = false;
      if (moved < 6) {
        tapRef.current(cardAt(e.clientX));
        return;
      }
      if (performance.now() - lastT > 80) s.v = 0;
      if (Math.abs(s.v) < 0.05) settle();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      gsap.ticker.remove(render);
      s.snap?.kill();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, preset, cardHeight, gap, squeeze]);

  const goTo = (i: number) => {
    const s = m.current;
    const target = s.offset + wrap(i * s.step - s.offset, s.step * n);
    s.snap?.kill();
    s.v = 0;
    s.snap = gsap.to(s, {
      offset: target,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        s.snap = null;
      },
    });
  };

  const focus = (i: number) => {
    const s = m.current;
    s.focusIdx = i;
    setFocused(i);
    goTo(i);
    gsap.to(s, { focusT: 1, duration: 0.9, ease: 'power3.inOut', overwrite: 'auto' });
  };

  const unfocus = () => {
    const s = m.current;
    if (s.focusIdx < 0) return;
    setFocused(null);
    gsap.to(s, {
      focusT: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        s.focusIdx = -1;
      },
    });
  };

  const tap = (i: number) => {
    if (!focusOnClick) return goTo(i);
    if (m.current.focusIdx >= 0) unfocus();
    else focus(i);
  };

  // The pointer handlers live in the effect; they reach the latest callbacks through refs
  const unfocusRef = useRef(unfocus);
  const tapRef = useRef(tap);
  unfocusRef.current = unfocus;
  tapRef.current = tap;

  const onKey = (e: React.KeyboardEvent) => {
    const s = m.current;
    const keys: Record<string, () => void> = {
      ArrowRight: () => goTo((s.active + 1) % n),
      ArrowLeft: () => goTo((s.active - 1 + n) % n),
      Home: () => goTo(0),
      End: () => goTo(n - 1),
      Enter: () => tap(s.active),
      Escape: unfocus,
    };
    const run = keys[e.key];
    if (!run) return;
    e.preventDefault();
    if (focused !== null && e.key !== 'Escape' && e.key !== 'Enter') unfocus();
    run();
  };

  const shown = focused ?? active;
  const item = items[shown];

  if (fallback) {
    // No WebGL: a plain row that scrolls sideways
    return (
      <div className="flex-fallback" role="region" aria-label={label}>
        {items.map((it, i) => (
          <figure key={it.src}>
            <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
            <figcaption className="mt-2 mono-label text-chrome-400 num">
              {pad2(i + firstNo)} · {it.title}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${label}. Drag, or use the arrow keys${focusOnClick ? ' and Enter to bring a photo forward' : ''}.`}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div ref={stage} className={`flex-stage ${focused !== null ? 'is-focused' : ''}`}>
        <canvas ref={canvas} className="flex-canvas" aria-hidden="true" />
      </div>
      {/* What the canvas shows, for screen readers */}
      <p className="sr-only" aria-live="polite">
        {item ? `${item.title}. ${item.alt}` : ''}
      </p>

      {captions && item && (
        <div className="flex-caption">
          <p key={item.title} className="headline flex-caption-title text-[clamp(24px,2.6vw,36px)]">
            {item.title}
          </p>
          <p className="mono-label text-chrome-400 num mt-2">
            <span key={shown} className="flex-count-now">{pad2(shown + firstNo)}</span> / {pad2(n + firstNo - 1)}
          </p>
          {focused !== null && onOpen && (
            <button type="button" className="text-link mt-4" onClick={() => onOpen(focused)}>
              Full screen
            </button>
          )}
        </div>
      )}
    </div>
  );
};
