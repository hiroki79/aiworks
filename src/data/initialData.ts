import {
  Worker,
  Task,
  ActivityLog,
  Department,
  CompanySettings,
  DeliverableItem,
  McpServerItem,
  AiModelItem,
} from '../types';

export const ASSISTANT_IMAGE = '/src/assets/images/assistant_guide_3d_1792308814384.jpg';

export const AVAILABLE_PROVIDERS = [
  'Anthropic',
  'OpenAI',
  'Google',
  'GitHub',
  'DeepSeek',
] as const;

export const AVAILABLE_MODELS = [
  { provider: 'Anthropic', name: 'Claude 3.7 Sonnet', tier: 'ace', cost: '標準/高品質' },
  { provider: 'Anthropic', name: 'Claude 3.5 Haiku', tier: 'utility', cost: '超軽量/低コスト' },
  { provider: 'OpenAI', name: 'GPT-4o', tier: 'ace', cost: 'マルチモーダル/高品質' },
  { provider: 'OpenAI', name: 'GPT-4o-mini', tier: 'utility', cost: '軽量/省トークン' },
  { provider: 'Google', name: 'Gemini 1.5 Pro', tier: 'ace', cost: '長文文脈/深層推論' },
  { provider: 'Google', name: 'Gemini 2.0 Flash', tier: 'utility', cost: '超高速/極小トークン' },
  { provider: 'DeepSeek', name: 'DeepSeek-R1', tier: 'ace', cost: '推論特化' },
  { provider: 'DeepSeek', name: 'DeepSeek-V3', tier: 'utility', cost: '高コスパ' },
];

export const INITIAL_AI_MODELS: AiModelItem[] = [
  { id: 'model-claude-37', provider: 'Anthropic', name: 'Claude 3.7 Sonnet', tier: 'ace', cost: '標準/高品質・思考モデル', status: 'active' },
  { id: 'model-claude-35-h', provider: 'Anthropic', name: 'Claude 3.5 Haiku', tier: 'utility', cost: '超軽量/低コスト・即時応答', status: 'active' },
  { id: 'model-gpt-4o', provider: 'OpenAI', name: 'GPT-4o', tier: 'ace', cost: 'マルチモーダル/高品質分析', status: 'active' },
  { id: 'model-gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o-mini', tier: 'utility', cost: '軽量/省トークン・定型処理', status: 'active' },
  { id: 'model-gemini-15-pro', provider: 'Google', name: 'Gemini 1.5 Pro', tier: 'ace', cost: '超長文文脈/深層要約', status: 'active' },
  { id: 'model-gemini-20-flash', provider: 'Google', name: 'Gemini 2.0 Flash', tier: 'utility', cost: '超高速/極小トークン', status: 'active' },
  { id: 'model-deepseek-r1', provider: 'DeepSeek', name: 'DeepSeek-R1', tier: 'ace', cost: '論理数学推論特化', status: 'active' },
  { id: 'model-deepseek-v3', provider: 'DeepSeek', name: 'DeepSeek-V3', tier: 'utility', cost: '高コストパフォーマンス', status: 'active' },
];

export const AVAILABLE_MCP_TOOLS = [
  { id: 'mcp-github', name: 'GitHub MCP', description: 'リポジトリ操作・Issue/PR作成・コード全文検索', icon: '🐙' },
  { id: 'mcp-fs', name: 'Filesystem MCP', description: 'ファイル読み書き・diff適用・プロジェクト構成解析', icon: '📁' },
  { id: 'mcp-brave', name: 'Brave Search MCP', description: 'Web一次情報検索・競合サービス最新動向スクレイピング', icon: '🔍' },
  { id: 'mcp-postgres', name: 'PostgreSQL MCP', description: 'DBスキーマ走査・SQLクエリ実行・データ抽出', icon: '🐘' },
  { id: 'mcp-puppeteer', name: 'Puppeteer MCP', description: 'Webブラウザ自動操作・画面キャプチャ・E2Eテスト', icon: '🌐' },
  { id: 'mcp-slack', name: 'Slack MCP', description: 'チャンネル通知・チーム要請・アラート発信', icon: '💬' },
  { id: 'mcp-snyk', name: 'Snyk Security MCP', description: 'パッケージ依存関係の既知脆弱性自動スキャン', icon: '🛡️' },
  { id: 'mcp-bigquery', name: 'BigQuery MCP', description: '大規模アクセスログ・売上データの高速集計', icon: '📊' },
];

