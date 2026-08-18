'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const overlapFraction = (pillLeft, pillWidth, lLeft, lWidth) => {
  const pillRight = pillLeft + pillWidth;
  const lRight    = lLeft + lWidth;
  const overlap   = Math.max(0, Math.min(pillRight, lRight) - Math.max(pillLeft, lLeft));
  return lWidth > 0 ? overlap / lWidth : 0;
};

export default function useNavbarPill(links, navLinksRef, linkRefs, pillDOMRef, progressBarRef) {
  const [scrolled, setScrolled] = useState(false);
  const pillPositions = useRef([]);
  const targetRef = useRef({ left: 0, width: 0, opacity: 0 });
  const currentRef = useRef({ left: 0, width: 0, opacity: 0 });
  const rafRef = useRef(null);

  const measureLinks = useCallback(() => {
    const container = navLinksRef.current;
    if (!container) return;

    links.forEach(l => {
      const el = linkRefs.current[l.toLowerCase()];
      if (el) el.style.transform = '';
    });

    const cRect = container.getBoundingClientRect();
    pillPositions.current = links.map(l => {
      const el = linkRefs.current[l.toLowerCase()];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left - cRect.left, width: r.width };
    });
  }, [links, navLinksRef, linkRefs]);

  const computeTarget = useCallback(() => {
    const positions = pillPositions.current;
    if (!positions.length || positions.some(p => !p)) return;

    const NAVBAR_H = 80;
    const TRANSITION_PX = 380;
    const scrollY = window.scrollY + NAVBAR_H;

    const tops = links.map(l => {
      const el = document.getElementById(l.toLowerCase());
      return el ? el.offsetTop : null;
    });
    if (tops.some(t => t === null)) return;

    if (scrollY < tops[0]) {
      targetRef.current.opacity = 0;
      return;
    }

    let cur = 0;
    for (let j = 0; j < tops.length; j++) {
      if (tops[j] <= scrollY) cur = j;
    }

    let t = 0;
    if (cur < tops.length - 1) {
      const distToNext = tops[cur + 1] - scrollY;
      if (distToNext < TRANSITION_PX) {
        t = 1 - distToNext / TRANSITION_PX;
      }
    }

    const p0 = positions[cur];
    const p1 = positions[Math.min(cur + 1, links.length - 1)];

    const p0Left = p0.left - 4;
    const p0Width = p0.width + 8;
    const p1Left = p1.left - 4;
    const p1Width = p1.width + 8;

    targetRef.current = {
      left: p0Left + (p1Left - p0Left) * t,
      width: p0Width + (p1Width - p0Width) * t,
      opacity: 1,
    };
  }, [links]);

  const LERP = 0.10;

  useEffect(() => {
    const loop = () => {
      const tgt = targetRef.current;
      const cur = currentRef.current;

      cur.left += (tgt.left - cur.left) * LERP;
      cur.width += (tgt.width - cur.width) * LERP;
      cur.opacity += (tgt.opacity - cur.opacity) * LERP;

      if (pillDOMRef.current) {
        pillDOMRef.current.style.left = `${cur.left}px`;
        pillDOMRef.current.style.width = `${cur.width}px`;
        pillDOMRef.current.style.opacity = cur.opacity;
      }

      links.forEach(l => {
        const id = l.toLowerCase();
        const el = linkRefs.current[id];
        const idx = links.findIndex(x => x.toLowerCase() === id);
        const positions = pillPositions.current;

        if (!el) return;

        if (idx < 0 || !positions[idx] || cur.opacity < 0.05) {
          el.style.transform = '';
          el.style.color = '';
          return;
        }

        const { left: lLeft, width: lWidth } = positions[idx];
        const ov = overlapFraction(cur.left, cur.width, lLeft, lWidth);
        const scale = 1 + ov * 0.12;

        el.style.transform = `scale(${scale})`;
        el.style.color = ov > 0.05 ? `hsl(145,${Math.round(ov * 42)}%,${Math.round(44 - ov * 8)}%)` : '';
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [links, linkRefs, pillDOMRef]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      computeTarget();
      if (progressBarRef.current) {
        const el = document.documentElement;
        const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
        progressBarRef.current.style.width =
          (Number.isFinite(pct) ? Math.min(pct * 100, 100) : 0) + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [computeTarget, progressBarRef]);

  useEffect(() => {
    const onResize = () => { measureLinks(); computeTarget(); };
    window.addEventListener('resize', onResize);
    const t = setTimeout(() => { measureLinks(); computeTarget(); }, 120);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [measureLinks, computeTarget]);

  return { scrolled };
}
