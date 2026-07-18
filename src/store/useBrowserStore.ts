import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type {
  BrowserState,
  Tab,
  TabContentData,
  Paper,
  SearchQuery,
  SearchSource,
  AITask,
  AIMessage,
  Folder,
  CitationGraphData,
} from '@/types';

// ============================================
// الحالة الافتراضية
// ============================================

const defaultSearchQuery: SearchQuery = {
  keywords: '',
  booleanOperator: 'AND',
  authors: '',
  journal: '',
  yearFrom: null,
  yearTo: null,
  source: 'arxiv',
  openAccessOnly: false,
  impactQuartile: null,
  contentType: 'paper',
};

const initialState: BrowserState = {
  tabs: {
    tabs: [],
    activeTabId: null,
  },
  search: {
    currentQuery: defaultSearchQuery,
    isSearching: false,
    results: [],
    totalResults: 0,
    searchHistory: [],
  },
  workspace: {
    savedPapers: [],
    folders: [],
    tags: [],
    readingList: [],
    activeFolderId: null,
    viewMode: 'list',
  },
  ai: {
    isOpen: false,
    currentTask: 'general',
    messages: [],
    isLoading: false,
    selectedPaperId: null,
    selectedText: null,
    targetLanguage: 'ar',
  },
  video: {
    activeVideo: null,
    isPiP: false,
    isFullscreen: false,
  },
  citationGraph: null,
  isDeepSearchOpen: false,
  isLibraryOpen: false,
  isDarkMode: true,
  activeSource: 'arxiv',
  sidebarWidth: 340,
};

// ============================================
// واجهة الإجراءات (Actions)
// ============================================

interface BrowserActions {
  // ---- التبويبات ----
  addTab: (contentData: TabContentData, title: string, url: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, contentData: TabContentData) => void;
  setTabLoading: (tabId: string, isLoading: boolean) => void;
  setTabError: (tabId: string, error: string | null) => void;

  // ---- البحث ----
  setSearchQuery: (query: Partial<SearchQuery>) => void;
  setSearchResults: (results: Paper[], total: number) => void;
  setSearching: (isSearching: boolean) => void;
  addToSearchHistory: (term: string) => void;

  // ---- المكتبة ----
  toggleSavePaper: (paper: Paper) => void;
  addFolder: (name: string, parentId?: string | null) => void;
  deleteFolder: (folderId: string) => void;
  setActiveFolder: (folderId: string | null) => void;
  addTag: (paperId: string, tag: string) => void;
  removeTag: (paperId: string, tag: string) => void;
  updateReadingProgress: (paperId: string, progress: number) => void;
  setViewMode: (mode: 'grid' | 'list') => void;

  // ---- الذكاء الاصطناعي ----
  toggleAIPanel: () => void;
  setAITask: (task: AITask) => void;
  sendAIMessage: (content: string) => void;
  setAILoading: (isLoading: boolean) => void;
  selectPaperForAI: (paperId: string | null) => void;
  setSelectedText: (text: string | null) => void;

