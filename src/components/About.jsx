'use client';

import { useEffect, useRef, useState } from 'react';
import './About.css';
import WordReveal from './WordReveal';

const bhuwanImg = '/bhuwan.jpeg';
const cvPdf = '/CV.pdf';

const stats = [
  { num: 8, label: 'Featured Projects' },
];

function useCounter(target, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 40);
    return () => clearInterval(timer);
  }, [trigger, target]);
  return val;
}

function StatItem({ num, label }) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);
  const val = useCounter(num, triggered);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-num">{val}<span className="accent-text">+</span></span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <span className="section-tag reveal-fade">About Me</span>
        <div className="about-grid">
          <div className="about-photo-col reveal-left">
            <div className="photo-frame">
              <img src={bhuwanImg} alt="Bhuwan Shrestha" className="profile-photo" />
              <div className="photo-deco" />
            </div>
            <div className="availability-badge">
              <span className="badge-dot" />
              Open to Opportunities
            </div>
          </div>

          <div className="about-text-col">
            <h2 className="about-heading reveal-right">
              Building <em>reliable</em> backends,<br />
              engineering <em>real solutions</em>.
            </h2>
            <WordReveal startDelay={200} wordDelay={30}>
              I'm <strong>Bhuwan Shrestha</strong>, a backend developer based in <strong>Kathmandu, Nepal</strong> with a primary focus on <strong>Java, Spring &amp; Spring Boot</strong> and <strong>Python</strong> and its ecosystem of libraries.
            </WordReveal>
            <WordReveal startDelay={400} wordDelay={30}>
              I build scalable REST APIs, microservices, and data-driven systems. I also work across the stack with HTML, CSS, React, and JavaScript, and manage deployments with Docker, Git, and GitHub.
            </WordReveal>
            <div className="about-stats reveal-up" style={{ transitionDelay: '500ms' }}>
              {stats.map((s) => <StatItem key={s.label} {...s} />)}
            </div>
            <a href={cvPdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary reveal-up" style={{ transitionDelay: '600ms' }}>View CV ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
