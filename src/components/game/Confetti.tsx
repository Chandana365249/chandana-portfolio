"use client";

import { useEffect, useRef } from "react";
import { CONFETTI_EVENT } from "@/lib/quest";

const COLORS = ["#38bdf8", "#a78bfa", "#f472b6", "#f5f7fa", "#7dd3fc"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
}

/** Full-screen canvas that bursts confetti whenever `celebrate()` is called. */
export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pieces: Piece[] = [];
    let frame = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces = pieces.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
      for (const p of pieces) {
        p.vy += 0.18;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(1, p.life / 40);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      frame = pieces.length ? requestAnimationFrame(tick) : 0;
    };

    const burst = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const originX of [w * 0.2, w * 0.5, w * 0.8]) {
        for (let i = 0; i < 60; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
          const speed = 6 + Math.random() * 9;
          pieces.push({
            x: originX,
            y: h * 0.75,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 4,
            size: 6 + Math.random() * 6,
            rotation: Math.random() * Math.PI,
            spin: (Math.random() - 0.5) * 0.3,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 140 + Math.random() * 60,
          });
        }
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener(CONFETTI_EVENT, burst);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener(CONFETTI_EVENT, burst);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] size-full"
    />
  );
}
