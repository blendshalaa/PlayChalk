import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle as KonvaCircle, Line, Group, Arc, Arrow, Text as KonvaText, RegularPolygon } from 'react-konva';
import Konva from 'konva';
import { MousePointer2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlayStore } from '../store/usePlayStore';
import type { PlayObject } from '../types';

const WIDTH = 800;
const HEIGHT = 600;

interface CourtProps {
    onRegisterExport: (callback: () => void) => void;
}

const CourtBackground = () => {
    // Simplified court with better visibility
    const courtWidth = 700;
    const courtHeight = 400;
    const offsetX = (WIDTH - courtWidth) / 2;
    const offsetY = (HEIGHT - courtHeight) / 2;

    return (
        <Group>
            {/* Floor Base - Wood Color */}
            <Rect width={WIDTH} height={HEIGHT} fill="#d4a373" />

            {/* Wood Planks Pattern */}
            {Array.from({ length: 60 }).map((_, i) => (
                <Rect
                    key={i}
                    x={0}
                    y={i * (HEIGHT / 60)}
                    width={WIDTH}
                    height={HEIGHT / 60}
                    fill={i % 2 === 0 ? "rgba(0,0,0,0.03)" : "transparent"}
                />
            ))}

            {/* Court Boundary */}
            <Rect
                x={offsetX}
                y={offsetY}
                width={courtWidth}
                height={courtHeight}
                stroke="white"
                strokeWidth={4}
                shadowColor="black"
                shadowBlur={3}
                shadowOpacity={0.2}
            />

            {/* Center Court Line */}
            <Line
                points={[WIDTH / 2, offsetY, WIDTH / 2, offsetY + courtHeight]}
                stroke="white"
                strokeWidth={4}
            />

            {/* Center Circle */}
            <KonvaCircle
                x={WIDTH / 2}
                y={HEIGHT / 2}
                radius={50}
                stroke="white"
                strokeWidth={4}
            />
            <KonvaCircle
                x={WIDTH / 2}
                y={HEIGHT / 2}
                radius={10}
                fill="white"
            />

            {/* LEFT SIDE */}
            <Group>
                {/* Key (Paint) */}
                <Rect
                    x={offsetX}
                    y={HEIGHT / 2 - 80}
                    width={150}
                    height={160}
                    fill="rgba(234, 88, 12, 0.2)"
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Free Throw Circle */}
                <Arc
                    x={offsetX + 150}
                    y={HEIGHT / 2}
                    innerRadius={0}
                    outerRadius={50}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={4}
                />
                <Arc
                    x={offsetX + 150}
                    y={HEIGHT / 2}
                    innerRadius={0}
                    outerRadius={50}
                    angle={180}
                    rotation={90}
                    stroke="white"
                    strokeWidth={4}
                    dash={[10, 10]}
                />

                {/* 3-Point Line */}
                <Arc
                    x={offsetX + 30}
                    y={HEIGHT / 2}
                    innerRadius={0}
                    outerRadius={200}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Hoop */}
                <Line
                    points={[offsetX + 26, HEIGHT / 2 - 25, offsetX + 26, HEIGHT / 2 + 25]}
                    stroke="white"
                    strokeWidth={4}
                    shadowColor="black"
                    shadowBlur={5}
                />
                <KonvaCircle
                    x={offsetX + 38}
                    y={HEIGHT / 2}
                    radius={8}
                    stroke="#ea580c"
                    strokeWidth={3}
                />
            </Group>

            {/* RIGHT SIDE */}
            <Group>
                {/* Key (Paint) */}
                <Rect
                    x={offsetX + courtWidth - 150}
                    y={HEIGHT / 2 - 80}
                    width={150}
                    height={160}
                    fill="rgba(234, 88, 12, 0.2)"
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Free Throw Circle */}
                <Arc
                    x={offsetX + courtWidth - 150}
                    y={HEIGHT / 2}
                    innerRadius={0}
                    outerRadius={50}
                    angle={180}
                    rotation={90}
                    stroke="white"
                    strokeWidth={4}
                />
                <Arc
                    x={offsetX + courtWidth - 150}
                    y={HEIGHT / 2}
                    innerRadius={0}
                    outerRadius={50}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={4}
                    dash={[10, 10]}
                />

                {/* 3-Point Line */}
                <Arc
                    x={offsetX + courtWidth - 30}
                    y={HEIGHT / 2}
                    innerRadius={0}
                    outerRadius={200}
                    angle={180}
                    rotation={90}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Hoop */}
                <Line
                    points={[offsetX + courtWidth - 26, HEIGHT / 2 - 25, offsetX + courtWidth - 26, HEIGHT / 2 + 25]}
                    stroke="white"
                    strokeWidth={4}
                    shadowColor="black"
                    shadowBlur={5}
                />
                <KonvaCircle
                    x={offsetX + courtWidth - 38}
                    y={HEIGHT / 2}
                    radius={8}
                    stroke="#ea580c"
                    strokeWidth={3}
                />
            </Group>

            {/* Court Shine Effect - Diagonal gradient overlay */}
            <Rect
                width={WIDTH}
                height={HEIGHT}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: WIDTH, y: HEIGHT }}
                fillLinearGradientColorStops={[
                    0, 'rgba(255,255,255,0.15)',
                    0.3, 'transparent',
                    0.7, 'transparent',
                    1, 'rgba(0,0,0,0.15)'
                ]}
                listening={false}
            />

            {/* Additional shine highlights */}
            <Rect
                x={WIDTH * 0.2}
                y={HEIGHT * 0.1}
                width={WIDTH * 0.3}
                height={HEIGHT * 0.2}
                fillRadialGradientStartPoint={{ x: WIDTH * 0.15, y: HEIGHT * 0.1 }}
                fillRadialGradientEndPoint={{ x: WIDTH * 0.15, y: HEIGHT * 0.1 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndRadius={150}
                fillRadialGradientColorStops={[0, 'rgba(255,255,255,0.1)', 1, 'transparent']}
                listening={false}
            />
        </Group>
    );
};

