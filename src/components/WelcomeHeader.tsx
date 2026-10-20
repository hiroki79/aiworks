import React from 'react';
import { Play, Check, AlertCircle, Plus } from 'lucide-react';

interface WelcomeHeaderProps {
  stats: {
    inProgress: number;
    completed: number;
    alerts: number;
  };
  onOpenNewJob: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  stats,
  onOpenNewJob,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 select-none">
      {/* Left Card: 今日の進捗 */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs flex flex-col justify-between min-w-[240px]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
          <span>📅</span>
          <span>今日の進捗</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* 進行中 */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-500 font-medium">進行中</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-[#E5F7F2] text-[#229E85] flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-current" />
              </div>
              <span className="text-base font-bold text-stone-800 font-mono tabular-nums">
                {stats.inProgress}
              </span>
            </div>
          </div>

          {/* 完了 */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-500 font-medium">完了</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-base font-bold text-stone-800 font-mono tabular-nums">
                {stats.completed}
              </span>
            </div>
          </div>

          {/* 要対応 */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-stone-500 font-medium">要対応</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center">
                <AlertCircle className="w-3 h-3" />
              </div>
              <span className="text-base font-bold text-stone-800 font-mono tabular-nums">
                {stats.alerts}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Welcome Text */}
      <div className="flex flex-col items-center text-center flex-1">
        <h1 className="text-xl font-bold text-stone-900 tracking-tight">
          AIWorkers 仮想オフィスへようこそ！
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          あなたの仕事を、AI作業者たちがサポートします。
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-5 h-1 bg-[#34A88E] rounded-full"></div>
          <div className="w-1.5 h-1 bg-stone-300 rounded-full"></div>
        </div>
      </div>

      {/* Right: + 新しい依頼を作成 Button */}
      <div className="min-w-[200px] flex justify-end">
        <button
          onClick={onOpenNewJob}
          className="flex items-center gap-1.5 px-5 py-3 bg-[#3DB89E] hover:bg-[#34A88E] text-white text-sm font-bold rounded-2xl shadow-sm transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>新しい依頼を作成</span>
        </button>
      </div>
    </div>
  );
};
