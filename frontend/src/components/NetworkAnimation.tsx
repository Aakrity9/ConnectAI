'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

/**
 * NetworkAnimation — 6 diverse person-node illustrations that slide together
 * on scroll, connected by glowing animated lines and a central hub.
 *
 * Props:
 *  - scrollYProgress: a framer-motion MotionValue (0→1) tied to page scroll.
 */

interface PersonNode {
  id: string;
  initials: string;
  color: string;   // ring / accent color
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const people: PersonNode[] = [
  { id: 'p1', initials: 'AS', color: '#6D5CFF', startX: -60,  startY: 80,   endX: 340, endY: 260 },
  { id: 'p2', initials: 'PP', color: '#FF8FA3', startX: 60,   startY: 720,  endX: 400, endY: 370 },
  { id: 'p3', initials: 'RV', color: '#FFD166', startX: 860,  startY: 60,   endX: 520, endY: 240 },
  { id: 'p4', initials: 'NI', color: '#6D5CFF', startX: 840,  startY: 660,  endX: 500, endY: 360 },
  { id: 'p5', initials: 'KM', color: '#FF8FA3', startX: 420,  startY: -60,  endX: 420, endY: 190 },
  { id: 'p6', initials: 'SG', color: '#FFD166', startX: -40,  startY: 400,  endX: 340, endY: 340 },
];

// Connection pairs (indices into people array)
const connections: [number, number, string][] = [
  [0, 1, '#6D5CFF'],
  [1, 2, '#FF8FA3'],
  [2, 3, '#FFD166'],
  [3, 4, '#6D5CFF'],
  [4, 5, '#FF8FA3'],
  [5, 0, '#FFD166'],
  // Cross connections for density
  [0, 3, '#6D5CFF'],
  [1, 4, '#FF8FA3'],
  [2, 5, '#FFD166'],
];

function PersonSVG({
  xVal,
  yVal,
  node,
  pulseScale,
}: {
  xVal: MotionValue<number>;
  yVal: MotionValue<number>;
  node: PersonNode;
  pulseScale: MotionValue<number>;
}) {
  return (
    <motion.g style={{ x: xVal, y: yVal, scale: pulseScale }}>
      {/* Outer glow ring */}
      <circle cx="0" cy="0" r="26" fill={node.color} fillOpacity="0.15" />
      {/* Colored ring */}
      <circle cx="0" cy="0" r="22" fill={node.color} />
      {/* White inner circle */}
      <circle cx="0" cy="0" r="18" fill="#ffffff" />
      {/* Head silhouette */}
      <circle cx="0" cy="-3" r="6" fill={node.color} fillOpacity="0.2" />
      {/* Torso silhouette */}
      <path
        d="M-7 8 Q0 1 7 8"
        fill={node.color}
        fillOpacity="0.15"
        stroke="none"
      />
      {/* Initials */}
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fill={node.color}
        fontSize="9"
        fontWeight="700"
        fontFamily="var(--font-poppins), sans-serif"
      >
        {node.initials}
      </text>
    </motion.g>
  );
}

export default function NetworkAnimation({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // Build motion values for each person
  const positions = people.map((p) => ({
    x: useTransform(scrollYProgress, [0, 0.42], [p.startX, p.endX]),
    y: useTransform(scrollYProgress, [0, 0.42], [p.startY, p.endY]),
  }));

  // Connection lines fade in
  const lineOpacity = useTransform(scrollYProgress, [0.18, 0.42], [0, 0.8]);
  // Pulse when cluster forms
  const pulseScale = useTransform(scrollYProgress, [0.42, 0.55], [1, 1.06]);
  // Hub opacity
  const hubOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for connection lines */}
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Hub gradient */}
        <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6D5CFF" stopOpacity="0.15" />
          <stop offset="80%" stopColor="#6D5CFF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#6D5CFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glowing connection lines */}
      {connections.map(([a, b, color], i) => (
        <motion.line
          key={`conn-${i}`}
          x1={positions[a].x}
          y1={positions[a].y}
          x2={positions[b].x}
          y2={positions[b].y}
          stroke={color}
          strokeWidth={i < 6 ? 2.5 : 1.2}
          strokeDasharray={i < 6 ? '6 5' : '3 4'}
          opacity={lineOpacity}
          filter="url(#lineGlow)"
          className="animate-glow-pulse"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}

      {/* Central hub */}
      <motion.g opacity={hubOpacity}>
        <circle cx="420" cy="290" r="55" fill="url(#hubGrad)" />
        <circle
          cx="420"
          cy="290"
          r="40"
          fill="none"
          stroke="#6D5CFF"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          strokeOpacity="0.25"
          className="animate-spin-slow"
        />
        <circle
          cx="420"
          cy="290"
          r="28"
          fill="none"
          stroke="#FF8FA3"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeOpacity="0.2"
          className="animate-spin-slow"
          style={{ animationDirection: 'reverse' }}
        />
        <text
          x="420"
          y="287"
          textAnchor="middle"
          fill="#6D5CFF"
          fillOpacity="0.4"
          fontSize="8"
          fontWeight="700"
          fontFamily="var(--font-poppins), sans-serif"
        >
          MATCH
        </text>
        <text
          x="420"
          y="298"
          textAnchor="middle"
          fill="#6D5CFF"
          fillOpacity="0.3"
          fontSize="7"
          fontFamily="var(--font-poppins), sans-serif"
        >
          CLUSTER
        </text>
      </motion.g>

      {/* Person nodes (rendered last = on top) */}
      {people.map((node, i) => (
        <PersonSVG
          key={node.id}
          xVal={positions[i].x}
          yVal={positions[i].y}
          node={node}
          pulseScale={pulseScale}
        />
      ))}
    </svg>
  );
}
