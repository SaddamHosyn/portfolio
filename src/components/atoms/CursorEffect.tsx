import { useEffect, useRef } from 'react';

const CursorEffect = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let glowX = 0;
    let glowY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, input, textarea, select, [role="button"]');
      scaleRef.current = interactive ? 1.5 : 1;

      // Create particle on move (throttled)
      if (Math.random() > 0.95) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create multiple particles on click
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          createParticle(e.clientX, e.clientY, true);
        }, i * 20);
      }
    };

    const createParticle = (x: number, y: number, isClick = false) => {
      if (!particlesRef.current) return;

      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      
      const size = isClick ? Math.random() * 8 + 4 : Math.random() * 4 + 2;
      const duration = isClick ? Math.random() * 1000 + 500 : Math.random() * 800 + 400;
      const angle = Math.random() * Math.PI * 2;
      const velocity = isClick ? Math.random() * 100 + 50 : Math.random() * 30 + 20;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
        z-index: 9999;
        border-radius: 50%;
        background: linear-gradient(135deg, #804dee, #bf61ff);
        box-shadow: 0 0 ${size * 2}px rgba(128, 77, 238, 0.6);
        --dx: ${dx}px;
        --dy: ${dy}px;
        animation: particleFloat ${duration}ms ease-out forwards;
      `;

      particlesRef.current.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, duration);
    };

    // Smooth animation loop
    const animate = () => {
      // Cursor follows with slight delay for smooth effect
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      cursorX += dx * 0.2;
      cursorY += dy * 0.2;

      // Glow follows with more delay for trailing effect
      const gdx = mouseX - glowX;
      const gdy = mouseY - glowY;
      glowX += gdx * 0.06;
      glowY += gdy * 0.06;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${scaleRef.current})`;
      }

      if (cursorGlowRef.current) {
        const glowScale = scaleRef.current > 1 ? 1.3 : 1;
        cursorGlowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) scale(${glowScale})`;
      }

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00cea8, #bf61ff)',
          pointerEvents: 'none',
          zIndex: 10000,
          marginLeft: '-6px',
          marginTop: '-6px',
          boxShadow: '0 0 20px rgba(191, 97, 255, 0.8), 0 0 40px rgba(0, 206, 168, 0.4)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Trailing glow effect */}
      <div
        ref={cursorGlowRef}
        className="cursor-glow"
        style={{
          position: 'fixed',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 77, 238, 0.4) 0%, rgba(191, 97, 255, 0.2) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9999,
          marginLeft: '-40px',
          marginTop: '-40px',
          filter: 'blur(15px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Particles container */}
      <div
        ref={particlesRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
    </>
  );
};

export default CursorEffect;
