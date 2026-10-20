import React from 'react';

export const BottomBar: React.FC = () => {
  return (
    <footer className="h-7 bg-white border-t border-stone-200/80 px-6 flex items-center justify-between text-[11px] text-stone-400 select-none shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
        <span className="text-stone-500 font-medium">システムは正常に動作しています</span>
      </div>
      <div>
        <span>AIWorkers v0.2.0</span>
      </div>
    </footer>
  );
};
