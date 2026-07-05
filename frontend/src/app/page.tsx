'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, AnimatePresence, useTransform } from 'framer-motion';
import { useAppAuth as useAuth, AppSignUpButton as SignUpButton } from '@/lib/auth';
import { 
  Sparkles, ArrowRight, Zap, Target, Users, Heart, MessageCircle, QrCode, 
  Plus, Minus, CheckCircle, Star, Sparkle, ArrowUpRight, Compass, ShieldCheck, Mail
} from 'lucide-react';
import { GlassCard, PremiumButton, Badge, MatchCluster } from '@/components/ui-custom';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import HeroIllustration from '@/components/HeroIllustration';
import MatchmakingDemo from '@/components/MatchmakingDemo';
import NetworkingFeed from '@/components/NetworkingFeed';
import OrganizerDashboard from '@/components/OrganizerDashboard';
import NetworkAnimation from '@/components/NetworkAnimation';
import AmbientParticles from '@/components/AmbientParticles';

// Stagger child animation variants
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
};

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track page scroll for background network sync
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // State for FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-[#A98DFF] via-[#D7C8FF] to-[#FFB7A7] selection:bg-primary/20 selection:text-primary-dark"
    >
      {/* ===== LAYER 1: NETWORK ANIMATION BACKGROUND ===== */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: -10, opacity: 0.35 }}>
        <NetworkAnimation scrollYProgress={scrollYProgress} />
      </div>

      {/* ===== LAYER 2: AMBIENT FLOATING BOKEHS ===== */}
      <AmbientParticles />

      {/* ===== HEADER NAVIGATION ===== */}
      <Navbar />

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-16 md:pb-28 lg:min-h-[90vh] flex items-center justify-start overflow-visible">
        {/* Full-width panoramic background illustration (z-0) */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[70%] pointer-events-none z-0 flex items-end justify-end overflow-visible select-none">
          <div className="w-full h-full lg:h-[105%] flex items-end overflow-visible">
            <HeroIllustration scrollYProgress={scrollYProgress} />
          </div>
        </div>

        {/* Left Column Content overlaying the illustration (z-10) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-xl flex flex-col gap-6 text-left z-10 relative bg-white/20 backdrop-blur-[6px] lg:bg-transparent lg:backdrop-blur-none p-6 sm:p-8 lg:p-0 rounded-3xl border border-white/30 lg:border-none shadow-lg shadow-primary/5 lg:shadow-none"
        >
          <motion.div variants={fadeUpItem}>
            <Badge variant="gradient" className="gap-1.5 self-start shadow-sm border border-primary/10">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Strangers become teammates
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUpItem}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground"
          >
            Meet the people you&apos;ll wish you met <span className="bg-gradient-to-r from-primary via-secondary to-[#8B7EFF] bg-clip-text text-transparent font-black">before leaving.</span>
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="text-sm sm:text-base text-foreground/75 leading-relaxed max-w-md font-medium"
          >
            AI-powered networking that helps you find like-minded people, build meaningful connections, and create opportunities.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUpItem} className="flex flex-wrap gap-4 mt-2">
            {isLoaded && isSignedIn ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <PremiumButton className="w-full flex items-center justify-center gap-2 text-sm shadow-md">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </PremiumButton>
              </Link>
            ) : isLoaded && !isSignedIn ? (
              <SignUpButton mode="modal">
                <div className="w-full sm:w-auto">
                  <PremiumButton className="w-full flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </PremiumButton>
                </div>
              </SignUpButton>
            ) : (
              <div className="w-full sm:w-40 h-12 rounded-full bg-white/40 animate-pulse" />
            )}
            <a href="#how-it-works" className="w-full sm:w-auto">
              <PremiumButton variant="secondary" className="w-full flex items-center justify-center gap-2 text-sm">
                How It Works
              </PremiumButton>
            </a>
          </motion.div>

          {/* Social Trust Badges */}
          <motion.div 
            variants={fadeUpItem} 
            className="mt-6 pt-6 border-t border-white/20 flex flex-col gap-3"
          >
            <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest">
              Trusted by attendees at
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 opacity-60 text-xs font-semibold text-foreground">
              <span>🚀 MIT Hackathon</span>
              <span>⚡ YC Founders</span>
              <span>🎓 Techstars Meetups</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== SECTION 2: PROBLEM ===== */}
      <section id="problem" className="w-full py-20 md:py-28 max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">The Challenge</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Event Networking is Broken
          </h2>
          <p className="text-sm sm:text-base text-foreground/70 max-w-xl mx-auto leading-relaxed">
            Standing in crowded rooms, swapping business cards, trying to make eye contact. You shouldn&apos;t leave your next startup co-founder to chance.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              emoji: '📢',
              title: 'The Loud Room Dilemma',
              desc: 'Walking into a venue of 300 strangers and spending 2 hours playing guessing games to find the 3 people who actually share your stack or vision.',
              border: 'border-primary/10'
            },
            {
              emoji: '🗺️',
              title: 'Wandering Without a Map',
              desc: 'Talking to small-talk strangers at the catering booth, only to discover the perfect technical co-founder was sitting on the opposite balcony the whole time.',
              border: 'border-secondary/15'
            },
            {
              emoji: '🎯',
              title: 'Teammate Roulette',
              desc: 'Hackathons launch, teams form, and introverts get left out. You end up with mismatched skillsets instead of aligned, cross-functional partners.',
              border: 'border-accent/30'
            }
          ].map((item, idx) => (
            <GlassCard 
              key={idx} 
              className={cn("p-8 flex flex-col gap-4 border hover:scale-[1.02] duration-300 transition-all", item.border)}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-2xl shadow-sm">
                {item.emoji}
              </div>
              <h3 className="font-bold text-lg text-foreground mt-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ===== SECTION 3: HOW AI MATCHING WORKS ===== */}
      <section id="how-it-works" className="w-full py-20 md:py-28 bg-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4">The Engine</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              How AI Matching Works
            </h2>
            <p className="text-sm text-foreground/70 max-w-lg mx-auto">
              We convert skills, interests, and aspirations into high-dimensional embeddings to pair highly complementary people.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Describe Your Vision',
                desc: 'Describe what you build, what skills you bring, and who you are hoping to meet in our quick conversational wizard.',
                color: 'text-primary bg-primary/10'
              },
              {
                step: '02',
                title: 'Semantic Mapping',
                desc: 'ConnectAI maps your profile into a vector search database, calculating compatibilities based on shared intent rather than raw keywords.',
                color: 'text-secondary bg-secondary/10'
              },
              {
                step: '03',
                title: 'Instant Explanations',
                desc: 'Get matching alerts with transparent 2-sentence summaries explaining exactly why you match and custom icebreakers to kick off talks.',
                color: 'text-[#5243AA] bg-indigo-50'
              }
            ].map((step, idx) => (
              <GlassCard key={idx} className="p-8 border-white/40 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-bold px-3 py-1 rounded-full", step.color)}>
                    Step {step.step}
                  </span>
                  <Sparkle className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="font-extrabold text-base text-foreground mt-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">{step.desc}</p>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-tr from-primary/5 to-secondary/5 blur-lg" />
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: FEATURES GRID ===== */}
      <section id="features" className="w-full py-20 md:py-28 max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Designed for Real Relationships
          </h2>
          <p className="text-sm text-foreground/70 max-w-lg mx-auto">
            Every component is fine-tuned to remove friction, build trust, and help strangers align ideas.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'AI Vector Matchmaking',
              desc: 'Advanced semantic matching pairing founders, developers, and designers based on deep goals.',
              color: 'text-primary bg-primary/10 border-primary/10'
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: 'Transparent Match Reason',
              desc: 'Receive transparent AI summaries detailing overlaps in skills, interest, and previous stack usage.',
              color: 'text-secondary bg-secondary/10 border-secondary/15'
            },
            {
              icon: <MessageCircle className="w-6 h-6" />,
              title: 'Smart Icebreakers',
              desc: 'ConnectAI constructs three personalized conversation starters so introverts never feel stuck.',
              color: 'text-primary-light bg-indigo-50 border-primary/10'
            },
            {
              icon: <QrCode className="w-6 h-6" />,
              title: 'Instant QR Swap',
              desc: 'Tap profiles or scan dynamic badges to exchange contact details, GitHub links, and Twitter handles.',
              color: 'text-secondary bg-secondary/10 border-secondary/15'
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: 'Dynamic Team Clusters',
              desc: 'AI groups up to six compatible users, sparking cross-functional teams with balanced skillsets.',
              color: 'text-primary bg-primary/10 border-primary/10'
            },
            {
              icon: <Compass className="w-6 h-6" />,
              title: 'Organizer Analytics',
              desc: 'Event organizers monitor active clusters, networking density, and hot event trends in real time.',
              color: 'text-primary-light bg-indigo-50 border-primary/10'
            }
          ].map((feat, idx) => (
            <GlassCard key={idx} className={cn("p-6 border flex flex-col gap-3 hover:shadow-lg transition-all duration-300", feat.color)}>
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                {feat.icon}
              </div>
              <h3 className="font-bold text-sm text-foreground mt-1.5">{feat.title}</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">{feat.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ===== SECTION 5: ANIMATED MATCHMAKING DEMO ===== */}
      <section id="match-demo" className="w-full py-20 bg-white/20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <Badge variant="gradient" className="gap-1.5 mb-4 shadow-sm border border-secondary/15">
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" /> Live Simulation
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Watch Matchmaking Happen Live
            </h2>
            <p className="text-sm text-foreground/70 max-w-lg mx-auto">
              ConnectAI coordinates attendee mapping in real time, linking developers and designers to spark startup ideas.
            </p>
          </ScrollReveal>

          {/* Cinematic Interactive Demo */}
          <ScrollReveal>
            <MatchmakingDemo />
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 6: GROUP FORMATION & CLUSTERS ===== */}
      <section id="group-clusters" className="w-full py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <ScrollReveal>
              <Badge variant="outline" className="mb-4">Match Clusters</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                Strangers Become Team Clusters
              </h2>
              <p className="text-sm sm:text-base text-foreground/75 leading-relaxed font-medium mb-6">
                ConnectAI does not stop at 1-on-1 pairs. The vector matchmaking engine clusters attendees into cross-functional units (e.g., 2 devs, 1 designer, 1 marketer) representing optimal co-founding compatibility.
              </p>
              
              <div className="flex flex-col gap-3">
                {[
                  'Cross-functional skill balancing',
                  'Shared interest vector aggregation',
                  'Automated Slack/Notion channel setup',
                  'Event-room physical lounge allocation'
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 text-xs font-semibold text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right SVG Column (7 cols) */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <MatchCluster className="w-full max-w-md shadow-2xl border-white/60 bg-white/20" />
          </div>

        </div>
      </section>

      {/* ===== SECTION 7: ATTENDEE FEED PREVIEW ===== */}
      <section id="feed-preview" className="w-full py-20 bg-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Attendee App</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Your Personal Event Concierge
            </h2>
            <p className="text-sm text-foreground/70 max-w-lg mx-auto">
              Attendees access a real-time matching feed pre-filled with compatibility insights, chat gateways, and icebreaker prompts.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <NetworkingFeed />
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 8: ORGANIZER DASHBOARD PREVIEW ===== */}
      <section id="organizer-preview" className="w-full py-20 max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Organizer Control</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Supercharge Your Event Analytics
          </h2>
          <p className="text-sm text-foreground/70 max-w-lg mx-auto">
            Organizers track connection rates, cluster formations, hot trending tech topics, and overall attendee interaction rates in real time.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <OrganizerDashboard />
        </ScrollReveal>
      </section>

      {/* ===== SECTION 9: TESTIMONIALS ===== */}
      <section id="testimonials" className="w-full py-20 bg-white/20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="gradient" className="gap-1.5 mb-4 shadow-sm border border-primary/10">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" /> Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Loved by Founders & Hackers
            </h2>
            <p className="text-sm text-foreground/70 max-w-lg mx-auto">
              See how solo hackers, introverted developers, and organizers transformed their networking experience.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "I arrived at the MIT Hackathon solo, knowing absolutely nobody, and feeling overwhelmed by the room. ConnectAI matched me with Alex and Sarah within 5 minutes. We aligned on values and stack instantly—and our project went on to win first prize overall! Strangers really become teammates.",
                author: "Emily Watson",
                tag: "FinTech Track Winner",
                avatar: "👩‍💻"
              },
              {
                quote: "Finding a technical co-founder is like looking for a needle in a haystack, especially if you are not an outgoing networker. ConnectAI matched me with Marcus at a local startup incubator meetup. The AI explanation explained exactly why our previous roles aligned. We have been working together since.",
                author: "David Vance",
                tag: "Co-founder, LedgerX",
                avatar: "🚀"
              }
            ].map((test, idx) => (
              <GlassCard key={idx} className="p-8 border-white/50 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <p className="text-xs sm:text-sm text-foreground/80 italic leading-relaxed mb-6">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3.5 pt-4 border-t border-white/25">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                    {test.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-foreground">{test.author}</span>
                    <span className="text-[10px] text-primary font-semibold uppercase">{test.tag}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 10: PRICING ===== */}
      <section id="pricing" className="w-full py-20 max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Pricing Plans</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Transparent Pricing for Every Event
          </h2>
          <p className="text-sm text-foreground/70 max-w-lg mx-auto">
            Free tier for all event attendees. Flexible plans for event organizers looking to host smart match rooms.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {[
            {
              title: 'Attendee Pass',
              price: '$0',
              subtitle: 'Free forever for participants',
              features: [
                'Full semantic vector matchmaking',
                'Transparent AI explanation tags',
                '3 pre-set AI icebreakers per match',
                'QR contact/link swapping badge',
                'Join active match clusters'
              ],
              button: 'Get Started',
              popular: false,
              border: 'border-white/50'
            },
            {
              title: 'Organizer Starter',
              price: '$99',
              subtitle: 'Per single event (up to 150 attendees)',
              features: [
                'All attendee pass features',
                'Custom event matching portal link',
                'Basic organizer dashboard analytics',
                'Dynamic cluster formation toggles',
                'Email matchmaking support'
              ],
              button: 'Create Event Space',
              popular: true,
              border: 'border-primary/25 bg-white/30 relative'
            },
            {
              title: 'Organizer Pro',
              price: '$299',
              subtitle: 'Per single large event (unlimited attendees)',
              features: [
                'All organizer starter features',
                'Advanced network density topology maps',
                'Custom AI icebreakers fine-tuned to sponsor topics',
                'Shared Slack/Notion team workspace auto-creation',
                'Dedicated 24/7 organizer support line'
              ],
              button: 'Go Pro',
              popular: false,
              border: 'border-white/50'
            }
          ].map((plan, idx) => (
            <GlassCard 
              key={idx} 
              className={cn(
                "p-8 border flex flex-col justify-between hover:shadow-xl transition-all duration-300",
                plan.border
              )}
            >
              <div>
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}
                
                <h3 className="font-extrabold text-lg text-foreground mb-1">{plan.title}</h3>
                <span className="text-xs text-foreground/50 block mb-4 font-medium">{plan.subtitle}</span>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-foreground">{plan.price}</span>
                  {plan.price !== '$0' && <span className="text-xs text-foreground/50">/ event</span>}
                </div>

                <div className="space-y-3.5 mb-8">
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2.5 text-xs text-foreground/75 leading-tight font-medium">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <PremiumButton 
                variant={plan.popular ? 'primary' : 'secondary'}
                className="w-full text-xs py-3"
              >
                {plan.button}
              </PremiumButton>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ===== SECTION 11: FAQ ===== */}
      <section id="faq" className="w-full py-20 max-w-4xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <Badge variant="outline" className="mb-4">FAQs</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-foreground/70">
            Have questions about matches, profiles, or event setups? We have answers.
          </p>
        </ScrollReveal>

        <div className="space-y-4">
          {[
            {
              q: "How does ConnectAI calculate attendee compatibility?",
              a: "We use OpenAI embedding models to map attendee description entries (skills, interests, project goals) into a 1536-dimensional vector space. The database runs cosine distance calculations to locate top matches, while an LLM synthesizes readable, transparent rationales explaining shared commonalities."
            },
            {
              q: "Do attendees need to install a mobile app from the App Store?",
              a: "No app download is required. ConnectAI runs as a fully optimized, responsive Next.js Progressive Web App (PWA). Attendees simply scan a QR code at the event venue door, log in via Clerk magic links or Google, and access the matchmaking panel instantly on any mobile browser."
            },
            {
              q: "Can event organizers custom-brand the matching portal?",
              a: "Yes. With the Organizer Pro tier, you can customize the theme colors, upload logos, customize sponsor-aligned icebreaker prompts, and target matches to specific track requirements (e.g. only matching UX designers with Solidity devs)."
            },
            {
              q: "How is my contact details privacy managed?",
              a: "Your exact contact handles (email, Slack link, GitHub, phone) are completely masked until you explicitly tap the 'Swap Connections' button. Once both users approve the handshake, ConnectAI exposes details in the chat log and generates a downloadable vCard."
            }
          ].map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <GlassCard 
                key={idx} 
                className="p-5 border-white/50 cursor-pointer select-none transition-shadow"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-bold text-sm sm:text-base text-foreground">{item.q}</h4>
                  <div className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-foreground/60 shadow-sm shrink-0">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed border-t border-white/20 pt-3">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ===== SECTION 12: FOOTER ===== */}
      <footer className="w-full mt-auto bg-white/10 border-t border-white/15">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Logo */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-md text-sm">
                C
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                Connect<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Making events meaningful. Helping solo hackers, introverts, and startup founders discover their next co-founder.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Product</span>
            <div className="flex flex-col gap-2 text-xs text-foreground/70">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#match-demo" className="hover:text-primary transition-colors">Simulation</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing Details</a>
            </div>
          </div>

          {/* Col 3: Company */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Legal</span>
            <div className="flex flex-col gap-2 text-xs text-foreground/70">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
            </div>
          </div>

          {/* Col 4: Newsletter Signup */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Stay Updated</span>
            <span className="text-xs text-foreground/60">Get match summaries and event launch checklists.</span>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-white/40 border border-white/50 focus:border-primary/20 rounded-full px-3.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-foreground/40 w-full"
              />
              <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 hover:bg-primary-light transition-all shadow-sm">
                <Mail className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-foreground/45 gap-4">
          <span>© 2026 ConnectAI. All rights reserved. Made for hackathons and startups.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// ScrollReveal Component for fade-up trigger
// ─────────────────────────────────────────────
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: localProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const opacity = useTransform(localProgress, [0, 0.25], [0, 1]);
  const y = useTransform(localProgress, [0, 0.25], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
