'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  PanelLeftClose,
  PanelLeft,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useBrowserStore } from '@/store/useBrowserStore';
import { mockSearchPapers, mockFetchPaperByDOI } from '@/lib/mockData';
import type { SearchQuery, SearchSource } from '@/types';

// -------------------------------------------
// خريطة عرض اسم المصدر
// -------------------------------------------
const sourceLabels: Record<SearchSource, string> = {
  arxiv: 'arXiv',
  pubmed: 'PubMed',
  semantic_scholar: 'Semantic Scholar',
  doaj: 'DOAJ',
  crossref: 'Crossref',
};

// -------------------------------------------
// المكون الرئيسي
// -------------------------------------------
const TopNav: React.FC = () => {
  // ---- الحالة المحلية ----
  const [inputValue, setInputValue] = useState('');
  const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);

  // ---- المرجع للقائمة المنسدلة ----
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ---- المستودع ----
  const {
    tabs,
    activeTabId,
    addTab,
    setActiveTab,
    setTabLoading,
    setTabError,
    isDeepSearchOpen,
    toggleDeepSearch,
    ai,
    toggleAIPanel,
    isDarkMode,
    toggleDarkMode,
    activeSource,
    setActiveSource,
    isSearching,
    setSearching,
  } = useBrowserStore();

  // ---- تأثير جانبي: مزامنة الوضع المظلم مع عنصر HTML ----
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // ---- تأثير جانبي: إغلاق القائمة المنسدلة عند النقر خارجها ----
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSourceMenuOpen(false);
      }
    };

    if (isSourceMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSourceMenuOpen]);

  // ---- التنقل بين التبويبات ----
  const activeTabIndex = tabs.tabs.findIndex((t) => t.id === activeTabId);
  const canGoBack = activeTabIndex > 0;
  const canGoForward = activeTabIndex < tabs.tabs.length - 1;

  const handleBack = () => {
    if (canGoBack) {
      const prevTab = tabs.tabs[activeTabIndex - 1];
      setActiveTab(prevTab.id);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      const nextTab = tabs.tabs[activeTabIndex + 1];
      setActiveTab(nextTab.id);
    }
  };

  const handleRefresh = () => {
    if (!activeTabId) return;
    const currentTab = tabs.tabs.find((t) => t.id === activeTabId);
    if (!currentTab) return;
    if (currentTab.contentData.type === 'search_results') {
      performSearch(currentTab.contentData.query);
    }
  };

  // ---- إجراء البحث (أو فتح ورقة/فيديو) ----
  const performSearch = useCallback(
    async (query: SearchQuery) => {
      setSearching(true);
      try {
        const response = await mockSearchPapers(query);
        addTab(
          {
            type: 'search_results',
            query,
            results: response.results,
            totalResults: response.totalResults,
          },
          `Search: ${query.keywords || 'All Papers'}`,
          `search:${query.keywords}`
        );
      } catch (error) {
        setTabError(activeTabId || '', 'فشل في تنفيذ البحث.');
        console.error(error);
      } finally {
        setSearching(false);
      }
    },
    [addTab, activeTabId, setSearching, setTabError]
  );

  // ---- معالج الإدخال في شريط البحث ----
  const handleInputSubmit = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (/^10\.\S+/.test(trimmed)) {
      setSearching(true);
      try {
        const paper = await mockFetchPaperByDOI(trimmed);
        if (paper) {
          addTab(
            { type: 'paper_view', paper, showAIPanel: false },
            paper.metadata.title,
            `doi:${trimmed}`
          );
        } else {
          setTabError(activeTabId || '', 'لم يتم العثور على ورقة بهذا DOI.');
        }
      } catch (error) {
        setTabError(activeTabId || '', 'خطأ أثناء جلب الورقة.');
      } finally {
        setSearching(false);
      }
      setInputValue('');
      return;
    }

    if (/youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\//.test(trimmed)) {
      addTab(
        {
          type: 'video_player',
          videoUrl: trimmed,
          videoTitle: trimmed,
        },
        `Video: ${trimmed.substring(0, 30)}...`,
        trimmed
      );
      setInputValue('');
      return;
    }

    const query: SearchQuery = {
      keywords: trimmed,
      booleanOperator: 'AND',
      authors: '',
      journal: '',
      yearFrom: null,
      yearTo: null,
      source: activeSource,
      openAccessOnly: false,
      impactQuartile: null,
      contentType: 'paper',
    };

    await performSearch(query);
    setInputValue('');
  };

  const handleSourceSelect = (source: SearchSource) => {
    setActiveSource(source);
    setIsSourceMenuOpen(false);
  };

  return (
    <header className="h-12 flex items-center gap-2 px-2 bg-panel-light dark:bg-panel-dark border-b border-border-light dark:border-border-dark select-none">
      {/* ---- المجموعة اليسرى: أزرار التنقل ---- */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="رجوع"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={handleForward}
          disabled={!canGoForward}
          className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="تقدم"
        >
          <ArrowRight size={18} />
        </button>
        <button
          onClick={handleRefresh}
          className="icon-btn"
          aria-label="تحديث"
        >
          <RotateCw size={18} />
        </button>
      </div>

      {/* ---- المجموعة الوسطى: شريط البحث + اختيار المصدر ---- */}
      <div className="flex-1 flex items-center gap-2 max-w-3xl mx-auto">
        {/* قائمة منسدلة لاختيار المصدر */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSourceMenuOpen(!isSourceMenuOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <span>{sourceLabels[activeSource]}</span>
            <ChevronDown size={14} />
          </button>

          {isSourceMenuOpen && (
            <div className="absolute top-full mt-1 left-0 w-48 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-50 animate-fade-in">
              {(Object.keys(sourceLabels) as SearchSource[]).map((src) => (
                <button
                  key={src}
                  onClick={() => handleSourceSelect(src)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors ${
                    activeSource === src
                      ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20'
                      : 'text-text-secondary-light dark:text-text-secondary-dark'
                  }`}
                >
                  {sourceLabels[src]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* شريط البحث */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInputSubmit();
              }
            }}
            placeholder="ابحث عن أوراق علمية، أو أدخل DOI..."
            className="search-bar pl-10 pr-4 w-full"
            aria-label="شريط البحث الرئيسي"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark pointer-events-none">
            {isSearching ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </div>
        </div>
      </div>

      {/* ---- المجموعة اليمنى: أزرار التبديل ---- */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={toggleDeepSearch}
          className={`icon-btn ${isDeepSearchOpen ? 'active' : ''}`}
          aria-label={isDeepSearchOpen ? 'إغلاق البحث العميق' : 'فتح البحث العميق'}
        >
          {isDeepSearchOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>

        <button
          onClick={toggleAIPanel}
          className={`icon-btn ${ai.isOpen ? 'active' : ''}`}
          aria-label={ai.isOpen ? 'إغلاق المساعد الذكي' : 'فتح المساعد الذكي'}
        >
          <MessageSquare size={18} />
        </button>

        <button
          onClick={toggleDarkMode}
          className="icon-btn"
          aria-label={isDarkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default TopNav;
