import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { Court } from './components/Court';
import { Timeline } from './components/Timeline';
import { WelcomeTutorial } from './components/WelcomeTutorial';
import { usePlayStore } from './store/usePlayStore';

function App() {
  const { showWelcome } = usePlayStore();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#fff',
            color: '#1f2937',
            fontWeight: 600,
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#ea580c',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Court />
          <Timeline />
        </div>
      </div>
    </>
  );
}

export default App;
