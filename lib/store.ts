import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  score: number;
  level: number;
  experience: number;
  addPoints: (points: number) => void;
  experienceToNextLevel: () => number;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      score: 0,
      level: 1,
      experience: 0,
      experienceToNextLevel: () => {
        // Only calculate on client side
        if (typeof window === 'undefined') return 100;
        return get().level * 100;
      },
      addPoints: (points: number) =>
        set((state) => {
          const newExperience = state.experience + points;
          const expNeeded = state.level * 100;

          if (newExperience >= expNeeded) {
            return {
              score: state.score + points,
              level: state.level + 1,
              experience: newExperience - expNeeded,
            };
          }

          return {
            score: state.score + points,
            experience: newExperience,
            level: state.level,
          };
        }),
    }),
    {
      name: 'reading-game-storage',
      skipHydration: true, // Skip initial hydration to prevent mismatch
    }
  )
);
