import React from 'react';
import { Mantra15Steps } from '../types/vedic';

interface StepsInspectorProps {
  steps: Mantra15Steps;
}

export const StepsInspector: React.FC<StepsInspectorProps> = ({ steps }) => {
  const stepItems = [
    {
      num: 1,
      title: 'Step 1: Input 1 (Clean Devanagari) as it is',
      lang: 'Sanskrit (Devanagari)',
      content: steps.step1_devanagari,
      style: 'font-serif text-lg font-bold text-amber-950',
      badge: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      num: 2,
      title: 'Step 2: Transliterate Input 1 into English script (IAST/Romanized)',
      lang: 'IAST Romanized',
      content: steps.step2_iast,
      style: 'font-serif italic text-stone-800',
      badge: 'bg-stone-100 text-stone-800 border-stone-300'
    },
    {
      num: 3,
      title: 'Step 3: Transliterate Input 1 into Telugu script',
      lang: 'Telugu Script',
      content: steps.step3_telugu_mantra,
      style: 'text-stone-900 font-telugu text-base',
      badge: 'bg-orange-50 text-orange-900 border-orange-200'
    },
    {
      num: 4,
      title: 'Step 4: Translate Input 2 (भावार्थभाषाः) into simple Telugu (Single horizontal sentence)',
      lang: 'Telugu Translation',
      content: steps.step4_telugu_bhavartha,
      style: 'text-stone-800',
      badge: 'bg-orange-50 text-orange-900 border-orange-200'
    },
    {
      num: 5,
      title: 'Step 5: Concise spiritual summary of Input 2 in Telugu',
      lang: 'Telugu Spiritual Summary',
      content: steps.step5_telugu_summary,
      style: 'text-purple-950 font-medium',
      badge: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    {
      num: 6,
      title: 'Step 6: Translate Input 3 (पदार्थान्वयभाषाः) word-by-word into Telugu (Horizontal format)',
      lang: 'Telugu Padartha',
      content: steps.step6_telugu_padartha,
      style: 'text-stone-800',
      badge: 'bg-orange-50 text-orange-900 border-orange-200'
    },
    {
      num: 7,
      title: 'Step 7: Concise spiritual summary of Input 3 in Telugu',
      lang: 'Telugu Spiritual Summary',
      content: steps.step7_telugu_summary2,
      style: 'text-purple-950 font-medium',
      badge: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    {
      num: 8,
      title: 'Step 8: Translate Input 2 (भावार्थभाषाः) into simple English (Single horizontal sentence)',
      lang: 'English Translation',
      content: steps.step8_english_bhavartha,
      style: 'text-stone-800 font-serif',
      badge: 'bg-blue-50 text-blue-900 border-blue-200'
    },
    {
      num: 9,
      title: 'Step 9: Concise spiritual summary of Input 2 in English',
      lang: 'English Spiritual Summary',
      content: steps.step9_english_summary,
      style: 'text-blue-950 font-medium',
      badge: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      num: 10,
      title: 'Step 10: Translate Input 3 (पदार्थान्वयभाषाः) word-by-word into English (Material, Horizontal)',
      lang: 'English Padartha',
      content: steps.step10_english_padartha,
      style: 'text-stone-800',
      badge: 'bg-blue-50 text-blue-900 border-blue-200'
    },
    {
      num: 11,
      title: 'Step 11: Concise spiritual summary of Input 3 in English',
      lang: 'English Spiritual Summary',
      content: steps.step11_english_summary2,
      style: 'text-blue-950 font-medium',
      badge: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      num: 12,
      title: 'Step 12: Extract Input 2 (भावार्थभाषाः) in clean Hindi (Single horizontal sentence)',
      lang: 'Hindi Bhavartha',
      content: steps.step12_hindi_bhavartha,
      style: 'text-stone-800',
      badge: 'bg-amber-50 text-amber-900 border-amber-200'
    },
    {
      num: 13,
      title: 'Step 13: Concise spiritual summary of Input 2 in Hindi',
      lang: 'Hindi Spiritual Summary',
      content: steps.step13_hindi_summary,
      style: 'text-amber-950 font-medium',
      badge: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      num: 14,
      title: 'Step 14: Extract Input 3 (पदार्थान्वयभाषाः) word-by-word in Hindi (पदार्था:, Horizontal)',
      lang: 'Hindi Padartha',
      content: steps.step14_hindi_padartha,
      style: 'text-stone-800',
      badge: 'bg-amber-50 text-amber-900 border-amber-200'
    },
    {
      num: 15,
      title: 'Step 15: Concise spiritual summary of Input 3 in Hindi',
      lang: 'Hindi Spiritual Summary',
      content: steps.step15_hindi_summary2,
      style: 'text-amber-950 font-medium',
      badge: 'bg-amber-100 text-amber-900 border-amber-300'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#FFFDF8] border border-amber-900/15 rounded-lg p-4 sm:p-5 shadow-xs mb-6">
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-1">
          Sequential 15-Step Vedic Scholarship Inspector
        </h3>
        <p className="text-xs sm:text-sm text-stone-600">
          Every Atharvaveda mantra undergoes this exact 15-step transliteration, translation, and spiritual summation protocol.
        </p>
      </div>

      <div className="space-y-3">
        {stepItems.map((item) => (
          <div
            key={item.num}
            className="bg-[#FFFDF8] border border-amber-900/10 rounded-lg p-4 sm:p-5 shadow-xs hover:border-amber-900/25 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                {item.title}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${item.badge}`}>
                {item.lang}
              </span>
            </div>
            <div className={`p-3 bg-[#FAF7F0] rounded border border-amber-900/5 leading-relaxed text-sm sm:text-base ${item.style}`}>
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