  // ---- الفيديو ----
  setActiveVideo: (video: BrowserState['video']['activeVideo']) => void;
  updateVideoTime: (time: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setVideoVolume: (volume: number) => void;
  togglePiP: () => void;
  toggleFullscreen: () => void;

  // ---- الاستشهادات ----
  setCitationGraph: (graph: CitationGraphData | null) => void;

  // ---- الواجهة ----
  toggleDeepSearch: () => void;
  toggleLibrary: () => void;
  toggleDarkMode: () => void;
  setActiveSource: (source: SearchSource) => void;
}

// ============================================
// المتجر
// ============================================

export const useBrowserStore = create<BrowserState & BrowserActions>()(
  immer((set) => ({
    ...initialState,

    // ---- التبويبات ----
    addTab: (contentData, title, url) =>
      set((state) => {
        const newTab: Tab = {
          id: uuidv4(),
          title,
          url,
          contentType: contentData.type,
          contentData,
          isLoading: false,
          error: null,
        };
        state.tabs.tabs.push(newTab);
        state.tabs.activeTabId = newTab.id;
      }),

    closeTab: (tabId) =>
      set((state) => {
        const { tabs } = state.tabs;
        const index = tabs.findIndex((t) => t.id === tabId);
        if (index === -1) return;

        tabs.splice(index, 1);

        if (state.tabs.activeTabId === tabId) {
          if (tabs.length === 0) {
            state.tabs.activeTabId = null;
          } else if (index >= tabs.length) {
            state.tabs.activeTabId = tabs[tabs.length - 1].id;
          } else {
            state.tabs.activeTabId = tabs[index].id;
          }
        }
      }),

    setActiveTab: (tabId) =>
      set((state) => {
        if (state.tabs.tabs.some((t) => t.id === tabId)) {
          state.tabs.activeTabId = tabId;
        }
      }),

    updateTabContent: (tabId, contentData) =>
      set((state) => {
        const tab = state.tabs.tabs.find((t) => t.id === tabId);
        if (tab) {
          tab.contentData = contentData;
        }
      }),

    setTabLoading: (tabId, isLoading) =>
      set((state) => {
        const tab = state.tabs.tabs.find((t) => t.id === tabId);
        if (tab) tab.isLoading = isLoading;
      }),

    setTabError: (tabId, error) =>
      set((state) => {
        const tab = state.tabs.tabs.find((t) => t.id === tabId);
        if (tab) tab.error = error;
      }),

    // ---- البحث ----
    setSearchQuery: (query) =>
      set((state) => {
        Object.assign(state.search.currentQuery, query);
      }),

    setSearchResults: (results, total) =>
      set((state) => {
        state.search.results = results;
        state.search.totalResults = total;
        state.search.isSearching = false;
      }),

    setSearching: (isSearching) =>
      set((state) => {
        state.search.isSearching = isSearching;
      }),

    addToSearchHistory: (term) =>
      set((state) => {
        const history = state.search.searchHistory;
        const filtered = history.filter((h) => h !== term);
        state.search.searchHistory = [term, ...filtered].slice(0, 20);
      }),

    // ---- المكتبة ----
    toggleSavePaper: (paper) =>
      set((state) => {
        const index = state.workspace.savedPapers.findIndex(
          (p) => p.id === paper.id
        );
        if (index === -1) {
          state.workspace.savedPapers.push({ ...paper, addedToLibrary: true });
        } else {
          state.workspace.savedPapers.splice(index, 1);
        }
      }),

    addFolder: (name, parentId = null) =>
      set((state) => {
        const newFolder: Folder = {
          id: uuidv4(),
          name,
          parentId,
          paperCount: 0,
          createdAt: new Date().toISOString(),
        };
        state.workspace.folders.push(newFolder);
      }),

    deleteFolder: (folderId) =>
      set((state) => {
        state.workspace.folders = state.workspace.folders.filter(
          (f) => f.id !== folderId
        );
        if (state.workspace.activeFolderId === folderId) {
          state.workspace.activeFolderId = null;
        }
      }),

    setActiveFolder: (folderId) =>
      set((state) => {
        state.workspace.activeFolderId = folderId;
      }),

    addTag: (paperId, tag) =>
      set((state) => {
        const paper = state.workspace.savedPapers.find((p) => p.id === paperId);
        if (paper && !paper.tags.includes(tag)) {
          paper.tags.push(tag);
        }
      }),

    removeTag: (paperId, tag) =>
      set((state) => {
        const paper = state.workspace.savedPapers.find((p) => p.id === paperId);
        if (paper) {
          paper.tags = paper.tags.filter((t) => t !== tag);
        }
      }),

    updateReadingProgress: (paperId, progress) =>
      set((state) => {
        const paper = state.workspace.savedPapers.find((p) => p.id === paperId);
        if (paper) {
          paper.readingProgress = Math.min(100, Math.max(0, progress));
        }
      }),

    setViewMode: (mode) =>
      set((state) => {
        state.workspace.viewMode = mode;
      }),

    // ---- الذكاء الاصطناعي ----
    toggleAIPanel: () =>
      set((state) => {
        state.ai.isOpen = !state.ai.isOpen;
      }),

    setAITask: (task) =>
      set((state) => {
        state.ai.currentTask = task;
      }),

    sendAIMessage: (content) =>
      set((state) => {
        const userMessage: AIMessage = {
          id: uuidv4(),
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };
        state.ai.messages.push(userMessage);

        const assistantMessage: AIMessage = {
          id: uuidv4(),
          role: 'assistant',
          content:
            'هذه استجابة وهمية من المساعد الذكي. سيتم استبدالها بالاتصال بالخدمة الفعلية.',
          timestamp: new Date().toISOString(),
        };
        state.ai.messages.push(assistantMessage);
      }),

    setAILoading: (isLoading) =>
      set((state) => {
        state.ai.isLoading = isLoading;
      }),

    selectPaperForAI: (paperId) =>
      set((state) => {
        state.ai.selectedPaperId = paperId;
      }),

    setSelectedText: (text) =>
      set((state) => {
        state.ai.selectedText = text;
      }),

    // ---- الفيديو ----
    setActiveVideo: (video) =>
      set((state) => {
        state.video.activeVideo = video;
      }),

    updateVideoTime: (time) =>
      set((state) => {
        if (state.video.activeVideo) {
          state.video.activeVideo.currentTime = time;
        }
      }),

    setPlaying: (isPlaying) =>
      set((state) => {
        if (state.video.activeVideo) {
          state.video.activeVideo.isPlaying = isPlaying;
        }
      }),

    setVideoVolume: (volume) =>
      set((state) => {
        if (state.video.activeVideo) {
          state.video.activeVideo.volume = volume;
        }
      }),

    togglePiP: () =>
      set((state) => {
        state.video.isPiP = !state.video.isPiP;
      }),

    toggleFullscreen: () =>
      set((state) => {
        state.video.isFullscreen = !state.video.isFullscreen;
      }),

    // ---- الاستشهادات ----
    setCitationGraph: (graph) =>
      set((state) => {
        state.citationGraph = graph;
      }),

    // ---- الواجهة ----
    toggleDeepSearch: () =>
      set((state) => {
        state.isDeepSearchOpen = !state.isDeepSearchOpen;
      }),

    toggleLibrary: () =>
      set((state) => {
        state.isLibraryOpen = !state.isLibraryOpen;
      }),

    toggleDarkMode: () =>
      set((state) => {
        state.isDarkMode = !state.isDarkMode;
      }),

    setActiveSource: (source) =>
      set((state) => {
        state.activeSource = source;
      }),
  }))
);
