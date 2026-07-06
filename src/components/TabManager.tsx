'use client';

import { useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { useBrowserStore } from '../store/useBrowserStore';
import { useBrowserShallow } from '../store/useBrowserStore';
import shallow from 'zustand/shallow';
import { nanoid } from 'nanoid';

export default function TabManager() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { tabs, addTab, closeTab, setActiveTab } = useBrowserStore(
    (s) => ({ tabs: s.tabs, addTab: s.addTab, closeTab: s.closeTab, setActiveTab: s.setActiveTab }),
    shallow
  );

  const handleAdd = () => {
    addTab({ title: 'New Tab', url: '', type: 'research', activate: true });
    setTimeout(() => {
      containerRef.current?.scrollTo({ left: containerRef.current.scrollWidth, behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="px-4 py-2 border-b border-white/6 bg-oxford/80">
      <div className="flex items-center gap-3">
        <div className="flex-1 overflow-x-auto" ref={containerRef}>
          <div className="flex gap-2 min-w-max">
            {tabs.map((t) => (
              <div
                key={t.id}
                role="tab"
                aria-selected={t.active}
                onClick={() => setActiveTab(t.id)}
                className={`cursor-pointer select-none px-3 py-2 rounded-md ${t.active ? 'bg-white/8 ring-1 ring-emerald' : 'bg-white/3'} flex items-center gap-2`}
              >
                <span className="text-sm font-medium">{t.title}</span>
                <button
                  aria-label={`Close ${t.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(t.id);
                  }}
                  className="p-1 rounded hover:bg-white/6"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button aria-label="New Tab" onClick={handleAdd} className="btn">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
