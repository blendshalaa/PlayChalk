import { usePlayStore } from '../store/usePlayStore';
import { Plus, Trash2, Copy, Play, Pause, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const Timeline = () => {
    const {
        frames,
        currentFrameIndex,
        setCurrentFrame,
        addFrame,
        deleteFrame,
        duplicateFrame,
        isPlaying,
        togglePlay,
        setFrameDuration
    } = usePlayStore();

    const [editingDuration, setEditingDuration] = useState<number | null>(null);
    const [durationInput, setDurationInput] = useState('');

    const handleAddFrame = () => {
        addFrame();
        toast.success('Frame added');
    };

    const handleDeleteFrame = (index: number) => {
        deleteFrame(index);
        toast.success('Frame deleted');
    };

    const handleDuplicateFrame = (index: number) => {
        duplicateFrame(index);
        toast.success('Frame duplicated');
    };

    const handleEditDuration = (index: number) => {
        const frame = frames[index];
        setEditingDuration(index);
        setDurationInput(String(frame.duration || 500));
    };

    const handleSaveDuration = () => {
        if (editingDuration !== null) {
            const duration = parseInt(durationInput);
            if (!isNaN(duration) && duration > 0) {
                setFrameDuration(editingDuration, duration);
                toast.success('Duration updated');
            }
            setEditingDuration(null);
        }
    };

    return (
        <div className="h-52 bg-white border-t border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={togglePlay}
                        className="p-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 hover:scale-105"
                    >
                        {isPlaying ? <Pause size={22} strokeWidth={2.5} /> : <Play size={22} strokeWidth={2.5} />}
                    </button>
                    <div className="flex flex-col">
                        <span className="text-gray-900 text-base font-bold">
                            {frames.length} {frames.length === 1 ? 'Frame' : 'Frames'}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">Currently on frame {currentFrameIndex + 1}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAddFrame}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 text-sm font-semibold transition-all shadow-lg shadow-orange-600/30 hover:scale-105"
                    >
                        <Plus size={18} strokeWidth={2.5} /> Add Frame
                    </button>
                </div>
            </div>

            <div className="flex-1 px-6 py-5 overflow-x-auto flex items-center gap-4">
                {frames.map((frame, index) => (
                    <div
                        key={frame.id}
                        className={`
              relative flex-shrink-0 w-40 h-28 rounded-2xl border-2 cursor-pointer transition-all
              ${index === currentFrameIndex
                                ? 'border-orange-600 bg-orange-50 shadow-lg scale-105'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }
            `}
                        onClick={() => setCurrentFrame(index)}
                    >
                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold ${index === currentFrameIndex ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {index + 1}
                        </div>

                        {/* Duration Badge */}
                        <div
                            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditDuration(index);
                            }}
                            title="Click to edit duration"
                        >
                            <Clock size={12} />
                            {frame.duration || 500}ms
                        </div>

                        {index === currentFrameIndex && (
                            <div className="absolute -bottom-2 -right-2 flex gap-1.5">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDuplicateFrame(index); }}
                                    className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-lg border border-gray-200 transition-all hover:scale-110"
                                    title="Duplicate"
                                >
                                    <Copy size={14} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteFrame(index); }}
                                    className="p-2 rounded-full bg-white text-red-600 hover:bg-red-50 shadow-lg border border-gray-200 transition-all hover:scale-110"
                                    title="Delete"
                                >
                                    <Trash2 size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        )}

                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-sm">
                            Frame {index + 1}
                        </div>
                    </div>
                ))}
            </div>

            {/* Duration Edit Modal */}
            {editingDuration !== null && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Frame Duration</h3>
                        <div className="space-y-2 mb-4">
                            <label className="text-sm font-semibold text-gray-700">Duration (milliseconds)</label>
                            <input
                                type="number"
                                value={durationInput}
                                onChange={(e) => setDurationInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveDuration()}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold focus:outline-none focus:border-orange-600"
                                placeholder="500"
                                autoFocus
                                min="100"
                                step="100"
                            />
                            <p className="text-xs text-gray-500">How long this frame plays during animation</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingDuration(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDuration}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-semibold"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
