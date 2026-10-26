import React, { useRef, useState } from 'react';
import { TLink } from '../lib/transition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gsap, MOTION_OK, useGSAP } from '../lib/smoothScroll';
import { entranceDelay } from '../lib/pageTransition';
import { SplitText } from '../components/SplitText';
import { PlateViewer } from '../components/PlateViewer';
import { ArrowUpRightIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '../components/icons';
import { SOCIAL } from '../data/brand';
import {
  FOLLOW,
  PLATES,
  PORTRAIT,
  YOUTUBE_URL,
  formatPostDate,
  pad2,
  photoSmall,
  photoSquare,
  photoSrc,
  photoSrcSet,
  postLink,
  type AjPhoto,
} from '../data/ajShield';
import './AjShield.css';

const NAME = 'AJ Shield';

// Where each plate sits on the desktop grid: mixed widths, staggered drops
const PLACES = [
  'lg:col-start-1 lg:col-span-5',
  'lg:col-start-7 lg:col-span-3 lg:mt-24',
  'lg:col-start-10 lg:col-span-3 lg:mt-48',
  'lg:col-start-2 lg:col-span-3',
  'lg:col-start-6 lg:col-span-4 lg:-mt-16',
  'lg:col-start-10 lg:col-span-3 lg:mt-12',
  'lg:col-start-1 lg:col-span-3 lg:mt-8',
  'lg:col-start-5 lg:col-span-4 lg:-mt-8',
  'lg:col-start-10 lg:col-span-3 lg:mt-16',
];
// Phones: two columns, the square plate and the first run full width
const MOBILE_WIDE = new Set([0, 4]);

// The founder's page: her portrait, her words (to come), her photographs as
// numbered plates, her music, and where to follow her.
export const AjShield: React.FC = () => {
  useDocumentTitle(
    NAME,
    'AJ Shield, founder of Pheonix: rapper, artist and model from Jorhat, Assam. Her photographs, her music and where to follow her.'
  );
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const delay = entranceDelay();
        // The portrait wipes open, the name rises letter by letter, the rule draws
        gsap.fromTo('[data-portrait]', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut', delay });
        gsap.from('.aj-name-letter', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.05, delay: delay + 0.35 });
        gsap.from('.aj-rule', { scaleX: 0, duration: 1.2, ease: 'power3.inOut', delay: delay + 0.6 });
        gsap.from('[data-intro]', { y: 16, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: delay + 0.8 });

        // Plates open like a curtain as they arrive and drift gently inside their frames
        gsap.utils.toArray<HTMLElement>('[data-plate]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
          );
          const img = el.querySelector('img');
          if (img) {
            gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
          }
        });
        gsap.utils.toArray<HTMLElement>('[data-fade]').forEach((el) => {
          gsap.from(el, { y: 24, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });
      });
    },
    { scope }
  );

  return (
    <div ref={scope}>
      <Opening />
      <Words />
      <Lookbook onOpen={setOpen} />
      <Music />
      <Follow />
      <PlateViewer plates={PLATES} index={open} firstNo={2} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
};

/** Corner crop marks from the specimen card */
const Crops: React.FC = () => (
  <>
    <span aria-hidden="true" className="crop crop-tl">┌</span>
    <span aria-hidden="true" className="crop crop-tr">┐</span>
    <span aria-hidden="true" className="crop crop-bl">└</span>
    <span aria-hidden="true" className="crop crop-br">┘</span>
  </>
);

/** The ember hairline with its diamond, after the Home hero */
const Rule: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`aj-rule ${className}`}>
    <span className="aj-diamond">◆</span>
  </div>
);