export const INITIAL_MCP_SERVERS: McpServerItem[] = [
  { id: 'mcp-github', name: 'GitHub MCP', description: 'リポジトリ操作・Issue/PR作成・コード全文検索', icon: '🐙', status: 'active', command: 'npx @modelcontextprotocol/server-github' },
  { id: 'mcp-brave', name: 'Brave Search MCP', description: 'Web一次情報検索・競合サービス最新動向スクレイピング', icon: '🔍', status: 'active', command: 'npx @modelcontextprotocol/server-brave-search' },
  { id: 'mcp-fs', name: 'Filesystem MCP', description: 'ローカルファイル読み書き・diff適用・プロジェクト構成解析', icon: '📁', status: 'active', command: 'npx @modelcontextprotocol/server-filesystem /workspace' },
  { id: 'mcp-postgres', name: 'PostgreSQL MCP', description: 'DBスキーマ走査・SQLクエリ実行・データ抽出', icon: '🐘', status: 'active', command: 'npx @modelcontextprotocol/server-postgres postgresql://localhost/db' },
  { id: 'mcp-puppeteer', name: 'Puppeteer MCP', description: 'Webブラウザ自動操作・画面キャプチャ・E2Eテスト', icon: '🌐', status: 'active', command: 'npx @modelcontextprotocol/server-puppeteer' },
  { id: 'mcp-slack', name: 'Slack MCP', description: 'チャンネル通知・チーム要請・アラート発信', icon: '💬', status: 'active', command: 'npx @modelcontextprotocol/server-slack' },
  { id: 'mcp-snyk', name: 'Snyk Security MCP', description: 'パッケージ依存関係の既知脆弱性自動スキャン', icon: '🛡️', status: 'active', command: 'npx @snyk/mcp-server' },
  { id: 'mcp-bigquery', name: 'BigQuery MCP', description: '大規模アクセスログ・売上データの高速集計', icon: '📊', status: 'active', command: 'npx @google-cloud/mcp-bigquery' },
];

export const INITIAL_COMPANY: CompanySettings = {
  companyName: 'AIWorkers Studio 株式会社',
  philosophyPrompt: `【全社共通理念】
1. 顧客体験と実用性を最優先し、誠実・迅速・簡潔なアウトプットを提供する。
2. 冗長な前置きや社交辞令を排し、客観的事実と論理的根拠を明確に示す。
3. トークン消費（コスト）を組織資源として尊重し、エース（高精度推論）と雑用（軽量定型処理）の適材適所分担を遵守する。
4. 必要な外部システム連携は適切なMCP（Model Context Protocol）ツール経由で安全に行う。`,
  tokenOptimizationEnabled: true,
  tokenSavedPercentage: 68,
};

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-planning',
    name: '企画・プロダクト開発部',
    icon: '💡',
    description: '市場調査、UI/UX設計、企画書作成を推進するプロダクトの司令塔部門',
    policyPrompt: `【企画・プロダクト開発部 方針】
・顧客の根本課題を洞察し、競合優位性のある実現可能な要件へと落とし込む。
・感覚論ではなくファクトベースの市場データと直感的な使いやすさを両立させる。
・一次調査や資料整形など定型タスクは雑用担当に任せ、エースは企画の核と意思決定に集中する。
・外部調査はBrave Search MCPを活用し、最新のファクトを直接取得する。`,
    color: '#3DB89E',
  },
  {
    id: 'dept-engineering',
    name: 'テック・エンジニアリング部',
    icon: '💻',
    description: 'Web/API実装、型安全設計、セキュリティ監査を担う開発部門',
    policyPrompt: `【テック・エンジニアリング部 方針】
・型安全・クリーンアーキテクチャ・堅牢性を徹底追求する。
・セキュリティ脆弱性を未然に防ぎ、低レイテンシで保守性の高いコードを出力する。
・定型ボイラープレートや構文チェックは軽量モデルで即時処理し、複雑な設計はエースが担当する。
・GitHub MCPおよびFilesystem MCPによる安全なコード変更・差分適用を徹底する。`,
    color: '#0D9488',
  },
  {
    id: 'dept-strategy',
    name: '経営戦略・データ分析部',
    icon: '📊',
    description: '売上KPI、時系列分析、事業ロードマップを策定する戦略部門',
    policyPrompt: `【経営戦略・データ分析部 方針】
・定量的数値推移とKPI相関を厳密に可視化し、意思決定者が一目でリスクと機会を判断できるレポートを作成する。
・集計・データクリーニングは軽量モデルを活用し、推論・考察に大型モデルのトークンを充当する。
・PostgreSQL MCPおよびBigQuery MCPと直接連携し、信頼性の高い生データから直接可視化する。`,
    color: '#4F46E5',
  },
];

