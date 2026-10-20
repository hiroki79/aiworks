import React from 'react';
import { ASSISTANT_IMAGE } from '../data/initialData';

export const AssistantBanner: React.FC = () => {
  return (
    <div className="mt-4 flex items-center justify-center gap-3 select-none">
      <div className="relative">
        <img
          src={ASSISTANT_IMAGE}
          alt="アシスタント"
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-stone-200"
        />
      </div>
      <div className="relative bg-white/95 backdrop-blur-xs px-5 py-2.5 rounded-2xl border border-stone-200/80 shadow-2xs text-xs font-semibold text-stone-700">
        <span>新しい依頼を作成すると、最適なAI作業者を自動で割り当てます。</span>
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-stone-200/80 rotate-45"></div>
      </div>
    </div>
  );
};
