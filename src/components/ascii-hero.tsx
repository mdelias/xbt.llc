'use client';

import { useEffect, useRef } from 'react';

const GLYPHS = {
  block: [' ', '░', '▒', '▓', '█'],
  boxH: ['╸', '╺', '━', '═'],
  boxV: ['╹', '╻', '┃', '║'],
  corner: ['┌', '┐', '└', '┘', '╔', '╗', '╚', '╝'],
  tee: ['├', '┤', '┬', '┴', '┼', '╠', '╣', '╦', '╩', '╬'],
  mech: ['◈', '◆', '⬡', '▣', '◉', '◎', '✦'],
  dots: ['·', '∙', '•', '●'],
  hex: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
  slash: ['╱', '╲'],
};

interface GlyphPoint {
  dx: number;
  dy: number;
  ch: string;
}

function makeGear(radius: number): GlyphPoint[] {
  const pts: GlyphPoint[] = [];
  for (let a = 0; a < 360; a += 15) {
    const rad = (a * Math.PI) / 180;
    const x = Math.round(Math.cos(rad) * radius);
    const y = Math.round(Math.sin(rad) * radius * 0.85);
    if (pts.some(p => Math.abs(p.dx - x) + Math.abs(p.dy - y) < 2)) continue;
    if (a % 30 === 0) {
      pts.push({ dx: x, dy: y, ch: a % 60 === 0 ? '◈' : '⬡' });
    } else {
      const norm = ((a % 360) + 360) % 360;
      let ch = '◆';
      if (norm < 30 || norm >= 330) ch = '═';
      else if (norm >= 60 && norm < 120) ch = '║';
      else if (norm >= 150 && norm < 210) ch = '═';
      else if (norm >= 240 && norm < 300) ch = '║';
      pts.push({ dx: x, dy: y, ch });
    }
  }
  pts.push({ dx: 0, dy: 0, ch: '◉' });
  for (let a = 0; a < 360; a += 30) {
    const rad = (a * Math.PI) / 180;
    for (let d = 1; d < radius - 1; d++) {
      const x = Math.round(Math.cos(rad) * d);
      const y = Math.round(Math.sin(rad) * d * 0.85);
      if (!pts.some(p => p.dx === x && p.dy === y)) {
        pts.push({ dx: x, dy: y, ch: d % 2 === 0 ? '╱' : '╲' });
      }
    }
  }
  return pts;
}

function makeArch(w: number, h: number): GlyphPoint[] {
  const pts: GlyphPoint[] = [];
  for (let dy = 0; dy < h; dy++) {
    pts.push({ dx: 0, dy, ch: '║' });
    pts.push({ dx: w - 1, dy, ch: '║' });
  }
  for (let dx = 0; dx < w; dx++) {
    const rx = (dx - (w - 1) / 2) / ((w - 1) / 2);
    const yOff = Math.round((1 - Math.sqrt(1 - rx * rx)) * h);
    let ch = '═';
    if (dx === 0 && yOff === 0) ch = '╔';
    else if (dx === w - 1 && yOff === 0) ch = '╗';
    else if (yOff === 0) ch = '═';
    else if (yOff > 0) ch = '║';
    if (!pts.some(p => p.dx === dx && p.dy === yOff)) {
      pts.push({ dx, dy: yOff, ch });
    }
  }
  pts.push({ dx: 0, dy: h - 1, ch: '╚' });
  pts.push({ dx: w - 1, dy: h - 1, ch: '╝' });
  return pts;
}

const gear2 = makeGear(2);
const gear3 = makeGear(3);
const gear4 = makeGear(4);

const gearPositions = [
  { cx: 16, cy: 6, scale: 1, speed: 0.8, data: gear3 },
  { cx: 64, cy: 5, scale: 1, speed: -0.6, data: gear3 },
  { cx: 40, cy: 4, scale: 0.7, speed: 1.0, data: gear2 },
  { cx: 10, cy: 18, scale: 0.7, speed: -0.9, data: gear2 },
  { cx: 28, cy: 17, scale: 0.9, speed: 0.5, data: gear4 },
  { cx: 52, cy: 18, scale: 0.9, speed: -0.4, data: gear4 },
  { cx: 70, cy: 16, scale: 0.6, speed: 0.7, data: gear2 },
  { cx: 40, cy: 12, scale: 0.5, speed: -0.8, data: gear2 },
];

