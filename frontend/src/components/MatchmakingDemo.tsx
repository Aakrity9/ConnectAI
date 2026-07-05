'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, UserCheck, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Attendee profile data
interface Attendee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  bgGrad: string;
  skills: string[];
}

const mainAttendees: Attendee[] = [
  {
    id: 'a1',
    name: 'Alex Chen',
    role: 'AI Engineer',
    avatar: '💻',
    color: '#8B7EFF',
    bgGrad: 'from-[#8B7EFF]/20 to-purple-400/10',
    skills: ['PyTorch', 'LLMs', 'Next.js'],
  },
  {
    id: 'a2',
    name: 'Sarah Kim',
    role: 'Product Designer',
    avatar: '🎨',
    color: '#FF9E8C',
    bgGrad: 'from-[#FF9E8C]/20 to-rose-400/10',
    skills: ['Framer', 'Figma', 'UI/UX'],
  },
];

const clusterAttendees: Attendee[] = [
  {
    id: 'a3',
    name: 'Ryan Dev',
    role: 'Growth Marketer',
    avatar: '📈',
    color: '#FFD166',
    bgGrad: 'from-[#FFD166]/20 to-yellow-400/10',
    skills: ['SEO', 'Analytics', 'SaaS'],
  },
  {
    id: 'a4',
    name: 'Emily Watson',
    role: 'FinTech Lead',
    avatar: '💳',
    color: '#C5B4FA',
    bgGrad: 'from-[#C5B4FA]/20 to-indigo-400/10',
    skills: ['Blockchain', 'DeFi', 'Strategy'],
  },
  {
    id: 'a5',
    name: 'Kai Takahashi',
    role: 'Fullstack Dev',
    avatar: '⚙️',
    color: '#FFB7A7',
    bgGrad: 'from-[#FFB7A7]/20 to-orange-400/10',
    skills: ['Golang', 'Docker', 'React'],
  },
  {
    id: 'a6',
    name: 'Chloe Davis',
    role: 'Product Manager',
    avatar: '🚀',
    color: '#A98DFF',
    bgGrad: 'from-[#A98DFF]/20 to-purple-400/10',
    skills: ['Agile', 'Roadmaps', 'SQL'],
  },
];

type AnimationStage = 'split' | 'connect' | 'cluster' | 'team';

