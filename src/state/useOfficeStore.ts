import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Worker,
  Task,
  ActivityLog,
  Department,
  CompanySettings,
  WorkerRole,
  TaskStatus,
  WorkerRank,
  AIServiceProvider,
  McpServerItem,
  AiModelItem,
} from '../types';
import {
  INITIAL_COMPANY,
  INITIAL_DEPARTMENTS,
  INITIAL_WORKERS,
  INITIAL_TASKS,
  INITIAL_LOGS,
  INITIAL_MCP_SERVERS,
  INITIAL_AI_MODELS,
} from '../data/initialData';

export type MainNavTab = 'home' | 'tasks' | 'organization' | 'deliverables' | 'history';

export function useOfficeStore() {
  const [company, setCompany] = useState<CompanySettings>(() =>
    JSON.parse(JSON.stringify(INITIAL_COMPANY))
  );
  const [departments, setDepartments] = useState<Department[]>(() =>
    JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS))
  );
  const [workers, setWorkers] = useState<Record<string, Worker>>(() =>
    JSON.parse(JSON.stringify(INITIAL_WORKERS))
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    JSON.parse(JSON.stringify(INITIAL_TASKS))
  );
  const [logs, setLogs] = useState<ActivityLog[]>(() =>
    JSON.parse(JSON.stringify(INITIAL_LOGS))
  );
  const [mcpServers, setMcpServers] = useState<McpServerItem[]>(() =>
    JSON.parse(JSON.stringify(INITIAL_MCP_SERVERS))
  );
  const [aiModels, setAiModels] = useState<AiModelItem[]>(() =>
    JSON.parse(JSON.stringify(INITIAL_AI_MODELS))
  );

  const [activeNav, setActiveNav] = useState<MainNavTab>('home');
  const [activeRightTab, setActiveRightTab] = useState<'tasks' | 'deliverables'>('tasks');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>('all');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState<boolean>(false);
  const [isPromptHierarchyModalOpen, setIsPromptHierarchyModalOpen] = useState<boolean>(false);
  const [isMcpAiModalOpen, setIsMcpAiModalOpen] = useState<boolean>(false);
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState<boolean>(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const inProgressCount = tasks.filter(
      (t) => t.status === 'in_progress' || t.status === 'awaiting_approval'
    ).length;
    const completedCount = 12;
    const alertCount = tasks.filter((t) => t.status === 'awaiting_approval').length;
    return {
      inProgress: inProgressCount,
      completed: completedCount,
      alerts: alertCount,
    };
  }, [tasks]);

  // Logging
  const addLog = useCallback(
    (workerName: string, message: string, type: ActivityLog['type'] = 'info') => {
      const timeStr = new Date().toTimeString().split(' ')[0];
      const newLog: ActivityLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        workerName,
        message,
        type,
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 20)]);
    },
    []
  );

  // Stepper: slowly increments task progress when isRunning is true
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTasks((prevTasks) => {
          return prevTasks.map((task) => {
            if (task.status === 'in_progress') {
              if (task.progressPercent < 90) {
                return {
                  ...task,
                  progressPercent: Math.min(95, task.progressPercent + 5),
                };
              }
            }
            return task;
          });
        });
      }, 3000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Update Company Philosophy
  const updateCompanyPhilosophy = useCallback((philosophyPrompt: string, tokenSaving: boolean) => {
    setCompany((prev) => ({
      ...prev,
      philosophyPrompt,
      tokenOptimizationEnabled: tokenSaving,
    }));
    addLog('システム', '会社理念プロンプトを更新しました。全AI作業者へ反映されました。', 'action');
  }, [addLog]);

  // Update Department Policy
  const updateDepartmentPolicy = useCallback((deptId: string, policyPrompt: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === deptId ? { ...d, policyPrompt } : d))
    );
    const dept = departments.find((d) => d.id === deptId);
    addLog('リーダー', `「${dept?.name || '部署'}」の方針プロンプトを更新しました。`, 'action');
  }, [departments, addLog]);

  // Update Worker Settings (Rank, Model, Creed Prompt, Service Provider, MCP)
  const updateWorker = useCallback((workerKey: string, updates: Partial<Worker>) => {
    setWorkers((prev) => {
      const current = prev[workerKey];
      if (!current) return prev;
      const updated = { ...current, ...updates };
      return { ...prev, [workerKey]: updated };
    });
    addLog('リーダー', `作業者「${workers[workerKey]?.name || workerKey}」のモデル・信念・MCP設定を更新しました。`, 'action');
  }, [workers, addLog]);

  // Approve a pending task
  const approveTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'completed' as TaskStatus,
              statusLabel: '完了',
              progressPercent: 100,
            };
          }
          return t;
        })
      );

      setWorkers((ws) => ({
        ...ws,
        document: {
          ...ws.document,
          status: 'working',
          statusLabel: '稼働中',
        },
      }));

      addLog('リーダー', '売上データグラフ作成の承認を確認し、成果物を保存しました。', 'success');
    },
    [addLog]
  );

  // Create a new job with automatic tier routing (Ace vs Utility)
  const createNewJob = useCallback(
    (title: string, description: string, targetRank: 'ace' | 'utility' | 'mixed' = 'mixed') => {
      // Determine token savings based on model routing
      const savings = targetRank === 'utility' ? 76 : targetRank === 'mixed' ? 64 : 25;
      const assignedRoles: WorkerRole[] =
        targetRank === 'utility'
          ? ['leader', 'researcher', 'document']
          : targetRank === 'ace'
          ? ['leader', 'programmer', 'analyst']
          : ['leader', 'researcher', 'document'];

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description: description || '新規依頼の調査および資料作成を進めてください。',
        status: 'in_progress',
        statusLabel: '進行中',
        flowRoles: assignedRoles,
        difficulty: targetRank,
        progressPercent: 15,
        estimatedTime: '約25分',
        tokenSavingsRate: savings,
        deliverableTitle: `${title} 企画まとめレポート`,
        deliverableContent: `【${title}】\n依頼概要: ${description}\n判定ランク: ${
          targetRank === 'ace' ? '⭐ エース難関タスク' : targetRank === 'utility' ? '⚡ 雑用・定型タスク' : '🔄 複合タスク'
        }\nトークン削減効果: 約 -${savings}% 節約達成\nステータス: 最適なモデル配分で実行中です。`,
      };

      setTasks((prev) => [newTask, ...prev]);
      setIsNewJobModalOpen(false);
      addLog(
        'リーダー',
        `新しい依頼「${title}」を受領。${
          targetRank === 'utility' ? '雑用軽量モデル群' : 'エース推論モデル群'
        }へ最適ルーティングしました（トークン${savings}%削減見込み）。`,
        'action'
      );
    },
    [addLog]
  );

  // Department Management (Add / Delete)
  const addDepartment = useCallback((deptData: Omit<Department, 'id'>) => {
    const newId = `dept-${Date.now()}`;
    const newDept: Department = {
      id: newId,
      ...deptData,
    };
    setDepartments((prev) => [...prev, newDept]);
    addLog('リーダー', `新部署「${deptData.name}」を新設しました。`, 'action');
    return newId;
  }, [addLog]);

  const deleteDepartment = useCallback((deptId: string) => {
    const targetDept = departments.find((d) => d.id === deptId);
    if (!targetDept) return;
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    setWorkers((prev) => {
      const remainingDeptId = departments.find((d) => d.id !== deptId)?.id || '';
      const updated: Record<string, Worker> = {};
      Object.entries(prev).forEach(([key, w]) => {
        if (w.departmentId === deptId) {
          updated[key] = { ...w, departmentId: remainingDeptId };
        } else {
          updated[key] = w;
        }
      });
      return updated;
    });
    addLog('リーダー', `部署「${targetDept.name}」を削除・解散しました。`, 'action');
  }, [departments, addLog]);

  // Worker Management (Add / Delete)
  const addWorker = useCallback((workerData: Omit<Worker, 'id'> & { id?: string }) => {
    const newKey = workerData.id || `worker-${Date.now()}`;
    const newWorker: Worker = {
      ...workerData,
      id: newKey,
      status: workerData.status || 'idle',
      statusLabel: workerData.statusLabel || '待機中',
    };
    setWorkers((prev) => ({
      ...prev,
      [newKey]: newWorker,
    }));
    addLog('リーダー', `新しい作業者「${newWorker.name} (${newWorker.title})」が配属されました。`, 'action');
    return newKey;
  }, [addLog]);

  const deleteWorker = useCallback((workerKey: string) => {
    const target = workers[workerKey];
    if (!target) return;
    setWorkers((prev) => {
      const copy = { ...prev };
      delete copy[workerKey];
      return copy;
    });
    if (selectedWorkerId === workerKey) {
      setSelectedWorkerId(null);
    }
    addLog('リーダー', `作業者「${target.name} (${target.title})」を解任・削除しました。`, 'action');
  }, [workers, selectedWorkerId, addLog]);

  // MCP Server Management
  const toggleMcpServer = useCallback((mcpId: string) => {
    setMcpServers((prev) =>
      prev.map((s) => {
        if (s.id === mcpId) {
          const nextStatus = s.status === 'active' ? 'inactive' : 'active';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  }, []);

  const addMcpServer = useCallback((serverData: Omit<McpServerItem, 'id'>) => {
    const newId = `mcp-${Date.now()}`;
    const newServer: McpServerItem = {
      id: newId,
      ...serverData,
      isCustom: true,
    };
    setMcpServers((prev) => [...prev, newServer]);
    addLog('システム', `新しいMCPサーバー「${serverData.name}」を登録しました。`, 'action');
  }, [addLog]);

  const deleteMcpServer = useCallback((mcpId: string) => {
    setMcpServers((prev) => prev.filter((s) => s.id !== mcpId));
    addLog('システム', 'MCPサーバーを削除しました。', 'info');
  }, [addLog]);

  // AI Model Management
  const toggleAiModel = useCallback((modelId: string) => {
    setAiModels((prev) =>
      prev.map((m) => {
        if (m.id === modelId) {
          const nextStatus = m.status === 'active' ? 'inactive' : 'active';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  }, []);

  const addAiModel = useCallback((modelData: Omit<AiModelItem, 'id'>) => {
    const newId = `model-${Date.now()}`;
    const newModel: AiModelItem = {
      id: newId,
      ...modelData,
      isCustom: true,
    };
    setAiModels((prev) => [...prev, newModel]);
    addLog('システム', `新しいAIモデル「${modelData.name}」を登録しました。`, 'action');
  }, [addLog]);

  const deleteAiModel = useCallback((modelId: string) => {
    setAiModels((prev) => prev.filter((m) => m.id !== modelId));
    addLog('システム', 'AIモデルを削除しました。', 'info');
  }, [addLog]);

  const resetAll = useCallback(() => {
    setCompany(JSON.parse(JSON.stringify(INITIAL_COMPANY)));
    setDepartments(JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS)));
    setWorkers(JSON.parse(JSON.stringify(INITIAL_WORKERS)));
    setTasks(JSON.parse(JSON.stringify(INITIAL_TASKS)));
    setLogs(JSON.parse(JSON.stringify(INITIAL_LOGS)));
    setMcpServers(JSON.parse(JSON.stringify(INITIAL_MCP_SERVERS)));
    setAiModels(JSON.parse(JSON.stringify(INITIAL_AI_MODELS)));
    setSelectedWorkerId(null);
    setSelectedTaskId(null);
    addLog('リーダー', 'オフィスの状態および理念・方針プロンプトを初期値にリセットしました。', 'info');
  }, [addLog]);

  return {
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
    selectedDepartmentFilter,
    selectedWorkerId,
    selectedTaskId,
    isNewJobModalOpen,
    isPromptHierarchyModalOpen,
    isMcpAiModalOpen,
    isAddWorkerModalOpen,
    isAddDepartmentModalOpen,
    isRunning,
    animationsEnabled,
    setActiveNav,
    setActiveRightTab,
    setSelectedDepartmentFilter,
    setSelectedWorkerId,
    setSelectedTaskId,
    setIsNewJobModalOpen,
    setIsPromptHierarchyModalOpen,
    setIsMcpAiModalOpen,
    setIsAddWorkerModalOpen,
    setIsAddDepartmentModalOpen,
    setIsRunning,
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
  };
}
