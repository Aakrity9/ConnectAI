'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Star, Send, ShieldAlert, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedMatch {
  id: string;
  name: string;
  role: string;
  avatar: string;
  matchScore: number;
  tags: string[];
  reason: string;
  status: 'connected' | 'pending' | 'new';
  icebreakers: string[];
  messages: { sender: 'me' | 'them'; text: string; time: string }[];
}

const mockMatches: FeedMatch[] = [
  {
    id: 'm1',
    name: 'Emily Watson',
    role: 'Product Designer',
    avatar: '👩‍🎨',
    matchScore: 94,
    tags: ['UI/UX', 'Figma', 'No-code'],
    reason: 'Both of you want to build a FinTech app and need a product designer.',
    status: 'connected',
    icebreakers: [
      "Hi Emily! ConnectAI says we both love clean SaaS designs. What projects are you looking to join?",
      "Hey! Let's check out each other's portfolios. Are you available to team up?",
    ],
    messages: [
      { sender: 'them', text: 'Hey there! I saw we matched. Your backend stack sounds exactly like what I need for my FinTech idea!', time: '2 mins ago' },
      { sender: 'me', text: 'Awesome! I have been building vector search matching APIs. Let’s sit together near the stage?', time: '1 min ago' },
    ],
  },
  {
    id: 'm2',
    name: 'Marcus Brody',
    role: 'Growth Marketer',
    avatar: '👨‍💼',
    matchScore: 89,
    tags: ['SaaS', 'SEO', 'Lead Gen'],
    reason: 'Shared goals: Pitching to VC investors and finding first customers.',
    status: 'new',
    icebreakers: [
      "Hi Marcus! I see you specialize in SaaS growth. Let's discuss distribution strategies?",
      "Hey! Are you working on any B2B startups at the event?",
    ],
    messages: [],
  },
  {
    id: 'm3',
    name: 'David Vance',
    role: 'Solidity Dev',
    avatar: '👨‍💻',
    matchScore: 82,
    tags: ['Ethereum', 'DeFi', 'Rust'],
    reason: 'Both of you attended the Web3 London Meetup last autumn.',
    status: 'pending',
    icebreakers: [
      "Hey David, noticed you write smart contracts. Are you building on EVM chains today?",
    ],
    messages: [],
  },
];

export default function NetworkingFeed() {
  const [selectedMatchId, setSelectedMatchId] = useState<string>('m1');
  const [inputText, setInputText] = useState('');
  const [matches, setMatches] = useState<FeedMatch[]>(mockMatches);
  const [isTyping, setIsTyping] = useState(false);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  // Simulating typing indicator when switching matches
  useEffect(() => {
    if (selectedMatch.messages.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [selectedMatchId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add message
    const updated = matches.map((m) => {
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          messages: [
            ...m.messages,
            { sender: 'me' as const, text: inputText, time: 'Just now' }
          ]
        };
      }
      return m;
    });
    setMatches(updated);
    setInputText('');

    // Simulate auto response after 1.5 seconds
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMatches((current) => 
          current.map((m) => {
            if (m.id === selectedMatch.id) {
              return {
                ...m,
                messages: [
                  ...m.messages,
                  { sender: 'them' as const, text: 'Sounds perfect! Let’s meet at the networking lounge in 5 mins.', time: 'Just now' }
                ]
              };
            }
            return m;
          })
        );
      }, 1500);
    }, 1000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto glass rounded-3xl border border-white/50 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
      
      {/* Sidebar: Match List (4 cols) */}
      <div className="md:col-span-5 border-r border-white/30 p-4 flex flex-col gap-4 bg-white/20">
        <div className="flex items-center justify-between pb-3 border-b border-white/25">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Live Event Feed
          </h3>
          <span className="text-[10px] bg-secondary/25 text-secondary-dark px-2.5 py-0.5 rounded-full font-bold">
            18 Online
          </span>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
          {matches.map((match) => {
            const isSelected = match.id === selectedMatchId;
            return (
              <button
                key={match.id}
                onClick={() => setSelectedMatchId(match.id)}
                className={cn(
                  "w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer",
                  isSelected
                    ? "bg-white border-primary/20 shadow-md shadow-primary/5"
                    : "bg-white/40 border-transparent hover:bg-white/60 hover:border-white/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white to-gray-50 flex items-center justify-center text-xl shadow-sm">
                    {match.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      {match.name}
                      {match.status === 'new' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      )}
                    </span>
                    <span className="text-[10px] text-foreground/50">{match.role}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {match.matchScore}% Match
                  </span>
                  <span className="text-[8px] text-foreground/45 mt-1 capitalize">{match.status}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat / Details Panel (7 cols) */}
      <div className="md:col-span-7 flex flex-col bg-white/10 relative h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between bg-white/25">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/80 flex items-center justify-center text-2xl shadow-sm">
              {selectedMatch.avatar}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground">{selectedMatch.name}</span>
              <span className="text-[10px] text-foreground/50 font-medium">{selectedMatch.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold flex items-center gap-1">
              ✨ AI Match explanation
            </span>
          </div>
        </div>

        {/* Dynamic AI Match Rationale Badge */}
        <div className="m-3 p-3 bg-gradient-to-r from-primary/5 via-secondary/5 to-white border border-primary/10 rounded-2xl text-[11px] leading-relaxed text-foreground/75 flex items-start gap-2">
          <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary">Compatibility Reason:</span> {selectedMatch.reason}
          </div>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[220px]">
          {selectedMatch.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-foreground/50">
              <MessageCircle className="w-8 h-8 text-foreground/30 mb-2" />
              <span className="text-xs font-semibold">No messages yet.</span>
              <p className="text-[11px] max-w-xs mt-1">
                Select one of the custom AI-generated icebreakers below to initiate connection.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {selectedMatch.messages.map((msg, idx) => {
                const isMe = msg.sender === 'me';
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={idx}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      isMe ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed shadow-sm",
                        isMe
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-white/80 text-foreground border border-white/50 rounded-bl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-foreground/45 mt-1">{msg.time}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 max-w-[70%] mr-auto">
              <div className="bg-white/60 p-3 rounded-2xl rounded-bl-none border border-white/40 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* AI Icebreaker Suggestions */}
        <div className="p-3 border-t border-white/10 bg-white/20">
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-2 px-1 flex items-center gap-1">
            ✨ ConnectAI Icebreakers
          </span>
          <div className="flex flex-col gap-2">
            {selectedMatch.icebreakers.map((breaker, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(breaker);
                }}
                className="text-left bg-white/60 hover:bg-white border border-white/50 hover:border-primary/20 text-[10px] p-2.5 rounded-xl transition-all duration-200 cursor-pointer text-foreground/80 hover:text-foreground shadow-sm"
              >
                &ldquo;{breaker}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/20 bg-white/35 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 bg-white/50 border border-white/50 focus:border-primary/30 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/25 placeholder:text-foreground/40"
          />
          <button
            onClick={handleSendMessage}
            className="w-8 h-8 rounded-full bg-primary hover:bg-primary-light flex items-center justify-center text-white shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
