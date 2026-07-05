'use client';

import { motion, MotionValue, useTransform, useMotionValue } from 'framer-motion';

interface HeroIllustrationProps {
  scrollYProgress?: MotionValue<number>;
}

export default function HeroIllustration({ scrollYProgress }: HeroIllustrationProps) {
  // Fallback if scrollYProgress is not passed
  const dummyProgress = useMotionValue(0);
  const progress = scrollYProgress || dummyProgress;

  // Horizontal motion of attendee groups towards the center on scroll (0 -> 0.35)
  // Far-left group moves right
  const leftGroupX = useTransform(progress, [0, 0.35], [0, 160]);
  
  // Mid-left group moves slightly right
  const midLeftGroupX = useTransform(progress, [0, 0.35], [0, 80]);
  
  // Mid-right group moves slightly left
  const midRightGroupX = useTransform(progress, [0, 0.35], [0, -80]);
  
  // Far-right group moves left
  const rightGroupX = useTransform(progress, [0, 0.35], [0, -160]);

  // Network connection lines opacity (fades in as groups merge)
  const networkOpacity = useTransform(progress, [0.15, 0.35], [0, 1]);
  // Star sparkles scale & pulse
  const sparkleScale = useTransform(progress, [0.2, 0.35], [0, 1]);

  return (
    <div className="relative w-full h-full min-h-[450px] lg:min-h-[600px] flex items-center justify-center overflow-visible select-none">
      
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D7C8FF]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFB7A7]/20 rounded-full blur-3xl" />
      </div>

      {/* Panoramic SVG Scene matching user's image */}
      <svg
        viewBox="0 0 1100 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Glass panels gradient */}
          <linearGradient id="hallGlass" x1="0" y1="50" x2="1100" y2="380">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#E2D6FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFDED6" stopOpacity="0.2" />
          </linearGradient>

          {/* Glass white grid lining */}
          <linearGradient id="gridLine" x1="0" y1="0" x2="0" y2="380">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
          
          {/* Glowing node filter */}
          <filter id="badgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Connection Line Gradient */}
          <linearGradient id="networkLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B7EFF" />
            <stop offset="50%" stopColor="#FFAEC9" />
            <stop offset="100%" stopColor="#FF9E8C" />
          </linearGradient>

          {/* Banners gradients */}
          <linearGradient id="banner1Grad" x1="0" y1="0" x2="0" y2="200">
            <stop offset="0%" stopColor="#8B7EFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B7EFF" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="banner2Grad" x1="0" y1="0" x2="0" y2="200">
            <stop offset="0%" stopColor="#FF9E8C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF9E8C" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="banner3Grad" x1="0" y1="0" x2="0" y2="200">
            <stop offset="0%" stopColor="#FAF6EE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0.2" />
          </linearGradient>

          {/* Hair gradients */}
          <linearGradient id="hairDark" x1="0" y1="0" x2="0" y2="20">
            <stop offset="0%" stopColor="#2D2051" />
            <stop offset="100%" stopColor="#1E163B" />
          </linearGradient>
          <linearGradient id="hairLight" x1="0" y1="0" x2="0" y2="20">
            <stop offset="0%" stopColor="#C48E72" />
            <stop offset="100%" stopColor="#A26B50" />
          </linearGradient>
        </defs>

        {/* ================= BACKGROUND CONCLess HALL (Glass Building) ================= */}
        {/* Soft back-wall skyline */}
        <rect x="0" y="20" width="1100" height="380" rx="16" fill="#F0EAFF" fillOpacity="0.4" />
        
        {/* Distant mountains/sky clouds */}
        <path d="M 0 260 Q 200 210 500 270 T 1100 250 L 1100 400 L 0 400 Z" fill="#EAE2FF" opacity="0.4" />
        <path d="M 0 290 Q 300 240 700 290 T 1100 280 L 1100 400 L 0 400 Z" fill="#FFEAE5" opacity="0.5" />

        {/* Massive Glass Conference Hall Structure */}
        {/* Main curved glass body */}
        <path d="M 120 380 L 120 120 C 350 70, 750 70, 980 120 L 980 380 Z" fill="url(#hallGlass)" stroke="url(#gridLine)" strokeWidth="1.5" />
        
        {/* Structural vertical metal pillars */}
        <line x1="120" y1="120" x2="120" y2="380" stroke="#FFFFFF" strokeWidth="3" opacity="0.75" />
        <line x1="263" y1="102" x2="263" y2="380" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
        <line x1="406" y1="92" x2="406" y2="380" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
        <line x1="550" y1="88" x2="550" y2="380" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" />
        <line x1="693" y1="92" x2="693" y2="380" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
        <line x1="836" y1="102" x2="836" y2="380" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
        <line x1="980" y1="120" x2="980" y2="380" stroke="#FFFFFF" strokeWidth="3" opacity="0.75" />

        {/* Horizontal floor dividers (inside building) */}
        <path d="M 120 250 C 350 200, 750 200, 980 250" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.6" fill="none" />
        
        {/* Indoor silhouettes of attendees */}
        <g opacity="0.25">
          {/* First floor silhouettes */}
          <circle cx="200" cy="300" r="8" fill="#5243AA" />
          <path d="M 190 330 Q 200 310 210 330 Z" fill="#5243AA" />
          <circle cx="215" cy="298" r="7.5" fill="#5243AA" />
          <path d="M 205 330 Q 215 310 225 330 Z" fill="#5243AA" />
          
          <circle cx="480" cy="290" r="8" fill="#5243AA" />
          <path d="M 470 320 Q 480 300 490 320 Z" fill="#5243AA" />

          <circle cx="750" cy="295" r="8" fill="#5243AA" />
          <path d="M 740 325 Q 750 305 760 325 Z" fill="#5243AA" />

          {/* Second floor silhouettes */}
          <circle cx="340" cy="180" r="7" fill="#5243AA" />
          <path d="M 332 205 Q 340 190 348 205 Z" fill="#5243AA" />
          <circle cx="610" cy="175" r="7" fill="#5243AA" />
          <path d="M 602 200 Q 610 185 618 200 Z" fill="#5243AA" />
          <circle cx="625" cy="173" r="6.5" fill="#5243AA" />
          <path d="M 618 200 Q 625 185 632 200 Z" fill="#5243AA" />
        </g>

        {/* Diagonal architectural steel struts */}
        <path d="M 120 120 L 263 250 L 406 380" stroke="#ffffff" strokeWidth="2.5" opacity="0.3" fill="none" />
        <path d="M 980 120 L 836 250 L 693 380" stroke="#ffffff" strokeWidth="2.5" opacity="0.3" fill="none" />
        <path d="M 550 88 L 693 210 L 836 330" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" fill="none" />
        <path d="M 550 88 L 406 210 L 263 330" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" fill="none" />

        {/* Hanging Event Banners (from the facade) */}
        {/* Banner 1 (Left-Center): ConnectAI */}
        <g transform="translate(300, 105)" opacity="0.8">
          <path d="M 0 0 H 34 V 160 L 17 150 L 0 160 Z" fill="url(#banner1Grad)" />
          <text x="17" y="70" fill="#FFFFFF" opacity="0.8" fontSize="8" fontWeight="700" transform="rotate(90 17 70)" textAnchor="middle" letterSpacing="1">
            CONNECTAI
          </text>
        </g>
        {/* Banner 2 (Center): Hackathon */}
        <g transform="translate(480, 100)" opacity="0.8">
          <path d="M 0 0 H 34 V 170 L 17 160 L 0 170 Z" fill="url(#banner2Grad)" />
          <text x="17" y="75" fill="#FFFFFF" opacity="0.8" fontSize="8" fontWeight="700" transform="rotate(90 17 75)" textAnchor="middle" letterSpacing="1">
            HACKATHON
          </text>
        </g>
        {/* Banner 3 (Right-Center): Co-Founder */}
        <g transform="translate(620, 100)" opacity="0.8">
          <path d="M 0 0 H 34 V 170 L 17 160 L 0 170 Z" fill="url(#banner3Grad)" />
          <text x="17" y="75" fill="#8B7EFF" opacity="0.8" fontSize="8" fontWeight="700" transform="rotate(90 17 75)" textAnchor="middle" letterSpacing="1">
            TEAMMATES
          </text>
        </g>

        {/* Outdoor Landscaping Trees */}
        <g opacity="0.75" className="origin-bottom animate-sway-slow">
          <path d="M 60 380 Q 70 310 65 290" stroke="#A98DFF" strokeWidth="4.5" fill="none" />
          <circle cx="65" cy="275" r="24" fill="#D7C8FF" />
          <circle cx="85" cy="265" r="18" fill="#C5B4FA" />
          <circle cx="50" cy="285" r="16" fill="#B1A0FA" />
        </g>
        <g opacity="0.7" className="origin-bottom animate-sway-slow" style={{ animationDelay: '2s' }}>
          <path d="M 1030 380 Q 1020 310 1025 295" stroke="#FF9E8C" strokeWidth="4.5" fill="none" />
          <circle cx="1025" cy="280" r="24" fill="#FFC7BA" />
          <circle cx="1005" cy="270" r="18" fill="#FFA594" />
          <circle cx="1045" cy="285" r="15" fill="#FFDCD5" />
        </g>

        {/* Flat Open networking space paved floor */}
        <rect x="0" y="380" width="1100" height="140" fill="#FAF6EE" fillOpacity="0.9" />
        <line x1="0" y1="380" x2="1100" y2="380" stroke="#E2D8FF" strokeWidth="2.5" />

        {/* Ambient foliage at corners */}
        <path d="M 0 520 L 0 460 Q 40 470 60 520 Z" fill="#D7C8FF" opacity="0.6" />
        <path d="M 1100 520 L 1100 460 Q 1060 470 1040 520 Z" fill="#FFE5E0" opacity="0.7" />


        {/* ================= SCROLL Story GLOWING NETWORK LAYER ================= */}
        <motion.g style={{ opacity: networkOpacity }} filter="url(#badgeGlow)">
          {/* Main glowing arching network paths linking the converged badges */}
          <path d="M 330 460 Q 425 435 520 460" stroke="url(#networkLineGrad)" strokeWidth="3" fill="none" strokeDasharray="6 4" className="animate-dash" />
          <path d="M 520 460 Q 615 435 710 460" stroke="url(#networkLineGrad)" strokeWidth="3" fill="none" strokeDasharray="6 4" className="animate-dash" />
          <path d="M 330 460 Q 520 395 710 460" stroke="url(#networkLineGrad)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6" />
          
          {/* Inner connections */}
          <path d="M 400 460 Q 520 425 640 460" stroke="#FFAEC9" strokeWidth="2" fill="none" strokeDasharray="5 3" className="animate-dash" style={{ animationDirection: 'reverse' }} />
          <path d="M 465 460 Q 520 440 575 460" stroke="#FFD166" strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
        </motion.g>

        {/* --- GROUP 1 (FAR LEFT): Moves Right --- */}
        <motion.g style={{ x: leftGroupX }}>
          <g transform="translate(180, 395)">
            <path d="M 15 65 C 5 65 0 52 0 40 Q 5 25 20 25 Q 35 25 35 40 C 35 52 30 65 20 65 Z" fill="#8B7EFF" />
            <path d="M 10 32 L 25 32 L 27 50 L 8 50 Z" fill="#ffffff" opacity="0.3" />
            <rect x="15" y="44" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#8B7EFF" strokeWidth="0.5" />
            <rect x="16" y="16" width="6" height="12" fill="#FCE1D4" />
            <circle cx="19" cy="13" r="9.5" fill="#FCE1D4" />
            <path d="M 9 10 Q 18 2 27 9 Q 20 4 13 6 Z" fill="url(#hairDark)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="4.5" fill="#8B7EFF" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="2.2" fill="#FFFFFF" />
          </g>

          <g transform="translate(235, 400)">
            <path d="M 12 60 C 4 60 0 48 0 38 Q 4 23 18 23 Q 32 23 32 38 C 32 48 28 60 20 60 Z" fill="#FFAEC9" />
            <path d="M 8 28 L 22 28 L 24 45 L 6 45 Z" fill="#ffffff" opacity="0.3" />
            <rect x="13" y="39" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#FFAEC9" strokeWidth="0.5" />
            <rect x="14" y="15" width="5" height="10" fill="#FAD1C2" />
            <circle cx="16" cy="12" r="8.5" fill="#FAD1C2" />
            <path d="M 8 10 Q 16 0 24 10 Z" fill="url(#hairLight)" />
            <motion.circle style={{ scale: sparkleScale }} cx="16" cy="43" r="4.5" fill="#FFAEC9" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="16" cy="43" r="2.2" fill="#FFFFFF" />
          </g>
        </motion.g>

        {/* --- GROUP 2 (MID-LEFT): Moves Slightly Right --- */}
        <motion.g style={{ x: midLeftGroupX }}>
          <g transform="translate(370, 395)">
            <path d="M 15 65 C 5 65 0 52 0 40 Q 5 25 20 25 Q 35 25 35 40 C 35 52 30 65 20 65 Z" fill="#5243AA" />
            <path d="M 10 32 L 25 32 L 27 50 L 8 50 Z" fill="#ffffff" opacity="0.3" />
            <rect x="15" y="44" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#5243AA" strokeWidth="0.5" />
            <rect x="16" y="16" width="6" height="12" fill="#FAD1C2" />
            <circle cx="19" cy="13" r="9.5" fill="#FAD1C2" />
            <path d="M 9 10 Q 19 2 28 10 Z" fill="url(#hairDark)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="5.5" fill="#8B7EFF" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="2.5" fill="#FFFFFF" />
          </g>

          {/* Person D (Orange top, talking to Person C) */}
          <g transform="translate(425, 400)">
            <path d="M 12 60 C 4 60 0 48 0 38 Q 4 23 18 23 Q 32 23 32 38 C 32 48 28 60 20 60 Z" fill="#FF9E8C" />
            <path d="M 8 28 L 22 28 L 24 45 L 6 45 Z" fill="#ffffff" opacity="0.3" />
            <rect x="13" y="39" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#FF9E8C" strokeWidth="0.5" />
            <rect x="14" y="15" width="5" height="10" fill="#FCE1D4" />
            <circle cx="16" cy="12" r="8.5" fill="#FCE1D4" />
            <path d="M 7 10 Q 16 0 25 8 Z" fill="url(#hairLight)" />
            <motion.circle style={{ scale: sparkleScale }} cx="16" cy="43" r="5" fill="#FF9E8C" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="16" cy="43" r="2.2" fill="#FFFFFF" />
          </g>
        </motion.g>

        {/* --- GROUP 3 (MID-RIGHT): Moves Slightly Left --- */}
        <motion.g style={{ x: midRightGroupX }}>
          {/* Person E (Cream shirt, listening) */}
          <g transform="translate(615, 395)">
            <path d="M 15 65 C 5 65 0 52 0 40 Q 5 25 20 25 Q 35 25 35 40 C 35 52 30 65 20 65 Z" fill="#FAF6EE" stroke="#E2D8FF" strokeWidth="1" />
            <path d="M 10 32 L 25 32 L 27 50 L 8 50 Z" fill="#8B7EFF" opacity="0.3" />
            <rect x="15" y="44" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#FAF6EE" strokeWidth="0.5" />
            <rect x="16" y="16" width="6" height="12" fill="#FCE1D4" />
            <circle cx="19" cy="13" r="9.5" fill="#FCE1D4" />
            <path d="M 10 9 C 14 3 24 3 28 9 Z" fill="url(#hairDark)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="5" fill="#FFD166" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="2.2" fill="#FFFFFF" />
          </g>

          {/* Person F (Indigo sweater, gesturing) */}
          <g transform="translate(670, 395)">
            <path d="M 15 65 C 5 65 0 52 0 40 Q 5 25 20 25 Q 35 25 35 40 C 35 52 30 65 20 65 Z" fill="#8B7EFF" />
            <path d="M 10 32 L 25 32 L 27 50 L 8 50 Z" fill="#ffffff" opacity="0.3" />
            <rect x="15" y="44" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#8B7EFF" strokeWidth="0.5" />
            <rect x="16" y="16" width="6" height="12" fill="#FAD1C2" />
            <circle cx="19" cy="13" r="9.5" fill="#FAD1C2" />
            <path d="M 9 9 Q 18 1 27 9 Z" fill="url(#hairDark)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="5.5" fill="#8B7EFF" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="2.5" fill="#FFFFFF" />
          </g>
        </motion.g>

        {/* --- GROUP 4 (FAR RIGHT): Moves Left --- */}
        <motion.g style={{ x: rightGroupX }}>
          {/* Right Person G (Orange shirt, talking) */}
          <g transform="translate(810, 400)">
            <path d="M 12 60 C 4 60 0 48 0 38 Q 4 23 18 23 Q 32 23 32 38 C 32 48 28 60 20 60 Z" fill="#FF9E8C" />
            <path d="M 8 28 L 22 28 L 24 45 L 6 45 Z" fill="#ffffff" opacity="0.3" />
            <rect x="13" y="39" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#FF9E8C" strokeWidth="0.5" />
            <rect x="14" y="15" width="5" height="10" fill="#FAD1C2" />
            <circle cx="16" cy="12" r="8.5" fill="#FAD1C2" />
            <path d="M 7 11 Q 16 2 25 11 Z" fill="url(#hairLight)" />
            <motion.circle style={{ scale: sparkleScale }} cx="16" cy="43" r="4.5" fill="#FF9E8C" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="16" cy="43" r="2.2" fill="#FFFFFF" />
          </g>

          {/* Right Person H (Blue-grey suit, listening) */}
          <g transform="translate(865, 395)">
            <path d="M 15 65 C 5 65 0 52 0 40 Q 5 25 20 25 Q 35 25 35 40 C 35 52 30 65 20 65 Z" fill="#5243AA" />
            <path d="M 10 32 L 25 32 L 27 50 L 8 50 Z" fill="#ffffff" opacity="0.3" />
            <rect x="15" y="44" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#5243AA" strokeWidth="0.5" />
            <rect x="16" y="16" width="6" height="12" fill="#FCE1D4" />
            <circle cx="19" cy="13" r="9.5" fill="#FCE1D4" />
            <path d="M 10 10 C 13 4 25 4 28 10 Z" fill="url(#hairDark)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="5" fill="#8B7EFF" filter="url(#badgeGlow)" />
            <motion.circle style={{ scale: sparkleScale }} cx="18" cy="48" r="2.2" fill="#FFFFFF" />
          </g>
        </motion.g>


        {/* ================= GLOWING STARBURST INTERSECT SPARKLES ================= */}
        {/* Glow point 1 (Left connect node) */}
        <motion.g style={{ scale: sparkleScale, opacity: networkOpacity }} transform="translate(425, 450)">
          <circle cx="0" cy="0" r="14" fill="#ffffff" fillOpacity="0.45" filter="url(#badgeGlow)" />
          <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffffff" />
        </motion.g>

        {/* Glow point 2 (Center connect node) */}
        <motion.g style={{ scale: sparkleScale, opacity: networkOpacity }} transform="translate(550, 445)">
          <circle cx="0" cy="0" r="18" fill="#ffffff" fillOpacity="0.55" filter="url(#badgeGlow)" />
          <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#ffffff" />
        </motion.g>

        {/* Glow point 3 (Right connect node) */}
        <motion.g style={{ scale: sparkleScale, opacity: networkOpacity }} transform="translate(680, 450)">
          <circle cx="0" cy="0" r="14" fill="#ffffff" fillOpacity="0.45" filter="url(#badgeGlow)" />
          <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffffff" />
        </motion.g>
      </svg>

      {/* Embedded CSS Animations for Trees and Dash lines */}
      <style jsx global>{`
        @keyframes swaySlow {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.2deg); }
        }
        .animate-sway-slow {
          animation: swaySlow 9s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash {
          animation: dash 1.6s linear infinite;
        }
      `}</style>
    </div>
  );
}
