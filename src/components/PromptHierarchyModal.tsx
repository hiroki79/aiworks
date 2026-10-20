import React, { useState } from 'react';
import {
  CompanySettings,
  Department,
  Worker,
  WorkerRank,
  AIServiceProvider,
} from '../types';
import { AVAILABLE_MODELS, AVAILABLE_PROVIDERS, AVAILABLE_MCP_TOOLS } from '../data/initialData';
import {
  X,
  Building,
  Layers,
  Sparkles,
  Zap,
  Star,
  Check,
  Cpu,
  FileCode,
  Sliders,
  Plug,
} from 'lucide-react';

interface PromptHierarchyModalProps {
  isOpen: boolean;
  company: CompanySettings;
  departments: Department[];
  workers: Record<string, Worker>;
  initialWorkerId?: string | null;
  onClose: () => void;
  onUpdateCompany: (philosophyPrompt: string, tokenSaving: boolean) => void;
  onUpdateDepartment: (deptId: string, policyPrompt: string) => void;
  onUpdateWorker: (workerKey: string, updates: Partial<Worker>) => void;
}

export const PromptHierarchyModal: React.FC<PromptHierarchyModalProps> = ({
  isOpen,
  company,
  departments,
  workers,
  initialWorkerId,
  onClose,
  onUpdateCompany,
  onUpdateDepartment,
  onUpdateWorker,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 'preview'>(1);
  const [philosophyText, setPhilosophyText] = useState(company.philosophyPrompt);
  const [tokenOptimization, setTokenOptimization] = useState(company.tokenOptimizationEnabled);

  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'dept-planning');
  const [deptPolicyText, setDeptPolicyText] = useState<string>(
    departments[0]?.policyPrompt || ''
  );

  const [selectedWorkerKey, setSelectedWorkerKey] = useState<string>(
    initialWorkerId ? initialWorkerId.replace('w-', '') : 'leader'
  );

  const currentWorker = workers[selectedWorkerKey] || workers['leader'];
  const [workerCreed, setWorkerCreed] = useState(currentWorker?.creedPrompt || '');
  const [workerRank, setWorkerRank] = useState<WorkerRank>(currentWorker?.rank || 'ace');
  const [workerProvider, setWorkerProvider] = useState<AIServiceProvider>(
    currentWorker?.serviceProvider || 'Anthropic'
  );
  const [workerModel, setWorkerModel] = useState<string>(currentWorker?.modelName || 'Claude 3.7 Sonnet');
  const [workerMcpEnabled, setWorkerMcpEnabled] = useState<boolean>(currentWorker?.mcpEnabled ?? true);
  const [workerMcpTools, setWorkerMcpTools] = useState<string[]>(currentWorker?.mcpTools || []);

  if (!isOpen) return null;

  const currentDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const handleDeptSelect = (dept: Department) => {
    setSelectedDeptId(dept.id);
    setDeptPolicyText(dept.policyPrompt);
  };

  const handleWorkerSelect = (key: string) => {
    setSelectedWorkerKey(key);
    const w = workers[key];
    if (w) {
      setWorkerCreed(w.creedPrompt);
      setWorkerRank(w.rank);
      setWorkerProvider(w.serviceProvider);
      setWorkerModel(w.modelName);
      setWorkerMcpEnabled(w.mcpEnabled);
      setWorkerMcpTools(w.mcpTools);
    }
  };

  const toggleMcpTool = (toolName: string) => {
    setWorkerMcpTools((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName]
    );
  };

  const handleSaveCompany = () => {
    onUpdateCompany(philosophyText, tokenOptimization);
  };

  const handleSaveDept = () => {
    onUpdateDepartment(selectedDeptId, deptPolicyText);
  };

  const handleSaveWorker = () => {
    onUpdateWorker(selectedWorkerKey, {
      creedPrompt: workerCreed,
      rank: workerRank,
      serviceProvider: workerProvider,
      modelName: workerModel,
      mcpEnabled: workerMcpEnabled,
      mcpTools: workerMcpTools,
    });
  };

  const workerDepartment = departments.find((d) => d.id === currentWorker?.departmentId) || departments[0];
  const synthesizedPrompt = `### [階層1] 全社共通理念\n${company.philosophyPrompt}\n\n### [階層2] ${workerDepartment?.name} 方針\n${workerDepartment?.policyPrompt}\n\n### [階層3] ${currentWorker?.name} の信念 & 役割規範\n${currentWorker?.creedPrompt}\n\n【実効実行設定】\n・ランク: ${currentWorker?.rank === 'ace' ? '⭐ エース（高精度推論・難関タスク専任）' : '⚡ 雑用（低コスト軽量モデル・定型タスク専任）'}\n・使用サービス: ${currentWorker?.serviceProvider} / モデル: ${currentWorker?.modelName}\n・MCPツール連携: ${currentWorker?.mcpEnabled ? currentWorker?.mcpTools.join(', ') : '無効'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#F5F8F7] to-[#E6F7F3] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3DB89E] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                組織・3段階プロンプト & MCPツール設定
              </h3>
              <p className="text-[11px] text-stone-500">
                会社理念 → 部署方針 → 所属作業者の信念で統制し、エース・雑用とMCPで業務を最適化
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hierarchy Step Switcher */}
        <div className="px-5 pt-3 bg-stone-50/70 border-b border-stone-200/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setActiveStep(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeStep === 1
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-[#3DB89E]" />
              <span>① 会社全体の理念</span>
            </button>

            <span className="text-stone-300">→</span>

            <button
              onClick={() => setActiveStep(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeStep === 2
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>② 部署の方針</span>
            </button>

            <span className="text-stone-300">→</span>

            <button
              onClick={() => setActiveStep(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeStep === 3
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>③ 所属作業者の信念・モデル・MCP</span>
            </button>
          </div>

          <button
            onClick={() => setActiveStep('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all mb-2 ${
              activeStep === 'preview'
                ? 'bg-[#3DB89E] text-white shadow-xs'
                : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>合成プロンプト確認</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700 max-h-[60vh]">
          {/* STEP 1: 会社全体の理念 */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>🏢</span> 会社全体の基本理念（最高位プロンプト）
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    すべての部署および所属作業者が共通で遵守するマスター指示文です。
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#E6F7F3] px-3 py-1.5 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-[#229E85]">トークン最適化自動判別</span>
                  <button
                    onClick={() => setTokenOptimization(!tokenOptimization)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      tokenOptimization ? 'bg-[#3DB89E]' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        tokenOptimization ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              <textarea
                value={philosophyText}
                onChange={(e) => setPhilosophyText(e.target.value)}
                rows={7}
                className="w-full p-3.5 bg-[#FAFBFB] text-stone-800 font-mono text-xs border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3DB89E]/50 focus:border-[#3DB89E] leading-relaxed"
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-stone-400">
                  ※変更は全作業者の推論パイプラインへ即時反映されます。
                </span>
                <button
                  onClick={handleSaveCompany}
                  className="px-4 py-2 bg-[#3DB89E] hover:bg-[#34A88E] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>会社理念を保存</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: 部署の方針 */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span>🏬</span> 部署の方針（ミドルレイヤープロンプト）
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  特定の部署に属する作業者のみに適用される業務方針・品質基準です。
                </p>
              </div>

              {/* Department Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {departments.map((dept) => {
                  const isSelected = selectedDeptId === dept.id;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => handleDeptSelect(dept)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#E6F7F3] border-[#3DB89E] ring-2 ring-[#3DB89E]/20 font-bold'
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-base">{dept.icon}</div>
                      <div className="text-xs font-bold text-stone-800 mt-1">{dept.name}</div>
                      <div className="text-[10px] text-stone-400 font-normal line-clamp-1 mt-0.5">
                        {dept.description}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Policy Editor */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  「{currentDept?.name}」の方針プロンプト:
                </label>
                <textarea
                  value={deptPolicyText}
                  onChange={(e) => setDeptPolicyText(e.target.value)}
                  rows={6}
                  className="w-full p-3.5 bg-[#FAFBFB] text-stone-800 font-mono text-xs border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3DB89E]/50 focus:border-[#3DB89E] leading-relaxed"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-stone-400">
                  ※この部署に所属する全作業者に適用されます。
                </span>
                <button
                  onClick={handleSaveDept}
                  className="px-4 py-2 bg-[#3DB89E] hover:bg-[#34A88E] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>部署方針を保存</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 所属作業者の信念 & モデル・MCP指定 */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span>👤</span> 所属作業者の信念・モデル・MCPツール設定
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  作業者ごとのサービス・モデル、ランク（エース/雑用）、扱えるMCPツール、固有の信念プロンプトを設定します。
                </p>
              </div>

              {/* Worker Selector */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {Object.keys(workers).map((key) => {
                  const w = workers[key];
                  const isSelected = selectedWorkerKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleWorkerSelect(key)}
                      className={`flex items-center gap-2 p-2 px-3 rounded-2xl border shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#E6F7F3] border-[#3DB89E] ring-2 ring-[#3DB89E]/20'
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <img
                        src={w.image}
                        alt={w.name}
                        className="w-6 h-6 rounded-full object-cover border border-stone-200"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-stone-800">{w.title}</div>
                        <div className="text-[9px] text-stone-400">
                          {w.rank === 'ace' ? '⭐ エース' : '⚡ 雑用'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Worker Config Form */}
              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                {/* Rank Selector */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">
                    業務ランク（エース・雑用区分）
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWorkerRank('ace')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                        workerRank === 'ace'
                          ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-300/40 font-bold'
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-xs">⭐ エース担当</span>
                      <span className="text-[9px] text-stone-400 font-normal">
                        高難度・企画・判断
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWorkerRank('utility')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                        workerRank === 'utility'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-300/40 font-bold'
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      <span className="text-xs">⚡ 雑用・定型担当</span>
                      <span className="text-[9px] text-stone-400 font-normal">
                        下調べ・整形・省トークン
                      </span>
                    </button>
                  </div>
                </div>

                {/* Service Provider & Model */}
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      使用AIサービス (Provider)
                    </label>
                    <select
                      value={workerProvider}
                      onChange={(e) => setWorkerProvider(e.target.value as AIServiceProvider)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3DB89E]/50"
                    >
                      {AVAILABLE_PROVIDERS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      割り当て指定モデル (Model)
                    </label>
                    <select
                      value={workerModel}
                      onChange={(e) => setWorkerModel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#3DB89E]/50"
                    >
                      {AVAILABLE_MODELS.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name} ({m.cost})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* MCP Tool Permissions */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plug className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-stone-800">
                      MCP（Model Context Protocol）ツールの利用権限
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <span className="text-[11px] font-bold text-stone-600">
                      {workerMcpEnabled ? 'MCP有効' : 'MCP無効'}
                    </span>
                    <input
                      type="checkbox"
                      checked={workerMcpEnabled}
                      onChange={(e) => setWorkerMcpEnabled(e.target.checked)}
                      className="rounded text-[#3DB89E] focus:ring-[#3DB89E]"
                    />
                  </label>
                </div>

                {workerMcpEnabled && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {AVAILABLE_MCP_TOOLS.map((tool) => {
                      const isChecked = workerMcpTools.includes(tool.name);
                      return (
                        <label
                          key={tool.id}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleMcpTool(tool.name)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="truncate">{tool.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Creed Prompt */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  所属作業者の信念プロンプト（個人の行動原理）:
                </label>
                <textarea
                  value={workerCreed}
                  onChange={(e) => setWorkerCreed(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 bg-[#FAFBFB] text-stone-800 font-mono text-xs border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3DB89E]/50 focus:border-[#3DB89E] leading-relaxed"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-stone-400">
                  ※タスク割り当て時に自動でモデルとトークンが最適化されます。
                </span>
                <button
                  onClick={handleSaveWorker}
                  className="px-4 py-2 bg-[#3DB89E] hover:bg-[#34A88E] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>所属作業者の個別設定を保存</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 合成プロンプト確認プレビュー */}
          {activeStep === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>📑</span> 3段階合成プロンプト（実効システムプロンプト）
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    「{currentWorker?.name}」実行時にモデルへ実際に注入されるプロンプト全体の連結構造です。
                  </p>
                </div>
                <div className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
                  {currentWorker?.rank === 'ace' ? '⭐ エース推論' : '⚡ 雑用省トークン'}
                </div>
              </div>

              <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto border border-stone-800">
                {synthesizedPrompt}
              </div>

              <div className="p-3 bg-[#E6F7F3] rounded-2xl border border-emerald-200 flex items-center justify-between text-xs font-medium text-[#187562]">
                <span>
                  💡 雑用タスク（調査・整形）を軽量モデルに割り振り、MCPツールで直接外部連携することで、会社全体でトークン消費を平均 -68% 削減中。
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 transition-colors"
          >
            完了して閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
