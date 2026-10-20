import React from 'react';
import { Worker } from '../types';

interface WorkerCardProps {
  worker: Worker;
  departmentName?: string;
  isSelected: boolean;
  animationsEnabled: boolean;
  onSelect: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  departmentName,
  isSelected,
  animationsEnabled,
  onSelect,
}) => {
  // Status style
  const getStatusBadge = () => {
    switch (worker.status) {
      case 'working':
        return {
          dot: 'bg-[#229E85]',
          bg: 'bg-[#E5F7F2]',
          text: 'text-[#229E85]',
          label: worker.statusLabel || '稼働中',
        };
      case 'awaiting_approval':
        return {
          dot: 'bg-[#F59E0B]',
          bg: 'bg-[#FFF4E5]',
          text: 'text-[#D97706]',
          label: worker.statusLabel || '確認待ち',
        };
      case 'completed':
        return {
          dot: 'bg-[#10B981]',
          bg: 'bg-[#ECFDF5]',
          text: 'text-[#059669]',
          label: '完了',
        };
      default:
        return {
          dot: 'bg-stone-400',
          bg: 'bg-stone-100',
          text: 'text-stone-500',
          label: '待機中',
        };
    }
  };

  const statusStyle = getStatusBadge();

  // Role icon representation
  const renderIcon = () => {
    switch (worker.role) {
      case 'leader':
        return <span className="text-amber-500">👑</span>;
      case 'researcher':
        return <span className="text-blue-500">ℹ️</span>;
      case 'document':
        return <span className="text-orange-500">📝</span>;
      case 'programmer':
        return <span className="text-teal-600">💻</span>;
      case 'security':
        return <span className="text-indigo-500">🛡️</span>;
      case 'analyst':
        return <span className="text-blue-600">📊</span>;
      default:
        return <span>👤</span>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer flex flex-col items-center transition-all duration-300 ${
        isSelected ? 'scale-[1.02] z-20' : 'hover:-translate-y-1'
      }`}
    >
      {/* Speech bubble for Leader or active worker (pointer-events-none prevents blocking clicks on organization bar) */}
      {worker.speechBubble && (
        <div className="absolute -top-7 z-20 px-3 py-1 bg-white rounded-2xl shadow-sm border border-stone-200/90 text-[11px] font-bold text-stone-700 whitespace-nowrap animate-bounce duration-1000 pointer-events-none select-none">
          <span>{worker.speechBubble}</span>
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-stone-200/90"></div>
        </div>
      )}

      {/* Top Floating Badge: Ace or Utility Rank */}
      <div className="absolute top-1 right-2 z-20">
        {worker.rank === 'ace' ? (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs flex items-center gap-1">
            <span>⭐</span>
            <span>エース</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs flex items-center gap-1">
            <span>⚡</span>
            <span>雑用・定型</span>
          </span>
        )}
      </div>

      {/* 3D Character Illustration on Desk */}
      <div className="relative w-full h-36 flex items-end justify-center overflow-visible z-10">
        <img
          src={worker.image}
          alt={worker.name}
          className={`h-36 w-36 object-contain rounded-2xl drop-shadow-md transition-transform duration-300 ${
            animationsEnabled && worker.status === 'working'
              ? 'group-hover:scale-105'
              : ''
          }`}
          loading="eager"
        />
      </div>

      {/* Bottom Info Card */}
      <div
        className={`w-full -mt-2 bg-white rounded-2xl p-3 pt-3.5 border transition-all duration-200 shadow-2xs flex flex-col justify-between ${
          isSelected
            ? 'border-[#3DB89E] ring-2 ring-[#3DB89E]/20 shadow-md'
            : 'border-stone-200/70 group-hover:border-stone-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              {renderIcon()}
              <span>{worker.title}</span>
            </div>
            {departmentName && (
              <span className="text-[9px] font-medium text-stone-400 truncate max-w-[80px]">
                {departmentName.split('・')[0]}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-400 mt-0.5">
            <span className="truncate">{worker.subtitle}</span>
            {worker.mcpEnabled && (
              <span className="shrink-0 text-[8px] font-bold font-mono px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                🔌 MCP
              </span>
            )}
          </div>
        </div>

        {/* Model Spec & Status Badge */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5">
          {/* Pill status badge */}
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
            <span>{statusStyle.label}</span>
          </div>

          {/* Model Name pill */}
          <span className="text-[9px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md truncate max-w-[110px]">
            {worker.modelName}
          </span>
        </div>
      </div>
    </div>
  );
};
