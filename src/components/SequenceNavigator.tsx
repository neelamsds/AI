import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Check
} from 'lucide-react';
import { SchedulerState } from '../types/vedic';

interface SequenceNavigatorProps {
  state: SchedulerState;
  onAdvance: (direction: 'next' | 'prev') => void;
  onSetStartingPoint: (kanda: number, sukta: number, anuvaka: number, mantra: number, customUrl?: string) => void;
  onResetToStart: () => void;
  onToggleAutoAdvance: () => void;
  isLoading: boolean;
}

export const SequenceNavigator: React.FC<SequenceNavigatorProps> = ({
  state,
  onAdvance,
  onSetStartingPoint,
  onResetToStart,
  onToggleAutoAdvance,
  isLoading
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [inputKanda, setInputKanda] = useState(state.startKanda);
  const [inputSukta, setInputSukta] = useState(state.startSukta);
  const [inputAnuvaka, setInputAnuvaka] = useState(state.startAnuvaka);
  const [inputMantra, setInputMantra] = useState(state.startMantra);
  const [customUrl, setCustomUrl] = useState(`https://www.xn--j2b3a4c.com/atharvaveda/${state.currentKanda}/${state.currentSukta}/${state.currentAnuvaka}/${state.currentMantra}`);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleApplyStartingPoint = () => {
    onSetStartingPoint(inputKanda, inputSukta, inputAnuvaka, inputMantra, customUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleUrlChange = (val: string) => {
    setCustomUrl(val);
    const match = val.match(/\/atharvaveda\/(\d+)\/(\d+)(?:\/(\d+))?\/(\d+)/i);
    if (match) {
      setInputKanda(parseInt(match[1], 10));
      setInputSukta(parseInt(match[2], 10));
      setInputAnuvaka(match[3] ? parseInt(match[3], 10) : 0);
      setInputMantra(parseInt(match[4], 10));
    }
  };

  return (
    <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-4 sm:p-5 shadow-xs mb-6">
      {/* Top Row: Current Sequence & Stepper Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sequence Position */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-amber-700/10 border border-amber-700/20 flex items-center justify-center text-amber-900 font-serif font-bold text-base">
            §
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-500 font-medium">
              Canonical Scripture Sequence (अथर्ववेद क्रम)
            </div>
            <div className="text-base sm:text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>काण्ड {state.currentKanda} · सूक्त {state.currentSukta} · मन्त्र {state.currentMantra}</span>
              <span className="text-xs text-amber-800 font-sans font-normal border-l border-stone-300 pl-2">
                (Kanda {state.currentKanda} · Sukta {state.currentSukta} · Mantra {state.currentMantra})
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Buttons & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Previous Mantra Button */}
          <button
            onClick={() => onAdvance('prev')}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors disabled:opacity-50 cursor-pointer"
            title="Step backward to previous mantra in scripture"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Next Mantra Button */}
          <button
            onClick={() => onAdvance('next')}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-900 bg-amber-100/70 hover:bg-amber-100 rounded border border-amber-300 transition-colors disabled:opacity-50 cursor-pointer"
            title="Advance forward to next sequential mantra"
          >
            <span>Next Mantra</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset to User Starting Point */}
          <button
            onClick={onResetToStart}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 transition-colors cursor-pointer"
            title={`Reset to starting point (Kanda ${state.startKanda}.${state.startSukta}.${state.startMantra})`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset to Start</span>
          </button>

          {/* Configure Starting Point Toggle */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded border transition-colors cursor-pointer ${
              showConfig
                ? 'bg-amber-800 text-white border-amber-800'
                : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Set Starting Point</span>
          </button>
        </div>
      </div>

      {/* Starting Point & Sequential Status Banner */}
      <div className="mt-3 pt-3 border-t border-amber-900/10 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
        <div className="flex items-center gap-2">
          <Bookmark className="w-3.5 h-3.5 text-amber-700" />
          <span>
            Active Starting Point: <strong>Kanda {state.startKanda}, Sukta {state.startSukta}, Mantra {state.startMantra}</strong>
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500">
            Source URL: <a href={`https://www.xn--j2b3a4c.com/atharvaveda/${state.currentKanda}/${state.currentSukta}/${state.currentAnuvaka}/${state.currentMantra}`} target="_blank" rel="noreferrer" className="underline text-amber-900 inline-flex items-center gap-0.5">veda.com <ExternalLink className="w-2.5 h-2.5" /></a>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAutoAdvance}
            className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${state.autoAdvance ? 'bg-emerald-600' : 'bg-stone-300'}`} />
            <span>Daily Auto-Advance: <strong>{state.autoAdvance ? 'Enabled' : 'Paused'}</strong></span>
          </button>
        </div>
      </div>

      {/* Expandable Starting Point Configurator */}
      {showConfig && (
        <div className="mt-4 pt-4 border-t border-amber-900/15 bg-amber-50/50 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 sm:p-5 rounded-b-lg">
          <div className="text-sm font-serif font-bold text-stone-900 mb-2 flex items-center justify-between">
            <span>Configure Custom Starting Point for Daily Sequence</span>
            <span className="text-xs font-sans font-normal text-stone-500">
              The daily scheduler will advance step-by-step from this index
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Kanda (काण्ड)</label>
              <select
                value={inputKanda}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setInputKanda(val);
                  setCustomUrl(`https://www.xn--j2b3a4c.com/atharvaveda/${val}/${inputSukta}/${inputAnuvaka}/${inputMantra}`);
                }}
                className="w-full text-sm bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-amber-700"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((k) => (
                  <option key={k} value={k}>
                    Kanda {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Sukta (सूक्त)</label>
              <input
                type="number"
                min="1"
                max="143"
                value={inputSukta}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setInputSukta(val);
                  setCustomUrl(`https://www.xn--j2b3a4c.com/atharvaveda/${inputKanda}/${val}/${inputAnuvaka}/${inputMantra}`);
                }}
                className="w-full text-sm bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-amber-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Anuvaka (अनुवाक)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={inputAnuvaka}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setInputAnuvaka(val);
                  setCustomUrl(`https://www.xn--j2b3a4c.com/atharvaveda/${inputKanda}/${inputSukta}/${val}/${inputMantra}`);
                }}
                className="w-full text-sm bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-amber-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Mantra (मन्त्र)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={inputMantra}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setInputMantra(val);
                  setCustomUrl(`https://www.xn--j2b3a4c.com/atharvaveda/${inputKanda}/${inputSukta}/${inputAnuvaka}/${val}`);
                }}
                className="w-full text-sm bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-amber-700 font-mono"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Or Paste Direct Website URL (Punycode or veda.com)
            </label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.xn--j2b3a4c.com/atharvaveda/6/17/0/2"
              className="w-full text-xs font-mono bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-amber-700"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-stone-500">
              Audio URL auto-resolves to: <code className="text-amber-900 font-mono">https://www.xn--j2b3a4c.com/audio/atharvaveda/Kanda/{inputKanda}/Sukta/{inputSukta}/Mantra/{inputMantra}.mp3</code>
            </div>

            <div className="flex items-center gap-2">
              {savedSuccess && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved & Loaded!
                </span>
              )}
              <button
                onClick={handleApplyStartingPoint}
                disabled={isLoading}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded transition-colors shadow-xs cursor-pointer"
              >
                Set as Schedule Starting Point & Load
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
