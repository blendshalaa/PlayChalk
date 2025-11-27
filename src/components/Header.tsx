import { useState } from 'react';
import { Trash2, Edit2, Check, Undo2, Redo2, Download } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import { PlaysManager } from './PlaysManager';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface HeaderProps {
    onExport?: () => void;
}

export const Header = ({ onExport }: HeaderProps) => {
    const {
        playName,
        setPlayName,
        clearCanvas,
        historyIndex,
        history,
        undo,
        redo,
        selectedObjectId,
        deleteObject,
        setSelectedObject
    } = usePlayStore();

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(playName);

    const handleSaveName = () => {
        if (tempName.trim()) {
            setPlayName(tempName);
            setIsEditing(false);
            toast.success('Play name updated');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveName();
        if (e.key === 'Escape') {
            setTempName(playName);
            setIsEditing(false);
        }
    };

    const handleClearCanvas = () => {
        if (confirm('Are you sure you want to clear the entire canvas? This cannot be undone.')) {
            clearCanvas();
            toast.success('Canvas cleared');
        }
    };

    const handleDeleteSelected = () => {
        if (selectedObjectId) {
            deleteObject(selectedObjectId);
            setSelectedObject(null);
            toast.success('Object deleted');
        }
    };

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleUndo = () => {
        if (canUndo) {
            undo();
            toast.success('Undone');
        }
    };

    const handleRedo = () => {
        if (canRedo) {
            redo();
            toast.success('Redone');
        }
    };

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel rounded-2xl px-6 py-3 flex items-center justify-between pointer-events-auto"
        >
            {/* Left: Play Name */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleSaveName}
                                autoFocus
                                className="glass-input px-3 py-1.5 rounded-lg text-lg font-bold text-white w-64"
                                placeholder="Enter play name..."
                            />
                            <button
                                onClick={handleSaveName}
                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="group flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                {playName}
                            </h1>
                            <button
                                onClick={() => {
                                    setTempName(playName);
                                    setIsEditing(true);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Context Actions */}
                {selectedObjectId && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleDeleteSelected}
                        className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2 text-sm font-semibold border border-red-500/20"
                    >
                        <Trash2 size={16} />
                        <span className="hidden xl:inline">Delete Selected</span>
                    </motion.button>
                )}

                {onExport && (
                    <button
                        onClick={onExport}
                        className="glass-button px-3 py-2 rounded-xl text-gray-300 hover:text-white flex items-center gap-2 text-sm font-semibold"
                        title="Export as Image"
                    >
                        <Download size={16} />
                        <span className="hidden xl:inline">Export</span>
                    </button>
                )}

                <div className="h-6 w-px bg-white/10 mx-1"></div>

                {/* Undo/Redo Group */}
                <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1 border border-white/5">
                    <button
                        onClick={handleUndo}
                        disabled={!canUndo}
                        className={`p-2 rounded-lg transition-all ${canUndo
                                ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                : 'text-gray-600 cursor-not-allowed'
                            }`}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={18} />
                    </button>
                    <div className="w-px h-4 bg-white/10"></div>
                    <button
                        onClick={handleRedo}
                        disabled={!canRedo}
                        className={`p-2 rounded-lg transition-all ${canRedo
                                ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                : 'text-gray-600 cursor-not-allowed'
                            }`}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={18} />
                    </button>
                </div>

                <div className="h-6 w-px bg-white/10 mx-1"></div>

                <PlaysManager />

                <button
                    onClick={handleClearCanvas}
                    className="glass-button px-3 py-2 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 flex items-center gap-2 text-sm font-semibold"
                    title="Clear all frames and objects"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
};
