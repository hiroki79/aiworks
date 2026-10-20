import React from 'react';
import { ActivityLog } from '../types';
import {
  Clock,
  TrendingDown,
  CheckCircle2,
  Zap,
  Star,
  Activity,
  History as HistoryIcon,
} from 'lucide-react';

interface HistoryViewProps {
  logs: ActivityLog[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFBFB] p-6 overflow-y-auto select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#E6F7F3] text-[#229E85]">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              実行履歴 & トークン削減レポート
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            これまでの依頼履歴、AI作業者チームの活動ログ、およびエース・雑用モデルによるコスト抑制実績
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
            <span>累積節約トークン</span>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono mt-1">
            1.48M <span className="text-xs text-stone-400 font-normal">tokens</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">通常大型モデル比 -68.4%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
            <span>雑用モデル実行回数</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-[#229E85] font-mono mt-1">
            142 <span className="text-xs text-stone-400 font-normal">calls</span>
          </div>
          <span className="text-[10px] text-stone-400">Gemini Flash / mini中心</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
            <span>エース推論投入回数</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1">
            38 <span className="text-xs text-stone-400 font-normal">calls</span>
          </div>
          <span className="text-[10px] text-stone-400">重要ロジック・企画統合のみ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium">
            <span>MCP外部ツール呼出</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono mt-1">
            96 <span className="text-xs text-stone-400 font-normal">times</span>
          </div>
          <span className="text-[10px] text-stone-400">GitHub / Brave / Snyk等</span>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs">
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-[#229E85]" />
          <span>最新の活動タイムライン ({logs.length}件)</span>
        </h3>

        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-100">
          {logs.map((log) => {
            const getLogBadge = () => {
              switch (log.type) {
                case 'approval':
                  return 'bg-amber-100 text-amber-900 border-amber-300';
                case 'success':
                  return 'bg-emerald-100 text-emerald-900 border-emerald-300';
                case 'action':
                  return 'bg-blue-100 text-blue-900 border-blue-300';
                default:
                  return 'bg-stone-100 text-stone-700 border-stone-200';
              }
            };

            return (
              <div key={log.id} className="relative flex items-start gap-4 pl-8">
                {/* Dot */}
                <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#3DB89E] shadow-2xs"></div>

                <div className="flex-1 bg-[#FAFBFB] p-3 rounded-2xl border border-stone-200/60 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900">
                        {log.workerName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${getLogBadge()}`}
                      >
                        {log.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {log.message}
                    </p>
                  </div>

                  <span className="font-mono text-[10px] text-stone-400 shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
