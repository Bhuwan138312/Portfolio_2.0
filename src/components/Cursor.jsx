'use client';

import { useEffect, useRef } from 'react';
import './Cursor.css';

export default function Cursor() {
  const blobRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (blobRef.current) {
        blobRef.current.style.left = `${e.clientX}px`;
        blobRef.current.style.top  = `${e.clientY}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };
    const onDown = () => dotRef.current?.classList.add('clicking');
    const onUp   = () => dotRef.current?.classList.remove('clicking');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  return (
    <>
      <div className="cursor-blob" ref={blobRef} />
      <div className="cursor-dot"  ref={dotRef} />
    </>
  );
}
