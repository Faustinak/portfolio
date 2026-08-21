import React, { useEffect, useRef } from "react";

/**
 * CursorTrail
 * A small, playful, hand-drawn "constellation" that follows the cursor —
 * tiny wobbly circles, dots, and imperfect 4/5-point sparkles that drift,
 * shrink, and fade behind the pointer.
 *
 * Drop this in once near the root of the app, alongside (or in place of)
 * CursorDot:
 *   <CursorTrail />
 *
 * - Disabled automatically on touch devices.
 * - Respects prefers-reduced-motion (renders nothing if set).
 * - Pure canvas + rAF, no external deps, pointer-events: none throughout.
 */

// Weighted palette: blues/teals dominate, yellow + pink are rare accents.
const PALETTE = [
  { color: "#8FD3E8", weight: 5 }, // powder blue
  { color: "#7CCFC4", weight: 5 }, // soft teal
  { color: "#F6D76B", weight: 1 }, // pale yellow
  { color: "#F2B84B", weight: 1 }, // warm gold
  { color: "#E99BB5", weight: 1 }, // soft pink
  { color: "#D85A9B", weight: 1 }, // magenta pink
];
const PALETTE_TOTAL_WEIGHT = PALETTE.reduce((s, p) => s + p.weight, 0);

function pickColor() {
  let r = Math.random() * PALETTE_TOTAL_WEIGHT;
  for (const p of PALETTE) {
    if (r < p.weight) return p.color;
    r -= p.weight;
  }
  return PALETTE[0].color;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

// Draws a slightly imperfect N-point star/sparkle: each spike's length and
// angle is jittered a touch so it never looks like a perfect vector shape.
function drawSparkle(ctx, x, y, radius, points, rotation, wobbleSeed) {
  const innerRatio = points === 4 ? 0.28 : 0.42;
  ctx.beginPath();
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const isOuter = i % 2 === 0;
    const baseAngle = (Math.PI * 2 * i) / total + rotation;
    // Per-point jitter, stable per-particle via wobbleSeed so it doesn't
    // flicker frame to frame.
    const jitter = 1 + (Math.sin(wobbleSeed + i * 2.1) * 0.12);
    const r = (isOuter ? radius : radius * innerRatio) * jitter;
    const angle = baseAngle + Math.sin(wobbleSeed + i) * 0.06;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// A small hand-drawn "blob" circle: a wobbly ring of points rather than a
// perfect arc, so dots feel sketched rather than vector-perfect.
function drawBlob(ctx, x, y, radius, wobbleSeed) {
  const segs = 10;
  ctx.beginPath();
  for (let i = 0; i <= segs; i++) {
    const angle = (Math.PI * 2 * i) / segs;
    const jitter = 1 + Math.sin(wobbleSeed + i * 1.7) * 0.15;
    const r = radius * jitter;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

const MAX_PARTICLES = 70;
const SPAWN_MIN_DIST = 10; // px moved before a new particle can spawn
const FOLLOW_EASE = 0.22; // how snappily the emitter chases the real cursor

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let emitX = -9999;
    let emitY = -9999;
    let hasPointer = false;
    let lastSpawnX = -9999;
    let lastSpawnY = -9999;
    let rafId;

    function spawnParticle(x, y) {
      if (particles.length >= MAX_PARTICLES) return;
      const roll = Math.random();
      const type = roll < 0.45 ? "dot" : roll < 0.75 ? "star5" : "star4";
      const baseSize =
        type === "dot" ? rand(1.6, 4.2) : rand(3.5, 7.5);
      particles.push({
        x: x + rand(-4, 4),
        y: y + rand(-4, 4),
        type,
        size: baseSize,
        color: pickColor(),
        rotation: rand(0, Math.PI * 2),
        wobbleSeed: rand(0, 1000),
        life: 0,
        maxLife: rand(650, 1100), // ms
        driftX: rand(-6, 6),
        driftY: rand(-6, 6),
        baseOpacity: rand(0.55, 0.9),
      });
    }

    function onPointerMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasPointer = true;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let lastTime = performance.now();

    function tick(now) {
      const dt = Math.min(now - lastTime, 48);
      lastTime = now;

      if (hasPointer) {
        emitX += (mouseX - emitX) * FOLLOW_EASE;
        emitY += (mouseY - emitY) * FOLLOW_EASE;

        const dx = emitX - lastSpawnX;
        const dy = emitY - lastSpawnY;
        if (Math.hypot(dx, dy) > SPAWN_MIN_DIST) {
          spawnParticle(emitX, emitY);
          lastSpawnX = emitX;
          lastSpawnY = emitY;
        }
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life / p.maxLife;
        const eased = 1 - Math.pow(1 - t, 2); // ease-out fade curve
        const alpha = p.baseOpacity * (1 - eased);
        const scale = 1 - t * 0.5;
        const x = p.x + p.driftX * t;
        const y = p.y + p.driftY * t;

        ctx.globalAlpha = Math.max(alpha, 0);
        ctx.fillStyle = p.color;

        if (p.type === "dot") {
          drawBlob(ctx, x, y, p.size * scale, p.wobbleSeed);
        } else if (p.type === "star5") {
          drawSparkle(
            ctx,
            x,
            y,
            p.size * scale,
            5,
            p.rotation + t * 0.6,
            p.wobbleSeed
          );
        } else {
          drawSparkle(
            ctx,
            x,
            y,
            p.size * scale,
            4,
            p.rotation + t * 0.6,
            p.wobbleSeed
          );
        }
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
