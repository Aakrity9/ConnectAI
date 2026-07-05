'use client';

import React, { useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/nextjs';

export const isMockAuthActive = () => {
  if (typeof window === 'undefined') return true;
  
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return !pubKey || pubKey.includes('mock') || pubKey === '';
};

export function useAppAuth() {
  const [mockUser, setMockUser] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMockUser(localStorage.getItem('mockUser'));
      setIsLoaded(true);
    }
  }, []);

  if (isMockAuthActive()) {
    return {
      isLoaded: isLoaded,
      isSignedIn: !!mockUser,
      userId: mockUser || null,
      getToken: async () => mockUser || 'mock-user-123',
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkAuth = useClerkAuth();
  return {
    isLoaded: clerkAuth.isLoaded,
    isSignedIn: clerkAuth.isSignedIn,
    userId: clerkAuth.userId,
    getToken: clerkAuth.getToken,
  };
}

export function useAppUser() {
  const [mockUser, setMockUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mockUser');
      if (stored) {
        setMockUser({
          id: stored,
          firstName: 'Ananya',
          lastName: 'Sharma',
          imageUrl: '',
          emailAddresses: [{ emailAddress: 'ananya@example.com' }],
        });
      }
      setIsLoaded(true);
    }
  }, []);

  if (isMockAuthActive()) {
    return {
      isLoaded: isLoaded,
      isSignedIn: !!mockUser,
      user: mockUser,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkUser = useClerkUser();
  return clerkUser;
}

export function AppSignInButton({ children, mode }: { children: React.ReactNode; mode?: 'modal' | 'redirect' }) {
  const handleClick = (e: React.MouseEvent) => {
    if (isMockAuthActive()) {
      e.preventDefault();
      localStorage.setItem('mockUser', 'mock-user-123');
      window.location.href = '/dashboard';
    }
  };

  return <div onClick={handleClick} className="inline-block cursor-pointer">{children}</div>;
}

export function AppSignUpButton({ children, mode }: { children: React.ReactNode; mode?: 'modal' | 'redirect' }) {
  const handleClick = (e: React.MouseEvent) => {
    if (isMockAuthActive()) {
      e.preventDefault();
      localStorage.setItem('mockUser', 'mock-user-123');
      window.location.href = '/onboarding';
    }
  };

  return <div onClick={handleClick} className="inline-block cursor-pointer">{children}</div>;
}

export function AppUserButton() {
  const [active, setActive] = useState(false);

  if (!isMockAuthActive()) {
    const { UserButton } = require('@clerk/nextjs');
    return <UserButton />;
  }

  const handleLogout = () => {
    localStorage.removeItem('mockUser');
    window.location.href = '/';
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setActive(!active)} 
        className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-pointer shadow"
      >
        A
      </button>
      {active && (
        <div className="absolute right-0 bottom-12 w-32 bg-white glass border border-foreground/10 rounded-xl shadow-lg p-2 flex flex-col z-50">
          <button 
            onClick={handleLogout}
            className="text-[10px] text-red-500 font-bold hover:bg-red-50 p-2 rounded-lg text-left cursor-pointer"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
