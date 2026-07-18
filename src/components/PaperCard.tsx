'use client';

import React from 'react';
import { useBrowserStore } from '@/store/useBrowserStore';
import { FileText, Users, Calendar, ExternalLink, MessageSquare, Lock } from 'lucide-react';
import type { Paper } from '@/types';

// -------------------------------------------
// الخصائص
// -------------------------------------------
interface PaperCardProps {
  paper: Paper;
}

// -------------------------------------------
// المكون
// -------------------------------------------
const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  const { addTab, ai, toggleAIPanel, selectPaperForAI } = useBrowserStore();

  // فتح الورقة في تبويب جديد
  const handleOpenPaper = () => {
    addTab(
      { type: 'paper_view', paper, showAIPanel: false },
      paper.metadata.title,
      paper.metadata.doi
    );
  };

  return (
    <div
      onClick={handleOpenPaper}
      className="paper-card group cursor-pointer"
    >
      {/* ---- الصف العلوي: العنوان وشارات الحالة ---- */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {paper.metadata.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {paper.metadata.accessType === 'open' && (
            <span className="badge badge-success" title="Open Access">
              <FileText size={12} className="mr-0.5" /> OA
            </span>
          )}
          {paper.metadata.accessType === 'restricted' && (
            <span className="badge bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" title="Restricted Access">
              <Lock size={12} className="mr-0.5" /> Restricted
            </span>
          )}
          {paper.metadata.impactQuartile !== 'unranked' && (
            <span className="badge badge-info" title={`Impact: ${paper.metadata.impactQuartile}`}>
              {paper.metadata.impactQuartile}
            </span>
          )}
        </div>
      </div>

      {/* ---- الصف الثاني: المؤلفون ---- */}
      <div className="flex items-center gap-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1.5">
        <Users size={14} className="flex-shrink-0" />
        <span className="truncate">
          {paper.metadata.authors.map((a) => a.lastName).join(', ')}
        </span>
      </div>

      {/* ---- الصف الثالث: معلومات النشر ---- */}
      <div className="flex items-center flex-wrap gap-3 text-xs text-text-muted-light dark:text-text-muted-dark mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {paper.metadata.year}
        </span>
        {paper.metadata.journal && (
          <span className="truncate max-w-[200px]">
            {paper.metadata.journal}
          </span>
        )}
        <span>
          Cited {paper.metadata.citations} times
        </span>
        {paper.metadata.doi && (
          <a
            href={paper.metadata.landingPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-0.5 text-primary-500 hover:underline"
          >
            <ExternalLink size={12} />
            DOI
          </a>
        )}
      </div>

      {/* ---- الملخص ---- */}
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed line-clamp-3 mb-3">
        {paper.metadata.abstract || 'لا يوجد ملخص متاح.'}
      </p>

      {/* ---- الصف السفلي: الكلمات المفتاحية والذكاء الاصطناعي ---- */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {paper.metadata.keywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 text-xs rounded-full bg-panel-light dark:bg-panel-dark text-text-muted-light dark:text-text-muted-dark"
            >
              {kw}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            selectPaperForAI(paper.id);
            if (!ai.isOpen) {
              toggleAIPanel();
            }
          }}
          className="text-xs flex items-center gap-1 text-primary-500 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MessageSquare size={14} />
          Ask AI
        </button>
      </div>
    </div>
  );
};

export default PaperCard;
