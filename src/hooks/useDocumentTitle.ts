import { useEffect } from 'react';

const HOUSE = 'PHEONIX';
const DEFAULT_TITLE = `${HOUSE} | Founded in Jorhat by AJ Shield`;

const descriptionTag = () => document.querySelector<HTMLMetaElement>('meta[name="description"]');
// The house description from index.html, put back when a page with its own leaves
const DEFAULT_DESCRIPTION = typeof document !== 'undefined' ? (descriptionTag()?.content ?? '') : '';

/** Sets the tab title for a page; null keeps the house title. A description replaces the meta description while the page is open. */
export function useDocumentTitle(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${HOUSE}` : DEFAULT_TITLE;
  }, [title]);

  useEffect(() => {
    const tag = descriptionTag();
    if (!description || !tag) return;
    tag.content = description;
    return () => {
      tag.content = DEFAULT_DESCRIPTION;
    };
  }, [description]);
}
