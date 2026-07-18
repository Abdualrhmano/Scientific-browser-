// ============================================
// أنواع البحث والنتائج
// ============================================

/** مصدر البحث العلمي */
export type SearchSource = 'arxiv' | 'pubmed' | 'semantic_scholar' | 'doaj' | 'crossref';

/** عوامل البحث المنطقية */
export type BooleanOperator = 'AND' | 'OR' | 'NOT';

/** نوع المحتوى */
export type ContentType = 'paper' | 'video' | 'ai_chat';

/** حالة الوصول للورقة */
export type AccessType = 'open' | 'restricted' | 'embargoed';

/** تصنيف معامل التأثير */
export type ImpactQuartile = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'unranked';

// -------------------------------------------
// واجهات البحث
// -------------------------------------------

export interface SearchQuery {
  keywords: string;
  booleanOperator: BooleanOperator;
  authors: string;
  journal: string;
  yearFrom: number | null;
  yearTo: number | null;
  source: SearchSource;
  openAccessOnly: boolean;
  impactQuartile: ImpactQuartile | null;
  contentType: ContentType;
}

export interface SearchState {
  currentQuery: SearchQuery;
  isSearching: boolean;
  results: Paper[];
  totalResults: number;
  searchHistory: string[];
}

// -------------------------------------------
// واجهات الورقة العلمية
// -------------------------------------------

export interface Author {
  firstName: string;
  lastName: string;
  fullName: string;
  orcid: string | null;
  affiliation: string | null;
  hIndex: number | null;
}

export interface PaperMetadata {
  doi: string;
  title: string;
  authors: Author[];
  abstract: string;
  journal: string | null;
  publisher: string | null;
  year: number;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  citations: number;
  impactQuartile: ImpactQuartile;
  accessType: AccessType;
  source: SearchSource;
  pdfUrl: string | null;
  landingPageUrl: string;
  keywords: string[];
  publicationDate: string;
}

export interface Paper {
  id: string;
  metadata: PaperMetadata;
  addedToLibrary: boolean;
  readingProgress: number;
  notes: string;
  tags: string[];
  folderId: string | null;
  lastOpened: string | null;
  aiSummary: string | null;
}

// -------------------------------------------
// أنواع التبويب (Discriminated Union)
// -------------------------------------------

export type TabContentType =
  | 'search_results'
  | 'paper_view'
  | 'video_player'
  | 'ai_assistant'
  | 'library'
  | 'blank';

export interface SearchTabContent {
  type: 'search_results';
  query: SearchQuery;
  results: Paper[];
  totalResults: number;
}

export interface PaperTabContent {
  type: 'paper_view';
  paper: Paper;
  showAIPanel: boolean;
}

export interface VideoTabContent {
  type: 'video_player';
  videoUrl: string;
  videoTitle: string;
  paper?: Paper;
}

export interface AIAssistantTabContent {
  type: 'ai_assistant';
  contextPaperId?: string;
  initialPrompt?: string;
}

export interface LibraryTabContent {
  type: 'library';
  initialFolderId?: string;
}

export interface BlankTabContent {
  type: 'blank';
}

export type TabContentData =
  | SearchTabContent
  | PaperTabContent
  | VideoTabContent
  | AIAssistantTabContent
  | LibraryTabContent
  | BlankTabContent;

export interface Tab {
  id: string;
  title: string;
  url: string;
  contentType: TabContentType;
  contentData: TabContentData;
  isLoading: boolean;
  error: string | null;
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
}

// -------------------------------------------
// واجهات مكتبة الأبحاث (Workspace)
// -------------------------------------------

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  paperCount: number;
  createdAt: string;
}

export interface WorkspaceState {
  savedPapers: Paper[];
  folders: Folder[];
  tags: string[];
  readingList: string[];
  activeFolderId: string | null;
  viewMode: 'grid' | 'list';
}

// -------------------------------------------
// واجهات الذكاء الاصطناعي
// -------------------------------------------

export type AITask = 'summarize' | 'explain' | 'translate' | 'compare' | 'analyze' | 'general';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIState {
  isOpen: boolean;
  currentTask: AITask;
  messages: AIMessage[];
  isLoading: boolean;
  selectedPaperId: string | null;
  selectedText: string | null;
  targetLanguage: string;
}

// -------------------------------------------
// واجهات مشغل الفيديو
// -------------------------------------------

export interface VideoData {
  url: string;
  title: string;
  source: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
  transcript: TranscriptSegment[] | null;
  aiSummary: string | null;
}

export interface TranscriptSegment {
  startTime: number;
  endTime: number;
  text: string;
}

export interface VideoState {
  activeVideo: VideoData | null;
  isPiP: boolean;
  isFullscreen: boolean;
}

// -------------------------------------------
// واجهات رسم بياني للاستشهادات
// -------------------------------------------

export interface CitationNode {
  id: string;
  title: string;
  authors: string;
  year: number;
  citations: number;
  isMainPaper: boolean;
}

export interface CitationLink {
  source: string;
  target: string;
  type: 'cites' | 'cited_by';
}

export interface CitationGraphData {
  nodes: CitationNode[];
  links: CitationLink[];
}

// -------------------------------------------
// واجهة المتجر العام
// -------------------------------------------

export interface BrowserState {
  tabs: TabState;
  search: SearchState;
  workspace: WorkspaceState;
  ai: AIState;
  video: VideoState;
  citationGraph: CitationGraphData | null;
  isDeepSearchOpen: boolean;
  isLibraryOpen: boolean;
  isDarkMode: boolean;
  activeSource: SearchSource;
  sidebarWidth: number;
}

// -------------------------------------------
// واجهات API (للباك إند مستقبلاً)
// -------------------------------------------

export interface SearchResponse {
  query: SearchQuery;
  results: Paper[];
  totalResults: number;
  page: number;
  pageSize: number;
  timeTakenMs: number;
}

export interface CrawlerStatus {
  isRunning: boolean;
  sources: SearchSource[];
  pagesCrawled: number;
  papersIndexed: number;
  lastRun: string | null;
  errors: string[];
}

export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}
