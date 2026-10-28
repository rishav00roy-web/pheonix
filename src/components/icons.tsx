import React from 'react';

// The house icon set. One hairline drawn on a 24 grid: round caps and joins,
// soft 1.5 corners, and a stroke that stays the same hairline at every size
// (non-scaling), so a 16px arrow and a 24px dock icon carry the same weight.
// Solid marks (play, pause, the dots) are used sparingly, as accents.
// Icons never shrink, so a long label beside one can't squeeze it.
type IconProps = { className?: string };

const Line: React.FC<IconProps & { children: React.ReactNode }> = ({ className = 'w-5 h-5', children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    shapeRendering="geometricPrecision"
    className={`icon shrink-0 ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

/** A small solid mark inside a line icon */
const Dot: React.FC<{ cx: number; cy: number; r?: number }> = ({ cx, cy, r = 0.9 }) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

// Interface
export const CloseIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></Line>
);
export const PlusIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M12 5.5v13M5.5 12h13" /></Line>
);
export const MinusIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M5.5 12h13" /></Line>
);
export const ArrowUpRightIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M7 17 17 7M9.5 7H17v7.5" /></Line>
);
export const ArrowLeftIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M19.5 12h-15M9.5 7l-5 5 5 5" /></Line>
);

// Dock
/** Home: a gabled house with an arched door, on a ground line */
export const HomeIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M3.5 20h17M5.5 20V10.2L12 4.8l6.5 5.4V20" />
    <path d="M10 20v-4a2 2 0 0 1 4 0v4" />
  </Line>
);
/** Shop: a hanger with a curled hook */
export const HangerIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M10 6.6a2 2 0 1 1 2.75 1.85c-.45.2-.75.62-.75 1.1v.95" />
    <path d="M12 10.5 3.8 16.3a.9.9 0 0 0 .52 1.63h15.36a.9.9 0 0 0 .52-1.63z" />
  </Line>
);
/** Story: an open book with a ribbon marker */
export const BookIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M12 7c-1.9-1.4-4.6-1.9-7.5-1.6v12.7c2.9-.3 5.6.2 7.5 1.6 1.9-1.4 4.6-1.9 7.5-1.6V5.4c-2.9-.3-5.6.2-7.5 1.6zM12 7v12.7" />
    <path d="M15.5 5.6v4.6l1.25-1 1.25 1V5.45" />
  </Line>
);
/** Bag: a structured shopping bag with rope handles and rivets */
export const BagIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M5.2 8.5h13.6l-.85 11.1a1.5 1.5 0 0 1-1.5 1.4H7.55a1.5 1.5 0 0 1-1.5-1.4z" />
    <path d="M9 11V7a3 3 0 0 1 6 0v4" />
    <Dot cx={9} cy={11.2} r={0.75} />
    <Dot cx={15} cy={11.2} r={0.75} />
  </Line>
);

// Social
export const InstagramIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.75" />
    <circle cx="12" cy="12" r="3.6" />
    <Dot cx={16.6} cy={7.4} r={0.85} />
  </Line>
);
export const YouTubeIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M3.6 8.6c.1-1.5 1.2-2.6 2.7-2.7C8 5.8 10 5.75 12 5.75s4 .05 5.7.15c1.5.1 2.6 1.2 2.7 2.7.1 1.1.15 2.25.15 3.4s-.05 2.3-.15 3.4c-.1 1.5-1.2 2.6-2.7 2.7-1.7.1-3.7.15-5.7.15s-4-.05-5.7-.15c-1.5-.1-2.6-1.2-2.7-2.7C3.5 14.3 3.45 13.15 3.45 12s.05-2.3.15-3.4z" />
    <path d="M10.4 9.4v5.2l4.4-2.6z" fill="currentColor" />
  </Line>
);
export const WhatsAppIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M5.1 16.3A8 8 0 1 1 8 19.1L4 20z" />
    <path d="M9.35 8.4c-.35 2.85 2.4 6.2 5.75 6.35l.95-1.15-1.8-1.1-.85.6c-.95-.4-1.9-1.35-2.3-2.3l.6-.85-1.1-1.8z" />
  </Line>
);

// Cassette deck
export const PlayIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M8.5 6.3v11.4a.6.6 0 0 0 .9.5l9-5.7a.6.6 0 0 0 0-1l-9-5.7a.6.6 0 0 0-.9.5z" fill="currentColor" /></Line>
);
export const PauseIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <rect x="7.8" y="6" width="2.2" height="12" rx="0.5" fill="currentColor" />
    <rect x="14" y="6" width="2.2" height="12" rx="0.5" fill="currentColor" />
  </Line>
);
/** Back to the start: a stop bar and a left-pointing head */
export const RestartIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M6.5 6.5v11" />
    <path d="M17.5 7.1v9.8a.6.6 0 0 1-.92.5L9.6 12.5a.6.6 0 0 1 0-1l6.98-4.9a.6.6 0 0 1 .92.5z" />
  </Line>
);
export const VolumeIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M4.5 10v4a1 1 0 0 0 1 1h2.6l4.4 3.6V5.4L8.1 9H5.5a1 1 0 0 0-1 1z" />
    <path d="M15.6 9.4a3.7 3.7 0 0 1 0 5.2M18.2 6.9a7.3 7.3 0 0 1 0 10.2" />
  </Line>
);
export const MuteIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M4.5 10v4a1 1 0 0 0 1 1h2.6l4.4 3.6V5.4L8.1 9H5.5a1 1 0 0 0-1 1z" />
    <path d="M15.8 9.8l4.4 4.4M20.2 9.8l-4.4 4.4" />
  </Line>
);
export const ListIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M9 7h11M9 12h11M9 17h11" />
    <circle cx="4.6" cy="7" r="0.9" fill="currentColor" />
    <circle cx="4.6" cy="12" r="0.9" fill="currentColor" />
    <circle cx="4.6" cy="17" r="0.9" fill="currentColor" />
  </Line>
);
export const CaptionsIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="M10.6 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6" />
  </Line>
);
