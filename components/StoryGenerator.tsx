"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Compass, Sparkles, FlaskConical, Leaf, Users, BookOpen, Users2, PencilLine, Wand2, Stars, ChevronDown } from 'lucide-react';
import StoryDisplay from './StoryDisplay';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  theme: z.string().min(1, 'Please select a theme'),
  characters: z.string().min(3, 'Please describe the characters'),
  readingLevel: z.string().min(1, 'Please select a reading level'),
});

const themes = [
  { value: 'adventure', label: 'Adventure', icon: Compass, color: 'from-orange-400 to-red-500', bgLight: 'bg-orange-50' },
  { value: 'fantasy', label: 'Fantasy', icon: Sparkles, color: 'from-purple-400 to-pink-500', bgLight: 'bg-purple-50' },
  { value: 'science', label: 'Science', icon: FlaskConical, color: 'from-blue-400 to-cyan-500', bgLight: 'bg-blue-50' },
  { value: 'nature', label: 'Nature', icon: Leaf, color: 'from-green-400 to-emerald-500', bgLight: 'bg-green-50' },
  { value: 'friendship', label: 'Friendship', icon: Users, color: 'from-yellow-400 to-orange-500', bgLight: 'bg-yellow-50' },
];

const readingLevels = [
  { value: '1', label: 'Grade 1', emoji: '🌱' },
  { value: '2', label: 'Grade 2', emoji: '🌿' },
  { value: '3', label: 'Grade 3', emoji: '🌺' },
  { value: '4', label: 'Grade 4', emoji: '🌳' },
  { value: '5', label: 'Grade 5', emoji: '🌲' },
];

export default function StoryGenerator() {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: '',
      characters: '',
      readingLevel: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) throw new Error('Failed to generate story');
      
      const data = await response.json();
      setStory(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 pb-20"
    >
      <div className="text-center space-y-2 mb-10">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Create Your Magical Story!
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Choose your adventure and let&apos;s make something amazing!</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div 
            className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4 block">Pick Your Story Theme</FormLabel>
                    <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x">
                      {themes.map(({ value, label, icon: Icon, color, bgLight }) => (
                        <motion.div
                          key={value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="snap-start"
                        >
                          <Button
                            type="button"
                            variant={field.value === value ? "default" : "outline"}
                            className={`relative w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-2 border-2 ${
                              field.value === value 
                                ? `bg-gradient-to-br ${color} text-white border-transparent`
                                : `hover:border-purple-400 transition-colors ${bgLight} dark:bg-gray-800 dark:hover:bg-gray-700`
                            }`}
                            onClick={() => field.onChange(value)}
                          >
                            <Icon className={`h-7 w-7 ${field.value === value ? 'text-white' : ''}`} />
                            <span className="text-sm font-medium">{label}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AnimatePresence>
              {showScrollHint && (
                <motion.div 
                  className="flex justify-center py-2 bg-purple-50 dark:bg-purple-900/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <span className="text-sm font-medium">Scroll for more options</span>
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-900/20 dark:to-gray-800/90">
              <FormField
                control={form.control}
                name="readingLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold mb-4 block">Choose Your Reading Level</FormLabel>
                    <div className="flex gap-3 overflow-x-auto px-1 pb-2 snap-x">
                      {readingLevels.map(({ value, label, emoji, description }) => (
                        <motion.div
                          key={value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="snap-start flex-shrink-0 w-[145px]"
                        >
                          <Button
                            type="button"
                            variant={field.value === value ? "default" : "outline"}
                            className={`w-full h-[80px] rounded-xl flex flex-col items-center justify-center gap-1 border-2 ${
                              field.value === value 
                                ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white border-transparent'
                                : 'hover:border-purple-400 transition-colors bg-white dark:bg-gray-800 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => field.onChange(value)}
                          >
                            <span className="text-xl">{emoji}</span>
                            <span className="text-sm font-semibold">{label}</span>
                            <span className="text-[11px] opacity-90 px-1 text-center leading-tight">{description}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-6 p-6 bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FormField
              control={form.control}
              name="characters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold mb-4 block">Who&apos;s in Your Story?</FormLabel>
                  <FormControl>
                    <div className="relative mt-2">
                      <Users2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-400" />
                      <Input
                        placeholder="Tell us about your characters!"
                        className="pl-12 h-14 text-lg rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-colors focus-visible:ring-purple-400 dark:bg-gray-800 dark:border-gray-700"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold mb-4 block">What Happens in Your Story?</FormLabel>
                  <FormControl>
                    <div className="relative mt-2">
                      <PencilLine className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-400" />
                      <Input
                        placeholder="Share your amazing story idea!"
                        className="pl-12 h-14 text-lg rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-colors focus-visible:ring-purple-400 dark:bg-gray-800 dark:border-gray-700"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6"
            >
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Stars className="h-6 w-6 animate-spin" />
                    <span>Creating your magical story...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-6 w-6" />
                    <span>Create My Story!</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>

      {story && <StoryDisplay story={story} />}
    </motion.div>
  );
}
