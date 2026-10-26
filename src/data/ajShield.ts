// AJ Shield's page: her photographs and the posts they came from.
// Plain data so the owner dashboard can edit it later without touching UI.
// Only what her own posts show is written here; anything else stays a marked placeholder.
import { INSTAGRAM_URL } from './brand';
export { YOUTUBE_URL } from './brand';


export interface AjPhoto {
  id: string;
  width: number;
  height: number;
  alt: string;
  /** ISO date of the Instagram post, when the photo is known to come from one */
  date?: string;
  /** The original post, when known */
  post?: string;
}

const dir = '/aj-shield';
export const photoSrc = (p: AjPhoto) => `${dir}/aj-${p.id}.webp`;
export const photoSmall = (p: AjPhoto) => `${dir}/aj-${p.id}-sm.webp`;
export const photoSquare = (p: AjPhoto) => `${dir}/aj-${p.id}-sq.webp`;
/** srcset for the 800px and full-size files */
export const photoSrcSet = (p: AjPhoto) => {
  const small = Math.round((p.width * 800) / Math.max(p.width, p.height));
  return `${photoSmall(p)} ${small}w, ${photoSrc(p)} ${p.width}w`;
};

/** The opening portrait */
export const PORTRAIT: AjPhoto = {
  id: 'crown',
  width: 1280,
  height: 1600,
  alt: 'AJ Shield in a long grey wig crowned with baby’s breath, pearl dots across her face and neck, a leopard-print dress and black opera gloves, against blurred green trees.',
};

/** The lookbook plates, in the order they are numbered (the portrait is plate 01) */
export const PLATES: AjPhoto[] = [
  {
    id: 'saree',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield in bridal styling, eyes lowered: a pink silk saree, a gold choker and long gold necklace, a maang tikka, a nose ring and stacked bangles, lit in warm orange.',
    date: '2025-12-01',
    post: 'https://www.instagram.com/p/DRt3FDik63C/',
  },
  {
    id: 'doorway',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield in a dark doorway, head thrown back and one arm raised, in a white lace top and a pleated cream skirt, lit from one side.',
  },
  {
    id: 'red-studio',
    width: 1281,
    height: 1600,
    alt: 'Full-length portrait of AJ Shield on a red backdrop: short copper curls, a crystal bandeau top, a black flared mini skirt and white lace-up platform heels.',
  },
  {
    id: 'graffiti',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield seated in the corner of a room in a pale grey wig with a fringe and a pink slip dress printed with graffiti lettering, looking straight at the camera.',
  },
  {
    id: 'violet',
    width: 1440,
    height: 1440,
    alt: 'AJ Shield sitting on a tufted bed under violet light in a white lace halter top and a pleated cream skirt, glancing back over her shoulder.',
  },
  {
    id: 'drape',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield in a grey studio with her arms curved over her head, in a white bandeau and a white fabric drape that billows out behind her.',
  },
  {
    id: 'knit',
    width: 1080,
    height: 1350,
    alt: 'AJ Shield kneeling on a bed in a long grey wig with a fringe and an off-shoulder cream fluffy knit, looking into the camera.',
  },
  {
    id: 'stool',
    width: 1200,
    height: 1599,
    alt: 'AJ Shield on a tall metal stool in a black off-shoulder dress and strappy heels, head tipped back, raising a glass of red wine under red and teal light.',
  },
  {
    id: 'beanie',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield against a pale wall in a black beanie, a black off-shoulder mini dress and black gloves, a cream knit scarf wrapped across her arms.',
  },
];

const DUO: AjPhoto = {
  id: 'duo',
  width: 1280,
  height: 1600,
  alt: 'Collaboration post: two women in white suits with long coats and round tinted sunglasses, posing on a staircase in warm orange light.',
  date: '2025-03-25',
  post: 'https://www.instagram.com/p/DHn1WXZh_uv/',
};

const plate = (id: string) => PLATES.find((p) => p.id === id) as AjPhoto;

/** The six squares under Follow. Photos without a known post link to her profile. */
export const FOLLOW: AjPhoto[] = [DUO, plate('saree'), plate('graffiti'), plate('red-studio'), plate('violet'), plate('beanie')];

export const postLink = (p: AjPhoto) => p.post ?? INSTAGRAM_URL;

/** "1 Dec 2025" */
export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const pad2 = (n: number) => String(n).padStart(2, '0');
