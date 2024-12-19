"use client"

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useGameStore } from '../lib/store';
import Confetti from 'react-confetti';
import { useToast } from './ui/use-toast';
import { Progress } from './ui/progress';
import { MessageCircle, ChevronRight, Star, Trophy, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ParagraphQuestions {
  paragraph: number;
  questions: Question[];
}

interface StoryDisplayProps {
  story: {
    title: string;
    story: string[];
    questions: ParagraphQuestions[];
  };
}

const emojis = ['🌟', '⭐', '✨', '💫', '🎯'];

export default function StoryDisplay({ story }: StoryDisplayProps) {
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [completedParagraphs, setCompletedParagraphs] = useState<number[]>([]);
  const { addPoints } = useGameStore();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnswerSubmit = (paragraphIndex: number) => {
    if (!mounted) return;
    
    const paragraphQuestions = story.questions.find(
      (q) => q.paragraph === paragraphIndex
    );
    if (!paragraphQuestions) return;

    let correctCount = 0;
    paragraphQuestions.questions.forEach((question, qIndex) => {
      const answerKey = `${paragraphIndex}-${qIndex}`;
      if (answers[answerKey] === question.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = paragraphQuestions.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const points = score;

    if (mounted) {
      addPoints(points);
      setShowConfetti(true);
      setCompletedParagraphs([...completedParagraphs, paragraphIndex]);
      setTimeout(() => setShowConfetti(false), 3000);

      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      toast({
        title: `${randomEmoji} Amazing job!`,
        description: `You got ${correctCount} out of ${totalQuestions} questions correct! (+${points} points)`,
        className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none',
      });
    }
  };

  const progress = (completedParagraphs.length / story.story.length) * 100;

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="text-center space-y-4">
        <motion.h2 
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {story.title}
        </motion.h2>
        
        <div className="relative pt-4">
          <Progress value={progress} className="h-3 bg-gray-100" />
          <motion.div 
            className="absolute right-0 top-0 flex items-center gap-2 text-purple-600"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Trophy className="h-5 w-5" />
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </motion.div>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {story.story.map((paragraph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`group p-6 rounded-xl transition-all duration-200 ${
                        selectedParagraph === index
                          ? 'bg-purple-50 dark:bg-purple-900 shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer hover:shadow-md'
                      } ${
                        completedParagraphs.includes(index)
                          ? 'border-2 border-green-400'
                          : ''
                      }`}
                      onClick={() => setSelectedParagraph(index)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-grow">
                          <p className="text-lg leading-relaxed">{paragraph}</p>
                        </div>
                        <div className={`flex items-center gap-2 ${
                          selectedParagraph === index 
                            ? 'text-purple-600' 
                            : 'text-gray-400 group-hover:text-purple-500'
                        }`}>
                          {completedParagraphs.includes(index) ? (
                            <Star className="h-6 w-6 text-yellow-400" />
                          ) : (
                            <>
                              <BookOpen className="h-5 w-5" />
                              <ChevronRight className="h-5 w-5" />
                            </>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedParagraph === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 space-y-6"
                          >
                            {story.questions
                              .find((q) => q.paragraph === index)
                              ?.questions.map((question, qIndex) => (
                                <motion.div
                                  key={qIndex}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: qIndex * 0.1 }}
                                  className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                                >
                                  <h3 className="font-semibold text-lg">
                                    {question.question}
                                  </h3>
                                  <RadioGroup
                                    onValueChange={(value) =>
                                      setAnswers({
                                        ...answers,
                                        [`${index}-${qIndex}`]: parseInt(value),
                                      })
                                    }
                                    value={answers[`${index}-${qIndex}`]?.toString()}
                                    className="space-y-3"
                                  >
                                    {question.options.map((option, oIndex) => (
                                      <motion.div
                                        key={oIndex}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer"
                                      >
                                        <RadioGroupItem
                                          value={oIndex.toString()}
                                          id={`${index}-${qIndex}-${oIndex}`}
                                          className="text-purple-600"
                                        />
                                        <Label 
                                          htmlFor={`${index}-${qIndex}-${oIndex}`}
                                          className="flex-grow cursor-pointer"
                                        >
                                          {option}
                                        </Label>
                                      </motion.div>
                                    ))}
                                  </RadioGroup>
                                </motion.div>
                              ))}
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => handleAnswerSubmit(index)}
                                className="mt-6 w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                                disabled={completedParagraphs.includes(index)}
                              >
                                {completedParagraphs.includes(index) ? (
                                  <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    <span>Completed!</span>
                                  </div>
                                ) : (
                                  <span>Check Answers</span>
                                )}
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{completedParagraphs.includes(index) 
                      ? "You've completed this section!" 
                      : "Click to answer questions about this part of the story"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
