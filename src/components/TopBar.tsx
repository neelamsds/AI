import React from 'react';
import { Sparkles, Send, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  activeTab: 'publication' | 'steps' | 'channels' | 'local';
  setActiveTab: (tab: 'publication' | 'steps' | 'channels' | 'local') => void;
  onQuickDispatch: () => void;
  isDispatching: boolean;
  kanda: number;
  sukta: number;
  mantra: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onQuickDispatch,
  isDispatching,
  kanda,
  sukta,
  mantra
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F0]/95 backdrop-blur border-b border-amber-900/10 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-amber-700/10 border border-amber-700/20 flex items-center justify-center text-amber-800 font-serif font-bold text-sm">
            ॐ
          </div>
          <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap">
            अथर्ववेद · Atharvaveda Scholar
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('publication')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'publication'
                ? 'border-amber-700 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Daily Sanctuary
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-amber-700 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            15-Step Inspector
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'channels'
                ? 'border-amber-700 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Dispatch & Channels
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'local'
                ? 'border-amber-700 text-amber-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Local Setup & .env
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onQuickDispatch}
            disabled={isDispatching}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-all shadow-xs active:scale-[0.98] disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isDispatching ? 'Dispatching...' : 'Dispatch All Channels'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="flex md:hidden items-center justify-between border-t border-amber-900/10 mt-2.5 pt-2 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('publication')}
          className={`px-2 py-1 ${activeTab === 'publication' ? 'text-amber-900 font-bold underline' : 'text-stone-600'}`}
        >
          Sanctuary
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`px-2 py-1 ${activeTab === 'steps' ? 'text-amber-900 font-bold underline' : 'text-stone-600'}`}
        >
          15 Steps
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-2 py-1 ${activeTab === 'channels' ? 'text-amber-900 font-bold underline' : 'text-stone-600'}`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('local')}
          className={`px-2 py-1 ${activeTab === 'local' ? 'text-amber-900 font-bold underline' : 'text-stone-600'}`}
        >
          Local .env
        </button>
      </div>
    </header>
  );
};
