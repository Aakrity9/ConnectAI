'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Radio, Activity, Compass, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HotTopic {
  name: string;
  count: number;
  color: string;
  size: string;
  top: string;
  left: string;
}

const mockTopics: HotTopic[] = [
  { name: '#GenerativeAI', count: 87, color: 'bg-primary/10 text-primary border-primary/20', size: 'text-xs', top: '15%', left: '10%' },
  { name: '#SaaS', count: 64, color: 'bg-secondary/10 text-secondary border-secondary/20', size: 'text-[11px]', top: '25%', left: '42%' },
  { name: '#HealthTech', count: 42, color: 'bg-accent/15 text-foreground/80 border-accent/25', size: 'text-[10px]', top: '18%', left: '70%' },
  { name: '#FigmaDesign', count: 59, color: 'bg-primary/10 text-primary border-primary/20', size: 'text-[11px]', top: '65%', left: '12%' },
  { name: '#Robotics', count: 28, color: 'bg-secondary/10 text-secondary border-secondary/20', size: 'text-[10px]', top: '72%', left: '55%' },
  { name: '#Solidity', count: 33, color: 'bg-accent/15 text-foreground/80 border-accent/25', size: 'text-[10px]', top: '58%', left: '78%' },
  { name: '#Nextjs16', count: 71, color: 'bg-primary/15 text-primary-light border-primary/20', size: 'text-xs', top: '40%', left: '25%' },
];

