import { useState } from 'react';
import { Play, Pause, Plus, Trash2, Copy, Clock, SkipForward, SkipBack, Repeat } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const Timeline = () => {
    const {
        frames,
        currentFrameIndex,
        addFrame,
        deleteFrame,
        duplicateFrame,
        setCurrentFrame,
        isPlaying,
        togglePlay,
        playbackSpeed,
        setPlaybackSpeed,
        setFrameDuration,
        isLooping,
        toggleLoop,
        stepForward,
        stepBackward
    } = usePlayStore();

    const [editingDuration, setEditingDuration] = useState<number | null>(null);

    const handleDurationChange = (index: number, newDuration: number) => {
        setFrameDuration(index, newDuration);
        setEditingDuration(null);
        toast.success(`Frame duration set to ${newDuration}ms`);
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel rounded-3xl p-4 flex flex-col gap-4"
        >
            {/* Controls Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Step Backward */}
                    <button
                        onClick={stepBackward}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5 hover:border-white/20"
                        title="Previous Frame"
                    >
                        <SkipBack size={18} />
                    </button>

                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-orange-500/30"
                    >
                        {isPlaying ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} className="ml-1" />}
                    </button>

                    {/* Step Forward */}
                    <button
                        onClick={stepForward}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5 hover:border-white/20"
                        title="Next Frame"
                    >
                        <SkipForward size={18} />
                    </button>

                    <div className="h-8 w-px bg-white/10 mx-2" />

                    {/* Loop Toggle */}
                    <button
                        onClick={toggleLoop}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all ${isLooping
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                        title="Toggle Loop"
                    >
                        <Repeat size={16} />
                        Loop
                    </button>

                    <div className="h-8 w-px bg-white/10 mx-2" />

                    {/* Speed Controls */}
                    <div className="flex items-center gap-2 bg-black/20 rounded-xl p-1">
                        {[200, 500, 1000].map((speed) => (
                            <button
                                key={speed}
                                onClick={() => setPlaybackSpeed(speed)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${playbackSpeed === speed
                                    ? 'bg-white/10 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {speed}ms
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-400">
                        {currentFrameIndex + 1} / {frames.length} Frames
                    </span>
                    <button
                        onClick={addFrame}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20 transition-all text-sm font-semibold"
                    >
                        <Plus size={16} />
                        Add Frame
                    </button>
                </div>
            </div>

            {/* Frames Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar min-h-[140px] items-center">
                <AnimatePresence mode='popLayout'>
                    {frames.map((frame, index) => (
                        <motion.div
                            key={frame.id}
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => setCurrentFrame(index)}
                            className={`relative group flex-shrink-0 w-40 aspect-video rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${currentFrameIndex === index
                                ? 'border-orange-500 ring-4 ring-orange-500/20 z-10 scale-105'
                                : 'border-white/5 hover:border-white/20 bg-black/20'
                                }`}
                        >
                            {/* Frame Number */}
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                                {index + 1}
                            </div>

                            {/* Duration Badge */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDuration(index);
                                }}
                                className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm flex items-center gap-1 text-[10px] font-medium text-gray-300 hover:bg-black/70 hover:text-white transition-colors border border-white/10"
                            >
                                <Clock size={10} />
                                {frame.duration || 500}ms
                            </div>

                            {/* Frame Content Preview (Simplified) */}
                            <div className="w-full h-full p-4 opacity-50">
                                {Object.values(frame.objects).map((obj) => (
                                    <div
                                        key={obj.id}
                                        className="absolute w-2 h-2 rounded-full"
                                        style={{
                                            left: `${(obj.x / 800) * 100}%`,
                                            top: `${(obj.y / 600) * 100}%`,
                                            backgroundColor: obj.type === 'ball' ? '#f97316' : obj.type === 'player_offense' ? '#fff' : '#3b82f6'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Hover Actions */}
                            <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center gap-2 opacity-0 transition-opacity ${currentFrameIndex === index ? 'group-hover:opacity-100' : ''}`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        duplicateFrame(index);
                                        toast.success('Frame duplicated');
                                    }}
                                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    title="Duplicate Frame"
                                >
                                    <Copy size={14} />
                                </button>
                                {frames.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFrame(index);
                                            toast.success('Frame deleted');
                                        }}
                                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-200 transition-colors"
                                        title="Delete Frame"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add Button at end of list */}
                <motion.button
                    layout
                    onClick={addFrame}
                    className="flex-shrink-0 w-12 h-full rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center text-gray-500 hover:text-white"
                >
                    <Plus size={20} />
                </motion.button>
            </div>

            {/* Duration Edit Modal */}
            <AnimatePresence>
                {editingDuration !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingDuration(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-80"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Frame Duration</h3>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[200, 500, 1000, 2000, 3000].map((dur) => (
                                    <button
                                        key={dur}
                                        onClick={() => handleDurationChange(editingDuration, dur)}
                                        className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-sm font-medium text-gray-300 hover:text-white transition-all"
                                    >
                                        {dur}ms
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setEditingDuration(null)}
                                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm font-medium transition-all"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
