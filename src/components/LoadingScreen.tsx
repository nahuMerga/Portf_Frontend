
import { useState, useEffect } from 'react';
import { Code } from 'lucide-react';

const facts = [
  "Did you know? Ethiopia was never colonized!",
  "Ethiopia is the birthplace of coffee ☕",
  "Addis Ababa means 'New Flower' in Amharic",
  "The Ethiopian calendar is 7-8 years behind the Gregorian calendar",
  "Ethiopia has its own alphabet - Ge'ez script",
];

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const factTimer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(factTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <Code size={60} className="text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Unlocking Creativity, Please Hold...</h2>
        </div>

        <div className="space-y-4">
  {/* Progress Bar */}
  <div className="h-2 bg-muted rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
  
  {/* Dynamic Card */}
  <div className="glass rounded-lg p-4 overflow-hidden min-h-[6rem]">
    <pre className="font-mono text-xl animate-fade-in whitespace-pre-wrap break-words">
      <span className="text-primary">console</span>.
      <span className="text-accent">log</span>
      <span className="text-muted-foreground">(</span>
      <span className="text-secondary">"{facts[currentFact]}"</span>
      <span className="text-muted-foreground">);</span>
    </pre>
  </div>
</div>

      </div>
    </div>
  );
};

export default LoadingScreen;
