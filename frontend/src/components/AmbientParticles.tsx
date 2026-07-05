'use client';

import React from 'react';

/**
 * AmbientParticles — Floating bokeh-style circles rendered as a fixed
 * background layer for atmospheric depth. Pure CSS animation, no JS overhead.
 */

const particles = [
  { cx: '8%',  cy: '15%', size: 14, opacity: 0.12, dur: '18s', delay: '0s' },
  { cx: '22%', cy: '60%', size: 8,  opacity: 0.18, dur: '22s', delay: '3s' },
  { cx: '35%', cy: '25%', size: 18, opacity: 0.1,  dur: '25s', delay: '1s' },
  { cx: '50%', cy: '80%', size: 10, opacity: 0.15, dur: '20s', delay: '5s' },
  { cx: '65%', cy: '12%', size: 12, opacity: 0.14, dur: '19s', delay: '2s' },
  { cx: '78%', cy: '45%', size: 6,  opacity: 0.2,  dur: '24s', delay: '4s' },
  { cx: '88%', cy: '70%', size: 16, opacity: 0.08, dur: '21s', delay: '6s' },
  { cx: '15%', cy: '85%', size: 5,  opacity: 0.22, dur: '17s', delay: '7s' },
  { cx: '42%', cy: '50%', size: 20, opacity: 0.06, dur: '28s', delay: '0s' },
  { cx: '72%', cy: '30%', size: 9,  opacity: 0.16, dur: '23s', delay: '8s' },
  { cx: '92%', cy: '90%', size: 7,  opacity: 0.19, dur: '16s', delay: '1.5s' },
  { cx: '5%',  cy: '42%', size: 11, opacity: 0.13, dur: '26s', delay: '3.5s' },
];

export default function AmbientParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: -5 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.cx,
            top: p.cy,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: i % 3 === 0
              ? 'var(--primary)'
              : i % 3 === 1
                ? 'var(--secondary)'
                : 'var(--accent)',
            animation: `particle-drift ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
