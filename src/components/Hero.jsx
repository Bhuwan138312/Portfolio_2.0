'use client';

import { useRef } from 'react';
import useMagnetic from '../hooks/useMagnetic';
import useTypewriter from '../hooks/useTypewriter';
import useFluidSimulation from '../hooks/useFluidSimulation';
import './Hero.css';

export default function Hero() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const magPrimary = useMagnetic(0.40);
  const magGhost = useMagnetic(0.30);
  
  useFluidSimulation(canvasRef, mouseRef);

  const { mode, cyclePhase, displayed, cursorPos, introText, isTyping } = useTypewriter({
    introText: 'UI/UX Designer & Backend Developer',
    words: ['Designer', 'Developer', 'Creator'],
    introSpeed: 55,
    backtrackSpeed: 22,
    typeSpeed: 85,
    deleteSpeed: 40,
    pauseAfterIntro: 900,
    pauseAfter: 1800,
    pauseBefore: 350,
    startDelay: 1200,
  });

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-content">
        <p className="hero-eyebrow reveal-fade" style={{ transitionDelay: '0.1s' }}>👋 Hello, I'm</p>
        <h1 className="hero-name">
          <span className="reveal-left" style={{ display: 'inline-block', transitionDelay: '0.3s' }}>Bhuwan</span><br />
          <span className="name-stroke reveal-right" style={{ display: 'inline-block', transitionDelay: '0.7s' }}>Shrestha</span>
        </h1>
        {/* ── hero-role: single element, content changes per phase ── */}
        <p className="hero-role reveal-right" style={{ transitionDelay: '1.1s' }}>
          {mode === 'idle' && <>&nbsp;</>}
          {mode === 'intro' && (
            <>{displayed}<span className="typewriter-cursor blink">|</span></>
          )}
          {mode === 'backtracking' && (
            <>
              {introText.slice(0, cursorPos)}
              <span className="typewriter-cursor">|</span>
              {introText.slice(cursorPos)}
            </>
          )}
          {mode === 'cycling' && (
            <>
              UI/UX&nbsp;<span className={`typewriter-word ${cyclePhase === 'selecting' ? 'selecting-anim' : ''}`}>{displayed}</span>
              <span className={`typewriter-cursor${isTyping ? '' : ' blink'}`}>|</span>
              &nbsp;&amp; Backend Developer
            </>
          )}
        </p>
        <p className="hero-tagline reveal-up" style={{ transitionDelay: '1.4s' }}>
          I’m a UI/UX designer and developer who enjoys creating <em>user-friendly interfaces</em> and building <em>reliable backend systems</em>.
        </p>
        <div className="hero-cta reveal-up" style={{ transitionDelay: '1.7s' }}>
          <a
            ref={magPrimary.ref}
            {...magPrimary.magneticProps}
            href="#projects"
            className="btn btn-primary"
            style={{ willChange: 'transform', display: 'inline-flex' }}
          >
            View My Work ↓
          </a>
          <a
            ref={magGhost.ref}
            {...magGhost.magneticProps}
            href="#contact"
            className="btn btn-ghost"
            style={{ willChange: 'transform', display: 'inline-flex' }}
          >
            Get In Touch
          </a>
        </div>
        <div className="hero-scroll reveal-fade" style={{ transitionDelay: '2.2s' }}>
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
