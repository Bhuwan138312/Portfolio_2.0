'use client';

import { useEffect, useRef, useState } from 'react';
import './Experience.css';

const items = [
  {
    period: '2023 — 2027 (Expected)',
    role: 'B.Sc. in Computer Science',
    company: "Taylor's University",
    desc: "Currently pursuing my Bachelor's degree. Building a strong foundation in computer science, software engineering, and system architecture alongside practical projects.",
    tags: ['Computer Science', 'Software Engineering', 'System Design'],
    type: 'edu',
  },
  {
    period: 'Completed',
    role: '+2 Commerce',
    company: 'Devi Secondary School',
    desc: 'Completed higher secondary education majoring in Commerce. Developed a strong foundation in Accounting and Computer Science, which sparked my interest in software development.',
    tags: ['Commerce', 'Accounting', 'Computer Science'],
    type: 'edu',
  },
  {
    period: 'Completed',
    role: 'Secondary Education (Class 10)',
    company: 'Rudra Memorial Secondary School',
    desc: 'Completed foundational secondary education, building a solid base for my future academic pursuits.',
    tags: ['Secondary Education', 'Foundational Studies'],
    type: 'edu',
  },
];

export default function Experience() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [lineDistance, setLineDistance] = useState(0);
  const [dotOffsets, setDotOffsets] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.85;
      
      const distance = triggerPoint - rect.top;
      const p = Math.max(0, Math.min(1, distance / rect.height));
      
      setProgress(p);
      setLineDistance(distance);
    };

    const updateOffsets = () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll('.timeline-item');
      // Calculate each item's top position relative to the container
      const offsets = Array.from(items).map(item => item.offsetTop);
      setDotOffsets(offsets);
      handleScroll(); // Evaluate immediately based on new offsets
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateOffsets);
    updateOffsets(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateOffsets);
    };
  }, []);

  return (
    <section id="experience" className="section section-alt">
      <div className="container">
        <span className="section-tag reveal-fade">My Background</span>
        <h2 className="section-title reveal-up">Education</h2>
        <div className="timeline" ref={containerRef} style={{ '--progress': progress }}>
          {items.map((item, i) => {
            // First item always revealed, others revealed exactly when line passes their dot
            const isRevealed = dotOffsets[i] !== undefined && lineDistance >= dotOffsets[i] + 12;
            
            return (
            <div className={`timeline-item scroll-reveal-item ${isRevealed ? 'revealed' : ''}`} key={i}>
              <div className={`timeline-dot ${item.type} ${isRevealed ? 'active' : ''}`} />
              <div className="timeline-content">
                <span className="timeline-period">{item.period}</span>
                <h3 className="timeline-role">{item.role}</h3>
                <span className="timeline-company">{item.company}</span>
                <p className="timeline-desc">{item.desc}</p>
                <div className="timeline-tags">
                  {item.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
