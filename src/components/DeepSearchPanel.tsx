'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBrowserStore } from '@/store/useBrowserStore';
import { Search, Filter, X } from 'lucide-react';
import { mockSearchPapers } from '@/lib/mockData';
import type { SearchQuery, SearchSource, BooleanOperator, ImpactQuartile } from '@/types';

// -------------------------------------------
// قوائم الاختيارات
// -------------------------------------------
const sourceOptions: { value: SearchSource; label: string }[] = [
  { value: 'arxiv', label: 'arXiv' },
  { value: 'pubmed', label: 'PubMed' },
  { value: 'semantic_scholar', label: 'Semantic Scholar' },
  { value: 'doaj', label: 'DOAJ' },
  { value: 'crossref', label: 'Crossref' },
];

const booleanOptions: { value: BooleanOperator; label: string }[] = [
  { value: 'AND', label: 'AND (كل الكلمات)' },
  { value: 'OR', label: 'OR (أي كلمة)' },
  { value: 'NOT', label: 'NOT (استبعاد)' },
];

const impactOptions: { value: ImpactQuartile | 'any'; label: string }[] = [
  { value: 'any', label: 'أي تصنيف' },
  { value: 'Q1', label: 'Q1 - الأعلى' },
  { value: 'Q2', label: 'Q2' },
  { value: 'Q3', label: 'Q3' },
  { value: 'Q4', label: 'Q4' },
  { value: 'unranked', label: 'غير مصنف' },
];

// -------------------------------------------
// المكون الرئيسي
// -------------------------------------------
const DeepSearchPanel: React.FC = () => {
  // ---- الحالة المحلية للاستعلام ----
  const [keywords, setKeywords] = useState('');
  const [booleanOp, setBooleanOp] = useState<BooleanOperator>('AND');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [source, setSource] = useState<SearchSource>('arxiv');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [impactQuartile, setImpactQuartile] = useState<ImpactQuartile | 'any'>('any');

  // ---- المستودع ----
  const {
    isDeepSearchOpen,
    toggleDeepSearch,
    addTab,
    setSearching,
    activeTabId,
    setTabError,
  } = useBrowserStore();

  // ---- مرجع اللوحة للإغلاق عند النقر خارجها (اختياري) ----
  const panelRef = useRef<HTMLDivElement>(null);

  // ---- إعادة تعيين الحقول عند الفتح ----
  useEffect(() => {
    if (isDeepSearchOpen) {
      // يمكن ترك الحقول كما هي أو إعادة تعيينها؛ هنا نبقيها لراحة المستخدم
    }
  }, [isDeepSearchOpen]);

  // ---- تنفيذ البحث ----
  const handleSearch = async () => {
    const query: SearchQuery = {
      keywords: keywords.trim(),
      booleanOperator: booleanOp,
      authors: authors.trim(),
      journal: journal.trim(),
      yearFrom: yearFrom ? parseInt(yearFrom, 10) : null,
      yearTo: yearTo ? parseInt(yearTo, 10) : null,
      source,
      openAccessOnly,
      impactQuartile: impactQuartile === 'any' ? null : impactQuartile,
      contentType: 'paper',
    };

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
        `بحث: ${keywords || 'كل الأوراق'}`,
        `search:${keywords}`
      );
    } catch (error) {
      setTabError(activeTabId || '', 'فشل في تنفيذ البحث المتقدم.');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  // ---- إعادة تعيين الحقول ----
  const handleReset = () => {
    setKeywords('');
    setBooleanOp('AND');
    setAuthors('');
    setJournal('');
    setYearFrom('');
    setYearTo('');
    setSource('arxiv');
    setOpenAccessOnly(false);
    setImpactQuartile('any');
  };

  // ---- إذا كانت اللوحة مغلقة، لا نعرض شيئاً ----
  if (!isDeepSearchOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="panel w-80 flex-shrink-0 h-full overflow-y-auto custom-scrollbar animate-slide-in-left"
    >
      {/* ---- رأس اللوحة ---- */}
      <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
          <Filter size={18} />
          بحث متقدم
        </h2>
        <button
          onClick={toggleDeepSearch}
          className="icon-btn"
          aria-label="إغلاق البحث المتقدم"
        >
          <X size={18} />
        </button>
      </div>

      {/* ---- جسم اللوحة: حقول الإدخال ---- */}
      <div className="p-4 space-y-4">
        {/* الكلمات المفتاحية */}
        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
            الكلمات المفتاحية
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="مثال: transformer attention"
            className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>

        {/* العامل المنطقي */}
        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
            العامل المنطقي
          </label>
          <select
            value={booleanOp}
            onChange={(e) => setBooleanOp(e.target.value as BooleanOperator)}
            className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {booleanOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* المؤلف */}
        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
            المؤلف
          </label>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="اسم المؤلف"
            className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>

        {/* المجلة */}
        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
            المجلة
          </label>
          <input
            type="text"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="اسم المجلة"
            className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>

        {/* نطاق السنة */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
              من سنة
            </label>
            <input
              type="number"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              placeholder="2020"
              min="1900"
              max="2099"
              className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
              إلى سنة
            </label>
            <input
              type="number"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              placeholder="2024"
              min="1900"
              max="2099"
              className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            />
          </div>
        </div>

        {/* المصدر */}
        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
            المصدر
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as SearchSource)}
            className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {sourceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* الوصول المفتوح */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="oa-checkbox"
            checked={openAccessOnly}
            onChange={(e) => setOpenAccessOnly(e.target.checked)}
            className="h-4 w-4 rounded border-border-light dark:border-border-dark text-primary-500 focus:ring-primary-500"
          />
          <label
            htmlFor="oa-checkbox"
            className="text-sm text-text-secondary-light dark:text-text-secondary-dark cursor-pointer"
          >
            الوصول المفتوح فقط (Open Access)
          </label>
        </div>

        {/* تصنيف معامل التأثير */}
        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
            تصنيف المجلة (Impact Quartile)
          </label>
          <select
            value={impactQuartile}
            onChange={(e) => setImpactQuartile(e.target.value as ImpactQuartile | 'any')}
            className="w-full px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-text-primary-light dark:text-text-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {impactOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---- أزرار التنفيذ ---- */}
      <div className="p-4 border-t border-border-light dark:border-border-dark space-y-2">
        <button
          onClick={handleSearch}
          className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Search size={16} />
          بحث
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2 px-4 border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark rounded-lg text-sm hover:bg-panel-light dark:hover:bg-panel-dark transition-colors"
        >
          إعادة تعيين
        </button>
      </div>
    </div>
  );
};

export default DeepSearchPanel;
