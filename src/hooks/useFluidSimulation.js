'use client';

import { useEffect } from 'react';

export default function useFluidSimulation(canvasRef, mouseRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    /* ── config ────────────────────────────────── */
    const SPACING = 32;
    const BASE_R = 1.7;
    const SPRING = 0.036;   
    const DAMPING = 0.88;    
    const PUSH_R = 75;      
    const PUSH_FORCE = 9;       

    const WAVE_SPEED = 230;     
    const WAVE_AMP = 12;      
    const WAVE_DECAY = 1.5;     
    const WAVE_LEN = 48;      
    const WAVE_K = (2 * Math.PI) / WAVE_LEN;
    const EMIT_MS = 40;      
    const MAX_RIPPLES = 24;

    const TRAIL_MAX = 28;      

    /* ── state ─────────────────────────────────── */
    let dots = [];
    let ripples = [];
    let trail = [];
    let prevMouse = null;
    let lastEmit = 0;

    // Framerate independence
    let simTime = performance.now();
    let lastTime = performance.now();
    let accumulator = 0;
    const SIMULATION_STEP = 1000 / 144; // Target 144Hz physics

    /* ── build dot grid ────────────────────────── */
    const buildGrid = () => {
      dots = [];
      const cols = Math.ceil(canvas.width / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const rx = (Math.random() - 0.5) * (SPACING * 0.4);
          const ry = (Math.random() - 0.5) * (SPACING * 0.4);
          const ox = c * SPACING + rx;
          const oy = r * SPACING + ry;
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
        const dist = Math.hypot(nx - prevMouse.x, ny - prevMouse.y);
        const dt = Math.max(1, now - prevMouse.t);
        const normalizedSpeed = (dist / dt) * (1000 / 144);

        if (normalizedSpeed > 2 && now - lastEmit > EMIT_MS) {
          if (ripples.length >= MAX_RIPPLES) ripples.shift();
          ripples.push({
            x: (prevMouse.x + nx) * 0.5,
            y: (prevMouse.y + ny) * 0.5,
            t: now,
            strength: Math.min(normalizedSpeed / 18, 1),
          });
          lastEmit = now;
        }
      }
      prevMouse = { x: nx, y: ny, t: now };
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
        strength: 2.2,
      });
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    /* ── draw loop ─────────────────────────────── */
    const draw = (ts) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = ts;

      let frameTime = now - lastTime;
      lastTime = now;
      if (frameTime > 100) {
        simTime += (frameTime - 100);
        frameTime = 100;
      }
      accumulator += frameTime;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ripples = ripples.filter(r => simTime - r.t < 3800);

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

      /* ── update physics (fixed timestep) ─────── */
      while (accumulator >= SIMULATION_STEP) {
        simTime += SIMULATION_STEP;

        for (const d of dots) {
          let wox = 0, woy = 0;
          for (const rip of ripples) {
            const age = (simTime - rip.t) / 1000;
            if (age < 0) continue;
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

          const floatX = Math.sin(simTime * d.phaseSpeed + d.phase) * 3;
          const floatY = Math.cos(simTime * d.phaseSpeed + d.phase) * 3;

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

          d.vx = (d.vx + (tx - d.x) * SPRING) * DAMPING;
          d.vy = (d.vy + (ty - d.y) * SPRING) * DAMPING;
          d.x += d.vx;
          d.y += d.vy;

          d.floatX = floatX;
          d.floatY = floatY;
        }

        accumulator -= SIMULATION_STEP;
      }

      /* ── draw dots ───────────────────────────── */
      for (const d of dots) {
        const dispX = (d.x - d.ox) - (d.floatX || 0);
        const dispY = (d.y - d.oy) - (d.floatY || 0);
        const disp2 = Math.hypot(dispX, dispY);

        const energy = Math.min(disp2 / (PUSH_FORCE * 0.9), 1);
        const curDist = Math.hypot(d.x - mx, d.y - my);
        const prox = Math.max(0, 1 - curDist / (PUSH_R * 1.6));

        const alpha = energy * 0.50 + prox * 0.095;

        if (alpha > 0.01) {
          const radius = BASE_R + energy * 2.75;
          const hue = 148 + energy * 38;
          const sat = 22 + energy * 33 + prox * 10;
          const light = 40 + energy * 9;

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
  }, [canvasRef, mouseRef]);
}
