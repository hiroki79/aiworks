import React, { useState } from 'react';
import { MainNavTab } from '../state/useOfficeStore';
import { Worker, Department, McpServerItem, AiModelItem } from '../types';
import {
  Home,
  CheckSquare,
  Building2,
  FileText,
  Clock,
  ChevronDown,
  ChevronRight,
  Star,
  Zap,
  Search,
  ChevronUp,
  Settings,
  Plus,
  Users,
  Server,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  activeNav: MainNavTab;
  workers: Record<string, Worker>;
  departments: Department[];
  selectedWorkerId: string | null;
  className?: string;
  mcpServers?: McpServerItem[];
  aiModels?: AiModelItem[];
  onSelectNav: (tab: MainNavTab) => void;
  onSelectWorker: (workerId: string) => void;
  onOpenMcpAiModal?: () => void;
  onOpenAddDepartment?: () => void;
  onOpenAddWorker?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  workers,
  departments,
  selectedWorkerId,
  className,
  mcpServers = [],
  aiModels = [],
  onSelectNav,
  onSelectWorker,
  onOpenMcpAiModal,
  onOpenAddDepartment,
  onOpenAddWorker,
}) => {
  // State for expanded department sections (all open by default)
  const [expandedDeptIds, setExpandedDeptIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    departments.forEach((d) => {
      init[d.id] = true;
    });
    return init;
  });

  const [treeSearch, setTreeSearch] = useState('');
  const [isAllExpanded, setIsAllExpanded] = useState(true);
  const [bottomTab, setBottomTab] = useState<'mcp' | 'ai'>('mcp');

  const toggleDept = (deptId: string) => {
    setExpandedDeptIds((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const handleToggleExpandAll = () => {
    const nextState = !isAllExpanded;
    setIsAllExpanded(nextState);
    const updated: Record<string, boolean> = {};
    departments.forEach((d) => {
      updated[d.id] = nextState;
    });
    setExpandedDeptIds(updated);
  };

  const mainItems: { id: MainNavTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'home', label: 'ホーム', icon: <Home className="w-4 h-4" /> },
    { id: 'tasks', label: 'タスク一覧', icon: <CheckSquare className="w-4 h-4" />, count: 3 },
    { id: 'organization', label: '組織・理念設定', icon: <Building2 className="w-4 h-4" /> },
    { id: 'deliverables', label: '成果物', icon: <FileText className="w-4 h-4" />, count: 6 },
    { id: 'history', label: '履歴', icon: <Clock className="w-4 h-4" /> },
  ];

  const totalWorkers = Object.keys(workers).length;
  const activeMcpServers = mcpServers.filter((s) => s.status === 'active');
  const activeAiModels = aiModels.filter((m) => m.status === 'active');

  return (
    <aside className={className || "w-68 h-full bg-[#FAFBFB] border-r border-stone-200/80 p-3 flex flex-col justify-between shrink-0 select-none overflow-y-auto"}>
      <div className="space-y-4">
        {/* Main Navigation Tabs */}
        <div>
          <div className="text-[10px] font-bold text-stone-400 px-2 mb-1 uppercase tracking-wider">
            ナビゲーション
          </div>
          <nav className="space-y-0.5">
            {mainItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E5F7F2] text-[#229E85] shadow-2xs font-extrabold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#229E85]' : 'text-stone-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-[#229E85] text-white font-bold'
                          : 'bg-stone-200/80 text-stone-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tree View: 組織 & 所属作業者ツリー (組織アイコン使用、フォルダ不使用) */}
        <div className="pt-2 border-t border-stone-200/60">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#229E85]" />
              <span>組織・作業者ツリー</span>
            </span>
            <div className="flex items-center gap-1">
              {onOpenAddWorker && (
                <button
                  onClick={onOpenAddWorker}
                  title="作業者を新規追加"
                  className="p-1 text-stone-500 hover:text-[#229E85] hover:bg-emerald-50 rounded-md transition-colors cursor-pointer text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
              <span className="text-[9px] font-bold text-[#229E85] bg-[#E6F7F3] px-1.5 py-0.2 rounded-full font-mono">
                {totalWorkers}名
              </span>
              <button
                onClick={handleToggleExpandAll}
                title={isAllExpanded ? 'すべて折りたたむ' : 'すべて展開'}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-md transition-colors cursor-pointer"
              >
                {isAllExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Search inside Tree */}
          <div className="px-1 mb-2">
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                placeholder="作業者・MCPを検索..."
                className="w-full pl-7 pr-2.5 py-1 bg-white border border-stone-200/80 rounded-xl text-[11px] text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#3DB89E]"
              />
            </div>
          </div>

          {/* Root Node: AIWorkers 全社組織 */}
          <div className="space-y-1">
            <button
              onClick={() => onSelectNav('organization')}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors text-left group cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#229E85]" />
              <span className="truncate flex-1 text-[11px]">AIWorkers Studio 全社</span>
              <span className="text-[9px] text-[#229E85] bg-[#E6F7F3] px-1 py-0.2 rounded font-mono">
                理念設定
              </span>
            </button>

            {/* Department Nodes & Workers (組織アイコン dept.icon & Users を使用) */}
            <div className="ml-2 pl-2 border-l-2 border-stone-200/70 space-y-1 my-1">
              {departments.map((dept) => {
                const isExpanded = expandedDeptIds[dept.id] ?? true;
                const deptWorkers = Object.values(workers).filter(
                  (w) => w.departmentId === dept.id
                );

                // Filter workers by search query
                const filteredWorkers = deptWorkers.filter((w) => {
                  if (!treeSearch) return true;
                  const q = treeSearch.toLowerCase();
                  return (
                    w.name.toLowerCase().includes(q) ||
                    w.title.toLowerCase().includes(q) ||
                    w.rank.toLowerCase().includes(q) ||
                    (w.rank === 'ace' && 'エース'.includes(q)) ||
                    (w.rank === 'utility' && '雑用'.includes(q)) ||
                    w.mcpTools.some((t) => t.toLowerCase().includes(q))
                  );
                });

                if (treeSearch && filteredWorkers.length === 0) return null;

                return (
                  <div key={dept.id} className="rounded-xl overflow-hidden">
                    {/* Department Header with Organization Icon */}
                    <button
                      onClick={() => toggleDept(dept.id)}
                      className="w-full flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors text-left group cursor-pointer"
                    >
                      <span className="text-stone-400">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                      {/* Organization Icon representing Department */}
                      <span className="text-sm shrink-0">{dept.icon}</span>
                      <span className="truncate flex-1 text-[11px] font-semibold text-stone-800">
                        {dept.name.split('・')[0]}
                      </span>
                      <span className="text-[9px] text-stone-400 font-mono">
                        ({deptWorkers.length})
                      </span>
                    </button>

                    {/* Member Worker Children inside Department */}
                    {isExpanded && (
                      <div className="ml-3 pl-2 border-l border-stone-200/80 space-y-0.5 my-0.5">
                        {filteredWorkers.map((worker) => {
                          const isSelected = selectedWorkerId === worker.id;
                          return (
                            <button
                              key={worker.id}
                              onClick={() => onSelectWorker(worker.id)}
                              className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-[#E5F7F2] text-[#187562] ring-1 ring-[#3DB89E] font-bold shadow-2xs'
                                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                              }`}
                            >
                              <img
                                src={worker.image}
                                alt={worker.name}
                                className="w-4 h-4 rounded-full object-cover shrink-0 border border-stone-200"
                              />
                              <span className="truncate text-[11px] flex-1">
                                {worker.name}
                              </span>

                              {/* MCP Tool indicator */}
                              {worker.mcpEnabled && (
                                <span
                                  title={`利用可能MCP: ${worker.mcpTools.join(', ')}`}
                                  className="text-[8px] px-1 py-0.2 bg-blue-50 text-blue-700 rounded font-mono font-bold border border-blue-200 shrink-0"
                                >
                                  MCP
                                </span>
                              )}

                              {/* Rank Badge */}
                              {worker.rank === 'ace' ? (
                                <span
                                  title="エース（深層推論モデル）"
                                  className="text-[9px] text-amber-500 shrink-0 font-bold"
                                >
                                  ⭐
                                </span>
                              ) : (
                                <span
                                  title="雑用・定型（軽量低コストモデル）"
                                  className="text-[9px] text-emerald-600 shrink-0 font-bold"
                                >
                                  ⚡
                                </span>
                              )}

                              {/* Status Dot */}
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  worker.status === 'working'
                                    ? 'bg-emerald-500'
                                    : worker.status === 'awaiting_approval'
                                    ? 'bg-amber-500'
                                    : 'bg-stone-300'
                                }`}
                              ></span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MCP & AI Infrastructure Section (接続中MCPサーバー + 利用可能AIモデル + 設定UI) */}
        <div className="pt-2 border-t border-stone-200/60">
          <div className="flex items-center justify-between px-2 mb-2">
            {/* Toggle between MCP and AI in sidebar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBottomTab('mcp')}
                className={`text-[10px] font-bold pb-0.5 transition-colors cursor-pointer flex items-center gap-1 ${
                  bottomTab === 'mcp'
                    ? 'text-[#229E85] border-b-2 border-[#229E85]'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Server className="w-3 h-3" />
                <span>MCP ({activeMcpServers.length})</span>
              </button>
              <button
                onClick={() => setBottomTab('ai')}
                className={`text-[10px] font-bold pb-0.5 transition-colors cursor-pointer flex items-center gap-1 ${
                  bottomTab === 'ai'
                    ? 'text-[#229E85] border-b-2 border-[#229E85]'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>AIモデル ({activeAiModels.length})</span>
              </button>
            </div>

            {/* Quick Settings Gear button */}
            {onOpenMcpAiModal && (
              <button
                onClick={onOpenMcpAiModal}
                className="flex items-center gap-1 text-[10px] font-bold text-stone-500 hover:text-[#229E85] hover:bg-stone-100 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                title="MCP & AI設定を開く"
              >
                <Settings className="w-3 h-3" />
                <span>設定</span>
              </button>
            )}
          </div>

          {bottomTab === 'mcp' ? (
            /* Connected MCP Servers List */
            <div className="space-y-0.5 text-xs text-stone-600 max-h-36 overflow-y-auto">
              {activeMcpServers.slice(0, 5).map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between px-2 py-1 rounded-xl hover:bg-stone-100/60 transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[11px] truncate">
                    <span>{server.icon}</span>
                    <span className="truncate">{server.name}</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1 rounded shrink-0">
                    Active
                  </span>
                </div>
              ))}
              {activeMcpServers.length > 5 && (
                <button
                  onClick={onOpenMcpAiModal}
                  className="w-full text-center text-[10px] font-bold text-[#229E85] hover:underline pt-1 cursor-pointer"
                >
                  他 {activeMcpServers.length - 5} 件を表示...
                </button>
              )}
            </div>
          ) : (
            /* Available AI Models List */
            <div className="space-y-0.5 text-xs text-stone-600 max-h-36 overflow-y-auto">
              {activeAiModels.slice(0, 5).map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between px-2 py-1 rounded-xl hover:bg-stone-100/60 transition-colors"
                >
                  <span className="flex items-center gap-1 text-[11px] truncate">
                    <span className="text-[9px]">{model.tier === 'ace' ? '⭐' : '⚡'}</span>
                    <span className="truncate">{model.name}</span>
                  </span>
                  <span className="text-[9px] font-mono text-stone-500 bg-stone-100 px-1 rounded shrink-0">
                    {model.provider}
                  </span>
                </div>
              ))}
              {activeAiModels.length > 5 && (
                <button
                  onClick={onOpenMcpAiModal}
                  className="w-full text-center text-[10px] font-bold text-[#229E85] hover:underline pt-1 cursor-pointer"
                >
                  他 {activeAiModels.length - 5} 件を表示...
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
