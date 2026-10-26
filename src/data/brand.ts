// The house's own words and addresses, restored from the original site.
// Plain data so the owner dashboard can edit it later without touching UI.
import { whatsappLink } from '../lib/bag';

export const BRAND = {
  name: 'Pheonix',
  founder: 'AJ Shield',
  tagline: 'Bars from the hills. Threads for the street.',
  bio: 'A streetwear shop by AJ Shield, Assamese rapper, artist and model from Jorhat, Assam. Different brands, each piece picked in her style, for those who carry their roots into every room they walk into.',
  /** The footer's short line: what the shop is and how to order */
  summary: 'Streetwear from different brands, picked in AJ Shield’s style. Every order is placed on WhatsApp.',
  origin: { city: 'Jorhat, Assam', country: 'India', native: 'যোৰহাট' },
  credit: 'Made by Atelier Systems',
  /** [Placeholder] campaign line on Home: replace with the house's own */
  campaignLine: 'Picked in Jorhat, worn with intent.',
} as const;

export const INSTAGRAM_URL = 'https://www.instagram.com/aj_shiield/';
export const YOUTUBE_URL = 'https://www.youtube.com/@ajshield6480';

export const SOCIAL = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'YouTube', href: YOUTUBE_URL },
  { label: 'WhatsApp', href: whatsappLink() },
] as const;
