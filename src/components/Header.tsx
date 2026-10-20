import React from 'react';
import { MainNavTab } from '../state/useOfficeStore';
import {
  Home,
  CheckSquare,
  Building2,
  FileText,
  Clock,
  Settings,
  ChevronDown,
  Cpu,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  activeNav: MainNavTab;
  onSelectNav: (tab: MainNavTab) => void;
  onOpenSettings: () => void;
  onOpenMcpAiSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onSelectNav,
  onOpenSettings,
  onOpenMcpAiSettings,
}) => {
  const navTabs: { id: MainNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'ホーム', icon: <Home className="w-4 h-4" /> },
    { id: 'tasks', label: 'タスク一覧', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'organization', label: '組織・理念設定', icon: <Building2 className="w-4 h-4" /> },
    { id: 'deliverables', label: '成果物', icon: <FileText className="w-4 h-4" /> },
    { id: 'history', label: '履歴', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <header className="h-14 bg-white border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Brand Wordmark: AIWorkers */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#34A88E] to-[#4EC5AC] flex items-center justify-center text-white shadow-2xs font-bold text-xs">
          AI
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-stone-900 text-base tracking-tight leading-none">
            AIWorkers
          </span>
          <span className="text-[9px] text-stone-400 font-medium">
            仮想オフィススタジオ
          </span>
        </div>
      </div>

      {/* Center: Main Navigation Tabs (Scrollable on smaller screens) */}
      <nav className="flex items-center gap-4 sm:gap-6 h-full overflow-x-auto scrollbar-none px-2">
        {navTabs.map((tab) => {
          const isActive = activeNav === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectNav(tab.id)}
              className={`relative h-full flex items-center gap-1.5 px-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#2BA58B] font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className={isActive ? 'text-[#2BA58B]' : 'text-stone-400'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2BA58B] rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Settings and User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {onOpenMcpAiSettings && (
          <button
            onClick={onOpenMcpAiSettings}
            className="flex items-center gap-1 px-2.5 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            title="MCPサーバー & AIモデル設定"
          >
            <Cpu className="w-3.5 h-3.5 text-[#229E85]" />
            <span className="hidden md:inline">MCP・AI設定</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer"
          title="理念・最適化設定"
        >
          <Settings className="w-4 h-4 text-stone-500" />
          <span className="hidden sm:inline">理念設定</span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-stone-200">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-200 to-amber-100 border border-amber-300 flex items-center justify-center overflow-hidden text-xs">
            👦🏻
          </div>
          <span className="text-xs font-semibold text-stone-800 hidden lg:inline">山田 太郎</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:inline" />
        </div>
      </div>
    </header>
  );
};
