import React, { useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP } from '../lib/smoothScroll';
import type { TapeTrack } from '../data/ajShield';
import { CaptionsIcon, ListIcon, MuteIcon, PauseIcon, PlayIcon, RestartIcon, VolumeIcon } from './icons';
import './CassettePlayer.css';

interface CaptionTrack {
  readonly default?: boolean;
  readonly label: string;
  readonly src: string;
  readonly srcLang: string;
}

/** What the page can ask of the deck: put a song on and play it (call it from a tap, so phones allow the sound) */
export interface CassetteHandle {
  playTrack: (index: number) => void;
  /** The deck itself, to scroll to */
  element: HTMLElement | null;
}

interface CassettePlayerProps {
  /** The songs on the tape; the first is loaded to begin with. Each one's startAt is
   *  where it is cued: play, the back key and the end of the track all return there */
  tracks: readonly TapeTrack[];
  /** Printed above the title on the label */
  artist?: string;
  /** Which side of the tape the label names */
  side?: string;
  /** WebVTT captions, printed under the deck while the tape plays */
  captionTracks?: readonly CaptionTrack[];
  /** Told which song is loaded, and whether it is playing, each time either changes */
  onTrackChange?: (index: number, playing: boolean) => void;
  ref?: React.Ref<CassetteHandle>;
  className?: string;
}

