'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppAuth as useAuth, useAppUser as useUser, AppUserButton as UserButton } from '@/lib/auth';
import { motion } from 'framer-motion';
import { 
  Sparkles, Loader2, User, HelpCircle, Send, Check, AlertCircle, 
  QrCode, MessageSquare, Briefcase, GraduationCap, MapPin, RefreshCw,
  Home, Users, Calendar, Settings, ArrowRight, BookOpen, Inbox,
  Edit3, LogOut, Globe, Heart, Star, Clock, Bell
} from 'lucide-react';
import { GlassCard, PremiumButton, Badge } from '@/components/ui-custom';
import NetworkingHealthScore from '@/components/NetworkingHealthScore';

export default function Dashboard() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState<Record<string, boolean>>({});
  const [requestSent, setRequestSent] = useState<Record<string, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Active navigation link tracking
  const [activeNav, setActiveNav] = useState('matches');

  // Hardcoded featured mockup profiles for presentation
  const mockMatches = [
    {
      profile: {
        id: 'mock-aman',
        name: 'Aman Verma',
        photo: '',
        college: 'IIT Delhi',
        company: 'Microsoft Intern',
        degree: 'B.Tech CS',
        experience: '1 year build',
        skills: ['React', 'TypeScript', 'Node.js', 'Kubernetes'],
        interests: ['DevOps', 'Distributed Systems'],
        careerGoals: ['Build scalable backend infrastructure'],
        lookingFor: ['Team', 'Co-founder'],
      },
      matchPercentage: 90,
      explanation: 'Aman shares your passion for systems design and has complementary full-stack skills.',
      icebreakers: ['Hey Aman, which framework do you prefer for building microservices?', 'I saw you worked at Microsoft. What was the tech stack of your team?'],
    },
    {
      profile: {
        id: 'mock-neha',
        name: 'Neha Iyer',
        photo: '',
        college: 'NID',
        company: 'Freelance Designer',
        degree: 'B.Des Interaction Design',
        experience: '2 years UI design',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Flows'],
        interests: ['User Experience', 'Interaction Design'],
        careerGoals: ['Design accessible and delightful user interfaces'],
        lookingFor: ['Team', 'Friends'],
      },
      matchPercentage: 88,
      explanation: 'Neha has the UI/UX experience needed to turn your backend code into a beautiful product.',
      icebreakers: ['Hey Neha, which design system tools do you use in Figma?', 'Do you have any experience translating Figma layouts to React code?'],
    },
    {
      profile: {
        id: 'mock-rohan',
        name: 'Rohan Mehta',
        photo: '',
        college: 'DTU',
        company: 'AI Research Lab',
        degree: 'B.Tech Software Eng',
        experience: '2 years AI Dev',
        skills: ['Python', 'PyTorch', 'Hugging Face', 'Transformers'],
        interests: ['NLP', 'Large Language Models'],
        careerGoals: ['Conduct research on agentic AI capabilities'],
        lookingFor: ['Mentor', 'Co-founder'],
      },
      matchPercentage: 82,
      explanation: 'Rohan is a dedicated AI researcher matching your generative AI goals.',
      icebreakers: ['Which LLM frameworks are you exploring right now?', 'How do you optimize embedding model performance?'],
    }
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    setMatchingError(null);
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      try {
        const profileRes = await fetch(`${apiUrl}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.status === 404) {
          router.push('/onboarding');
          return;
        }

        if (!profileRes.ok) {
          throw new Error('Failed to load profile');
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        if (!profileData.name || !profileData.skills || profileData.skills.length === 0) {
          router.push('/onboarding');
          return;
        }
      } catch (fetchErr) {
        console.warn('Backend server offline. Loading mock profile fallback.');
        const stored = localStorage.getItem('mockProfile');
        if (stored) {
          setProfile(JSON.parse(stored));
        } else {
          const defaultProfile = {
            id: 'mock-user-123',
            name: 'Ananya Sharma',
            college: 'IIT Bombay',
            degree: 'B.Tech CS',
            company: 'Google',
            skills: ['React', 'Next.js', 'AI Agents'],
            interests: ['Generative AI', 'Web Dev'],
            careerGoals: ['Build AI-first products'],
            hobbies: ['Chess', 'Photography'],
            experience: '2 years full-stack',
          };
          setProfile(defaultProfile);
          localStorage.setItem('mockProfile', JSON.stringify(defaultProfile));
        }
      }

      try {
        const matchesRes = await fetch(`${apiUrl}/api/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          setMatches(matchesData);
        }
      } catch {
        // Backend offline — mock matches will be used
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchDashboardData();
    }
  }, [isLoaded]);

  const handleConnectRequest = async (targetProfileId: string) => {
    if (targetProfileId.startsWith('mock-')) {
      setRequestSent(prev => ({ ...prev, [targetProfileId]: true }));
      return;
    }

    setSendingRequest(prev => ({ ...prev, [targetProfileId]: true }));
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const res = await fetch(`${apiUrl}/api/connections/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: targetProfileId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send connection request');
      }

      setRequestSent(prev => ({ ...prev, [targetProfileId]: true }));
    } catch (error: any) {
      // For mock mode, just mark as sent
      setRequestSent(prev => ({ ...prev, [targetProfileId]: true }));
    } finally {
      setSendingRequest(prev => ({ ...prev, [targetProfileId]: false }));
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs text-foreground/75 mt-3 font-sans">Analyzing vector recommendations...</p>
      </div>
    );
  }

  // Active Username
  const userName = profile?.name?.split(' ')[0] || user?.firstName || 'Ananya';
  const displayMatches = matches.length > 0 ? matches : mockMatches;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
      
      {/* 1. LEFT SIDEBAR PANEL (3 Columns) */}
      <aside className="lg:col-span-3 flex flex-col justify-between glass rounded-3xl p-6 border border-primary/10">
        <div className="flex flex-col gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 px-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 text-sm">
              C
            </div>
            <span className="font-semibold text-lg tracking-tight">Connect<span className="text-primary font-bold">AI</span></span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveNav('home')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeNav === 'home' ? 'bg-primary/10 text-primary shadow-sm' : 'text-foreground/70 hover:bg-white/30 hover:text-foreground'
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={() => setActiveNav('matches')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeNav === 'matches' ? 'bg-primary/10 text-primary shadow-sm' : 'text-foreground/70 hover:bg-white/30 hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Matches
            </button>
            <button 
              onClick={() => setActiveNav('network')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeNav === 'network' ? 'bg-primary/10 text-primary shadow-sm' : 'text-foreground/70 hover:bg-white/30 hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" /> Network
            </button>
            <Link href="/chat">
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer text-foreground/70 hover:bg-white/30 hover:text-foreground text-left"
              >
                <MessageSquare className="w-4 h-4" /> Messages
              </button>
            </Link>
            <button 
              onClick={() => setActiveNav('events')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeNav === 'events' ? 'bg-primary/10 text-primary shadow-sm' : 'text-foreground/70 hover:bg-white/30 hover:text-foreground'
              }`}
            >
              <Calendar className="w-4 h-4" /> Events
            </button>
            <Link href="/onboarding">
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer text-foreground/70 hover:bg-white/30 hover:text-foreground text-left"
              >
                <User className="w-4 h-4" /> Profile
              </button>
            </Link>
            <button 
              onClick={() => setActiveNav('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                activeNav === 'settings' ? 'bg-primary/10 text-primary shadow-sm' : 'text-foreground/70 hover:bg-white/30 hover:text-foreground'
              }`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>
        </div>

        {/* User Card at the bottom */}
        <div className="border-t border-foreground/10 pt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end overflow-hidden flex items-center justify-center text-white font-bold text-sm">
              {profile?.name?.[0] || 'U'}
            </div>
            <div>
              <h4 className="font-semibold text-xs leading-none">{profile?.name}</h4>
              <span className="text-[9px] text-foreground/60 mt-1 block">Active Attendee</span>
            </div>
          </div>
          <UserButton />
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD HUB PANEL (9 Columns) */}
      <main className="lg:col-span-9 flex flex-col gap-6 overflow-y-auto pr-1">
        
        {/* ===================== HOME VIEW ===================== */}
        {activeNav === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold">{getGreeting()}, {userName}! 👋</h1>
              <p className="text-xs text-foreground/75 mt-0.5">Welcome back to ConnectAI. Here&apos;s an overview of your networking activity.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="!p-4 flex flex-col items-center gap-2 border-primary/10 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-primary">{displayMatches.length}</div>
                <p className="text-[10px] text-foreground/60 font-medium">AI Matches</p>
              </GlassCard>
              <GlassCard className="!p-4 flex flex-col items-center gap-2 border-secondary/15 text-center">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Send className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-secondary">{Object.keys(requestSent).length}</div>
                <p className="text-[10px] text-foreground/60 font-medium">Requests Sent</p>
              </GlassCard>
              <GlassCard className="!p-4 flex flex-col items-center gap-2 border-accent/25 text-center">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-accent">2</div>
                <p className="text-[10px] text-foreground/60 font-medium">Events Today</p>
              </GlassCard>
              <GlassCard className="!p-4 flex flex-col items-center gap-2 border-primary/10 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-primary">1</div>
                <p className="text-[10px] text-foreground/60 font-medium">Groups Joined</p>
              </GlassCard>
            </div>

            {/* AI Networking Health Score */}
            {profile && (
              <NetworkingHealthScore profile={profile} variant="full" />
            )}

            {/* Quick Actions */}
            <GlassCard className="border-primary/10">
              <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => setActiveNav('matches')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border border-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-semibold text-foreground/80">View Matches</span>
                </button>
                <Link href="/qr" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer border border-secondary/10">
                  <QrCode className="w-5 h-5 text-secondary" />
                  <span className="text-[10px] font-semibold text-foreground/80">Share QR</span>
                </Link>
                <Link href="/chat" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer border border-accent/10">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  <span className="text-[10px] font-semibold text-foreground/80">Messages</span>
                </Link>
                <Link href="/onboarding" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border border-primary/10">
                  <Edit3 className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-semibold text-foreground/80">Edit Profile</span>
                </Link>
              </div>
            </GlassCard>

            {/* Top Match Preview */}
            <GlassCard className="border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Your Top Match</h3>
                <button onClick={() => setActiveNav('matches')} className="text-[10px] text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {displayMatches[0] && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end overflow-hidden flex items-center justify-center text-white font-bold text-lg">
                      {displayMatches[0].profile.name?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{displayMatches[0].profile.name}</h4>
                      <p className="text-[10px] text-foreground/60">{displayMatches[0].profile.degree} • {displayMatches[0].profile.college}</p>
                      <div className="flex gap-1 mt-1">
                        {displayMatches[0].profile.skills.slice(0, 3).map((s: string) => (
                          <Badge key={s} variant="outline" className="text-[8px] py-0 px-1.5">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="gradient" className="!px-2 !py-0.5 text-[9px] font-bold">{displayMatches[0].matchPercentage}% Match</Badge>
                    <button onClick={() => setActiveNav('matches')} className="text-[10px] text-primary font-semibold cursor-pointer hover:underline">
                      Connect →
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* ===================== MATCHES VIEW ===================== */}
        {activeNav === 'matches' && (
          <motion.div
            key="matches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Your AI Matches ✨</h1>
                <p className="text-xs text-foreground/75 mt-0.5">People who complement your skills and goals.</p>
              </div>
              
              <div className="flex gap-2">
                <Link href="/qr">
                  <PremiumButton variant="glass" className="flex items-center gap-1.5 !px-3.5 !py-2 !text-xs">
                    <QrCode className="w-3.5 h-3.5" /> Present QR
                  </PremiumButton>
                </Link>
                <button 
                  onClick={fetchDashboardData}
                  className="p-2 rounded-full glass border border-primary/20 hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                  title="Refresh matches"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TOP MATCH CARDS ROW (3 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayMatches.slice(0, 3).map((match) => (
                <GlassCard 
                  key={match.profile.id} 
                  className="flex flex-col justify-between border border-primary/15 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Match % Pill */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="gradient" className="!px-2 !py-0.5 text-[9px] font-bold">
                      {match.matchPercentage}% Match
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Profile Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                        {match.profile.name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm leading-none">{match.profile.name}</h3>
                        <span className="text-[10px] text-foreground/60 mt-1 block">{match.profile.degree || 'Attendee'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-foreground/70">
                      <GraduationCap className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{match.profile.college || 'Event Venue'}</span>
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {match.profile.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-[9px] py-0.5 px-2">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-foreground/5">
                    <button 
                      onClick={() => setSelectedMatch(match)}
                      className="flex-1 text-[10px] text-primary border border-primary/20 py-2 rounded-full glass hover:bg-primary/5 font-semibold text-center cursor-pointer transition-colors"
                    >
                      Why Match?
                    </button>
                    {requestSent[match.profile.id] ? (
                      <div className="flex-1 flex items-center justify-center bg-green-500/10 border border-green-500/20 text-green-700 py-1.5 rounded-full text-[9px] font-bold">
                        <Check className="w-3 h-3 mr-0.5" /> Sent
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConnectRequest(match.profile.id)}
                        disabled={sendingRequest[match.profile.id]}
                        className="flex-1 text-[10px] bg-primary text-white py-2 rounded-full hover:bg-primary-light font-semibold text-center cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {sendingRequest[match.profile.id] ? 'Sending...' : 'Connect'}
                      </button>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* BOTTOM ROWS: RECOMMENDED GROUP & CONTEXT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Recommended Group Widget (7 Columns) */}
              <GlassCard className="md:col-span-7 flex flex-col justify-between border-secondary/15">
                <div>
                  <Badge variant="gradient" className="mb-2">Recommended Group</Badge>
                  <h3 className="font-bold text-lg leading-tight">AI & Web3 Builders</h3>
                  <p className="text-xs text-foreground/75 mt-1 leading-relaxed">
                    A small, balanced networking circle of developers, designers, and founders hacking on decentralized AI.
                  </p>
                  
                  {/* Member avatars */}
                  <div className="flex items-center gap-1 mt-4">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-primary text-white text-[9px] font-bold flex items-center justify-center">AS</div>
                      <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-secondary text-white text-[9px] font-bold flex items-center justify-center">PP</div>
                      <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-accent text-white text-[9px] font-bold flex items-center justify-center">RV</div>
                    </div>
                    <span className="text-[10px] text-foreground/60 ml-2 font-medium">5 Members active</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-foreground/5 pt-3 flex justify-between items-center">
                  <span className="text-[10px] text-foreground/60">Auto-created by Match Agent</span>
                  <Link href="/chat">
                    <button className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer">
                      View Group Chat <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </GlassCard>

              {/* Sessions & Tips (5 Columns) */}
              <div className="md:col-span-5 flex flex-col gap-6">
                {/* Upcoming Session */}
                <GlassCard className="p-4 border-accent/25 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-[10px] font-bold text-accent uppercase tracking-wide">Upcoming Session You Both Attend</h4>
                    <h3 className="font-bold text-sm mt-1">The Future of AI Agents</h3>
                    <p className="text-[10px] text-foreground/70 mt-0.5">Today, 2:30 PM • Main Stage</p>
                  </div>
                  <Badge variant="outline" className="self-start text-[9px]">3 Matches Attending</Badge>
                </GlassCard>

                {/* Networking Tip */}
                <GlassCard className="p-4 border-primary/10 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-wide">Networking Tip</h4>
                    <p className="text-[11px] text-foreground/80 mt-1 leading-relaxed">
                      Start with an icebreaker! Use our custom icebreaker tool built on shared profile tags.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedMatch(mockMatches[0])}
                    className="text-[10px] text-primary font-semibold flex items-center gap-0.5 self-start hover:underline cursor-pointer"
                  >
                    Try Icebreaker Generator <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </GlassCard>
              </div>
            </div>

            {/* FULL MATCHES LIST FROM DB (IF ANY) */}
            {displayMatches.length > 3 && (
              <div className="flex flex-col gap-4 mt-4">
                <h2 className="text-base font-bold">More Matches</h2>
                <div className="flex flex-col gap-4">
                  {displayMatches.slice(3).map((match) => (
                    <GlassCard key={match.profile.id} className="border border-foreground/5 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                          {match.profile.name?.[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm leading-none">{match.profile.name}</h4>
                          <p className="text-[10px] text-foreground/60 mt-1">{match.profile.degree || 'Attendee'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedMatch(match)}
                          className="text-[9px] text-primary border border-primary/20 px-3 py-1.5 rounded-full glass font-semibold cursor-pointer"
                        >
                          Why Match?
                        </button>
                        <button 
                          onClick={() => handleConnectRequest(match.profile.id)}
                          className="text-[9px] bg-primary text-white px-3 py-1.5 rounded-full hover:bg-primary-light font-semibold cursor-pointer transition-colors"
                        >
                          Connect
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ===================== NETWORK VIEW ===================== */}
        {activeNav === 'network' && (
          <motion.div
            key="network"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold">Your Network 🌐</h1>
              <p className="text-xs text-foreground/75 mt-0.5">People you&apos;ve connected with at events.</p>
            </div>

            {/* Connected People */}
            <GlassCard className="border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Active Connections</h3>
                <Badge variant="outline" className="text-[9px]">{Object.keys(requestSent).length} Connected</Badge>
              </div>

              {Object.keys(requestSent).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                  <Users className="w-10 h-10 text-primary/50 mb-3" />
                  <h4 className="font-semibold text-sm">No connections yet</h4>
                  <p className="text-xs text-foreground/60 mt-1 max-w-xs">Go to the Matches tab and hit &quot;Connect&quot; to start building your network!</p>
                  <PremiumButton onClick={() => setActiveNav('matches')} className="mt-4 !px-5 !py-2 !text-xs">
                    Browse Matches
                  </PremiumButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayMatches.filter(m => requestSent[m.profile.id]).map((match) => (
                    <div key={match.profile.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/20 border border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end flex items-center justify-center text-white font-bold text-sm">
                          {match.profile.name?.[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs">{match.profile.name}</h4>
                          <p className="text-[10px] text-foreground/60">{match.profile.college}</p>
                        </div>
                      </div>
                      <Link href="/chat">
                        <button className="text-[10px] text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                          Chat <MessageSquare className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Recommended Connections */}
            <GlassCard className="border-secondary/15">
              <h3 className="font-semibold text-sm mb-3">Suggested Connections</h3>
              <p className="text-xs text-foreground/60 mb-4">People in your match cluster you haven&apos;t connected with yet.</p>
              <div className="flex flex-col gap-3">
                {displayMatches.filter(m => !requestSent[m.profile.id]).slice(0, 3).map((match) => (
                  <div key={match.profile.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/15 border border-foreground/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end flex items-center justify-center text-white font-bold text-xs">
                        {match.profile.name?.[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs">{match.profile.name}</h4>
                        <p className="text-[10px] text-foreground/60">{match.matchPercentage}% match</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleConnectRequest(match.profile.id)}
                      className="text-[9px] bg-primary text-white px-3 py-1.5 rounded-full font-semibold cursor-pointer hover:bg-primary-light transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ===================== EVENTS VIEW ===================== */}
        {activeNav === 'events' && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold">Events 🎪</h1>
              <p className="text-xs text-foreground/75 mt-0.5">Sessions and networking events happening today.</p>
            </div>

            {/* Today's Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="border-accent/25 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <Badge variant="gradient" className="text-[9px]">Live Now</Badge>
                </div>
                <h3 className="font-bold text-base">The Future of AI Agents</h3>
                <p className="text-xs text-foreground/70">Explore how agentic AI is reshaping product development and enterprise workflows.</p>
                <div className="flex items-center gap-4 text-[10px] text-foreground/60 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2:30 PM – 3:30 PM</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Main Stage</span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-foreground/5">
                  <Badge variant="outline" className="text-[9px]">3 Matches Attending</Badge>
                </div>
              </GlassCard>

              <GlassCard className="border-primary/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[9px]">Upcoming</Badge>
                </div>
                <h3 className="font-bold text-base">Founders Meetup Mixer</h3>
                <p className="text-xs text-foreground/70">Speed networking for early-stage founders looking for co-founders and technical talent.</p>
                <div className="flex items-center gap-4 text-[10px] text-foreground/60 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5:00 PM – 6:30 PM</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Networking Lounge</span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-foreground/5">
                  <Badge variant="outline" className="text-[9px]">5 Matches Attending</Badge>
                </div>
              </GlassCard>

              <GlassCard className="border-secondary/15 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[9px]">Tomorrow</Badge>
                </div>
                <h3 className="font-bold text-base">Design Systems Workshop</h3>
                <p className="text-xs text-foreground/70">Hands-on workshop on building scalable design systems with Figma and React.</p>
                <div className="flex items-center gap-4 text-[10px] text-foreground/60 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10:00 AM – 12:00 PM</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Workshop Room B</span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-foreground/5">
                  <Badge variant="outline" className="text-[9px]">2 Matches Attending</Badge>
                </div>
              </GlassCard>

              <GlassCard className="border-accent/25 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Heart className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[9px]">Tomorrow</Badge>
                </div>
                <h3 className="font-bold text-base">AI Hackathon Kickoff</h3>
                <p className="text-xs text-foreground/70">48-hour hackathon building real AI products. Team formation and pitch prep.</p>
                <div className="flex items-center gap-4 text-[10px] text-foreground/60 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2:00 PM – 4:00 PM</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Hack Arena</span>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-foreground/5">
                  <Badge variant="outline" className="text-[9px]">8 Matches Attending</Badge>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* ===================== SETTINGS VIEW ===================== */}
        {activeNav === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold">Settings ⚙️</h1>
              <p className="text-xs text-foreground/75 mt-0.5">Manage your account and preferences.</p>
            </div>

            {/* Profile Overview */}
            <GlassCard className="border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Profile Overview</h3>
                <Link href="/onboarding">
                  <button className="text-[10px] text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                    <Edit3 className="w-3 h-3" /> Edit Profile
                  </button>
                </Link>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gradient-start to-gradient-end flex items-center justify-center text-white font-bold text-xl">
                  {profile?.name?.[0] || 'U'}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-base">{profile?.name || 'User'}</h4>
                  <p className="text-xs text-foreground/70">{profile?.degree || 'Attendee'} • {profile?.college || 'Unknown'}</p>
                  {profile?.company && <p className="text-xs text-foreground/60">{profile.company}</p>}
                  {profile?.skills && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(Array.isArray(profile.skills) ? profile.skills : []).slice(0, 5).map((s: string) => (
                        <Badge key={s} variant="outline" className="text-[8px] py-0 px-1.5">{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Networking Health Score Card */}
            {profile && (
              <GlassCard className="border-primary/10">
                <NetworkingHealthScore profile={profile} variant="compact" />
              </GlassCard>
            )}

            {/* Preferences */}
            <GlassCard className="border-foreground/5">
              <h3 className="font-semibold text-sm mb-4">Preferences</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/15 border border-foreground/5">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-primary" />
                    <div>
                      <h4 className="text-xs font-semibold">Push Notifications</h4>
                      <p className="text-[10px] text-foreground/60">Get notified about new matches and messages</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/15 border border-foreground/5">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-primary" />
                    <div>
                      <h4 className="text-xs font-semibold">Profile Visibility</h4>
                      <p className="text-[10px] text-foreground/60">Allow other attendees to discover your profile</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/15 border border-foreground/5">
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-accent" />
                    <div>
                      <h4 className="text-xs font-semibold">AI Match Quality</h4>
                      <p className="text-[10px] text-foreground/60">Only show matches above 75% compatibility</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" />
                </div>
              </div>
            </GlassCard>

            {/* Account Actions */}
            <GlassCard className="border-red-200/30">
              <h3 className="font-semibold text-sm mb-3">Account</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    localStorage.removeItem('mockUser');
                    localStorage.removeItem('mockProfile');
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 text-xs text-red-500 font-semibold p-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </main>

      {/* WHY MATCH? MODAL OVERLAY */}
      {selectedMatch && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedMatch(null); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass rounded-3xl p-6 relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="gradient" className="mb-1">AI Match Insight</Badge>
                <h3 className="font-bold text-xl">Connecting with {selectedMatch.profile.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedMatch(null)}
                className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center font-bold text-sm hover:bg-foreground/15 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <h4 className="text-xs font-semibold text-primary mb-1">Matching Explanation:</h4>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {selectedMatch.explanation}
                </p>
              </div>

              <div className="bg-secondary/5 p-4 rounded-2xl border border-secondary/10">
                <h4 className="text-xs font-semibold text-secondary mb-2">Personalized Conversation Icebreakers:</h4>
                <div className="flex flex-col gap-2">
                  {selectedMatch.icebreakers.map((starter: string, i: number) => (
                    <div key={i} className="flex gap-2 text-xs text-foreground/80 bg-white/40 p-2.5 rounded-xl border border-foreground/5 leading-relaxed">
                      <span className="font-bold text-secondary">{i + 1}.</span>
                      <span>{starter}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <PremiumButton 
                  variant="secondary"
                  onClick={() => setSelectedMatch(null)}
                  className="!px-5 !py-2 !text-xs"
                >
                  Close
                </PremiumButton>
                <PremiumButton 
                  onClick={() => {
                    handleConnectRequest(selectedMatch.profile.id);
                    setSelectedMatch(null);
                  }}
                  disabled={requestSent[selectedMatch.profile.id]}
                  className="!px-5 !py-2 !text-xs"
                >
                  {requestSent[selectedMatch.profile.id] ? '✓ Connected' : 'Send Connection Request'}
                </PremiumButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
