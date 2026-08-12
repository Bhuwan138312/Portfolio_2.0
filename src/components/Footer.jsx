'use client';

import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© 2026 <strong>Bhuwan Shrestha</strong></p>
        <a
          href="#hero"
          className="back-top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
