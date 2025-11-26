import React from 'react';
import { X, MousePointer2, Pencil, ArrowRight, HelpCircle, Palette } from 'lucide-react';
import { usePlayStore } from '../store/usePlayStore';

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
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Play<span className="text-orange-600">Chalk</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1 font-medium">Design basketball plays</p>
            </div>

            <div className="p-6 space-y-8 overflow-y-auto flex-1">
                {/* Players Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                            Players
                        </h2>
                        <div className="group relative">
                            <HelpCircle size={14} className="text-gray-400 cursor-help" />
                            <div className="absolute right-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                Drag players onto the court to start
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'player_offense')}
                            className="bg-white border-2 border-gray-200 hover:border-orange-500 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all hover:-translate-y-0.5 group relative"
                            title="Drag to add offensive player"
                        >
                            <div className="w-12 h-12 rounded-full border-3 border-orange-600 flex items-center justify-center text-orange-600 font-bold text-xl">
                                O
                            </div>
                            <span className="text-xs text-gray-700 font-semibold">Offense</span>
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                +
                            </div>
                        </div>

                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'player_defense')}
                            className="bg-white border-2 border-gray-200 hover:border-blue-500 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all hover:-translate-y-0.5 group relative"
                            title="Drag to add defensive player"
                        >
                            <div className="w-12 h-12 flex items-center justify-center text-blue-600 font-bold">
                                <X size={40} strokeWidth={3} />
                            </div>
                            <span className="text-xs text-gray-700 font-semibold">Defense</span>
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                +
                            </div>
                        </div>

                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'ball')}
                            className="bg-white border-2 border-gray-200 hover:border-orange-600 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all hover:-translate-y-0.5 col-span-2 group relative"
                            title="Drag to add basketball"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-md"></div>
                            <span className="text-xs text-gray-700 font-semibold">Basketball</span>
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                +
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tools Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                            Tools
                        </h2>
                        <div className="group relative">
                            <HelpCircle size={14} className="text-gray-400 cursor-help" />
                            <div className="absolute right-0 top-6 w-56 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <strong>Select:</strong> Move & edit players<br />
                                <strong>Line:</strong> Draw movement paths<br />
                                <strong>Arrow:</strong> Show passes & cuts
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button
                            onClick={() => setTool('select')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all group relative ${currentTool === 'select'
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            title="Select and move objects (S)"
                        >
                            <MousePointer2 size={20} strokeWidth={2.5} />
                            <span>Select & Move</span>
                            <span className={`ml-auto text-xs ${currentTool === 'select' ? 'text-orange-200' : 'text-gray-400'}`}>S</span>
                        </button>
                        <button
                            onClick={() => setTool('line')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all group relative ${currentTool === 'line'
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            title="Draw lines (L)"
                        >
                            <Pencil size={20} strokeWidth={2.5} />
                            <span>Draw Line</span>
                            <span className={`ml-auto text-xs ${currentTool === 'line' ? 'text-orange-200' : 'text-gray-400'}`}>L</span>
                        </button>
                        <button
                            onClick={() => setTool('arrow')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all group relative ${currentTool === 'arrow'
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            title="Draw arrows (A)"
                        >
                            <ArrowRight size={20} strokeWidth={2.5} />
                            <span>Draw Arrow</span>
                            <span className={`ml-auto text-xs ${currentTool === 'arrow' ? 'text-orange-200' : 'text-gray-400'}`}>A</span>
                        </button>
                    </div>
                </div>

                {/* Drawing Controls */}
                {showDrawingControls && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-2 text-blue-900">
                            <Palette size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Drawing Style</h3>
                        </div>

                        {/* Color Picker */}
                        <div>
                            <label className="text-xs font-semibold text-blue-900 mb-2 block">Color</label>
                            <div className="grid grid-cols-4 gap-2">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setAnnotationColor(color.value)}
                                        className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${annotationColor === color.value
                                                ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                                                : 'border-gray-300'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Stroke Width */}
                        <div>
                            <label className="text-xs font-semibold text-blue-900 mb-2 block">Thickness</label>
                            <div className="flex gap-2">
                                {STROKE_WIDTHS.map((width) => (
                                    <button
                                        key={width}
                                        onClick={() => setAnnotationStrokeWidth(width)}
                                        className={`flex-1 py-2 rounded-lg border-2 transition-all font-semibold text-xs ${annotationStrokeWidth === width
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                                            }`}
                                    >
                                        {width}px
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips Section */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                        <HelpCircle size={16} />
                        Quick Tips
                    </h3>
                    <ul className="text-xs text-orange-800 space-y-1.5 font-medium">
                        <li>• <strong>Double-click</strong> players to edit labels</li>
                        <li>• <strong>Click</strong> to select, then delete</li>
                        <li>• <strong>Ctrl+Z/Y</strong> to undo/redo</li>
                        <li>• Use <strong>Export Image</strong> to save</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
