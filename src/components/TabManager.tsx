'use client';

import React, { useRef, useEffect } from 'react';
import { X, Plus, FileText, Search, Video, MessageSquare, Library, Loader2 } from 'lucide-react';
import { useBrowserStore } from '@/store/useBrowserStore';
import type { TabContentData } from '@/types';

// -------------------------------------------
// أيقونة لكل نوع تبويب
// -------------------------------------------
const getTabIcon = (contentData: TabContentData) => {
  switch (contentData.type) {
    case 'paper_view':
      return <FileText size={14} />;
    case 'search_results':
      return <Search size={14} />;
    case 'video_player':
      return <Video size={14} />;
    case 'ai_assistant':
      return <MessageSquare size={14} />;
    case 'library':
      return <Library size={14} />;
    case 'blank':
    default:
      return null;
  }
};

// -------------------------------------------
// المكون الرئيسي
// -------------------------------------------
const TabManager: React.FC = () => {
  const {
    tabs,
    activeTabId,
    setActiveTab,
    closeTab,
    addTab,
  } = useBrowserStore();

  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // ---- التمرير التلقائي للوصول إلى التبويب النشط ----
  useEffect(() => {
    if (!tabsContainerRef.current || !activeTabId) return;

    const container = tabsContainerRef.current;
    const activeTabElement = container.querySelector(`[data-tab-id="${activeTabId}"]`);
    if (activeTabElement) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTabId]);

  // ---- إضافة تبويب فارغ جديد ----
  const handleAddBlankTab = () => {
    const blankContent: TabContentData = { type: 'blank' };
    addTab(blankContent, 'New Tab', 'about:blank');
  };

  return (
    <div className="flex items-center h-9 bg-panel-light dark:bg-panel-dark border-b border-border-light dark:border-border-dark">
      {/* ---- منطقة التبويبات مع تمرير أفقي ---- */}
      <div
        ref={tabsContainerRef}
        className="flex-1 flex items-center gap-0 overflow-x-auto custom-scrollbar scrollbar-hide"
      >
        {tabs.tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const icon = getTabIcon(tab.contentData);

          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab flex-shrink-0 max-w-[180px] gap-1.5 ${isActive ? 'active' : ''}`}
              title={tab.title}
            >
              {icon && <span className="flex-shrink-0">{icon}</span>}
              <span className="truncate text-xs">{tab.title}</span>
              
              {/* عرض مؤشر التحميل أو زر الإغلاق */}
              {tab.isLoading ? (
                <span className="ml-1 flex-shrink-0 p-0.5">
                  <Loader2 size={12} className="animate-spin" />
                </span>
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // منع تنشيط التبويب عند الإغلاق
                    closeTab(tab.id);
                  }}
                  className="ml-1 flex-shrink-0 rounded-full p-0.5 hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                  role="button"
                  aria-label={`إغلاق ${tab.title}`}
                >
                  <X size={12} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---- زر إضافة تبويب جديد ---- */}
      <button
        onClick={handleAddBlankTab}
        className="flex-shrink-0 icon-btn mx-1"
        aria-label="إضافة تبويب جديد"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default TabManager;
