import React, { useState } from 'react';
import { DeliverableItem } from '../types';
import { INITIAL_DELIVERABLES } from '../data/initialData';
import {
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const DeliverablesView: React.FC = () => {
  const [deliverables] = useState<DeliverableItem[]>(INITIAL_DELIVERABLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [mcpOnly, setMcpOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>('del-1');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Departments available in deliverables
  const departments = Array.from(new Set(deliverables.map((d) => d.dept)));

  // Filter deliverables
  const filtered = deliverables.filter((d) => {
    if (selectedFormat !== 'all' && d.type !== selectedFormat) return false;
    if (selectedDept !== 'all' && d.dept !== selectedDept) return false;
    if (mcpOnly && !d.mcpGenerated) return false;
    if (
      searchQuery &&
      !d.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.dept.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getFormatIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return '📄';
      case 'TS':
        return '💻';
      case 'XLSX':
        return '📊';
      case 'JSON':
        return '{ }';
      case 'CSV':
        return '📈';
      default:
        return '📝';
    }
  };

  const handleResetFilters = () => {
    setSelectedFormat('all');
    setSelectedDept('all');
    setMcpOnly(false);
    setSearchQuery('');
  };

  const isFiltered = selectedFormat !== 'all' || selectedDept !== 'all' || mcpOnly || searchQuery !== '';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFBFB] p-4 sm:p-6 overflow-y-auto select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E6F7F3] text-[#229E85]">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              成果物ライブラリ & ナレッジ
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            各作業者が「会社理念 × 部署方針 × 個人の信念」に沿って生成した完成ドキュメント・コード・分析レポート
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="成果物名・担当者・本文検索..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200/90 rounded-2xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3DB89E]/50 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Download toast notification */}
      {downloadToast && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Polished Filter Control Panel */}
      <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs mb-5 space-y-3">
        {/* Row 1: Format Badges and Department Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Format selector pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#229E85]" /> ファイル形式:
            </span>
            <button
              onClick={() => setSelectedFormat('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === 'all'
                  ? 'bg-[#229E85] text-white shadow-xs font-extrabold'
                  : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              すべて ({deliverables.length})
            </button>
            {['PDF', 'TS', 'XLSX', 'JSON', 'CSV'].map((type) => {
              const count = deliverables.filter((d) => d.type === type).length;
              const isSelected = selectedFormat === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedFormat(type)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#229E85] text-white shadow-xs font-extrabold'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>{getFormatIcon(type)}</span>
                  <span>{type}</span>
                  <span className={`text-[10px] ml-0.5 px-1 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'text-stone-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Department Filter & MCP Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="text-[11px] font-bold text-stone-500">部署:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-[#3DB89E] cursor-pointer"
              >
                <option value="all">全部署 ({deliverables.length})</option>
                {departments.map((dept) => {
                  const count = deliverables.filter((d) => d.dept === dept).length;
                  return (
                    <option key={dept} value={dept}>
                      {dept} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* MCP Only Toggle */}
            <button
              onClick={() => setMcpOnly((prev) => !prev)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                mcpOnly
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>🔌</span>
              <span>MCP連携のみ</span>
            </button>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                title="フィルターをリセット"
              >
                <RotateCcw className="w-3 h-3" />
                <span>クリア</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary Status */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span>表示中: <strong className="text-stone-800 font-bold">{filtered.length}</strong> 件</span>
            {selectedFormat !== 'all' && (
              <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">形式: {selectedFormat}</span>
            )}
            {selectedDept !== 'all' && (
              <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">{selectedDept}</span>
            )}
            {mcpOnly && (
              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">🔌 MCP連携のみ</span>
            )}
          </div>
          <span className="text-stone-400">クリックしてプレビュー全文・コードを展開</span>
        </div>
      </div>

      {/* Deliverable Items List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-700">該当する成果物が見つかりませんでした</h3>
          <p className="text-xs text-stone-400 mt-1 mb-4">
            検索キーワードまたはフィルター条件を変更してください
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-1.5 bg-[#229E85] text-white rounded-xl text-xs font-bold hover:bg-[#187562] transition-colors"
          >
            フィルターをリセット
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden transition-all hover:border-stone-300"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 cursor-pointer hover:bg-stone-50/70 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#E5F7F2] text-[#229E85] font-bold text-xs flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm">{getFormatIcon(item.type)}</span>
                      <span className="text-[9px] font-mono leading-none">{item.type}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-stone-900 truncate">
                          {item.title}
                        </h3>
                        {item.mcpGenerated && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            🔌 MCP連携
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-stone-600">{item.dept}</span>
                        <span>·</span>
                        <span>担当: {item.author}</span>
                        <span>·</span>
                        <span>{item.date}</span>
                        <span>·</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 hidden sm:inline-block">
                      {item.tokenTier}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDownloadToast(`「${item.title}」のダウンロードを開始しました`);
                        setTimeout(() => setDownloadToast(null), 2500);
                      }}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                      title="成果物をダウンロード"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <div className="text-stone-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Preview Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-stone-100 bg-[#FAFBFB]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-2">
                      <span>成果物プレビュー本文:</span>
                      <span className="text-stone-400 font-mono">Format: {item.type} · {item.size}</span>
                    </div>
                    <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto border border-stone-800">
                      {item.content}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
