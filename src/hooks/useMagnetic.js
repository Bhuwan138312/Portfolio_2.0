import { useRef, useCallback } from 'react';

/**
 * useMagnetic — returns a ref to attach to any button/element.
 * On hover, the element glides toward the cursor.
 * On leave, it springs back to its original position.
 *
 * @param {number} strength  How far the element moves (0–1, default 0.35)
 * @param {number} ease      Spring speed on return (default 0.15)
 */
export default function useMagnetic(strength = 0.35, ease = 0.15) {
  const ref = useRef(null);
  const animRef = useRef(null);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const isHovered = useRef(false);

  const animate = useCallback(() => {
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    if (ref.current) {
      ref.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px)`;
    }

    const dist = Math.abs(targetX.current - currentX.current) + Math.abs(targetY.current - currentY.current);

    // Keep animating while hovered or while still springing back
    if (isHovered.current || dist > 0.05) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      // Snap to zero exactly and stop
      currentX.current = 0;
      currentY.current = 0;
      if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
      animRef.current = null;
    }
  }, [ease]);

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetX.current = (e.clientX - cx) * strength;
    targetY.current = (e.clientY - cy) * strength;
  }, [strength]);

  const onMouseEnter = useCallback((e) => {
    isHovered.current = true;
    if (!animRef.current) {
      animRef.current = requestAnimationFrame(animate);
    }
    onMouseMove(e);
  }, [animate, onMouseMove]);

  const onMouseLeave = useCallback(() => {
    isHovered.current = false;
    targetX.current = 0;
    targetY.current = 0;
    // Ensure animation loop is running to spring back
    if (!animRef.current) {
      animRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  return {
    ref,
    magneticProps: {
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
    },
  };
}
