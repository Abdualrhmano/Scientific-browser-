'use client';

import React, { useState } from 'react';
import { useBrowserStore } from '@/store/useBrowserStore';
import {
  FolderOpen,
  Tag,
  BookOpen,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Library,
} from 'lucide-react';
import type { Paper } from '@/types';

// -------------------------------------------
// المكون الرئيسي
// -------------------------------------------
const LibraryWorkspace: React.FC = () => {
  const {
    workspace,
    toggleSavePaper,
    addFolder,
    deleteFolder,
    setActiveFolder,
    addTag,
    removeTag,
    updateReadingProgress,
    isLibraryOpen,
    toggleLibrary,
    addTab,
  } = useBrowserStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);

  // ---- إضافة مجلد جديد ----
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setShowAddFolder(false);
    }
  };

  // ---- فتح ورقة في تبويب ----
  const handleOpenPaper = (paper: Paper) => {
    addTab(
      { type: 'paper_view', paper, showAIPanel: false },
      paper.metadata.title,
      paper.metadata.doi
    );
  };

  // ---- إذا كانت اللوحة مغلقة، لا نعرض شيئاً ----
  if (!isLibraryOpen) {
    return null;
  }

  return (
    <div className="panel w-80 flex-shrink-0 h-full overflow-y-auto custom-scrollbar animate-slide-in-right">
      {/* ---- رأس اللوحة ---- */}
      <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
          <Library size={18} />
          المكتبة
        </h2>
        <button
          onClick={toggleLibrary}
          className="icon-btn"
          aria-label="إغلاق المكتبة"
        >
          <X size={18} />
        </button>
      </div>

      {/* ---- المحتوى ---- */}
      <div className="p-4 space-y-6">
        {/* ---- المجلدات ---- */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">
              المجلدات
            </h3>
            <button
              onClick={() => setShowAddFolder(!showAddFolder)}
              className="icon-btn"
              aria-label="إضافة مجلد"
            >
              <Plus size={16} />
            </button>
          </div>

          {showAddFolder && (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFolder();
                  if (e.key === 'Escape') setShowAddFolder(false);
                }}
                placeholder="اسم المجلد"
                className="flex-1 px-2 py-1 text-xs bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded text-text-primary-light dark:text-text-primary-dark focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                autoFocus
              />
              <button
                onClick={handleAddFolder}
                className="px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
              >
                إضافة
              </button>
            </div>
          )}

          <ul className="space-y-1">
            {workspace.folders.map((folder) => (
              <li key={folder.id}>
                <button
                  onClick={() => setActiveFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors ${
                    workspace.activeFolderId === folder.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-panel-light dark:hover:bg-panel-dark'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <ChevronRight
                      size={14}
                      className={`transition-transform ${
                        workspace.activeFolderId === folder.id ? 'rotate-90' : ''
                      }`}
                    />
                    <FolderOpen size={14} />
                    {folder.name}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                    {folder.paperCount}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      className="p-0.5 hover:text-error transition-colors"
                      aria-label={`حذف ${folder.name}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                </button>
              </li>
            ))}
            {workspace.folders.length === 0 && (
              <li className="text-xs text-text-muted-light dark:text-text-muted-dark px-2 py-2">
                لا توجد مجلدات بعد
              </li>
            )}
          </ul>
        </section>

        {/* ---- الوسوم ---- */}
        <section>
          <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">
            الوسوم
          </h3>
          <div className="flex flex-wrap gap-1">
            {workspace.tags.length > 0 ? (
              workspace.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-panel-light dark:bg-panel-dark text-text-secondary-light dark:text-text-secondary-dark"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                لا توجد وسوم بعد
              </span>
            )}
          </div>
        </section>

        {/* ---- قائمة القراءة وتقدمها ---- */}
        <section>
          <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">
            قائمة القراءة
          </h3>
          {workspace.savedPapers.length > 0 ? (
            <ul className="space-y-2">
              {workspace.savedPapers.map((paper) => (
                <li
                  key={paper.id}
                  className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark"
                >
                  <button
                    onClick={() => handleOpenPaper(paper)}
                    className="w-full text-left mb-1.5"
                  >
                    <p className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark truncate-lines-2">
                      {paper.metadata.title}
                    </p>
                  </button>
                  <div className="flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark mb-1.5">
                    <span>{paper.metadata.authors[0]?.lastName} ({paper.metadata.year})</span>
                    <button
                      onClick={() => toggleSavePaper(paper)}
                      className="hover:text-error transition-colors"
                      aria-label="إزالة من المكتبة"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {/* شريط تقدم القراءة */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-panel-light dark:bg-panel-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${paper.readingProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted-light dark:text-text-muted-dark w-8 text-right">
                      {paper.readingProgress}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              لا توجد أوراق محفوظة بعد
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default LibraryWorkspace;
