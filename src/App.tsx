/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOfficeStore } from './state/useOfficeStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OfficeFloor } from './components/OfficeFloor';
import { TasksView } from './components/TasksView';
import { DeliverablesView } from './components/DeliverablesView';
import { HistoryView } from './components/HistoryView';
import { RightTaskPanel } from './components/RightTaskPanel';
import { BottomBar } from './components/BottomBar';
import { NewJobModal } from './components/NewJobModal';
import { WorkerModal } from './components/WorkerModal';
import { TaskModal } from './components/TaskModal';
import { PromptHierarchyModal } from './components/PromptHierarchyModal';
import { OrganizationView } from './components/OrganizationView';
import { McpAiSettingsModal } from './components/McpAiSettingsModal';
import { AddWorkerModal } from './components/AddWorkerModal';
import { AddDepartmentModal } from './components/AddDepartmentModal';
import { Building2, CheckSquare, Monitor, LayoutGrid } from 'lucide-react';

export default function App() {
  const {
    company,
    departments,
    workers,
    tasks,
    logs,
    stats,
    mcpServers,
    aiModels,
    activeNav,
    activeRightTab,
    selectedWorkerId,
    selectedTaskId,
    isNewJobModalOpen,
    isPromptHierarchyModalOpen,
    isMcpAiModalOpen,
    isAddWorkerModalOpen,
    isAddDepartmentModalOpen,
    animationsEnabled,
    setActiveNav,
    setActiveRightTab,
    setSelectedWorkerId,
    setSelectedTaskId,
    setIsNewJobModalOpen,
    setIsPromptHierarchyModalOpen,
    setIsMcpAiModalOpen,
    setIsAddWorkerModalOpen,
    setIsAddDepartmentModalOpen,
    setAnimationsEnabled,
    updateCompanyPhilosophy,
    updateDepartmentPolicy,
    updateWorker,
    addDepartment,
    deleteDepartment,
    addWorker,
    deleteWorker,
    toggleMcpServer,
    addMcpServer,
    deleteMcpServer,
    toggleAiModel,
    addAiModel,
    deleteAiModel,
    approveTask,
    createNewJob,
    resetAll,
  } = useOfficeStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modalTargetWorkerId, setModalTargetWorkerId] = useState<string | null>(null);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  // Responsive layout: detect window width to handle compact screens (< 1080px)
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isCompact = windowWidth < 1080;
  const [compactPane, setCompactPane] = useState<'sidebar' | 'center' | 'tasks'>('center');

  const selectedWorker = selectedWorkerId
    ? Object.values(workers).find((w) => w.id === selectedWorkerId) || null
    : null;

  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId) || null
    : null;

  const handleOpenHierarchyForWorker = (workerId?: string) => {
    setModalTargetWorkerId(workerId || null);
    setIsPromptHierarchyModalOpen(true);
  };

  // Render the central view based on the active top/side navigation tab
  const renderCentralView = () => {
    switch (activeNav) {
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            workers={workers}
            onSelectTask={(taskId) => setSelectedTaskId(taskId)}
            onApproveTask={(taskId) => approveTask(taskId)}
            onOpenNewJob={() => setIsNewJobModalOpen(true)}
          />
        );
      case 'organization':
        return (
          <OrganizationView
            company={company}
            departments={departments}
            workers={workers}
            onOpenHierarchyModal={handleOpenHierarchyForWorker}
            onBackToOffice={() => setActiveNav('home')}
            onOpenAddDepartment={() => setIsAddDepartmentModalOpen(true)}
            onOpenAddWorker={() => setIsAddWorkerModalOpen(true)}
            onDeleteDepartment={deleteDepartment}
            onDeleteWorker={deleteWorker}
          />
        );
      case 'deliverables':
        return <DeliverablesView />;
      case 'history':
        return <HistoryView logs={logs} />;
      case 'home':
      default:
        return (
          <OfficeFloor
            workers={workers}
            departments={departments}
            stats={stats}
            tokenSavedPercentage={company.tokenSavedPercentage}
            selectedWorkerId={selectedWorkerId}
            animationsEnabled={animationsEnabled}
            isQuickPanelOpen={isRightDrawerOpen}
            onSelectWorker={(workerId) => setSelectedWorkerId(workerId)}
            onOpenNewJob={() => setIsNewJobModalOpen(true)}
            onOpenHierarchyModal={() => handleOpenHierarchyForWorker()}
            onToggleQuickPanel={() => setIsRightDrawerOpen((prev) => !prev)}
            onOpenAddWorker={() => setIsAddWorkerModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#FAFBFB] font-sans text-stone-800 select-none">
      {/* Top Header: AIWorkers */}
      <Header
        activeNav={activeNav}
        onSelectNav={(tab) => {
          setActiveNav(tab);
          if (isCompact) setCompactPane('center');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMcpAiSettings={() => setIsMcpAiModalOpen(true)}
      />

      {/* Responsive Segmented Pane Switcher for Compact Mode (< 1080px) */}
      {isCompact && (
        <div className="bg-white border-b border-stone-200/90 px-3 py-1.5 flex items-center justify-center gap-1.5 shrink-0 shadow-2xs z-10">
          <button
            onClick={() => setCompactPane('sidebar')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              compactPane === 'sidebar'
                ? 'bg-[#E5F7F2] text-[#229E85] shadow-2xs font-extrabold ring-1 ring-[#3DB89E]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>組織・作業者 ({Object.keys(workers).length})</span>
          </button>

          <button
            onClick={() => setCompactPane('center')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              compactPane === 'center'
                ? 'bg-[#E5F7F2] text-[#229E85] shadow-2xs font-extrabold ring-1 ring-[#3DB89E]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>メイン画面</span>
          </button>

          <button
            onClick={() => setCompactPane('tasks')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              compactPane === 'tasks'
                ? 'bg-[#E5F7F2] text-[#229E85] shadow-2xs font-extrabold ring-1 ring-[#3DB89E]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>タスク・進行 ({tasks.length})</span>
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {isCompact ? (
          /* Compact Mode: Switch cleanly between the 3 panes without squishing */
          <>
            {compactPane === 'sidebar' && (
              <Sidebar
                className="w-full h-full bg-[#FAFBFB] p-4 flex flex-col justify-between select-none overflow-y-auto"
                activeNav={activeNav}
                workers={workers}
                departments={departments}
                selectedWorkerId={selectedWorkerId}
                mcpServers={mcpServers}
                aiModels={aiModels}
                onSelectNav={(tab) => {
                  setActiveNav(tab);
                  setCompactPane('center');
                }}
                onSelectWorker={(workerId) => setSelectedWorkerId(workerId)}
                onOpenMcpAiModal={() => setIsMcpAiModalOpen(true)}
                onOpenAddDepartment={() => setIsAddDepartmentModalOpen(true)}
                onOpenAddWorker={() => setIsAddWorkerModalOpen(true)}
              />
            )}

            {compactPane === 'center' && (
              <div className="w-full h-full flex flex-col overflow-hidden">
                {renderCentralView()}
              </div>
            )}

            {compactPane === 'tasks' && (
              <RightTaskPanel
                className="w-full h-full bg-[#FAFBFB] p-4 flex flex-col justify-between select-none overflow-hidden"
                tasks={tasks}
                workers={workers}
                activeTab={activeRightTab}
                selectedTaskId={selectedTaskId}
                onClose={() => setCompactPane('center')}
                onSelectTab={(tab) => setActiveRightTab(tab)}
                onSelectTask={(taskId) => setSelectedTaskId(taskId)}
                onApproveTask={(taskId) => approveTask(taskId)}
              />
            )}
          </>
        ) : (
          /* Desktop Wide Mode: Multi-pane side-by-side */
          <>
            {/* Left Sidebar: Organization & Worker Tree */}
            <Sidebar
              activeNav={activeNav}
              workers={workers}
              departments={departments}
              selectedWorkerId={selectedWorkerId}
              mcpServers={mcpServers}
              aiModels={aiModels}
              onSelectNav={(tab) => setActiveNav(tab)}
              onSelectWorker={(workerId) => setSelectedWorkerId(workerId)}
              onOpenMcpAiModal={() => setIsMcpAiModalOpen(true)}
              onOpenAddDepartment={() => setIsAddDepartmentModalOpen(true)}
              onOpenAddWorker={() => setIsAddWorkerModalOpen(true)}
            />

            {/* Dedicated Central Workspace */}
            {renderCentralView()}

            {/* Right Task & Deliverables Panel: Shown on Home when user toggles quick panel */}
            {activeNav === 'home' && isRightDrawerOpen && (
              <RightTaskPanel
                tasks={tasks}
                workers={workers}
                activeTab={activeRightTab}
                selectedTaskId={selectedTaskId}
                onClose={() => setIsRightDrawerOpen(false)}
                onSelectTab={(tab) => setActiveRightTab(tab)}
                onSelectTask={(taskId) => setSelectedTaskId(taskId)}
                onApproveTask={(taskId) => approveTask(taskId)}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Status Bar */}
      <BottomBar />

      {/* New Job Modal with Ace/Utility Routing */}
      <NewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onSubmit={(title, desc, diff) => createNewJob(title, desc, diff)}
      />

      {/* 3-Tier Prompt Hierarchy & MCP Settings Modal */}
      <PromptHierarchyModal
        isOpen={isPromptHierarchyModalOpen}
        company={company}
        departments={departments}
        workers={workers}
        initialWorkerId={modalTargetWorkerId}
        onClose={() => {
          setIsPromptHierarchyModalOpen(false);
          setModalTargetWorkerId(null);
        }}
        onUpdateCompany={updateCompanyPhilosophy}
        onUpdateDepartment={updateDepartmentPolicy}
        onUpdateWorker={updateWorker}
      />

      {/* Worker Detail Modal with MCP tool assignment and Delete Action */}
      {selectedWorker && (
        <WorkerModal
          worker={selectedWorker}
          tasks={tasks}
          departments={departments}
          company={company}
          animationsEnabled={animationsEnabled}
          onClose={() => setSelectedWorkerId(null)}
          onSelectTask={(taskId) => setSelectedTaskId(taskId)}
          onOpenHierarchyModal={handleOpenHierarchyForWorker}
          onUpdateWorker={updateWorker}
          onDeleteWorker={deleteWorker}
        />
      )}

      {/* Task Deliverable Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          workers={workers}
          onClose={() => setSelectedTaskId(null)}
          onApprove={(taskId) => approveTask(taskId)}
        />
      )}

      {/* MCP & AI Model Settings Modal */}
      <McpAiSettingsModal
        isOpen={isMcpAiModalOpen}
        mcpServers={mcpServers}
        aiModels={aiModels}
        onClose={() => setIsMcpAiModalOpen(false)}
        onToggleMcpServer={toggleMcpServer}
        onAddMcpServer={addMcpServer}
        onDeleteMcpServer={deleteMcpServer}
        onToggleAiModel={toggleAiModel}
        onAddAiModel={addAiModel}
        onDeleteAiModel={deleteAiModel}
      />

      {/* Add Worker Modal */}
      <AddWorkerModal
        isOpen={isAddWorkerModalOpen}
        departments={departments}
        aiModels={aiModels}
        mcpServers={mcpServers}
        onClose={() => setIsAddWorkerModalOpen(false)}
        onAddWorker={addWorker}
      />

      {/* Add Department Modal */}
      <AddDepartmentModal
        isOpen={isAddDepartmentModalOpen}
        onClose={() => setIsAddDepartmentModalOpen(false)}
        onAddDepartment={addDepartment}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">設定 & 管理メニュー</h3>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-xs text-stone-700 font-medium">アニメーション効果</span>
              <button
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                  animationsEnabled
                    ? 'bg-[#E5F7F2] text-[#229E85]'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {animationsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <div>
                <span className="text-xs text-stone-700 font-medium block">
                  MCP & AIモデル設定
                </span>
                <span className="text-[10px] text-stone-400">
                  プロトコル接続 & モデル管理
                </span>
              </div>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsMcpAiModalOpen(true);
                }}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-[#E6F7F3] text-[#229E85] hover:bg-[#d4f2ea] cursor-pointer"
              >
                開く
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <div>
                <span className="text-xs text-stone-700 font-medium block">
                  3段階プロンプト設定
                </span>
                <span className="text-[10px] text-stone-400">
                  理念 × 方針 × 信念
                </span>
              </div>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsPromptHierarchyModalOpen(true);
                }}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-[#E6F7F3] text-[#229E85] hover:bg-[#d4f2ea] cursor-pointer"
              >
                開く
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-xs text-stone-700 font-medium">初期状態にリセット</span>
              <button
                onClick={() => {
                  resetAll();
                  setIsSettingsOpen(false);
                }}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
              >
                初期化
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 rounded-xl hover:bg-stone-200 cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
