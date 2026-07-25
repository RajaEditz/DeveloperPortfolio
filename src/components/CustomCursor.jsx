import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    };
    
    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (isTouch) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (hidden) setHidden(false);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e) => {
      if (!e.target) return;
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('.interactive-card') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');
      setHovered(isInteractive);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouch, hidden]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-blue-500/50 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(0,0,0,0.15)]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: hovered ? 1.5 : clicked ? 0.8 : 1,
          backgroundColor: hovered ? 'rgba(15, 91, 92, 0.08)' : 'rgba(0,0,0,0)',
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: hovered ? 0.4 : clicked ? 1.4 : 1,
        }}
      />
    </>
  );
}
