import StoryGenerator from '@/components/StoryGenerator';
import UserProgress from '@/components/UserProgress';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-2">
            Reading Adventure
          </h1>
          <p className="text-lg text-purple-600 dark:text-purple-300">
            Create your own magical story and test your understanding!
          </p>
        </header>
        
        <UserProgress />
        <StoryGenerator />
      </div>
    </main>
  );
}