function Opening() {
  return (
    <section aria-labelledby="aj-title" className="frame pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="grid-12 gap-y-10 items-center">
        <figure className="relative lg:col-span-6 border border-bone-100/[0.08] p-3 sm:p-4 bg-obsidian-950">
          <Crops />
          <div data-portrait className="relative aspect-[4/5] overflow-hidden bg-obsidian-900">
            <img
              src={photoSrc(PORTRAIT)}
              srcSet={photoSrcSet(PORTRAIT)}
              sizes="(min-width: 1024px) 46vw, 100vw"
              width={PORTRAIT.width}
              height={PORTRAIT.height}
              alt={PORTRAIT.alt}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <figcaption className="mt-3 flex justify-between gap-4 mono-label text-chrome-400">
            <span>Plate 01</span>
            <span>Portrait</span>
          </figcaption>
        </figure>

        <div className="lg:col-start-8 lg:col-span-5">
          <h1 id="aj-title" aria-label={NAME} className="headline text-[clamp(64px,10vw,152px)] leading-[0.95]">
            {NAME.split(' ').map((word, wi) => (
              <span key={wi} aria-hidden="true" className="whitespace-nowrap">
                {wi > 0 && ' '}
                {word.split('').map((ch, i) => (
                  <span key={i} className="aj-name-clip">
                    <span className="aj-name-letter">{ch}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <Rule className="mt-8" />
          <p data-intro className="mt-8 text-[clamp(18px,1.6vw,22px)]">Founder · Rapper · Artist · Model</p>
          <p data-intro className="mt-4 flex flex-col gap-1">
            <span className="mono-label text-chrome-400 num">26.75° N · 94.22° E</span>
            <span className="text-bone-100">Jorhat, Assam, India</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Words() {
  return (
    <section aria-labelledby="aj-words" className="frame py-16 lg:py-24 border-t border-obsidian-700">
      <div className="grid-12 gap-y-8">
        <h2 id="aj-words" data-fade className="headline text-[clamp(36px,4.5vw,64px)] lg:col-span-4">
          In her words
        </h2>
        <div className="lg:col-start-6 lg:col-span-7 flex flex-col gap-6">
          <p data-fade className="aj-placeholder">
            [Placeholder: a line from one of AJ’s own captions, quoted exactly, with the post date and a link to the post.]
          </p>
          <p data-fade className="aj-placeholder">[Placeholder: how Pheonix started, in AJ’s own words.]</p>
          <p data-fade className="aj-placeholder">[Placeholder: what she wants Pheonix to stand for.]</p>
        </div>
      </div>
    </section>
  );
}

function Lookbook({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section aria-labelledby="aj-lookbook" className="frame py-16 lg:py-24 border-t border-obsidian-700">
      <div className="flex items-end justify-between gap-6">
        <SplitText as="h2" id="aj-lookbook" text="Lookbook" className="headline text-[clamp(36px,4.5vw,64px)]" />
        <p data-fade className="mono-label text-chrome-400 num pb-2">Plates 02 to {pad2(PLATES.length + 1)}</p>
      </div>
      <ul className="mt-10 lg:mt-14 grid grid-cols-2 lg:grid-cols-12 gap-x-3 gap-y-8 lg:gap-x-6 lg:gap-y-10 items-start">
        {PLATES.map((p, i) => (
          <li key={p.id} className={`${MOBILE_WIDE.has(i) ? 'col-span-2' : ''} ${PLACES[i]}`}>
            <Plate photo={p} no={i + 2} onOpen={() => onOpen(i)} wide={MOBILE_WIDE.has(i)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Plate({ photo, no, onOpen, wide }: { photo: AjPhoto; no: number; onOpen: () => void; wide: boolean }) {
  return (
    <figure className="relative">
      <button
        type="button"
        onClick={onOpen}
        className="aj-plate group relative block w-full border border-bone-100/[0.08] hover:border-bone-100/30 p-2 sm:p-3 bg-obsidian-950 transition-colors duration-500"
        aria-label={`Open plate ${pad2(no)} full screen`}
      >
        <Crops />
        <span data-plate className="relative block overflow-hidden bg-obsidian-900" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <img
            src={photoSmall(photo)}
            srcSet={photoSrcSet(photo)}
            sizes={wide ? '(min-width: 1024px) 40vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-[108%] -top-[4%] object-cover"
          />
        </span>
      </button>
      <figcaption className="mt-2 flex flex-wrap justify-between gap-x-3 text-[13px] text-chrome-400">
        <span className="mono-label">Plate {pad2(no)}</span>
        {photo.date && <span className="num">{formatPostDate(photo.date)}</span>}
      </figcaption>
    </figure>
  );
}

function Music() {
  return (
    <section aria-labelledby="aj-music" className="frame py-16 lg:py-24 border-t border-obsidian-700">
      <div data-fade className="aj-cassette relative mx-auto max-w-[720px] border border-bone-100/[0.14] bg-obsidian-950 p-5 sm:p-8">
        <Crops />
        <div className="flex items-center justify-between gap-4 border-b border-obsidian-700 pb-3">
          <span className="mono-label text-chrome-400">Side A</span>
          <span className="mono-label text-ember-400">Rap</span>
        </div>
        <h2 id="aj-music" className="headline mt-5 text-[clamp(36px,5vw,56px)]">
          The music
        </h2>
        <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-10 sm:gap-16 border border-obsidian-700 py-5">
          <span className="aj-reel" />
          <span className="aj-window" />
          <span className="aj-reel" />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-chrome-400 max-w-[34ch]">AJ Shield raps. Her tracks live on her YouTube channel.</p>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">
            <YouTubeIcon />
            Listen on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  Instagram: InstagramIcon,
  YouTube: YouTubeIcon,
  WhatsApp: WhatsAppIcon,
};

function Follow() {
  return (
    <section aria-labelledby="aj-follow" className="frame pt-16 pb-24 lg:pt-24 lg:pb-32 border-t border-obsidian-700">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SplitText as="h2" id="aj-follow" text="Follow AJ" className="headline text-[clamp(36px,4.5vw,64px)]" />
        <p data-fade className="mono-label text-chrome-400">@aj_shiield</p>
      </div>
      <ul className="mt-10 grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
        {FOLLOW.map((p) => (
          <li key={p.id}>
            <a
              href={postLink(p)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-obsidian-900"
              aria-label={p.post ? `Instagram post from ${formatPostDate(p.date!)}` : 'AJ Shield on Instagram'}
            >
              <img
                src={photoSquare(p)}
                width={600}
                height={600}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-void/70 text-bone-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRightIcon className="w-4 h-4" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {SOCIAL.map((s) => {
            const Icon = ICONS[s.label];
            return (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-link">
                  {Icon && <Icon className="w-5 h-5" />}
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
        <TLink to="/shop" className="btn btn-primary">
          Shop the collection
        </TLink>
      </div>
    </section>
  );
}
