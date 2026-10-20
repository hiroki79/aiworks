import React from 'react';
import { CompanySettings, Department, Worker } from '../types';
import {
  Building2,
  Layers,
  Cpu,
  Sparkles,
  Sliders,
  Star,
  Zap,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Plug,
  Plus,
  Trash2,
  UserPlus,
} from 'lucide-react';

interface OrganizationViewProps {
  company: CompanySettings;
  departments: Department[];
  workers: Record<string, Worker>;
  onOpenHierarchyModal: (workerId?: string) => void;
  onBackToOffice: () => void;
  onOpenAddDepartment?: () => void;
  onOpenAddWorker?: () => void;
  onDeleteDepartment?: (deptId: string) => void;
  onDeleteWorker?: (workerKey: string) => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  company,
  departments,
  workers,
  onOpenHierarchyModal,
  onBackToOffice,
  onOpenAddDepartment,
  onOpenAddWorker,
  onDeleteDepartment,
  onDeleteWorker,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFBFB] p-4 sm:p-6 overflow-y-auto select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E6F7F3] text-[#229E85]">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              組織構造 & 3段階プロンプト管理
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            会社理念 × 部署方針 × 所属作業者の信念で行動を統制し、エース・雑用の役割分担とMCPツールで業務を効率化
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenAddDepartment && (
            <button
              onClick={onOpenAddDepartment}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-bold rounded-2xl shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#229E85]" />
              <span>部署を追加</span>
            </button>
          )}

          {onOpenAddWorker && (
            <button
              onClick={onOpenAddWorker}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E5F7F2] hover:bg-[#D1F2E8] text-[#187562] border border-emerald-300 text-xs font-bold rounded-2xl shadow-2xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>作業者を追加</span>
            </button>
          )}

          <button
            onClick={() => onOpenHierarchyModal()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3DB89E] hover:bg-[#34A88E] text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3段階プロンプトを設定・編集</span>
          </button>
          <button
            onClick={onBackToOffice}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
          >
            オフィスへ戻る
          </button>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto w-full pb-8">
        {/* Layer 1: 会社全体の理念カード */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                階層 1
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                会社全体の理念（Philosophy Prompt）
              </h3>
            </div>

            {/* Token Saving Badge */}
            <div className="flex items-center gap-2 bg-[#E6F7F3] px-3 py-1 rounded-full border border-emerald-200 text-[#187562] text-xs font-bold self-start">
              <TrendingDown className="w-3.5 h-3.5 text-[#229E85]" />
              <span>エース・雑用自動振り分け中：トークン消費 約 -{company.tokenSavedPercentage}% 抑制</span>
            </div>
          </div>

          <div className="bg-[#FAFBFB] p-4 rounded-2xl border border-stone-200/60 font-mono text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
            {company.philosophyPrompt}
          </div>
        </div>

        {/* Layer 2: 部署一覧 & 部署の方針 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                階層 2
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                部署の方針（Department Policy Prompts）
              </h3>
            </div>

            {onOpenAddDepartment && (
              <button
                onClick={onOpenAddDepartment}
                className="flex items-center gap-1 text-xs font-bold text-[#229E85] hover:text-[#187562] hover:bg-emerald-50 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新規部署を設立</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const deptWorkers = Object.values(workers).filter(
                (w) => w.departmentId === dept.id
              );
              return (
                <div
                  key={dept.id}
                  className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-2xs flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{dept.icon}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          所属 {deptWorkers.length}名
                        </span>
                        {onDeleteDepartment && departments.length > 1 && (
                          <button
                            onClick={() => {
                              if (window.confirm(`部署「${dept.name}」を削除しますか？所属作業者は他の部署へ再配属されます。`)) {
                                onDeleteDepartment(dept.id);
                              }
                            }}
                            className="p-1 text-stone-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="部署を削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900">{dept.name}</h4>
                    <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                      {dept.description}
                    </p>

                    <div className="mt-3 bg-[#FAFBFB] p-3 rounded-xl border border-stone-100 text-[11px] text-stone-600 leading-relaxed font-mono line-clamp-4">
                      {dept.policyPrompt}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {deptWorkers.map((w) => (
                        <img
                          key={w.id}
                          src={w.image}
                          alt={w.name}
                          className="w-5 h-5 rounded-full object-cover border border-white"
                          title={w.name}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => onOpenHierarchyModal()}
                      className="text-[11px] font-bold text-[#229E85] hover:underline cursor-pointer"
                    >
                      方針を編集 →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Layer 3: 所属作業者・モデル・エース/雑用 & MCPツール一覧 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                階層 3
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                所属作業者の信念・モデル・MCPツール（エース／雑用の業務分担）
              </h3>
            </div>

            {onOpenAddWorker && (
              <button
                onClick={onOpenAddWorker}
                className="flex items-center gap-1 text-xs font-bold text-[#229E85] hover:text-[#187562] hover:bg-emerald-50 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>作業者を新規配属</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFB] border-b border-stone-200 text-[11px] font-bold text-stone-500">
                  <tr>
                    <th className="py-3 px-4">AI作業者</th>
                    <th className="py-3 px-3">所属部署</th>
                    <th className="py-3 px-3">役割ランク</th>
                    <th className="py-3 px-3">使用サービス / モデル</th>
                    <th className="py-3 px-3">MCPツール連携</th>
                    <th className="py-3 px-4">作業者の信念（行動指針）</th>
                    <th className="py-3 px-3 text-right">設定・操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {Object.keys(workers).map((key) => {
                    const w = workers[key];
                    const dept = departments.find((d) => d.id === w.departmentId);
                    return (
                      <tr key={w.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={w.image}
                              alt={w.name}
                              className="w-8 h-8 rounded-full object-cover border border-stone-200 shadow-2xs"
                            />
                            <div>
                              <div className="font-bold text-stone-900">{w.name}</div>
                              <div className="text-[10px] text-stone-400">{w.title}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-medium text-stone-600">
                          {dept?.name || '-'}
                        </td>

                        <td className="py-3 px-3">
                          {w.rank === 'ace' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>⭐ エース</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                              <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                              <span>⚡ 雑用・定型</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-mono text-[11px] font-bold text-stone-800">
                            {w.modelName}
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {w.serviceProvider}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {w.mcpEnabled ? (
                            <div className="flex flex-wrap gap-1">
                              {w.mcpTools.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-mono border border-blue-200"
                                >
                                  {t.replace(' MCP', '')}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-stone-400">未許可</span>
                          )}
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-mono text-[10px] text-stone-600 line-clamp-2 leading-relaxed">
                            {w.creedPrompt}
                          </p>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenHierarchyModal(w.id)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                              編集
                            </button>
                            {onDeleteWorker && Object.keys(workers).length > 1 && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`作業者「${w.name}」を削除しますか？`)) {
                                    onDeleteWorker(w.id);
                                  }
                                }}
                                className="p-1 text-stone-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                title="作業者を削除"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
