"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import { usePathname } from "next/navigation";
import { Sprite, Direction } from "./Sprite";

const MAP_COLS = 20;
const MAP_ROWS = 12;

const MAP_ZONES = [
  // Your house – center of the map
  { id: "home", name: "🏠 My Home", x: 7, y: 1, w: 6, h: 5, color: "bg-blue-500/30", border: "border-blue-400" },
  // Office – right side (resized to 4x4 and moved higher)
  { id: "office", name: "🏢 Office", x: 15, y: 1, w: 4, h: 4, color: "bg-slate-500/30", border: "border-slate-500" },
  // Cafe – bottom-right
  { id: "cafe", name: "☕ Cafe", x: 15, y: 7, w: 4, h: 4, color: "bg-orange-500/30", border: "border-orange-500" },
  // Park – bottom-center
  { id: "park", name: "🌳 Park", x: 7, y: 7, w: 6, h: 4, color: "bg-emerald-500/30", border: "border-emerald-500" },
];

// 5 predefined friend house positions – Stacked vertically on the left
// Coordinates as requested: (1,1), (1,3), (1,5), (1,7), (1,9)
const FRIEND_HOUSE_POSITIONS = [
  { x: 1, y: 1 },
  { x: 1, y: 3 },
  { x: 1, y: 5 },
  { x: 1, y: 7 },
  { x: 1, y: 10 },
];

export const MAP_LOCATIONS = {
  HOME_SPAWN: { x: 10, y: 3 }, // Center of the rug
  OFFICE: { x: 17, y: 3 },     // Center of the office
  DESK: { x: 8, y: 2 },       // At the computer desk
  HOBBY: { x: 8, y: 4 },  // for implement hobby
  CAFE: { x: 17, y: 9 },       // Inside the cafe area
  BED: { x: 11, y: 2 },        // On the bed
};

