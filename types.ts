
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  GAME_OVER = 'GAME_OVER'
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector2;
  radius: number;
  type: 'OBSTACLE' | 'NPC' | 'HEALTH' | 'SHIELD' | 'FINISH' | 'DASH';
  color: string;
  speedY?: number;
  speedX?: number;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  length: number; // The distance to the finish line
  difficulty: number;
  width: number; // Channel width
  speed: number;
}

export interface PlayerState {
  pos: Vector2;
  health: number;
  distance: number;
  score: number;
}
