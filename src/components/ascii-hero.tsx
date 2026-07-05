'use client';

import { useEffect, useRef } from 'react';

const CHARS = {
  block: [' ', '░', '▒', '▓', '█'],
  scaffold: ['╸', '╺', '━', '│', '┃', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼'],
  mech: ['◈', '◆', '⬡', '▣', '◉', '◎'],
  sparks: ['·', '∙', '•', '✦', '✧', '+'],
  tech: ['<', '>', '/', '\\', '|', '=', '╱', '╲'],
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ch: string;
  hue: number;
}

export function AsciiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let start = performance.now();

    const cols = 80;
    const rows = 24;
    const cw = 12;
    const ch = 18;

    const particles: Particle[] = [];
    let particlesInit = false;

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement!;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    function emitSparks(cx: number, cy: number, count: number) {
      for (let i = 0; i < count; i++) {
        if (particles.length >= 120) break;
        const ang = Math.random() * Math.PI * 2;
        const spd = 0.5 + Math.random() * 2.5;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1,
          life: 0.6 + Math.random() * 0.4,
          ch: CHARS.sparks[Math.floor(Math.random() * CHARS.sparks.length)],
          hue: 0.12 + Math.random() * 0.08,
        });
      }
    }

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const t = (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      const gridW = cols * cw;
      const gridH = rows * ch;
      const ox = Math.floor((w - gridW) / 2);
      const oy = Math.floor((h - gridH) / 2);

      ctx.font = '11px monospace';
      ctx.textBaseline = 'top';

      // Layer 1: Background sine field (block chars)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v =
            Math.sin(c * 0.13 + t * 0.5) * Math.sin(r * 0.17 - t * 0.4) * 0.5 +
            0.5;
          const v2 =
            Math.sin(c * 0.07 - t * 0.3 + r * 0.09) * 0.4 + 0.5;
          const val = Math.min(1, (v * 0.6 + v2 * 0.4) * 0.3);
          if (val > 0.03) {
            const ci = Math.min(3, Math.floor(val * 4));
            const chChar = CHARS.block[ci];
            const b = Math.floor(20 + val * 40);
            ctx.fillStyle = `rgb(0,${b},${Math.floor(b * 0.6)})`;
            ctx.fillText(chChar, ox + c * cw, oy + r * ch);
          }
        }
      }

      // Layer 2: Mechanical construction (scaffolds + gears)
      const framePhase = (t * 0.2) % (cols * 2);
      for (let i = 0; i < 3; i++) {
        const fx = ((i * 27 + Math.floor(t * 0.5)) % (cols - 4)) + 2;
        const fy = ((i * 13 + Math.floor(t * 0.3)) % (rows - 6)) + 3;
        const fw = 4 + Math.floor(Math.sin(t * 0.4 + i) * 3 + 3);
        const fh = 3 + Math.floor(Math.cos(t * 0.5 + i * 0.7) * 2 + 2);

        for (let dx = 0; dx < fw; dx++) {
          const cx = fx + dx;
          ctx.fillStyle = `hsl(170, 40%, ${30 + Math.sin(t + dx * 0.3) * 10 + 10}%)`;
          ctx.fillText(
            dx === 0 ? '┌' : dx === fw - 1 ? '┐' : '━',
            ox + cx * cw,
            oy + fy * ch,
          );
        }
        for (let dx = 0; dx < fw; dx++) {
          const cx = fx + dx;
          ctx.fillStyle = `hsl(170, 40%, ${30 + Math.cos(t * 0.7 + dx * 0.3) * 10 + 10}%)`;
          ctx.fillText(
            dx === 0 ? '└' : dx === fw - 1 ? '┘' : '━',
            ox + cx * cw,
            oy + (fy + fh) * ch,
          );
        }
        for (let dy = 1; dy < fh; dy++) {
          ctx.fillStyle = `hsl(170, 40%, 35%)`;
          ctx.fillText('┃', ox + fx * cw, oy + (fy + dy) * ch);
          ctx.fillText('┃', ox + (fx + fw - 1) * cw, oy + (fy + dy) * ch);
        }
      }

      const gearPositions = [
        { cx: 12, cy: 5, speed: 0.6 },
        { cx: 55, cy: 3, speed: -0.8 },
        { cx: 30, cy: 18, speed: 0.5 },
        { cx: 70, cy: 15, speed: -0.4 },
      ];
      for (const g of gearPositions) {
        const gi = Math.floor(t * g.speed) % CHARS.mech.length;
        ctx.fillStyle = `hsl(185, 50%, ${40 + Math.sin(t * g.speed + g.cx) * 10 + 10}%)`;
        ctx.fillText(
          CHARS.mech[gi],
          ox + g.cx * cw,
          oy + g.cy * ch,
        );
      }

      // Layer 3: Hexagon blockchain nodes
      for (let i = 0; i < 6; i++) {
        const nx = 10 + i * 12 + Math.sin(t * 0.2 + i * 1.1) * 2;
        const ny = 5 + Math.floor(i * 2.5) + Math.cos(t * 0.3 + i * 0.8) * 1;
        const pulse = Math.sin(t * 0.8 + i * 1.3) * 0.5 + 0.5;
        if (pulse > 0.4) {
          ctx.fillStyle = `hsl(140, 40%, ${20 + pulse * 30}%)`;
          ctx.fillText('⬡', ox + nx * cw, oy + ny * ch);
        }
        if (i < 5) {
          const nx2 = 10 + (i + 1) * 12 + Math.sin(t * 0.2 + (i + 1) * 1.1) * 2;
          const ny2 = 5 + Math.floor((i + 1) * 2.5) + Math.cos(t * 0.3 + (i + 1) * 0.8) * 1;
          const fade = Math.sin(t * 0.5 + i) * 0.3 + 0.4;
          ctx.fillStyle = `hsl(140, 30%, ${20 + fade * 15}%)`;
          const mx = (nx + nx2) / 2;
          const my = (ny + ny2) / 2;
          ctx.fillText('╱', ox + Math.floor(mx) * cw, oy + Math.floor(my) * ch);
        }
      }

      // Layer 4: Particles
      if (!particlesInit) {
        particlesInit = true;
        for (let i = 0; i < 30; i++) {
          emitSparks(Math.random() * cols, Math.random() * rows, 1);
        }
      }

      if (Math.random() < 0.3) {
        for (const g of gearPositions) {
          if (Math.random() < 0.2) emitSparks(g.cx, g.cy, 2);
        }
      }
      if (Math.random() < 0.2) {
        emitSparks(12 + Math.random() * 55, 3 + Math.random() * 16, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * 0.15;
        p.y += p.vy * 0.1;
        p.vy += 0.02;
        p.life -= 0.008;

        if (p.life <= 0 || p.x < 0 || p.x >= cols || p.y < 0 || p.y >= rows) {
          particles.splice(i, 1);
          continue;
        }

        const b = Math.floor(p.life * 180);
        const h = Math.floor(p.hue * 60);
        ctx.fillStyle = `hsl(${h + 40}, 70%, ${b / 2.55}%)`;
        ctx.fillText(p.ch, ox + p.x * cw, oy + p.y * ch);
      }

      // Vignette
      const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.7);
      grad.addColorStop(0, 'rgba(10,10,10,0)');
      grad.addColorStop(1, 'rgba(10,10,10,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}