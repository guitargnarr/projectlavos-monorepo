import { useEffect, useRef, useState } from 'react';

/*
  MethodCanvas - Subtle ambient texture for the Method section

  Design: Minimal floating particles that add depth without competing
  with content. Think: dust motes in light, not a constellation map.
*/

export function MethodCanvas({ isVisible }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles - sparse and subtle
  useEffect(() => {
    const initParticles = () => {
      const particles = [];
      const width = dimensions.width || 800;
      const height = dimensions.height || 400;

      // Only 12-15 particles, positioned toward edges
      const particleCount = 15;

      for (let i = 0; i < particleCount; i++) {
        // Bias toward edges (corners and sides)
        const edgeBias = Math.random();
        let x, y;

        if (edgeBias < 0.4) {
          // Left or right edge
          x = Math.random() < 0.5 ? width * 0.05 + Math.random() * width * 0.15 : width * 0.8 + Math.random() * width * 0.15;
          y = Math.random() * height;
        } else if (edgeBias < 0.7) {
          // Top or bottom edge
          x = Math.random() * width;
          y = Math.random() < 0.5 ? height * 0.05 + Math.random() * height * 0.2 : height * 0.75 + Math.random() * height * 0.2;
        } else {
          // Scattered (sparse)
          x = Math.random() * width;
          y = Math.random() * height;
        }

        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius: 1 + Math.random() * 1.5, // Small: 1-2.5px
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.005, // Very slow drift
          isTeal: Math.random() > 0.3, // 70% teal, 30% amber
        });
      }

      particlesRef.current = particles;
    };

    if (dimensions.width > 0) {
      initParticles();
    }
  }, [dimensions]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop - minimal and smooth
  useEffect(() => {
    if (!canvasRef.current || !isVisible || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const teal = { r: 20, g: 184, b: 166 };
    const amber = { r: 200, g: 149, b: 108 };

    let time = 0;

    const animate = () => {
      time += 0.016;

      // Clear completely (no trails)
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((p) => {
        // Gentle floating motion
        p.x = p.baseX + Math.sin(time * 0.5 + p.phase) * 8;
        p.y = p.baseY + Math.cos(time * 0.3 + p.phase) * 6;

        const color = p.isTeal ? teal : amber;

        // Simple dot with soft edge - no glow, no pulse
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2
        );
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw very faint connections only between nearby particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only connect if very close, and very faint
          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.08; // Max 8% opacity
            ctx.strokeStyle = `rgba(${teal.r}, ${teal.g}, ${teal.b}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.25, // Much more subtle
        pointerEvents: 'none',
      }}
    />
  );
}

export default MethodCanvas;
