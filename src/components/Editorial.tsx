import React from 'react';

// The editorial marks shared by the pages: the specimen card's corner crop
// marks, and the ember hairline with its diamond from the Home hero.

/** Corner crop marks, for anything framed as a plate */
export const Crops: React.FC = () => (
  <>
    <span aria-hidden="true" className="crop crop-tl">┌</span>
    <span aria-hidden="true" className="crop crop-tr">┐</span>
    <span aria-hidden="true" className="crop crop-bl">└</span>
    <span aria-hidden="true" className="crop crop-br">┘</span>
  </>
);

/** The ember hairline with its diamond; it draws in from the left (GSAP targets .rule) */
export const Rule: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`rule ${className}`}>
    <span className="rule-diamond">◆</span>
  </div>
);
