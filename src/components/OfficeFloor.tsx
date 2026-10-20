import React, { useState } from 'react';
import { Worker, Department } from '../types';
import { WelcomeHeader } from './WelcomeHeader';
import { WorkerCard } from './WorkerCard';
import { AssistantBanner } from './AssistantBanner';
import { Sliders, Building2, TrendingDown } from 'lucide-react';

interface OfficeFloorProps {
  workers: Record<string, Worker>;
  departments: Department[];
  stats: {
    inProgress: number;
    completed: number;
    alerts: number;
  };
  tokenSavedPercentage: number;
  selectedWorkerId: string | null;
  animationsEnabled: boolean;
  isQuickPanelOpen?: boolean;
  onSelectWorker: (workerId: string) => void;
  onOpenNewJob: () => void;
  onOpenHierarchyModal: () => void;
  onToggleQuickPanel?: () => void;
  onOpenAddWorker?: () => void;
}

export const OfficeFloor: React.FC<OfficeFloorProps> = ({
  workers,
  departments,
  stats,
  tokenSavedPercentage,
  selectedWorkerId,
  animationsEnabled,
  isQuickPanelOpen,
  onSelectWorker,
  onOpenNewJob,
  onOpenHierarchyModal,
  onToggleQuickPanel,
  onOpenAddWorker,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  // Dynamically get all worker keys in store
  const visibleWorkerKeys = Object.keys(workers).filter((key) => {
    if (selectedDeptFilter === 'all') return true;
    return workers[key]?.departmentId === selectedDeptFilter;
  });

  const totalWorkersCount = Object.keys(workers).length;

  return (
    <div className="relative flex-1 flex flex-col h-full bg-gradient-to-b from-[#F5F8F7] to-[#EEF3F1] p-4 sm:p-5 overflow-y-auto">
      {/* Soft Decorative Ambient Plant Leaf on Bottom-Left */}
      <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Welcome Header & Stats */}
      <WelcomeHeader stats={stats} onOpenNewJob={onOpenNewJob} />

      {/* Department Filter Bar & Token Optimization Ticker (Clearance & z-index ensure no speech bubble collision) */}
      <div className="relative z-30 max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/60 backdrop-blur-xs p-2 rounded-2xl border border-stone-200/60 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1 min-w-[280px]">
          <button
            onClick={() => setSelectedDeptFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDeptFilter === 'all'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200 font-extrabold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            🏢 全社フロア ({totalWorkersCount}名)
          </button>
          {departments.map((dept) => {
            const count = Object.values(workers).filter(
              (w) => w.departmentId === dept.id
            ).length;
            const isSelected = selectedDeptFilter === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-stone-900 shadow-2xs border border-stone-200 font-extrabold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                <span>{dept.icon}</span> {dept.name.split('・')[0]} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAddWorker && (
            <button
              onClick={onOpenAddWorker}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#E5F7F2] hover:bg-[#D1F2E8] text-[#187562] border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="新しい作業者を追加"
            >
              <span>➕</span>
              <span>作業者追加</span>
            </button>
          )}

          {onToggleQuickPanel && (
            <button
              onClick={onToggleQuickPanel}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold shadow-2xs transition-all shrink-0 cursor-pointer ${
                isQuickPanelOpen
                  ? 'bg-[#E5F7F2] text-[#229E85] border-emerald-300'
                  : 'bg-white/90 hover:bg-white text-stone-700 border-stone-200/80'
              }`}
            >
              <span>📋</span>
              <span>進行状況 {isQuickPanelOpen ? '閉じる' : '表示'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#3DB89E] text-white font-mono">
                {stats.inProgress}
              </span>
            </button>
          )}

          <button
            onClick={onOpenHierarchyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white border border-stone-200/80 rounded-xl text-xs font-bold text-[#187562] shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <TrendingDown className="w-3.5 h-3.5 text-[#3DB89E]" />
            <span>トークン約 -{tokenSavedPercentage}%</span>
            <span className="text-[10px] text-stone-400 ml-0.5">⚙️</span>
          </button>
        </div>
      </div>

      {/* AI Worker Desks Grid (pt-6 provides ample clearance for row-1 cards, responsive 1/2/3 columns) */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto w-full items-start my-auto pt-6 pb-6">
        {visibleWorkerKeys.map((key) => {
          const worker = workers[key];
          if (!worker) return null;
          const dept = departments.find((d) => d.id === worker.departmentId);
          return (
            <WorkerCard
              key={worker.id}
              worker={worker}
              departmentName={dept?.name}
              isSelected={selectedWorkerId === worker.id}
              animationsEnabled={animationsEnabled}
              onSelect={() => onSelectWorker(worker.id)}
            />
          );
        })}

        {/* Quick Add Worker Card on Floor */}
        {onOpenAddWorker && (
          <div
            onClick={onOpenAddWorker}
            className="group cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-[#3DB89E] rounded-3xl bg-white/40 hover:bg-white/80 transition-all duration-200 min-h-[190px] text-stone-500 hover:text-[#187562]"
          >
            <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-[#E5F7F2] flex items-center justify-center text-xl transition-colors mb-2 text-stone-400 group-hover:text-[#229E85]">
              ➕
            </div>
            <span className="text-xs font-bold">新しい作業者を配属</span>
            <span className="text-[10px] text-stone-400 mt-0.5 text-center">
              モデル・信念・MCPを設定
            </span>
          </div>
        )}
      </div>

      {/* Bottom Assistant Guidance Banner */}
      <AssistantBanner />
    </div>
  );
};
