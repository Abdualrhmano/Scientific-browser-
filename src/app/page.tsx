'use client';

import { useBrowserStore } from '@/store/useBrowserStore';
import TopNav from '@/components/TopNav';
import TabManager from '@/components/TabManager';
import DeepSearchPanel from '@/components/DeepSearchPanel';
import MainContent from '@/components/MainContent';
import LibraryWorkspace from '@/components/LibraryWorkspace';
import AIAssistant from '@/components/AIAssistant';
import VideoPlayer from '@/components/VideoPlayer';

export default function HomePage() {
  const tabs = useBrowserStore((state) => state.tabs.tabs);
  const activeTabId = useBrowserStore((state) => state.tabs.activeTabId);

  const activeTab = activeTabId
    ? tabs.find((tab) => tab.id === activeTabId)
    : null;

  const centerContent =
    activeTab?.contentData.type === 'video_player' ? (
      <VideoPlayer />
    ) : (
      <MainContent />
    );

  return (
    <div className="h-screen w-full flex flex-col bg-surface overflow-hidden">
      <TopNav />
      <TabManager />

      <div className="flex-1 flex overflow-hidden">
        <DeepSearchPanel />

        <main className="flex-1 flex overflow-hidden">
          {centerContent}
        </main>

        <AIAssistant />
        <LibraryWorkspace />
      </div>
    </div>
  );
}
