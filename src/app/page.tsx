'use client';

import React from 'react';
import { useBrowserStore } from '@/store/useBrowserStore';
import TopNav from '@/components/TopNav';
import TabManager from '@/components/TabManager';
import MainContent from '@/components/MainContent';
import DeepSearchPanel from '@/components/DeepSearchPanel';
import LibraryWorkspace from '@/components/LibraryWorkspace';
import AIAssistant from '@/components/AIAssistant';
import VideoPlayer from '@/components/VideoPlayer';

// -------------------------------------------
// المكون الرئيسي للتطبيق
// -------------------------------------------
export default function HomePage() {
  const { isDeepSearchOpen, isLibraryOpen, ai, video, activeTabId, tabs } =
    useBrowserStore();

  // ---- تحديد المحتوى الرئيسي بناءً على التبويب النشط ----
  const activeTab = activeTabId
    ? tabs.tabs.find((tab) => tab.id === activeTabId)
    : null;

  const renderMainContent = () => {
    if (!activeTab) {
      return <MainContent />;
    }

    // إذا كان التبويب النشط من نوع video_player، اعرض مشغل الفيديو مباشرةً
    if (activeTab.contentData.type === 'video_player') {
      return <VideoPlayer />;
    }

    // في جميع الحالات الأخرى، استخدم MainContent (الذي يتعامل مع paper_view, search_results, ai_assistant, library, blank)
    return <MainContent />;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-light dark:bg-surface-dark overflow-hidden">
      {/* ---- شريط التحكم العلوي ---- */}
      <TopNav />

      {/* ---- شريط التبويبات ---- */}
      <TabManager />

      {/* ---- المحتوى الرئيسي (أشرطة جانبية + محتوى) ---- */}
      <div className="flex-1 flex overflow-hidden">
        {/* لوحة البحث العميق (يسار) */}
        <DeepSearchPanel />

        {/* منطقة المحتوى المركزية */}
        <main className="flex-1 flex overflow-hidden">
          {renderMainContent()}
        </main>

        {/* لوحة المساعد الذكي (يمين) */}
        <AIAssistant />

        {/* لوحة المكتبة (يمين) */}
        <LibraryWorkspace />
      </div>
    </div>
  );
        }
