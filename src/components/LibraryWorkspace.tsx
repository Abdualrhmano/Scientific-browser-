'use client';

import { ChevronLeft, FileText, Download } from 'lucide-react';
import { useBrowserStore, useBrowserShallow } from '../store/useBrowserStore';

export default function LibraryWorkspace() {
  const { libraryOpen, toggleLibrary } = useBrowserStore(
    useBrowserShallow((s) => ({ libraryOpen: s.libraryOpen, toggleLibrary: s.toggleLibrary }))
  );

  return (
    <aside
      className={`transition-all duration-300 ${libraryOpen ? 'w-96 p-4 border-l' : 'w-0 p-0 overflow-hidden border-0'} bg-platinum text-oxford border-white/10 flex flex-col h-full`}
      aria-hidden={!libraryOpen}
    >
      <div className="flex items-center justify-between mb-3 min-w-[350px]">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-oxford" />
          <h4 className="font-bold text-sm tracking-wide">Secure Repository</h4>
        </div>
        <button aria-label="Collapse Repository" onClick={toggleLibrary} className="p-1 rounded hover:bg-black/5">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 min-w-[350px] flex-1 overflow-y-auto pr-1">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-black/5">
          <div className="text-xs font-bold uppercase tracking-wider text-black/40">Active Vector Object</div>
          <div className="text-xs font-mono text-black/70 mt-1">No local context buffered.</div>
        </div>

        <div className="rounded-lg p-3 bg-white shadow-sm border border-black/5">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-black/40">Citation Engine</div>
            <span className="text-[10px] font-mono text-emerald font-bold">Encapsulated</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 bg-oxford text-white text-xs py-2 rounded-md font-medium hover:bg-oxford/90 transition-colors">Export BibTeX</button>
            <button className="flex-1 bg-oxford text-white text-xs py-2 rounded-md font-medium hover:bg-oxford/90 transition-colors">Export APA</button>
          </div>
        </div>

        <div className="rounded-lg p-3 bg-white shadow-sm border border-black/5">
          <div className="text-xs font-bold uppercase tracking-wider text-black/40 mb-2">Sandboxed PDF Stream</div>
          <div className="h-44 bg-slate-100 rounded-md border border-dashed border-black/10 flex items-center justify-center text-xs font-mono text-black/40">
            Waiting for secure hook load...
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 bg-oxford text-white text-xs py-2 rounded-md font-medium flex items-center justify-center gap-1 hover:bg-oxford/90">
              <Download className="w-3.5 h-3.5" /> Fetch Node
            </button>
            <button className="flex-1 bg-gold text-oxford text-xs py-2 rounded-md font-bold hover:bg-gold/90">Commit State</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
