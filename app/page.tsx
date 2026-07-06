import TopNav from '../src/components/TopNav';
import TabManager from '../src/components/TabManager';
import DeepSearchPanel from '../src/components/DeepSearchPanel';
import LibraryWorkspace from '../src/components/LibraryWorkspace';
import MainContent from '../src/components/MainContent';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <TabManager />
      <div className="flex flex-1 h-[calc(100vh-128px)]">
        <DeepSearchPanel />
        <MainContent />
        <LibraryWorkspace />
      </div>
    </div>
  );
}
