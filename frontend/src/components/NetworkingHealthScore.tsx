'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User, GraduationCap, Briefcase, BookOpen, Code2, Heart,
  Target, Users, Link2, GitBranch, Rocket, Zap, Camera,
  CheckCircle2, ArrowRight, TrendingUp, Lightbulb
} from 'lucide-react';
import { Badge } from '@/components/ui-custom';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ProfileData {
  name?: string;
  photo?: string;
  college?: string;
  company?: string;
  degree?: string;
  experience?: string;
  skills?: string[];
  interests?: string[];
  careerGoals?: string[];
  lookingFor?: string[];
  socialLinks?: { linkedin?: string; github?: string } | null;
  startupInterest?: boolean;
  hackathonInterest?: boolean;
  [key: string]: unknown;
}

interface ScoreCriterion {
  key: string;
  label: string;
  icon: React.ReactNode;
  maxPoints: number;
  earned: number;
  suggestion: string;
}

interface NetworkingHealthScoreProps {
  profile: ProfileData;
  variant?: 'full' | 'compact';
  className?: string;
}

// ─────────────────────────────────────────────
// Score Computation
// ─────────────────────────────────────────────
function computeScoreCriteria(profile: ProfileData): ScoreCriterion[] {
  const socialLinks = (profile.socialLinks && typeof profile.socialLinks === 'object')
    ? profile.socialLinks
    : {} as { linkedin?: string; github?: string };

  const criteria: ScoreCriterion[] = [
    {
      key: 'name',
      label: 'Full Name',
      icon: <User className="w-3.5 h-3.5" />,
      maxPoints: 8,
      earned: profile.name?.trim() ? 8 : 0,
      suggestion: 'Add your full name so attendees can find you.',
    },
    {
      key: 'photo',
      label: 'Profile Photo',
      icon: <Camera className="w-3.5 h-3.5" />,
      maxPoints: 5,
      earned: profile.photo?.trim() ? 5 : 0,
      suggestion: 'Upload a profile photo to appear more approachable.',
    },
    {
      key: 'college',
      label: 'College / Institution',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      maxPoints: 5,
      earned: profile.college?.trim() ? 5 : 0,
      suggestion: 'Add your college or institution for better alumni matches.',
    },
    {
      key: 'company',
      label: 'Company',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      maxPoints: 5,
      earned: profile.company?.trim() ? 5 : 0,
      suggestion: 'Add your current company to connect with industry peers.',
    },
    {
      key: 'degree',
      label: 'Degree / Major',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      maxPoints: 5,
      earned: profile.degree?.trim() ? 5 : 0,
      suggestion: 'Specify your degree for more relevant matches.',
    },
    {
      key: 'experience',
      label: 'Experience',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      maxPoints: 5,
      earned: profile.experience?.trim() ? 5 : 0,
      suggestion: 'Describe your experience so matches understand your background.',
    },
    {
      key: 'skills',
      label: 'Skills',
      icon: <Code2 className="w-3.5 h-3.5" />,
      maxPoints: 15,
      earned: Math.min((profile.skills?.length || 0) * 5, 15),
      suggestion: profile.skills?.length
        ? `Add ${3 - (profile.skills?.length || 0)} more skill(s) to max out this criterion.`
        : 'Add at least 3 skills to unlock full points.',
    },
    {
      key: 'interests',
      label: 'Interests',
      icon: <Heart className="w-3.5 h-3.5" />,
      maxPoints: 12,
      earned: Math.min((profile.interests?.length || 0) * 4, 12),
      suggestion: profile.interests?.length
        ? `Add ${3 - (profile.interests?.length || 0)} more interest(s) to max out this criterion.`
        : 'Add at least 3 interests to help our AI find your tribe.',
    },
    {
      key: 'careerGoals',
      label: 'Career Goals / Bio',
      icon: <Target className="w-3.5 h-3.5" />,
      maxPoints: 8,
      earned: (profile.careerGoals && profile.careerGoals.length > 0) ? 8 : 0,
      suggestion: 'Write a short bio or career goal to attract like-minded people.',
    },
    {
      key: 'lookingFor',
      label: 'Looking For',
      icon: <Users className="w-3.5 h-3.5" />,
      maxPoints: 7,
      earned: (profile.lookingFor && profile.lookingFor.length > 0) ? 7 : 0,
      suggestion: 'Tell us who you want to meet (Mentor, Co-founder, Team, etc.).',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <Link2 className="w-3.5 h-3.5" />,
      maxPoints: 8,
      earned: socialLinks.linkedin?.trim() ? 8 : 0,
      suggestion: 'Link your LinkedIn to boost credibility and networking reach.',
    },
    {
      key: 'github',
      label: 'GitHub',
      icon: <GitBranch className="w-3.5 h-3.5" />,
      maxPoints: 7,
      earned: socialLinks.github?.trim() ? 7 : 0,
      suggestion: 'Link your GitHub to showcase your projects and code.',
    },
    {
      key: 'startupInterest',
      label: 'Startup Interest',
      icon: <Rocket className="w-3.5 h-3.5" />,
      maxPoints: 5,
      earned: profile.startupInterest ? 5 : 0,
      suggestion: 'Enable startup interest to match with founders & builders.',
    },
    {
      key: 'hackathonInterest',
      label: 'Hackathon Interest',
      icon: <Zap className="w-3.5 h-3.5" />,
      maxPoints: 5,
      earned: profile.hackathonInterest ? 5 : 0,
      suggestion: 'Enable hackathon interest to find teammates faster.',
    },
  ];

  return criteria;
}