export const Court = ({ onRegisterExport }: CourtProps) => {
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
            if (e.target instanceof HTMLInputElement) return;

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

    // Register export function
    useEffect(() => {
        if (onRegisterExport) {
            onRegisterExport(() => {
                if (!stageRef.current) return;
                const uri = stageRef.current.toDataURL();
                const link = document.createElement('a');
                link.download = `playchalk-frame-${currentFrameIndex + 1}.png`;
                link.href = uri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    }, [onRegisterExport, currentFrameIndex]);

    const handleObjectClick = (objId: string) => {
        if (currentTool !== 'select') return;
        setSelectedObject(objId);
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
        <div className="h-full w-full flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden relative" onDrop={handleDrop} onDragOver={handleDragOver}>

                {/* Canvas Area */}
                <div className="absolute inset-0 flex items-center justify-center p-8 overflow-auto">
                    {isEmpty && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            <div className="text-center max-w-md p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/10">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                                    <MousePointer2 size={32} className="text-orange-500" strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Get Started</h3>
                                <p className="text-gray-400 font-medium">
                                    Drag players or equipment from the sidebar onto the court
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="shadow-2xl rounded-xl overflow-hidden border-[10px] border-[#5c2b0c] bg-[#d4a373] relative z-0">
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
                                        <Arrow points={currentLine} stroke="yellow" strokeWidth={2} dash={[5, 5]} />
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

                                            dragBoundFunc={(pos) => {
                                                const radius = 20;
                                                return {
                                                    x: Math.max(radius, Math.min(WIDTH - radius, pos.x)),
                                                    y: Math.max(radius, Math.min(HEIGHT - radius, pos.y)),
                                                };
                                            }}

                                            onDragEnd={(e) => updateObjectPosition(currentFrameIndex, obj.id, e.target.x(), e.target.y())}
                                            onClick={() => handleObjectClick(obj.id)}
                                            onDblClick={() => handleLabelEdit(obj.id, obj.label)}

                                            onMouseEnter={(e) => {
                                                if (currentTool === 'select') {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'grab';
                                                    e.target.to({ scaleX: 1.1, scaleY: 1.1, duration: 0.1 });
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (currentTool === 'select') {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'default';
                                                    e.target.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
                                                }
                                            }}
                                            onDragStart={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) container.style.cursor = 'grabbing';
                                                e.target.to({ scaleX: 1.2, scaleY: 1.2, duration: 0.1 });
                                            }}
                                        >
                                            {/* Selection glow */}
                                            {isSelected && (
                                                <>
                                                    <KonvaCircle radius={30} fill="rgba(249, 115, 22, 0.2)" />
                                                    <KonvaCircle radius={25} stroke="#f97316" strokeWidth={2} dash={[5, 5]} />
                                                </>
                                            )}

                                            {/* Render different object types */}
                                            {obj.type === 'player_offense' && (
                                                <>
                                                    {/* Glow effect for selected */}
                                                    {isSelected && (
                                                        <KonvaCircle radius={18} fill="rgba(249, 115, 22, 0.3)" blur={10} />
                                                    )}
                                                    <KonvaCircle radius={15} fill="white" stroke={obj.color || "#ea580c"} strokeWidth={3} shadowColor="black" shadowBlur={8} shadowOpacity={0.4} />
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
                                                    {isSelected && (
                                                        <KonvaCircle radius={18} fill="rgba(37, 99, 235, 0.3)" blur={10} />
                                                    )}
                                                    <Line points={[-12, -12, 12, 12]} stroke={obj.color || "#2563eb"} strokeWidth={4} shadowColor="black" shadowBlur={8} shadowOpacity={0.4} />
                                                    <Line points={[12, -12, -12, 12]} stroke={obj.color || "#2563eb"} strokeWidth={4} shadowColor="black" shadowBlur={8} shadowOpacity={0.4} />
                                                </>
                                            )}

                                            {obj.type === 'ball' && (
                                                <>
                                                    {isSelected && (
                                                        <KonvaCircle radius={13} fill="rgba(249, 115, 22, 0.3)" blur={10} />
                                                    )}
                                                    {/* Ball with gradient for depth */}
                                                    <KonvaCircle
                                                        radius={10}
                                                        fillRadialGradientStartPoint={{ x: -3, y: -3 }}
                                                        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                                                        fillRadialGradientStartRadius={0}
                                                        fillRadialGradientEndRadius={10}
                                                        fillRadialGradientColorStops={[0, '#ff8c42', 1, '#ea580c']}
                                                        stroke="black"
                                                        strokeWidth={1}
                                                        shadowColor="black"
                                                        shadowBlur={8}
                                                        shadowOpacity={0.4}
                                                    />
                                                </>
                                            )}

                                            {obj.type === 'screen' && (
                                                <>
                                                    <Rect x={-20} y={-20} width={40} height={40} fill="transparent" />
                                                    {isSelected && (
                                                        <KonvaCircle radius={20} fill="rgba(147, 51, 234, 0.3)" blur={10} />
                                                    )}
                                                    <Line points={[0, -15, 0, 15]} stroke={obj.color || "#9333ea"} strokeWidth={4} shadowColor="black" shadowBlur={8} shadowOpacity={0.4} />
                                                    <Line points={[-15, 15, 15, 15]} stroke={obj.color || "#9333ea"} strokeWidth={4} shadowColor="black" shadowBlur={8} shadowOpacity={0.4} />
                                                </>
                                            )}

                                            {obj.type === 'cone' && (
                                                <>
                                                    {isSelected && (
                                                        <KonvaCircle radius={18} fill="rgba(249, 115, 22, 0.3)" blur={10} />
                                                    )}
                                                    <RegularPolygon sides={3} radius={15} fill={obj.color || "#f97316"} stroke="black" strokeWidth={1} shadowColor="black" shadowBlur={8} shadowOpacity={0.4} />
                                                </>
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
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                            <h3 className="text-lg font-bold text-white mb-4">Edit Player Label</h3>
                            <input
                                type="text"
                                value={labelInput}
                                onChange={(e) => setLabelInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLabelSave()}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl font-semibold text-white focus:outline-none focus:border-orange-500"
                                placeholder="Enter label (e.g., 1, PG, C)"
                                autoFocus
                                maxLength={3}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setEditingLabel(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLabelSave}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 font-semibold transition-all"
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
