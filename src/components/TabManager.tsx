'use client';

import { useRef } from 'react';
import { Plus, X, Video, FileText } from 'lucide-react';
import { useBrowserStore, useBrowserShallow } from '../store/useBrowserStore';

export default function TabManager() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { tabs, addTab, closeTab, setActiveTab } = useBrowserStore(
    useBrowserShallow((s) => ({
      tabs: s.tabs,
      addTab: s.addTab,
      closeTab: s.closeTab,
      setActiveTab: s.setActiveTab
    }))
  );

  const handleAddResearch = () => {
    addTab({ title: 'New Research Hub', url: '', type: 'research', activate: true });
    scrollEnd();
  };

  const handleAddVideo = () => {
    addTab({ title: 'New Video Lecture Node', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video', activate: true });
    scrollEnd();
  };

  const scrollEnd = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({ left: containerRef.current.scrollWidth, behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="px-4 py-2 border-b border-white/5 bg-oxford/80 flex items-center gap-3">
      <div className="flex-1 overflow-x-auto" ref={containerRef}>
        <div className="flex gap-2 min-w-max">
          {tabs.map((t) => (
            <div
              key={t.id}
              role="tab"
              aria-selected={t.active}
              onClick={() => setActiveTab(t.id)}
              className={`cursor-pointer select-none px-3 py-2 rounded-md transition-all flex items-center gap-2 ${
                t.active ? 'bg-white/10 ring-1 ring-emerald text-white' : 'bg-white/5 text-white/60 hover:bg-white/8'
              }`}
            >
              {t.type === 'video' ? <Video className="w-3.5 h-3.5 text-cyan" /> : <FileText className="w-3.5 h-3.5 text-emerald" />}
              <span className="text-xs font-medium max-w-[140px] truncate">{t.title}</span>
              <button
                aria-label={`Close ${t.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
                className="p-1 rounded hover:bg-white/10"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 shadow-inner bg-black/20 p-1 rounded-lg">
        <button onClick={handleAddResearch} className="btn bg-emerald/20 text-emerald text-xs font-bold py-1 px-2 hover:bg-emerald/30" title="Open Research Window">
          <Plus className="w-3 h-3" /> Paper
        </button>
        <button onClick={handleAddVideo} className="btn bg-cyan/20 text-cyan text-xs font-bold py-1 px-2 hover:bg-cyan/30" title="Open Video Workspace">
          <Plus className="w-3 h-3" /> Video
        </button>
      </div>
    </div>
  );
}

