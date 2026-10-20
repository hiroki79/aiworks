import React, { useState, useEffect } from 'react';
import { Worker, Task, Department, CompanySettings } from '../types';
import { AVAILABLE_MCP_TOOLS } from '../data/initialData';
import {
  X,
  Wrench,
  Award,
  Sparkles,
  Star,
  Zap,
  Sliders,
  Cpu,
  Plug,
  Check,
  Save,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface WorkerModalProps {
  worker: Worker | null;
  tasks: Task[];
  departments: Department[];
  company: CompanySettings;
  animationsEnabled: boolean;
  onClose: () => void;
  onSelectTask: (taskId: string) => void;
  onOpenHierarchyModal: (workerId: string) => void;
  onUpdateWorker?: (workerKey: string, updates: Partial<Worker>) => void;
  onDeleteWorker?: (workerId: string) => void;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({
  worker,
  tasks,
  departments,
  company,
  onClose,
  onSelectTask,
  onOpenHierarchyModal,
  onUpdateWorker,
  onDeleteWorker,
}) => {
  if (!worker) return null;

  // Local state for interactive MCP editing
  const [localMcpEnabled, setLocalMcpEnabled] = useState(worker.mcpEnabled);
  const [localMcpTools, setLocalMcpTools] = useState<string[]>(worker.mcpTools || []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync when worker changes
  useEffect(() => {
    setLocalMcpEnabled(worker.mcpEnabled);
    setLocalMcpTools(worker.mcpTools || []);
    setSaveSuccess(false);
  }, [worker]);

  const assignedTasks = tasks.filter((t) => t.flowRoles.includes(worker.role));
  const dept = departments.find((d) => d.id === worker.departmentId);
  const workerKey = worker.role;

  const handleToggleTool = (toolName: string) => {
    setLocalMcpTools((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName]
    );
    setSaveSuccess(false);
  };

  const handleSaveMcp = () => {
    if (onUpdateWorker) {
      onUpdateWorker(workerKey, {
        mcpEnabled: localMcpEnabled,
        mcpTools: localMcpTools,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#F5F8F7] to-[#EAF5F2] border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={worker.image}
              alt={worker.name}
              className="w-14 h-14 rounded-2xl object-contain bg-white border border-stone-200 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">{worker.title}</h3>
                {worker.rank === 'ace' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>⭐ エース</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                    <span>⚡ 雑用・定型</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-500 font-medium mt-0.5">
                {dept?.icon} {dept?.name} · {worker.subtitle}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700">
          {/* AI Model Spec Box */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-400 font-bold block">割り当てAIモデル:</span>
              <div className="font-mono text-xs font-bold text-stone-900 mt-0.5 flex items-center gap-2">
                <span>{worker.modelName}</span>
                <span className="text-[10px] font-normal text-stone-500 px-1.5 py-0.2 bg-white rounded-md border border-stone-200">
                  {worker.serviceProvider}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenHierarchyModal(worker.id);
              }}
              className="text-xs font-bold text-[#229E85] bg-[#E6F7F3] hover:bg-[#d5f3eb] px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>モデル・プロンプト変更</span>
            </button>
          </div>

          {/* Interactive MCP Tool Configuration (社員ごとにMCPを扱えるようにする) */}
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-4 rounded-2xl border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  🔌
                </span>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    作業者別 MCP（Model Context Protocol）設定
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    この作業者が直接呼び出せるMCPツールを選択してください
                  </p>
                </div>
              </div>

              {/* MCP Toggle */}
              <button
                type="button"
                onClick={() => {
                  setLocalMcpEnabled(!localMcpEnabled);
                  setSaveSuccess(false);
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  localMcpEnabled ? 'bg-blue-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    localMcpEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {localMcpEnabled ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_MCP_TOOLS.map((tool) => {
                    const isChecked = localMcpTools.includes(tool.name);
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => handleToggleTool(tool.name)}
                        className={`p-2 rounded-xl text-left transition-all border flex items-start gap-2 ${
                          isChecked
                            ? 'bg-white border-blue-400 ring-2 ring-blue-400/20 shadow-2xs'
                            : 'bg-white/60 border-stone-200 hover:border-stone-300 opacity-60'
                        }`}
                      >
                        <span className="text-base shrink-0">{tool.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-800 truncate">
                              {tool.name}
                            </span>
                            {isChecked && (
                              <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3] shrink-0" />
                            )}
                          </div>
                          <p className="text-[9px] text-stone-500 truncate mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Save MCP settings button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-stone-500 font-medium">
                    選択中: <strong className="text-blue-700">{localMcpTools.length}個</strong> のMCPツール
                  </span>

                  <button
                    onClick={handleSaveMcp}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                  >
                    {saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                        <span>保存完了！</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>この作業者のMCP設定を保存</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white/70 rounded-xl border border-stone-200 text-stone-400 text-center">
                この作業者に対するMCPツール連携は現在無効化されています。上のスイッチをONにするとツールを割り当てられます。
              </div>
            )}
          </div>

          {/* 3-Tier Prompt Stack Overview */}
          <div className="bg-[#FAFBFB] p-3.5 rounded-2xl border border-stone-200/70 space-y-2.5">
            <span className="font-bold text-stone-900 text-xs block mb-1">
              3段階プロンプト注入構成:
            </span>

            {/* Level 1 */}
            <div className="flex items-start gap-2">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                ① 会社理念
              </span>
              <p className="text-[11px] text-stone-600 line-clamp-1">
                {company.philosophyPrompt.split('\n')[1] || company.philosophyPrompt}
              </p>
            </div>

            {/* Level 2 */}
            <div className="flex items-start gap-2">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800 shrink-0 mt-0.5">
                ② 部署方針
              </span>
              <p className="text-[11px] text-stone-600 line-clamp-1">
                {dept?.policyPrompt.split('\n')[1] || dept?.policyPrompt}
              </p>
            </div>

            {/* Level 3 */}
            <div className="flex items-start gap-2">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 shrink-0 mt-0.5">
                ③ 作業者の信念
              </span>
              <p className="text-[11px] text-stone-700 font-medium line-clamp-2 leading-relaxed">
                {worker.creedPrompt}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1 text-xs">
              <Award className="w-3.5 h-3.5 text-[#229E85]" />
              <span>役割・担当業務</span>
            </div>
            <p className="text-stone-600 leading-relaxed bg-[#FAFBFB] p-3 rounded-2xl border border-stone-200/60">
              {worker.bio}
            </p>
          </div>

          {/* Tools */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1.5 text-xs">
              <Wrench className="w-3.5 h-3.5 text-[#229E85]" />
              <span>得意分野 & スキル</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {worker.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-[11px] font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Tasks */}
          {assignedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-2 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#229E85]" />
                <span>担当中のタスク ({assignedTasks.length}件)</span>
              </div>
              <div className="space-y-1.5">
                {assignedTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onClose();
                      onSelectTask(t.id);
                    }}
                    className="p-2.5 bg-stone-50 hover:bg-[#E5F7F2] rounded-xl border border-stone-200/80 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-stone-800 block text-xs">
                        {t.title}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        進捗: {t.progressPercent}% · {t.statusLabel}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#229E85] font-bold">
                      詳細を見る →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete Worker Action */}
          {onDeleteWorker && (
            <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-700 block">作業者の解任・削除</span>
                <span className="text-[10px] text-stone-400">この作業者をオフィスおよび組織ツリーから除名します</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`作業者「${worker.name} (${worker.title})」を本当に解任・削除しますか？`)) {
                    onDeleteWorker(worker.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>作業者を削除</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
