import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle as KonvaCircle, Line, Group, Arc, Arrow, Text as KonvaText, Transformer } from 'react-konva';
import Konva from 'konva';
import { MousePointer2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlayStore } from '../store/usePlayStore';
import type { PlayObject, PlayerType } from '../types';
import { CourtObject } from './CourtObject';

const WIDTH = 800;
const HEIGHT = 600;

interface CourtProps {
    onRegisterExport: (exports: { exportImage: () => void }) => void;
}


// Easing function
const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const CourtBackground = React.memo(({ type }: { type: 'full' | 'half' }) => {
    // NBA Dimensions (Scale: 8px = 1ft)
    // Court: 94ft x 50ft -> 752px x 400px
    const SCALE = 8;
    const courtWidth = type === 'full' ? 94 * SCALE : 600; // 752 or 600
    const courtHeight = type === 'full' ? 50 * SCALE : 500; // 400 or 500
    const offsetX = (WIDTH - courtWidth) / 2;
    const offsetY = (HEIGHT - courtHeight) / 2;

    // Common measurements
    const KEY_WIDTH = 16 * SCALE; // 128
    const KEY_HEIGHT = 19 * SCALE; // 152 (15ft to backboard + 4ft to baseline)
    const FT_RADIUS = 6 * SCALE; // 48
    const THREE_RADIUS = 23.75 * SCALE; // 190
    const RIM_X = 5.25 * SCALE; // 42 (4ft overhang + 1.25ft to center)
    const BACKBOARD_X = 4 * SCALE; // 32
    const RESTRICTED_RADIUS = 4 * SCALE; // 32
    const LINE_WIDTH = 3;

    if (type === 'half') {
        return (
            <Group>
                <Rect width={WIDTH} height={HEIGHT} fill="#d4a373" />
                {/* Wood Pattern - Vertical Planks */}
                {Array.from({ length: 60 }).map((_, i) => (
                    <Rect key={i} x={0} y={i * (HEIGHT / 60)} width={WIDTH} height={HEIGHT / 60} fill={i % 2 === 0 ? "rgba(0,0,0,0.03)" : "transparent"} />
                ))}
                {/* Wood Grain Texture Overlay */}
                <Rect
                    width={WIDTH}
                    height={HEIGHT}
                    fill="rgba(139, 69, 19, 0.1)" // Slight brown tint
                    listening={false}
                />

                <Rect x={offsetX} y={offsetY} width={600} height={500} stroke="white" strokeWidth={LINE_WIDTH} shadowColor="black" shadowBlur={10} shadowOpacity={0.3} />
                {/* Simplified Half Court (Vertical) - Keeping existing logic but with thinner lines */}
                <Group y={offsetY + 500}>
                    <Rect x={offsetX + (600 - 200) / 2} y={-220} width={200} height={220} fill="rgba(234, 88, 12, 0.2)" stroke="white" strokeWidth={LINE_WIDTH} />
                    <Arc x={offsetX + 300} y={-220} innerRadius={0} outerRadius={70} angle={180} rotation={0} stroke="white" strokeWidth={LINE_WIDTH} />
                    <Arc x={offsetX + 300} y={-220} innerRadius={0} outerRadius={70} angle={180} rotation={180} stroke="white" strokeWidth={LINE_WIDTH} dash={[10, 10]} />
                    <Arc x={offsetX + 300} y={-35} innerRadius={0} outerRadius={280} angle={180} rotation={180} stroke="white" strokeWidth={LINE_WIDTH} />
                    <Line points={[offsetX + 300 - 30, -35, offsetX + 300 + 30, -35]} stroke="white" strokeWidth={LINE_WIDTH} />
                    <KonvaCircle x={offsetX + 300} y={-47} radius={10} stroke="#ea580c" strokeWidth={3} />
                </Group>
                <Arc x={offsetX + 300} y={offsetY} innerRadius={0} outerRadius={70} angle={180} rotation={0} stroke="white" strokeWidth={LINE_WIDTH} />
            </Group>
        );
    }

    const renderCourtSide = (isRightSide: boolean) => {
        const groupProps = isRightSide
            ? { x: offsetX + courtWidth, y: offsetY, scaleX: -1 }
            : { x: offsetX, y: offsetY };

        // Calculate 3-point line geometry
        const THREE_PT_CORNER_DIST = 22 * SCALE; // 22ft from corner to basket along baseline
        const THREE_PT_STRAIGHT_LENGTH = 14 * SCALE; // 14ft straight section from baseline

        return (
            <Group {...groupProps}>
                {/* Key (Paint) - lighter fill */}
                <Rect
                    x={0}
                    y={(courtHeight - KEY_WIDTH) / 2}
                    width={KEY_HEIGHT}
                    height={KEY_WIDTH}
                    fill="rgba(234, 88, 12, 0.15)"
                />

                {/* Free Throw Circle - Solid half inside key */}
                <Arc
                    x={KEY_HEIGHT}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={FT_RADIUS}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={LINE_WIDTH}
                />

                {/* Free Throw Circle - Dashed half outside key */}
                <Arc
                    x={KEY_HEIGHT}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={FT_RADIUS}
                    angle={180}
                    rotation={90}
                    stroke="white"
                    strokeWidth={LINE_WIDTH}
                    dash={[8, 8]}
                />

                {/* 3-Point Line - Top corner straight section */}
                <Line
                    points={[
                        0, (courtHeight / 2) - KEY_WIDTH / 2 - THREE_PT_CORNER_DIST,
                        THREE_PT_STRAIGHT_LENGTH, (courtHeight / 2) - KEY_WIDTH / 2 - THREE_PT_CORNER_DIST
                    ]}
                    stroke="white"
                    strokeWidth={LINE_WIDTH}
                />

                {/* 3-Point Line - Bottom corner straight section */}
                <Line
                    points={[
                        0, (courtHeight / 2) + KEY_WIDTH / 2 + THREE_PT_CORNER_DIST,
                        THREE_PT_STRAIGHT_LENGTH, (courtHeight / 2) + KEY_WIDTH / 2 + THREE_PT_CORNER_DIST
                    ]}
                    stroke="white"
                    strokeWidth={LINE_WIDTH}
                />

                {/* 3-Point Arc - connects the two straight sections */}
                <Arc
                    x={RIM_X}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={THREE_RADIUS}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={LINE_WIDTH}
                />

                {/* Restricted Area Arc */}
                <Arc
                    x={RIM_X}
                    y={courtHeight / 2}
                    innerRadius={0}
                    outerRadius={RESTRICTED_RADIUS}
                    angle={180}
                    rotation={-90}
                    stroke="white"
                    strokeWidth={LINE_WIDTH}
                />

                {/* Backboard */}
                <Line
                    points={[BACKBOARD_X, (courtHeight / 2) - (3 * SCALE), BACKBOARD_X, (courtHeight / 2) + (3 * SCALE)]}
                    stroke="white"
                    strokeWidth={LINE_WIDTH}
                    shadowColor="black"
                    shadowBlur={5}
                    shadowOpacity={0.3}
                />

                {/* Rim */}
                <KonvaCircle
                    x={RIM_X}
                    y={courtHeight / 2}
                    radius={0.75 * SCALE}
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    fill="none"
                    shadowColor="black"
                    shadowBlur={2}
                    shadowOpacity={0.3}
                />
            </Group>
        );
    };

    return (
        <Group>
            {/* Floor Base - Richer Wood Color */}
            <Rect width={WIDTH} height={HEIGHT} fill="#c19a6b" />

            {/* Wood Pattern - Horizontal Planks for Full Court */}
            {Array.from({ length: 80 }).map((_, i) => (
                <Rect
                    key={i}
                    x={0}
                    y={i * (HEIGHT / 80)}
                    width={WIDTH}
                    height={HEIGHT / 80}
                    fill={i % 2 === 0 ? "rgba(101, 67, 33, 0.05)" : "transparent"}
                />
            ))}

            {/* Random Wood Grain Variation (Simulated with random opacity rectangles) */}
            {/* This is expensive to render too many, so we keep it simple or use a large rect with gradient */}
            <Rect
                width={WIDTH}
                height={HEIGHT}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: WIDTH, y: HEIGHT }}
                fillLinearGradientColorStops={[0, 'rgba(0,0,0,0)', 0.5, 'rgba(139,69,19,0.05)', 1, 'rgba(0,0,0,0)']}
                listening={false}
            />

            {/* Court Boundary */}
            <Rect
                x={offsetX}
                y={offsetY}
                width={courtWidth}
                height={courtHeight}
                stroke="white"
                strokeWidth={LINE_WIDTH}
                shadowColor="black"
                shadowBlur={5}
                shadowOpacity={0.2}
            />

            {/* Center Court Line */}
            <Line
                points={[WIDTH / 2, offsetY, WIDTH / 2, offsetY + courtHeight]}
                stroke="white"
                strokeWidth={LINE_WIDTH}
            />

            {/* Center Circle */}
            <KonvaCircle
                x={WIDTH / 2}
                y={HEIGHT / 2}
                radius={FT_RADIUS}
                stroke="white"
                strokeWidth={LINE_WIDTH}
            />
            {/* Inner Center Circle (2ft radius) */}
            <KonvaCircle
                x={WIDTH / 2}
                y={HEIGHT / 2}
                radius={2 * SCALE}
                stroke="white"
                strokeWidth={LINE_WIDTH}
                fill="#c19a6b" // Fill to cover line
            />

            {/* Render Sides */}
            {renderCourtSide(false)}
            {renderCourtSide(true)}

            {/* Shine/Reflection Effect - Enhanced */}
            <Rect
                width={WIDTH}
                height={HEIGHT}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: WIDTH, y: HEIGHT }}
                fillLinearGradientColorStops={[
                    0, 'rgba(255,255,255,0.1)',
                    0.4, 'transparent',
                    0.6, 'transparent',
                    1, 'rgba(255,255,255,0.05)'
                ]}
                listening={false}
            />
            {/* Spotlights Reflection */}
            <KonvaCircle
                x={WIDTH * 0.3}
                y={HEIGHT * 0.3}
                radius={100}
                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndRadius={100}
                fillRadialGradientColorStops={[0, 'rgba(255,255,255,0.1)', 1, 'transparent']}
                listening={false}
            />
            <KonvaCircle
                x={WIDTH * 0.7}
                y={HEIGHT * 0.7}
                radius={100}
                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndRadius={100}
                fillRadialGradientColorStops={[0, 'rgba(255,255,255,0.1)', 1, 'transparent']}
                listening={false}
            />
        </Group>
    );
});

