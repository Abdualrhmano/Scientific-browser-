'use client';

import { useEffect, useRef } from 'react';
import { useBrowserStore } from '../store/useBrowserStore';
import shallow from 'zustand/shallow';

export default function MainContent() {
  const { tabs } = useBrowserStore((s) => ({ tabs: s.tabs }), shallow);
  const activeTab = tabs.find((t) => t.active) ?? tabs[0];

  return (
    <main className="flex-1 p-6 overflow-auto bg-gradient-to-b from-oxford/90 to-oxford/80">
      <div className="max-w-7xl mx-auto bg-white/5 rounded-xl p-6 ring-1 ring-white/6 min-h-[60vh]">
        <h1 className="text-2xl font-semibold text-white mb-4">Research Workspace</h1>

        {activeTab?.type === 'video' ? <VideoWorkspace tab={activeTab} /> : <ResearchWorkspace tab={activeTab} />}
      </div>
    </main>
  );
}

/* Video workspace component */
function VideoWorkspace({ tab }: { tab: { id: string; title: string; url?: string } }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const saveNote = useBrowserStore((s) => s.addBookmark); /* placeholder to show secure store usage */

  useEffect(() => {
    /* Example: attach analytics or secure playback hooks here */
    return () => {
      /* cleanup */
    };
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8 bg-white/6 rounded-md p-3">
        <div className="text-sm text-white/90 font-medium mb-2">{tab.title || 'Lecture'}</div>

        {/* Secure HTML5 video player */}
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          className="w-full h-[420px] bg-black rounded-md"
          crossOrigin="anonymous"
          /* Do not allow autoplay without user gesture; keep secure attributes */
        >
          {/* NOTE: treat src as untrusted; only use sanitized URLs from server or signed URLs */}
          <source src={tab.url ?? '/sample-lecture.mp4'} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="mt-3 flex items-center gap-3">
          <button className="btn bg-emerald text-oxford">Capture Timestamp</button>
          <button className="btn bg-cyan text-oxford">Clip</button>
        </div>
      </div>

      <div className="col-span-4 bg-white/6 rounded-md p-3 flex flex-col">
        <div className="text-sm text-white/90 font-medium mb-2">Notes (time-stamped)</div>
        <TimeStampedNotes videoRef={videoRef} />
      </div>
    </div>
  );
}

/* Research workspace placeholder (PDF) */
function ResearchWorkspace({ tab }: { tab: { id: string; title: string; url?: string } }) {
  return (
    <div className="bg-white/6 rounded-md p-4 min-h-[420px]">
      <div className="text-sm text-white/90 font-medium mb-2">{tab.title || 'Research Document'}</div>

      {/* Secure iframe for PDF preview (sandboxed) */}
      <div className="h-[520px] bg-white rounded overflow-hidden">
        <iframe
          title="PDF Workspace"
          src={tab.url ?? '/sample.pdf'}
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

/* Time-stamped notes component */
function TimeStampedNotes({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const saveBookmark = useBrowserStore((s) => s.addBookmark);
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTab = tabs.find((t) => t.active);

  const handleSaveNote = async (text: string) => {
    /* Save note securely to bookmarks as a placeholder for persistent notes.
       All user input is treated as plain text and never injected as HTML. */
    saveBookmark({ title: `Note: ${text.slice(0, 40)}`, url: activeTab?.url ?? '' });
  };

  const handleCapture = () => {
    const currentTime = videoRef.current?.currentTime ?? 0;
    const note = `Timestamp ${formatTime(currentTime)} — `;
    handleSaveNote(note);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handleCapture}
          className="bg-emerald text-oxford px-3 py-1 rounded-md text-sm font-semibold"
          aria-label="Capture current timestamp"
        >
          Capture
        </button>
        <div className="text-xs text-white/70">Saved notes are stored locally</div>
      </div>

      <textarea
        aria-label="Notes"
        placeholder="Take time-stamped notes here. Text is saved locally."
        className="flex-1 resize-none rounded-md p-2 bg-white/5 text-white placeholder-white/60"
        onBlur={(e) => {
          const text = e.target.value.trim();
          if (text.length > 0) {
            handleSaveNote(text);
          }
        }}
      />
    </div>
  );
}

function formatTime(sec: number) {
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  const m = Math.floor((sec / 60) % 60).toString().padStart(2, '0');
  const h = Math.floor(sec / 3600).toString().padStart(2, '0');
  return h !== '00' ? `${h}:${m}:${s}` : `${m}:${s}`;
}