export const INITIAL_WORKERS: Record<string, Worker> = {
  leader: {
    id: 'w-leader',
    role: 'leader',
    name: 'リーダー',
    title: 'リーダー',
    subtitle: 'タスクの分解・進行管理',
    departmentId: 'dept-planning',
    rank: 'ace',
    serviceProvider: 'Anthropic',
    modelName: 'Claude 3.7 Sonnet',
    mcpEnabled: true,
    mcpTools: ['Slack MCP', 'GitHub MCP'],
    creedPrompt: `【リーダーの信念】
会社理念と部署方針を深く咀嚼し、ユーザーの要望を明確なステップに分解する。
エースと雑用の役割を正確に見極めてタスクを振り分け、トークン浪費を防ぎつつ最高品質を担保する。
チームの進行はSlack MCPを通じて即時共有する。`,
    image: '/src/assets/images/worker_leader_3d_1792308789145.jpg',
    status: 'working',
    statusLabel: '稼働中',
    speechBubble: 'みんなでがんばりましょう！',
    iconName: 'crown',
    bio: 'ユーザーの目標を分析し、最適なチーム編成とタスク分解を実施。全体の進捗管理と各AI作業者への連携指示を自律的に統括します。',
    tools: ['タスク自律分解', 'リソース最適化', 'マイルストーン管理', '合意形成'],
  },
  researcher: {
    id: 'w-researcher',
    role: 'researcher',
    name: '調査担当',
    title: '調査担当',
    subtitle: '情報収集・分析',
    departmentId: 'dept-planning',
    rank: 'utility',
    serviceProvider: 'Google',
    modelName: 'Gemini 2.0 Flash',
    mcpEnabled: true,
    mcpTools: ['Brave Search MCP', 'Puppeteer MCP'],
    creedPrompt: `【調査担当の信念】
推測を排し、Brave Search MCPで最新一次ソースを瞬時に探索する。
高額なトークンを使わず、超高速・低コストなモデルで要点のみを箇条書き抽出して後続へ渡す。`,
    image: '/src/assets/images/worker_researcher_3d_1792308790089.jpg',
    status: 'working',
    statusLabel: '作業中',
    iconName: 'search',
    bio: '国内外の市場データ、競合仕様、技術ドキュメントから重要ファクトを迅速に収集・要約し、次の作成フェーズへ引き渡します。',
    tools: ['Webリサーチ', '競合マトリクス生成', 'ファクト検証', '要約抽出'],
  },
  document: {
    id: 'w-document',
    role: 'document',
    name: '資料作成担当',
    title: '資料作成担当',
    subtitle: 'レポート・資料作成',
    departmentId: 'dept-planning',
    rank: 'utility',
    serviceProvider: 'OpenAI',
    modelName: 'GPT-4o-mini',
    mcpEnabled: false,
    mcpTools: ['Filesystem MCP'],
    creedPrompt: `【資料作成担当の信念】
指示されたファクトや数値を、誰が見ても分かりやすい清潔なMarkdownやスライド構成に整形する。
定型構造のドキュメント生成に特化し、コストを最小限に抑えながら美しい成果物に仕上げる。`,
    image: '/src/assets/images/worker_document_3d_1792308789978.jpg',
    status: 'awaiting_approval',
    statusLabel: '確認待ち',
    iconName: 'file-text',
    bio: '調査結果や分析数値を、社内外へそのまま提出できる美しいプレゼン資料、比較レポート、企画提案書として整理・執筆します。',
    tools: ['Markdown整形', 'スライド構成', '図表設計', 'エグゼクティブサマリー'],
  },
  programmer: {
    id: 'w-programmer',
    role: 'programmer',
    name: 'プログラミング担当',
    title: 'プログラミング担当',
    subtitle: '開発・テスト',
    departmentId: 'dept-engineering',
    rank: 'ace',
    serviceProvider: 'Anthropic',
    modelName: 'Claude 3.7 Sonnet',
    mcpEnabled: true,
    mcpTools: ['GitHub MCP', 'Filesystem MCP', 'PostgreSQL MCP'],
    creedPrompt: `【プログラミング担当の信念】
型安全で自己文書化された堅牢なコードを構築する。
GitHub MCPとFilesystem MCPを活用して正確な差分を生成し、難関ロジックには最高峰モデルを投じて1発でバグのない本番品質を納品する。`,
    image: '/src/assets/images/worker_programmer_3d_1792308790361.jpg',
    status: 'working',
    statusLabel: '稼働中',
    iconName: 'code',
    bio: '仕様に基づき、TypeScript/ReactなどのモダンフロントエンドやAPI実装、バグ修正、テスト自動化を自律的に担当します。',
    tools: ['コード自動生成', '静的解析・型検査', 'デバッグ・修正', 'API設計'],
  },
  security: {
    id: 'w-security',
    role: 'security',
    name: 'セキュリティ担当',
    title: 'セキュリティ担当',
    subtitle: '監査・リスク確認',
    departmentId: 'dept-engineering',
    rank: 'utility',
    serviceProvider: 'Google',
    modelName: 'Gemini 2.0 Flash',
    mcpEnabled: true,
    mcpTools: ['Snyk Security MCP', 'GitHub MCP'],
    creedPrompt: `【セキュリティ担当の信念】
Snyk Security MCPにより依存関係とコードの脆弱性を網羅的に高速スキャンする。
全ファイルをルーティン走査してもトークン費用が跳ね上がらないよう、最軽量モデルで確実なガードレールを敷く。`,
    image: '/src/assets/images/worker_security_3d_1792308813455.jpg',
    status: 'idle',
    statusLabel: '待機中',
    iconName: 'shield-check',
    bio: '生成コードやシステム構成のセキュリティ脆弱性、依存ライブラリのライセンス適合性、プライバシーリスクを厳しく監査します。',
    tools: ['脆弱性スキャン', 'アクセス制御検証', '機密情報漏洩検査', 'コンプライアンス監査'],
  },
  analyst: {
    id: 'w-analyst',
    role: 'analyst',
    name: 'アナリスト',
    title: 'アナリスト',
    subtitle: 'データ分析・可視化',
    departmentId: 'dept-strategy',
    rank: 'ace',
    serviceProvider: 'OpenAI',
    modelName: 'GPT-4o',
    mcpEnabled: true,
    mcpTools: ['BigQuery MCP', 'PostgreSQL MCP'],
    creedPrompt: `【アナリストの信念】
PostgreSQL MCPおよびBigQuery MCPから生データを抽出・多変量解析し、表層的な数字の奥にある構造的インサイトを見抜く。
高い論理思考力を持つ大型モデルで相関分析を行い、経営判断に直結する戦略シナリオを描き出す。`,
    image: '/src/assets/images/worker_analyst_3d_1792308812643.jpg',
    status: 'idle',
    statusLabel: '待機中',
    iconName: 'bar-chart-3',
    bio: '売上推移やアクセスログ、パフォーマンス数値を多角的に統計解析し、直感的なインサイトグラフやKPIダッシュボードを可視化します。',
    tools: ['時系列データ分析', 'チャート描画', '相関分析', 'KPIモデリング'],
  },
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-comp-report',
    title: '競合サービスの比較分析レポート',
    description: '添付した資料をもとに、主要サービスの違いをまとめてください。',
    status: 'in_progress',
    statusLabel: '進行中',
    flowRoles: ['leader', 'researcher', 'document'],
    difficulty: 'utility',
    progressPercent: 60,
    estimatedTime: '約20分',
    tokenSavingsRate: 72,
    deliverableTitle: '国内主要3社 SaaS機能・料金比較マトリクスレポート (v1.2)',
    deliverableContent: `【競合サービス比較分析レポート】
対象：国内主要3社
分析項目：機能スコア、導入容易性、月額費用、API連携性
連携MCPツール：Brave Search MCP
モデル分担：
・リーダー (Claude 3.7 Sonnet): タスク分解・最終サマリー指示
・調査担当 (Gemini 2.0 Flash [雑用]): Brave Search MCPで最新一次情報収集（トークン74%削減）
・資料作成担当 (GPT-4o-mini [雑用]): 定型Markdown整形（トークン68%削減）
結論：小規模組織向けには「設定不要ですぐ使える直感的な3画面UI」が最大の差別化要因。`,
  },
  {
    id: 'task-bug-fix',
    title: 'Webアプリのバグ修正',
    description: 'ログイン機能のエラーを修正してください。',
    status: 'in_progress',
    statusLabel: '作業中',
    flowRoles: ['leader', 'programmer'],
    difficulty: 'ace',
    progressPercent: 40,
    estimatedTime: '約35分',
    tokenSavingsRate: 35,
    deliverableTitle: 'OAuthセッショントークン再検証およびCookieハンドラー修正パッチ',
    deliverableContent: `【バグ修正サマリー】
対象：ログイン認証リダイレクト時のセッショントークン喪失
連携MCPツール：GitHub MCP, Filesystem MCP
モデル分担：
・プログラミング担当 (Claude 3.7 Sonnet [エース]): 難関暗号ロジック・PKCEハンドラーを深層推論で一発実装
・セキュリティ担当 (Gemini 2.0 Flash [雑用]): Snyk Security MCPで脆弱性を低トークンスキャン
検証：全テストケース（24/24）通過、エラー再現なし`,
  },
  {
    id: 'task-sales-graph',
    title: '売上データのグラフ作成',
    description: '添付のデータをもとに、月別の売上推移をグラフ化してください。',
    status: 'awaiting_approval',
    statusLabel: '確認待ち',
    flowRoles: ['leader', 'analyst', 'document'],
    difficulty: 'mixed',
    progressPercent: 75,
    estimatedTime: '約15分',
    tokenSavingsRate: 65,
    requiresApproval: true,
    approvalPrompt: '月別売上推移グラフとサマリーレポートの下書きが完成しました。確定して成果物として保存しますか？',
    deliverableTitle: '2026年度 Q1-Q3 月別売上推移＆カテゴリ別成長分析チャート',
    deliverableContent: `【売上分析レポートサマリー】
集計期間：2026年1月〜9月
連携MCPツール：PostgreSQL MCP, BigQuery MCP
モデル分担：
・アナリスト (GPT-4o [エース]): PostgreSQL MCPからデータ取得、多変量相関分析と売上ドライバーの深層考察
・資料作成担当 (GPT-4o-mini [雑用]): チャート用JSONデータ整形とテーブル作成（低コスト実行）
総合トークン削減効果：通常オール大型モデル比 -65% 抑制達成
承認完了後、PDFおよび高解像度画像としてダウンロード可能になります。`,
  },
];

