import React, { useState } from 'react';
import { Department } from '../types';
import { X, Building2, Plus, Sparkles } from 'lucide-react';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (dept: Omit<Department, 'id'>) => void;
}

const DEPT_ICONS = ['💡', '💻', '📊', '🎨', '🛡️', '🤝', '📣', '🔬', '⚖️', '🎯', '🚀', '📦'];

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onAddDepartment,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎨');
  const [description, setDescription] = useState('');
  const [policyPrompt, setPolicyPrompt] = useState(
    '【部署方針】\n・プロフェッショナルな品質基準を維持し、迅速に課題を解決する。\n・定型作業は軽量モデル、難関分析は深層推論モデルを活用する。\n・客観的事実と論理的根拠を明示してチーム連携を円滑にする。'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddDepartment({
      name: name.trim(),
      icon: icon || '🏢',
      description: description.trim() || `${name.trim()}の業務を推進する部門`,
      policyPrompt,
      color: '#3DB89E',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-[#FAFBFB] to-[#F0FAF7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5F7F2] text-[#229E85] flex items-center justify-center font-bold text-lg shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                新部署の設立・追加
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                組織階層に新しい部署を作成し、2段階目の「部署方針プロンプト」を設定します
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
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              部署アイコン
            </label>
            <div className="flex flex-wrap gap-2">
              {DEPT_ICONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                    icon === emoji
                      ? 'bg-[#E5F7F2] ring-2 ring-[#3DB89E] scale-110 shadow-xs'
                      : 'bg-stone-50 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              部署名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: デザイン・クリエイティブ部 / カスタマーサクセス部"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:ring-1 focus:ring-[#3DB89E]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              部署の職掌・ミッション概要
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: ブランドデザイン・プロトタイプ作成およびUIの品質保証"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#3DB89E]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-stone-700">
                部署の方針（2段階目プロンプト）
              </label>
              <span className="text-[10px] text-[#229E85] font-bold">階層 2</span>
            </div>
            <textarea
              rows={5}
              value={policyPrompt}
              onChange={(e) => setPolicyPrompt(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px] leading-relaxed focus:ring-1 focus:ring-[#3DB89E]"
              placeholder="この部署に所属する全作業者が遵守すべき方針・行動指針を記述してください"
            />
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
              部署を設立
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
