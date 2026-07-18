'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useBrowserStore } from '@/store/useBrowserStore';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture2,
  SkipBack,
  SkipForward,
  Settings,
  Loader2,
  Clock,
  FileText,
} from 'lucide-react';
import { mockVideo } from '@/lib/mockData';
import type { VideoData, TranscriptSegment } from '@/types';

// -------------------------------------------
// تنسيق الوقت (ثواني -> mm:ss)
// -------------------------------------------
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// -------------------------------------------
// المكون الرئيسي
// -------------------------------------------
const VideoPlayer: React.FC = () => {
  // ---- المستودع ----
  const {
    video,
    tabs,
    activeTabId,
    setActiveVideo,
    updateVideoTime,
    setPlaying,
    setVideoVolume,
    togglePiP,
    toggleFullscreen,
  } = useBrowserStore();

  // ---- حالة محلية لعناصر التحكم ----
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- مرجع لعنصر الفيديو (للاستخدام المستقبلي مع فيديو حقيقي) ----
  const videoRef = useRef<HTMLVideoElement>(null);

  // ---- مرجع لمنطقة النص المفرغ للتمرير التلقائي ----
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // ---- الفيديو النشط (من المتجر أو من بيانات التبويب) ----
  const activeVideo = video.activeVideo;

  // ---- محاولة الحصول على فيديو من التبويب النشط إذا لم يكن موجوداً ----
  useEffect(() => {
    if (!activeVideo && activeTabId) {
      const currentTab = tabs.tabs.find((t) => t.id === activeTabId);
      if (currentTab?.contentData.type === 'video_player') {
        const { videoUrl, videoTitle } = currentTab.contentData;
        setActiveVideo({
          ...mockVideo,
          url: videoUrl,
          title: videoTitle || 'Untitled Video',
          currentTime: 0,
          isPlaying: false,
        });
      }
    }
  }, [activeTabId, activeVideo, tabs.tabs, setActiveVideo]);

  // ---- محاكاة تقدم الوقت عند التشغيل ----
  useEffect(() => {
    if (!activeVideo?.isPlaying) return;

    const interval = setInterval(() => {
      if (activeVideo) {
        const newTime = activeVideo.currentTime + 1;
        if (newTime >= activeVideo.duration) {
          setPlaying(false);
          updateVideoTime(activeVideo.duration);
        } else {
          updateVideoTime(newTime);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVideo?.isPlaying, activeVideo?.currentTime, activeVideo?.duration, setPlaying, updateVideoTime]);

  // ---- إخفاء عناصر التحكم تلقائياً بعد 3 ثوانٍ من عدم النشاط ----
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (activeVideo?.isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [activeVideo?.isPlaying]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [activeVideo?.isPlaying, resetControlsTimer]);

  // ---- معالج النقر على شريط التقدم ----
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeVideo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = clickX / rect.width;
    const newTime = fraction * activeVideo.duration;
    updateVideoTime(newTime);
  };

  // ---- التبديل بين التشغيل والإيقاف ----
  const togglePlay = () => {
    if (activeVideo) {
      setPlaying(!activeVideo.isPlaying);
    }
  };

  // ---- العثور على مقطع النص المفرغ الحالي ----
  const currentTranscript = activeVideo?.transcript?.find(
    (seg) =>
      activeVideo.currentTime >= seg.startTime &&
      activeVideo.currentTime < seg.endTime
  );

  // ---- التمرير التلقائي إلى مقطع النص النشط ----
  useEffect(() => {
    if (currentTranscript && transcriptContainerRef.current) {
      const activeElement = transcriptContainerRef.current.querySelector(
        `[data-start-time="${currentTranscript.startTime}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentTranscript]);

  // ---- إذا لم يوجد فيديو نشط، نعرض شاشة ترحيب ----
  if (!activeVideo) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center animate-fade-in">
        <div className="max-w-sm">
          <div className="mb-4 p-4 rounded-2xl bg-surface-light dark:bg-panel-dark inline-block">
            <Play size={48} className="text-text-muted-light dark:text-text-muted-dark" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            لا يوجد فيديو نشط
          </h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            أضف رابط فيديو (YouTube/Vimeo) في شريط البحث لتشغيله هنا.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col bg-black overflow-hidden"
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => activeVideo.isPlaying && setShowControls(false)}
    >
      {/* ---- منطقة عرض الفيديو ---- */}
      <div className="relative flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <Play size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">{activeVideo.title}</p>
          <p className="text-sm text-gray-400 mt-2">Scientific Video Player</p>
        </div>

        {/* ---- عناصر التحكم العائمة ---- */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* شريط التقدم */}
          <div
            className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer mb-3"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary-500 rounded-full relative"
              style={{
                width: `${(activeVideo.currentTime / activeVideo.duration) * 100}%`,
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full shadow" />
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-primary-300 transition-colors">
                {activeVideo.isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={() => updateVideoTime(Math.max(0, activeVideo.currentTime - 10))}
                className="hover:text-primary-300 transition-colors"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={() =>
                  updateVideoTime(Math.min(activeVideo.duration, activeVideo.currentTime + 10))
                }
                className="hover:text-primary-300 transition-colors"
              >
                <SkipForward size={18} />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVideoVolume(activeVideo.volume === 0 ? 0.8 : 0)}
                  className="hover:text-primary-300 transition-colors"
                >
                  {activeVideo.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={activeVideo.volume}
                  onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 accent-primary-500"
                />
              </div>

              <span className="text-xs text-gray-300 ml-2">
                {formatTime(activeVideo.currentTime)} / {formatTime(activeVideo.duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="hover:text-primary-300 transition-colors">
                <Settings size={18} />
              </button>
              <button onClick={togglePiP} className="hover:text-primary-300 transition-colors">
                <PictureInPicture2 size={18} />
              </button>
              <button onClick={toggleFullscreen} className="hover:text-primary-300 transition-colors">
                {video.isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---- لوحة المعلومات السفلية: Transcript + AI Summary ---- */}
      <div className="h-48 bg-panel-light dark:bg-panel-dark border-t border-border-light dark:border-border-dark overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-3">
          {/* الملخص الذكي */}
          {activeVideo.aiSummary && (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <span className="font-semibold flex items-center gap-1 mb-1">
                <FileText size={14} /> AI Summary
              </span>
              <p>{activeVideo.aiSummary}</p>
            </div>
          )}

          {/* النص المفرغ */}
          {activeVideo.transcript && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 flex items-center gap-1">
                <Clock size={14} /> Transcript
              </h4>
              <div ref={transcriptContainerRef} className="space-y-1">
                {activeVideo.transcript.map((seg, idx) => (
                  <div
                    key={idx}
                    data-start-time={seg.startTime}
                    className={`text-xs p-1.5 rounded transition-colors ${
                      currentTranscript?.startTime === seg.startTime
                        ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark'
                    }`}
                  >
                    <span className="text-primary-500 mr-2">{formatTime(seg.startTime)}</span>
                    {seg.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!activeVideo.aiSummary && !activeVideo.transcript && (
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-4">
              لا توجد معلومات إضافية لهذا الفيديو.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