export const INITIAL_DELIVERABLES: DeliverableItem[] = [
  {
    id: 'del-1',
    title: '新機能企画提案書（決定版）',
    author: '資料作成担当',
    dept: '企画・プロダクト開発部',
    date: '本日 11:30',
    type: 'PDF',
    size: '2.4 MB',
    tokenTier: '⚡ 低トークン生成 (GPT-4o-mini)',
    mcpGenerated: true,
    content: `# 新機能企画提案書 (決定版)
発行部門: 企画・プロダクト開発部
担当作業者: リーダー (Claude 3.7 Sonnet) / 資料作成担当 (GPT-4o-mini)

## 1. 提案の背景と顧客課題
中小規模組織における業務入力の負荷を軽減し、導入初日からの定着率を90%以上へ引き上げる直感UI/UXの構築。

## 2. コア仕様概要
- 直感的な3カラム構成（ナビゲーション / 仮想オフィス / タスク進捗）
- エース（深層推論）と雑用（定型処理）の自律分担によるトークンコスト-68%抑制
- 承認ゲートシステムによる安全な自律実行ガードレール

## 3. 次期スプリント目標
来月度βテスト開始、社内先行導入とフィードバック収集。`,
  },
  {
    id: 'del-2',
    title: '市場リサーチデータ一式 (Brave Search連携)',
    author: '調査担当',
    dept: '企画・プロダクト開発部',
    date: '本日 10:15',
    type: 'XLSX',
    size: '1.1 MB',
    tokenTier: '⚡ 高速・省トークン (Gemini 2.0 Flash)',
    mcpGenerated: true,
    content: `【市場リサーチデータ抽出結果】
取得元: Brave Search MCP
対象: 国内SaaS主要ベンダー5社
項目: 料金プラン、API対応状況、初期導入サポート、UI満足度スコア
結論: 高機能化に伴う画面の複雑化により、ユーザーの離脱が顕著。シンプルUIに強い勝機あり。`,
  },
  {
    id: 'del-3',
    title: 'OAuth2 セキュリティパッチ実装コード',
    author: 'プログラミング担当',
    dept: 'テック・エンジニアリング部',
    date: '昨日 17:40',
    type: 'TS',
    size: '4.8 MB',
    tokenTier: '⭐ エース深層推論 (Claude 3.7 Sonnet)',
    mcpGenerated: true,
    content: `// OAuth2 Session Token Handler Patch
// Implemented by プログラミング担当 (Claude 3.7 Sonnet) with GitHub MCP & Filesystem MCP
import { verifySessionToken, refreshWithPKCE } from './auth-service';

export async function handleSessionRefresh(req: Request): Promise<Response> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const verified = await verifySessionToken(token);
  if (!verified.valid) {
    return refreshWithPKCE(verified.refreshToken);
  }
  return new Response(JSON.stringify({ success: true }));
}`,
  },
  {
    id: 'del-4',
    title: 'API仕様書 (OpenAPI 3.1準拠)',
    author: '資料作成担当',
    dept: '企画・プロダクト開発部',
    date: '昨日 15:20',
    type: 'JSON',
    size: '420 KB',
    tokenTier: '⚡ 低トークン生成 (GPT-4o-mini)',
    mcpGenerated: false,
    content: `{
  "openapi": "3.1.0",
  "info": {
    "title": "AIWorkers Internal API",
    "version": "1.0.0"
  },
  "paths": {
    "/tasks/route": {
      "post": {
        "summary": "タスクの自動難易度判定およびエース/雑用モデルルーティング",
        "responses": { "200": { "description": "OK" } }
      }
    }
  }
}`,
  },
  {
    id: 'del-5',
    title: '月次セキュリティ監査報告書 (Snykスキャン)',
    author: 'セキュリティ担当',
    dept: 'テック・エンジニアリング部',
    date: '10月16日',
    type: 'PDF',
    size: '1.8 MB',
    tokenTier: '⚡ 定型自動スキャン (Gemini 2.0 Flash)',
    mcpGenerated: true,
    content: `【月次セキュリティ監査報告書】
スキャンツール: Snyk Security MCP
走査パッケージ数: 1,482
Critical: 0件
High: 0件
Medium: 1件 (パッチ適用済み)
Low: 2件
総評: セキュリティ基準適合。本番デプロイに支障なし。`,
  },
  {
    id: 'del-6',
    title: 'Q2 ユーザー継続率分析マップ (BigQuery抽出)',
    author: 'アナリスト',
    dept: '経営戦略・データ分析部',
    date: '10月15日',
    type: 'CSV',
    size: '890 KB',
    tokenTier: '⭐ エース高精度分析 (GPT-4o)',
    mcpGenerated: true,
    content: `Cohort,Month_1,Month_2,Month_3,Month_6,Retention_Rate
2026-04,94%,88%,85%,82%,82%
2026-05,95%,89%,86%,83%,83%
2026-06,96%,91%,88%,85%,85%
考察: チュートリアル完了ユーザーの継続率は非完了者と比較し+34%高い。オンボーディング強化を推奨。`,
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '11:42:10',
    workerName: 'リーダー',
    message: '「売上データのグラフ作成」のドラフトが完成しました。確認待ちです。',
    type: 'approval',
  },
  {
    id: 'log-2',
    timestamp: '11:38:05',
    workerName: 'プログラミング担当',
    message: 'GitHub MCPでOAuthエラーのPRを作成。エースモデルで即時実装を完了。',
    type: 'action',
  },
  {
    id: 'log-3',
    timestamp: '11:32:44',
    workerName: '調査担当',
    message: 'Brave Search MCPでWeb最新データを高速収集。トークン72%節約。',
    type: 'success',
  },
];
