import React, { useState } from 'react';
import { McpServerItem, AiModelItem, AIServiceProvider } from '../types';
import {
  X,
  Plus,
  Trash2,
  Check,
  Server,
  Cpu,
  Power,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';

interface McpAiSettingsModalProps {
  isOpen: boolean;
  mcpServers: McpServerItem[];
  aiModels: AiModelItem[];
  onClose: () => void;
  onToggleMcpServer: (id: string) => void;
  onAddMcpServer: (server: Omit<McpServerItem, 'id'>) => void;
  onDeleteMcpServer: (id: string) => void;
  onToggleAiModel: (id: string) => void;
  onAddAiModel: (model: Omit<AiModelItem, 'id'>) => void;
  onDeleteAiModel: (id: string) => void;
}

export const McpAiSettingsModal: React.FC<McpAiSettingsModalProps> = ({
  isOpen,
  mcpServers,
  aiModels,
  onClose,
  onToggleMcpServer,
  onAddMcpServer,
  onDeleteMcpServer,
  onToggleAiModel,
  onAddAiModel,
  onDeleteAiModel,
}) => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'ai'>('mcp');

  // New MCP Server form state
  const [isAddingMcp, setIsAddingMcp] = useState(false);
  const [newMcpName, setNewMcpName] = useState('');
  const [newMcpDesc, setNewMcpDesc] = useState('');
  const [newMcpIcon, setNewMcpIcon] = useState('🔌');
  const [newMcpCommand, setNewMcpCommand] = useState('');

  // New AI Model form state
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModelProvider, setNewModelProvider] = useState<AIServiceProvider>('Anthropic');
  const [newModelName, setNewModelName] = useState('');
  const [newModelTier, setNewModelTier] = useState<'ace' | 'utility'>('ace');
  const [newModelCost, setNewModelCost] = useState('標準/高品質');

  if (!isOpen) return null;

  const handleCreateMcp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMcpName.trim()) return;
    onAddMcpServer({
      name: newMcpName.trim(),
      description: newMcpDesc.trim() || 'カスタムMCPプロトコルサーバー',
      icon: newMcpIcon || '🔌',
      command: newMcpCommand.trim() || undefined,
      status: 'active',
      isCustom: true,
    });
    setNewMcpName('');
    setNewMcpDesc('');
    setNewMcpCommand('');
    setIsAddingMcp(false);
  };

  const handleCreateModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim()) return;
    onAddAiModel({
      provider: newModelProvider,
      name: newModelName.trim(),
      tier: newModelTier,
      cost: newModelCost || (newModelTier === 'ace' ? '高精度/深層推論' : '超軽量/低コスト'),
      status: 'active',
      isCustom: true,
    });
    setNewModelName('');
    setIsAddingModel(false);
  };

  const activeMcpCount = mcpServers.filter((s) => s.status === 'active').length;
  const activeAiCount = aiModels.filter((m) => m.status === 'active').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-[#FAFBFB] to-[#F0FAF7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5F7F2] text-[#229E85] flex items-center justify-center font-bold text-lg shadow-2xs">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                MCP サーバー & 利用可能 AI モデル設定
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                AI作業者が連携できる外部ツールプロトコルと推論モデルの接続設定
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

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 px-6 pt-3 gap-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('mcp')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'mcp' ? 'text-[#229E85]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>接続中 MCP サーバー</span>
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
              activeTab === 'mcp' ? 'bg-[#229E85] text-white' : 'bg-stone-100 text-stone-600'
            }`}>
              {activeMcpCount}/{mcpServers.length}
            </span>
            {activeTab === 'mcp' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229E85] rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'ai' ? 'text-[#229E85]' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>利用可能 AI モデル</span>
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
              activeTab === 'ai' ? 'bg-[#229E85] text-white' : 'bg-stone-100 text-stone-600'
            }`}>
              {activeAiCount}/{aiModels.length}
            </span>
            {activeTab === 'ai' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229E85] rounded-full"></div>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'mcp' ? (
            /* TAB 1: MCP SERVERS */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold text-stone-800">
                    登録済み MCP サーバー一覧
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Model Context Protocol経由で作業者が自律的に実行可能な外部サービスです
                  </p>
                </div>
                {!isAddingMcp && (
                  <button
                    onClick={() => setIsAddingMcp(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3DB89E] hover:bg-[#34A88E] text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>MCPサーバーを追加</span>
                  </button>
                )}
              </div>

              {/* Add MCP Form */}
              {isAddingMcp && (
                <form
                  onSubmit={handleCreateMcp}
                  className="bg-[#F5F8F7] p-4 rounded-2xl border border-emerald-200/80 mb-4 space-y-3 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between font-bold text-xs text-stone-800">
                    <span>新規 MCP サーバー接続設定</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingMcp(false)}
                      className="text-stone-400 hover:text-stone-700 text-xs"
                    >
                      キャンセル
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        アイコン
                      </label>
                      <input
                        type="text"
                        value={newMcpIcon}
                        onChange={(e) => setNewMcpIcon(e.target.value)}
                        placeholder="例: 🌐"
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#3DB89E]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        MCPサーバー名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newMcpName}
                        onChange={(e) => setNewMcpName(e.target.value)}
                        placeholder="例: Linear MCP / Notion MCP"
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#3DB89E]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">
                      役割・機能説明
                    </label>
                    <input
                      type="text"
                      value={newMcpDesc}
                      onChange={(e) => setNewMcpDesc(e.target.value)}
                      placeholder="例: チケット起票・プロジェクト進捗管理"
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#3DB89E]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">
                      起動コマンド / エンドポイント
                    </label>
                    <input
                      type="text"
                      value={newMcpCommand}
                      onChange={(e) => setNewMcpCommand(e.target.value)}
                      placeholder="例: npx -y @modelcontextprotocol/server-notion"
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-[#3DB89E]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingMcp(false)}
                      className="px-3 py-1.5 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-300"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#229E85] text-white text-xs font-bold rounded-xl hover:bg-[#187562] shadow-xs cursor-pointer"
                    >
                      接続を登録
                    </button>
                  </div>
                </form>
              )}

              {/* MCP Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mcpServers.map((server) => {
                  const isActive = server.status === 'active';
                  return (
                    <div
                      key={server.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-white border-stone-200/90 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl p-1 bg-stone-100 rounded-xl">{server.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900">{server.name}</span>
                              {server.isCustom && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                                  カスタム
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                              {server.description}
                            </p>
                          </div>
                        </div>

                        {/* Power Toggle Button */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onToggleMcpServer(server.id)}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                : 'bg-stone-200 text-stone-400 hover:bg-stone-300'
                            }`}
                            title={isActive ? 'サーバーを無効化' : 'サーバーを有効化'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          {server.isCustom && (
                            <button
                              onClick={() => onDeleteMcpServer(server.id)}
                              className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="サーバーを削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {server.command && (
                        <div className="mt-2 pt-2 border-t border-stone-100 font-mono text-[10px] text-stone-400 truncate">
                          $ {server.command}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TAB 2: AI MODELS */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold text-stone-800">
                    利用可能 AI モデル一覧
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    エース（深層推論）と雑用（軽量定型処理）のモデル区分とコスト仕様
                  </p>
                </div>
                {!isAddingModel && (
                  <button
                    onClick={() => setIsAddingModel(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3DB89E] hover:bg-[#34A88E] text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>AIモデルを追加</span>
                  </button>
                )}
              </div>

              {/* Add AI Model Form */}
              {isAddingModel && (
                <form
                  onSubmit={handleCreateModel}
                  className="bg-[#F5F8F7] p-4 rounded-2xl border border-emerald-200/80 mb-4 space-y-3 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between font-bold text-xs text-stone-800">
                    <span>新規 AI モデルの登録</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingModel(false)}
                      className="text-stone-400 hover:text-stone-700 text-xs"
                    >
                      キャンセル
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        サービスプロバイダ
                      </label>
                      <select
                        value={newModelProvider}
                        onChange={(e) => setNewModelProvider(e.target.value as AIServiceProvider)}
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-[#3DB89E]"
                      >
                        <option value="Anthropic">Anthropic</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="Google">Google</option>
                        <option value="DeepSeek">DeepSeek</option>
                        <option value="GitHub">GitHub</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        モデル名・識別子 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        placeholder="例: Claude 3.5 Sonnet / o3-mini"
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#3DB89E]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        業務ランク区分
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewModelTier('ace')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            newModelTier === 'ace'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs font-extrabold'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          ⭐ エース (深層推論)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewModelTier('utility')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            newModelTier === 'utility'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs font-extrabold'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          ⚡ 雑用・定型 (軽量)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        コスト・特徴説明
                      </label>
                      <input
                        type="text"
                        value={newModelCost}
                        onChange={(e) => setNewModelCost(e.target.value)}
                        placeholder="例: 超高速・極小トークン消費"
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#3DB89E]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingModel(false)}
                      className="px-3 py-1.5 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-300"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#229E85] text-white text-xs font-bold rounded-xl hover:bg-[#187562] shadow-xs cursor-pointer"
                    >
                      モデルを登録
                    </button>
                  </div>
                </form>
              )}

              {/* Models List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiModels.map((model) => {
                  const isActive = model.status === 'active';
                  const isAce = model.tier === 'ace';
                  return (
                    <div
                      key={model.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-white border-stone-200/90 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-stone-100 text-stone-700">
                              {model.provider}
                            </span>
                            <span className="text-xs font-bold text-stone-900">{model.name}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            {isAce ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1">
                                <span>⭐</span>
                                <span>エース (難関・深層推論)</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                                <span>⚡</span>
                                <span>雑用・定型 (軽量・低コスト)</span>
                              </span>
                            )}
                            <span className="text-[10px] text-stone-400 font-medium">
                              {model.cost}
                            </span>
                          </div>
                        </div>

                        {/* Power Toggle Button */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onToggleAiModel(model.id)}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                : 'bg-stone-200 text-stone-400 hover:bg-stone-300'
                            }`}
                            title={isActive ? 'モデルを無効化' : 'モデルを有効化'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          {model.isCustom && (
                            <button
                              onClick={() => onDeleteAiModel(model.id)}
                              className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="モデルを削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#229E85]" />
            <span>作業者編集画面で、各作業者に割り当てるMCPツールとAIモデルを自由に指定できます</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
};
