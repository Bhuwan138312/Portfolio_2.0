'use client';

import { useEffect, useRef } from 'react';
import './Skills.css';

const bars = [
  { label: 'Java / Spring Boot', pct: 90 },
  { label: 'Python & Libraries', pct: 85 },
  { label: 'MySQL / MongoDB', pct: 82 },
  { label: 'HTML / CSS / React', pct: 75 },
  { label: 'Docker / Git / GitHub', pct: 78 },
];

const tags = [
  { label: 'Java', icon: 'openjdk' },
  { label: 'Spring', icon: 'spring' },
  { label: 'Spring Boot', icon: 'springboot' },
  { label: 'Python', icon: 'python' },
  { label: 'FastAPI', icon: 'fastapi' },
  { label: 'Django', icon: 'django' },
  { label: 'HTML5', icon: 'html5' },
  { label: 'CSS3', icon: 'css' },
  { label: 'JavaScript', icon: 'javascript' },
  { label: 'React', icon: 'react' },
  { label: 'MySQL', icon: 'mysql' },
  { label: 'MongoDB', icon: 'mongodb' },
  { label: 'NoSQL', icon: '' },
  { label: 'PostgreSQL', icon: 'postgresql' },
  { label: 'REST APIs', icon: '' },
  { label: 'Microservices', icon: '' },
  { label: 'Docker', icon: 'docker' },
  { label: 'Git', icon: 'git' },
  { label: 'GitHub', icon: 'github' },
  { label: 'Figma', icon: 'figma' },
  { label: 'Kotlin', icon: 'kotlin' },
];

function SkillBar({ label, pct, index }) {
  const fillRef = useRef(null);
  const countRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let timer;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();

      const delay = index * 140; // stagger each bar

      timer = setTimeout(() => {
        const fill = fillRef.current;
        const counter = countRef.current;
        if (!fill) return;

        // 1. Trigger CSS fill transition
        fill.style.width = `${pct}%`;
        // 2. Add classes for shimmer + glow dot
        fill.classList.add('animate');

        // 3. Animate the percentage counter with easeOutCubic
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          if (counter) counter.textContent = `${Math.round(eased * pct)}%`;
          if (t < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
      }, delay);
    }, { threshold: 0.3 });

    if (fillRef.current) obs.observe(fillRef.current.closest('.skill-item'));

    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafRef.current);
      if (timer) clearTimeout(timer);
    };
  }, [pct, index]);

  return (
    <div className="skill-item">
      <div className="skill-meta">
        <span>{label}</span>
        <span className="skill-pct" ref={countRef}>0%</span>
      </div>
      <div className="skill-bar">
        <div className="skill-fill" ref={fillRef} style={{ width: 0 }} />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <span className="section-tag reveal-fade">What I Know</span>
        <h2 className="section-title reveal-up">Skills &amp; Expertise</h2>
        <div className="skills-layout">
          <div className="skill-bars-col reveal-left">
            {bars.map((b, i) => <SkillBar key={b.label} {...b} index={i} />)}
          </div>
          <div className="skill-tags-col reveal-right">
            <p className="tags-label">Technologies &amp; Tools</p>
            <div className="skill-tags">
              {tags.map((t, i) => (
                <span
                  className="skill-tag stagger-item"
                  key={t.label}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {t.icon && (
                    <img
                      src={`https://cdn.simpleicons.org/${t.icon}`}
                      alt=""
                      aria-hidden="true"
                      className="skill-tag-icon"
                    />
                  )}
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
