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
    // FIX 1: Changed `h-full` to `min-h-screen`. 
    // This ensures it fills the viewport exactly, but allows native scrolling on mobile.
    <div className="w-full min-h-screen max-w-7xl mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
      
      {/* FIX 2: Added `lg:max-h-[90vh]`. 
          On desktop, the card stops at 90% of the screen height, forcing the inside to scroll. 
          On mobile, we let it grow naturally so the whole browser window scrolls. */}
      <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl flex flex-col lg:flex-row lg:max-h-[90vh]">
        
        {/* Left Form Area */}
        {/* FIX 3: Added `min-h-0` to tell flexbox to allow internal scrolling */}
        <div className="flex-1 w-full overflow-y-auto min-h-0">
          
          {/* FIX 4: Removed 'm-auto' centering. 
              We now use a flex column with empty `flex-grow` spacers top and bottom. 
              This safely centers the form vertically if there's room, but prevents 
              the top from being cut off when you need to scroll. */}
          <div className="min-h-full flex flex-col p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex-grow" /> {/* Spacer top */}
            
            <div className="w-full max-w-2xl mx-auto relative z-10 py-4">
              {children}
            </div>
            
            <div className="flex-grow" /> {/* Spacer bottom */}
          </div>
        </div>

        {/* Right Character Area */}
        <div className="hidden lg:flex w-2/5 max-w-[500px] shrink-0 bg-slate-50 relative items-center justify-center overflow-hidden border-l border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-100/50" />
          <div className="relative w-full h-full flex items-center justify-center p-12 min-h-[400px]">
            <div 
              style={{
                width: '128px',
                height: '128px',
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: '1600% 100%',
                backgroundPosition: 'left center',
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