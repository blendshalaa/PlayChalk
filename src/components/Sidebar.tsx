import React from 'react';
import { X, MousePointer2, Pencil, ArrowRight, Palette } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Orange', value: '#f97316' },
];

const STROKE_WIDTHS = [1, 2, 3, 4, 6];

export const Sidebar = () => {
    const {
        currentTool,
        setTool,
        annotationColor,
        setAnnotationColor,
        annotationStrokeWidth,
        setAnnotationStrokeWidth
    } = usePlayStore();

    const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('type', type);
    };

    const showDrawingControls = currentTool === 'line' || currentTool === 'arrow';

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-72 h-full glass-panel rounded-3xl flex flex-col overflow-hidden"
        >
            {/* Logo Area */}
            <div className="p-6 border-b border-white/5 bg-white/5">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span className="text-orange-500">Play</span>Chalk
                </h1>
                <p className="text-gray-400 text-xs mt-1 font-medium">Pro Play Designer</p>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* Players Section */}
                <div>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                        Players & Objects
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <DraggableItem
                            type="player_offense"
                            label="Offense"
                            onDragStart={handleDragStart}
                            icon={
                                <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 font-bold text-lg shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                    O
                                </div>
                            }
                        />
                        <DraggableItem
                            type="player_defense"
                            label="Defense"
                            onDragStart={handleDragStart}
                            icon={
                                <div className="w-10 h-10 flex items-center justify-center text-blue-500 font-bold">
                                    <X size={32} strokeWidth={3} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                </div>
                            }
                        />
                        <DraggableItem
                            type="ball"
                            label="Ball"
                            onDragStart={handleDragStart}
                            className="col-span-2"
                            icon={
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20"></div>
                            }
                        />
                    </div>
                </div>

                {/* Equipment Section */}
                <div>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                        Equipment
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <DraggableItem
                            type="screen"
                            label="Screen"
                            onDragStart={handleDragStart}
                            icon={
                                <div className="text-purple-500 font-bold text-2xl drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                                    ⊥
                                </div>
                            }
                        />
                        <DraggableItem
                            type="cone"
                            label="Cone"
                            onDragStart={handleDragStart}
                            icon={
                                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                            }
                        />
                    </div>
                </div>

                {/* Tools Section */}
                <div>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                        Tools
                    </h2>
                    <div className="space-y-2">
                        <ToolButton
                            active={currentTool === 'select'}
                            onClick={() => setTool('select')}
                            icon={<MousePointer2 size={18} />}
                            label="Select & Move"
                            shortcut="S"
                        />
                        <ToolButton
                            active={currentTool === 'line'}
                            onClick={() => setTool('line')}
                            icon={<Pencil size={18} />}
                            label="Draw Line"
                            shortcut="L"
                        />
                        <ToolButton
                            active={currentTool === 'arrow'}
                            onClick={() => setTool('arrow')}
                            icon={<ArrowRight size={18} />}
                            label="Draw Arrow"
                            shortcut="A"
                        />
                    </div>
                </div>

                {/* Drawing Controls */}
                <AnimatePresence>
                    {showDrawingControls && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 overflow-hidden"
                        >
                            <div className="flex items-center gap-2 text-blue-400">
                                <Palette size={14} />
                                <h3 className="text-[10px] font-bold uppercase tracking-widest">Style</h3>
                            </div>

                            {/* Color Picker */}
                            <div className="grid grid-cols-4 gap-2">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setAnnotationColor(color.value)}
                                        className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${annotationColor === color.value
                                            ? 'border-white ring-2 ring-white/20'
                                            : 'border-transparent hover:border-white/50'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>

                            {/* Stroke Width */}
                            <div className="flex gap-2">
                                {STROKE_WIDTHS.map((width) => (
                                    <button
                                        key={width}
                                        onClick={() => setAnnotationStrokeWidth(width)}
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${annotationStrokeWidth === width
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {width}px
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const DraggableItem = ({ type, label, icon, onDragStart, className = '' }: any) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, type)}
        className={`glass-button p-3 rounded-xl flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing group relative ${className}`}
    >
        <div className="group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <span className="text-[10px] font-medium text-gray-300 group-hover:text-white transition-colors">
            {label}
        </span>
        <div className="absolute top-2 right-2 w-4 h-4 bg-white/10 rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
            +
        </div>
    </div>
);

const ToolButton = ({ active, onClick, icon, label, shortcut }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all group relative ${active
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
            : 'glass-button text-gray-300 hover:text-white'
            }`}
    >
        {icon}
        <span>{label}</span>
        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-white/20' : 'bg-white/5 text-gray-500'}`}>
            {shortcut}
        </span>
    </button>
);
