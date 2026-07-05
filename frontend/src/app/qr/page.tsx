'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppAuth as useAuth } from '@/lib/auth';
import { Loader2, ArrowLeft, QrCode, User, Check, Send, Sparkles, PhoneCall, Copy, Camera } from 'lucide-react';
import { GlassCard, PremiumButton, Badge } from '@/components/ui-custom';

export default function QRView() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const [submittingScan, setSubmittingScan] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      try {
        const res = await fetch(`${apiUrl}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to load profile');
        }

        const data = await res.json();
        setProfile(data);
      } catch (fetchErr) {
        console.warn('Backend server offline. Loading profile from localStorage fallback.');
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
          };
          setProfile(defaultProfile);
          localStorage.setItem('mockProfile', JSON.stringify(defaultProfile));
        }
      }
    } catch (err) {
      console.error(err);
      router.push('/onboarding');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCopyLink = () => {
    if (!profile) return;
    const profileLink = `${window.location.origin}/connect?id=${profile.id}`;
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanUrl) return;

    setSubmittingScan(true);
    try {
      // Extract profile ID from the URL or text input
      // Supports url format: http://localhost:3000/connect?id=PROFILE_ID or just PROFILE_ID directly
      let targetProfileId = scanUrl.trim();
      if (scanUrl.includes('id=')) {
        targetProfileId = scanUrl.split('id=')[1].split('&')[0];
      }

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
        throw new Error(errorData.message || 'Failed to connect');
      }

      setScanSuccess(true);
      setScanUrl('');
      setTimeout(() => setScanSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to verify exchange code');
    } finally {
      setSubmittingScan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Generate QR Code URL using api.qrserver.com
  const profileLink = profile ? `${window.location.origin}/connect?id=${profile.id}` : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileLink)}&color=6d5cff`;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col gap-6">
      
      <div>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-foreground cursor-pointer mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Matches
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Contact Exchange</h1>
        <p className="text-sm text-foreground/75 mt-1">Scan another attendee's QR code or present your digital business card to swap links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-4">
        
        {/* PRESENT CARD PANEL */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold flex items-center gap-1.5"><QrCode className="w-5 h-5 text-primary" /> Present Your Card</h2>
          
          <GlassCard className="flex flex-col items-center gap-5 text-center p-8 border-primary/20">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-gradient-to-tr from-gradient-start to-gradient-end flex items-center justify-center text-white text-xl font-bold mb-1">
              {profile?.name?.[0] || 'U'}
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{profile?.name}</h3>
              <p className="text-xs text-foreground/70">{profile?.degree || 'Attendee'}</p>
              {profile?.college && (
                <p className="text-xs text-foreground/60 mt-0.5">{profile.college}</p>
              )}
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-3xl shadow-md border border-primary/10">
              <img 
                src={qrCodeUrl} 
                alt="Profile Connection QR Code" 
                className="w-44 h-44"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <PremiumButton onClick={handleCopyLink} variant="glass" className="w-full flex items-center justify-center gap-1.5 !py-2.5 !text-xs">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" /> Copied Link!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Profile URL
                  </>
                )}
              </PremiumButton>
            </div>
          </GlassCard>
        </div>

        {/* SCAN CARD / EXCHANGE PANEL */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold flex items-center gap-1.5"><Camera className="w-5 h-5 text-secondary" /> Scan or Enter Code</h2>
          
          <GlassCard className="flex flex-col gap-5 p-6 border-secondary/20 min-h-[300px] justify-center">
            <div className="text-center pb-2 border-b border-foreground/10">
              <Sparkles className="w-8 h-8 text-secondary/70 mx-auto mb-2 animate-pulse" />
              <h3 className="font-semibold">Instant Exchange</h3>
              <p className="text-xs text-foreground/70 mt-1">Paste your peer's profile URL or scanner text string to add them.</p>
            </div>

            {scanSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-700 p-3 rounded-2xl text-xs text-center flex items-center justify-center gap-1.5 animate-bounce">
                <Check className="w-4 h-4" /> Connection Request Swapped Successfully!
              </div>
            )}

            <form onSubmit={handleManualScanSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Attendee Exchange Code / Profile URL</label>
                <input
                  type="text"
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                  placeholder="Paste URL (e.g. http://.../connect?id=...) or ID"
                  className="px-4 py-2.5 rounded-xl border border-secondary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-secondary/45 text-xs"
                  required
                />
              </div>

              <PremiumButton
                type="submit"
                disabled={submittingScan || !scanUrl}
                className="w-full flex items-center justify-center gap-1.5 !py-2.5 !text-xs !bg-secondary !shadow-secondary/25"
              >
                {submittingScan ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Exchange Contact <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </PremiumButton>
            </form>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
