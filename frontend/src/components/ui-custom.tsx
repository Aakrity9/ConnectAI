'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// GlassCard — Glassmorphism container with shimmer hover effect
// ─────────────────────────────────────────────
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animateGlow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, animateGlow = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        className={cn(
          "glass glass-shimmer rounded-3xl p-6 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/8",
          animateGlow && "relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-gradient-start before:to-gradient-end before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-10",
          className
        )}
        {...(props as HTMLMotionProps<'div'>)}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

// ─────────────────────────────────────────────
// PremiumButton — Pill button with gradient sweep + micro-interaction
// ─────────────────────────────────────────────
export interface PremiumButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  children: React.ReactNode;
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
      secondary: "bg-white/80 text-primary border border-primary/20 hover:bg-white hover:border-primary/40 shadow-sm",
      accent: "bg-accent text-foreground hover:bg-opacity-90 shadow-md shadow-accent/20",
      glass: "glass text-foreground hover:bg-white/30",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "px-6 py-3 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
PremiumButton.displayName = 'PremiumButton';

// ─────────────────────────────────────────────
// Badge — Clean label chip
// ─────────────────────────────────────────────
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'gradient';
  children: React.ReactNode;
}

export const Badge = ({ className, variant = 'default', children, ...props }: BadgeProps) => {
  const variants = {
    default: "bg-primary/10 text-primary",
    outline: "border border-primary/25 text-primary",
    gradient: "bg-gradient-to-r from-gradient-start/20 to-gradient-end/20 text-foreground font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// ─────────────────────────────────────────────
// MatchCluster — Interactive SVG widget showing 4–6 connected people nodes
// ─────────────────────────────────────────────
interface ClusterNode {
  initials: string;
  color: string;
  x: number;
  y: number;
}

const clusterNodes: ClusterNode[] = [
  { initials: 'AS', color: '#6D5CFF', x: 150, y: 80 },
  { initials: 'PP', color: '#FF8FA3', x: 280, y: 110 },
  { initials: 'RV', color: '#FFD166', x: 100, y: 200 },
  { initials: 'NI', color: '#6D5CFF', x: 300, y: 220 },
  { initials: 'KM', color: '#FF8FA3', x: 200, y: 280 },
  { initials: 'SG', color: '#FFD166', x: 210, y: 150 },
];

const clusterEdges: [number, number][] = [
  [0, 1], [0, 2], [0, 5],
  [1, 3], [1, 5],
  [2, 4], [2, 5],
  [3, 4], [3, 5],
  [4, 5],
];

export function MatchCluster({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn("glass glass-shimmer rounded-3xl p-4 w-full max-w-md mx-auto", className)}
    >
      <svg
        viewBox="0 0 400 350"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="clusterGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {clusterEdges.map(([a, b], i) => (
          <line
            key={`ce-${i}`}
            x1={clusterNodes[a].x}
            y1={clusterNodes[a].y}
            x2={clusterNodes[b].x}
            y2={clusterNodes[b].y}
            stroke={clusterNodes[a].color}
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeOpacity="0.35"
            filter="url(#clusterGlow)"
            className="animate-dash"
          />
        ))}

        {/* Central hub */}
        <circle cx="200" cy="175" r="30" fill="#6D5CFF" fillOpacity="0.05" />
        <circle
          cx="200"
          cy="175"
          r="25"
          fill="none"
          stroke="#6D5CFF"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeOpacity="0.2"
          className="animate-spin-slow"
        />

        {/* Nodes */}
        {clusterNodes.map((node, i) => (
          <g key={`cn-${i}`}>
            <circle cx={node.x} cy={node.y} r="22" fill={node.color} fillOpacity="0.12" className="animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
            <circle cx={node.x} cy={node.y} r="18" fill={node.color} />
            <circle cx={node.x} cy={node.y} r="15" fill="#ffffff" />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fill={node.color}
              fontSize="9"
              fontWeight="700"
              fontFamily="var(--font-poppins), sans-serif"
            >
              {node.initials}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
