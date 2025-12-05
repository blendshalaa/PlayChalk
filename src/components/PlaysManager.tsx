import { useState, useRef } from 'react';
import { Save, FolderOpen, Plus, Trash2, X, Clock, Upload, Download } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const PlaysManager = () => {
    const {
        savedPlays,
        currentPlayId,
        savePlay,
        loadPlay,
        deletePlay,
        createNewPlay,
        playName,
        frames
    } = usePlayStore();

    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSavePlay = () => {
        savePlay();
        toast.success('Play saved!');
    };

    const handleLoadPlay = (playId: string) => {
        loadPlay(playId);
        setIsOpen(false);
        toast.success('Play loaded!');
    };

    const handleDeletePlay = (playId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this play?')) {
            deletePlay(playId);
            toast.success('Play deleted');
        }
    };

    const handleNewPlay = () => {
        createNewPlay();
        setIsOpen(false);
        toast.success('New play created');
    };

    const handleExportPlay = () => {
        const playData = {
            name: playName,
            frames: frames,
            version: '1.0',
            exportedAt: Date.now()
        };
        const blob = new Blob([JSON.stringify(playData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${playName.replace(/\s+/g, '_').toLowerCase()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Play exported to file');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const playData = JSON.parse(content);

                if (!playData.frames || !Array.isArray(playData.frames)) {
                    throw new Error('Invalid play file format');
                }

                // Create a new play with this data
                createNewPlay();
                usePlayStore.setState({
                    playName: playData.name || 'Imported Play',
                    frames: playData.frames,
                    currentFrameIndex: 0
                });

                // Save it immediately so it appears in the list
                savePlay();

                setIsOpen(false);
                toast.success('Play imported successfully');
            } catch (error) {
                console.error('Import error:', error);
                toast.error('Failed to import play. Invalid file.');
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleSavePlay}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                    title="Save current play"
                >
                    <Save size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Save</span>
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className="glass-button px-4 py-2 rounded-xl text-gray-300 hover:text-white flex items-center gap-2 text-sm font-semibold"
                    title="Manage plays"
                >
                    <FolderOpen size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">My Plays ({savedPlays.length})</span>
                </button>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />

            {/* Plays Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">My Plays</h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {savedPlays.length} {savedPlays.length === 1 ? 'play' : 'plays'} saved
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleExportPlay}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-semibold border border-white/5"
                                        title="Export Current Play"
                                    >
                                        <Download size={16} />
                                        Export Current
                                    </button>
                                    <button
                                        onClick={handleImportClick}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-semibold border border-white/5"
                                        title="Import Play from JSON"
                                    >
                                        <Upload size={16} />
                                        Import
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                {savedPlays.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <FolderOpen size={40} className="text-gray-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">No saved plays yet</h3>
                                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                                            Create your first masterpiece and save it to access it here later.
                                        </p>
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={handleNewPlay}
                                                className="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                                            >
                                                Create First Play
                                            </button>
                                            <button
                                                onClick={handleImportClick}
                                                className="px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10"
                                            >
                                                Import Play
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {savedPlays.map((play) => (
                                            <motion.div
                                                layout
                                                key={play.id}
                                                onClick={() => handleLoadPlay(play.id)}
                                                className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${currentPlayId === play.id
                                                    ? 'bg-orange-500/10 border-orange-500/50'
                                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between relative z-10">
                                                    <div className="flex-1">
                                                        <h3 className={`font-bold text-lg mb-1 ${currentPlayId === play.id ? 'text-orange-400' : 'text-white'}`}>
                                                            {play.name}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {formatDate(play.updatedAt)}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{play.frames.length} frames</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Load the play first to ensure we have the data, then export
                                                                // Ideally we should export from the saved data directly but this is simpler for now
                                                                // Actually, let's just export the saved play data directly
                                                                const playData = {
                                                                    name: play.name,
                                                                    frames: play.frames,
                                                                    version: '1.0',
                                                                    exportedAt: Date.now()
                                                                };
                                                                const blob = new Blob([JSON.stringify(playData, null, 2)], { type: 'application/json' });
                                                                const url = URL.createObjectURL(blob);
                                                                const link = document.createElement('a');
                                                                link.href = url;
                                                                link.download = `${play.name.replace(/\s+/g, '_').toLowerCase()}.json`;
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                                URL.revokeObjectURL(url);
                                                                toast.success('Play exported');
                                                            }}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                            title="Export Play"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeletePlay(play.id, e)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                                            title="Delete play"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {currentPlayId === play.id && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-black/20">
                                <button
                                    onClick={handleNewPlay}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white transition-all font-bold"
                                >
                                    <Plus size={20} />
                                    Create New Play
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
