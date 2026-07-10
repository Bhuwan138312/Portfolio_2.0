'use client';

import { useRef, useEffect, useState, Children, isValidElement } from 'react';

/**
 * Recursively walks React children:
 *  - Strings → split by space → each word wrapped in [outer][inner] spans
 *  - React elements (strong, em, etc.) → treated as one word unit
 *
 * The outer span is `display:inline-block` so words wrap naturally.
 * The inner span slides up + fades in, driven by a CSS transitionDelay.
 */
function tokenize(children, wordDelay, startDelay, counter) {
  const out = [];

  Children.forEach(children, (child) => {
    if (child == null) return;

    if (typeof child === 'string') {
      // Split on spaces — keep punctuation attached to its word
      const words = child.split(' ');
      words.forEach((word, i) => {
        if (!word) return;
        const idx = counter.val++;
        out.push(
          <span key={`w${idx}`} className="word-token">
            <span
              className="word-token__inner"
              style={{ transitionDelay: `${startDelay + idx * wordDelay}ms` }}
            >
              {word}
            </span>
          </span>
        );
        // Preserve the space between words
        if (i < words.length - 1) out.push(' ');
      });
    } else if (isValidElement(child)) {
      // Inline elements (strong, em…) become one word unit
      const idx = counter.val++;
      out.push(
        <span key={`e${idx}`} className="word-token">
          <span
            className="word-token__inner"
            style={{ transitionDelay: `${startDelay + idx * wordDelay}ms` }}
          >
            {child}
          </span>
        </span>
      );
      out.push(' ');
    }
  });

  return out;
}

/**
 * WordReveal — wraps a paragraph (or any tag) and stagger-reveals
 * each word with a slide-up + fade when the element enters the viewport.
 *
 * Props:
 *   children    — JSX content (supports inline elements like <strong>)
 *   as          — rendered tag (default: 'p')
 *   className   — forwarded to the tag
 *   wordDelay   — ms between each word's animation start (default: 40)
 */
export default function WordReveal({
  children,
  as: Tag = 'p',
  className = '',
  wordDelay = 40,
  startDelay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Reset counter on each render so delays are always position-based
  const counter = { val: 0 };
  const tokens = tokenize(children, wordDelay, startDelay, counter);

  return (
    <Tag
      ref={ref}
      className={`word-reveal${visible ? ' word-reveal--visible' : ''}${className ? ` ${className}` : ''}`}
    >
      {tokens}
    </Tag>
  );
}