export function GameMap() {
  const pathname = usePathname();
  const { 
    gender, occupationType, phase, isSimulating, workProgress, workDone, setWorkDone, friends,
    gamePhase, selectedAction, setGamePhase, setActionOutcome, skillTags, setSkillTags, activities
  } = useSimulation();
  
  const [playerPos, setPlayerPos] = useState({ x: 10, y: 3 }); // Start at home (center shifted)
  const [playerDir, setPlayerDir] = useState<Direction>("down");
  const [isMoving, setIsMoving] = useState(false);
  const [returningHome, setReturningHome] = useState(false);
  
  // Responsive dimensions instead of absolute scale
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const prevPosRef = useRef(playerPos);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic avatar path based on character selection
  const avatarImageSrc = useMemo(() => {
    const g = gender?.toLowerCase() || "male";
    const o = occupationType?.toLowerCase() || "working";
    return `/images/avatars/${g}-${o}.png`;
  }, [gender, occupationType]);

  // Responsive dynamic tiles to fit map within screen exactly
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;
        
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const tileSize = Math.min(
    dimensions.width / MAP_COLS,
    dimensions.height / MAP_ROWS
  );

  const tileWidth = dimensions.width > 0 ? tileSize : 0;
  const tileHeight = dimensions.height > 0 ? tileSize : 0;

  // Update facing direction automatically based on position changes
  useEffect(() => {
    const prev = prevPosRef.current;
    if (playerPos.x !== prev.x || playerPos.y !== prev.y) {
      const dx = playerPos.x - prev.x;
      const dy = playerPos.y - prev.y;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        setPlayerDir(dx > 0 ? "right" : "left");
      } else {
        setPlayerDir(dy > 0 ? "down" : "up");
      }
      prevPosRef.current = playerPos;
    }
  }, [playerPos]);

  // Command to move the player to a target location within bounds
  const moveTo = useCallback((targetX: number, targetY: number) => {
    setPlayerPos((prev) => {
      const boundedX = Math.max(0, Math.min(MAP_COLS - 1, targetX));
      const boundedY = Math.max(0, Math.min(MAP_ROWS - 1, targetY));
      
      if (prev.x === boundedX && prev.y === boundedY) return prev;
      return { x: boundedX, y: boundedY };
    });
  }, []);

  // Automate player movement based on simulation step
  useEffect(() => {
    if (pathname === "/" || pathname?.startsWith("/onboarding")) {
      moveTo(MAP_LOCATIONS.HOME_SPAWN.x, MAP_LOCATIONS.HOME_SPAWN.y); // Spawn at home center
    } else if (pathname === "/game") {
      if (phase === "work" && isSimulating && !returningHome) {
        // Walk to office when work starts
        moveTo(MAP_LOCATIONS.OFFICE.x, MAP_LOCATIONS.OFFICE.y); // Office center
      } else if (phase === "work" && !isSimulating && workProgress >= 100 && !workDone) {
        // Work finished - walk back home
        setReturningHome(true);
        moveTo(MAP_LOCATIONS.HOME_SPAWN.x, MAP_LOCATIONS.HOME_SPAWN.y); // Walk back home
      } else if (phase === "freeTime") {
        if (gamePhase === "simulating" && selectedAction) {
           const activityCategory = activities?.find(a => a.id === selectedAction.categoryId)?.category || selectedAction.type;
           
           if (activityCategory === "skill" || selectedAction.type === "learning" || selectedAction.type === "coding") {
              moveTo(MAP_LOCATIONS.DESK.x, MAP_LOCATIONS.DESK.y); // desk at home
           } else if (activityCategory === "hobby" || selectedAction.type === "hobby") {
              moveTo(MAP_LOCATIONS.HOBBY.x, MAP_LOCATIONS.HOBBY.y); // Just outside the house door
           } else if (activityCategory === "social" || selectedAction.type === "social") {
              const friendIndex = friends.findIndex(f => f.id === selectedAction.categoryId);
              if (friendIndex >= 0 && friendIndex < FRIEND_HOUSE_POSITIONS.length) {
                 moveTo(FRIEND_HOUSE_POSITIONS[friendIndex].x + 2, FRIEND_HOUSE_POSITIONS[friendIndex].y);
              } else {
                 moveTo(MAP_LOCATIONS.CAFE.x, MAP_LOCATIONS.CAFE.y); // Cafe fallback
              }
           } else {
              moveTo(MAP_LOCATIONS.CAFE.x, MAP_LOCATIONS.CAFE.y); // Cafe fallback
           }
        } else {
          moveTo(MAP_LOCATIONS.HOME_SPAWN.x, MAP_LOCATIONS.HOME_SPAWN.y); // Stay home for free time initially
        }
      } else if (phase === "sleep") {
        moveTo(MAP_LOCATIONS.BED.x, MAP_LOCATIONS.BED.y); // Bed coordinate inside home
      }
    }
  }, [pathname, moveTo, phase, isSimulating, workProgress, workDone, returningHome, gamePhase, selectedAction, activities, friends]);

  // Evaluation is now handled in page.tsx after workProgress reaches 100

  // Detect arrival back home after work
  useEffect(() => {
    if (returningHome && !isMoving && phase === "work") {
      // Character arrived home after work
      setReturningHome(false);
      setWorkDone(true);
    }
  }, [returningHome, isMoving, phase, setWorkDone]);

  // Idle behavior system (deterministic sequence while stationary)
  const [currentIdleAction, setCurrentIdleAction] = useState(false);
  const idleSequenceRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isMoving) {
      setCurrentIdleAction(false);
      if (idleSequenceRef.current) clearTimeout(idleSequenceRef.current);
      return;
    }

    const runSequence = async () => {
      // 1. Action Animation (3s)
      setPlayerDir("down");
      setCurrentIdleAction(true);
      await new Promise(r => { idleSequenceRef.current = setTimeout(r, 3000); });
      if (isMoving) return;

      // 2. Pause (1.5s)
      setCurrentIdleAction(false);
      await new Promise(r => { idleSequenceRef.current = setTimeout(r, 1500); });
      if (isMoving) return;

      // 3. Turn Left (1s)
      setPlayerDir("left");
      await new Promise(r => { idleSequenceRef.current = setTimeout(r, 1000); });
      if (isMoving) return;

      // 4. Turn Right (1s)
      setPlayerDir("right");
      await new Promise(r => { idleSequenceRef.current = setTimeout(r, 1000); });
      if (isMoving) return;

      // 5. Reset to Down and Loop
      setPlayerDir("down");
      runSequence();
    };

    runSequence();

    return () => {
      if (idleSequenceRef.current) clearTimeout(idleSequenceRef.current);
    };
  }, [isMoving]);

  const [showCoordinates, setShowCoordinates] = useState(false);

  // Keyboard shortcut to toggle grid
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g') {
        setShowCoordinates(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Allow clicking on the map to move there (for testing or game mechanics)
  const handleMapClick = (e: React.MouseEvent) => {
    if (tileWidth === 0 || tileHeight === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileWidth);
    const y = Math.floor((e.clientY - rect.top) / tileHeight);
    moveTo(x, y);
  };

  // Friend idle direction cycling
  const [friendIdleDir, setFriendIdleDir] = useState<Direction>("down");
  useEffect(() => {
    const dirs: Direction[] = ["down", "left", "down", "right"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % dirs.length;
      setFriendIdleDir(dirs[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-0 flex items-center justify-center overflow-hidden transition-colors duration-1000 ${
        phase === "sleep" ? "bg-slate-950" : "bg-slate-900"
      }`} 
    >
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
      
      {/* The Map */}
      <div 
        className="relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] z-10"
        style={{
          width: tileWidth * MAP_COLS,
          height: tileHeight * MAP_ROWS,
          backgroundImage: "url('/images/backgrounds/game-map.png')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }}
        onClick={handleMapClick}
      >
        {/* Map Zone Labels (Minimalist) */}
        {MAP_ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`absolute flex flex-col items-start justify-start p-2 z-0 pointer-events-none transition-all duration-300`}
            style={{
              left: zone.x * tileWidth,
              top: zone.y * tileHeight,
              width: zone.w * tileWidth,
              height: zone.h * tileHeight,
            }}
          >
            <span className="text-white text-[10px] uppercase tracking-wider font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/20 px-2 py-0.5 rounded-sm flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
              {zone.name}
            </span>
          </div>
        ))}

        {/* Friend Houses & Sprites */}
        <AnimatePresence>
          {FRIEND_HOUSE_POSITIONS.map((pos, index) => {
            const friend = friends[index];
            const friendAvatar = friend 
              ? `/images/avatars/${friend.gender.toLowerCase()}${index + 1}.png`
              : null;
            
            return (
              <div
                key={`friend-house-${index}`}
                className="absolute z-[5] pointer-events-none"
                style={{
                  left: pos.x * tileWidth,
                  top: pos.y * tileHeight,
                  width: tileWidth * 2,
                  height: tileHeight * 2, // Updated to 2 tiles high to match art
                }}
              >
                {/* Minimalist friend name label */}
                <div className="absolute -top-1 left-0 whitespace-nowrap z-10">
                  <span className={`text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-sm ${
                    friend ? 'text-white bg-pink-600/40 backdrop-blur-sm' : 'text-white/20 bg-slate-700/20'
                  }`}>
                    {friend ? friend.name : `Free Plot`}
                  </span>
                </div>

                {/* Friend sprite - Positioned on the RIGHT tile of the 2x1 lot */}
                {friend && friendAvatar && (
                  <div 
                    className="absolute flex items-center justify-center"
                    style={{
                      left: tileWidth, // Shifted to right tile
                      top: 0,
                      width: tileWidth,
                      height: tileHeight,
                    }}
                  >
                    <Sprite
                      src={friendAvatar}
                      direction={friendIdleDir}
                      isMoving={false}
                      isAction={false}
                      size={Math.min(tileWidth, tileHeight) * 0.9}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </AnimatePresence>

        {/* Night Overlay */}
        <div 
          className={`absolute inset-0 pointer-events-none z-[8] transition-opacity duration-1000 ${
            phase === "sleep" ? "opacity-60" : "opacity-0"
          } bg-indigo-950/40 mix-blend-multiply`}
        />

        {/* Dynamic Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: `${tileWidth}px ${tileHeight}px`,
            backgroundPosition: "top left"
          }}
        />

        {/* Coordinate Overlay */}
        {showCoordinates && (
          <div className="absolute inset-0 pointer-events-none select-none">
            {Array.from({ length: MAP_ROWS }).map((_, y) => (
              <div key={y} className="flex" style={{ height: tileHeight }}>
                {Array.from({ length: MAP_COLS }).map((_, x) => (
                  <div 
                    key={`${x}-${y}`} 
                    className="border-[0.5px] border-white/5 flex items-center justify-center text-[8px] text-white/20 font-mono"
                    style={{ width: tileWidth, height: tileHeight }}
                  >
                    {x},{y}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Player Character */}
        {dimensions.width > 0 && (
          <motion.div
            className="absolute flex items-center justify-center drop-shadow-md z-10 pointer-events-none"
            initial={false}
            animate={{
              x: playerPos.x * tileWidth,
              y: playerPos.y * tileHeight,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 20,
              mass: 1
            }}
            onAnimationStart={() => setIsMoving(true)}
            onAnimationComplete={() => setIsMoving(false)}
            style={{
              width: tileWidth,
              height: tileHeight,
            }}
          >
            <Sprite 
              src={avatarImageSrc} 
              direction={phase === "sleep" ? "down" : playerDir} 
              isMoving={phase === "sleep" ? false : isMoving} 
              isAction={phase === "sleep" ? false : (!isMoving && currentIdleAction)}
              size={Math.min(tileWidth, tileHeight)}
            />

            {/* Speech Bubble */}
            <AnimatePresence>
              {pathname === "/game" && !isMoving && (
                <>
                  {/* Working bubble - while simulating at office */}
                  {phase === "work" && isSimulating && (
                    <motion.div 
                      key="working-bubble"
                      initial={{ scale: 0, opacity: 0, y: 5 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: 5 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 min-w-[110px] bg-white rounded-2xl px-3 py-2 shadow-xl border border-slate-200 z-50 flex items-center justify-center gap-2"
                    >
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                        Working... {Math.ceil((100 - workProgress) / 50)}s
                      </span>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45" />
                    </motion.div>
                  )}

                  {/* Returning home bubble */}
                  {phase === "work" && returningHome && (
                    <motion.div 
                      key="returning-bubble"
                      initial={{ scale: 0, opacity: 0, y: 5 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: 5 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 min-w-[100px] bg-emerald-50 rounded-2xl px-3 py-2 shadow-xl border border-emerald-200 z-50 flex items-center justify-center gap-2"
                    >
                      <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">🏠 Heading home!</span>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-50 border-b border-r border-emerald-200 rotate-45" />
                    </motion.div>
                  )}
                  {/* Simulating bubble - during freeTime */}
                  {phase === "freeTime" && gamePhase === "simulating" && isSimulating && selectedAction && (
                    <motion.div 
                      key="simulating-bubble"
                      initial={{ scale: 0, opacity: 0, y: 5 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: 5 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 min-w-[110px] bg-white rounded-2xl px-3 py-2 shadow-xl border border-slate-200 z-50 flex items-center justify-center gap-2"
                    >
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                        {selectedAction.title} - {Math.ceil(((100 - workProgress) / 100) * (selectedAction.allocated || 1))}h
                      </span>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45" />
                    </motion.div>
                  )}
                  {/* Sleeping bubble - during sleep phase */}
                  {phase === "sleep" && !isMoving && (
                    <motion.div 
                      key="sleeping-bubble"
                      initial={{ scale: 0, opacity: 0, y: 5 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: 5 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 min-w-[60px] bg-indigo-900 rounded-2xl px-3 py-2 shadow-xl border border-indigo-700 z-50 flex items-center justify-center gap-1"
                    >
                      <span className="text-xs font-black text-indigo-200 whitespace-nowrap tracking-widest animate-pulse">
                        Zzz...
                      </span>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-900 border-b border-r border-indigo-700 rotate-45" />
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
