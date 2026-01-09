
import { LevelData } from './types';

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 800;
export const PLAYER_RADIUS = 12;
export const PLAYER_MAX_HEALTH = 5;
export const PLAYER_INITIAL_HEALTH = 5;
export const TAIL_SEGMENTS = 8;
export const INVINCIBILITY_DURATION = 5000; // 5 seconds in ms
export const INITIAL_DASH_DURATION = 2000; // 2 seconds at start

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "Sunrise Highway",
    description: "A fresh start on the open road. Keep it steady.",
    length: 6000,
    difficulty: 1.0,
    width: 450, // Increased from 320
    speed: 5,
  },
  {
    id: 2,
    title: "Neon Nightway",
    description: "The city comes alive. Traffic is picking up.",
    length: 8500,
    difficulty: 1.8,
    width: 400, // Increased from 280
    speed: 7,
  },
  {
    id: 3,
    title: "Turbo Tunnel",
    description: "Narrow lanes and high speeds. No room for error.",
    length: 11000,
    difficulty: 2.8,
    width: 350, // Increased from 240
    speed: 9,
  },
  {
    id: 4,
    title: "Grand Prix Final",
    description: "The ultimate challenge. Legend of the Tiny Red Racer.",
    length: 16000,
    difficulty: 4.0,
    width: 300, // Increased from 200
    speed: 12,
  }
];
