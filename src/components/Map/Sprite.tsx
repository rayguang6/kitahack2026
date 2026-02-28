"use client";

import React, { useState, useEffect } from "react";

export type Direction = "down" | "left" | "up" | "right";

export interface SpriteProps {
  src: string;
  direction?: Direction;
  isMoving?: boolean;
  isAction?: boolean;
  size?: number; // Visual size (e.g. 64)
  originalSize?: number; // 32
}

/**
 * A detailed class to handle spritesheet animation frames based on the specification:
 * - 32px per frame, 16 frames total in a single row
 * - 4 directions, 3 frames each (down, left, up, right)
 * - Last 4 frames are action animation
 */
export class SpriteSheet {
  public static readonly FRAMES = {
    down: [0, 1, 2, 1], // The 4th element goes back to the idle frame for a smooth loop
    left: [3, 4, 5, 4],
    up: [6, 7, 8, 7],
    right: [9, 10, 11, 10],
    action: [12, 13, 14, 15],
  };

  public static getFrames(direction: Direction, isAction: boolean): number[] {
    if (isAction) return this.FRAMES.action;
    return this.FRAMES[direction];
  }
}

export const Sprite: React.FC<SpriteProps> = ({
  src,
  direction = "down",
  isMoving = false,
  isAction = false,
  size = 64, // Default to 64x64 rendered size
  originalSize = 32, // Default 32px spritesheet base
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Reset frame sequence when animation type or direction changes
    setFrameIndex(0);

    if (isAction) {
      interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % SpriteSheet.FRAMES.action.length);
      }, 150); // Action animation speed
    } else if (isMoving) {
      interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % SpriteSheet.FRAMES[direction].length);
      }, 150); // Walking animation speed
    } else {
      // Idle frame is always the one at index 1 for the directional arrays we defined
      setFrameIndex(1);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMoving, isAction, direction]);

  const frames = SpriteSheet.getFrames(direction, isAction);
  // Ensure we don't go out of bounds if switching states
  const currentFrame = frames[frameIndex % frames.length];

  // Always use the intrinsic pixel size of the spritesheet frame (e.g. 32px)
  // to avoid fractional-pixel bleeding when calculating backgroundPosition.
  const frameSize = originalSize;
  const scale = size / frameSize;
  
  // The total width of the background is 16 frames. 
  const backgroundPositionX = -(currentFrame * frameSize);

  return (
    <div
      style={{
        width: frameSize,
        height: frameSize,
        backgroundImage: `url(${src})`,
        backgroundSize: `${frameSize * 16}px ${frameSize}px`,
        backgroundPosition: `${backgroundPositionX}px 0px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated", // Ensure sharp pixels when scaled up
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        flexShrink: 0,
      }}
    />
  );
};
