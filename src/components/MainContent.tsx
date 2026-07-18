'use client';

import React from 'react';
import { useBrowserStore } from '@/store/useBrowserStore';
import PaperCard from './PaperCard';
import { FileText, Search, Video, MessageSquare, Library, Sparkles } from 'lucide-react';
import type { TabContentData, Paper } from '@/types';

// -------------------------------------------
// صفحة البداية (عندما لا يوجد تبويب نشط أو التبويب فارغ)
// -------------------------------------------
const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="mb-6 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20">
        <Sparkles size={48} className="text-primary-500" />
      </div>
      <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
        Scientific Browser
      </h1>
      <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-md mb-6">
        ابحث عن الأوراق العلمية، شغّل الفيديوهات التعليمية، واستعن بالمساعد الذكي.
        <br />
        ابدأ بكتابة كلمات مفتاحية أو DOI في شريط البحث أعلاه.
      </p>
      <div className="grid grid-cols-2 gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
        <div className="flex items-center gap-2">
          <Search size={16} /> بحث متقدم
        </div>
        <div className="flex items-center gap-2">
          <FileText size={16} /> تصفح الأوراق
        </div>
        <div className="flex items-center gap-2">
          <Video size={16} /> فيديوهات علمية
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare size={16} /> تلخيص ذكي
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------
// عرض تفاصيل ورقة (نوع paper_view)
// -------------------------------------------
const PaperView: React.FC<{ paper: Paper; showAIPanel: boolean }> = ({ paper, showAIPanel }) => {
  const { toggleAIPanel, selectPaperForAI } = useBrowserStore();

  const handleAskAI = () => {
    selectPaperForAI(paper.id);
    if (!showAIPanel) {
      toggleAIPanel();
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar animate-fade-in">
      <article className="prose dark:prose-invert max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{paper.metadata.title}</h1>

        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {paper.metadata.authors.map((author, idx) => (
            <span key={idx} className="font-medium">
              {author.fullName}
              {idx < paper.metadata.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="badge badge-info">{paper.metadata.year}</span>
          {paper.metadata.journal && (
            <span className="badge badge-warning">{paper.metadata.journal}</span>
          )}
          {paper.metadata.accessType === 'open' && (
            <span className="badge badge-success">Open Access</span>
          )}
          <span className="badge bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
            Cited {paper.metadata.citations} times
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-2">Abstract</h3>
        <p className="text-reader leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
          {paper.metadata.abstract}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAskAI}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <MessageSquare size={16} />
            اسأل المساعد الذكي
          </button>
          {paper.metadata.pdfUrl && (
            <a
              href={paper.metadata.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-sm hover:bg-panel-light dark:hover:bg-panel-dark transition-colors flex items-center gap-2"
            >
              <FileText size={16} />
              فتح PDF
            </a>
          )}
        </div>
      </article>
    </div>
  );
};

// -------------------------------------------
// عرض نتائج البحث (نوع search_results)
// -------------------------------------------
const SearchResultsView: React.FC<{ contentData: Extract<TabContentData, { type: 'search_results' }> }> = ({
  contentData,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar animate-fade-in">
      <div className="mb-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        تم العثور على <span className="font-medium">{contentData.totalResults}</span> نتيجة
        {contentData.query.keywords && (
          <>
            {' '}لـ &quot;<span className="font-medium">{contentData.query.keywords}</span>&quot;
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {contentData.results.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
      {contentData.results.length === 0 && (
        <div className="text-center py-12 text-text-muted-light dark:text-text-muted-dark">
          لا توجد نتائج مطابقة. جرّب كلمات مفتاحية أخرى.
        </div>
      )}
    </div>
  );
};

// -------------------------------------------
// المكون الرئيسي
// -------------------------------------------
const MainContent: React.FC = () => {
  const { tabs, activeTabId } = useBrowserStore();

  const activeTab = activeTabId
    ? tabs.tabs.find((tab) => tab.id === activeTabId)
    : null;

  // لا يوجد تبويب نشط أو التبويب فارغ
  if (!activeTab || activeTab.contentData.type === 'blank') {
    return <WelcomeScreen />;
  }

  const { contentData } = activeTab;

  // توجيه إلى المكون المناسب حسب نوع المحتوى
  switch (contentData.type) {
    case 'paper_view':
      return (
        <PaperView
          paper={contentData.paper}
          showAIPanel={contentData.showAIPanel}
        />
      );

    case 'search_results':
      return <SearchResultsView contentData={contentData} />;

    case 'video_player':
      return (
        <div className="flex-1 flex items-center justify-center p-8 text-text-muted-light dark:text-text-muted-dark animate-fade-in">
          <div className="text-center">
            <Video size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Video Player</p>
            <p className="text-sm">سيتم تحميل الفيديو هنا قريباً.</p>
          </div>
        </div>
      );

    case 'ai_assistant':
      return (
        <div className="flex-1 flex items-center justify-center p-8 text-text-muted-light dark:text-text-muted-dark animate-fade-in">
          <div className="text-center">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">AI Assistant</p>
            <p className="text-sm">سيتم تفعيل المساعد الذكي هنا قريباً.</p>
          </div>
        </div>
      );

    case 'library':
      return (
        <div className="flex-1 flex items-center justify-center p-8 text-text-muted-light dark:text-text-muted-dark animate-fade-in">
          <div className="text-center">
            <Library size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Library Workspace</p>
            <p className="text-sm">سيتم عرض المكتبة هنا قريباً.</p>
          </div>
        </div>
      );

    default:
      return <WelcomeScreen />;
  }
};

export default MainContent;
