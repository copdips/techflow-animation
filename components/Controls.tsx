import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Step } from '../types';

interface ControlsProps {
  totalSteps: number;
  currentStepIndex: number;
  currentStep: Step;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  totalSteps,
  currentStepIndex,
  currentStep,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Step Info */}
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center gap-3">
          <span className="bg-brand-900 text-brand-300 text-xs font-bold px-2 py-1 rounded border border-brand-800">
            STEP {currentStepIndex + 1}/{totalSteps}
          </span>
          <h3 className="text-xl font-bold text-white">{currentStep.title}</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-gray-700 pl-4">
          {currentStep.description}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center md:justify-end gap-3 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <button 
          onClick={onPrev}
          disabled={currentStepIndex === 0}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button 
          onClick={onPlayPause}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={onNext}
          disabled={currentStepIndex === totalSteps - 1}
          className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
        
        <div className="w-px h-8 bg-gray-700 mx-2"></div>
        
        <button 
          onClick={onReset}
          className="p-2 text-gray-500 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Controls;
