import { useState } from 'react';
import { Trash2, Edit2, Check, Undo2, Redo2 } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import { PlaysManager } from './PlaysManager';
import toast from 'react-hot-toast';

export const Header = () => {
    const {
        playName,
        setPlayName,
        clearCanvas,
        currentFrameIndex,
        frames,
        undo,
        redo,
        history,
        historyIndex
    } = usePlayStore();

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(playName);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleSaveName = () => {
        setPlayName(tempName);
        setIsEditing(false);
        toast.success('Play name updated');
    };

    const handleClearCanvas = () => {
        if (confirm('Are you sure you want to clear the canvas? This will delete all frames and objects.')) {
            clearCanvas();
            toast.success('Canvas cleared');
        }
    };

    const handleUndo = () => {
        undo();
        toast.success('Undone');
    };

    const handleRedo = () => {
        redo();
        toast.success('Redone');
    };

    return (
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            className="px-3 py-2 border-2 border-orange-600 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                            autoFocus
                        />
                        <button
                            onClick={handleSaveName}
                            className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
                        >
                            <Check size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900">{playName}</h2>
                        <button
                            onClick={() => {
                                setTempName(playName);
                                setIsEditing(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            title="Edit play name"
                        >
                            <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
                <div className="h-6 w-px bg-gray-200"></div>
                <p className="text-sm text-gray-500 font-medium">
                    Frame {currentFrameIndex + 1} of {frames.length}
                </p>
            </div>


            <div className="flex items-center gap-3">
                {/* Undo/Redo */}
                <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
                    <button
                        onClick={handleUndo}
                        disabled={!canUndo}
                        className={`p-2 rounded-lg transition-all ${canUndo
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 size={18} strokeWidth={2.5} />
                    </button>
                    <div className="w-px h-6 bg-gray-200"></div>
                    <button
                        onClick={handleRedo}
                        disabled={!canRedo}
                        className={`p-2 rounded-lg transition-all ${canRedo
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 size={18} strokeWidth={2.5} />
                    </button>
                </div>

                <PlaysManager />

                <button
                    onClick={handleClearCanvas}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-semibold text-sm border border-gray-200"
                    title="Clear all frames and objects"
                >
                    <Trash2 size={16} strokeWidth={2.5} />
                    Clear Canvas
                </button>
            </div>
        </div>
    );
};
