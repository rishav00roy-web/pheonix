import React, { useCallback, useRef, useState } from 'react';
import { TLink } from '../lib/transition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { gsap, MOTION_OK, scrollToTarget, useGSAP } from '../lib/smoothScroll';
import { entranceDelay } from '../lib/pageTransition';
import { SplitText } from '../components/SplitText';
import { PlateViewer } from '../components/PlateViewer';
import { CassettePlayer, type CassetteHandle } from '../components/CassettePlayer';
import { FlexCarousel, type FlexItem } from '../components/FlexCarousel';
import { Crops, Rule } from '../components/Editorial';
import { ArrowUpRightIcon, InstagramIcon, PlayIcon, WhatsAppIcon, YouTubeIcon } from '../components/icons';
import { SOCIAL, YOUTUBE_URL } from '../data/brand';
import { pad2 } from '../data/products';
import {
  APPLE_MUSIC_URL,
  FACTS,
  FOLLOW,
  PLATES,
  PORTRAIT,
  SONG_COUNT,
  SONGS,
  SONGS_PHOTO,
  STORY,
  STORY_PHOTO,
  TAPE,
  formatPostDate,
  photoSmall,
  photoSquare,
  photoSrc,
  photoSrcSet,
  postLink,
  type AjPhoto,
} from '../data/ajShield';
import './AjShield.css';

const NAME = 'AJ Shield';

// Where a song from her list sits on the cassette, or -1
const tapeIndex = (title: string) => TAPE.findIndex((t) => t.title === title);

// The lookbook plates as carousel cards, captioned with their look and, when known, the post date
const LOOKS: FlexItem[] = PLATES.map((p) => ({
  src: photoSmall(p),
  alt: p.alt,
  title: p.title ?? 'Plate',
  subtitle: [p.subtitle, p.date && formatPostDate(p.date)].filter(Boolean).join(' · '),
}));


