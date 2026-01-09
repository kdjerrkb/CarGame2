
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LevelData } from './types';
import { LEVELS, PLAYER_INITIAL_HEALTH } from './constants';
import GameCanvas from './components/GameCanvas';
import { HUD, Menu, ResultOverlay } from './components/GameUI';
import { getLevelHint } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevel, setCurrentLevel] = useState<LevelData>(LEVELS[0]);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [bestScore, setBestScore] = useState<number>(0);
  const [hint, setHint] = useState<string>("");
  
  // HUD state
  const [hudData, setHudData] = useState({ 
    health: PLAYER_INITIAL_HEALTH, 
    progress: 0, 
    score: 0, 
    isInvincible: false,
    distanceRemaining: 0
  });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('tadpole_run_data');
    if (saved) {
      const data = JSON.parse(saved);
      setUnlockedLevel(data.unlockedLevel || 1);
      setBestScore(data.bestScore || 0);
    }
  }, []);

  const saveProgress = useCallback((newScore: number, levelId: number) => {
    const newBest = Math.max(bestScore, newScore);
    const newUnlocked = Math.max(unlockedLevel, levelId + 1);
    setBestScore(newBest);
    setUnlockedLevel(newUnlocked);
    localStorage.setItem('tadpole_run_data', JSON.stringify({
      bestScore: newBest,
      unlockedLevel: newUnlocked
    }));
  }, [bestScore, unlockedLevel]);

  const handleStartGame = async (levelId: number) => {
    const lvl = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    setCurrentLevel(lvl);
    setGameState(GameState.PLAYING);
    setHudData({ 
      health: PLAYER_INITIAL_HEALTH, 
      progress: 0, 
      score: 0, 
      isInvincible: false,
      distanceRemaining: lvl.length
    });
    
    // Fetch an AI hint while loading/playing
    const aiHint = await getLevelHint(lvl.title, lvl.difficulty);
    setHint(aiHint);
  };

  const handleGameOver = (finalScore: number) => {
    setGameState(GameState.GAME_OVER);
    setHudData(prev => ({ ...prev, score: finalScore }));
  };

  const handleLevelComplete = (finalScore: number) => {
    saveProgress(finalScore, currentLevel.id);
    setGameState(GameState.LEVEL_COMPLETE);
    setHudData(prev => ({ ...prev, score: finalScore }));
  };

  const nextLevel = () => {
    const nextIdx = LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
    if (nextIdx < LEVELS.length) {
      handleStartGame(LEVELS[nextIdx].id);
    } else {
      setGameState(GameState.MENU);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      <GameCanvas 
        gameState={gameState} 
        level={currentLevel}
        onGameOver={handleGameOver}
        onLevelComplete={handleLevelComplete}
        onUpdateHUD={(health, progress, score, isInvincible, distanceRemaining) => 
          setHudData({ health, progress, score, isInvincible, distanceRemaining })
        }
      />

      {gameState === GameState.MENU && (
        <Menu 
          onStart={handleStartGame} 
          bestScore={bestScore} 
          unlockedLevel={unlockedLevel} 
        />
      )}

      {gameState === GameState.PLAYING && (
        <>
            <HUD 
                health={hudData.health} 
                progress={hudData.progress} 
                score={hudData.score} 
                levelTitle={currentLevel.title}
                isInvincible={hudData.isInvincible}
                distanceRemaining={hudData.distanceRemaining}
            />
            {hint && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm italic animate-pulse pointer-events-none">
                    "{hint}"
                </div>
            )}
        </>
      )}

      {gameState === GameState.GAME_OVER && (
        <ResultOverlay 
          type="GAME_OVER"
          score={hudData.score}
          levelTitle={currentLevel.title}
          onRetry={() => handleStartGame(currentLevel.id)}
          onMenu={() => setGameState(GameState.MENU)}
        />
      )}

      {gameState === GameState.LEVEL_COMPLETE && (
        <ResultOverlay 
          type="LEVEL_COMPLETE"
          score={hudData.score}
          levelTitle={currentLevel.title}
          onRetry={() => handleStartGame(currentLevel.id)}
          onMenu={() => setGameState(GameState.MENU)}
          onNext={currentLevel.id < LEVELS.length ? nextLevel : undefined}
        />
      )}
    </div>
  );
};

export default App;
