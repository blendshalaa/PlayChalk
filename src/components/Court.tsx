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
    onRegisterExport: (exports: { exportImage: () => void; exportVideo: () => void }) => void;
}

const CourtBackground = ({ type }: { type: 'full' | 'half' }) => {
    // Simplified court with better visibility
    const courtWidth = type === 'full' ? 700 : 600;
    const courtHeight = type === 'full' ? 400 : 500;
    const offsetX = (WIDTH - courtWidth) / 2;
    const offsetY = (HEIGHT - courtHeight) / 2;

    if (type === 'half') {
        return (
            <Group>
                {/* Floor Base */}
                <Rect width={WIDTH} height={HEIGHT} fill="#d4a373" />
                {/* Wood Pattern */}
                {Array.from({ length: 60 }).map((_, i) => (
                    <Rect key={i} x={0} y={i * (HEIGHT / 60)} width={WIDTH} height={HEIGHT / 60} fill={i % 2 === 0 ? "rgba(0,0,0,0.03)" : "transparent"} />
                ))}

                {/* Main Half Court Boundary */}
                <Rect x={offsetX} y={offsetY} width={courtWidth} height={courtHeight} stroke="white" strokeWidth={4} shadowColor="black" shadowBlur={3} shadowOpacity={0.2} />

                {/* Baseline (Bottom) */}
                <Group y={offsetY + courtHeight}>
                    {/* Key */}
                    <Rect x={offsetX + (courtWidth - 200) / 2} y={-220} width={200} height={220} fill="rgba(234, 88, 12, 0.2)" stroke="white" strokeWidth={4} />

                    {/* Free Throw Circle */}
                    <Arc x={offsetX + courtWidth / 2} y={-220} innerRadius={0} outerRadius={70} angle={180} rotation={0} stroke="white" strokeWidth={4} />
                    <Arc x={offsetX + courtWidth / 2} y={-220} innerRadius={0} outerRadius={70} angle={180} rotation={180} stroke="white" strokeWidth={4} dash={[10, 10]} />

                    {/* 3-Point Line */}
                    <Arc x={offsetX + courtWidth / 2} y={-35} innerRadius={0} outerRadius={280} angle={180} rotation={180} stroke="white" strokeWidth={4} />

                    {/* Hoop */}
                    <Line points={[offsetX + courtWidth / 2 - 30, -35, offsetX + courtWidth / 2 + 30, -35]} stroke="white" strokeWidth={4} />
                    <KonvaCircle x={offsetX + courtWidth / 2} y={-47} radius={10} stroke="#ea580c" strokeWidth={3} />
                </Group>

                {/* Center Circle (at top) */}
                <Arc x={offsetX + courtWidth / 2} y={offsetY} innerRadius={0} outerRadius={70} angle={180} rotation={0} stroke="white" strokeWidth={4} />
            </Group>
        );
    }

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

            {/* Left Side (Left Basket) */}
            <Group x={offsetX} y={offsetY}>
                {/* Paint/Key */}
                <Rect
                    x={0}
                    y={(courtHeight - 160) / 2}
                    width={150}
                    height={160}
                    fill="rgba(234, 88, 12, 0.2)"
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Free Throw Circle - Top Half */}
                <Arc
                    x={150}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={60}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Free Throw Circle - Bottom Half (Dashed) */}
                <Arc
                    x={150}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={60}
                    angle={180}
                    rotation={90}
                    stroke="white"
                    strokeWidth={4}
                    dash={[8, 8]}
                />

                {/* 3-Point Line */}
                <Arc
                    x={40}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={237.5}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* 3-Point Line Straight Sections */}
                <Line
                    points={[40, 14, 40, (courtHeight / 2) - 237.5]}
                    stroke="white"
                    strokeWidth={4}
                />
                <Line
                    points={[40, (courtHeight / 2) + 237.5, 40, courtHeight - 14]}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Backboard */}
                <Line
                    points={[40, courtHeight / 2 - 30, 40, courtHeight / 2 + 30]}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Rim */}
                <KonvaCircle
                    x={55}
                    y={courtHeight / 2}
                    radius={9}
                    stroke="#ea580c"
                    strokeWidth={3}
                />
            </Group>

            {/* Right Side (Right Basket) - Mirror of Left */}
            <Group x={offsetX + courtWidth} y={offsetY} scaleX={-1}>
                {/* Paint/Key */}
                <Rect
                    x={0}
                    y={(courtHeight - 160) / 2}
                    width={150}
                    height={160}
                    fill="rgba(234, 88, 12, 0.2)"
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Free Throw Circle - Top Half */}
                <Arc
                    x={150}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={60}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Free Throw Circle - Bottom Half (Dashed) */}
                <Arc
                    x={150}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={60}
                    angle={180}
                    rotation={90}
                    stroke="white"
                    strokeWidth={4}
                    dash={[8, 8]}
                />

                {/* 3-Point Line */}
                <Arc
                    x={40}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={237.5}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* 3-Point Line Straight Sections */}
                <Line
                    points={[40, 14, 40, (courtHeight / 2) - 237.5]}
                    stroke="white"
                    strokeWidth={4}
                />
                <Line
                    points={[40, (courtHeight / 2) + 237.5, 40, courtHeight - 14]}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Backboard */}
                <Line
                    points={[40, courtHeight / 2 - 30, 40, courtHeight / 2 + 30]}
                    stroke="white"
                    strokeWidth={4}
                />

                {/* Rim */}
                <KonvaCircle
                    x={55}
                    y={courtHeight / 2}
                    radius={9}
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
        addObjects,
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
        redo,
        courtType,
        addTextAnnotation,
        deleteTextAnnotation,
        textFontSize,
        attachBallToPlayer,
        detachBall
    } = usePlayStore();

    const currentFrame = frames[currentFrameIndex];
    const stageRef = useRef<Konva.Stage>(null);
    const nodeRefs = useRef<Record<string, Konva.Node>>({});

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState<number[]>([]);
    const [editingLabel, setEditingLabel] = useState<string | null>(null);
    const [labelInput, setLabelInput] = useState('');

    // Text Annotation State
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [textInput, setTextInput] = useState('');
    const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });

    const isEmpty = currentFrame && Object.keys(currentFrame.objects).length === 0 && currentFrame.annotations.length === 0 && currentFrame.textAnnotations.length === 0;

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
                } else if (e.key === 'd' || e.key === 'D') {
                    if (selectedObjectId) {
                        const currentFrame = frames[currentFrameIndex];
                        const selectedObj = currentFrame?.objects[selectedObjectId];
                        if (selectedObj?.type === 'ball' && selectedObj.attachedTo) {
                            e.preventDefault();
                            detachBall(selectedObjectId);
                            toast.success('Ball detached');
                        }
                    }
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

    // Handle Text Input Submit
    const handleTextSubmit = () => {
        if (editingTextId === 'NEW') {
            if (textInput.trim()) {
                addTextAnnotation({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'text',
                    x: textInputPos.x,
                    y: textInputPos.y,
                    text: textInput,
                    color: annotationColor,
                    fontSize: textFontSize,
                });
                toast.success('Text added');
            }
        } else if (editingTextId) {
            // Update existing text (not implemented in store yet, but we can delete and add)
            if (textInput.trim()) {
                deleteTextAnnotation(editingTextId);
                addTextAnnotation({
                    id: editingTextId,
                    type: 'text',
                    x: textInputPos.x,
                    y: textInputPos.y,
                    text: textInput,
                    color: annotationColor,
                    fontSize: textFontSize,
                });
            } else {
                deleteTextAnnotation(editingTextId);
            }
        }
        setEditingTextId(null);
        setTextInput('');
        setTool('select');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!stageRef.current) return;
        stageRef.current.setPointersPositions(e);
        const pointerPosition = stageRef.current.getPointerPosition();
        const type = e.dataTransfer.getData('type');
        const data = e.dataTransfer.getData('data');

        if (pointerPosition) {
            if (type === 'preset') {
                const preset = JSON.parse(data);
                const objectsToAdd: PlayObject[] = preset.objects.map((obj: any) => {
                    let x = obj.x;
                    let y = obj.y;

                    // If dropping onto full court, transform coordinates from vertical half-court to horizontal full-court (left side)
                    if (courtType === 'full') {
                        // Half Court (Vertical): Width 1200 (Center 600), Height 800 (Hoop ~700)
                        // Full Court (Horizontal): Width 1200 (Left Hoop ~155), Height 800 (Center 400)

                        // Transform:
                        // Vertical Center (600, y) -> Horizontal Center (x, 400)
                        // Vertical Hoop (600, 700) -> Horizontal Hoop (155, 400)

                        const relX = (obj.x - 600); // Distance from center width
                        const relY = (700 - obj.y); // Distance from hoop

                        x = 155 + relY; // Move right from hoop based on distance from hoop
                        y = 400 + relX; // Move up/down from center based on width offset
                    }

                    return {
                        id: Math.random().toString(36).substr(2, 9),
                        type: obj.type,
                        x: x,
                        y: y,
                        label: obj.label,
                        color: obj.color
                    };
                });
                addObjects(objectsToAdd);
                toast.success(`Applied ${preset.name}`);
            } else if (type === 'roster_player') {
                const player = JSON.parse(data);
                addObject({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'player_offense', // Default to offense, could be configurable
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    label: player.number,
                    color: player.color
                });
            } else if (type) {
                const newObject: PlayObject = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: type as any,
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    label: type === 'player_offense' ? '1' : type === 'player_defense' ? 'X' : undefined,
                };
                addObject(newObject);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (currentTool === 'select') return;

        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        if (currentTool === 'text') {
            setTextInputPos(pos);
            setEditingTextId('NEW');
            setTextInput('');
            return;
        }

        setIsDrawing(true);
        setCurrentLine([pos.x, pos.y, pos.x, pos.y]);
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDrawing) return;
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) {
            if (currentTool === 'freehand') {
                setCurrentLine([...currentLine, pos.x, pos.y]);
            } else {
                setCurrentLine([currentLine[0], currentLine[1], pos.x, pos.y]);
            }
        }
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentLine.length > 0) {
            addAnnotation({
                id: Math.random().toString(36).substr(2, 9),
                type: currentTool as 'line' | 'arrow' | 'freehand',
                points: currentLine,
                color: annotationColor,
                strokeWidth: annotationStrokeWidth,
            });
            setCurrentLine([]);
            toast.success(`${currentTool.charAt(0).toUpperCase() + currentTool.slice(1)} added`);
        }
    };

    // Register export functions
    useEffect(() => {
        if (onRegisterExport) {
            onRegisterExport({
                exportImage: () => {
                    if (!stageRef.current) return;
                    const uri = stageRef.current.toDataURL();
                    const link = document.createElement('a');
                    link.download = `playchalk-frame-${currentFrameIndex + 1}.png`;
                    link.href = uri;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },
                exportVideo: async () => {
                    if (!stageRef.current) return;
                    const canvas = stageRef.current.content.querySelector('canvas');
                    if (!canvas) return;

                    const stream = canvas.captureStream(30);
                    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                    const chunks: Blob[] = [];

                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) chunks.push(e.data);
                    };

                    mediaRecorder.onstop = () => {
                        const blob = new Blob(chunks, { type: 'video/webm' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'playchalk-animation.webm';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        toast.success('Video exported successfully');
                    };

                    // Start recording and playback
                    mediaRecorder.start();

                    // Reset to start
                    usePlayStore.getState().setCurrentFrame(0);
                    usePlayStore.getState().togglePlay(); // Start playing

                    // Calculate duration
                    const totalDuration = frames.reduce((acc, f) => acc + (f.duration || 500), 0);

                    // Stop after duration
                    setTimeout(() => {
                        mediaRecorder.stop();
                        usePlayStore.getState().togglePlay(); // Stop playing
                    }, totalDuration + 100); // Add buffer

                    toast.success('Recording started... please wait');
                }
            });
        }
    }, [onRegisterExport, currentFrameIndex, frames]);

    const handleObjectClick = (objId: string) => {
        if (currentTool !== 'select') return;

        // Check if we're clicking a player while a ball is selected
        const selectedObj = selectedObjectId ? currentFrame?.objects[selectedObjectId] : null;
        const clickedObj = currentFrame?.objects[objId];

        if (selectedObj?.type === 'ball' && clickedObj && (clickedObj.type === 'player_offense' || clickedObj.type === 'player_defense')) {
            // Attach ball to player
            attachBallToPlayer(selectedObjectId!, objId);
            toast.success('Ball attached to player! Press D to detach.');
            return;
        }

        setSelectedObject(objId);

        // Show helpful message when ball is selected
        if (clickedObj?.type === 'ball') {
            if (clickedObj.attachedTo) {
                toast('Ball is attached. Press D to detach or click another player to transfer.', { icon: '🔗' });
            } else {
                toast('Ball selected. Click on a player to attach it.', { icon: '🏀' });
            }
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
                                <CourtBackground type={courtType} />
                                {currentFrame && currentFrame.annotations.map((ann) => (
                                    ann.type === 'arrow' ? (
                                        <Arrow key={ann.id} points={ann.points} stroke={ann.color} strokeWidth={ann.strokeWidth} fill={ann.color} />
                                    ) : ann.type === 'freehand' ? (
                                        <Line key={ann.id} points={ann.points} stroke={ann.color} strokeWidth={ann.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" />
                                    ) : (
                                        <Line key={ann.id} points={ann.points} stroke={ann.color} strokeWidth={ann.strokeWidth} />
                                    )
                                ))}
                                {currentFrame && currentFrame.textAnnotations.map((text) => (
                                    <KonvaText
                                        key={text.id}
                                        x={text.x}
                                        y={text.y}
                                        text={text.text}
                                        fontSize={text.fontSize}
                                        fill={text.color}
                                        fontStyle="bold"
                                        draggable={currentTool === 'select'}
                                        onClick={() => {
                                            if (currentTool === 'select') {
                                                setEditingTextId(text.id);
                                                setTextInput(text.text);
                                                setTextInputPos({ x: text.x, y: text.y });
                                            }
                                        }}
                                    />
                                ))}
                                {isDrawing && currentLine.length > 0 && (
                                    currentTool === 'arrow' ? (
                                        <Arrow points={currentLine} stroke="yellow" strokeWidth={2} dash={[5, 5]} />
                                    ) : currentTool === 'freehand' ? (
                                        <Line points={currentLine} stroke="yellow" strokeWidth={2} dash={[5, 5]} tension={0.5} />
                                    ) : (
                                        <Line points={currentLine} stroke="yellow" strokeWidth={2} dash={[5, 5]} />
                                    )
                                )}
                            </Layer>
                            <Layer>
                                {currentFrame && Object.values(currentFrame.objects).map((obj) => {
                                    const isSelected = selectedObjectId === obj.id;

                                    // Calculate position - if ball is attached, use player's position + offset
                                    let displayX = obj.x;
                                    let displayY = obj.y;

                                    if (obj.type === 'ball' && obj.attachedTo) {
                                        const attachedPlayer = currentFrame.objects[obj.attachedTo];
                                        if (attachedPlayer) {
                                            displayX = attachedPlayer.x + 25; // offset to the right
                                            displayY = attachedPlayer.y;
                                        }
                                    }

                                    return (
                                        <Group
                                            key={obj.id}
                                            x={displayX}
                                            y={displayY}
                                            draggable={!isPlaying && currentTool === 'select' && !obj.attachedTo}
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
                                                    {/* Attachment indicator */}
                                                    {obj.attachedTo && (
                                                        <>
                                                            <KonvaCircle
                                                                x={-15}
                                                                y={-15}
                                                                radius={4}
                                                                fill="#10b981"
                                                                stroke="white"
                                                                strokeWidth={1}
                                                            />
                                                            <Line
                                                                points={[-13, -13, -8, -8]}
                                                                stroke="#10b981"
                                                                strokeWidth={2}
                                                            />
                                                        </>
                                                    )}
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

                {/* Text Input Modal */}
                {editingTextId && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                            <h3 className="text-lg font-bold text-white mb-4">
                                {editingTextId === 'NEW' ? 'Add Text' : 'Edit Text'}
                            </h3>
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl font-semibold text-white focus:outline-none focus:border-orange-500"
                                placeholder="Enter text..."
                                autoFocus
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setEditingTextId(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleTextSubmit}
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
