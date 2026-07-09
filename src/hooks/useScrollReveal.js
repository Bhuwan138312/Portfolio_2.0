import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll(
      '.reveal-up, .reveal-fade, .reveal-left, .reveal-right'
    );
    const staggerEls = document.querySelectorAll('.stagger-item');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = entry.target.parentElement.querySelectorAll('.stagger-item');
            siblings.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 110);
            });
            staggerObserver.unobserve(entry.target.parentElement.querySelector('.stagger-item'));
          }
        });
      },
      { threshold: 0.1 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
    // Observe first stagger child of each group
    const staggerGroups = new Set();
    staggerEls.forEach((el) => {
      const parent = el.parentElement;
      if (!staggerGroups.has(parent)) {
        staggerGroups.add(parent);
        staggerObserver.observe(el);
      }
    });

    return () => {
      revealObserver.disconnect();
      staggerObserver.disconnect();
    };
  }, []);
}
