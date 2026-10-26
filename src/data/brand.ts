// The house's own words and addresses, restored from the original site.
// Plain data so the owner dashboard can edit it later without touching UI.
import { whatsappLink } from '../lib/bag';

export const BRAND = {
  name: 'Pheonix',
  founder: 'AJ Shield',
  tagline: 'Bars from the hills. Threads for the street.',
  bio: 'A personal clothing label by AJ Shield — Assamese rapper, artist, and creator from Jorhat, Assam. Designed for those who carry their roots into every room they walk into.',
  origin: { city: 'Jorhat, Assam', country: 'India', native: 'যোৰহাট' },
  credit: 'Made by Atelier Systems',
  /** [Placeholder] campaign line on Home: replace with the house's own */
  campaignLine: 'Made in Jorhat, worn with intent.',
} as const;

export const INSTAGRAM_URL = 'https://www.instagram.com/aj_shiield/';
export const YOUTUBE_URL = 'https://www.youtube.com/@ajshield6480';

export const SOCIAL = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'YouTube', href: YOUTUBE_URL },
  { label: 'WhatsApp', href: whatsappLink() },
] as const;
