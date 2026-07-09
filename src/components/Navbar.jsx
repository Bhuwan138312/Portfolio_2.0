import { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';

const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

const overlapFraction = (pillLeft, pillWidth, lLeft, lWidth) => {
  const pillRight = pillLeft + pillWidth;
  const lRight    = lLeft + lWidth;
  const overlap   = Math.max(0, Math.min(pillRight, lRight) - Math.max(pillLeft, lLeft));
  return lWidth > 0 ? overlap / lWidth : 0;
};

export default function Navbar() {
  const [scrolled, setScrolled]        = useState(false);
  const [open, setOpen]                = useState(false);
  const [pill, setPill]                = useState({ left: 0, width: 0, opacity: 0 });
  const progressBarRef                 = useRef(null);

  const navLinksRef   = useRef(null);
  const linkRefs      = useRef({});
  const pillPositions = useRef([]);

  // Target (from scroll) and current (smoothed) pill positions
  const targetRef  = useRef({ left: 0, width: 0, opacity: 0 });
  const currentRef = useRef({ left: 0, width: 0, opacity: 0 });
  const rafRef     = useRef(null);

  /* ── measure link bounding boxes ─────────── */
  const measureLinks = useCallback(() => {
    const container = navLinksRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    pillPositions.current = links.map(l => {
      const el = linkRefs.current[l.toLowerCase()];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left - cRect.left, width: r.width };
    });
  }, []);

  /* ── compute TARGET pill from scroll ─────── */
  const computeTarget = useCallback(() => {
    const positions = pillPositions.current;
    if (!positions.length || positions.some(p => !p)) return;

    const NAVBAR_H      = 80;
    const TRANSITION_PX = 380; // wider zone = smoother feel
    const scrollY       = window.scrollY + NAVBAR_H;

    const tops = links.map(l => {
      const el = document.getElementById(l.toLowerCase());
      return el ? el.offsetTop : null;
    });
    if (tops.some(t => t === null)) return;

    if (scrollY < tops[0]) {
      targetRef.current.opacity = 0;
      return;
    }

    // Which section are we in?
    let cur = 0;
    for (let j = 0; j < tops.length; j++) {
      if (tops[j] <= scrollY) cur = j;
    }

    // Fraction toward next section (0 when firmly in cur, 1 when next section starts)
    let t = 0;
    if (cur < tops.length - 1) {
      const distToNext = tops[cur + 1] - scrollY;
      if (distToNext < TRANSITION_PX) {
        const raw = 1 - distToNext / TRANSITION_PX;
        t = raw; // linear — let the lerp handle easing
      }
    }

    const p0 = positions[cur];
    const p1 = positions[Math.min(cur + 1, links.length - 1)];

    targetRef.current = {
      left:    p0.left  + (p1.left  - p0.left)  * t,
      width:   p0.width + (p1.width - p0.width) * t,
      opacity: 1,
    };
  }, []);

  /* ── RAF loop: lerp current → target ─────── */
  const LERP = 0.10; // smoothing: lower = slower/smoother, higher = snappier

  useEffect(() => {
    const loop = () => {
      const tgt = targetRef.current;
      const cur = currentRef.current;

      cur.left    += (tgt.left    - cur.left)    * LERP;
      cur.width   += (tgt.width   - cur.width)   * LERP;
      cur.opacity += (tgt.opacity - cur.opacity) * LERP;

      setPill({ left: cur.left, width: cur.width, opacity: cur.opacity });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── scroll listener ─────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      computeTarget();
      // Write directly to DOM — no setState, no re-render lag
      if (progressBarRef.current) {
        const el  = document.documentElement;
        const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
        progressBarRef.current.style.width =
          (Number.isFinite(pct) ? Math.min(pct * 100, 100) : 0) + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [computeTarget]);

  /* ── measure on mount + resize ───────────── */
  useEffect(() => {
    const onResize = () => { measureLinks(); computeTarget(); };
    window.addEventListener('resize', onResize);
    const t = setTimeout(() => { measureLinks(); computeTarget(); }, 120);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [measureLinks, computeTarget]);

  const handleClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── per-link magnify scale from overlap ─── */
  const getLinkStyle = (linkId) => {
    const positions = pillPositions.current;
    if (!positions.length || pill.opacity < 0.05) return {};
    const idx = links.findIndex(l => l.toLowerCase() === linkId);
    if (idx < 0 || !positions[idx]) return {};
    const { left: lLeft, width: lWidth } = positions[idx];
    const ov = overlapFraction(pill.left, pill.width, lLeft, lWidth);
    const scale = 1 + ov * 0.18;
    return {
      transform:  `scale(${scale})`,
      color:      ov > 0.05
        ? `hsl(145,${Math.round(ov * 42)}%,${Math.round(44 - ov * 8)}%)`
        : undefined,
      fontWeight: ov > 0.45 ? 600 : 500,
    };
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* ── Scroll progress bar ── */}
      <div ref={progressBarRef} className="scroll-progress-bar" style={{ width: '0%' }} />
      <div className="nav-inner">
        <a href="#hero" className="nav-logo" onClick={(e) => handleClick(e, '#hero')}>
          BS<span>.</span>
        </a>

        <div className="nav-links-wrap">
          <ul className={`nav-links ${open ? 'mobile-open' : ''}`} ref={navLinksRef}>
            <div
              className="nav-pill"
              style={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
            />
            {links.map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  ref={el => { linkRefs.current[l.toLowerCase()] = el; }}
                  style={getLinkStyle(l.toLowerCase())}
                  onClick={(e) => handleClick(e, `#${l.toLowerCase()}`)}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          className={`hamburger ${open ? 'open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
