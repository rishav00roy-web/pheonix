import React from 'react';
import { TLink } from '../lib/transition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { BrandLogo } from '../components/BrandLogo';

/** Any address the house does not know, including a piece that has gone. */
export const NotFound: React.FC<{ what?: string }> = ({ what = 'page' }) => {
  useDocumentTitle('Not found');
  return (
    <section aria-labelledby="missing-title" className="section min-h-[70svh]">
      <div className="frame flex flex-col items-center text-center">
        <BrandLogo className="w-40 lg:w-56 h-auto" />
        <h1 id="missing-title" className="headline mt-10 text-[clamp(48px,7vw,112px)]">
          Not here
        </h1>
        <p className="mt-6 max-w-[38ch] text-chrome-400">
          {what === 'piece'
            ? 'That piece is not in the shop. It may have sold out or moved.'
            : 'There is nothing at this address. The link may be old or mistyped.'}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <TLink to="/shop" className="btn btn-primary">
            Shop the collection
          </TLink>
          <TLink to="/" className="btn btn-line">
            Home
          </TLink>
        </div>
      </div>
    </section>
  );
};
