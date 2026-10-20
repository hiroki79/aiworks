export type WorkerRole =
  | 'leader'
  | 'researcher'
  | 'document'
  | 'programmer'
  | 'security'
  | 'analyst';

export type WorkerStatus =
  | 'working' // 稼働中 / 作業中
  | 'awaiting_approval' // 確認待ち
  | 'idle' // 待機中
  | 'completed' // 完了
  | 'error'; // 要対応

export type TaskStatus =
  | 'in_progress' // 進行中 / 作業中
  | 'awaiting_approval' // 確認待ち
  | 'completed' // 完了
  | 'idle'; // 未着手

export type WorkerRank = 'ace' | 'utility'; // エース (高精度/大型モデル) vs 雑用 (低コスト/高速軽量モデル)

export type AIServiceProvider =
  | 'Anthropic'
  | 'OpenAI'
  | 'Google'
  | 'GitHub'
  | 'DeepSeek';

export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
  policyPrompt: string; // 2段階目：部署の方針（プロンプト）
  color: string;
}

export interface CompanySettings {
  companyName: string;
  philosophyPrompt: string; // 1段階目：会社全体の理念（プロンプト）
  tokenOptimizationEnabled: boolean; // エース・雑用自動振り分けによるトークン抑制フラグ
  tokenSavedPercentage: number; // トークン節約率
}

export interface Worker {
  id: string;
  role: WorkerRole;
  name: string;
  title: string;
  subtitle: string;
  departmentId: string; // 所属部署ID
  rank: WorkerRank; // エース vs 雑用
  serviceProvider: AIServiceProvider; // 使用サービス
  modelName: string; // 指定モデル (例: Claude 3.7 Sonnet, GPT-4o-mini)
  creedPrompt: string; // 3段階目：所属作業者の信念（プロンプト）
  mcpEnabled: boolean; // MCPツール利用の可否
  mcpTools: string[]; // 割り当てられたMCPサーバー・ツール (例: GitHub MCP, Filesystem MCP)
  image: string;
  status: WorkerStatus;
  statusLabel: string;
  speechBubble?: string;
  iconName: string;
  bio: string;
  tools: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  statusLabel: string;
  flowRoles: WorkerRole[];
  difficulty: 'ace' | 'utility' | 'mixed'; // エース向け難関業務か、雑用・ルーティンか
  progressPercent: number;
  estimatedTime: string;
  deliverableTitle: string;
  deliverableContent: string;
  requiresApproval?: boolean;
  approvalPrompt?: string;
  tokenSavingsRate?: number; // トークン節約率（例: 68%）
}

export interface DeliverableItem {
  id: string;
  title: string;
  author: string;
  dept: string;
  date: string;
  type: string;
  size: string;
  tokenTier: string;
  content: string;
  mcpGenerated?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  workerName: string;
  message: string;
  type: 'info' | 'action' | 'approval' | 'success';
}

export interface McpServerItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  command?: string;
  isCustom?: boolean;
}

export interface AiModelItem {
  id: string;
  provider: AIServiceProvider | string;
  name: string;
  tier: WorkerRank; // ace vs utility
  cost: string;
  status: 'active' | 'inactive';
  isCustom?: boolean;
}
