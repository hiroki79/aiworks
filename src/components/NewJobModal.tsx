import React, { useState } from 'react';
import { X, Sparkles, Send, Star, Zap, Cpu } from 'lucide-react';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, targetRank: 'ace' | 'utility' | 'mixed') => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'ace' | 'utility' | 'mixed'>('mixed');

  if (!isOpen) return null;

  const presets = [
    {
      title: '競合サービスの比較分析レポート',
      desc: '主要サービスの機能・価格マトリクスを抽出し、比較表を作成してください。',
      diff: 'utility' as const,
    },
    {
      title: 'OAuth2 認証脆弱性パッチの設計・実装',
      desc: 'PKCEフローに対応した安全なセッショントークンハンドラーを設計してください。',
      diff: 'ace' as const,
    },
    {
      title: '売上データのグラフ作成＆要因分析',
      desc: '月別の売上推移グラフを作成し、主要な成長ドライバーの考察をまとめてください。',
      diff: 'mixed' as const,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim(), difficulty);
    setTitle('');
    setDescription('');
  };

  const handleSelectPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setDescription(p.desc);
    setDifficulty(p.diff);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E5F7F2] text-[#229E85] flex items-center justify-center font-bold">
              ✨
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                新しい依頼を作成
              </h3>
              <p className="text-[11px] text-stone-400">
                リーダーが「理念 × 方針」に沿ってエース・雑用を自動選定し、トークンを抑えます。
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-bold text-stone-500 block mb-1.5">
              テンプレート例:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-[#E5F7F2] hover:text-[#229E85] rounded-xl border border-stone-200/60 transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              依頼タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 競合サービスの比較分析レポート"
              required
              className="w-full px-3.5 py-2.5 bg-[#FAFBFB] text-xs text-stone-900 placeholder:text-stone-400 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3DB89E]/50 focus:border-[#3DB89E]"
            />
          </div>

          {/* Difficulty & Token Routing Selector */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              業務の難易度・モデルルーティング（トークン制御）
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDifficulty('utility')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  difficulty === 'utility'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-300/40 font-bold'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>⚡ 雑用・定型</span>
                </div>
                <div className="text-[9px] text-stone-400 mt-1">
                  軽量モデル (Flash/mini)
                </div>
                <div className="text-[9px] font-bold text-emerald-600 mt-0.5">
                  トークン約 -75%
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('mixed')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  difficulty === 'mixed'
                    ? 'bg-[#E5F7F2] border-[#3DB89E] ring-2 ring-[#3DB89E]/40 font-bold'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1 text-[#229E85] text-xs font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>🔄 複合タスク</span>
                </div>
                <div className="text-[9px] text-stone-400 mt-1">
                  エース＋雑用で自動連携
                </div>
                <div className="text-[9px] font-bold text-[#229E85] mt-0.5">
                  トークン約 -65%
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('ace')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  difficulty === 'ace'
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300/40 font-bold'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1 text-amber-700 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>⭐ エース専任</span>
                </div>
                <div className="text-[9px] text-stone-400 mt-1">
                  大型推論モデル (Claude/GPT-4o)
                </div>
                <div className="text-[9px] font-bold text-amber-700 mt-0.5">
                  最高精度優先
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              依頼内容・添付指示
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="例: 添付した資料をもとに、主要サービスの違いをまとめてください。"
              className="w-full px-3.5 py-2.5 bg-[#FAFBFB] text-xs text-stone-900 placeholder:text-stone-400 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3DB89E]/50 focus:border-[#3DB89E]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl border border-stone-200"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#3DB89E] hover:bg-[#34A88E] disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>依頼を送信</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
