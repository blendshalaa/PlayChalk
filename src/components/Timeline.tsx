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
            <div className="flex items-center justify-between flex-wrap gap-y-4">
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
                    <div className="hidden md:flex items-center gap-2 bg-black/20 rounded-xl p-1">
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

                            {/* Frame Content Preview */}
                            <div className="w-full h-full relative bg-gradient-to-br from-amber-900/20 to-orange-900/20">
                                {/* Mini court markings */}
                                <div className="absolute inset-0 opacity-20">
                                    {/* Center circle */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/40" />
                                    {/* Three-point arc */}
                                    <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-16 h-12 rounded-t-full border-t border-l border-r border-white/40" />
                                    {/* Key */}
                                    <div className="absolute left-1/2 bottom-2 -translate-x-1/2 w-8 h-8 border-l border-r border-white/40" />
                                </div>

                                {/* Objects */}
                                <div className="absolute inset-0 p-2">
                                    {Object.values(frame.objects).map((obj) => {
                                        const x = (obj.x / 800) * 100;
                                        const y = (obj.y / 600) * 100;

                                        if (obj.type === 'player_offense') {
                                            return (
                                                <div
                                                    key={obj.id}
                                                    className="absolute w-3 h-3 rounded-full border-2 border-orange-400 bg-orange-500/30 flex items-center justify-center"
                                                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                                                >
                                                    <span className="text-[6px] font-bold text-white">{obj.label || ''}</span>
                                                </div>
                                            );
                                        }

                                        if (obj.type === 'player_defense') {
                                            return (
                                                <div
                                                    key={obj.id}
                                                    className="absolute w-3 h-3 flex items-center justify-center"
                                                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 12 12" className="text-blue-400">
                                                        <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                </div>
                                            );
                                        }

                                        if (obj.type === 'ball') {
                                            return (
                                                <div
                                                    key={obj.id}
                                                    className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm"
                                                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                                                />
                                            );
                                        }

                                        if (obj.type === 'screen') {
                                            return (
                                                <div
                                                    key={obj.id}
                                                    className="absolute w-3 h-4 flex items-center justify-center"
                                                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                                                >
                                                    <div className="w-2 h-3 bg-purple-500/60 rounded-sm border border-purple-400" />
                                                </div>
                                            );
                                        }

                                        if (obj.type === 'cone') {
                                            return (
                                                <div
                                                    key={obj.id}
                                                    className="absolute"
                                                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                                                >
                                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-orange-500" />
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}

                                    {/* Annotations preview */}
                                    {frame.annotations.map((annotation, idx) => {
                                        if (annotation.type === 'line' || annotation.type === 'arrow' || annotation.type === 'dashed_line' || annotation.type === 'dashed_arrow') {
                                            const x1 = (annotation.points[0] / 800) * 100;
                                            const y1 = (annotation.points[1] / 600) * 100;
                                            const x2 = (annotation.points[2] / 800) * 100;
                                            const y2 = (annotation.points[3] / 600) * 100;

                                            return (
                                                <svg
                                                    key={idx}
                                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                                    style={{ overflow: 'visible' }}
                                                >
                                                    <line
                                                        x1={`${x1}%`}
                                                        y1={`${y1}%`}
                                                        x2={`${x2}%`}
                                                        y2={`${y2}%`}
                                                        stroke={annotation.color || '#ffffff'}
                                                        strokeWidth="1"
                                                        strokeDasharray={annotation.type.includes('dashed') ? '2,2' : undefined}
                                                        opacity="0.6"
                                                    />
                                                </svg>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
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
