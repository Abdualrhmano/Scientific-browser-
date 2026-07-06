'use client';

import { useEffect, useRef } from 'react';
import { useBrowserStore, useBrowserShallow } from '../store/useBrowserStore';

export default function MainContent() {
  const { tabs } = useBrowserStore(useBrowserShallow((s) => ({ tabs: s.tabs })));
  const activeTab = tabs.find((t) => t.active) ?? tabs[0];

  return (
    <main className="flex-1 p-6 overflow-auto bg-gradient-to-b from-oxford/90 to-oxford/80">
      <div className="max-w-7xl mx-auto bg-white/5 rounded-xl p-6 ring-1 ring-white/5 min-h-[75vh] flex flex-col">
        {activeTab?.type === 'video' ? <VideoWorkspace tab={activeTab} /> : <ResearchWorkspace tab={activeTab} />}
      </div>
    </main>
  );
}

function VideoWorkspace({ tab }: { tab: { id: string; title: string; url?: string } }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup video streams safely
    };
  }, []);

  return (
    <div className="grid grid-cols-12 gap-5 flex-1 h-full">
      <div className="col-span-8 bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col justify-between">
        <div>
          <div className="text-xs font-mono text-cyan uppercase tracking-widest mb-1">[MEDIA NODE INGESTION]</div>
          <h2 className="text-base font-bold text-white mb-3">{tab.title}</h2>
        </div>

        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative border border-white/10 shadow-2xl">
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
            crossOrigin="anonymous"
          >
            <source src={tab.url ?? 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
            Media engine unavailable.
          </video>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="text-[10px] font-mono text-white/40">Secure Stream: Sandbox Protected</span>
        </div>
      </div>

      <div className="col-span-4 bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col">
        <div className="text-xs font-mono text-cyan uppercase tracking-widest mb-3">Time-Stamped Intelligence</div>
        <TimeStampedNotes videoRef={videoRef} />
      </div>
    </div>
  );
}

function ResearchWorkspace({ tab }: { tab: { id: string; title: string; url?: string } }) {
  return (
    <div className="bg-black/10 rounded-xl p-4 border border-white/5 flex flex-col flex-1">
      <div className="text-xs font-mono text-emerald uppercase tracking-widest mb-1">[DOCUMENT VIEWPORT]</div>
      <h2 className="text-base font-bold text-white mb-4">{tab.title}</h2>

      <div className="flex-1 min-h-[500px] bg-white rounded-lg overflow-hidden border border-white/10 shadow-2xl">
        <iframe
          title="Isolated Document Frame"
          src={tab.url || 'about:blank'}
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

function TimeStampedNotes({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const saveBookmark = useBrowserStore((s) => s.addBookmark);
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTab = tabs.find((t) => t.active);

  const handleSaveNote = (text: string) => {
    if (text.length > 0) {
      saveBookmark({ title: `Note: ${text.slice(0, 40)}`, url: activeTab?.url ?? '' });
    }
  };

  const handleCapture = () => {
    const currentTime = videoRef.current?.currentTime ?? 0;
    const noteMarker = `Timestamp ${formatTime(currentTime)} — `;
    handleSaveNote(noteMarker);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <button
        onClick={handleCapture}
        className="w-full bg-cyan text-oxford py-2 rounded-md font-bold text-xs hover:bg-cyan/90 transition-colors"
      >
        Capture Stream Frame
      </button>

      <textarea
        aria-label="Secure Text Notes Input"
        placeholder="Input runtime observations here..."
        className="w-full flex-1 resize-none text-sm font-mono p-3 rounded-lg bg-black/40 text-white border border-white/10 focus:outline-none focus:border-cyan placeholder-white/20"
        onBlur={(e) => handleSaveNote(e.target.value.trim())}
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