function getScoreColor(score: number): { ring: string; text: string; bg: string; glow: string } {
  if (score >= 70) return {
    ring: 'stroke-emerald-500',
    text: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    glow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
  };
  if (score >= 40) return {
    ring: 'stroke-amber-500',
    text: 'text-amber-600',
    bg: 'bg-amber-500/10',
    glow: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))',
  };
  return {
    ring: 'stroke-red-500',
    text: 'text-red-500',
    bg: 'bg-red-500/10',
    glow: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))',
  };
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Good';
  if (score >= 30) return 'Fair';
  return 'Needs Work';
}

// ─────────────────────────────────────────────
// Animated Score Number
// ─────────────────────────────────────────────
function AnimatedScore({ value, className }: { value: number; className?: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplayed(0); return; }

    let frame: number;
    const duration = 1200; // ms
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{displayed}</span>;
}

// ─────────────────────────────────────────────
// SVG Circular Progress Ring
// ─────────────────────────────────────────────
function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        style={{ filter: colors.glow }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-foreground/[0.06]"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colors.ring}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedScore value={score} className={cn("text-3xl font-bold leading-none", colors.text)} />
        <span className="text-[9px] text-foreground/50 font-semibold tracking-wider uppercase mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function NetworkingHealthScore({ profile, variant = 'full', className }: NetworkingHealthScoreProps) {
  const criteria = useMemo(() => computeScoreCriteria(profile), [profile]);
  const totalScore = useMemo(() => criteria.reduce((sum, c) => sum + c.earned, 0), [criteria]);
  const missingCriteria = useMemo(() => criteria.filter(c => c.earned < c.maxPoints), [criteria]);
  const completedCriteria = useMemo(() => criteria.filter(c => c.earned >= c.maxPoints), [criteria]);
  const colors = getScoreColor(totalScore);
  const label = getScoreLabel(totalScore);

  // ────── COMPACT VARIANT ──────
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={cn("flex items-center gap-4", className)}
      >
        <ScoreRing score={totalScore} size={80} />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold", colors.text)}>{label}</span>
            <Badge variant="gradient" className="text-[8px] !px-2 !py-0">
              {totalScore}/100
            </Badge>
          </div>
          <p className="text-[10px] text-foreground/60 max-w-[200px] leading-relaxed">
            {missingCriteria.length === 0
              ? 'Your profile is fully optimized!'
              : `Complete ${missingCriteria.length} more field${missingCriteria.length > 1 ? 's' : ''} to boost your score.`}
          </p>
          {missingCriteria.length > 0 && (
            <Link href="/onboarding" className="text-[10px] text-primary font-semibold flex items-center gap-0.5 hover:underline mt-0.5">
              Improve Profile <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </motion.div>
    );
  }

  // ────── FULL VARIANT ──────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        "glass glass-shimmer rounded-3xl p-6 border border-primary/10",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none">Networking Health Score</h3>
            <p className="text-[10px] text-foreground/55 mt-0.5">AI-powered profile strength analysis</p>
          </div>
        </div>
        <Badge variant="gradient" className="text-[9px] !px-2.5 !py-0.5 font-bold">
          {label}
        </Badge>
      </div>

      {/* Score Ring + Summary Row */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Ring */}
        <div className="flex-shrink-0">
          <ScoreRing score={totalScore} size={140} />
        </div>

        {/* Breakdown */}
        <div className="flex-1 w-full min-w-0">
          {/* Progress bar summary */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] mb-1.5">
              <span className="text-foreground/60 font-medium">
                {completedCriteria.length} of {criteria.length} criteria completed
              </span>
              <span className={cn("font-bold", colors.text)}>{totalScore} pts</span>
            </div>
            <div className="w-full h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", totalScore >= 70 ? "bg-emerald-500" : totalScore >= 40 ? "bg-amber-500" : "bg-red-500")}
                initial={{ width: 0 }}
                animate={{ width: `${totalScore}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
            </div>
          </div>

          {/* Completed items (collapsed row of icons) */}
          {completedCriteria.length > 0 && (
            <div className="mb-3">
              <span className="text-[9px] text-foreground/50 font-semibold uppercase tracking-wider block mb-1.5">
                Completed
              </span>
              <div className="flex flex-wrap gap-1.5">
                {completedCriteria.map((c) => (
                  <div
                    key={c.key}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-emerald-600"
                    title={c.label}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-[9px] font-semibold">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Improvement Suggestions */}
      {missingCriteria.length > 0 && (
        <div className="mt-5 pt-4 border-t border-foreground/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                Suggestions to Improve
              </span>
            </div>
            <Link href="/onboarding">
              <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
                Edit Profile <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {missingCriteria.slice(0, 6).map((c) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * missingCriteria.indexOf(c) }}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/25 border border-foreground/[0.05] hover:bg-white/40 transition-colors"
              >
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                  colors.bg,
                  colors.text
                )}>
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-foreground/80">{c.label}</span>
                    <span className="text-[8px] text-foreground/40 font-medium">+{c.maxPoints - c.earned} pts</span>
                  </div>
                  <p className="text-[9px] text-foreground/55 leading-relaxed mt-0.5">
                    {c.suggestion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {missingCriteria.length > 6 && (
            <Link href="/onboarding">
              <p className="text-[10px] text-primary font-semibold text-center mt-3 hover:underline cursor-pointer">
                +{missingCriteria.length - 6} more suggestions — Edit Profile →
              </p>
            </Link>
          )}
        </div>
      )}

      {/* Perfect Score State */}
      {missingCriteria.length === 0 && (
        <div className="mt-5 pt-4 border-t border-foreground/[0.06] text-center">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-600">Your profile is fully optimized!</span>
          </div>
          <p className="text-[10px] text-foreground/55 mt-1">
            You&apos;re getting the best possible AI match recommendations.
          </p>
        </div>
      )}
    </motion.div>
  );
}
