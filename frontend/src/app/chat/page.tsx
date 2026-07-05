'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppAuth as useAuth } from '@/lib/auth';
import { io, Socket } from 'socket.io-client';
import { 
  Loader2, ArrowLeft, Send, Sparkles, MessageSquare, Heart 
} from 'lucide-react';
import { GlassCard, PremiumButton, Badge } from '@/components/ui-custom';

function ChatContent() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const urlContactId = searchParams.get('contactId');

  const [connections, setConnections] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchConnections = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/api/connections/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to load connections');
      const data = await res.json();
      setConnections(data);

      if (urlContactId) {
        const matchingContact = data.find((c: any) => c.id === urlContactId);
        if (matchingContact) {
          setSelectedContact(matchingContact);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [urlContactId]);

  useEffect(() => {
    let activeSocket: Socket;

    const setupSocket = async () => {
      const token = await getToken();
      activeSocket = io(apiUrl, {
        auth: { token },
        query: { token },
      });

      activeSocket.on('connect', () => {
        console.log('Connected to Chat WebSocket Gateway');
      });

      activeSocket.on('message', (message: any) => {
        if (selectedContact && (message.senderId === selectedContact.id || message.receiverId === selectedContact.id)) {
          setMessages((prev) => [...prev, message]);
        }
      });

      activeSocket.on('messageSent', (message: any) => {
        if (selectedContact && message.receiverId === selectedContact.id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      activeSocket.on('typing', (data: { senderId: string; isTyping: boolean }) => {
        if (selectedContact && data.senderId === selectedContact.id) {
          setIsPeerTyping(data.isTyping);
        }
      });

      setSocket(activeSocket);
    };

    setupSocket();

    return () => {
      if (activeSocket) {
        activeSocket.disconnect();
      }
    };
  }, [selectedContact]);

  useEffect(() => {
    if (!selectedContact) return;

    const loadHistory = async () => {
      setLoadingHistory(true);
      setMessages([]);
      try {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/api/chat/${selectedContact.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load chat history');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    };

    const loadIcebreakers = async () => {
      setLoadingIcebreakers(true);
      setIcebreakers([]);
      try {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/api/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const matches = await res.json();
          const activeMatch = matches.find((m: any) => m.profile.id === selectedContact.id);
          if (activeMatch && activeMatch.icebreakers) {
            setIcebreakers(activeMatch.icebreakers);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingIcebreakers(false);
      }
    };

    loadHistory();
    loadIcebreakers();
    setIsPeerTyping(false);
  }, [selectedContact]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isPeerTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !selectedContact) return;

    socket.emit('sendMessage', {
      receiverId: selectedContact.id,
      content: messageInput.trim(),
    });

    socket.emit('typing', {
      receiverId: selectedContact.id,
      isTyping: false,
    });

    setMessageInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (!socket || !selectedContact) return;

    socket.emit('typing', {
      receiverId: selectedContact.id,
      isTyping: true,
    });

    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      socket.emit('typing', {
        receiverId: selectedContact.id,
        isTyping: false,
      });
    }, 2000);

    setTypingTimeout(timeout);
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col justify-between h-[85vh]">
      <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-foreground cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-xs text-foreground/50">WebSocket Real-Time Gateway active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 items-stretch mt-4 overflow-hidden">
        <div className="md:col-span-4 flex flex-col gap-4 border-r border-foreground/5 pr-4 overflow-y-auto">
          <h2 className="text-base font-semibold flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-primary" /> Active Chats</h2>
          {loadingContacts ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : connections.length === 0 ? (
            <p className="text-xs text-foreground/70 py-6 text-center">Swap business cards to unlock connections!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {connections.map((c) => {
                const isSelected = selectedContact && selectedContact.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary/20 shadow-sm'
                        : 'border-transparent hover:bg-neutral/40 hover:border-foreground/5'
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                        {c.name?.[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm leading-none">{c.name}</h4>
                        <p className="text-[10px] text-foreground/60 mt-1 truncate max-w-[150px]">{c.degree || 'Attendee'}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="md:col-span-8 flex flex-col gap-4 overflow-hidden h-full">
          {selectedContact ? (
            <GlassCard className="flex-1 flex flex-col justify-between p-4 border-primary/10 overflow-hidden h-full">
              <div className="border-b border-foreground/10 pb-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gradient-start to-gradient-end overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                    {selectedContact.name?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none">{selectedContact.name}</h3>
                    <span className="text-[10px] text-green-500 font-medium">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-3">
                {loadingHistory ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-65 p-6">
                    <Heart className="w-8 h-8 text-primary mb-2 animate-pulse" />
                    <p className="text-xs font-medium">No messages yet. Send a message to break the ice!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isOwn = msg.senderId !== selectedContact.id;
                    return (
                      <div
                        key={msg.id || i}
                        className={`flex flex-col max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isOwn
                            ? 'bg-primary text-white self-end rounded-tr-none'
                            : 'bg-white border border-primary/10 text-foreground self-start rounded-tl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    );
                  })
                )}

                {isPeerTyping && (
                  <div className="bg-white/40 border border-foreground/5 text-foreground/70 self-start rounded-2xl rounded-tl-none p-2.5 text-[10px] italic flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> {selectedContact.name} is typing...
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              <div className="flex-shrink-0 pt-3 border-t border-foreground/10 flex flex-col gap-3">
                {icebreakers.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-primary flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Icebreakers:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                      {icebreakers.map((ice, i) => (
                        <button
                          key={i}
                          onClick={() => setMessageInput(ice)}
                          className="text-[10px] text-foreground bg-white border border-primary/20 hover:border-primary/50 hover:bg-primary/5 px-2.5 py-1 rounded-full text-left transition-colors cursor-pointer"
                        >
                          {ice}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder={`Write a message to ${selectedContact.name}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45 text-xs"
                    required
                  />
                  <PremiumButton
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="!px-4 !py-2.5 !text-xs flex items-center gap-1"
                  >
                    Send <Send className="w-3 h-3" />
                  </PremiumButton>
                </form>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="flex-1 flex flex-col items-center justify-center text-center p-8 border-foreground/5 h-full">
              <MessageSquare className="w-12 h-12 text-primary/40 mb-3 animate-pulse" />
              <h3 className="font-bold text-lg">Your Conversations</h3>
              <p className="text-sm text-foreground/70 mt-1 max-w-xs">Select a contact from the active list to start messaging in real-time.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatView() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs text-foreground/75 mt-3">Connecting to real-time chat...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
