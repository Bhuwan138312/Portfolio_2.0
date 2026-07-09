import { useState, useEffect, useRef } from 'react';

/**
 * Three-phase typewriter:
 * 1. idle        — waiting for startDelay
 * 2. intro       — types the full introText from scratch
 * 3. backtracking— cursor walks LEFT from end of line to end of first word
 * 4. cycling     — cursor sits after the role word and cycles through words[]
 */
export default function useTypewriter({
  introText       = '',
  words           = [],
  introSpeed      = 55,
  backtrackSpeed  = 22,   // ms per char while cursor walks back
  typeSpeed       = 85,
  deleteSpeed     = 40,
  pauseAfterIntro = 900,
  pauseAfter      = 1800,
  pauseBefore     = 350,
  startDelay      = 0,
} = {}) {
  const [mode,       setMode]       = useState('idle');
  const [displayed,  setDisplayed]  = useState('');
  const [cursorPos,  setCursorPos]  = useState(0);  // used during backtracking
  const [wordIndex,  setWordIndex]  = useState(0);
  const [cyclePhase, setCyclePhase] = useState('deleting');
  const timer = useRef(null);

  // Target cursor position = end of first word inside introText
  const targetPos = introText.indexOf(words[0]) + (words[0]?.length ?? 0);

  /* ── startDelay ──────────────────────────────────────────── */
  useEffect(() => {
    timer.current = setTimeout(() =>
      setMode(introText ? 'intro' : 'cycling'), startDelay);
    return () => clearTimeout(timer.current);
  }, []); // eslint-disable-line

  /* ── INTRO: type full line ───────────────────────────────── */
  useEffect(() => {
    if (mode !== 'intro') return;
    const clear = () => clearTimeout(timer.current);

    if (displayed.length < introText.length) {
      timer.current = setTimeout(() =>
        setDisplayed(introText.slice(0, displayed.length + 1)), introSpeed);
    } else {
      // Pause at end, then begin backtracking
      timer.current = setTimeout(() => {
        setCursorPos(introText.length);
        setMode('backtracking');
      }, pauseAfterIntro);
    }
    return clear;
  }, [mode, displayed]); // eslint-disable-line

  /* ── BACKTRACKING: cursor walks left to targetPos ────────── */
  useEffect(() => {
    if (mode !== 'backtracking') return;
    const clear = () => clearTimeout(timer.current);

    if (cursorPos > targetPos) {
      timer.current = setTimeout(() =>
        setCursorPos(p => p - 1), backtrackSpeed);
    } else {
      // Arrived — hand off to cycling, start with selection animation
      timer.current = setTimeout(() => {
        setDisplayed(words[0] || '');
        setWordIndex(0);
        setCyclePhase('selecting');
        setMode('cycling');
      }, pauseBefore);
    }
    return clear;
  }, [mode, cursorPos]); // eslint-disable-line

  /* ── CYCLING: delete / type / pause loop ────────────────── */
  useEffect(() => {
    if (mode !== 'cycling') return;
    const clear = () => clearTimeout(timer.current);
    const word = words[wordIndex % words.length];

    if (cyclePhase === 'selecting') {
      // Wait for the selection animation to finish before we pause and delete
      timer.current = setTimeout(() => setCyclePhase('pausing'), 1200);

    } else if (cyclePhase === 'typing') {
      if (displayed.length < word.length) {
        timer.current = setTimeout(() =>
          setDisplayed(word.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timer.current = setTimeout(() => setCyclePhase('pausing'), pauseAfter);
      }

    } else if (cyclePhase === 'pausing') {
      timer.current = setTimeout(() => setCyclePhase('deleting'), 0);

    } else if (cyclePhase === 'deleting') {
      if (displayed.length > 0) {
        timer.current = setTimeout(() =>
          setDisplayed(d => d.slice(0, -1)), deleteSpeed);
      } else {
        timer.current = setTimeout(() => {
          setWordIndex(i => (i + 1) % words.length);
          setCyclePhase('waiting');
        }, pauseBefore);
      }

    } else if (cyclePhase === 'waiting') {
      timer.current = setTimeout(() => {
        setDisplayed('');
        setCyclePhase('typing');
      }, pauseBefore);
    }
    return clear;
  }, [mode, cyclePhase, displayed, wordIndex]); // eslint-disable-line

  return {
    mode,          // 'idle' | 'intro' | 'backtracking' | 'cycling'
    cyclePhase,    // 'selecting' | 'typing' | 'pausing' | 'deleting' | 'waiting'
    displayed,     // typed text (intro) or current cycling word
    cursorPos,     // cursor index within introText (backtracking only)
    introText,     // full intro string (needed for backtracking render)
    isTyping: mode === 'intro' || cyclePhase === 'typing',
  };
}
