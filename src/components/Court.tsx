import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle as KonvaCircle, Line, Group, Arc, Arrow, Text as KonvaText } from 'react-konva';
import Konva from 'konva';
import { Download, MousePointer2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlayStore } from '../store/usePlayStore';
import type { PlayObject } from '../types';
import { Header } from './Header';

const WIDTH = 800;
const HEIGHT = 600;

const CourtBackground = () => {
    return (
        <Group>
            <Rect width={WIDTH} height={HEIGHT} fill="#eecfa1" />
            <Rect x={40} y={40} width={WIDTH - 80} height={HEIGHT - 80} stroke="white" strokeWidth={4} />
            <KonvaCircle x={WIDTH / 2} y={HEIGHT / 2} radius={60} stroke="white" strokeWidth={4} />
            <Line points={[WIDTH / 2, 40, WIDTH / 2, HEIGHT - 40]} stroke="white" strokeWidth={4} />
            <Rect x={40} y={HEIGHT / 2 - 80} width={150} height={160} stroke="white" strokeWidth={4} />
            <Arc x={190} y={HEIGHT / 2} innerRadius={0} outerRadius={80} angle={180} rotation={-90} stroke="white" strokeWidth={4} />
            <Rect x={WIDTH - 190} y={HEIGHT / 2 - 80} width={150} height={160} stroke="white" strokeWidth={4} />
            <Arc x={WIDTH - 190} y={HEIGHT / 2} innerRadius={0} outerRadius={80} angle={180} rotation={90} stroke="white" strokeWidth={4} />
            <Arc x={90} y={HEIGHT / 2} innerRadius={0} outerRadius={250} angle={180} rotation={-90} stroke="white" strokeWidth={4} />
            <Arc x={WIDTH - 90} y={HEIGHT / 2} innerRadius={0} outerRadius={250} angle={180} rotation={90} stroke="white" strokeWidth={4} />
        </Group>
    );
};

