'use client';

import { ChevronLeft, FileText, Download } from 'lucide-react';
import { useBrowserStore } from '../store/useBrowserStore';
import shallow from 'zustand/shallow';

export default function LibraryWorkspace() {
  const { libraryOpen, toggleLibrary } = useBrowserStore(
    (s) => ({ libraryOpen: s.libraryOpen, toggleLibrary: s.toggleLibrary }),
    shallow
  );

  return (
    <aside
      className={`transition-all duration-300 ${libraryOpen ? 'w-96 p-4' : 'w-0 p-0 sidebar-collapsed'} overflow-hidden bg-platinum text-oxford border-l border-white/10`}
      aria-hidden={!libraryOpen}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-oxford" />
          <h4 className="font-semibold text-oxford">Library</h4>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Close Library" onClick={toggleLibrary} className="p-1 rounded hover:bg-white/6">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-3 rounded-md">
          <div className="text-sm font-medium text-oxford">Active Document</div>
          <div className="text-xs text-oxford/70 mt-1">No document loaded</div>
        </div>

        <div className="rounded-md border border-white/6 p-2 bg-white/90">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-oxford">Citation Manager</div>
            <div className="text-xs text-emerald">Export</div>
          </div>
          <div className="text-xs text-oxford/70">Formats: BibTeX; APA</div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 bg-oxford text-white py-2 rounded-md">Export BibTeX</button>
            <button className="flex-1 bg-oxford text-white py-2 rounded-md">Export APA</button>
          </div>
        </div>

        <div className="rounded-md border border-white/6 p-2 bg-white/90">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-oxford">PDF Reader</div>
            <div className="text-xs text-oxford/70">Workspace</div>
          </div>

          <div className="h-64 bg-white/80 rounded overflow-hidden flex items-center justify-center text-oxford">
            <div className="text-sm">PDF workspace placeholder</div>
          </div>

          <div className="mt-2 flex gap-2">
            <button className="flex-1 bg-oxford text-white py-2 rounded-md flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download
            </button>
            <button className="flex-1 bg-gold text-oxford py-2 rounded-md">Save</button>
          </div>
        </div>

        <div>
          <div className="text-xs text-oxford/70">Local library dashboard supports tagging, collections, and offline storage (IndexedDB).</div>
        </div>
      </div>
    </aside>
  );
}
