import { useEffect, useRef } from 'react';
import './Skills.css';

const bars = [
  { label: 'Java / Spring Boot',   pct: 90 },
  { label: 'Python & Libraries',   pct: 85 },
  { label: 'MySQL / MongoDB',       pct: 82 },
  { label: 'HTML / CSS / React',    pct: 75 },
  { label: 'Docker / Git / GitHub', pct: 78 },
];

const tags = [
  'Java','Spring','Spring Boot','Python','FastAPI','Django',
  'HTML5','CSS3','JavaScript','React',
  'MySQL','MongoDB','NoSQL','PostgreSQL',
  'REST APIs','Microservices',
  'Docker','Git','GitHub','Figma','Kotlin',
];

function SkillBar({ label, pct }) {
  const fillRef = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        fillRef.current.style.width = `${pct}%`;
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    if (fillRef.current) obs.observe(fillRef.current.parentElement);
    return () => obs.disconnect();
  }, [pct]);
  return (
    <div className="skill-item">
      <div className="skill-meta">
        <span>{label}</span>
        <span className="skill-pct">{pct}%</span>
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
            {bars.map((b) => <SkillBar key={b.label} {...b} />)}
          </div>
          <div className="skill-tags-col reveal-right">
            <p className="tags-label">Technologies &amp; Tools</p>
            <div className="skill-tags">
              {tags.map((t, i) => (
                <span className="skill-tag stagger-item" key={t} style={{ transitionDelay: `${i * 60}ms` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
