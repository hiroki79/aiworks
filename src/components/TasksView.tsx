import React, { useState } from 'react';
import { Task, Worker } from '../types';
import {
  CheckSquare,
  Plus,
  Star,
  Zap,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  Check,
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  workers: Record<string, Worker>;
  onSelectTask: (taskId: string) => void;
  onApproveTask: (taskId: string) => void;
  onOpenNewJob: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  workers,
  onSelectTask,
  onApproveTask,
  onOpenNewJob,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterDifficulty !== 'all' && t.difficulty !== filterDifficulty) return false;
    return true;
  });

  const getStatusBadge = (status: Task['status'], label: string) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="text-[10px] font-bold text-[#229E85] bg-[#E5F7F2] px-2.5 py-0.5 rounded-full border border-emerald-200">
            進行中
          </span>
        );
      case 'awaiting_approval':
        return (
          <span className="text-[10px] font-bold text-[#D97706] bg-[#FFF4E5] px-2.5 py-0.5 rounded-full border border-amber-300">
            確認待ち
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-emerald-300">
            完了
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
            未着手
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFBFB] p-6 overflow-y-auto select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#E6F7F3] text-[#229E85]">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              タスク一覧 & 実行パイプライン
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            会社理念と部署方針に基づいて自動分解された業務と、エース・雑用の適材適所分担状況
          </p>
        </div>

        <button
          onClick={onOpenNewJob}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#3DB89E] hover:bg-[#34A88E] text-white text-xs font-bold rounded-2xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>新しいタスクを作成</span>
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-400">総タスク数</span>
          <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
            {tasks.length}件
          </div>
          <span className="text-[10px] text-stone-400">自律分解完了</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-400">進行中</span>
          <div className="text-2xl font-bold text-[#229E85] font-mono mt-1">
            {tasks.filter((t) => t.status === 'in_progress').length}件
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">モデル順調稼働中</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-400">要承認 (確認待ち)</span>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-1">
            {tasks.filter((t) => t.status === 'awaiting_approval').length}件
          </div>
          <span className="text-[10px] text-amber-600 font-medium">ユーザー承認ゲート</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-[11px] font-medium text-stone-400">平均トークン節約効果</span>
          <div className="text-2xl font-bold text-[#0D9488] font-mono mt-1">
            -68%
          </div>
          <span className="text-[10px] text-teal-600 font-medium">雑用軽量モデル活用</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between gap-4 mb-4">
        {/* Status Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-stone-400 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> 状態:
          </span>
          {[
            { id: 'all', label: 'すべて' },
            { id: 'in_progress', label: '進行中' },
            { id: 'awaiting_approval', label: '確認待ち' },
            { id: 'completed', label: '完了' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                filterStatus === f.id
                  ? 'bg-[#E5F7F2] text-[#229E85]'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Difficulty / Rank Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-stone-400 font-bold mr-1">ランク判定:</span>
          {[
            { id: 'all', label: 'すべて' },
            { id: 'utility', label: '⚡ 雑用・定型' },
            { id: 'mixed', label: '🔄 複合' },
            { id: 'ace', label: '⭐ エース専任' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterDifficulty(f.id)}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                filterDifficulty === f.id
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onSelectTask(task.id)}
            className="bg-white p-4 rounded-3xl border border-stone-200/80 hover:border-[#3DB89E] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900">{task.title}</h3>
                  {getStatusBadge(task.status, task.statusLabel)}

                  {task.difficulty === 'ace' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>⭐ エース推論</span>
                    </span>
                  ) : task.difficulty === 'utility' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                      <span>⚡ 雑用軽量モデル (-{task.tokenSavingsRate}%)</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-teal-600" />
                      <span>🔄 複合連携 (-{task.tokenSavingsRate}%)</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                  {task.description}
                </p>
              </div>

              {/* Progress & Time */}
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-stone-800 tabular-nums">
                  進捗: {task.progressPercent}%
                </span>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  所要: {task.estimatedTime}
                </div>
              </div>
            </div>

            {/* Bottom Row: Team Flow & Actions */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              {/* Workers Assigned & MCP Badges */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-stone-400 shrink-0">
                  担当フロー:
                </span>
                {task.flowRoles.map((roleKey, idx) => {
                  const worker = workers[roleKey];
                  return (
                    <React.Fragment key={roleKey}>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAFBFB] rounded-xl border border-stone-200 text-xs font-medium shrink-0">
                        <img
                          src={worker?.image}
                          alt={worker?.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="font-bold text-stone-800">{worker?.title}</span>
                        {worker?.mcpEnabled && (
                          <span className="text-[9px] px-1 bg-blue-50 text-blue-600 rounded-md font-mono">
                            🔌MCP
                          </span>
                        )}
                      </div>
                      {idx < task.flowRoles.length - 1 && (
                        <span className="text-stone-300 font-bold">→</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {task.status === 'awaiting_approval' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApproveTask(task.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#3DB89E] hover:bg-[#34A88E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>成果物を承認</span>
                  </button>
                )}

                <span className="text-xs font-bold text-[#229E85] flex items-center gap-1 hover:underline">
                  <FileText className="w-3.5 h-3.5" />
                  <span>成果物詳細</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
