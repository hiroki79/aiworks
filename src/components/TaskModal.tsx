import React from 'react';
import { Task, Worker } from '../types';
import { X, Check, FileText, Users, Clock } from 'lucide-react';

interface TaskModalProps {
  task: Task | null;
  workers: Record<string, Worker>;
  onClose: () => void;
  onApprove?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  workers,
  onClose,
  onApprove,
}) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#F5F8F7] to-[#EAF5F2] border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F7F2] text-[#229E85]">
                {task.statusLabel}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                所要目安: {task.estimatedTime}
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900 mt-1 leading-snug">
              {task.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700">
          {/* Progress */}
          <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl flex items-center justify-between">
            <span className="font-bold text-stone-700">現在の進捗率</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3DB89E] rounded-full"
                  style={{ width: `${task.progressPercent}%` }}
                ></div>
              </div>
              <span className="font-mono font-bold text-stone-800 tabular-nums">
                {task.progressPercent}%
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="font-bold text-stone-800 block mb-1">依頼内容・背景:</span>
            <p className="text-stone-600 leading-relaxed bg-[#FAFBFB] p-3 rounded-2xl border border-stone-200/60">
              {task.description}
            </p>
          </div>

          {/* Assigned Team Flow */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-2">
              <Users className="w-3.5 h-3.5 text-[#229E85]" />
              <span>担当AI作業者の連携フロー:</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FAFBFB] p-3 rounded-2xl border border-stone-200/60 overflow-x-auto">
              {task.flowRoles.map((roleKey, idx) => {
                const worker = workers[roleKey];
                return (
                  <React.Fragment key={roleKey}>
                    <div className="flex items-center gap-2 shrink-0">
                      {worker?.image ? (
                        <img
                          src={worker.image}
                          alt={worker.name}
                          className="w-7 h-7 rounded-full object-cover border border-stone-200"
                        />
                      ) : null}
                      <span className="font-bold text-stone-800">
                        {worker?.title || roleKey}
                      </span>
                    </div>
                    {idx < task.flowRoles.length - 1 && (
                      <span className="text-stone-300 font-bold">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Deliverable Content */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#229E85]" />
              <span>成果物プレビュー: {task.deliverableTitle}</span>
            </div>
            <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {task.deliverableContent}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div>
            {task.status === 'awaiting_approval' && onApprove && (
              <button
                onClick={() => {
                  onApprove(task.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#3DB89E] hover:bg-[#34A88E] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>成果物を承認して保存する</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
