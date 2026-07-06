import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { nanoid } from 'nanoid';

/* Strict TypeScript interfaces */
export type TabType = 'research' | 'video';

export interface Tab {
  id: string;
  title: string;
  url?: string;
  type: TabType;
  active: boolean;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  premium?: boolean;
  createdAt: number;
}

export interface DeepScanResult {
  id: string;
  title: string;
  authors: string[];
  confidence: number; /* 0-100 */
  provenance: string[]; /* e.g., IEEE, arXiv */
  snippet?: string;
  timestamp: number;
}

/* Store interface */
export interface BrowserState {
  tabs: Tab[];
  bookmarks: Bookmark[];
  deepSearchOpen: boolean;
  libraryOpen: boolean;
  aiSessionToken: string | null;
  deepScanResults: DeepScanResult[];
  isScanning: boolean;

  /* Actions */
  addTab: (tab: Omit<Tab, 'id' | 'createdAt' | 'active'> & { activate?: boolean }) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  toggleDeepSearch: () => void;
  toggleLibrary: () => void;
  addBookmark: (bm: Omit<Bookmark, 'id' | 'createdAt'>) => string;
  removeBookmark: (id: string) => void;
  setAiSessionToken: (token: string | null) => void;

  /* Deep scan actions */
  runDeepScan: (query: string) => Promise<void>;
  clearDeepScanResults: () => void;
}

/* Encapsulated store creation to reduce risk of console tampering:
   We do not expose internal set function outside the create closure. */
export const useBrowserStore = create<BrowserState>()(
  devtools((set, get) => {
    /* Helper to create secure IDs */
    const makeId = (prefix = 'id') => `${prefix}-${nanoid(8)}`;

    /* Simulated streaming deep scan implementation */
    const simulateStream = async (query: string) => {
      set(() => ({ isScanning: true, deepScanResults: [] }));
      const sources = ['IEEE', 'arXiv', 'Springer', 'PubMed'];
      const sampleTitles = [
        'Efficient Graph Neural Networks for Large-Scale Data',
        'Quantum Entanglement in Novel Materials',
        'A Survey of Transformer Models in Biology',
        'High-Resolution Imaging Techniques for Neuroscience'
      ];

      /* Simulate progressive streaming of 3-5 results */
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
        const result: DeepScanResult = {
          id: makeId('res'),
          title: sampleTitles[(i + query.length) % sampleTitles.length],
          authors: ['A. Researcher', 'B. Scientist'],
          confidence: Math.round(60 + Math.random() * 40),
          provenance: [sources[i % sources.length]],
          snippet: `Excerpt related to "${query}" — key findings and methods.`,
          timestamp: Date.now()
        };
        set((state) => ({ deepScanResults: [...state.deepScanResults, result] }));
      }

      /* Finalize */
      set(() => ({ isScanning: false }));
    };

    return {
      tabs: [
        {
          id: makeId('tab'),
          title: 'Welcome',
          url: '',
          type: 'research',
          active: true,
          createdAt: Date.now()
        }
      ],
      bookmarks: [],
      deepSearchOpen: true,
      libraryOpen: true,
      aiSessionToken: null,
      deepScanResults: [],
      isScanning: false,

      addTab: (tab) => {
        const id = makeId('tab');
        set((state) => {
          const tabs = state.tabs.map((t) => ({ ...t, active: false }));
          const newTab: Tab = {
            id,
            title: tab.title,
            url: tab.url,
            type: tab.type,
            active: tab.activate ?? true,
            createdAt: Date.now()
          };
          return { tabs: [...tabs, newTab] };
        });
        return id;
      },

      closeTab: (id) => {
        set((state) => {
          const tabs = state.tabs.filter((t) => t.id !== id);
          if (!tabs.some((t) => t.active) && tabs.length) {
            tabs[tabs.length - 1].active = true;
          }
          return { tabs };
        });
      },

      setActiveTab: (id) => {
        set((state) => ({ tabs: state.tabs.map((t) => ({ ...t, active: t.id === id })) }));
      },

      toggleDeepSearch: () => set((s) => ({ deepSearchOpen: !s.deepSearchOpen })),

      toggleLibrary: () => set((s) => ({ libraryOpen: !s.libraryOpen })),

      addBookmark: (bm) => {
        const id = makeId('bm');
        set((state) => ({ bookmarks: [...state.bookmarks, { id, title: bm.title, url: bm.url, premium: bm.premium, createdAt: Date.now() }] }));
        return id;
      },

      removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter((b) => b.id !== id) })),

      setAiSessionToken: (token) => set(() => ({ aiSessionToken: token })),

      runDeepScan: async (query: string) => {
        /* Treat query as untrusted input; we never inject it into DOM as HTML.
           We only use it as a string for the simulated scan. */
        await simulateStream(query);
      },

      clearDeepScanResults: () => set(() => ({ deepScanResults: [] }))
    };
  })
);

/* Export a typed shallow hook for components to use */
export const useBrowserShallow = useShallow;
