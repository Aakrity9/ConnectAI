'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppAuth as useAuth, useAppUser as useUser } from '@/lib/auth';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { GlassCard, PremiumButton, Badge } from '@/components/ui-custom';

export default function Onboarding() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    college: '',
    company: '',
    degree: '',
    experience: '',
    skills: '',
    interests: '',
    careerGoals: '',
    hobbies: '',
    availability: '',
    lookingFor: [] as string[],
    startupInterest: false,
    hackathonInterest: false,
    attendingSolo: true,
  });

  // Populate Name & Photo from Clerk once loaded
  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.fullName || '',
        photo: prev.photo || user.imageUrl || '',
      }));
    }
  }, [isLoaded, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: 'startupInterest' | 'hackathonInterest' | 'attendingSolo', checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleLookingForToggle = (option: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.lookingFor.includes(option);
      if (alreadySelected) {
        return { ...prev, lookingFor: prev.lookingFor.filter((o) => o !== option) };
      } else {
        return { ...prev, lookingFor: [...prev.lookingFor, option] };
      }
    });
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Parse comma-separated strings to arrays
      const formattedData = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map((i) => i.trim()).filter(Boolean),
        careerGoals: formData.careerGoals.split(',').map((g) => g.trim()).filter(Boolean),
        hobbies: formData.hobbies.split(',').map((h) => h.trim()).filter(Boolean),
      };

      try {
        const res = await fetch(`${apiUrl}/api/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formattedData),
        });

        if (!res.ok) {
          throw new Error('Failed to update profile');
        }
      } catch (fetchErr) {
        console.warn('Backend server offline. Saving profile to localStorage fallback.');
        localStorage.setItem('mockProfile', JSON.stringify(formattedData));
      }

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const lookingForOptions = ['Mentor', 'Co-founder', 'Team', 'Friends', 'Investors'];

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-16 flex flex-col justify-center min-h-screen">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold">Build your AI Profile</h1>
        <p className="text-sm text-foreground/75 mt-1">Tell us who you are so we can match you with the right attendees.</p>
      </div>

      <GlassCard className="relative overflow-hidden">
        
        {/* Step Indicator Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral/10">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="pt-4 flex flex-col gap-6">

          {/* STEP 1: Basic Profile Details */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold mb-2">Step 1: The Basics</h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">College / Institution</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. IIT Delhi"
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Current Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Degree / Major</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech CS"
                    className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Experience Summary</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2 years build/product engineering"
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Hackathon & Startup Alignment */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-semibold mb-2">Step 2: Event Intentions</h2>
              
              <div className="flex items-center justify-between p-4 rounded-2xl glass-dark/5 border border-primary/10">
                <div>
                  <h3 className="font-semibold text-sm">Startup Founder Interest</h3>
                  <p className="text-xs text-foreground/70">Are you looking to join or build a startup team?</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.startupInterest}
                  onChange={(e) => handleCheckboxChange('startupInterest', e.target.checked)}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl glass-dark/5 border border-primary/10">
                <div>
                  <h3 className="font-semibold text-sm">Hackathon Participant</h3>
                  <p className="text-xs text-foreground/70">Are you attending to participate in the hackathon?</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hackathonInterest}
                  onChange={(e) => handleCheckboxChange('hackathonInterest', e.target.checked)}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl glass-dark/5 border border-primary/10">
                <div>
                  <h3 className="font-semibold text-sm">Attending Solo</h3>
                  <p className="text-xs text-foreground/70">Check this if you came alone and want quick matches.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.attendingSolo}
                  onChange={(e) => handleCheckboxChange('attendingSolo', e.target.checked)}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Tags Input (Skills, Interests, Hobbies) */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold mb-2">Step 3: Skills & Interests</h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Next.js, Python, Figma"
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Interests (Comma-separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. AI Agents, Generative AI, UX Design"
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Hobbies (Comma-separated)</label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  placeholder="e.g. Chess, Hiking, Photography"
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Career Goals / Pitch (One-liner)</label>
                <textarea
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  placeholder="e.g. Co-found an early stage AI-first EdTech startup."
                  rows={2}
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Looking For & Availability */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold mb-2">Step 4: Looking For & Availability</h2>
              
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-foreground/80">I am looking to meet:</label>
                <div className="flex flex-wrap gap-2">
                  {lookingForOptions.map((option) => {
                    const isSelected = formData.lookingFor.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleLookingForToggle(option)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-primary border-primary text-white shadow-sm'
                            : 'border-primary/20 hover:border-primary/40'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-semibold text-foreground/80">Availability at the Event</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g. Full-time, Weekends, Evening hours"
                  className="px-4 py-2.5 rounded-xl border border-primary/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/45"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between border-t border-foreground/10 pt-6 mt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1 text-sm font-semibold text-foreground/70 hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <PremiumButton
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 !px-5 !py-2.5 !text-sm"
              >
                Next <ArrowRight className="w-4 h-4" />
              </PremiumButton>
            ) : (
              <PremiumButton
                type="submit"
                className="flex items-center gap-1.5 !px-6 !py-2.5 !text-sm"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Complete <Check className="w-4 h-4" />
                  </>
                )}
              </PremiumButton>
            )}
          </div>

        </form>
      </GlassCard>
    </div>
  );
}
