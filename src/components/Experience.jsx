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
  const dotOffsetsRef = useRef([]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.85;
      
      const distance = triggerPoint - rect.top;
      const p = Math.max(0, Math.min(1, distance / rect.height));
      
      containerRef.current.style.setProperty('--progress', p);

      const itemsDOM = containerRef.current.querySelectorAll('.timeline-item');
      itemsDOM.forEach((itemNode, index) => {
        const offset = dotOffsetsRef.current[index];
        const isRevealed = offset !== undefined && distance >= offset + 12;
        const dot = itemNode.querySelector('.timeline-dot');
        
        if (isRevealed) {
          itemNode.classList.add('revealed');
          if (dot) dot.classList.add('active');
        } else {
          itemNode.classList.remove('revealed');
          if (dot) dot.classList.remove('active');
        }
      });
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateOffsets = () => {
      if (!containerRef.current) return;
      const itemsDOM = containerRef.current.querySelectorAll('.timeline-item');
      dotOffsetsRef.current = Array.from(itemsDOM).map(item => item.offsetTop);
      handleScroll(); 
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateOffsets);
    updateOffsets(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateOffsets);
    };
  }, []);

  return (
    <section id="experience" className="section section-alt">
      <div className="container">
        <span className="section-tag reveal-fade">My Background</span>
        <h2 className="section-title reveal-up">Education</h2>
        <div className="timeline" ref={containerRef} style={{ '--progress': 0 }}>
          {items.map((item) => (
            <div className="timeline-item scroll-reveal-item" key={`${item.company}-${item.role}`}>
              <div className={`timeline-dot ${item.type}`} />
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
          ))}
        </div>
      </div>
    </section>
  );
}
