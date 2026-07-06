'use client';

import { useEffect, useState } from 'react';
import { Play, Activity, Loader2 } from 'lucide-react';
import { useBrowserStore } from '../store/useBrowserStore';
import shallow from 'zustand/shallow';

export default function DeepSearchPanel() {
  const { deepSearchOpen, toggleDeepSearch, deepScanResults, isScanning, runDeepScan, clearDeepScanResults } =
    useBrowserStore(
      (s) => ({
        deepSearchOpen: s.deepSearchOpen,
        toggleDeepSearch: s.toggleDeepSearch,
        deepScanResults: s.deepScanResults,
        isScanning: s.isScanning,
        runDeepScan: s.runDeepScan,
        clearDeepScanResults: s.clearDeepScanResults
      }),
      shallow
    );

  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    /* Accessibility: announce scan start/stop via aria-live could be added here */
  }, [isScanning]);

  return (
    <aside
      className={`transition-all duration-300 ${deepSearchOpen ? 'w-96 p-4' : 'w-0 p-0 sidebar-collapsed'} overflow-hidden bg-oxford/70 border-r border-white/6`}
      aria-hidden={!deepSearchOpen}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Deep Search</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-emerald">AI Scan</span>
          <button aria-label="Close Deep Search" onClick={toggleDeepSearch} className="p-1 rounded hover:bg-white/6">
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (localQuery.trim().length > 0) {
            clearDeepScanResults();
            runDeepScan(localQuery.trim());
            setLocalQuery('');
          }
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm text-white/80 mb-2">Query</label>
          <input
            aria-label="Deep search query"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Enter keywords, DOI, or title"
            className="w-full rounded-md bg-white/6 p-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-2">Domain</label>
          <select className="w-full rounded-md bg-white/6 p-2 text-white" aria-label="Domain filter">
            <option>All domains</option>
            <option>Computer Science</option>
            <option>Biology</option>
            <option>Physics</option>
            <option>Medicine</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-2">Publication Year</label>
          <select className="w-full rounded-md bg-white/6 p-2 text-white" aria-label="Year filter">
            <option>Any year</option>
            <option>2026</option>
            <option>2020-2025</option>
            <option>2010-2019</option>
          </select>
        </div>

        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-emerald" /> Peer-Reviewed
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-emerald" /> Open Access
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-emerald hover:bg-emerald/90 text-oxford py-2 rounded-md font-semibold flex items-center justify-center gap-2"
            aria-label="Run Deep Scan"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Run Deep Scan
          </button>
        </div>

        <div aria-live="polite" className="mt-4 text-sm text-white/70">
          <div className="font-medium text-white">Scan Status</div>
          <div className="mt-2 text-xs">{isScanning ? 'Scanning — streaming results...' : 'Idle — no active scans'}</div>
        </div>

        <div className="mt-4 space-y-3">
          {deepScanResults.map((r) => (
            <article key={r.id} className="p-3 bg-white/6 rounded-md">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                  <div className="text-xs text-white/70">{r.authors.join(', ')}</div>
                </div>
                <div className="text-xs text-emerald font-semibold">{r.confidence}%</div>
              </div>
              <div className="mt-2 text-xs text-white/60">{r.snippet}</div>
              <div className="mt-2 flex gap-2">
                {r.provenance.map((p) => (
                  <span key={p} className="text-xs px-2 py-1 rounded bg-white/8 text-white/90">{p}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </form>
    </aside>
  );
}
