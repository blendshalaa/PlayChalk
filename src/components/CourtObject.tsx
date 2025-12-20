import React from 'react';
import { Group, Circle as KonvaCircle, Line, Text as KonvaText } from 'react-konva';
import Konva from 'konva';
import type { PlayObject } from '../types';

interface CourtObjectProps {
    obj: PlayObject;
    displayX: number;
    displayY: number;
    isSelected: boolean;
    isPlaying: boolean;
    currentTool: string;
    onDragEnd: (x: number, y: number) => void;
    onTransformEnd: (rotation: number, width?: number) => void;
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    onDblClick: () => void;
    setNodeRef: (node: Konva.Node | null) => void;
}

export const CourtObject = React.memo(({
    obj,
    displayX,
    displayY,
    isSelected,
    isPlaying,
    currentTool,
    onDragEnd,
    onTransformEnd,
    onClick,
    onDblClick,
    setNodeRef,
    viewMode = '2d'
}: CourtObjectProps & { viewMode?: '2d' | '3d' }) => {
    // Helper to render 3D stack
    const render3DToken = (color: string, radius: number) => {
        const layers = 5;
        const layerHeight = 1;
        return (
            <Group>
                {/* Side/Edge Layers */}
                {Array.from({ length: layers }).map((_, i) => (
                    <KonvaCircle
                        key={i}
                        y={-i * layerHeight}
                        radius={radius}
                        fill={color}
                        stroke={color}
                        strokeWidth={1}
                        shadowColor="black"
                        shadowBlur={i === 0 ? 10 : 0}
                        shadowOpacity={i === 0 ? 0.5 : 0}
                    />
                ))}
                {/* Top Face */}
                <KonvaCircle
                    y={-layers * layerHeight}
                    radius={radius}
                    fillRadialGradientStartPoint={{ x: -3, y: -3 }}
                    fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                    fillRadialGradientStartRadius={0}
                    fillRadialGradientEndRadius={radius}
                    fillRadialGradientColorStops={[
                        0, 'rgba(255, 255, 255, 0.9)',
                        0.3, color,
                        1, color
                    ]}
                    stroke={color}
                    strokeWidth={1}
                />
            </Group>
        );
    };

    return (
        <Group
            x={displayX}
            y={displayY}
            rotation={obj.rotation || 0}
            draggable={!isPlaying && currentTool === 'select'}
            ref={setNodeRef}
            onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
            // ... existing event handlers ...
            onTransformEnd={(e) => {
                const node = e.target;

                // Reset scale
                node.scaleX(1);
                node.scaleY(1);

                onTransformEnd(node.rotation());
            }}
            onClick={onClick}
            onDblClick={onDblClick}
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
            {/* Selection glow with pulse animation */}
            {isSelected && (
                <>
                    <KonvaCircle
                        radius={28}
                        fill="rgba(249, 115, 22, 0.15)"
                        opacity={0.8}
                    />
                    <KonvaCircle
                        radius={24}
                        stroke="#f97316"
                        strokeWidth={3}
                        dash={[8, 4]}
                        shadowColor="#f97316"
                        shadowBlur={15}
                        shadowOpacity={0.6}
                    />
                </>
            )}

            {/* Render different object types */}
            {obj.type === 'player_offense' && (
                <>
                    {viewMode === '3d' ? (
                        <>
                            {render3DToken(obj.color || '#ea580c', 10)}
                            {/* Number label on top of token */}
                            {obj.label && (
                                <KonvaText
                                    y={-6} // Lift label up
                                    text={obj.label}
                                    fontSize={10}
                                    fontStyle="bold"
                                    fill="white"
                                    align="center"
                                    verticalAlign="middle"
                                    offsetX={5}
                                    offsetY={5}
                                    width={10}
                                    height={10}
                                    shadowColor="black"
                                    shadowBlur={2}
                                    shadowOpacity={0.8}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {/* Player circle with 3D gradient effect */}
                            <KonvaCircle
                                radius={10}
                                fillRadialGradientStartPoint={{ x: -3, y: -3 }}
                                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                                fillRadialGradientStartRadius={0}
                                fillRadialGradientEndRadius={10}
                                fillRadialGradientColorStops={[
                                    0, 'rgba(255, 255, 255, 0.9)',
                                    0.3, obj.color || '#ea580c',
                                    1, obj.color || '#ea580c'
                                ]}
                                stroke={obj.color || "#ea580c"}
                                strokeWidth={2}
                                shadowColor="rgba(0, 0, 0, 0.5)"
                                shadowBlur={6}
                                shadowOffset={{ x: 1, y: 1 }}
                                shadowOpacity={0.5}
                            />
                            {/* Inner highlight for depth */}
                            <KonvaCircle
                                radius={8}
                                stroke="rgba(255, 255, 255, 0.3)"
                                strokeWidth={1.5}
                            />
                            {/* Number label */}
                            {obj.label && (
                                <>
                                    {/* Label background for contrast */}
                                    <KonvaCircle
                                        radius={6}
                                        fill="rgba(0, 0, 0, 0.2)"
                                    />
                                    <KonvaText
                                        text={obj.label}
                                        fontSize={10}
                                        fontStyle="bold"
                                        fill="white"
                                        align="center"
                                        verticalAlign="middle"
                                        offsetX={5}
                                        offsetY={5}
                                        width={10}
                                        height={10}
                                        shadowColor="black"
                                        shadowBlur={2}
                                        shadowOpacity={0.8}
                                    />
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            {obj.type === 'player_defense' && (
                <>
                    {/* Defense X with gradient and glow */}
                    <Line
                        points={[-8, -8, 8, 8]}
                        stroke={obj.color || "#2563eb"}
                        strokeWidth={4}
                        shadowColor="rgba(0, 0, 0, 0.5)"
                        shadowBlur={6}
                        shadowOffset={{ x: 1, y: 1 }}
                        shadowOpacity={0.5}
                        lineCap="round"
                    />
                    <Line
                        points={[8, -8, -8, 8]}
                        stroke={obj.color || "#2563eb"}
                        strokeWidth={4}
                        shadowColor="rgba(0, 0, 0, 0.5)"
                        shadowBlur={6}
                        shadowOffset={{ x: 1, y: 1 }}
                        shadowOpacity={0.5}
                        lineCap="round"
                    />
                    {/* Inner highlight */}
                    <Line
                        points={[-6, -6, 6, 6]}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth={1.5}
                        lineCap="round"
                    />
                    <Line
                        points={[6, -6, -6, 6]}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth={1.5}
                        lineCap="round"
                    />
                </>
            )}

            {obj.type === 'ball' && (
                <>
                    {/* Basketball with realistic gradient and seams */}
                    <KonvaCircle
                        radius={7}
                        fillRadialGradientStartPoint={{ x: -2, y: -2 }}
                        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                        fillRadialGradientStartRadius={0}
                        fillRadialGradientEndRadius={7}
                        fillRadialGradientColorStops={[
                            0, '#ff9d5c',
                            0.5, '#f97316',
                            1, '#c2410c'
                        ]}
                        shadowColor="rgba(0, 0, 0, 0.6)"
                        shadowBlur={6}
                        shadowOffset={{ x: 1, y: 2 }}
                        shadowOpacity={0.6}
                    />
                    {/* Basketball seam lines */}
                    <Line
                        points={[-4, 0, -2, -3, 0, -4, 2, -3, 4, 0]}
                        stroke="rgba(0, 0, 0, 0.3)"
                        strokeWidth={1}
                        tension={0.3}
                        lineCap="round"
                    />
                    <Line
                        points={[-4, 0, -2, 3, 0, 4, 2, 3, 4, 0]}
                        stroke="rgba(0, 0, 0, 0.3)"
                        strokeWidth={1}
                        tension={0.3}
                        lineCap="round"
                    />
                    {/* Highlight for shine */}
                    <KonvaCircle
                        x={-2}
                        y={-2}
                        radius={2}
                        fill="rgba(255, 255, 255, 0.4)"
                    />
                </>
            )}


        </Group>
    );
});