const archLeft = makeArch(10, 9);
const archRight = makeArch(10, 9);

const dataCols = [7, 17, 30, 36, 44, 50, 60, 73];
const dataSpeeds = [2.5, 3.0, 1.8, 3.5, 2.2, 2.8, 3.2, 2.0];

export function AsciiHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let start = performance.now();

    const COLS = 80;
    const ROWS = 24;
    const CELL_W = 12;
    const CELL_H = 18;

    // Pre-generate 120 wave particles
    const wavePts: { c: number; r: number; phase: number; speed: number; ch: string }[] = [];
    for (let i = 0; i < 120; i++) {
      wavePts.push({
        c: Math.random() * COLS,
        r: Math.random() * ROWS,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        ch: ['╱', '╲', '━', '┃', '╱', '╲', '✦', '◆'][Math.floor(Math.random() * 8)],
      });
    }

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const t = (now - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#07070a';
      ctx.fillRect(0, 0, w, h);

      const gridW = COLS * CELL_W;
      const gridH = ROWS * CELL_H;
      const ox = Math.floor((w - gridW) / 2);
      const oy = Math.floor((h - gridH) / 2);

      ctx.font = '11px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';

      // ========= LAYER 1: Dense animated background =========
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const distFromCenter = Math.abs(c - COLS / 2) / (COLS / 2);
          const rowFade = 1 - Math.abs(r - ROWS / 2) / (ROWS / 2);
          const v = Math.sin(c * 0.2 + t * 0.8) * Math.sin(r * 0.25 - t * 0.6) * 0.3 + 0.3;
          const v2 = Math.sin(c * 0.1 - t * 0.4 + r * 0.12) * 0.2 + 0.2;
          const val = (v + v2) * rowFade * (1 - distFromCenter * 0.5);
          if (val > 0.1) {
            const ci = Math.min(3, Math.floor(val * 4));
            const bri = Math.floor(12 + val * 35);
            ctx.fillStyle = `rgba(0, ${bri}, ${Math.floor(bri * 0.7)}, ${0.4 + val * 0.3})`;
            ctx.fillText(GLYPHS.block[ci + 1], ox + c * CELL_W + CELL_W / 2, oy + r * CELL_H);
          }
        }
      }

      // ========= LAYER 2: Arch structures =========
      for (const p of archLeft) {
        const dc = 6 + p.dx;
        const dr = 6 + p.dy;
        const breathe = Math.sin(t * 0.5 + p.dy * 0.2) * 0.15 + 0.85;
        ctx.fillStyle = `hsla(195, 35%, ${32 * breathe}%, 0.55)`;
        ctx.fillText(p.ch, ox + dc * CELL_W + CELL_W / 2, oy + dr * CELL_H);
      }
      for (const p of archRight) {
        const dc = 64 + p.dx;
        const dr = 6 + p.dy;
        const breathe = Math.sin(t * 0.55 + p.dy * 0.25 + 1) * 0.15 + 0.85;
        ctx.fillStyle = `hsla(195, 35%, ${32 * breathe}%, 0.55)`;
        ctx.fillText(p.ch, ox + dc * CELL_W + CELL_W / 2, oy + dr * CELL_H);
      }
      // Top beam connecting arches
      for (let c = 16; c < 64; c++) {
        const pulse = Math.sin(t * 0.7 + c * 0.15) * 0.15 + 0.85;
        ctx.fillStyle = `hsla(190, 30%, ${25 * pulse}%, 0.4)`;
        ctx.fillText('═', ox + c * CELL_W + CELL_W / 2, oy + 6 * CELL_H);
      }

      // ========= LAYER 3: Fast rotating gears =========
      for (const g of gearPositions) {
        const angle = t * g.speed;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        for (const p of g.data) {
          const rx = p.dx * cosA - p.dy * sinA;
          const ry = p.dx * sinA + p.dy * cosA;
          const dc = Math.round(g.cx + rx * g.scale);
          const dr = Math.round(g.cy + ry * g.scale * 0.85);
          if (dc < 0 || dc >= COLS || dr < 0 || dr >= ROWS) continue;
          const pulse = Math.sin(t * g.speed * 2 + g.cx + p.dx * 0.3) * 0.2 + 0.8;
          ctx.fillStyle = `hsla(185, 45%, ${38 * pulse}%, 0.65)`;
          ctx.fillText(p.ch, ox + dc * CELL_W + CELL_W / 2, oy + dr * CELL_H);
        }
      }

      // ========= LAYER 4: Hex node network =========
      for (let r = 3; r < ROWS - 2; r += 3) {
        for (let c = 4; c < COLS - 4; c += 8) {
          const nc = c + Math.floor(Math.sin(t * 0.3 + r) * 1);
          const pulse = Math.sin(t * 0.8 + c * 0.3 + r) * 0.5 + 0.5;
          if (pulse > 0.2) {
            ctx.fillStyle = `hsla(150, 40%, ${15 + pulse * 30}%, ${0.3 + pulse * 0.4})`;
            ctx.fillText('⬡', ox + nc * CELL_W + CELL_W / 2, oy + r * CELL_H);
          }
        }
      }

      // ========= LAYER 5: Fast hex data streams =========
      for (let ci = 0; ci < dataCols.length; ci++) {
        const col = dataCols[ci];
        const speed = dataSpeeds[ci];
        const offset = (t * speed + col * 5) % (ROWS * 3);
        for (let i = 0; i < 14; i++) {
          const rr = Math.floor((offset + i * 1.8) % ROWS);
          const fade = 1 - i / 14;
          if (fade < 0.08) continue;
          ctx.fillStyle = `hsla(160, 30%, ${15 + fade * 25}%, ${fade * 0.4})`;
          const idx = Math.floor((t * 4 + col * 1.3 + i * 2.7) % GLYPHS.hex.length);
          ctx.fillText(GLYPHS.hex[idx], ox + col * CELL_W + CELL_W / 2, oy + rr * CELL_H);
        }
      }

      // ========= LAYER 6: Flowing wave particles =========
      for (const wp of wavePts) {
        wp.c += Math.sin(t * wp.speed + wp.phase) * 0.15;
        wp.r += Math.cos(t * wp.speed * 0.7 + wp.phase * 0.5) * 0.08;
        if (wp.c < 0) wp.c = COLS;
        if (wp.c > COLS) wp.c = 0;
        if (wp.r < 0) wp.r = ROWS;
        if (wp.r > ROWS) wp.r = 0;
        const distEdge = Math.min(wp.c, COLS - wp.c, wp.r, ROWS - wp.r) / 10;
        const fade = Math.min(1, distEdge);
        const bright = Math.sin(t * 0.8 + wp.phase) * 0.15 + 0.25;
        ctx.fillStyle = `hsla(180, 30%, ${15 + bright * 25}%, ${fade * bright * 0.4})`;
        ctx.fillText(wp.ch, ox + Math.floor(wp.c) * CELL_W + CELL_W / 2, oy + Math.floor(wp.r) * CELL_H);
      }

      // ========= LAYER 7: Sweeping scanline =========
      const scanY = ((t * 0.8) % (ROWS + 6)) - 3;
      for (let c = 0; c < COLS; c++) {
        const sy = Math.floor(scanY);
        if (sy >= 0 && sy < ROWS) {
          const dist = Math.abs(c - COLS / 2) / (COLS / 2);
          ctx.fillStyle = `hsla(180, 40%, ${35 - dist * 15}%, ${0.3 - dist * 0.15})`;
          ctx.fillText('▄', ox + c * CELL_W + CELL_W / 2, oy + sy * CELL_H);
        }
      }

      // ========= Vignette =========
      const grad = ctx.createRadialGradient(w / 2, h * 0.35, h * 0.05, w / 2, h * 0.35, h * 0.85);
      grad.addColorStop(0, 'rgba(7,7,10,0)');
      grad.addColorStop(0.4, 'rgba(7,7,10,0.15)');
      grad.addColorStop(1, 'rgba(7,7,10,0.75)');
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
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ mixBlendMode: 'screen', opacity: 0.85 }}
    />
  );
}