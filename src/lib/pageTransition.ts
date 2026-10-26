import { createContext, useContext } from 'react';

// Shared state for the page transition (the provider lives in transition.tsx).

interface TransitionApi {
  go: (to: string) => void;
}

export const TransitionContext = createContext<TransitionApi>({ go: () => {} });

export const useTransition = () => useContext(TransitionContext);

// True while the panel is lifting off a freshly mounted page, so that page
// can hold its entrance until the panel clears
let lifting = false;
export const setLifting = (on: boolean) => {
  lifting = on;
};
/** Seconds a page should wait before its entrance animation. */
export const entranceDelay = () => (lifting ? 0.7 : 0.15);

/** The panel tells the window as it starts to rise ('cover') and to lift ('reveal'). */
export const announce = (name: 'cover' | 'reveal') => window.dispatchEvent(new Event(`pheonix:${name}`));