export const Court = () => {
    const {
        frames,
        currentFrameIndex,
        addObject,
        updateObjectPosition,
        deleteObject,
        isPlaying,
        playbackSpeed,
        currentTool,
        setTool,
        addAnnotation,
        selectedObjectId,
        setSelectedObject,
        updateObjectLabel,
        annotationColor,
        annotationStrokeWidth,
        undo,
        redo
    } = usePlayStore();

    const currentFrame = frames[currentFrameIndex];
    const stageRef = useRef<Konva.Stage>(null);
    const nodeRefs = useRef<Record<string, Konva.Node>>({});

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState<number[]>([]);
    const [editingLabel, setEditingLabel] = useState<string | null>(null);
    const [labelInput, setLabelInput] = useState('');

    const isEmpty = currentFrame && Object.keys(currentFrame.objects).length === 0 && currentFrame.annotations.length === 0;

    useEffect(() => {
        if (!isPlaying || !stageRef.current) return;
        const layer = stageRef.current.getLayers()[1];

        const anim = new Konva.Animation((frame) => {
            if (!frame || frames.length <= 1) return;
            const totalDuration = (frames.length - 1) * playbackSpeed;
            const time = frame.time % totalDuration;
            const frameIndex = Math.floor(time / playbackSpeed);
            const nextFrameIndex = frameIndex + 1;
            const progress = (time % playbackSpeed) / playbackSpeed;
            const startFrame = frames[frameIndex];
            const endFrame = frames[nextFrameIndex];
            if (!startFrame || !endFrame) return;

            Object.keys(startFrame.objects).forEach((objId) => {
                const startObj = startFrame.objects[objId];
                const endObj = endFrame.objects[objId];
                const node = nodeRefs.current[objId];
                if (startObj && endObj && node) {
                    const x = startObj.x + (endObj.x - startObj.x) * progress;
                    const y = startObj.y + (endObj.y - startObj.y) * progress;
                    node.x(x);
                    node.y(y);
                }
            });
        }, layer);

        anim.start();
        return () => {
            anim.stop();
        };
    }, [isPlaying, frames, playbackSpeed]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return; // Don't trigger when typing

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    undo();
                    toast.success('Undone');
                } else if (e.key === 'y') {
                    e.preventDefault();
                    redo();
                    toast.success('Redone');
                }
            } else {
                if (e.key === 's' || e.key === 'S') {
                    e.preventDefault();
                    setTool('select');
                    toast.success('Select tool');
                } else if (e.key === 'l' || e.key === 'L') {
                    e.preventDefault();
                    setTool('line');
                    toast.success('Line tool');
                } else if (e.key === 'a' || e.key === 'A') {
                    e.preventDefault();
                    setTool('arrow');
                    toast.success('Arrow tool');
                } else if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (selectedObjectId) {
                        e.preventDefault();
                        deleteObject(selectedObjectId);
                        setSelectedObject(null);
                        toast.success('Object deleted');
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setTool, undo, redo, selectedObjectId, deleteObject, setSelectedObject]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!stageRef.current) return;
        stageRef.current.setPointersPositions(e);
        const pointerPosition = stageRef.current.getPointerPosition();
        const type = e.dataTransfer.getData('type');

        if (type && pointerPosition) {
            const newObject: PlayObject = {
                id: Math.random().toString(36).substr(2, 9),
                type: type as any,
                x: pointerPosition.x,
                y: pointerPosition.y,
                label: type === 'player_offense' ? '1' : type === 'player_defense' ? 'X' : undefined,
            };
            addObject(newObject);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (currentTool === 'select') return;
        setIsDrawing(true);
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) setCurrentLine([pos.x, pos.y, pos.x, pos.y]);
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDrawing) return;
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) setCurrentLine([currentLine[0], currentLine[1], pos.x, pos.y]);
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentLine.length > 0) {
            addAnnotation({
                id: Math.random().toString(36).substr(2, 9),
                type: currentTool as 'line' | 'arrow',
                points: currentLine,
                color: annotationColor,
                strokeWidth: annotationStrokeWidth,
            });
            setCurrentLine([]);
            toast.success(`${currentTool === 'arrow' ? 'Arrow' : 'Line'} added`);
        }
    };

    const handleExportImage = () => {
        if (!stageRef.current) return;
        const uri = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = `playchalk-frame-${currentFrameIndex + 1}.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleObjectClick = (objId: string) => {
        if (currentTool !== 'select') return;
        setSelectedObject(objId);
    };

    const handleDeleteSelected = () => {
        if (selectedObjectId) {
            deleteObject(selectedObjectId);
            setSelectedObject(null);
        }
    };

    const handleLabelEdit = (objId: string, currentLabel?: string) => {
        setEditingLabel(objId);
        setLabelInput(currentLabel || '');
    };

    const handleLabelSave = () => {
        if (editingLabel) {
            updateObjectLabel(editingLabel, labelInput);
            setEditingLabel(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden relative" onDrop={handleDrop} onDragOver={handleDragOver}>
                {/* Export Button */}
                <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
                    {selectedObjectId && (
                        <button
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg font-semibold text-sm"
                        >
                            <Trash2 size={16} strokeWidth={2.5} />
                            Delete Selected
                        </button>
                    )}
                    <button
                        onClick={handleExportImage}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 hover:scale-105 font-semibold text-sm"
                    >
                        <Download size={18} strokeWidth={2.5} />
                        Export Image
                    </button>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center p-8 relative">
                    {isEmpty && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center max-w-md">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                                    <MousePointer2 size={32} className="text-orange-600" strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Started</h3>
                                <p className="text-gray-500 font-medium">
                                    Drag players from the sidebar onto the court to start designing your play
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="shadow-2xl rounded-3xl overflow-hidden border-4 border-white">
                        <Stage
                            width={WIDTH}
                            height={HEIGHT}
                            ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            <Layer>
                                <CourtBackground />
                                {currentFrame && currentFrame.annotations.map((ann) => (
                                    ann.type === 'arrow' ? (
                                        <Arrow key={ann.id} points={ann.points} stroke={ann.color} strokeWidth={ann.strokeWidth} fill={ann.color} />
                                    ) : (
                                        <Line key={ann.id} points={ann.points} stroke={ann.color} strokeWidth={ann.strokeWidth} />
                                    )
                                ))}
                                {isDrawing && currentLine.length > 0 && (
                                    currentTool === 'arrow' ? (
                                        <Arrow points={currentLine} stroke="yellow" strokeWidth={2} fill="yellow" dash={[5, 5]} />
                                    ) : (
                                        <Line points={currentLine} stroke="yellow" strokeWidth={2} dash={[5, 5]} />
                                    )
                                )}
                            </Layer>
                            <Layer>
                                {currentFrame && Object.values(currentFrame.objects).map((obj) => {
                                    const isSelected = selectedObjectId === obj.id;
                                    return (
                                        <Group
                                            key={obj.id}
                                            x={obj.x}
                                            y={obj.y}
                                            draggable={!isPlaying && currentTool === 'select'}
                                            ref={(node) => { if (node) nodeRefs.current[obj.id] = node; }}
                                            onDragEnd={(e) => updateObjectPosition(currentFrameIndex, obj.id, e.target.x(), e.target.y())}
                                            onClick={() => handleObjectClick(obj.id)}
                                            onDblClick={() => handleLabelEdit(obj.id, obj.label)}
                                        >
                                            {isSelected && (
                                                <KonvaCircle radius={25} stroke="#f97316" strokeWidth={2} dash={[5, 5]} />
                                            )}
                                            {obj.type === 'player_offense' && (
                                                <>
                                                    <KonvaCircle radius={15} fill="transparent" stroke={obj.color || "#ea580c"} strokeWidth={3} />
                                                    {obj.label && (
                                                        <KonvaText
                                                            text={obj.label}
                                                            fontSize={14}
                                                            fontStyle="bold"
                                                            fill={obj.color || "#ea580c"}
                                                            align="center"
                                                            verticalAlign="middle"
                                                            offsetX={7}
                                                            offsetY={7}
                                                            width={14}
                                                            height={14}
                                                        />
                                                    )}
                                                </>
                                            )}
                                            {obj.type === 'player_defense' && (
                                                <>
                                                    <Line points={[-12, -12, 12, 12]} stroke={obj.color || "#2563eb"} strokeWidth={4} />
                                                    <Line points={[12, -12, -12, 12]} stroke={obj.color || "#2563eb"} strokeWidth={4} />
                                                </>
                                            )}
                                            {obj.type === 'ball' && (
                                                <KonvaCircle radius={10} fill="#ea580c" stroke="black" strokeWidth={1} />
                                            )}
                                        </Group>
                                    );
                                })}
                            </Layer>
                        </Stage>
                    </div>
                </div>

                {/* Label Edit Modal */}
                {editingLabel && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Player Label</h3>
                            <input
                                type="text"
                                value={labelInput}
                                onChange={(e) => setLabelInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLabelSave()}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold focus:outline-none focus:border-orange-600"
                                placeholder="Enter label (e.g., 1, PG, C)"
                                autoFocus
                                maxLength={3}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setEditingLabel(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLabelSave}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-semibold"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
