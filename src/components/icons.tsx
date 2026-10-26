import React from 'react';

// The site's own icon set: one fine stroke, round joins, drawn on a 24 grid
type IconProps = { className?: string };

const Line: React.FC<IconProps & { children: React.ReactNode }> = ({ className = 'w-5 h-5', children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const CloseIcon: React.FC<IconProps> = (p) => <Line {...p}><path d="M5 5l14 14M19 5L5 19" /></Line>;
export const PlusIcon: React.FC<IconProps> = (p) => <Line {...p}><path d="M12 4v16M4 12h16" /></Line>;
export const MinusIcon: React.FC<IconProps> = (p) => <Line {...p}><path d="M4 12h16" /></Line>;
export const ArrowUpRightIcon: React.FC<IconProps> = (p) => <Line {...p}><path d="M7 17 17 7M8 7h9v9" /></Line>;
export const ArrowLeftIcon: React.FC<IconProps> = (p) => <Line {...p}><path d="M21 12H4M10 6l-6 6 6 6" /></Line>;

// Dock icons
export const HomeIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z" /></Line>
);
export const HangerIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M10 7a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9V11M12 11l-9 6.2V19h18v-1.8z" /></Line>
);
export const BookIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13" /></Line>
);
export const BagIcon: React.FC<IconProps> = (p) => (
  <Line {...p}><path d="M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8" /></Line>
);
export const InstagramIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </Line>
);
export const YouTubeIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
    <path d="M10 9.2v5.6l4.8-2.8z" />
  </Line>
);
export const WhatsAppIcon: React.FC<IconProps> = (p) => (
  <Line {...p}>
    <path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.5 12z" />
    <path d="M9.2 8.2c-.4 2.9 2.4 6.4 5.8 6.6l1.1-1.3-1.9-1.2-.9.7c-1-.4-2-1.4-2.4-2.4l.7-.9-1.1-1.9z" />
  </Line>
);
