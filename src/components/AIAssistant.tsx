'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBrowserStore } from '@/store/useBrowserStore';
import { mockAISummarize } from '@/lib/mockData';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  FileText,
  Search,
  Languages,
  Loader2,
  User,
  Bot,
} from 'lucide-react';
import type { AITask, AIMessage } from '@/types';

// -------------------------------------------
// خيارات المهام السريعة
// -------------------------------------------
const quickTasks: { task: AITask; label: string; icon: React.ReactNode }[] = [
  { task: 'summarize', label: 'تلخيص', icon: <FileText size={14} /> },
  { task: 'explain', label: 'شرح', icon: <Search size={14} /> },
  { task: 'translate', label: 'ترجمة', icon: <Languages size={14} /> },
  { task: 'analyze', label: 'تحليل', icon: <Sparkles size={14} /> },
];

// -------------------------------------------
// المكون الرئيسي
// -------------------------------------------
const AIAssistant: React.FC = () => {
  // ---- المستودع ----
  const {
    ai,
    toggleAIPanel,
    setAITask,
    sendAIMessage,
    setAILoading,
    selectPaperForAI,
    tabs,
    activeTabId,
  } = useBrowserStore();

  // ---- الحالة المحلية ----
  const [inputValue, setInputValue] = useState('');

  // ---- مرجع لمنطقة المحادثة للتمرير التلقائي ----
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ---- التمرير التلقائي عند وصول رسالة جديدة ----
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ai.messages]);

  // ---- الورقة المحددة حالياً (إن وجدت) ----
  const selectedPaper = ai.selectedPaperId
    ? tabs.tabs
        .flatMap((t) => {
          if (t.contentData.type === 'paper_view') return [t.contentData.paper];
          if (t.contentData.type === 'search_results') return t.contentData.results;
          return [];
        })
        .find((p) => p.id === ai.selectedPaperId) || null
    : null;

  // ---- معالج الإرسال ----
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    // إرسال رسالة المستخدم
    sendAIMessage(text);
    setInputValue('');

    // محاكاة رد من المساعد (يمكن استبدالها بـ API)
    setAILoading(true);
    try {
      if (selectedPaper && ai.currentTask === 'summarize') {
        const summary = await mockAISummarize(selectedPaper.id);
        // إضافة رد المساعد بعد التحميل
        const assistantMessage: AIMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: summary,
          timestamp: new Date().toISOString(),
        };
        // (سنضيفه عبر تحديث المتجر – لكن حالياً sendAIMessage يضيف ردًا وهميًا)
        // نكتفي بالرد الوهمي اللي موجود مسبقاً أو نحسّن الإجراء لاحقاً
      }
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setAILoading(false);
    }
  };

  // ---- تحديد مهمة سريعة ----
  const handleQuickTask = (task: AITask) => {
    setAITask(task);
    const prompts: Record<AITask, string> = {
      summarize: selectedPaper ? 'لخص هذه الورقة' : 'أدخل نصًا لتلخيصه',
      explain: 'اشرح: ',
      translate: 'ترجم إلى العربية: ',
      compare: 'قارن بين: ',
      analyze: 'حلل: ',
      general: '',
    };
    setInputValue(prompts[task] || '');
  };

  // ---- إذا كانت اللوحة مغلقة، لا نعرض شيئاً ----
  if (!ai.isOpen) {
    return null;
  }

  return (
    <div className="panel w-80 flex-shrink-0 h-full flex flex-col animate-slide-in-right">
      {/* ---- رأس اللوحة ---- */}
      <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
          <MessageSquare size={18} />
          المساعد الذكي
        </h2>
        <button
          onClick={toggleAIPanel}
          className="icon-btn"
          aria-label="إغلاق المساعد الذكي"
        >
          <X size={18} />
        </button>
      </div>

      {/* ---- سياق الورقة المحددة ---- */}
      {selectedPaper && (
        <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 border-b border-border-light dark:border-border-dark text-xs text-text-secondary-light dark:text-text-secondary-dark">
          <span className="font-medium">الورقة:</span>{' '}
          {selectedPaper.metadata.title.substring(0, 60)}...
        </div>
      )}

      {/* ---- أزرار المهام السريعة ---- */}
      <div className="flex items-center gap-1 p-2 border-b border-border-light dark:border-border-dark overflow-x-auto">
        {quickTasks.map(({ task, label, icon }) => (
          <button
            key={task}
            onClick={() => handleQuickTask(task)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
              ai.currentTask === task
                ? 'bg-primary-500 text-white'
                : 'bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary-50 dark:hover:bg-primary-900/20'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ---- منطقة المحادثة ---- */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
        {ai.messages.length === 0 && (
          <div className="text-center text-text-muted-light dark:text-text-muted-dark text-sm py-12">
            <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
            <p>اسأل المساعد الذكي عن أي شيء</p>
            <p className="text-xs mt-1">يمكنك تلخيص الأوراق، شرح المصطلحات، أو الترجمة</p>
          </div>
        )}

        {ai.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-md'
                  : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString('ar', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </div>
            )}
          </div>
        ))}

        {/* مؤشر التحميل */}
        {ai.isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="px-3 py-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-bl-md">
              <Loader2 size={16} className="animate-spin text-primary-500" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ---- شريط الإدخال ---- */}
      <div className="p-3 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="اكتب سؤالك..."
            className="flex-1 px-3 py-2 text-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || ai.isLoading}
            className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed text-primary-500"
            aria-label="إرسال"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
