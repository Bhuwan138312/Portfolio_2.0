'use client';

import { useEffect, useRef } from 'react';
import useMagnetic from '../hooks/useMagnetic';
import useTypewriter from '../hooks/useTypewriter';
import './Hero.css';

export default function Hero() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const magPrimary = useMagnetic(0.40);
  const magGhost = useMagnetic(0.30);
  const { mode, cyclePhase, displayed, cursorPos, introText, isTyping } = useTypewriter({
    introText: 'Backend Developer · Java · Spring Boot · Python',
    words: ['Developer', 'Designer', 'Builder'],
    introSpeed: 55,
    backtrackSpeed: 22,
    typeSpeed: 85,
    deleteSpeed: 40,
    pauseAfterIntro: 900,
    pauseAfter: 1800,
    pauseBefore: 350,
    startDelay: 1200,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    /* ── config ────────────────────────────────── */
    const SPACING = 32;
    const BASE_R = 1.7;
    const SPRING = 0.036;   // softness — lower = more fluid
    const DAMPING = 0.88;    // higher = slower decay, more water-like
    const PUSH_R = 75;      // stick push radius
    const PUSH_FORCE = 9;       // max push distance (px)

    const WAVE_SPEED = 230;     // ring expansion speed px/s
    const WAVE_AMP = 12;      // peak displacement px
    const WAVE_DECAY = 1.5;     // amplitude decay per second
    const WAVE_LEN = 48;      // wavelength px
    const WAVE_K = (2 * Math.PI) / WAVE_LEN;
    const EMIT_MS = 40;      // min ms between ripple emissions
    const MAX_RIPPLES = 24;

    const TRAIL_MAX = 28;      // cursor trail history

    /* ── state ─────────────────────────────────── */
    let dots = [];
    let ripples = [];
    let trail = [];
    let prevMouse = null;
    let lastEmit = 0;

    /* ── build dot grid ────────────────────────── */
    const buildGrid = () => {
      dots = [];
      const cols = Math.ceil(canvas.width / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Add a slight random scatter to their origins
          const rx = (Math.random() - 0.5) * (SPACING * 0.4);
          const ry = (Math.random() - 0.5) * (SPACING * 0.4);
          const ox = c * SPACING + rx;
          const oy = r * SPACING + ry;
          // Store a random float phase for organic movement
          const phase = Math.random() * Math.PI * 2;
          const phaseSpeed = 0.0005 + Math.random() * 0.001;
          dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0, phase, phaseSpeed });
        }
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildGrid();
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── mouse handlers ────────────────────────── */
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      const now = performance.now();

      trail.push({ x: nx, y: ny, t: now });
      if (trail.length > TRAIL_MAX) trail.shift();

      if (prevMouse) {
        const speed = Math.hypot(nx - prevMouse.x, ny - prevMouse.y);
        if (speed > 2 && now - lastEmit > EMIT_MS) {
          if (ripples.length >= MAX_RIPPLES) ripples.shift();
          ripples.push({
            x: (prevMouse.x + nx) * 0.5,
            y: (prevMouse.y + ny) * 0.5,
            t: now,
            strength: Math.min(speed / 18, 1),
          });
          lastEmit = now;
        }
      }
      prevMouse = { x: nx, y: ny };
      mouseRef.current = { x: nx, y: ny };
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      prevMouse = null;
    };

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      const now = performance.now();

      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({
        x: nx,
        y: ny,
        t: now,
        strength: 2.2, // large splash for tap/click
      });
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    /* ── draw loop ─────────────────────────────── */
    const draw = (ts) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = ts;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // expire old ripples
      ripples = ripples.filter(r => now - r.t < 3800);

      /* ── fading cursor trail ─────────────────── */
      for (let i = 1; i < trail.length; i++) {
        const age = (now - trail[i].t) / 700;
        if (age >= 1) continue;
        const alpha = (1 - age) * 0.22;
        const w = (1 - age) * 2.8;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = `hsla(150,45%,52%,${alpha})`;
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      /* ── update + draw dots ──────────────────── */
      for (const d of dots) {
        /* wave target offset from all ripples */
        let wox = 0, woy = 0;
        for (const rip of ripples) {
          const age = (now - rip.t) / 1000;
          const r = Math.hypot(d.ox - rip.x, d.oy - rip.y);
          if (r < 1) continue;
          const wavefront = WAVE_SPEED * age;
          const dr = r - wavefront;
          const envelope = Math.exp(-0.5 * (dr / WAVE_LEN) ** 2);
          if (envelope < 0.008) continue;
          const amp = WAVE_AMP * rip.strength * Math.exp(-WAVE_DECAY * age) * envelope;
          const phase = Math.sin(WAVE_K * dr);
          const disp = amp * phase;
          wox += (d.ox - rip.x) / r * disp;
          woy += (d.oy - rip.y) / r * disp;
        }

        /* direct cursor stick push */
        // Add a continuous organic float using the stored phase
        const floatX = Math.sin(now * d.phaseSpeed + d.phase) * 3;
        const floatY = Math.cos(now * d.phaseSpeed + d.phase) * 3;

        let tx = d.ox + wox + floatX;
        let ty = d.oy + woy + floatY;
        const cdx = d.ox - mx;
        const cdy = d.oy - my;
        const cdist = Math.hypot(cdx, cdy);
        if (cdist < PUSH_R && cdist > 0.5) {
          const t = 1 - cdist / PUSH_R;
          const smooth = t * t * (3 - 2 * t);
          const push = smooth * PUSH_FORCE;
          const ang = Math.atan2(cdy, cdx);
          tx += Math.cos(ang) * push;
          ty += Math.sin(ang) * push;
        }

        /* spring integration */
        d.vx = (d.vx + (tx - d.x) * SPRING) * DAMPING;
        d.vy = (d.vy + (ty - d.y) * SPRING) * DAMPING;
        d.x += d.vx;
        d.y += d.vy;

        /* visuals — energy drives color + size */
        // Subtract float to calculate energy only from mouse/wave interaction
        const dispX = (d.x - d.ox) - floatX;
        const dispY = (d.y - d.oy) - floatY;
        const disp2 = Math.hypot(dispX, dispY);

        const energy = Math.min(disp2 / (PUSH_FORCE * 0.9), 1);
        const curDist = Math.hypot(d.x - mx, d.y - my);
        const prox = Math.max(0, 1 - curDist / (PUSH_R * 1.6));

        const alpha = energy * 0.55 + prox * 0.08;

        // Skip drawing if completely invisible
        if (alpha > 0.01) {
          const radius = BASE_R + energy * 3.8;
          const hue = 148 + energy * 38;
          const sat = 5 + energy * 68 + prox * 10;
          const light = 54 + energy * 24;

          ctx.beginPath();
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue},${sat}%,${light}%,${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

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
              Backend&nbsp;<span className={`typewriter-word ${cyclePhase === 'selecting' ? 'selecting-anim' : ''}`}>{displayed}</span>
              <span className={`typewriter-cursor${isTyping ? '' : ' blink'}`}>|</span>
              <span className="sep">·</span>&nbsp;Java · Spring Boot · Python
            </>
          )}
        </p>
        <p className="hero-tagline reveal-up" style={{ transitionDelay: '1.4s' }}>
          I build <em>robust</em>, scalable backend systems that power great
          digital products — clean APIs, solid architecture, real impact.
        </p>
        <div className="hero-cta reveal-up" style={{ transitionDelay: '1.7s' }}>
          <a
            ref={magPrimary.ref}
            {...magPrimary.magneticProps}
            href="#projects"
            className="btn btn-primary"
            style={{ willChange: 'transform', display: 'inline-flex' }}
            onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            View My Work ↓
          </a>
          <a
            ref={magGhost.ref}
            {...magGhost.magneticProps}
            href="#contact"
            className="btn btn-ghost"
            style={{ willChange: 'transform', display: 'inline-flex' }}
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
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
