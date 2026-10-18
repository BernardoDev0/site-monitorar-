import { useEffect, type RefObject } from 'react';

/** Progressive enhancement: the server and the CSS never conceal content. */
export function usePageMotion(root: RefObject<HTMLDivElement>) {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          gsap.from('[data-enter]', { y: 24, duration: .7, stagger: .12, ease: 'power3.out', clearProps: 'transform' });
          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
            if (element.getBoundingClientRect().top < window.innerHeight) return;
            gsap.from(element, { y: 24, duration: .65, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
          });
        }, root);
        return () => context.revert();
      });
      cleanup = () => media.revert();
    }).catch(() => { /* Optional motion failure leaves the document fully usable. */ });
    return () => { disposed = true; cleanup?.(); };
  }, [root]);
}