// The founder's page: her portrait, who she is, her photographs as numbered
// plates, her music and tracks, and where to follow her.
export const AjShield: React.FC = () => {
  useDocumentTitle(
    NAME,
    'AJ Shield (Anjali Ojha), the independent Assamese rapper behind Pheonix: who she is, her tracks, her photographs and where to follow her.'
  );
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  // The cassette and her songs list share the tape: the list marks the song
  // that is in, and puts any other on from its own row
  const deck = useRef<CassetteHandle>(null);
  const [onTape, setOnTape] = useState({ index: 0, playing: false });
  const onTrackChange = useCallback((index: number, playing: boolean) => setOnTape({ index, playing }), []);
  const playOnTape = (i: number) => {
    deck.current?.playTrack(i);
    const el = deck.current?.element;
    if (el) scrollToTarget(el, -Math.max(80, (window.innerHeight - el.offsetHeight) / 2));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const delay = entranceDelay();
        // The portrait wipes open, the name rises letter by letter, the rule draws
        gsap.fromTo('[data-portrait]', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut', delay });
        gsap.from('.aj-name-letter', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.05, delay: delay + 0.35 });
        gsap.from('.rule', { scaleX: 0, duration: 1.2, ease: 'power3.inOut', delay: delay + 0.6 });
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
      <Story />
      <Lookbook onOpen={setOpen} />
      <Music deck={deck} onTrackChange={onTrackChange} />
      <Songs onTape={onTape} playOnTape={playOnTape} />
      <Follow />
      <PlateViewer plates={PLATES} index={open} firstNo={2} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
};

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

function Story() {
  const [before, after] = STORY.lede.split(NAME);
  return (
    <section aria-labelledby="aj-story" className="frame py-20 lg:py-32 border-t border-obsidian-700">
      <div data-fade className="flex items-center justify-between gap-4 border-b border-obsidian-700 pb-3">
        <h2 id="aj-story" className="mono-label text-chrome-400">Her story</h2>
        <span className="mono-label text-chrome-400">Anjali Ojha · Assam</span>
      </div>

      <p data-fade className="headline mt-10 lg:mt-16 text-[clamp(30px,4.4vw,64px)] leading-[1.1] max-w-[30ch]">
        {before}
        <em className="italic text-ember-400">{NAME}</em>
        {after}
      </p>

      <div className="grid-12 gap-y-14 mt-16 lg:mt-24">
        <div className="lg:col-start-5 lg:col-span-8">
          <ol>
            {STORY.chapters.map((c, i) => (
              <li
                key={c.title}
                data-fade
                className="grid grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(0,1fr)] gap-x-2 py-8 lg:py-10 border-t border-obsidian-700"
              >
                <span className="mono-label text-ember-400 num pt-2">{pad2(i + 1)}</span>
                <div>
                  <h3 className="headline text-[clamp(26px,2.6vw,38px)]">{c.title}</h3>
                  <p className="mt-4 text-[17px] leading-[1.7] text-chrome-400 max-w-[58ch]">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div data-fade className="border-t border-obsidian-700 pt-8 lg:pt-10 grid grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(0,1fr)] gap-x-2">
            <span aria-hidden="true" className="text-ember-400 pt-1">◆</span>
            <div>
              <p className="headline italic text-[clamp(22px,2vw,30px)] leading-snug max-w-[34ch]">{STORY.close}</p>
              <TLink to="/shop" className="text-link mt-6">
                See what she picked
              </TLink>
            </div>
          </div>
        </div>

        <aside aria-label="Liner notes" className="order-first lg:order-none lg:col-start-1 lg:col-span-3 lg:row-start-1">
          <SidePlate photo={STORY_PHOTO} className="w-3/4 sm:w-1/2 lg:w-full mb-10" sizes="(min-width: 1024px) 22vw, 75vw" />
          <p data-fade className="mono-label text-chrome-400 pb-3 border-b border-obsidian-700">Liner notes</p>
          <dl data-fade>
            {FACTS.map((f) => (
              <div key={f.label} className="py-4 border-b border-obsidian-700">
                <dt className="mono-label text-chrome-400">{f.label}</dt>
                <dd className="mt-1 text-[17px] text-bone-100">{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Lookbook({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section aria-labelledby="aj-lookbook" className="py-16 lg:py-24 border-t border-obsidian-700">
      <div className="frame flex items-end justify-between gap-6">
        <SplitText as="h2" id="aj-lookbook" text="Lookbook" className="headline text-[clamp(36px,4.5vw,64px)]" />
        <p data-fade className="mono-label text-chrome-400 num pb-2 whitespace-nowrap">Plates 02 to {pad2(PLATES.length + 1)}</p>
      </div>
      <div data-fade className="mt-8 lg:mt-12">
        <FlexCarousel
          items={LOOKS}
          preset="liquid"
          intro="rise"
          cardHeight={0.5}
          gap={12}
          squeeze={0.2}
          focusOnClick
          captions
          firstNo={2}
          onOpen={onOpen}
          label="Lookbook"
        />
      </div>
    </section>
  );
}

function Music({ deck, onTrackChange }: { deck: React.Ref<CassetteHandle>; onTrackChange: (index: number, playing: boolean) => void }) {
  return (
    <section aria-labelledby="aj-music" className="frame py-16 lg:py-24 border-t border-obsidian-700">
      {/* The copy is set level with the middle of the deck rather than centred on the
          column, so it stays put when the track list opens under the deck */}
      <div className="grid-12 gap-y-10 items-start">
        <div data-fade className="lg:col-span-5 lg:pt-[clamp(72px,calc(20.3vw-131px),136px)]">
          <div className="flex items-center justify-between gap-4 border-b border-obsidian-700 pb-3">
            <span className="mono-label text-chrome-400">Listen</span>
            <span className="mono-label text-ember-400">Rap</span>
          </div>
          <h2 id="aj-music" className="headline mt-5 text-[clamp(36px,5vw,56px)]">
            The music
          </h2>
          <p className="mt-5 text-chrome-400 max-w-[36ch]">
            Press play for {TAPE[0].title}, or press the list key on the deck to pick from the {TAPE.length} songs on the tape. The videos are on her YouTube channel.
          </p>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-8">
            <YouTubeIcon />
            Listen on YouTube
          </a>
        </div>
        <div data-fade className="lg:col-start-7 lg:col-span-6 flex justify-center">
          <CassettePlayer ref={deck} tracks={TAPE} artist={NAME} onTrackChange={onTrackChange} />
        </div>
      </div>
    </section>
  );
}

// A single framed photograph that sits beside the copy, opened and drifted like the plates
function SidePlate({ photo, className = '', sizes }: { photo: AjPhoto; className?: string; sizes: string }) {
  return (
    <figure className={`relative border border-bone-100/[0.08] p-2 sm:p-3 bg-obsidian-950 ${className}`}>
      <Crops />
      <span data-plate className="relative block overflow-hidden bg-obsidian-900" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        <img
          src={photoSmall(photo)}
          srcSet={photoSrcSet(photo)}
          sizes={sizes}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-[108%] -top-[4%] object-cover"
        />
      </span>
    </figure>
  );
}

function Songs({ onTape, playOnTape }: { onTape: { index: number; playing: boolean }; playOnTape: (i: number) => void }) {
  return (
    <section aria-labelledby="aj-songs" className="frame py-20 lg:py-32 border-t border-obsidian-700">
      <div className="grid-12 gap-y-10 items-end">
        <div className="lg:col-span-7">
          <SplitText as="h2" id="aj-songs" text="Her songs" className="headline text-[clamp(44px,6.5vw,96px)]" />
          <p data-fade className="mt-5 text-[17px] leading-[1.7] text-chrome-400 max-w-[46ch]">
            Every track here is hers. Some she made alone; on the rest, the artists she made them with are named under the title.
          </p>
          <div data-fade className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="mono-label text-chrome-400 num">{pad2(SONG_COUNT)} tracks</span>
            <a href={APPLE_MUSIC_URL} target="_blank" rel="noopener noreferrer" className="text-link">
              All of them on Apple Music
              <ArrowUpRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
        <SidePlate photo={SONGS_PHOTO} className="lg:col-start-9 lg:col-span-4" sizes="(min-width: 1024px) 30vw, 100vw" />
      </div>

      <div className="mt-14 lg:mt-20">
        {SONGS.map((g) => (
          <div key={g.label} className="grid-12 border-t border-obsidian-700">
            <p data-fade className="lg:col-span-3 pt-6 lg:pt-9 flex items-baseline gap-3">
              <span className="mono-label text-ember-400">{g.label}</span>
              <span className="mono-label text-chrome-400 num">{pad2(g.tracks.length)}</span>
            </p>
            <ul className="lg:col-start-4 lg:col-span-9">
              {g.tracks.map((t, i) => (
                <li key={t.title} data-fade className={`py-6 lg:py-9 ${i > 0 ? 'border-t border-obsidian-700/60' : ''}`}>
                  <div className="flex items-baseline justify-between gap-6">
                    <h3 className="headline text-[clamp(34px,5vw,72px)] leading-[1] [overflow-wrap:anywhere]">{t.title}</h3>
                    {t.year && <span className="mono-label text-chrome-400 num shrink-0">{t.year}</span>}
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-x-6 gap-y-2">
                    {t.with && <span className="text-[15px] text-bone-100">with {t.with}</span>}
                    <span className="text-[15px] text-chrome-400 max-w-[52ch]">{t.note}</span>
                  </div>
                  {(tapeIndex(t.title) >= 0 || t.video) && (
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {tapeIndex(t.title) === onTape.index ? (
                        <span className="mono-label text-ember-400 flex items-center gap-2 min-h-11">
                          <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full bg-ember-400 ${onTape.playing ? 'animate-pulse' : ''}`} />
                          {onTape.playing ? 'Playing on the tape' : 'On the tape above'}
                        </span>
                      ) : (
                        tapeIndex(t.title) >= 0 && (
                          <button type="button" onClick={() => playOnTape(tapeIndex(t.title))} className="text-link">
                            <PlayIcon className="w-4 h-4" />
                            Play on the tape
                          </button>
                        )
                      )}
                      {t.video && (
                        <a href={t.video} target="_blank" rel="noopener noreferrer" className="text-link">
                          <YouTubeIcon className="w-5 h-5" />
                          Watch the video
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
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
              <span className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-void/70 text-bone-100 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
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
