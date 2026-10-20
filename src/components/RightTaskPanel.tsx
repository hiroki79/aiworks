import React from 'react';
import { Task, Worker, WorkerRole, DeliverableItem } from '../types';
import { INITIAL_DELIVERABLES } from '../data/initialData';
import {
  FileText,
  Code,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Download,
  Check,
} from 'lucide-react';

interface RightTaskPanelProps {
  tasks: Task[];
  workers: Record<string, Worker>;
  activeTab: 'tasks' | 'deliverables';
  selectedTaskId: string | null;
  className?: string;
  onClose?: () => void;
  onSelectTab: (tab: 'tasks' | 'deliverables') => void;
  onSelectTask: (taskId: string) => void;
  onApproveTask: (taskId: string) => void;
}

export const RightTaskPanel: React.FC<RightTaskPanelProps> = ({
  tasks,
  workers,
  activeTab,
  selectedTaskId,
  className,
  onClose,
  onSelectTab,
  onSelectTask,
  onApproveTask,
}) => {
  const getTaskIcon = (task: Task) => {
    if (task.title.includes('バグ') || task.title.includes('Web')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center font-mono font-bold text-xs shrink-0">
          {'</>'}
        </div>
      );
    }
    if (task.title.includes('グラフ') || task.title.includes('売上')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
          <BarChart3 className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4" />
      </div>
    );
  };

  const getStatusBadge = (status: Task['status'], statusLabel: string) => {
    switch (status) {
      case 'in_progress':
        if (statusLabel === '作業中') {
          return (
            <span className="text-[10px] font-bold text-[#3B82F6] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-blue-200">
              作業中
            </span>
          );
        }
        return (
          <span className="text-[10px] font-bold text-[#229E85] bg-[#E5F7F2] px-2 py-0.5 rounded-full border border-emerald-200">
            進行中
          </span>
        );
      case 'awaiting_approval':
        return (
          <span className="text-[10px] font-bold text-[#D97706] bg-[#FFF4E5] px-2 py-0.5 rounded-full border border-amber-300">
            確認待ち
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-emerald-300">
            完了
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            未着手
          </span>
        );
    }
  };

  return (
    <aside className={className || "w-80 h-full bg-[#FAFBFB] border-l border-stone-200/80 p-3.5 flex flex-col justify-between shrink-0 select-none overflow-hidden"}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Segment Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-2 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('tasks')}
              className={`text-xs font-bold transition-colors flex items-center gap-1.5 pb-1 relative ${
                activeTab === 'tasks' ? 'text-[#229E85]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <span>進行中のタスク</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'tasks' ? 'bg-[#229E85] text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {tasks.length}
              </span>
              {activeTab === 'tasks' && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#229E85] rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => onSelectTab('deliverables')}
              className={`text-xs font-bold transition-colors flex items-center gap-1.5 pb-1 relative ${
                activeTab === 'deliverables' ? 'text-[#229E85]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <span>最近の成果物</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'deliverables' ? 'bg-[#229E85] text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {INITIAL_DELIVERABLES.length}
              </span>
              {activeTab === 'deliverables' && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#229E85] rounded-full"></div>
              )}
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              title="パネルを閉じる"
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab 1: 進行中のタスク */}
        {activeTab === 'tasks' ? (
          <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
            {tasks.map((task) => {
              const isSelected = selectedTaskId === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className={`bg-white rounded-2xl p-3 border transition-all duration-200 cursor-pointer shadow-2xs hover:border-[#3DB89E] ${
                    isSelected
                      ? 'border-[#3DB89E] ring-2 ring-[#3DB89E]/20 shadow-xs'
                      : 'border-stone-200/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      {getTaskIcon(task)}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-800 leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(task.status, task.statusLabel)}
                  </div>

                  {/* Flow Avatars & Line */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[10px] text-stone-500 overflow-x-auto scrollbar-none">
                    {task.flowRoles.map((roleKey, idx) => {
                      const worker = workers[roleKey];
                      return (
                        <React.Fragment key={roleKey}>
                          <div className="flex items-center gap-1 shrink-0">
                            {worker?.image ? (
                              <img
                                src={worker.image}
                                alt={worker.name}
                                className="w-4 h-4 rounded-full object-cover border border-stone-200"
                              />
                            ) : null}
                            <span>{worker?.title || roleKey}</span>
                          </div>
                          {idx < task.flowRoles.length - 1 && (
                            <span className="text-stone-300">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Progress Bar & Estimated Time */}
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3DB89E] rounded-full transition-all duration-500"
                          style={{ width: `${task.progressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-stone-400 tabular-nums">
                        {task.progressPercent}%
                      </span>
                    </div>

                    <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                      {task.estimatedTime}
                    </span>
                  </div>

                  {/* If awaiting approval: Quick 1-click Approval button */}
                  {task.status === 'awaiting_approval' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApproveTask(task.id);
                      }}
                      className="mt-2.5 w-full py-1.5 bg-[#FFF4E5] hover:bg-[#FDE68A] text-[#D97706] hover:text-[#92400E] border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>成果物を確認・承認する</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab 2: 最近の成果物 */
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
            {INITIAL_DELIVERABLES.map((del: DeliverableItem) => (
              <div
                key={del.id}
                className="bg-white p-2.5 rounded-xl border border-stone-200/70 hover:border-stone-300 transition-colors flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-stone-800 truncate">
                    {del.title}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-2">
                    <span>{del.author}</span>
                    <span>·</span>
                    <span>{del.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                    {del.type}
                  </span>
                  <span className="text-[9px] text-[#229E85] font-mono px-1 py-0.5 bg-[#E5F7F2] rounded">
                    保存済
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-stone-200/70 text-center">
        <button
          onClick={() => onSelectTab('tasks')}
          className="text-xs font-bold text-[#229E85] hover:text-[#187562] inline-flex items-center gap-1 transition-colors"
        >
          <span>すべてのタスクを見る</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
