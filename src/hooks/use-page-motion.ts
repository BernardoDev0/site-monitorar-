import { useEffect, type RefObject } from 'react';

/** Progressive enhancement: server-rendered content is always visible. */
export function usePageMotion(root: RefObject<HTMLElement>, pathname: string) {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const element = root.current;
    if (!element) return;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{gsap}, {ScrollTrigger}]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const heading = element.querySelector('h1');
        const hero = element.querySelector('.erm-hero-photo');
        const cta = element.querySelector('.erm-hero a[data-enter]');
        const timeline = gsap.timeline({defaults: {ease: 'power3.out'}});
        if (heading) timeline.from(heading, {y: 12, duration: .55, clearProps: 'transform'}, 0);
        if (hero) timeline.from(hero, {scale: 1.025, duration: .9, clearProps: 'transform'}, 0);
        if (cta) timeline.from(cta, {y: 10, duration: .45, clearProps: 'transform'}, .15);
        element.querySelectorAll('main section h2, .erm-service, .erm-offering, .entry-list article, .editorial-card, .expertise-lead article, .expertise-details article, .page-intro .intro-copy').forEach(target => {
          if (target.parentElement?.closest('.erm-service, .erm-offering, .entry-list article, .editorial-card, .expertise-lead article, .expertise-details article')) return;
          // Keep initial content visible; progressively reveal sections below the fold.
          if (target.getBoundingClientRect().top < window.innerHeight * .92) return;
          gsap.from(target, {y: 18, opacity: 0, duration: .6, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: {trigger: target, start: 'top 92%', once: true}});
        });
        element.querySelectorAll('.v4-page-photo').forEach(target => {
          gsap.from(target, {scale: .99, duration: .55, ease: 'power3.out', clearProps: 'transform', scrollTrigger: {trigger: target, start: 'top 95%', once: true}});
        });
        element.dataset.motion = 'active';
        ScrollTrigger.refresh();
      }, element);
      cleanup = () => { context.revert(); delete element.dataset.motion; };
    }).catch(error => { if (!disposed) { element.dataset.motion = 'failed'; console.error('Motion initialization failed', error); } });
    return () => { disposed = true; cleanup?.(); };
  }, [root, pathname]);
}
