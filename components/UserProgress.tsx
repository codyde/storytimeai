"use client";

import { useGameStore } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap } from 'lucide-react';

export default function UserProgress() {
  const { score, level, experience, experienceToNextLevel } = useGameStore();
  const progress = (experience / experienceToNextLevel()) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Star className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
            <p className="text-2xl font-bold">{level}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Zap className="h-8 w-8 text-pink-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
            <Progress value={progress} className="mt-2" />
            <p className="text-xs mt-1">
              {experience} / {experienceToNextLevel()} XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}