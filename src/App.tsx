import { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { Court } from './components/Court';
import { Timeline } from './components/Timeline';
import { Header } from './components/Header';
import { WelcomeTutorial } from './components/WelcomeTutorial';
import { KeyboardShortcutsPanel } from './components/KeyboardShortcutsPanel';
import { AlignmentToolbar } from './components/AlignmentToolbar';
import { usePlayStore } from './store/usePlayStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

function App() {
  const { showWelcome } = usePlayStore();
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const exportFnsRef = useRef<{ exportImage: () => void } | null>(null);

  const handleRegisterExport = (exports: { exportImage: () => void }) => {
    exportFnsRef.current = exports;
  };

  const handleExportImage = () => {
    if (exportFnsRef.current) {
      exportFnsRef.current.exportImage();
    }
  };

  const handleExportVideo = () => {
    if (exportFnsRef.current) {
      exportFnsRef.current.exportVideo();
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
        }}
      />

      <AnimatePresence>
        {showWelcome && <WelcomeTutorial />}
      </AnimatePresence>

      <KeyboardShortcutsPanel />

      <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Canvas takes full space */}
          <div className="absolute inset-0 z-0">
            <Court onRegisterExport={handleRegisterExport} />
          </div>

          {/* Floating UI Layer */}
          <div className="relative z-20 h-full pointer-events-none">

            {/* Mobile Menu Button */}
            <div className="absolute top-6 left-6 pointer-events-auto md:hidden z-50">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className={`w-6 h-0.5 bg-white transition-transform ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <div className={`w-6 h-0.5 bg-white transition-opacity ${isSidebarOpen ? 'opacity-0' : ''}`} />
                  <div className={`w-6 h-0.5 bg-white transition-transform ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>

            {/* Sidebar floats on left */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  className="absolute left-6 top-20 bottom-6 md:top-6 w-auto pointer-events-auto z-40 max-w-[80vw]"
                >
                  <Sidebar />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header floats on top right, offset for Sidebar */}
            <div className={`absolute top-6 right-6 pointer-events-auto transition-all duration-300 ${isSidebarOpen ? 'md:left-80' : 'left-6 md:left-6'}`}>
              <Header
                onExportImage={() => exportFnsRef.current?.exportImage()}
              /></div>

            {/* Timeline floats at bottom */}
            <div className={`absolute bottom-0 right-6 pointer-events-auto flex flex-col items-end pb-6 pl-6 transition-all duration-300 ${isSidebarOpen ? 'md:left-80' : 'left-6'}`}>
              {/* Toggle Button */}
              <motion.button
                layout
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                className="mb-2 mr-4 p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition-colors shadow-lg"
                title={isTimelineOpen ? "Collapse Timeline" : "Expand Timeline"}
              >
                {isTimelineOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </motion.button>

              <AnimatePresence>
                {isTimelineOpen && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="w-full"
                  >
                    <Timeline />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Alignment Toolbar */}
            <AlignmentToolbar />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
