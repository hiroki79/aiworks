import React, { useState } from 'react';
import { Department, Worker, WorkerRank, AIServiceProvider, WorkerRole, AiModelItem, McpServerItem } from '../types';
import { X, Sparkles, UserPlus, Check, Star, Zap } from 'lucide-react';

interface AddWorkerModalProps {
  isOpen: boolean;
  departments: Department[];
  aiModels: AiModelItem[];
  mcpServers: McpServerItem[];
  onClose: () => void;
  onAddWorker: (worker: Omit<Worker, 'id'>) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
];

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  isOpen,
  departments,
  aiModels,
  mcpServers,
  onClose,
  onAddWorker,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [role, setRole] = useState<WorkerRole>('analyst');
  const [rank, setRank] = useState<WorkerRank>('utility');
  const [serviceProvider, setServiceProvider] = useState<AIServiceProvider>('Anthropic');
  const [modelName, setModelName] = useState('Claude 3.7 Sonnet');
  const [creedPrompt, setCreedPrompt] = useState('【作業者の信念】\n・担当業務を迅速に遂行し、チーム全体のトークンコストを最小化します。\n・明確で実用的なアウトプットを重視します。');
  const [selectedMcpTools, setSelectedMcpTools] = useState<string[]>(['GitHub MCP']);
  const [avatarIndex, setAvatarIndex] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    onAddWorker({
      name: name.trim(),
      title: title.trim(),
      subtitle: subtitle.trim() || 'AIWorkers 新規配属作業者',
      departmentId: departmentId || departments[0]?.id || 'dept-planning',
      role,
      rank,
      serviceProvider,
      modelName,
      creedPrompt,
      mcpEnabled: selectedMcpTools.length > 0,
      mcpTools: selectedMcpTools,
      image: AVATAR_OPTIONS[avatarIndex],
      status: 'idle',
      statusLabel: '待機中',
      speechBubble: '新しく配属されました！よろしくお願いします。',
      iconName: role,
      bio: `${title}として配属されたAI作業者。${rank === 'ace' ? '高精度推論モデル' : '軽量定型処理モデル'}を使用。`,
      tools: ['AI Studio', ...selectedMcpTools],
    });

    onClose();
  };

  const toggleMcp = (toolName: string) => {
    setSelectedMcpTools((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-[#FAFBFB] to-[#F0FAF7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5F7F2] text-[#229E85] flex items-center justify-center font-bold text-lg shadow-2xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                新しい AI 作業者を配属・追加
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                所属部署、エース/雑用ランク、推論モデル、個人の信念プロンプト、MCPを設定
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Avatar & Basic Info */}
          <div className="flex gap-4 items-start">
            <div className="shrink-0">
              <label className="text-[11px] font-bold text-stone-600 block mb-1">
                アバター写真
              </label>
              <img
                src={AVATAR_OPTIONS[avatarIndex]}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#3DB89E] shadow-2xs"
              />
              <div className="flex gap-1 mt-2">
                {AVATAR_OPTIONS.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatarIndex(idx)}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      avatarIndex === idx ? 'bg-[#3DB89E] scale-125' : 'bg-stone-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  名前 / 呼び名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: マーケティング担当"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#3DB89E]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  役職・専門領域 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: データ分析 & 市場調査"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#3DB89E]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  サブタイトル (スキル・キャッチコピー)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="例: BigQuery分析 & レポート作成"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#3DB89E]"
                />
              </div>
            </div>
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                所属部署 <span className="text-red-500">*</span>
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:ring-1 focus:ring-[#3DB89E]"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                業務ロール種別
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as WorkerRole)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#3DB89E]"
              >
                <option value="leader">👑 リーダー / 進行管理</option>
                <option value="researcher">ℹ️ リサーチャー / 調査</option>
                <option value="document">📝 ドキュメント / 資料作成</option>
                <option value="programmer">💻 プログラマー / 開発</option>
                <option value="security">🛡️ セキュリティ / 監査</option>
                <option value="analyst">📊 アナリスト / 分析</option>
              </select>
            </div>
          </div>

          {/* Rank: Ace vs Utility */}
          <div className="pt-2 border-t border-stone-100">
            <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
              エース・雑用ランク区分（トークン最適配分）
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRank('ace')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  rank === 'ace'
                    ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>⭐ エース作業者</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  高度な思考・難関業務・意思決定を担当。大型推論モデルを使用。
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRank('utility')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  rank === 'utility'
                    ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Zap className="w-4 h-4 text-emerald-500 fill-emerald-400" />
                  <span>⚡ 雑用・定型作業者</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  一次調査・コード整形・定型要約を担当。軽量モデルでトークン節約。
                </p>
              </button>
            </div>
          </div>

          {/* Model & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                AIプロバイダ
              </label>
              <select
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value as AIServiceProvider)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#3DB89E]"
              >
                <option value="Anthropic">Anthropic</option>
                <option value="OpenAI">OpenAI</option>
                <option value="Google">Google</option>
                <option value="DeepSeek">DeepSeek</option>
                <option value="GitHub">GitHub</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                指定モデル
              </label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:ring-1 focus:ring-[#3DB89E]"
              >
                {aiModels.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.tier === 'ace' ? '⭐ エース' : '⚡ 雑用'}) - {m.provider}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Creed Prompt (Tier 3) */}
          <div className="pt-2 border-t border-stone-100">
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              所属作業者の信念（3段階目プロンプト）
            </label>
            <textarea
              rows={3}
              value={creedPrompt}
              onChange={(e) => setCreedPrompt(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px] leading-relaxed focus:ring-1 focus:ring-[#3DB89E]"
              placeholder="作業者が判断や回答を行う際の基本姿勢や行動規準を記述してください"
            />
          </div>

          {/* MCP Tools assignment */}
          <div className="pt-2 border-t border-stone-100">
            <label className="text-[11px] font-bold text-stone-700 block mb-1.5">
              この作業者に許可する MCP ツール
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mcpServers.map((server) => {
                const isSelected = selectedMcpTools.includes(server.name);
                return (
                  <button
                    type="button"
                    key={server.id}
                    onClick={() => toggleMcp(server.name)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{server.icon}</span>
                    <span className="truncate text-[10px] flex-1">{server.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#229E85] hover:bg-[#187562] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              作業者をオフィスへ配属
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
