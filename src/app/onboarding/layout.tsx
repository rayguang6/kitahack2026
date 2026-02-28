"use client";

import { useSimulation } from "@/context/SimulationContext";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { gender, occupationType } = useSimulation();

  let avatarImage = "/images/avatars/male-working.png";
  if (gender === "Female") {
    avatarImage = occupationType === "Student" 
      ? "/images/avatars/female-student.png" 
      : "/images/avatars/female-working.png";
  } else {
    avatarImage = occupationType === "Student" 
      ? "/images/avatars/male-student.png" 
      : "/images/avatars/male-working.png";
  }

  return (
    <div className="min-h-screen bg-white flex items-stretch p-4 sm:p-8">
      <div className="w-full flex bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl">
        
        {/* Left Form Area */}
        <div className="flex-1 p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center overflow-y-auto">
          {children}
        </div>

        {/* Right Character Area */}
        <div className="hidden lg:flex w-[400px] xl:w-[500px] shrink-0 bg-slate-50 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-100/50" />
          <div className="relative w-full h-full flex items-center justify-center p-12">
            <div 
              style={{
                width: '128px', // scaled up 4x from 32px
                height: '128px',
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: '1600% 100%', // 16 frames means 1600% width
                backgroundPosition: 'left center', // First frame
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated'
              }} 
              className="drop-shadow-2xl transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}
