import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap, jumpToTop, prefersReducedMotion, queueRefresh } from './smoothScroll';
import { BrandLogo } from '../components/BrandLogo';
import { announce, setLifting, TransitionContext, useTransition } from './pageTransition';

// Page transition: a black panel with the chrome crest rises over the page,
// the route swaps underneath it, then the panel lifts away. Transform only.
// Under reduced motion routes swap instantly.
//
// The panel announces itself on window: 'pheonix:cover' as it starts to rise
// and 'pheonix:reveal' as it starts to lift, so the dock can step aside.

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const panel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const covered = useRef(false);

  const go = useCallback(
    (to: string) => {
      const here = location.pathname + location.search;
      if (to === here) {
        jumpToTop();
        return;
      }
      const samePath = to.split('?')[0] === location.pathname;
      if (prefersReducedMotion || samePath || !panel.current) {
        navigate(to);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      announce('cover');
      gsap
        .timeline()
        .set(panel.current, { display: 'flex', yPercent: 100 })
        .to(panel.current, {
          yPercent: 0,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            covered.current = true;
            setLifting(true);
            navigate(to);
          },
        });
    },
    [location.pathname, location.search, navigate]
  );

  // Every new path starts at the top with fresh scroll measurements
  useLayoutEffect(() => {
    jumpToTop();
    queueRefresh(60);
    if (!covered.current || !panel.current) return;
    covered.current = false;
    gsap.delayedCall(0.25, () => announce('reveal'));
    gsap.to(panel.current, {
      yPercent: -100,
      duration: 0.9,
      delay: 0.2,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.set(panel.current, { display: 'none' });
        busy.current = false;
        setLifting(false);
      },
    });
  }, [location.pathname]);

  const api = useMemo(() => ({ go }), [go]);

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <div
        ref={panel}
        aria-hidden="true"
        className="fixed inset-0 z-[95] hidden flex-col items-center justify-center bg-void"
      >
        <BrandLogo className="w-[160px] lg:w-[240px] h-auto" />
      </div>
    </TransitionContext.Provider>
  );
};

/** A router link that runs the page transition on a plain click. */
export const TLink: React.FC<React.ComponentProps<typeof Link> & { to: string }> = ({ to, onClick, ...rest }) => {
  const { go } = useTransition();
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
      {...rest}
    />
  );
};