/** "3:25" */
const clock = (seconds: number) => {
  const s = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// How far the tape pack reaches on each reel: 0 is the bare hub, 1 a full reel.
// Tape area follows the playhead, so the radius follows its square root.
const packs = (progress: number) => [Math.sqrt(1 - progress), Math.sqrt(progress)] as const;

/** Captions run hidden (we print the cue ourselves) or switch off entirely */
const showCaptions = (track: TextTrack, on: boolean) => {
  track.mode = on ? 'hidden' : 'disabled';
};

// The deck is drawn at this size and scaled to fit its column
const STAGE_W = 600;

// The resting pose: turned a little toward the copy on its left, seen from just above
const POSE = { rx: -12, ry: -18 };

interface DeckKeyProps {
  label: string;
  onClick: () => void;
  /** For keys that switch something on: reported to screen readers */
  pressed?: boolean;
  /** Held down, as play is while the tape runs */
  latched?: boolean;
  play?: boolean;
  /** For a key that opens something: whether it is open, and its id */
  expanded?: boolean;
  controls?: string;
  children: React.ReactNode;
}

// A piano key: its face is the button, with a top and a side to give it body
const DeckKey: React.FC<DeckKeyProps> = ({ label, onClick, pressed, latched, play, expanded, controls, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={pressed}
    aria-expanded={expanded}
    aria-controls={controls}
    className={`deck-key ${play ? 'deck-key-play' : ''} ${latched ? 'is-latched' : ''}`}
  >
    <span aria-hidden="true" className="deck-key-top" />
    <span aria-hidden="true" className="deck-key-side" />
    {children}
  </button>
);

// A portable tape deck in 3D: a graphite body with depth, a recessed window
// behind smoked glass with the cassette sitting inside it (paper label, reels
// that turn while the tape runs, the smaller pack spinning faster as on a
// real deck), piano keys on the top edge that sink when pressed and latch
// while they hold, a tape counter and a seek groove on the front. The deck
// leans toward the pointer and turns a little as the page scrolls past it.
// The list key opens the tape's track list under the deck; picking a song
// lifts the cassette out and drops it back in with the new label.
export const CassettePlayer: React.FC<CassettePlayerProps> = ({
  tracks,
  artist,
  side = 'A',
  captionTracks,
  onTrackChange,
  ref,
  className = '',
}) => {
  // The song in the player, and the one printed on the label: the label
  // changes while the cassette is out of sight, a moment after the sound does
  const [index, setIndex] = useState(0);
  const [labelIndex, setLabelIndex] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const track = tracks[index];
  const startAt = track.startAt ?? 0;
  const trackTitle = tracks[labelIndex].title;
  const artworkSrc = tracks[labelIndex].art;
  const listId = useId();
  const list = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const tape = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const hubs = useRef<(HTMLSpanElement | null)[]>([]);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(startAt);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const captionIndex = Math.max(0, captionTracks?.findIndex((t) => t.default) ?? 0);
  const hasCaptions = !!captionTracks?.length;
  const [captionsOn, setCaptionsOn] = useState(() => captionTracks?.some((t) => t.default) ?? false);
  const [cue, setCue] = useState('');

  // The first song goes in once; every later one is put in by load() below
  useLayoutEffect(() => {
    const a = audio.current;
    if (a && !a.getAttribute('src')) a.src = tracks[0].audio;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => onTrackChange?.(index, playing), [index, playing, onTrackChange]);

  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const [packL, packR] = packs(progress);

  // The deck is built at a fixed size; scale it to the width it is given
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fit = () => el.style.setProperty('--k', String(el.clientWidth / STAGE_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The deck leans toward the pointer and turns as the page scrolls past;
  // the cassette drops into the well the first time the deck comes into view
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = body.current;
        const st = stage.current;
        if (!el || !st) return;
        const pose = { x: 0, y: 0, s: 0.5 };
        const apply = () => {
          const rx = POSE.rx + (pose.s - 0.5) * 10 - pose.y * 6;
          const ry = POSE.ry + (pose.s - 0.5) * 14 + pose.x * 10;
          el.style.setProperty('--rx', `${rx}deg`);
          el.style.setProperty('--ry', `${ry}deg`);
          // The glare on the glass slides as the deck turns
          el.style.setProperty('--glare', `${(ry - POSE.ry) * 2.4}%`);
        };
        const toX = gsap.quickTo(pose, 'x', { duration: 0.9, ease: 'power3.out', onUpdate: apply });
        const toY = gsap.quickTo(pose, 'y', { duration: 0.9, ease: 'power3.out', onUpdate: apply });
        gsap.fromTo(pose, { s: 0 }, { s: 1, ease: 'none', onUpdate: apply, scrollTrigger: { trigger: st, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
        gsap.from(tape.current, { yPercent: -112, duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: st, start: 'top 70%', once: true } });

        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return;
          const r = st.getBoundingClientRect();
          toX(((e.clientX - r.left) / r.width) * 2 - 1);
          toY(((e.clientY - r.top) / r.height) * 2 - 1);
        };
        const leave = () => {
          toX(0);
          toY(0);
        };
        st.addEventListener('pointermove', move);
        st.addEventListener('pointerleave', leave);
        return () => {
          st.removeEventListener('pointermove', move);
          st.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: stage }
  );

  // While the tape runs, turn the reels every frame. The counter, the packs and
  // the groove follow timeupdate (about 4 a second), so the deck isn't re-rendered
  // 60 times a second
  useEffect(() => {
    if (!playing || prefersReducedMotion) return;
    let raf = 0;
    let last = performance.now();
    const angles = [0, 0];
    const tick = (now: number) => {
      const a = audio.current;
      if (a) {
        const dt = Math.min(64, now - last);
        const p = a.duration > 0 ? a.currentTime / a.duration : 0;
        // Tape moves at a constant speed, so a reel turns faster the less tape it holds
        packs(p).forEach((pack, i) => {
          angles[i] = (angles[i] + (dt * 0.12) / (0.45 + pack)) % 360;
          const hub = hubs.current[i];
          if (hub) hub.style.transform = `rotate(${angles[i]}deg)`;
        });
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Captions: the chosen track runs hidden and its live cue is printed under the deck
  useEffect(() => {
    const track = audio.current?.textTracks[captionIndex];
    if (!track || !hasCaptions) return;
    showCaptions(track, captionsOn);
    const onCue = () => {
      const cues = track.activeCues;
      setCue(cues && cues.length ? Array.from(cues, (c) => (c as VTTCue).text).join(' ') : '');
    };
    track.addEventListener('cuechange', onCue);
    return () => track.removeEventListener('cuechange', onCue);
  }, [captionIndex, captionsOn, hasCaptions]);

  // The phone's lock screen and media keys show the track and its art
  useEffect(() => {
    if (!playing || !('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.with ? `${artist} with ${track.with}` : artist,
      artwork: [{ src: track.art }],
    });
    // The lock screen's skip buttons step through the tape
    try {
      navigator.mediaSession.setActionHandler('nexttrack', () => load((index + 1) % tracks.length, true));
      navigator.mediaSession.setActionHandler('previoustrack', () => load((index - 1 + tracks.length) % tracks.length, true));
    } catch {
      // a browser without track actions keeps its own buttons
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, track, artist]);

  // Once the length is known, cue the tape to its start point if it hasn't moved yet
  const readDuration = (a: HTMLAudioElement) => {
    if (!Number.isFinite(a.duration) || a.duration <= 0) return;
    setDuration(a.duration);
    if (a.currentTime === 0 && startAt > 0 && startAt < a.duration) a.currentTime = startAt;
  };

  // A cached track can report its length before React is listening: read it on mount too
  useEffect(() => {
    if (audio.current) readDuration(audio.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cueUp = (a: HTMLAudioElement) => {
    a.currentTime = startAt;
    setTime(startAt);
  };

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      if (a.ended || a.currentTime === 0) cueUp(a);
      a.play().catch((e: DOMException) => {
        if (e.name !== 'AbortError') setFailed(true);
      });
    } else {
      a.pause();
    }
  };

  const restart = () => {
    const a = audio.current;
    if (a) cueUp(a);
  };

  const toggleMute = () => {
    if (audio.current) audio.current.muted = !audio.current.muted;
  };

  // Put another song in. The sound changes at once, inside the tap, so phones
  // let it play; the cassette lifts out, takes its new label, and drops back in.
  const load = (i: number, play: boolean) => {
    const a = audio.current;
    const next = tracks[i];
    if (!a || !next) return;
    if (i === index) {
      if (play && a.paused) toggle();
      return;
    }
    a.src = next.audio;
    setIndex(i);
    setTime(next.startAt ?? 0);
    setDuration(0);
    setFailed(false);
    if (play) {
      a.play().catch((e: DOMException) => {
        if (e.name !== 'AbortError') setFailed(true);
      });
    }
    const el = tape.current;
    if (!el || prefersReducedMotion) {
      setLabelIndex(i);
      return;
    }
    gsap
      .timeline()
      .to(el, { yPercent: -112, duration: 0.45, ease: 'power3.in', overwrite: true })
      .add(() => setLabelIndex(i))
      .to(el, { yPercent: 0, duration: 0.75, ease: 'power3.out', delay: 0.05 });
  };

  useImperativeHandle(ref, () => ({ playTrack: (i: number) => load(i, true), element: stage.current }));

  // The list slides open under the deck, and closes the same way
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    if (listOpen) {
      el.hidden = false;
      if (!prefersReducedMotion) gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.out', overwrite: true });
    } else if (!el.hidden) {
      if (prefersReducedMotion) el.hidden = true;
      else gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: 'power3.in', overwrite: true, onComplete: () => { el.hidden = true; } });
    }
  }, [listOpen]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audio.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
    setTime(a.currentTime);
  };

  return (
    <div className={`deck-wrap ${className}`}>
      <div
        ref={stage}
        role="group"
        aria-label={`Cassette player: ${trackTitle}${artist ? ` by ${artist}` : ''}`}
        className={`deck-stage ${playing ? 'is-playing' : ''}`}
      >
        <div className="deck-scale">
          <span aria-hidden="true" className="deck-floor" />

          <div ref={body} className="deck-body">
            {/* The five other sides of the box */}
            <span aria-hidden="true" className="deck-face deck-back" />
            <span aria-hidden="true" className="deck-face deck-bottom" />
            <span aria-hidden="true" className="deck-face deck-left">
              <span className="deck-jack" />
            </span>
            <span aria-hidden="true" className="deck-face deck-right">
              <span className="deck-wheel" />
            </span>
            <span aria-hidden="true" className="deck-face deck-top" />

            {/* First in the source so focus reaches the keys before the seek groove below them */}
            <div className="deck-keys">
              <DeckKey label="Back to the start" onClick={restart}>
                <RestartIcon className="deck-key-icon" />
              </DeckKey>
              <DeckKey label={playing ? 'Pause' : 'Play'} onClick={toggle} latched={playing} play>
                {playing ? <PauseIcon className="deck-key-icon" /> : <PlayIcon className="deck-key-icon" />}
              </DeckKey>
              <DeckKey label="Mute" onClick={toggleMute} pressed={muted} latched={muted}>
                {muted ? <MuteIcon className="deck-key-icon" /> : <VolumeIcon className="deck-key-icon" />}
              </DeckKey>
              {tracks.length > 1 && (
                <DeckKey label="Track list" onClick={() => setListOpen((o) => !o)} expanded={listOpen} controls={listId} latched={listOpen}>
                  <ListIcon className="deck-key-icon" />
                </DeckKey>
              )}
              {hasCaptions && (
                <DeckKey label="Captions" onClick={() => setCaptionsOn((on) => !on)} pressed={captionsOn} latched={captionsOn}>
                  <CaptionsIcon className="deck-key-icon" />
                </DeckKey>
              )}
            </div>

            <div className="deck-front">
              {/* The well behind the glass, its four walls, and the cassette in it */}
              <div aria-hidden="true" className="deck-well">
                <div ref={tape} className="tape">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={`tape-screw tape-screw-${i}`} />
                  ))}
                  <div className="tape-label">
                    <div className="tape-head">
                      {artworkSrc && <img className="tape-art" src={artworkSrc} width={538} height={272} alt="" loading="lazy" decoding="async" />}
                      <div>
                        {artist && <p className="tape-artist">{artist}</p>}
                        <p className="tape-title">{trackTitle}</p>
                      </div>
                      <div className="tape-meta">
                        <span className="tape-side">Side {side}</span>
                        <span className="tape-length num">{duration ? clock(duration) : '--:--'}</span>
                      </div>
                    </div>
                    <div className="tape-band">
                      <span className="tape-cut">
                        <span className="tape-pack tape-pack-l" style={{ '--pack': packL } as React.CSSProperties} />
                        <span className="tape-pack tape-pack-r" style={{ '--pack': packR } as React.CSSProperties} />
                        <span className="tape-hub tape-hub-l" ref={(el) => { hubs.current[0] = el; }} />
                        <span className="tape-hub tape-hub-r" ref={(el) => { hubs.current[1] = el; }} />
                      </span>
                    </div>
                  </div>
                  <span className="tape-ridge">
                    <span className="tape-hole tape-hole-l" />
                    <span className="tape-gate" />
                    <span className="tape-hole tape-hole-r" />
                  </span>
                </div>
              </div>
              <span aria-hidden="true" className="deck-wall deck-wall-top" />
              <span aria-hidden="true" className="deck-wall deck-wall-bottom" />
              <span aria-hidden="true" className="deck-wall deck-wall-left" />
              <span aria-hidden="true" className="deck-wall deck-wall-right" />
              <span aria-hidden="true" className="deck-glass" />

              {/* The front plate, cut around the window */}
              <span aria-hidden="true" className="deck-plate" />
              <span aria-hidden="true" className="deck-bezel" />
              {[0, 1, 2, 3].map((i) => (
                <span key={i} aria-hidden="true" className={`deck-screw deck-screw-${i}`} />
              ))}

              <div className="deck-topbar" aria-hidden="true">
                <span className="deck-mark wordmark">Pheonix</span>
                <span className="deck-led" />
              </div>

              <div className="deck-strip">
                <span className="deck-counter num" aria-hidden="true">
                  {clock(time)}
                </span>
                <input
                  type="range"
                  className="deck-seek"
                  min={0}
                  max={duration || 0}
                  step={1}
                  value={Math.min(time, duration || 0)}
                  onChange={seek}
                  disabled={!duration}
                  aria-label="Seek"
                  aria-valuetext={`${clock(time)} of ${clock(duration)}`}
                  style={{ '--progress': `${progress * 100}%` } as React.CSSProperties}
                />
                <span className="deck-total num">{failed ? 'No track' : clock(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Its src is set by hand (see load), so a re-render never reloads the song mid-play */}
        <audio
          ref={audio}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={(e) => {
            // The next song plays on; after the last, the tape goes back to the first and stops
            if (index < tracks.length - 1) load(index + 1, true);
            else if (index > 0) load(0, false);
            else {
              setPlaying(false);
              cueUp(e.currentTarget);
            }
          }}
          onDurationChange={(e) => readDuration(e.currentTarget)}
          onLoadedMetadata={(e) => readDuration(e.currentTarget)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          onError={() => setFailed(true)}
        >
          {captionTracks?.map((t) => (
            <track key={t.src} kind="captions" label={t.label} src={t.src} srcLang={t.srcLang} default={t.default} />
          ))}
        </audio>
      </div>
      {failed && <p className="deck-note">The track couldn’t load. It’s on her YouTube channel.</p>}

      {/* The track list, printed like the card inside a cassette case */}
      {tracks.length > 1 && (
        <div ref={list} id={listId} hidden className="tape-list">
          <div className="tape-list-head">
            <span>Side {side}</span>
            <span className="num">{String(tracks.length).padStart(2, '0')} songs</span>
          </div>
          <ol>
            {tracks.map((t, i) => {
              const on = i === index;
              return (
                <li key={t.audio}>
                  <button type="button" onClick={() => load(i, true)} aria-current={on ? 'true' : undefined} className={`tape-list-row ${on ? 'is-on' : ''}`}>
                    <span className="tape-list-no num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="tape-list-name">
                      <span className="tape-list-title">{t.title}</span>
                      {t.with && <span className="tape-list-with">with {t.with}</span>}
                    </span>
                    {on && playing ? (
                      <span className="tape-list-eq" role="img" aria-label="Playing">
                        <span /><span /><span />
                      </span>
                    ) : (
                      <span className="tape-list-len num">{t.length}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      {hasCaptions && captionsOn && <p className="deck-cue">{cue}</p>}
    </div>
  );
};
