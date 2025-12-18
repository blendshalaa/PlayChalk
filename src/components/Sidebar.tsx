import React from 'react';
import { X, MousePointer2, Minus, ArrowRight, Palette, Type, Pencil, LayoutTemplate, Crop, Plus, Trash2, Eraser, Layers } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FormationPresets } from './FormationPresets';


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
        setAnnotationStrokeWidth,
        courtType,
        setCourtType,
        textFontSize,
        setTextFontSize,
        rosters,
        addRoster,
        deleteRoster,
        addPlayerToRoster,
        viewMode,
        setViewMode,
        cameraRotation,
        setCameraRotation,
        cameraPitch,
        setCameraPitch
    } = usePlayStore();

    const handleDragStart = (e: React.DragEvent, type: string, data?: unknown) => {
        e.dataTransfer.setData('type', type);
        if (data) {
            e.dataTransfer.setData('data', JSON.stringify(data));
        }
    };

    const showDrawingControls = ['line', 'arrow', 'freehand', 'text', 'dashed_line', 'dashed_arrow'].includes(currentTool);

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-72 h-full glass-panel rounded-3xl flex flex-col overflow-hidden"
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

                {/* Formation Presets Section */}
                <div>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <Layers size={14} className="text-purple-400" />
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Formation Presets
                        </h2>
                    </div>
                    <FormationPresets />
                </div>





                {/* Rosters Section */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Team Rosters
                        </h2>
                        <button
                            onClick={() => addRoster({
                                id: Math.random().toString(36).substr(2, 9),
                                name: `Team ${rosters.length + 1}`,
                                color: '#ef4444',
                                players: Array.from({ length: 5 }).map((_, i) => ({
                                    id: Math.random().toString(36).substr(2, 9),
                                    name: `Player ${i + 1}`,
                                    number: `${i + 1}`,
                                    position: 'G'
                                }))
                            })}
                            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Add Team"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {rosters.map((roster) => (
                            <div key={roster.id} className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-white">{roster.name}</span>
                                    <button
                                        onClick={() => deleteRoster(roster.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-5 gap-1">
                                    {roster.players.map((player) => (
                                        <div
                                            key={player.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'roster_player', { ...player, color: roster.color })}
                                            className="aspect-square rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                                            style={{ borderColor: roster.color }}
                                        >
                                            {player.number}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addPlayerToRoster(roster.id, {
                                            id: Math.random().toString(36).substr(2, 9),
                                            name: 'New Player',
                                            number: `${roster.players.length + 1}`
                                        })}
                                        className="aspect-square rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Plus size={10} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {rosters.length === 0 && (
                            <div className="text-center py-4 text-xs text-gray-500 italic">
                                No teams yet. Click + to add one.
                            </div>
                        )}
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
                            tooltip="Select and move objects on the court"
                        />
                        <ToolButton
                            active={currentTool === 'freehand'}
                            onClick={() => setTool('freehand')}
                            icon={<Pencil size={18} />}
                            label="Freehand"
                            shortcut="F"
                            tooltip="Draw freehand lines"
                        />
                        <ToolButton
                            active={currentTool === 'line'}
                            onClick={() => setTool('line')}
                            icon={<Minus size={18} />}
                            label="Draw Line"
                            shortcut="L"
                            tooltip="Draw straight lines"
                        />
                        <ToolButton
                            active={currentTool === 'arrow'}
                            onClick={() => setTool('arrow')}
                            icon={<ArrowRight size={18} />}
                            label="Draw Arrow"
                            shortcut="A"
                            tooltip="Draw arrows to show movement"
                        />
                        <ToolButton
                            active={currentTool === 'dashed_line'}
                            onClick={() => setTool('dashed_line')}
                            icon={<Minus size={18} className="stroke-dashed" strokeDasharray="4 4" />}
                            label="Pass (Line)"
                            shortcut="P"
                            tooltip="Draw dashed lines for passes"
                        />
                        <ToolButton
                            active={currentTool === 'dashed_arrow'}
                            onClick={() => setTool('dashed_arrow')}
                            icon={<ArrowRight size={18} className="stroke-dashed" strokeDasharray="4 4" />}
                            label="Pass (Arrow)"
                            shortcut="Shift+P"
                            tooltip="Draw dashed arrows for passes"
                        />
                        <ToolButton
                            active={currentTool === 'text'}
                            onClick={() => setTool('text')}
                            icon={<Type size={18} />}
                            label="Add Text"
                            shortcut="T"
                            tooltip="Click to add text annotations"
                        />
                        <ToolButton
                            active={currentTool === 'eraser'}
                            onClick={() => setTool('eraser')}
                            icon={<Eraser size={18} />}
                            label="Eraser"
                            shortcut="E"
                            tooltip="Click annotations to delete them"
                        />
                    </div>
                </div>

                {/* Court View Section */}
                <div>
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                        Court View
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setCourtType('full')}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${courtType === 'full'
                                ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <LayoutTemplate size={20} />
                            <span className="text-[10px] font-bold">Full Court</span>
                        </button>
                        <button
                            onClick={() => setCourtType('half')}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${courtType === 'half'
                                ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Crop size={20} />
                            <span className="text-[10px] font-bold">Half Court</span>
                        </button>

                        {/* New View Controls */}
                        <button
                            onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${viewMode === '3d'
                                ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className="relative">
                                <LayoutTemplate size={20} className="transform rotate-12" />
                            </div>
                            <span className="text-[10px] font-bold">3D View</span>
                        </button>
                    </div>

                    {/* Camera Controls - Only in 3D Mode */}
                    <AnimatePresence>
                        {viewMode === '3d' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-3 space-y-3 bg-white/5 p-3 rounded-xl border border-white/10 overflow-hidden"
                            >
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                        <span>Rotation</span>
                                        <span>{cameraRotation}°</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={cameraRotation}
                                        onChange={(e) => setCameraRotation(Number(e.target.value))}
                                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                        <span>Tilt</span>
                                        <span>{cameraPitch}°</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="85"
                                        value={cameraPitch}
                                        onChange={(e) => setCameraPitch(Number(e.target.value))}
                                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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

                            {/* Stroke Width / Font Size */}
                            <div className="flex gap-2">
                                {currentTool === 'text' ? (
                                    [12, 16, 20, 24, 32].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setTextFontSize(size)}
                                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${textFontSize === size
                                                ? 'bg-white text-black'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    STROKE_WIDTHS.map((width) => (
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
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </motion.div >
    );
};

const DraggableItem = ({ type, label, icon, onDragStart, className = '', tooltip }: { type: string; label: string; icon: React.ReactNode; onDragStart: (e: React.DragEvent, type: string) => void; className?: string; tooltip?: string }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, type)}
        className={`glass-button p-3 rounded-xl flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing group relative ${className}`}
        title={tooltip || `Drag to add ${label}`}
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

const ToolButton = ({ active, onClick, icon, label, shortcut, tooltip }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; shortcut: string; tooltip?: string }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all group relative ${active
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
            : 'glass-button text-gray-300 hover:text-white'
            }`}
        title={tooltip || label}
    >
        {icon}
        <span>{label}</span>
        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-white/20' : 'bg-white/5 text-gray-500'}`}>
            {shortcut}
        </span>
    </button>
);