export const Court = ({ onRegisterExport }: CourtProps) => {
    const {
        frames,
        currentFrameIndex,
        addObject,
        addObjects,
        updateObjectPosition,
        // deleteObject, // Unused
        isPlaying,
        playbackSpeed,
        currentTool,
        setTool,
        addAnnotation,
        selectedObjectIds,
        setSelectedObject,
        selectMultipleObjects,
        toggleObjectSelection,
        clearSelection,
        selectAllObjects,
        deleteSelectedObjects,
        updateObjectLabel,
        annotationColor,
        annotationStrokeWidth,
        undo,
        redo,
        courtType,
        addTextAnnotation,
        deleteTextAnnotation,
        textFontSize,
        copyObject,
        pasteObject,
        deleteAnnotation,
        updateObjectRotation,
        updateObjectSize,
        // addShape, // Unused
        // shapeFillOpacity, // Unused
        viewMode,
        cameraRotation,
        cameraPitch
    } = usePlayStore();

    const currentFrame = frames[currentFrameIndex];
    const stageRef = useRef<Konva.Stage>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [stageSize, setStageSize] = useState({ width: WIDTH, height: HEIGHT });

    useEffect(() => {
        const checkSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                // Subtract padding (32px total for p-4) and border (20px total)
                // Actually, let's just use the container size and let the stage fit inside
                // We need to account for the padding of the parent container if we measure it
                // The parent has p-8 (32px) or p-2 on mobile.

                // Let's measure the available space in the container
                // Let's measure the available space in the container
                const availableWidth = width;
                const availableHeight = height;

                const scaleWidth = availableWidth / WIDTH;
                const scaleHeight = availableHeight / HEIGHT;

                // Actually, let's just fit.
                const finalScale = Math.min(scaleWidth, scaleHeight);

                setScale(finalScale);
                setStageSize({
                    width: WIDTH * finalScale,
                    height: HEIGHT * finalScale
                });
            }
        };

        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    const nodeRefs = useRef<Record<string, Konva.Node>>({});
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (selectedObjectIds && selectedObjectIds.length > 0 && transformerRef.current) {
            const nodes = selectedObjectIds
                .map(id => nodeRefs.current[id])
                .filter(Boolean);
            if (nodes.length > 0) {
                transformerRef.current.nodes(nodes);
                transformerRef.current.getLayer()?.batchDraw();
            }
        } else if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedObjectIds]);

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState<number[]>([]);
    const [editingLabel, setEditingLabel] = useState<string | null>(null);
    const [labelInput, setLabelInput] = useState('');

    // Selection rectangle state
    const [selectionRect, setSelectionRect] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
    const [isSelectingRect, setIsSelectingRect] = useState(false);

    // Text Annotation State
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [textInput, setTextInput] = useState('');
    const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });

    const isEmpty = currentFrame && Object.keys(currentFrame.objects).length === 0 && currentFrame.annotations.length === 0 && currentFrame.shapes.length === 0 && currentFrame.textAnnotations.length === 0;

    useEffect(() => {
        if (!isPlaying || !stageRef.current) return;
        const layer = stageRef.current.getLayers()[1];

        const anim = new Konva.Animation((frame) => {
            if (!frame || frames.length <= 1) return;
            const totalDuration = (frames.length - 1) * playbackSpeed;
            const time = frame.time % totalDuration;
            const frameIndex = Math.floor(time / playbackSpeed);
            const nextFrameIndex = frameIndex + 1;

            // Use Easing
            const rawProgress = (time % playbackSpeed) / playbackSpeed;
            const progress = easeInOutCubic(rawProgress);

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
                } else if (e.key === 'c') {
                    if (selectedObjectIds && selectedObjectIds.length > 0) {
                        e.preventDefault();
                        copyObject(selectedObjectIds[0]);
                        toast.success('Object copied');
                    }
                } else if (e.key === 'v') {
                    e.preventDefault();
                    pasteObject();
                    toast.success('Object pasted');
                } else if (e.key === 'a') {
                    e.preventDefault();
                    selectAllObjects();
                    toast.success('All objects selected');
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
                } else if (e.key === 'f' || e.key === 'F') {
                    e.preventDefault();
                    setTool('freehand');
                    toast.success('Freehand tool');
                } else if (e.key === 't' || e.key === 'T') {
                    e.preventDefault();
                    setTool('text');
                    toast.success('Text tool');
                } else if (e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                    setTool('eraser');
                    toast.success('Eraser tool');
                } else if (e.key === 'p' || e.key === 'P') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        setTool('dashed_arrow');
                        toast.success('Pass (Arrow) tool');
                    } else {
                        setTool('dashed_line');
                        toast.success('Pass (Line) tool');
                    }
                } else if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (selectedObjectIds && selectedObjectIds.length > 0) {
                        e.preventDefault();
                        deleteSelectedObjects();
                        toast.success(`Deleted ${selectedObjectIds.length} object(s)`);
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    clearSelection();
                    setSelectionRect(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setTool, undo, redo, selectedObjectIds, deleteSelectedObjects, setSelectedObject, copyObject, pasteObject, selectAllObjects, clearSelection]);

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

    const getLogicalPos = (stage: Konva.Stage) => {
        const pointer = stage.getPointerPosition();
        if (!pointer) return null;
        return {
            x: pointer.x / scale,
            y: pointer.y / scale
        };
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!stageRef.current) return;
        stageRef.current.setPointersPositions(e);

        const pointerPosition = getLogicalPos(stageRef.current);
        const type = e.dataTransfer.getData('type');
        const data = e.dataTransfer.getData('data');

        if (pointerPosition) {
            if (type === 'preset') {
                const preset = JSON.parse(data);
                const objectsToAdd: PlayObject[] = preset.objects.map((obj: PlayObject) => {
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
                    type: type as PlayerType,
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
        const stage = e.target.getStage();
        if (!stage) return;
        const pos = getLogicalPos(stage);
        if (!pos) return;

        // Handle selection rectangle for select tool
        if (currentTool === 'select' && e.target === e.target.getStage()) {
            if (!e.evt.shiftKey) {
                clearSelection();
            }
            setIsSelectingRect(true);
            setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
            return;
        }

        if (currentTool === 'select') return;

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
        const stage = e.target.getStage();
        if (!stage) return;
        const pos = getLogicalPos(stage);
        if (!pos) return;

        // Update selection rectangle
        if (isSelectingRect && selectionRect) {
            setSelectionRect({ ...selectionRect, x2: pos.x, y2: pos.y });
            return;
        }

        if (!isDrawing) return;

        if (currentTool === 'freehand') {
            setCurrentLine([...currentLine, pos.x, pos.y]);
        } else {
            setCurrentLine([currentLine[0], currentLine[1], pos.x, pos.y]);
        }
    };

    const handleMouseUp = () => {
        // Handle selection rectangle completion
        if (isSelectingRect && selectionRect) {
            setIsSelectingRect(false);
            const { x1, y1, x2, y2 } = selectionRect;
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            // Find objects within rectangle
            const selectedIds = Object.values(currentFrame.objects)
                .filter(obj => obj.x >= minX && obj.x <= maxX && obj.y >= minY && obj.y <= maxY)
                .map(obj => obj.id);

            if (selectedIds.length > 0) {
                selectMultipleObjects(selectedIds);
                toast.success(`Selected ${selectedIds.length} object(s)`);
            }
            setSelectionRect(null);
            return;
        }

        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentLine.length > 0) {
            addAnnotation({
                id: Math.random().toString(36).substr(2, 9),
                type: currentTool as 'line' | 'arrow' | 'freehand' | 'dashed_line' | 'dashed_arrow',
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
                    const stage = stageRef.current;
                    if (!stage) return;
                    // Reset scale for export to get full resolution
                    const oldScale = stage.scale();
                    const oldSize = stage.size();

                    stage.scale({ x: 1, y: 1 });
                    stage.size({ width: WIDTH, height: HEIGHT });

                    const uri = stage.toDataURL();

                    // Restore scale
                    stage.scale(oldScale);
                    stage.size(oldSize);

                    const link = document.createElement('a');
                    link.download = `playchalk-frame-${currentFrameIndex + 1}.png`;
                    link.href = uri;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        }
    }, [onRegisterExport, currentFrameIndex, frames, scale]); // Added scale dependency

    const handleObjectClick = (objId: string, shiftKey: boolean) => {
        if (currentTool !== 'select') return;
        if (shiftKey) {
            toggleObjectSelection(objId);
        } else {
            setSelectedObject(objId);
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
                <div ref={containerRef} className="absolute inset-0 flex items-center justify-center p-2 md:p-8 overflow-hidden">
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

                    {/* Arena Background - Only visible in 3D mode */}
                    <div
                        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${viewMode === '3d' ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
                            zIndex: -1
                        }}
                    />

                    <div
                        className={`shadow-2xl rounded-xl overflow-hidden border-[4px] md:border-[10px] border-[#5c2b0c] bg-[#d4a373] relative z-0 transition-all duration-700 ease-in-out ${viewMode === '3d' ? 'scale-75' : ''}`}
                        style={{
                            width: stageSize.width + (window.innerWidth < 768 ? 8 : 20),
                            height: stageSize.height + (window.innerWidth < 768 ? 8 : 20),
                            transform: viewMode === '3d'
                                ? `perspective(1500px) rotateX(${cameraPitch}deg) rotateZ(${cameraRotation}deg) translateY(-20px)`
                                : 'none',
                            transformStyle: 'preserve-3d',
                            boxShadow: viewMode === '3d' ? '0 50px 100px -20px rgba(0,0,0,0.7)' : undefined
                        }}
                    >
                        <Stage
                            width={stageSize.width}
                            height={stageSize.height}
                            scale={{ x: scale, y: scale }}
                            ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            <Layer>
                                <CourtBackground type={courtType} />

                                {currentFrame && currentFrame.annotations.map((ann) => (
                                    ann.type === 'arrow' ? (
                                        <Arrow
                                            key={ann.id}
                                            points={ann.points}
                                            stroke={ann.color}
                                            strokeWidth={ann.strokeWidth}
                                            fill={ann.color}
                                            onClick={() => {
                                                if (currentTool === 'eraser') {
                                                    deleteAnnotation(ann.id);
                                                    toast.success('Annotation deleted');
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentTool === 'eraser') {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'pointer';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) container.style.cursor = 'default';
                                            }}
                                        />
                                    ) : ann.type === 'dashed_arrow' ? (
                                        <Arrow
                                            key={ann.id}
                                            points={ann.points}
                                            stroke={ann.color}
                                            strokeWidth={ann.strokeWidth}
                                            fill={ann.color}
                                            dash={[10, 10]}
                                            onClick={() => {
                                                if (currentTool === 'eraser') {
                                                    deleteAnnotation(ann.id);
                                                    toast.success('Annotation deleted');
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentTool === 'eraser') {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'pointer';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) container.style.cursor = 'default';
                                            }}
                                        />
                                    ) : ann.type === 'freehand' ? (
                                        <Line
                                            key={ann.id}
                                            points={ann.points}
                                            stroke={ann.color}
                                            strokeWidth={ann.strokeWidth}
                                            tension={0.5}
                                            lineCap="round"
                                            lineJoin="round"
                                            onClick={() => {
                                                if (currentTool === 'eraser') {
                                                    deleteAnnotation(ann.id);
                                                    toast.success('Annotation deleted');
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentTool === 'eraser') {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'pointer';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) container.style.cursor = 'default';
                                            }}
                                        />
                                    ) : ann.type === 'dashed_line' ? (
                                        <Line
                                            key={ann.id}
                                            points={ann.points}
                                            stroke={ann.color}
                                            strokeWidth={ann.strokeWidth}
                                            dash={[10, 10]}
                                            onClick={() => {
                                                if (currentTool === 'eraser') {
                                                    deleteAnnotation(ann.id);
                                                    toast.success('Annotation deleted');
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentTool === 'eraser') {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'pointer';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) container.style.cursor = 'default';
                                            }}
                                        />
                                    ) : (
                                        <Line
                                            key={ann.id}
                                            points={ann.points}
                                            stroke={ann.color}
                                            strokeWidth={ann.strokeWidth}
                                            onClick={() => {
                                                if (currentTool === 'eraser') {
                                                    deleteAnnotation(ann.id);
                                                    toast.success('Annotation deleted');
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentTool === 'eraser') {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'pointer';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const container = e.target.getStage()?.container();
                                                if (container) container.style.cursor = 'default';
                                            }}
                                        />
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
                                            } else if (currentTool === 'eraser') {
                                                deleteTextAnnotation(text.id);
                                                toast.success('Text deleted');
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            if (currentTool === 'eraser') {
                                                const container = e.target.getStage()?.container();
                                                if (container) container.style.cursor = 'pointer';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            const container = e.target.getStage()?.container();
                                            if (container) container.style.cursor = 'default';
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
                                    const isSelected = selectedObjectIds.includes(obj.id);

                                    // Calculate position - if ball is attached, use player's position + offset
                                    const displayX = obj.x;
                                    const displayY = obj.y;

                                    return (
                                        <CourtObject
                                            key={obj.id}
                                            obj={obj}
                                            displayX={displayX}
                                            displayY={displayY}
                                            isSelected={isSelected}
                                            isPlaying={isPlaying}
                                            currentTool={currentTool}
                                            onDragEnd={(x, y) => updateObjectPosition(currentFrameIndex, obj.id, x, y)}
                                            onTransformEnd={(rotation, width) => {
                                                updateObjectRotation(obj.id, rotation);
                                                if (width) updateObjectSize(obj.id, width, 40);
                                            }}
                                            onClick={(e) => handleObjectClick(obj.id, e.evt.shiftKey)}
                                            onDblClick={() => handleLabelEdit(obj.id, obj.label)}
                                            setNodeRef={(node) => { if (node) nodeRefs.current[obj.id] = node; }}
                                            viewMode={viewMode}
                                        />
                                    );
                                })}
                            </Layer>
                            <Layer>
                                {selectedObjectIds.length > 0 && selectedObjectIds.some(id => currentFrame?.objects[id]?.type === 'screen') && (
                                    <Transformer
                                        ref={transformerRef}
                                        rotateEnabled={true}
                                        enabledAnchors={['middle-left', 'middle-right']}
                                        boundBoxFunc={(oldBox, newBox) => {
                                            if (newBox.width < 20) {
                                                return oldBox;
                                            }
                                            return newBox;
                                        }}
                                    />
                                )}

                                {/* Selection Rectangle */}
                                {selectionRect && (
                                    <Rect
                                        x={Math.min(selectionRect.x1, selectionRect.x2)}
                                        y={Math.min(selectionRect.y1, selectionRect.y2)}
                                        width={Math.abs(selectionRect.x2 - selectionRect.x1)}
                                        height={Math.abs(selectionRect.y2 - selectionRect.y1)}
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dash={[10, 5]}
                                        fill="rgba(59, 130, 246, 0.1)"
                                    />
                                )}
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
