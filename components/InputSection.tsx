import React, { useState } from 'react';
import { Search, Link as LinkIcon, Sparkles } from 'lucide-react';
import { SAMPLE_PROMPTS } from '../constants';

interface InputSectionProps {
  onGenerate: (query: string, isUrl: boolean) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Simple regex to check if it looks like a URL
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(query.trim());
    onGenerate(query, isUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in-up">
      <div className="bg-gray-850 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="text-brand-400 w-5 h-5" />
          Create Technical Animation
        </h2>
        
        <form onSubmit={handleSubmit} className="relative mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/^(http|https):\/\/[^ "]+$/.test(query) ? (
                <LinkIcon className="h-5 w-5 text-brand-400" />
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-32 py-4 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder-gray-500 text-white transition-colors"
              placeholder="Paste a blog post URL or describe a technical topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`absolute right-2 top-2 bottom-2 px-4 rounded-md font-medium text-sm transition-all duration-200 
                ${isLoading 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/25'
                }`}
            >
              {isLoading ? 'Analyzing...' : 'Visualize'}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold py-1">Try:</span>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(prompt)}
              className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