export default function OrganizerDashboard() {
  const [pulse, setPulse] = useState(true);

  // Trigger heart-rate-like pulses on stats
  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => !p);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto glass rounded-3xl border border-white/50 shadow-xl overflow-hidden p-6 flex flex-col gap-6 bg-gradient-to-br from-white/20 to-[#FAF6EE]/10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/25 gap-3">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
            Organizer Suite
          </span>
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Radio className="w-4 h-4 text-secondary animate-pulse" /> Live Event Pulse: Tech Summit 2026
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-white/60 border border-white/80 px-3.5 py-1.5 rounded-full shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-foreground">Syncing Real-time</span>
        </div>
      </div>

      {/* Stats Widgets Rows */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Match Connection Rate', value: '84.2%', change: '+12.4%', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-500/5' },
          { label: 'Active Match Clusters', value: '42 Teams', change: '8 Pending', icon: <Users className="w-4 h-4 text-primary" />, bg: 'bg-primary/5' },
          { label: 'Event Network Density', value: 'Optimal', change: '1.8x Avg', icon: <Activity className="w-4 h-4 text-secondary" />, bg: 'bg-secondary/5' },
          { label: 'Active Attendees', value: '248 / 300', change: '82.6%', icon: <Compass className="w-4 h-4 text-accent" />, bg: 'bg-accent/5' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/50 border border-white/60 p-4 rounded-2xl flex flex-col gap-1 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-foreground/50 leading-none">{stat.label}</span>
              <div className={cn("p-1.5 rounded-lg", stat.bg)}>
                {stat.icon}
              </div>
            </div>
            <span className="text-xl font-bold text-foreground mt-1.5">{stat.value}</span>
            <span className="text-[10px] text-foreground/60 flex items-center gap-1 mt-0.5">
              <span className="text-emerald-500 font-bold">{stat.change.startsWith('+') ? stat.change : ''}</span>
              {stat.change.startsWith('+') ? 'since opening' : stat.change}
            </span>
            {/* Soft decorative hover bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-secondary/15 to-accent/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </div>
        ))}
      </div>

      {/* Main Grid: Topology and Hot Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Network Topology Graph Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 border border-white/60 rounded-2xl p-4 flex flex-col gap-3 shadow-sm h-[320px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Interactive Connectivity Map</span>
            <span className="text-[9px] text-foreground/50">Hover nodes to view profile match rates</span>
          </div>

          <div className="flex-1 border border-white/40 rounded-xl relative overflow-hidden bg-white/20">
            <svg viewBox="0 0 450 250" className="w-full h-full">
              <defs>
                <filter id="topNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Edge Connections */}
              {[
                { x1: 80, y1: 50, x2: 170, y2: 100, opacity: 0.4 },
                { x1: 80, y1: 50, x2: 120, y2: 180, opacity: 0.3 },
                { x1: 170, y1: 100, x2: 120, y2: 180, opacity: 0.6 },
                { x1: 170, y1: 100, x2: 280, y2: 70, opacity: 0.5 },
                { x1: 280, y1: 70, x2: 370, y2: 120, opacity: 0.4 },
                { x1: 280, y1: 70, x2: 320, y2: 200, opacity: 0.35 },
                { x1: 370, y1: 120, x2: 320, y2: 200, opacity: 0.55 },
                { x1: 120, y1: 180, x2: 220, y2: 170, opacity: 0.45 },
                { x1: 220, y1: 170, x2: 320, y2: 200, opacity: 0.5 },
                { x1: 170, y1: 100, x2: 220, y2: 170, opacity: 0.65 },
              ].map((edge, idx) => (
                <line
                  key={idx}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="#8B7EFF"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity={edge.opacity}
                  className="animate-dash"
                  style={{ animationDuration: '2s' }}
                />
              ))}

              {/* Cluster central hubs */}
              <circle cx="170" cy="100" r="22" fill="#8B7EFF" fillOpacity="0.05" />
              <circle cx="320" cy="200" r="25" fill="#FF9E8C" fillOpacity="0.05" />

              {/* Nodes */}
              {[
                { cx: 80, cy: 50, color: '#8B7EFF', label: 'AI' },
                { cx: 170, cy: 100, color: '#8B7EFF', label: 'PM' },
                { cx: 120, cy: 180, color: '#C5B4FA', label: 'UX' },
                { cx: 280, cy: 70, color: '#FFD166', label: 'Dev' },
                { cx: 370, cy: 120, color: '#FF9E8C', label: 'VC' },
                { cx: 320, cy: 200, color: '#FF9E8C', label: 'Mkt' },
                { cx: 220, cy: 170, color: '#A98DFF', label: 'Founder' },
              ].map((node, idx) => (
                <g key={idx}>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="8"
                    fill={node.color}
                    fillOpacity="0.3"
                    className="animate-pulse"
                    style={{ animationDelay: `${idx * 0.3}s` }}
                  />
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="5"
                    fill={node.color}
                    filter="url(#topNodeGlow)"
                  />
                  <text
                    x={node.cx}
                    y={node.cy - 10}
                    textAnchor="middle"
                    fill="#1F1F2E"
                    fontSize="8"
                    fontWeight="700"
                    className="select-none"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Hot Topics / Interest Clouds (5 cols) */}
        <div className="lg:col-span-5 bg-white/40 border border-white/60 rounded-2xl p-4 flex flex-col gap-3 shadow-sm h-[320px] relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Trending Keywords</span>
            <span className="text-[10px] text-secondary font-bold">Updated Live</span>
          </div>

          <div className="flex-1 border border-white/40 rounded-xl relative overflow-hidden bg-white/20">
            {mockTopics.map((topic, idx) => (
              <motion.span
                key={idx}
                animate={{
                  y: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 4 + (idx % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.2,
                }}
                className={cn(
                  "absolute px-3 py-1.5 rounded-full border shadow-sm font-bold",
                  topic.color,
                  topic.size
                )}
                style={{
                  top: topic.top,
                  left: topic.left,
                }}
              >
                {topic.name}
              </motion.span>
            ))}
          </div>

          <div className="text-[10px] text-foreground/50 text-center leading-relaxed">
            ConnectAI automatically groups conversations into these trending event topics, helping speakers refine Q&A.
          </div>
        </div>

      </div>

    </div>
  );
}
