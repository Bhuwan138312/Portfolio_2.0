import { useRef, useCallback } from 'react';

/**
 * useTilt — 3-D card tilt driven by mouse position.
 *
 * @param {number} max         Max rotation in degrees (default 12)
 * @param {number} perspective CSS perspective distance in px (default 900)
 * @param {number} scale       Scale-up factor on hover (default 1.04)
 * @param {number} ease        Lerp factor per frame (default 0.10)
 */
export default function useTilt({
  max = 12,
  perspective = 900,
  scale = 1.04,
  ease = 0.10,
} = {}) {
  const ref         = useRef(null);
  const animRef     = useRef(null);
  const hovered     = useRef(false);

  // Target and current rotations + scale — all lerped independently
  const tgt         = useRef({ rx: 0, ry: 0 });
  const cur         = useRef({ rx: 0, ry: 0 });
  const curScale    = useRef(1);          // lerped scale (no instant snapping)

  const loop = useCallback(() => {
    // Lerp rotation
    cur.current.rx += (tgt.current.rx - cur.current.rx) * ease;
    cur.current.ry += (tgt.current.ry - cur.current.ry) * ease;

    // Lerp scale — same ease so enter/leave both feel spring-like
    const tgtScale = hovered.current ? scale : 1;
    curScale.current += (tgtScale - curScale.current) * ease;

    const { rx, ry } = cur.current;
    const s = curScale.current;

    if (ref.current) {
      ref.current.style.transform =
        `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`;

      // Move the glare highlight to match the tilt angle
      const glare = ref.current.querySelector('.tilt-glare');
      if (glare) {
        const gx = (ry / max) * 50 + 50;   // 0–100 %
        const gy = (-rx / max) * 50 + 50;
        glare.style.background =
          `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 65%)`;
        glare.style.opacity = hovered.current ? '1' : '0';
      }
    }

    // Keep looping while hovered OR while still returning to rest
    const rotDist  = Math.abs(tgt.current.rx - cur.current.rx)
                   + Math.abs(tgt.current.ry - cur.current.ry);
    const scaleDist = Math.abs(tgtScale - curScale.current);

    if (hovered.current || rotDist > 0.02 || scaleDist > 0.0005) {
      animRef.current = requestAnimationFrame(loop);
    } else {
      // Fully settled — snap to exact zero and stop
      cur.current  = { rx: 0, ry: 0 };
      curScale.current = 1;
      if (ref.current) {
        ref.current.style.transform =
          `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
        const glare = ref.current.querySelector('.tilt-glare');
        if (glare) glare.style.opacity = '0';
      }
      animRef.current = null;
    }
  }, [ease, max, perspective, scale]);

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0 → 1
    const y = (e.clientY - rect.top)  / rect.height;
    tgt.current.rx = -(y - 0.5) * 2 * max;
    tgt.current.ry =  (x - 0.5) * 2 * max;
  }, [max]);

  const onMouseEnter = useCallback((e) => {
    hovered.current = true;
    if (!animRef.current) animRef.current = requestAnimationFrame(loop);
    onMouseMove(e);
  }, [loop, onMouseMove]);

  const onMouseLeave = useCallback(() => {
    hovered.current = false;
    tgt.current = { rx: 0, ry: 0 };
    // Ensure loop is running to spring back
    if (!animRef.current) animRef.current = requestAnimationFrame(loop);
  }, [loop]);

  return {
    ref,
    tiltProps: { onMouseMove, onMouseEnter, onMouseLeave },
  };
}
