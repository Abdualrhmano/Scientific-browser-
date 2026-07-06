'use client';

import { useState } from 'react';
import { Play, Activity, Loader2, ShieldCheck } from 'lucide-react';
import { useBrowserStore, useBrowserShallow } from '../store/useBrowserStore';

export default function DeepSearchPanel() {
  const { deepSearchOpen, toggleDeepSearch, deepScanResults, isScanning, runDeepScan, clearDeepScanResults } =
    useBrowserStore(
      useBrowserShallow((s) => ({
        deepSearchOpen: s.deepSearchOpen,
        toggleDeepSearch: s.toggleDeepSearch,
        deepScanResults: s.deepScanResults,
        isScanning: s.isScanning,
        runDeepScan: s.runDeepScan,
        clearDeepScanResults: s.clearDeepScanResults
      }))
    );

  const [localQuery, setLocalQuery] = useState('');

  return (
    <aside
      className={`transition-all duration-300 ${deepSearchOpen ? 'w-96 p-4 border-r' : 'w-0 p-0 overflow-hidden border-0'} bg-oxford/70 border-white/5 flex flex-col h-full`}
      aria-hidden={!deepSearchOpen}
    >
      <div className="flex items-center justify-between mb-4 min-w-[350px]">
        <h3 className="text-lg font-semibold text-white">Deep AI Engine</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20 font-mono">Agent v2.6</span>
          <button aria-label="Toggle Deep Search View" onClick={toggleDeepSearch} className="p-1 rounded hover:bg-white/5 text-white/70">
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
        className="space-y-4 min-w-[350px] flex-1 overflow-y-auto pr-1"
      >
        <div>
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Target Payload</label>
          <input
            aria-label="Deep search prompt"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Enter keywords, DOI vectors, or titles..."
            className="w-full rounded-md bg-white/5 p-2 text-sm text-white border border-white/10 focus:outline-none focus:border-emerald"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-white/50 mb-1">Domain Space</label>
            <select className="w-full text-xs rounded bg-white/5 p-2 text-white border border-white/5" aria-label="Domain Space Filter">
              <option>All Systems</option>
              <option>Computer Science</option>
              <option>Quantum Analytics</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Temporal Matrix</label>
            <select className="w-full text-xs rounded bg-white/5 p-2 text-white border border-white/5" aria-label="Temporal Matrix Filter">
              <option>Any Epoch</option>
              <option>2026 Stable</option>
              <option>2020-2025</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald text-oxford py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald/90 transition-colors"
          disabled={isScanning}
        >
          {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Fire Crawl Sequence
        </button>

        <div className="mt-4 space-y-3">
          {isScanning && (
            <div className="text-center py-6 text-xs text-white/40 font-mono animate-pulse">
              [SYSTEM] Compiling external indices & verifying network integrity...
            </div>
          )}

          {deepScanResults.map((r) => (
            <article key={r.id} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-emerald/30 transition-all">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-white line-clamp-2">{r.title}</h4>
                <span className="text-xs font-mono text-cyan">{r.confidence}%</span>
              </div>
              <p className="mt-1.5 text-[11px] text-white/50 font-mono leading-relaxed">{r.snippet}</p>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {r.provenance.map((p) => (
                  <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald/10 text-emerald border border-emerald/20 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> {p}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </form>
    </aside>
  );
}
