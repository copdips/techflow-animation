import React, { useState, useEffect, useRef } from 'react';
import InputSection from './components/InputSection';
import AnimationStage from './components/AnimationStage';
import Controls from './components/Controls';
import { AnimationScript, LoadingState } from './types';
import { generateAnimationScript } from './services/geminiService';
import { Terminal, Activity, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [script, setScript] = useState<AnimationScript | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, message: '' });
  const [error, setError] = useState<string | null>(null);
  const playIntervalRef = useRef<number | null>(null);

  const handleGenerate = async (query: string, isUrl: boolean) => {
    setLoading({ isLoading: true, message: isUrl ? 'Scanning URL and extracting key concepts...' : 'Analyzing topic and designing architecture...' });
    setError(null);
    setScript(null);
    setIsPlaying(false);
    setCurrentStepIndex(0);

    try {
      const generatedScript = await generateAnimationScript(query, isUrl);
      setScript(generatedScript);
    } catch (err) {
      setError("Failed to generate animation. Please verify your API Key and try again.");
    } finally {
      setLoading({ isLoading: false, message: '' });
    }
  };

  const handleNext = () => {
    if (script && currentStepIndex < script.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    if (script && currentStepIndex === script.steps.length - 1) {
      // Restart if at end
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && script) {
      playIntervalRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < script.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3000); // 3 seconds per step
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, script]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-brand-500 selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              TechFlow Animator
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Gemini 2.5 Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-10">
        <InputSection onGenerate={handleGenerate} isLoading={loading.isLoading} />

        {/* Loading State */}
        {loading.isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative w-16 h-16 mb-6">
               <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-brand-400 font-mono animate-pulse">{loading.message}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 flex items-start gap-4 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-bold mb-1">Generation Failed</h3>
              <p className="text-red-200/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Animation Stage */}
        {script && !loading.isLoading && (
          <div className="animate-fade-in-up">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{script.title}</h2>
                <p className="text-gray-400 max-w-2xl">{script.description}</p>
             </div>

             <AnimationStage 
               script={script} 
               currentStepIndex={currentStepIndex}
               isPlaying={isPlaying}
             />

             <Controls 
               totalSteps={script.steps.length}
               currentStepIndex={currentStepIndex}
               currentStep={script.steps[currentStepIndex]}
               isPlaying={isPlaying}
               onPlayPause={togglePlay}
               onNext={handleNext}
               onPrev={handlePrev}
               onReset={() => {
                 setIsPlaying(false);
                 setCurrentStepIndex(0);
               }}
             />

             {/* Raw Script View (Debug style) */}
             <div className="mt-12 border-t border-gray-800 pt-8">
                <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-mono">
                  <Terminal className="w-4 h-4" />
                  <span>GENERATED_SCRIPT.JSON</span>
                </div>
                <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-xs text-gray-500 font-mono max-h-40 scrollbar-thin">
                  {JSON.stringify(script, null, 2)}
                </pre>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