export default function MatchmakingDemo() {
  const [stage, setStage] = useState<AnimationStage>('split');

  useEffect(() => {
    // Loop through the cinematic sequence
    const interval = setInterval(() => {
      setStage((prev) => {
        if (prev === 'split') return 'connect';
        if (prev === 'connect') return 'cluster';
        if (prev === 'cluster') return 'team';
        return 'split';
      });
    }, 5500); // 5.5 seconds per stage for elegant, slow animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4">
      {/* Simulation Stage Controller UI */}
      <div className="flex gap-2.5 mb-8 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm text-xs font-medium">
        {(['split', 'connect', 'cluster', 'team'] as AnimationStage[]).map((s) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={cn(
              "px-4 py-1.5 rounded-full capitalize transition-all duration-300",
              stage === s
                ? "bg-primary text-white shadow-sm"
                : "text-foreground/60 hover:text-foreground hover:bg-white/20"
            )}
          >
            {s === 'split' && '1. Scanning'}
            {s === 'connect' && '2. AI Matching'}
            {s === 'cluster' && '3. Expanding Network'}
            {s === 'team' && '4. Team Formed'}
          </button>
        ))}
      </div>

      {/* Main Sandbox Canvas */}
      <div className="relative w-full h-[480px] glass rounded-3xl border border-white/50 shadow-lg overflow-hidden flex items-center justify-center bg-gradient-to-tr from-white/10 via-[#FAF6EE]/30 to-[#FFEBE7]/15">
        
        {/* Glow rings in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <motion.div 
            animate={{ scale: [1, 1.15, 1], rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-96 h-96 rounded-full border border-dashed border-primary/20"
          />
          <motion.div 
            animate={{ scale: [1, 0.9, 1], rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[500px] h-[500px] rounded-full border border-dashed border-secondary/15"
          />
        </div>

        {/* ================= STAGE 1 & 2: TWO MAIN USERS CONNECTING ================= */}
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Connection Line with Dash Flow */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <AnimatePresence>
              {(stage === 'connect' || stage === 'cluster' || stage === 'team') && (
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  d="M 220 240 Q 400 240 580 240"
                  stroke="url(#demoLineGrad)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  className="animate-dash"
                  fill="none"
                />
              )}
            </AnimatePresence>
            <defs>
              <linearGradient id="demoLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B7EFF" />
                <stop offset="100%" stopColor="#FF9E8C" />
              </linearGradient>
            </defs>
          </svg>

          {/* AI Matching Orb */}
          <AnimatePresence>
            {(stage === 'connect' || stage === 'cluster' || stage === 'team') && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
                className="absolute left-[calc(50%-44px)] top-[calc(50%-44px)] w-22 h-22 rounded-full bg-white/70 backdrop-blur-xl flex flex-col items-center justify-center border border-white/50 shadow-lg z-20"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-1 rounded-full border border-dashed border-primary/40"
                />
                
                {/* Glowing Core */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 text-white relative">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                
                {/* Match Bubble */}
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                >
                  87% Match
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Card 1: Alex Chen */}
          <motion.div
            layout
            animate={{
              x: stage === 'split' ? -180 : stage === 'connect' ? -200 : -220,
              y: stage === 'split' ? 0 : stage === 'connect' ? 0 : 0,
              scale: stage === 'team' ? 0.9 : 1,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className={cn(
              "absolute z-10 w-64 glass p-5 rounded-3xl border border-white/60 shadow-md",
              "hover:shadow-lg transition-shadow duration-300"
            )}
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-purple-400/10 flex items-center justify-center text-2xl shadow-inner">
                💻
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Alex Chen</h4>
                <p className="text-[11px] font-semibold text-primary/80 uppercase tracking-wide">AI Engineer</p>
              </div>
            </div>
            
            <p className="text-xs text-foreground/75 mb-4 leading-relaxed">
              &ldquo;Building open-source AI agents. Looking for a designer to team up for the Hackathon.&rdquo;
            </p>

            <div className="flex flex-wrap gap-1.5">
              {mainAttendees[0].skills.map((s) => (
                <span key={s} className="bg-primary/5 text-primary text-[10px] px-2.5 py-1 rounded-full border border-primary/10">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* User Card 2: Sarah Kim */}
          <motion.div
            layout
            animate={{
              x: stage === 'split' ? 180 : stage === 'connect' ? 200 : 220,
              y: stage === 'split' ? 0 : stage === 'connect' ? 0 : 0,
              scale: stage === 'team' ? 0.9 : 1,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className={cn(
              "absolute z-10 w-64 glass p-5 rounded-3xl border border-white/60 shadow-md",
              "hover:shadow-lg transition-shadow duration-300"
            )}
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF9E8C]/20 to-rose-400/10 flex items-center justify-center text-2xl shadow-inner">
                🎨
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Sarah Kim</h4>
                <p className="text-[11px] font-semibold text-secondary/90 uppercase tracking-wide">Product Designer</p>
              </div>
            </div>
            
            <p className="text-xs text-foreground/75 mb-4 leading-relaxed">
              &ldquo;SaaS designer specializing in Figma prototypes. Wanting to join a technical co-founder.&rdquo;
            </p>

            <div className="flex flex-wrap gap-1.5">
              {mainAttendees[1].skills.map((s) => (
                <span key={s} className="bg-secondary/5 text-secondary text-[10px] px-2.5 py-1 rounded-full border border-secondary/15">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ================= STAGE 3 & 4: SPARKING THE CLUSTER ================= */}
          <AnimatePresence>
            {(stage === 'cluster' || stage === 'team') && (
              <>
                {/* Connect lines between cluster nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    {/* Radial lines from hub */}
                    <line x1="400" y1="240" x2="400" y2="70" stroke="#FFD166" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="400" y1="240" x2="680" y2="100" stroke="#C5B4FA" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="400" y1="240" x2="120" y2="380" stroke="#FFB7A7" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="400" y1="240" x2="400" y2="410" stroke="#A98DFF" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Ring connection */}
                    {stage === 'team' && (
                      <motion.circle
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5 }}
                        cx="400"
                        cy="240"
                        r="165"
                        stroke="url(#ringGrad)"
                        strokeWidth="3"
                        fill="none"
                        opacity="0.8"
                      />
                    )}
                  </motion.g>
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B7EFF" />
                      <stop offset="50%" stopColor="#FFAEC9" />
                      <stop offset="100%" stopColor="#FFD166" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Cluster Node 1: Ryan (Top) */}
                <motion.div
                  initial={{ scale: 0, y: -50, opacity: 0 }}
                  animate={{ scale: 1, x: 0, y: -170, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 90, delay: 0.1 }}
                  className="absolute z-10 w-44 glass p-3.5 rounded-2xl border border-white/50 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-base">📈</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">Ryan Dev</span>
                      <span className="text-[9px] text-[#E2B13C] uppercase font-bold">Growth</span>
                    </div>
                  </div>
                </motion.div>

                {/* Cluster Node 2: Emily (Right-Top) */}
                <motion.div
                  initial={{ scale: 0, x: 50, opacity: 0 }}
                  animate={{ scale: 1, x: 250, y: -120, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 90, delay: 0.2 }}
                  className="absolute z-10 w-44 glass p-3.5 rounded-2xl border border-white/50 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-base">💳</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">Emily Watson</span>
                      <span className="text-[9px] text-primary-light uppercase font-bold">FinTech</span>
                    </div>
                  </div>
                </motion.div>

                {/* Cluster Node 3: Kai (Left-Bottom) */}
                <motion.div
                  initial={{ scale: 0, x: -50, opacity: 0 }}
                  animate={{ scale: 1, x: -250, y: 120, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 90, delay: 0.3 }}
                  className="absolute z-10 w-44 glass p-3.5 rounded-2xl border border-white/50 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base">⚙️</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">Kai Takahashi</span>
                      <span className="text-[9px] text-secondary uppercase font-bold">Fullstack</span>
                    </div>
                  </div>
                </motion.div>

                {/* Cluster Node 4: Chloe (Bottom) */}
                <motion.div
                  initial={{ scale: 0, y: 50, opacity: 0 }}
                  animate={{ scale: 1, x: 0, y: 170, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 90, delay: 0.4 }}
                  className="absolute z-10 w-44 glass p-3.5 rounded-2xl border border-white/50 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-base">🚀</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">Chloe Davis</span>
                      <span className="text-[9px] text-primary uppercase font-bold">Product</span>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ================= STAGE 4: CELEBRATION TEAM MERGED GLOW ================= */}
          <AnimatePresence>
            {stage === 'team' && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-primary/25 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl max-w-xs animate-float pointer-events-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center text-white mb-3 shadow-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-foreground mb-1">Teammates Found!</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                    Alex, Sarah, and 4 others formed a hackathon project team. ConnectAI auto-created a shared Slack & Notion workspace.
                  </p>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5" /> 6-Person Cluster Formed
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Narrative Label */}
      <div className="mt-4 text-center min-h-[40px]">
        <p className="text-sm font-medium text-foreground/75 max-w-lg mx-auto">
          {stage === 'split' && "Step 1: ConnectAI's semantic mapping checks mutual tech event attendee profiles..."}
          {stage === 'connect' && "Step 2: ConnectAI identifies Sarah and Alex as prime matches, triggering context summaries."}
          {stage === 'cluster' && "Step 3: Finding co-founding partners creates a vector ripple effect, including complementary skills."}
          {stage === 'team' && "Step 4: ConnectAI locks the 6-person cluster, automatically launching collaboration channels."}
        </p>
      </div>
    </div>
  );
}
