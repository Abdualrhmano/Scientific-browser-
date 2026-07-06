'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Search, Bookmark, BookOpen } from 'lucide-react';
import { useBrowserStore } from '../store/useBrowserStore';

export default function TopNav() {
  const toggleDeepSearch = useBrowserStore((s) => s.toggleDeepSearch);
  const toggleLibrary = useBrowserStore((s) => s.toggleLibrary);
  const runDeepScan = useBrowserStore((s) => s.runDeepScan);
  const [query, setQuery] = useState('');

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim().length > 0) {
        runDeepScan(query.trim());
      }
      setQuery('');
    },
    [query, runDeepScan]
  );

  return (
    <header className="flex items-center gap-4 px-4 py-3 glass">
      <div className="flex items-center gap-2">
        <button aria-label="Back" className="btn text-white hover:bg-white/10" title="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button aria-label="Forward" className="btn text-white hover:bg-white/10" title="Forward">
          <ArrowRight className="w-5 h-5" />
        </button>
        <button aria-label="Refresh" className="btn text-white hover:bg-white/10" title="Refresh">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1">
        <div className="relative">
          <input
            aria-label="Omnibox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search academic literature, paste DOI, title, or URL..."
            className="w-full rounded-xl px-4 py-2 bg-white/5 text-white placeholder-white/60 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald transition"
          />
          <button
            type="button"
            onClick={toggleDeepSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald text-oxford px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-emerald/90 transition-colors"
          >
            <Search className="w-4 h-4" /> Deep Search
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <button aria-label="Bookmarks" className="btn text-white hover:bg-white/10" title="Bookmarks">
          <Bookmark className="w-5 h-5" />
        </button>
        <button aria-label="Library" className="btn text-white hover:bg-white/10" title="Library" onClick={toggleLibrary}>
          <BookOpen className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

