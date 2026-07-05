'use client';

import { useEffect, useRef } from 'react';

const BLOCK = [' ', '░', '▒', '▓', '█'];
const HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const GEAR_CHARS = ['◈', '◆', '⬡', '▣', '◉', '◎', '✦', '⬢'];

interface GP { dx: number; dy: number; ch: string }

function mkGear(r: number): GP[] {
  const pts: GP[] = [];
  for (let a = 0; a < 360; a += 12) {
    const rad = (a * Math.PI) / 180;
    const x = Math.round(Math.cos(rad) * r);
    const y = Math.round(Math.sin(rad) * r * 0.85);
    if (pts.some(p => Math.abs(p.dx - x) + Math.abs(p.dy - y) < 2)) continue;
    const n = ((a % 360) + 360) % 360;
    let ch = '◆';
    if (n < 24 || n >= 336) ch = '═'; else if (n >= 60 && n < 120) ch = '║';
    else if (n >= 156 && n < 204) ch = '═'; else if (n >= 240 && n < 300) ch = '║';
    if (a % 24 === 0) ch = GEAR_CHARS[(a / 24) % GEAR_CHARS.length];
    pts.push({ dx: x, dy: y, ch });
  }
  pts.push({ dx: 0, dy: 0, ch: '◉' });
  for (let a = 0; a < 360; a += 24) {
    const rad = (a * Math.PI) / 180;
    for (let d = 1; d < r - 1; d++) {
      const x = Math.round(Math.cos(rad) * d);
      const y = Math.round(Math.sin(rad) * d * 0.85);
      if (!pts.some(p => p.dx === x && p.dy === y))
        pts.push({ dx: x, dy: y, ch: d % 2 === 0 ? '╱' : '╲' });
    }
  }
  return pts;
}

function mkArch(w: number, h: number): GP[] {
  const pts: GP[] = [];
  for (let dy = 0; dy < h; dy++) { pts.push({ dx: 0, dy, ch: '║' }); pts.push({ dx: w - 1, dy, ch: '║' }); }
  for (let dx = 0; dx < w; dx++) {
    const rx = (dx - (w - 1) / 2) / ((w - 1) / 2);
    const yOff = Math.round((1 - Math.sqrt(1 - rx * rx)) * h);
    if (dx === 0 && yOff === 0) pts.push({ dx, dy: yOff, ch: '╔' });
    else if (dx === w - 1 && yOff === 0) pts.push({ dx, dy: yOff, ch: '╗' });
    else if (yOff === 0) pts.push({ dx, dy: 0, ch: '═' });
    else if (yOff > 0 && !pts.some(p => p.dx === dx && p.dy === yOff)) pts.push({ dx, dy: yOff, ch: '║' });
  }
  pts.push({ dx: 0, dy: h - 1, ch: '╚' }, { dx: w - 1, dy: h - 1, ch: '╝' });
  return pts;
}

const g2 = mkGear(2);
const g3 = mkGear(3);
const g4 = mkGear(4);
const g5 = mkGear(5);

const gears = [
  { cx: 14, cy: 6, sp: 1.2, da: g4 },
  { cx: 66, cy: 5, sp: -0.9, da: g4 },
  { cx: 40, cy: 3, sp: 1.5, da: g2 },
  { cx: 40, cy: 19, sp: -1.1, da: g3 },
  { cx: 28, cy: 16, sp: 0.7, da: g5 },
  { cx: 52, cy: 17, sp: -0.6, da: g5 },
  { cx: 8, cy: 19, sp: 1.3, da: g2 },
  { cx: 72, cy: 18, sp: -1.0, da: g2 },
  { cx: 18, cy: 14, sp: -0.8, da: g3 },
  { cx: 62, cy: 14, sp: 0.7, da: g3 },
];

const archL = mkArch(10, 9);
const archR = mkArch(10, 9);
const dataSpecs: { col: number; speed: number; len: number }[] = [
  { col: 5, speed: 4.0, len: 18 }, { col: 14, speed: 3.2, len: 14 },
  { col: 24, speed: 5.0, len: 20 }, { col: 32, speed: 2.8, len: 16 },
  { col: 42, speed: 4.5, len: 18 }, { col: 50, speed: 3.0, len: 14 },
  { col: 58, speed: 5.5, len: 20 }, { col: 67, speed: 3.5, len: 16 },
  { col: 75, speed: 4.2, len: 14 },
];

