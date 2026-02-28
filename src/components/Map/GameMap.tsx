"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSimulation } from "@/context/SimulationContext";
import { usePathname } from "next/navigation";

const TILE_SIZE = 64;

export function GameMap() {
  const pathname = usePathname();
  const [playerPos, setPlayerPos] = useState({ x: 15, y: 9 });
  const [mapSize, setMapSize] = useState({ cols: 32, rows: 20 });

  useEffect(() => {
    // Update map size on resize to fill the screen with tiles
    const updateSize = () => {
      setMapSize({
        cols: Math.ceil(window.innerWidth / TILE_SIZE),
        rows: Math.ceil(window.innerHeight / TILE_SIZE)
      });
    };
    
    // Initial size
    if (typeof window !== "undefined") {
      updateSize();
      window.addEventListener("resize", updateSize);
    }
    
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Automate player movement based on simulation step
  useEffect(() => {
    switch (pathname) {
      case "/":
      case "/onboarding":
      case "/onboarding/step-2":
        setPlayerPos({ x: 3, y: 3 }); // Spawn area
        break;
      case "/game":
        setPlayerPos({ x: 15, y: 10 }); // Center area
        break;
    }
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      setPlayerPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        switch (e.key) {
          case "ArrowUp":
          case "w":
          case "W":
            newY = Math.max(0, prev.y - 1);
            break;
          case "ArrowDown":
          case "s":
          case "S":
            newY = Math.min(mapSize.rows - 1, prev.y + 1);
            break;
          case "ArrowLeft":
          case "a":
          case "A":
            newX = Math.max(0, prev.x - 1);
            break;
          case "ArrowRight":
          case "d":
          case "D":
            newX = Math.min(mapSize.cols - 1, prev.x + 1);
            break;
        }

        return { x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mapSize]);

  return (
    <div className="absolute inset-0 z-0 bg-emerald-600/60 overflow-hidden pointer-events-none">
      {/* Dynamic Grid Pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
          backgroundPosition: "top left"
        }}
      />

      {/* Player Character */}
      <motion.div
        className="absolute flex items-center justify-center text-5xl drop-shadow-md z-10"
        initial={false}
        animate={{
          x: playerPos.x * TILE_SIZE,
          y: playerPos.y * TILE_SIZE,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5
        }}
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
        }}
      >
        <span>
          🚶‍♂️
        </span>
      </motion.div>
    </div>
  );
}
