'use client';

import { useState, useRef } from 'react';
import useNavbarPill from '../hooks/useNavbarPill';
import './Navbar.css';

const links = ['About', 'Skills', 'Projects', 'Education', 'Contact'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const progressBarRef = useRef(null);
  const pillDOMRef = useRef(null);
  const navLinksRef = useRef(null);
  const linkRefs = useRef({});

  const { scrolled } = useNavbarPill(links, navLinksRef, linkRefs, pillDOMRef, progressBarRef);

  const handleClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
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
              ref={pillDOMRef}
              style={{ left: 0, width: 0, opacity: 0 }}
            />
            {links.map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  ref={el => { linkRefs.current[l.toLowerCase()] = el; }}
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