// Bitcoin genesis block hex dump — each row: byte-offset | 16 hex bytes | ASCII right-panel
const GENESIS_LINES = [
  '00000000  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................',
  '00000010  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................',
  '00000020  00 00 00 00 3B A3 ED FD 7A 7B 12 B2 7A C7 2C 3E  ....;£íýz{.²zÇ,>',
  '00000030  67 76 8F 61 7F C8 1B C3 88 8A 51 32 3A 9F B8 AA  gv.a.È.ÃˆŠQ2:Ÿ¸ª',
  '00000040  4B 1E 5E 4A 29 AB 5F 49 FF FF 00 1D 1D AC 2B 7C  K.^J)«_Iÿÿ...¬+|',
  '00000050  01 01 00 00 00 01 00 00 00 00 00 00 00 00 00 00  ................',
  '00000060  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................',
  '00000070  00 00 00 00 FF FF FF FF 4D 04 FF FF 00 1D 1D 08  ....ÿÿÿÿM.ÿÿ....',
  '00000080  04 45 54 68 65 20 54 69 6D 65 73 20 30 33 2F 4A  .EThe Times 03/J',
  '00000090  61 6E 2F 32 30 30 39 20 43 68 61 6E 63 65 6C 6C  an/2009 Chancel',
  '000000A0  6F 72 20 6F 6E 20 62 72 69 6E 6B 20 6F 66 20 63  lor on brink of c',
  '000000B0  68 61 6E 63 65 6C 6C 6F 72 20 66 6F 72 20 73 65  hancellor for se',
  '000000C0  63 6F 6E 64 20 62 61 69 6C 6F 75 74 20 66 6F 72  cond bailout for',
  '000000D0  20 62 61 6E 6B 73 FF FF FF FF 01 00 F2 05 2A 01   banksÿÿÿÿ..ò.*.',
  '000000E0  00 00 00 43 41 04 67 8A FD B0 FE 55 48 27 19 67  ...CA.gŠý°þUH\'.g',
  '000000F0  F1 A6 71 30 B7 10 5C D6 A8 28 E0 39 09 A6 79 62  ñ¦q0·.\\Ö¨(à9.¦yb',
  '00000100  E0 EA 1F 61 DE B6 49 F6 BC 3F 4C EF 38 C4 F3 55  àê.aÞ¶Iö¼?Lï8ÄóU',
  '00000110  04 E5 1E C1 12 DE 5C 38 4D F7 BA 0B 8D 57 8A 4C  .å.Á.Þ\\8M÷º..WŠL',
  '00000120  70 2B 6B F1 1D 5F AC 00 00 00 00                 p+kñ._¬.....',
];

