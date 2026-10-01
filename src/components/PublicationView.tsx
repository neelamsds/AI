import React, { useState } from 'react';
import { Copy, Check, Send, Mail, MessageSquare, Share2, Sparkles } from 'lucide-react';
import { MantraPublication } from '../types/vedic';

interface PublicationViewProps {
  publication: MantraPublication;
  onDispatchChannel: (channel: 'email' | 'telegram' | 'whatsapp') => void;
  isDispatching: boolean;
}

export const PublicationView: React.FC<PublicationViewProps> = ({
  publication,
  onDispatchChannel,
  isDispatching
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const { metadata, briefIntro, steps, formattedPublication } = publication;

  return (
    <div className="space-y-6">
      {/* Action Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-3 sm:px-4">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Vedic Broadcast Payload ready for multi-channel dispatch</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Plaintext / Markdown */}
          <button
            onClick={() => copyToClipboard(formattedPublication, 'standard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 rounded border border-stone-200 transition-colors shadow-2xs cursor-pointer"
          >
            {copiedType === 'standard' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'standard' ? 'Copied Full Output!' : 'Copy Formatted Text'}</span>
          </button>

          {/* Copy WhatsApp Markdown */}
          <button
            onClick={() => copyToClipboard(formattedPublication, 'whatsapp')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
          >
            {copiedType === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedType === 'whatsapp' ? 'Copied for WhatsApp!' : 'Copy WhatsApp Text'}</span>
          </button>

          {/* Quick Dispatch Buttons */}
          <button
            onClick={() => onDispatchChannel('telegram')}
            disabled={isDispatching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-800 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors cursor-pointer disabled:opacity-50"
            title="Dispatch text + sendAudio attachment to Telegram"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Telegram</span>
          </button>

          <button
            onClick={() => onDispatchChannel('email')}
            disabled={isDispatching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Send email to shobhasrinivas@gmail.com with MP3 attachment"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </button>

          <button
            onClick={() => onDispatchChannel('whatsapp')}
            disabled={isDispatching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded border border-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Launch WhatsApp Web or Webhook"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Launch WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Sacred Parchment Publication Card */}
      <article className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle decorative Vedic border header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900" />

        {/* 1. Reference Header */}
        <div className="text-center pb-5 border-b border-amber-900/10 mb-6">
          <h2 className="text-lg sm:text-2xl font-serif font-bold text-amber-950 tracking-wide">
            {metadata.referenceHeader}
          </h2>
          <div className="mt-2 text-xs sm:text-sm text-amber-900/80 font-serif flex flex-wrap items-center justify-center gap-3">
            <span>देवता: <strong>{metadata.devata}</strong></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>ऋषि: <strong>{metadata.rishi}</strong></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>छन्द: <strong>{metadata.chhanda}</strong></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>स्वर: <strong>{metadata.swara}</strong></span>
          </div>

          <div className="mt-3 text-xs text-stone-500 font-mono">
            Kanda/{metadata.kanda}/Sukta/{metadata.sukta}/Mantra/{metadata.mantra}
          </div>
        </div>

        {/* 2. Audio Icon Only (URL removed) */}
        <div className="flex items-center gap-2 py-2 px-3.5 bg-amber-50/70 border border-amber-200/80 rounded-md mb-6 text-amber-950 font-serif font-semibold text-sm">
          <span className="text-base">🎵</span>
          <span>Mantra Audio</span>
        </div>

        {/* 3. Brief Introduction */}
        <div className="mb-8 p-4 bg-[#FBF9F5] border-l-3 border-amber-700 rounded-r-md">
          <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 mb-2 font-serif">
            The mantra describes about:
          </div>
          <div className="space-y-2 text-stone-800 text-sm sm:text-base leading-relaxed">
            <p className="font-serif italic text-stone-700">"{briefIntro.english}"</p>
            <p className="text-amber-950">"{briefIntro.hindi}"</p>
            <p className="text-stone-900 font-telugu">"{briefIntro.telugu}"</p>
          </div>
        </div>

        {/* 4. Tri-Script Mantra Core (Steps 1, 2, 3) */}
        <div className="space-y-4 mb-8 pb-8 border-b border-amber-900/10">
          {/* Step 1: Clean Devanagari */}
          <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-md border border-amber-900/10">
            <div className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold mb-1">
              Step 1: Clean Devanagari Mantra
            </div>
            <div className="text-lg sm:text-2xl font-serif font-bold text-amber-950 leading-relaxed tracking-wide">
              {steps.step1_devanagari}
            </div>
          </div>

          {/* Step 2: IAST Romanized */}
          <div className="p-3.5 bg-white border border-stone-200 rounded-md">
            <div className="text-[11px] uppercase tracking-widest text-stone-500 font-medium mb-1">
              Step 2: IAST Romanized Script
            </div>
            <div className="text-sm sm:text-base font-serif italic text-stone-800 leading-relaxed">
              {steps.step2_iast}
            </div>
          </div>

          {/* Step 3: Telugu Script */}
          <div className="p-3.5 bg-white border border-stone-200 rounded-md">
            <div className="text-[11px] uppercase tracking-widest text-stone-500 font-medium mb-1">
              Step 3: Telugu Script (తెలుగు లిపి)
            </div>
            <div className="text-sm sm:text-lg text-stone-900 leading-relaxed font-telugu">
              {steps.step3_telugu_mantra}
            </div>
          </div>
        </div>

        {/* 5. Telugu Section (Steps 4, 5, 6, 7) */}
        <div className="mb-8 pb-8 border-b border-amber-900/10 space-y-4">
          <div className="text-xs uppercase tracking-widest font-semibold text-amber-900 border-b border-amber-900/10 pb-1">
            Telugu Translations & Spiritual Meanings (భావార్థము & పదార్థము)
          </div>

          <div>
            <span className="font-bold text-amber-950 text-sm sm:text-base">భావార్థము :- </span>
            <span className="text-stone-800 text-sm sm:text-base leading-relaxed">{steps.step4_telugu_bhavartha}</span>
          </div>

          <div className="p-3 bg-purple-50/60 border-l-2 border-purple-700 rounded-r text-xs sm:text-sm text-purple-950">
            <strong>{steps.step5_telugu_summary}</strong>
          </div>

          <div>
            <span className="font-bold text-amber-950 text-sm sm:text-base">పదార్థము : - </span>
            <span className="text-stone-800 text-sm sm:text-base leading-relaxed">{steps.step6_telugu_padartha}</span>
          </div>

          <div className="p-3 bg-purple-50/60 border-l-2 border-purple-700 rounded-r text-xs sm:text-sm text-purple-950">
            <strong>{steps.step7_telugu_summary2}</strong>
          </div>
        </div>

        {/* 6. English Section (Steps 8, 9, 10, 11) */}
        <div className="mb-8 pb-8 border-b border-amber-900/10 space-y-4">
          <div className="text-xs uppercase tracking-widest font-semibold text-amber-900 border-b border-amber-900/10 pb-1">
            English Translation & Spiritual Insights
          </div>

          <div>
            <span className="font-bold text-amber-950 text-sm sm:text-base">Meaning: </span>
            <span className="text-stone-800 text-sm sm:text-base leading-relaxed">{steps.step8_english_bhavartha}</span>
          </div>

          <div className="p-3 bg-blue-50/60 border-l-2 border-blue-700 rounded-r text-xs sm:text-sm text-blue-950">
            <strong>{steps.step9_english_summary}</strong>
          </div>

          <div>
            <span className="font-bold text-amber-950 text-sm sm:text-base">Material: </span>
            <span className="text-stone-800 text-sm sm:text-base leading-relaxed">{steps.step10_english_padartha}</span>
          </div>

          <div className="p-3 bg-blue-50/60 border-l-2 border-blue-700 rounded-r text-xs sm:text-sm text-blue-950">
            <strong>{steps.step11_english_summary2}</strong>
          </div>
        </div>

        {/* 7. Hindi Section (Steps 12, 13, 14, 15) */}
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-widest font-semibold text-amber-900 border-b border-amber-900/10 pb-1">
            Hindi Bhasha & Spiritual Summaries (भावार्थभाषाः & पदार्था:)
          </div>

          <div>
            <span className="font-bold text-amber-950 text-sm sm:text-base">भावार्थभाषाः </span>
            <span className="text-stone-800 text-sm sm:text-base leading-relaxed">{steps.step12_hindi_bhavartha}</span>
          </div>

          <div className="p-3 bg-amber-50/80 border-l-2 border-amber-700 rounded-r text-xs sm:text-sm text-amber-950">
            <strong>{steps.step13_hindi_summary}</strong>
          </div>

          <div>
            <span className="font-bold text-amber-950 text-sm sm:text-base">पदार्था: - </span>
            <span className="text-stone-800 text-sm sm:text-base leading-relaxed">{steps.step14_hindi_padartha}</span>
          </div>

          <div className="p-3 bg-amber-50/80 border-l-2 border-amber-700 rounded-r text-xs sm:text-sm text-amber-950">
            <strong>{steps.step15_hindi_summary2}</strong>
          </div>
        </div>

      </article>
    </div>
  );
};
