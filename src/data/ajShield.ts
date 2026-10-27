// AJ Shield's page: who she is, her tracks, her photographs and the posts they came from.
// Plain data so the owner dashboard can edit it later without touching UI.
import { INSTAGRAM_URL } from './brand';

export interface AjPhoto {
  id: string;
  width: number;
  height: number;
  alt: string;
  /** ISO date of the Instagram post, when the photo is known to come from one */
  date?: string;
  /** The original post, when known */
  post?: string;
  /** Caption in the lookbook carousel */
  title?: string;
  subtitle?: string;
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

/** The lookbook plates: her photo folder, in the order they are numbered (the portrait is plate 01) */
export const PLATES: AjPhoto[] = [
  {
    id: 'suit',
    title: 'White suit',
    subtitle: 'Tinted glasses, a black coat on the shoulders',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield sitting on a step in a white suit and round tinted sunglasses, a long black coat over her shoulders, in warm orange light.',
  },
  {
    id: 'lounge',
    title: 'Violet lounge',
    subtitle: 'Lace halter, pleated cream',
    width: 1440,
    height: 1440,
    alt: 'AJ Shield leaning back on a tufted bed under violet light in a white lace halter top and a pleated cream skirt, looking into the camera.',
  },
  {
    id: 'doorway',
    title: 'Doorway',
    subtitle: 'White lace, one light',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield in a dark doorway, head thrown back and one arm raised, in a white lace top and a pleated cream skirt, lit from one side.',
  },
  {
    id: 'red-studio',
    title: 'Red room',
    subtitle: 'Crystal bandeau, white lace-ups',
    width: 1281,
    height: 1600,
    alt: 'Full-length portrait of AJ Shield on a red backdrop: short copper curls, a crystal bandeau top, a black flared mini skirt and white lace-up platform heels.',
  },
  {
    id: 'graffiti',
    title: 'Graffiti slip',
    subtitle: 'Grey fringe, pink print',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield seated in the corner of a room in a pale grey wig with a fringe and a pink slip dress printed with graffiti lettering, looking straight at the camera.',
  },
  {
    id: 'violet',
    title: 'Violet hour',
    subtitle: 'Lace halter, pleated cream',
    width: 1440,
    height: 1440,
    alt: 'AJ Shield sitting on a tufted bed under violet light in a white lace halter top and a pleated cream skirt, glancing back over her shoulder.',
  },
  {
    id: 'drape',
    title: 'White drape',
    subtitle: 'Bandeau and billowing cloth',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield in a grey studio with her arms curved over her head, in a white bandeau and a white fabric drape that billows out behind her.',
  },
  {
    id: 'knit',
    title: 'Cream knit',
    subtitle: 'Off the shoulder',
    width: 1080,
    height: 1350,
    alt: 'AJ Shield kneeling on a bed in a long grey wig with a fringe and an off-shoulder cream fluffy knit, looking into the camera.',
  },
  {
    id: 'stool',
    title: 'Red and teal',
    subtitle: 'Black dress, a glass of red',
    width: 1200,
    height: 1599,
    alt: 'AJ Shield on a tall metal stool in a black off-shoulder dress and strappy heels, head tipped back, raising a glass of red wine under red and teal light.',
  },
  {
    id: 'beanie',
    title: 'Winter black',
    subtitle: 'Beanie, gloves, knit scarf',
    width: 1280,
    height: 1600,
    alt: 'AJ Shield against a pale wall in a black beanie, a black off-shoulder mini dress and black gloves, a cream knit scarf wrapped across her arms.',
  },
];

const plate = (id: string) => PLATES.find((p) => p.id === id) as AjPhoto;

/** Her plate on the Shop: the style the rail is picked in */
export const STYLE_PLATE = plate('red-studio');

/** The six squares under Follow. Photos without a known post link to her profile. */
export const FOLLOW: AjPhoto[] = ['suit', 'lounge', 'graffiti', 'red-studio', 'violet', 'beanie'].map(plate);

export const postLink = (p: AjPhoto) => p.post ?? INSTAGRAM_URL;

/** "1 Dec 2025" */
export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Her track on the music cassette, with the music video's thumbnail as its art */
export const TRACK = {
  title: 'Mone Mone',
  audio: '/audio/mone-mone.mp3',
  art: '/aj-shield/mone-mone-art.webp',
  /** The tape is cued here, past the intro (seconds) */
  startAt: 13,
} as const;

/** Her story: an opening line, three short chapters and a closing note on the shop */
export const STORY = {
  lede: 'Anjali Ojha raps as AJ Shield. She’s from Assam, she puts out her own records, and she’s one of very few women leading hip-hop in the Northeast.',
  chapters: [
    {
      title: 'She says it straight',
      body: 'A lot of her songs go after something. With VAN M she made O Bhai and Nirbasonor Botor, about crooked politics, human rights and the people who get left behind. She raps in more than one language and none of it is softened.',
    },
    {
      title: 'Then it gets melodic',
      body: 'Mone Mone shows the other side of her: a slow Assamese single with a retro sci-fi video shot by Firefly Films. It’s the song on the tape further down.',
    },
    {
      title: 'What’s new',
      body: 'Jongholi came out in 2025. Dance Rati, a party track with Kid Pallav, followed in 2026, with a regional feel over heavy hip-hop drums. Most of her collaborations are mixed and mastered at Lucid Recess Studio in Guwahati.',
    },
  ],
  close: 'Pheonix is her shop. It isn’t her own label: it carries other people’s brands, picked the way she dresses.',
} as const;

/** The photograph beside her story */
export const STORY_PHOTO = plate('suit');

/** The photograph at the head of her songs */
export const SONGS_PHOTO = plate('lounge');

/** The liner notes beside her story */
export const FACTS: { label: string; value: string }[] = [
  { label: 'Real name', value: 'Anjali Ojha' },
  { label: 'From', value: 'Assam, India' },
  { label: 'Works with', value: 'VAN M, Striker, Kid Pallav' },
  { label: 'Studio', value: 'Lucid Recess, Guwahati' },
  { label: 'Videos', value: 'Firefly Films' },
];

export interface AjTrack {
  title: string;
  /** Who else is on it */
  with?: string;
  year?: number;
  /** One line on the track */
  note: string;
  /** The video, when we know which one it is */
  video?: string;
}

export interface AjTrackGroup {
  label: string;
  tracks: AjTrack[];
}

/** Her songs, grouped the way her story tells them: newest first */
export const SONGS: AjTrackGroup[] = [
  {
    label: 'Latest',
    tracks: [
      { title: 'Dance Rati', with: 'Kid Pallav', year: 2026, note: 'A party track. Regional feel, heavy hip-hop drums.' },
      { title: 'Jongholi', year: 2025, note: 'Her push into a bigger, wider sound.' },
    ],
  },
  {
    label: 'Solo',
    tracks: [
      {
        title: 'Mone Mone',
        note: 'Slow and melodic, in Assamese. The video is retro sci-fi, shot by Firefly Films.',
        video: 'https://youtu.be/mqwpF0rsJgk',
      },
    ],
  },
  {
    label: 'With VAN M',
    tracks: [
      { title: 'O Bhai', note: 'Aimed straight at corrupt politicians.' },
      { title: 'Nirbasonor Botor', with: 'Striker', note: 'Human rights, class, and who the region forgets.' },
    ],
  },
  {
    label: 'Collabs',
    tracks: [
      { title: 'Wake Up Again (Last Resort)', note: 'Gritty, street-level, no polish on it.' },
      { title: 'Mayday', note: 'A hard-edged collaboration.' },
    ],
  },
];

export const SONG_COUNT = SONGS.reduce((n, g) => n + g.tracks.length, 0);

export const APPLE_MUSIC_URL = 'https://music.apple.com/us/artist/aj-shield/1547183634';