export function AsciiHero() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let aid: number;
    let start = performance.now();
    const COLS = 80, ROWS = 24, CW = 12, CH = 18;

    // wave particles
    const waves = Array.from({ length: 160 }, () => ({
      c: Math.random() * COLS, r: Math.random() * ROWS,
      ph: Math.random() * 6.28, sp: 0.3 + Math.random() * 0.6,
      ch: '╱╲━┃◈◆⬡+'[Math.floor(Math.random() * 8)],
    }));

    function draw(now: number) {
      if (!cv || !ctx) return;
      const t = (now - start) / 1000;
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      const grW = COLS * CW, grH = ROWS * CH;
      const ox = Math.floor((w - grW) / 2), oy = Math.floor((h - grH) / 2);
      ctx.font = '11px monospace';
      ctx.textBaseline = 'top'; ctx.textAlign = 'center';

      // L1: Dense animated background — full field block chars
      for (let r = 0; r < ROWS; r++) {
        const rn = r / ROWS;
        for (let c = 0; c < COLS; c++) {
          const cn = c / COLS;
          const v = Math.sin(c * 0.25 + t * 1.2) * Math.sin(r * 0.3 - t * 0.8) * 0.25 + 0.25;
          const v2 = Math.sin(c * 0.12 - t * 0.5 + r * 0.15) * 0.15 + 0.15;
          const val = (v + v2) * 0.7;
          if (val > 0.08) {
            const ci = Math.min(3, Math.floor(val * 4));
            const bri = Math.floor(30 + val * 60);
            ctx.fillStyle = `rgb(0,${bri},${Math.floor(bri * 0.7)})`;
            ctx.fillText(BLOCK[ci + 1], ox + c * CW + CW / 2, oy + r * CH);
          }
        }
      }

      // L2: Structural arches (brighter now)
      for (const p of archL) {
        const dc = 6 + p.dx, dr = 5 + p.dy;
        const br = Math.sin(t * 0.6 + p.dy * 0.2) * 10 + 50;
        ctx.fillStyle = `hsl(195, 50%, ${br}%)`;
        ctx.fillText(p.ch, ox + dc * CW + CW / 2, oy + dr * CH);
      }
      for (const p of archR) {
        const dc = 64 + p.dx, dr = 5 + p.dy;
        const br = Math.sin(t * 0.65 + p.dy * 0.25 + 1) * 10 + 50;
        ctx.fillStyle = `hsl(195, 50%, ${br}%)`;
        ctx.fillText(p.ch, ox + dc * CW + CW / 2, oy + dr * CH);
      }
      // Top beam
      for (let c = 16; c < 64; c++) {
        const br = Math.sin(t * 0.8 + c * 0.15) * 10 + 45;
        ctx.fillStyle = `hsl(190, 45%, ${br}%)`;
        ctx.fillText('═', ox + c * CW + CW / 2, oy + 5 * CH);
      }

      // L3: Rotating gears with visible brightness
      for (const g of gears) {
        const angle = t * g.sp;
        const cosA = Math.cos(angle), sinA = Math.sin(angle);
        for (const p of g.da) {
          const rx = p.dx * cosA - p.dy * sinA;
          const ry = p.dx * sinA + p.dy * cosA;
          const dc = Math.round(g.cx + rx), dr = Math.round(g.cy + ry * 0.85);
          if (dc < 0 || dc >= COLS || dr < 0 || dr >= ROWS) continue;
          const pls = Math.sin(t * g.sp * 2 + g.cx + p.dx * 0.3) * 15 + 55;
          ctx.fillStyle = `hsl(${180 + Math.sin(t * 0.3 + g.cx) * 10}, 55%, ${pls}%)`;
          ctx.fillText(p.ch, ox + dc * CW + CW / 2, oy + dr * CH);
        }
      }

      // L4: Hex node network (brighter, larger)
      for (let r = 2; r < ROWS - 2; r += 3) {
        for (let c = 4; c < COLS - 4; c += 7) {
          const nc = c + Math.floor(Math.sin(t * 0.5 + r) * 1.5);
          const pulse = Math.sin(t * 1.0 + c * 0.4 + r) * 0.5 + 0.5;
          if (pulse > 0.1) {
            const bri = Math.floor(40 + pulse * 60);
            ctx.fillStyle = `hsl(150, 55%, ${bri}%)`;
            ctx.fillText('⬡', ox + nc * CW + CW / 2, oy + r * CH);
          }
        }
      }

      // L5: Hex data streams (fast, bright)
      for (const ds of dataSpecs) {
        const offset = (t * ds.speed + ds.col * 5) % (ROWS * 3);
        for (let i = 0; i < ds.len; i++) {
          const rr = Math.floor((offset + i * 1.8) % ROWS);
          const fade = 1 - i / ds.len;
          if (fade < 0.05) continue;
          const bri = Math.floor(30 + fade * 90);
          ctx.fillStyle = `hsl(158, 50%, ${bri}%)`;
          const idx = Math.floor((t * 6 + ds.col * 1.3 + i * 2.7) % HEX.length);
          ctx.fillText(HEX[idx], ox + ds.col * CW + CW / 2, oy + rr * CH);
          // Bright head
          if (i === 0 || i === 1) {
            ctx.fillStyle = `hsl(160, 70%, ${bri + 30}%)`;
            ctx.fillText(HEX[idx], ox + ds.col * CW + CW / 2, oy + rr * CH);
          }
        }
      }

      // L6: Wave particles (flowing across screen)
      for (const wp of waves) {
        wp.c += Math.sin(t * wp.sp + wp.ph) * 0.2;
        wp.r += Math.cos(t * wp.sp * 0.7 + wp.ph * 0.5) * 0.12;
        if (wp.c < 0) wp.c = COLS; if (wp.c > COLS) wp.c = 0;
        if (wp.r < 0) wp.r = ROWS; if (wp.r > ROWS) wp.r = 0;
        const de = Math.min(wp.c, COLS - wp.c, wp.r, ROWS - wp.r) / 8;
        const fade = Math.min(1, de);
        const bright = Math.sin(t * 1.0 + wp.ph) * 20 + 40;
        if (fade > 0.1) {
          ctx.fillStyle = `hsl(180, 40%, ${bright}%)`;
          ctx.fillText(wp.ch, ox + Math.floor(wp.c) * CW + CW / 2, oy + Math.floor(wp.r) * CH);
        }
      }

      // L7: Genesis block bytes scattered into hex columns
      for (const ds of dataSpecs) {
        if (ds.col % 3 === 0) continue; // only some columns
        const offset = (t * ds.speed * 1.5 + ds.col * 7) % (GENESIS_LINES.length * 4);
        const glIdx = Math.floor(offset / 4) % GENESIS_LINES.length;
        const gl = GENESIS_LINES[glIdx];
        const charInLine = Math.floor((offset % 4) * 14 + 10 + (ds.col % 5) * 2);
        if (charInLine < gl.length) {
          const rr = Math.floor((t * 5 + ds.col) % ROWS);
          ctx.fillStyle = `hsl(155, 40%, 55%)`;
          ctx.fillText(gl[charInLine], ox + ds.col * CW + CW / 2, oy + rr * CH);
        }
      }

      // L7: Bright sweeping scanline
      const scanY = ((t * 1.2) % (ROWS + 8)) - 4;
      for (let c = 0; c < COLS; c++) {
        const sy = Math.floor(scanY);
        if (sy >= 0 && sy < ROWS) {
          const d = Math.abs(c - COLS / 2) / (COLS / 2);
          const bri = Math.floor(60 - d * 30);
          ctx.fillStyle = `hsl(180, 60%, ${bri}%)`;
          ctx.fillText('█', ox + c * CW + CW / 2, oy + sy * CH);
        }
      }

      // L8: Concentric pulse rings from center
      for (let ring = 0; ring < 3; ring++) {
        const radius = ((t * 0.6 + ring * 0.33) % 1) * 40;
        for (let a = 0; a < 360; a += 15) {
          const rad = (a * Math.PI) / 180;
          const cr = Math.round(COLS / 2 + Math.cos(rad) * radius);
          const rr = Math.round(ROWS / 2 + Math.sin(rad) * radius * 0.5);
          if (cr >= 0 && cr < COLS && rr >= 0 && rr < ROWS) {
            const fade = 1 - radius / 40;
            ctx.fillStyle = `hsl(170, 45%, ${Math.floor(30 + fade * 50)}%)`;
            ctx.fillText('·', ox + cr * CW + CW / 2, oy + rr * CH);
          }
        }
      }

      // L9: Vignette (much lighter vignette)
      const grad = ctx.createRadialGradient(w / 2, h * 0.35, h * 0.3, w / 2, h * 0.35, h * 0.9);
      grad.addColorStop(0, 'rgba(5,5,8,0)');
      grad.addColorStop(0.6, 'rgba(5,5,8,0.1)');
      grad.addColorStop(1, 'rgba(5,5,8,0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      aid = requestAnimationFrame(draw);
    }

    function resize() {
      if (!cv) return;
      const p = cv.parentElement!;
      cv.width = p.clientWidth;
      cv.height = p.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    aid = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(aid); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0" />;
}