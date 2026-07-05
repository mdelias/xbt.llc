'use client';

import { useEffect, useRef } from 'react';

// Characters organized by visual family
const GLYPHS = {
  block: [' ', '░', '▒', '▓', '█'],
  boxH: ['╸', '╺', '━'],
  boxV: ['╹', '╻', '┃'],
  corner: ['┌', '┐', '└', '┘'],
  tee: ['├', '┤', '┬', '┴', '┼'],
  heavyBox: ['╴', '╶', '═', '║', '╔', '╗', '╚', '╝', '╠', '╣', '╦', '╩', '╬'],
  mech: ['◈', '◆', '⬡', '▣', '◉', '◎'],
  dots: ['·', '∙', '•', '●'],
  hex: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
  slash: ['╱', '╲'],
  star: ['✦', '✧'],
};

export function AsciiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let start = performance.now();

    // Grid configuration
    const COLS = 80;
    const ROWS = 24;
    const CELL_W = 12;
    const CELL_H = 18;

    // Pre-compute gear shapes as arrays of (dx, dy, char)
    function makeGear(r: number): { dx: number; dy: number; ch: string }[] {
      const pts: { dx: number; dy: number; ch: string }[] = [];
      // Outer ring — circle of box corners
      const cx = 0, cy = 0;
      for (let a = 0; a < 360; a += 30) {
        const rad = (a * Math.PI) / 180;
        const x = Math.round(Math.cos(rad) * r);
        const y = Math.round(Math.sin(rad) * (r * 0.85));
        // Skip if we already placed something nearby
        if (pts.some(p => Math.abs(p.dx - x) + Math.abs(p.dy - y) < 2)) continue;
        // Choose char based on angle quadrant
        const norm = ((a % 360) + 360) % 360;
        let ch = '◆';
        if (norm < 45 || norm >= 315) ch = '═';
        else if (norm < 135) ch = '║';
        else if (norm < 225) ch = '═';
        else ch = '║';
        if (x === 0 || y === 0) {
          if (x === 0 && y < 0) ch = '║';
          else if (x === 0 && y > 0) ch = '║';
          else if (y === 0 && x < 0) ch = '═';
          else if (y === 0 && x > 0) ch = '═';
        }
        pts.push({ dx: x, dy: y, ch });
      }
      // Inner hub
      pts.push({ dx: 0, dy: 0, ch: '◈' });
      // Spokes
      for (let a = 0; a < 360; a += 60) {
        const rad = (a * Math.PI) / 180;
        for (let d = 1; d < r - 1; d++) {
          const x = Math.round(Math.cos(rad) * d);
          const y = Math.round(Math.sin(rad) * (d * 0.85));
          if (!pts.some(p => p.dx === x && p.dy === y)) {
            pts.push({ dx: x, dy: y, ch: d % 2 === 0 ? '╱' : '╲' });
          }
        }
      }
      return pts;
    }

    // Pre-compute hex pattern
    function makeHexGrid(rows: number, cols: number): { r: number; c: number; angle: number }[] {
      const pts: { r: number; c: number; angle: number }[] = [];
      for (let r = 1; r < rows - 1; r += 2) {
        for (let c = 2; c < cols - 4; c += 7) {
          pts.push({ r, c, angle: Math.atan2(r - rows / 2, c - cols / 2) });
        }
      }
      return pts;
    }

    const gearData = makeGear(3);
    const gearData2 = makeGear(2);
    const hexData = makeHexGrid(ROWS, COLS);

    // Pre-compute arch shapes
    function makeArch(w: number, h: number): { dx: number; dy: number; ch: string }[] {
      const pts: { dx: number; dy: number; ch: string }[] = [];
      // Left pillar
      for (let dy = 0; dy < h; dy++) pts.push({ dx: 0, dy, ch: '┃' });
      // Right pillar
      for (let dy = 0; dy < h; dy++) pts.push({ dx: w - 1, dy, ch: '┃' });
      // Top arch — semicircle
      for (let dx = 0; dx < w; dx++) {
        const rx = (dx - (w - 1) / 2) / ((w - 1) / 2);
        const yOff = Math.round((1 - Math.sqrt(1 - rx * rx)) * h);
        const isLeft = dx === 0;
        const isRight = dx === w - 1;
        let ch = '━';
        if (isLeft && yOff === 0) ch = '┌';
        else if (isRight && yOff === 0) ch = '┐';
        else if (yOff === 0) ch = '━';
        else if (yOff > 0) ch = '┃';
        pts.push({ dx, dy: yOff, ch });
      }
      // Bottom beam
      for (let dx = 1; dx < w - 1; dx++) {
        if (!pts.some(p => p.dx === dx && p.dy === h - 1)) {
          pts.push({ dx, dy: h - 1, ch: '━' });
        }
      }
      pts.push({ dx: 0, dy: h - 1, ch: '└' });
      pts.push({ dx: w - 1, dy: h - 1, ch: '┘' });
      return pts;
    }

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const t = (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, w, h);

      const gridW = COLS * CELL_W;
      const gridH = ROWS * CELL_H;
      const ox = Math.floor((w - gridW) / 2);
      const oy = Math.floor((h - gridH) / 2);

      ctx.font = '11px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';

      // ========== LAYER 1: Static circuit-board grid ==========
      // Dim grid lines at every cell
      ctx.fillStyle = 'rgba(20,40,50,0.3)';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          // Every 4th cell gets a sparse dot
          if ((r + c) % 4 === 0) {
            ctx.fillText('·', ox + c * CELL_W + CELL_W / 2, oy + r * CELL_H);
          }
        }
      }

      // ========== LAYER 2: Tiled arch structures ==========
      // Two large arches framing the sides
      const archPositions = [
        { cx: 8, cy: 6, w: 9, h: 8 },
        { cx: 62, cy: 6, w: 9, h: 8 },
      ];
      for (const arch of archPositions) {
        const pts = makeArch(arch.w, arch.h);
        for (const p of pts) {
          const drawX = ox + (arch.cx + p.dx) * CELL_W + CELL_W / 2;
          const drawY = oy + (arch.cy + p.dy) * CELL_H;
          const breathe = Math.sin(t * 0.3 + arch.cx) * 0.1 + 0.9;
          ctx.fillStyle = `hsla(190, 30%, ${28 * breathe}%, 0.5)`;
          ctx.fillText(p.ch, drawX, drawY);
        }
      }

      // ========== LAYER 3: Rotating gears ==========
      const gearPositions = [
        { cx: 22, cy: 8, scale: 1, speed: 0.4, data: gearData },
        { cx: 50, cy: 6, scale: 1, speed: -0.3, data: gearData },
        { cx: 14, cy: 17, scale: 0.7, speed: 0.5, data: gearData2 },
        { cx: 65, cy: 17, scale: 0.7, speed: -0.4, data: gearData2 },
        { cx: 40, cy: 4, scale: 0.5, speed: 0.6, data: gearData2 },
        { cx: 40, cy: 19, scale: 0.5, speed: -0.5, data: gearData2 },
      ];

      for (const g of gearPositions) {
        const angle = t * g.speed;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        for (const p of g.data) {
          // Rotate gear point
          const rx = p.dx * cosA - p.dy * sinA;
          const ry = p.dx * sinA + p.dy * cosA;
          const drawC = Math.round(g.cx + rx * g.scale);
          const drawR = Math.round(g.cy + ry * g.scale * 0.85);
          if (drawC < 0 || drawC >= COLS || drawR < 0 || drawR >= ROWS) continue;
          // Pulse brightness
          const pulse = Math.sin(t * 0.6 + g.cx * 0.1 + p.dx * 0.5) * 0.15 + 0.85;
          ctx.fillStyle = `hsla(185, 45%, ${35 * pulse}%, 0.6)`;
          ctx.fillText(
            p.ch,
            ox + drawC * CELL_W + CELL_W / 2,
            oy + drawR * CELL_H,
          );
        }
      }

      // ========== LAYER 4: Hex mesh (blockchain nodes) ==========
      // Tiled hexagonal pattern
      const hexTime = t * 0.2;
      for (const hx of hexData) {
        const pulse = Math.sin(t * 0.5 + hx.angle * 3) * 0.5 + 0.5;
        if (pulse > 0.3) {
          const bri = 25 + pulse * 25;
          ctx.fillStyle = `hsla(155, 35%, ${bri}%, ${0.3 + pulse * 0.3})`;
          ctx.fillText(
            '⬡',
            ox + hx.c * CELL_W + CELL_W / 2,
            oy + hx.r * CELL_H,
          );
        }
      }

      // ========== LAYER 5: Repeating data stream ==========
      // Column-based hex character rain, very dim, very slow
      const dataCols = [9, 20, 35, 45, 58, 72];
      for (const col of dataCols) {
        const offset = (t * 1.5 + col * 7) % (ROWS * 2);
        for (let i = 0; i < 10; i++) {
          const r = Math.floor((offset + i * 2.3) % ROWS);
          const fade = 1 - i / 10;
          if (fade < 0.1) continue;
          ctx.fillStyle = `hsla(160, 25%, ${20 + fade * 15}%, ${fade * 0.25})`;
          const hexChar = GLYPHS.hex[Math.floor((t * 2 + col + i * 3) % GLYPHS.hex.length)];
          ctx.fillText(hexChar, ox + col * CELL_W + CELL_W / 2, oy + r * CELL_H);
        }
      }

      // ========== LAYER 6: Construction wave ==========
      // A wave of brightness that sweeps left-to-right periodically
      const wavePhase = (t * 0.15) % 1;
      const waveCenter = wavePhase * COLS;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const dist = Math.abs(c - waveCenter);
          if (dist < 4) {
            const fade = 1 - dist / 4;
            const bri = Math.floor(25 + fade * 30);
            ctx.fillStyle = `hsla(180, 40%, ${bri}%, ${fade * 0.25})`;
            const glowChars = ['·', '∙', '•', '+'];
            const ci = Math.min(3, Math.floor(dist));
            ctx.fillText(
              glowChars[ci],
              ox + c * CELL_W + CELL_W / 2,
              oy + r * CELL_H,
            );
          }
        }
      }

      // ========== Vignette ==========
      const grad = ctx.createRadialGradient(
        w / 2, h * 0.4, h * 0.1,
        w / 2, h * 0.4, h * 0.8,
      );
      grad.addColorStop(0, 'rgba(8,8,10,0)');
      grad.addColorStop(0.5, 'rgba(8,8,10,0.3)');
      grad.addColorStop(1, 'rgba(8,8,10,0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    }

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement!;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
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
      style={{ mixBlendMode: 'screen', opacity: 0.7 }}
    />
  );
}