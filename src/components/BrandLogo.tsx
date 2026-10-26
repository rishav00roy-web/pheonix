import React from 'react';

/** The house crest: the chrome phoenix (transparent WebP, 951 × 565). */
const LOGO = { src: '/brand/logo.webp', small: '/brand/logo-sm.webp' };

interface BrandLogoProps {
  className?: string;
  /** Use the 240px copy (header, drawer, footer) */
  small?: boolean;
  /** Empty for a logo that sits beside the wordmark or a label */
  alt?: string;
  priority?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', small = false, alt = '', priority = false }) => (
  <img
    src={small ? LOGO.small : LOGO.src}
    alt={alt}
    width={small ? 240 : 951}
    height={small ? 143 : 565}
    draggable={false}
    decoding="async"
    fetchPriority={priority ? 'high' : undefined}
    className={`select-none object-contain ${className}`}
  />
);

/** The crest and the wordmark side by side: the house signature. */
export const Signature: React.FC<{ logoClassName?: string; wordClassName?: string }> = ({
  logoClassName = 'h-8 lg:h-10 w-auto',
  wordClassName = 'text-[28px] lg:text-[34px]',
}) => (
  <span className="flex items-center gap-3 lg:gap-4">
    <BrandLogo small className={logoClassName} />
    <span className={`wordmark pt-1 ${wordClassName}`}>Pheonix</span>
  </span>
);
