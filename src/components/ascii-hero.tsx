'use client';

import { useEffect, useRef } from 'react';

const HEX = '0123456789ABCDEF';
const BLK = [' ', '░', '▒', '▓', '█'];

// Simulated mempool state
interface Tx {
  x: number; y: number; w: number; h: number;
  fee: number; age: number; hash: string;
}

export function AsciiHero() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let aid: number, start = performance.now();
    const COLS = 80, ROWS = 24, CW = 12, CH = 18;

    // Persistent mempool state
    let txs: Tx[] = [];
    let blockCount = 0;
    let mempoolSize = 0;

    // Pre-generate block header data labels
    const labels = [
      'Height', 'Difficulty', 'Fee Range', 'Mempool', 'Tx Count',
      'Hashrate', 'Block Time', 'Size',
    ];

    function randHash(len = 6): string {
      let s = '';
      for (let i = 0; i < len; i++) s += HEX[Math.floor(Math.random() * 16)];
      return s;
    }

    function updateMempool(t: number) {
      // Add new transactions periodically
      const inflow = Math.floor(1 + Math.sin(t * 0.3) * 1.5 + 1.5);
      for (let i = 0; i < inflow; i++) {
        const maxW = 2 + Math.floor(Math.random() * 5);
        const maxH = 1 + Math.floor(Math.random() * 2);
        const fee = Math.random();
        // Find a free position (simple placement)
        let placed = false;
        for (let attempt = 0; attempt < 30 && !placed; attempt++) {
          const x = 8 + Math.floor(Math.random() * (COLS - 20));
          const y = 2 + Math.floor(Math.random() * (ROWS - 8));
          if (!txs.some(t =>
            x < t.x + t.w && x + maxW > t.x &&
            y < t.y + t.h && y + maxH > t.y
          )) {
            txs.push({ x, y, w: maxW, h: maxH, fee, age: 0, hash: randHash() });
            placed = true;
            mempoolSize++;
          }
        }
      }

      // Age and confirm transactions
      for (let i = txs.length - 1; i >= 0; i--) {
        txs[i].age += 0.01;
        if (txs[i].age > 1.0 + txs[i].fee * 0.8) {
          // Transaction confirmed — remove
          txs.splice(i, 1);
          mempoolSize = Math.max(0, mempoolSize - 1);
          blockCount++;
        }
      }

      // Cap tx count
      if (txs.length > 80) txs.splice(80);
    }

    function draw(now: number) {
      if (!cv || !ctx) return;
      const t = (now - start) / 1000;
      const w = cv.width, h = cv.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0d0d12';
      ctx.fillRect(0, 0, w, h);

      const grW = COLS * CW, grH = ROWS * CH;
      const ox = Math.floor((w - grW) / 2), oy = Math.floor((h - grH) / 2);
      ctx.font = '11px monospace';
      ctx.textBaseline = 'top'; ctx.textAlign = 'center';

      // Update mempool state
      updateMempool(t);

      // === BACKGROUND: Subtle grid ===
      ctx.fillStyle = 'rgba(247,147,26,0.04)';
      for (let r = 1; r < ROWS; r++) {
        ctx.fillText('·', ox + 0 * CW + CW / 2, oy + r * CH);
        ctx.fillText('·', ox + (COLS - 1) * CW + CW / 2, oy + r * CH);
      }
      for (let c = 0; c < COLS; c++) {
        ctx.fillText('·', ox + c * CW + CW / 2, oy + 1 * CH);
        ctx.fillText('·', ox + c * CW + CW / 2, oy + (ROWS - 1) * CH);
      }

      // === LEFT PANEL: Block stats ===
      const stats = [
        `#${String(blockCount + 840000).slice(0, 7)}`,
        `▰▰▰▰▰▰▰▰`,
        `1-${Math.floor(10 + Math.sin(t) * 5)}sat`,
        `${txs.length} txs`,
        `${(blockCount % 3000) + 1500}`,
        `410 EH/s`,
        `${(Math.sin(t * 0.1) * 5 + 10).toFixed(1)}m`,
        `1.2MB`,
      ];
      ctx.textAlign = 'left';
      for (let i = 0; i < stats.length; i++) {
        const r = 2 + i;
        const label = labels[i];
        const val = stats[i];
        ctx.fillStyle = `hsl(35, 50%, 40%)`;
        ctx.fillText(label, ox + 1 * CW, oy + r * CH);
        ctx.fillStyle = `hsl(35, 70%, ${55 + Math.sin(t * 0.5 + i) * 10}%)`;
        ctx.fillText(val, ox + 1 * CW, oy + r * CH);
      }
      ctx.textAlign = 'center';

      // === RIGHT PANEL: Recent block hashes ===
      ctx.textAlign = 'right';
      for (let i = 0; i < 6; i++) {
        const r = 2 + i;
        const hashStr = randHash(14);
        const bri = 40 - i * 4;
        ctx.fillStyle = `hsl(35, 40%, ${bri}%)`;
        ctx.fillText(hashStr, ox + (COLS - 2) * CW + CW / 2, oy + r * CH);
      }
      ctx.textAlign = 'center';

      // === MAIN AREA: Mempool visualization grid ===
      // Draw background cells for the mempool area
      const gridLeft = 8, gridTop = 2, gridRight = COLS - 6, gridBot = ROWS - 2;

      // Transaction grid
      for (const tx of txs) {
        const confirmed = tx.age > 0.8;
        const feeBucket = Math.floor(tx.fee * 5);
        const bright = Math.floor(35 + tx.fee * 50 + (confirmed ? 0 : Math.sin(t * 3 + tx.x) * 8));
        const satStr = `${Math.floor(tx.fee * 400 + 1)}`;
        let ch = BLK[Math.min(4, feeBucket + 1)];
        let color: string;

        if (confirmed) {
          // Confirmed tx — dimming out
          const fade = (1 - (tx.age - 0.8) / 0.3);
          color = `hsla(180, 20%, ${bright * 0.5}%, ${fade * 0.5})`;
        } else {
          // Unconfirmed — orange glow
          color = `hsla(${30 - feeBucket * 5}, ${60 + feeBucket * 5}%, ${bright}%, 0.7)`;
        }

        for (let dy = 0; dy < Math.min(tx.h, 2); dy++) {
          for (let dx = 0; dx < tx.w; dx++) {
            const dc = tx.x + dx, dr = tx.y + dy;
            if (dc < gridLeft || dc >= gridRight || dr < gridTop || dr >= gridBot) continue;
            if (dx === 0 && dy === 0) {
              // Show fee rate in first cell
              ctx.fillStyle = `hsl(35, 80%, ${bright + 20}%)`;
              ctx.fillText(satStr[0] || ch, ox + dc * CW + CW / 2, oy + dr * CH);
            } else {
              ctx.fillStyle = color;
              ctx.fillText(ch, ox + dc * CW + CW / 2, oy + dr * CH);
            }
          }
        }
      }

      // === BOTTOM INFO BAR: Mempool summary ===
      const barY = ROWS - 1;
      ctx.textAlign = 'left';
      ctx.fillStyle = `hsl(35, 50%, 45%)`;
      const avgFee = txs.length > 0
        ? Math.floor(txs.reduce((s, t) => s + t.fee, 0) / txs.length * 400 + 1)
        : 0;
      const mempoolInfo = `mempool ${txs.length}txs | ${avgFee}sat/vB | ${Math.floor(mempoolSize * 0.25)}vMB`;
      ctx.fillText(mempoolInfo, ox + 1 * CW, oy + barY * CH);

      // Right side: block counter
      ctx.textAlign = 'right';
      ctx.fillStyle = `hsl(35, 80%, 60%)`;
      const blockTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
      ctx.fillText(`block ${blockCount + 840000} | ${blockTime}`, ox + (COLS - 1) * CW + CW / 2, oy + barY * CH);
      ctx.textAlign = 'center';

      // === SCANLINE: Horizontal sweep ===
      const scanY = ((t * 0.6) % (ROWS - 4)) + 2;
      for (let c = gridLeft; c < gridRight; c++) {
        const sy = Math.floor(scanY);
        const fade = 1 - Math.abs(c - COLS / 2) / (COLS / 2);
        ctx.fillStyle = `hsla(35, 80%, 60%, ${fade * 0.15})`;
        ctx.fillText('▔', ox + c * CW + CW / 2, oy + sy * CH);
      }

      // === VIGNETTE ===
      const grad = ctx.createRadialGradient(w / 2, h * 0.4, h * 0.2, w / 2, h * 0.4, h * 0.9);
      grad.addColorStop(0, 'rgba(13,13,18,0)');
      grad.addColorStop(0.5, 'rgba(13,13,18,0.15)');
      grad.addColorStop(1, 'rgba(13,13,18,0.6)');
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