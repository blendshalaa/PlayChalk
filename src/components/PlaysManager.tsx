import { useState } from 'react';
import { Save, FolderOpen, Plus, Trash2, X } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import toast from 'react-hot-toast';

export const PlaysManager = () => {
    const {
        savedPlays,
        currentPlayId,
        savePlay,
        loadPlay,
        deletePlay,
        createNewPlay
    } = usePlayStore();

    const [isOpen, setIsOpen] = useState(false);

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

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleSavePlay}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all font-semibold text-sm shadow-lg shadow-orange-600/30"
                    title="Save current play"
                >
                    <Save size={16} strokeWidth={2.5} />
                    Save Play
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-semibold text-sm border border-gray-200"
                    title="Manage plays"
                >
                    <FolderOpen size={16} strokeWidth={2.5} />
                    My Plays ({savedPlays.length})
                </button>
            </div>

            {/* Plays Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">My Plays</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {savedPlays.length} {savedPlays.length === 1 ? 'play' : 'plays'} saved
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                                <X size={24} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {savedPlays.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <FolderOpen size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No saved plays yet</h3>
                                    <p className="text-gray-500 mb-6">
                                        Create your first play and click "Save Play" to save it
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {savedPlays.map((play) => (
                                        <div
                                            key={play.id}
                                            onClick={() => handleLoadPlay(play.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${currentPlayId === play.id
                                                    ? 'border-orange-600 bg-orange-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 mb-1">{play.name}</h3>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span>{play.frames.length} frames</span>
                                                        <span>•</span>
                                                        <span>Updated {formatDate(play.updatedAt)}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => handleDeletePlay(play.id, e)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                                                    title="Delete play"
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                            {currentPlayId === play.id && (
                                                <div className="mt-2 text-xs font-semibold text-orange-600">
                                                    Currently editing
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={handleNewPlay}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all font-semibold shadow-lg"
                            >
                                <Plus size={18} strokeWidth={2.5} />
                                Create New Play
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
