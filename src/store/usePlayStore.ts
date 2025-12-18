import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayState, Frame, SavedPlay, PlayObject } from '../types';
import { formationPresets } from '../data/presets';

// Extend PlayState interface locally if not updated in types.ts yet, or assume it will be updated.
// Actually, I should update types.ts first to be safe, but I can't see it right now.
// Let's check types.ts first.


const generateId = () => Math.random().toString(36).substr(2, 9);

const createInitialFrame = (): Frame => ({
    id: generateId(),
    objects: {},
    annotations: [],
    shapes: [],
    textAnnotations: [],
    duration: 500,
});

export const usePlayStore = create<PlayState>()(
    persist(
        (set, get) => ({
            frames: [createInitialFrame()],
            currentFrameIndex: 0,
            isPlaying: false,
            playbackSpeed: 500,
            currentTool: 'select',
            playName: 'Untitled Play',
            selectedObjectIds: [],
            annotationColor: '#ffffff',
            annotationStrokeWidth: 2,
            shapeFillOpacity: 0.3,
            textFontSize: 16,
            history: [],
            historyIndex: -1,
            savedPlays: [],
            currentPlayId: null,
            currentPlayCategory: 'Other',
            currentPlayTags: [],
            availableTags: ['Pick and Roll', 'Zone Offense', 'Man Defense', 'Fast Break', 'Inbound', 'Press Break'],
            frameThumbnails: {},
            showWelcome: true,
            isLooping: false,
            courtType: 'full',
            rosters: [],
            copiedObject: null,
            showShortcuts: false,
            autoSaveEnabled: true,
            lastAutoSave: 0,
            viewMode: '2d',
            cameraRotation: 0,
            cameraPitch: 60,

            setShowWelcome: (show: boolean) => set({ showWelcome: show }),
            setViewMode: (mode: '2d' | '3d') => set({ viewMode: mode }),
            setCameraRotation: (rotation: number) => set({ cameraRotation: rotation }),
            setCameraPitch: (pitch: number) => set({ cameraPitch: pitch }),
            setFrames: (frames: Frame[]) => set({ frames }),

            saveHistory: () => {
                const state = get();
                const newHistory = state.history.slice(0, state.historyIndex + 1);
                newHistory.push({
                    frames: JSON.parse(JSON.stringify(state.frames)),
                    currentFrameIndex: state.currentFrameIndex,
                });
                if (newHistory.length > 50) newHistory.shift();
                set({ history: newHistory, historyIndex: newHistory.length - 1 });
            },

            undo: () => {
                const state = get();
                if (state.historyIndex > 0) {
                    const prevState = state.history[state.historyIndex - 1];
                    set({
                        frames: JSON.parse(JSON.stringify(prevState.frames)),
                        currentFrameIndex: prevState.currentFrameIndex,
                        historyIndex: state.historyIndex - 1,
                    });
                }
            },

            redo: () => {
                const state = get();
                if (state.historyIndex < state.history.length - 1) {
                    const nextState = state.history[state.historyIndex + 1];
                    set({
                        frames: JSON.parse(JSON.stringify(nextState.frames)),
                        currentFrameIndex: nextState.currentFrameIndex,
                        historyIndex: state.historyIndex + 1,
                    });
                }
            },

            savePlay: () => {
                const state = get();
                const now = Date.now();
                const playToSave: SavedPlay = {
                    id: state.currentPlayId || generateId(),
                    name: state.playName,
                    frames: JSON.parse(JSON.stringify(state.frames)),
                    category: state.currentPlayCategory,
                    tags: state.currentPlayTags,
                    createdAt: state.currentPlayId
                        ? state.savedPlays.find(p => p.id === state.currentPlayId)?.createdAt || now
                        : now,
                    updatedAt: now,
                };

                const existingIndex = state.savedPlays.findIndex(p => p.id === playToSave.id);
                const newSavedPlays = [...state.savedPlays];

                if (existingIndex >= 0) {
                    newSavedPlays[existingIndex] = playToSave;
                } else {
                    newSavedPlays.push(playToSave);
                }

                set({
                    savedPlays: newSavedPlays,
                    currentPlayId: playToSave.id,
                });
            },

            loadPlay: (playId) => {
                const state = get();
                const play = state.savedPlays.find(p => p.id === playId);
                if (play) {
                    set({
                        frames: JSON.parse(JSON.stringify(play.frames)),
                        currentFrameIndex: 0,
                        playName: play.name,
                        currentPlayId: play.id,
                        currentPlayCategory: play.category,
                        currentPlayTags: play.tags,
                        isPlaying: false,
                        selectedObjectIds: [],
                        history: [],
                        historyIndex: -1,
                    });
                }
            },

            deletePlay: (playId) => {
                const state = get();
                set({
                    savedPlays: state.savedPlays.filter(p => p.id !== playId),
                    currentPlayId: state.currentPlayId === playId ? null : state.currentPlayId,
                });
            },

            createNewPlay: () => {
                set({
                    frames: [createInitialFrame()],
                    currentFrameIndex: 0,
                    playName: 'Untitled Play',
                    currentPlayId: null,
                    currentPlayCategory: 'Other',
                    currentPlayTags: [],
                    isPlaying: false,
                    selectedObjectIds: [],
                    history: [],
                    historyIndex: -1,
                });
            },

            setTool: (tool) => set({ currentTool: tool }),
            setPlayName: (name) => set({ playName: name }),
            setSelectedObject: (objectId) => set({ selectedObjectIds: objectId ? [objectId] : [] }),
            setAnnotationColor: (color) => set({ annotationColor: color }),
            setAnnotationStrokeWidth: (width) => set({ annotationStrokeWidth: width }),
            setShapeFillOpacity: (opacity) => set({ shapeFillOpacity: opacity }),
            setTextFontSize: (size) => set({ textFontSize: size }),

            setFrameDuration: (index, duration) => {
                set((state) => {
                    const newFrames = [...state.frames];
                    if (newFrames[index]) {
                        newFrames[index] = { ...newFrames[index], duration };
                    }
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            addFrame: () => {
                set((state) => {
                    const currentFrame = state.frames[state.currentFrameIndex];
                    const newFrame: Frame = {
                        id: generateId(),
                        objects: JSON.parse(JSON.stringify(currentFrame.objects)),
                        annotations: [],
                        shapes: [],
                        textAnnotations: [],
                        duration: 500,
                    };
                    const newFrames = [...state.frames];
                    newFrames.splice(state.currentFrameIndex + 1, 0, newFrame);
                    return {
                        frames: newFrames,
                        currentFrameIndex: state.currentFrameIndex + 1,
                    };
                });
                get().saveHistory();
            },

            deleteFrame: (index) => {
                set((state) => {
                    if (state.frames.length <= 1) return state;
                    const newFrames = state.frames.filter((_, i) => i !== index);
                    const newIndex = index >= newFrames.length ? newFrames.length - 1 : index;
                    return {
                        frames: newFrames,
                        currentFrameIndex: newIndex,
                    };
                });
                get().saveHistory();
            },

            duplicateFrame: (index) => {
                set((state) => {
                    const frameToCopy = state.frames[index];
                    const newFrame: Frame = {
                        ...JSON.parse(JSON.stringify(frameToCopy)),
                        id: generateId(),
                    };
                    const newFrames = [...state.frames];
                    newFrames.splice(index + 1, 0, newFrame);
                    return {
                        frames: newFrames,
                        currentFrameIndex: index + 1,
                    };
                });
                get().saveHistory();
            },

            setCurrentFrame: (index) => {
                set({ currentFrameIndex: index });
            },

            updateObjectPosition: (frameIndex, objectId, x, y) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        // Update current frame and all subsequent frames
                        if (index >= frameIndex && frame.objects[objectId]) {
                            return {
                                ...frame,
                                objects: {
                                    ...frame.objects,
                                    [objectId]: {
                                        ...frame.objects[objectId],
                                        x,
                                        y,
                                    },
                                },
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            updateObjectLabel: (objectId, label) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => ({
                        ...frame,
                        objects: {
                            ...frame.objects,
                            [objectId]: frame.objects[objectId] ? {
                                ...frame.objects[objectId],
                                label,
                            } : frame.objects[objectId],
                        },
                    }));
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            updateObjectColor: (objectId, color) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => ({
                        ...frame,
                        objects: {
                            ...frame.objects,
                            [objectId]: frame.objects[objectId] ? {
                                ...frame.objects[objectId],
                                color,
                            } : frame.objects[objectId],
                        },
                    }));
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            updateObjectRotation: (objectId, rotation) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => ({
                        ...frame,
                        objects: {
                            ...frame.objects,
                            [objectId]: frame.objects[objectId] ? {
                                ...frame.objects[objectId],
                                rotation,
                            } : frame.objects[objectId],
                        },
                    }));
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            updateObjectSize: (objectId, width, height) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => ({
                        ...frame,
                        objects: {
                            ...frame.objects,
                            [objectId]: frame.objects[objectId] ? {
                                ...frame.objects[objectId],
                                width,
                                height,
                            } : frame.objects[objectId],
                        },
                    }));
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            addObject: (object) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => ({
                        ...frame,
                        objects: {
                            ...frame.objects,
                            [object.id]: { ...object },
                        },
                    }));
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            addObjects: (objects) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => {
                        const newObjects = { ...frame.objects };
                        objects.forEach(obj => {
                            newObjects[obj.id] = { ...obj };
                        });
                        return {
                            ...frame,
                            objects: newObjects,
                        };
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            deleteObject: (objectId) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => {
                        const { [objectId]: _unused, ...remainingObjects } = frame.objects;
                        return {
                            ...frame,
                            objects: remainingObjects,
                        };
                    });
                    return {
                        frames: newFrames,
                        selectedObjectIds: state.selectedObjectIds.filter(id => id !== objectId),
                    };
                });
                get().saveHistory();
            },

            addAnnotation: (annotation) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        if (index === state.currentFrameIndex) {
                            return {
                                ...frame,
                                annotations: [...frame.annotations, annotation],
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            deleteAnnotation: (annotationId) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        if (index === state.currentFrameIndex) {
                            return {
                                ...frame,
                                annotations: frame.annotations.filter(a => a.id !== annotationId),
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            addTextAnnotation: (annotation) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        if (index === state.currentFrameIndex) {
                            return {
                                ...frame,
                                textAnnotations: [...frame.textAnnotations, annotation],
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            deleteTextAnnotation: (annotationId) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        if (index === state.currentFrameIndex) {
                            return {
                                ...frame,
                                textAnnotations: frame.textAnnotations.filter(a => a.id !== annotationId),
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            togglePlay: () => {
                set((state) => ({ isPlaying: !state.isPlaying }));
            },

            setPlaybackSpeed: (speed) => {
                set({ playbackSpeed: speed });
            },

            clearCanvas: () => {
                set({
                    frames: [createInitialFrame()],
                    currentFrameIndex: 0,
                    isPlaying: false,
                    selectedObjectIds: [],
                });
                get().saveHistory();
            },

            toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),

            stepForward: () => {
                const state = get();
                if (state.currentFrameIndex < state.frames.length - 1) {
                    set({ currentFrameIndex: state.currentFrameIndex + 1, isPlaying: false });
                } else if (state.isLooping) {
                    set({ currentFrameIndex: 0, isPlaying: false });
                }
            },

            stepBackward: () => {
                const state = get();
                if (state.currentFrameIndex > 0) {
                    set({ currentFrameIndex: state.currentFrameIndex - 1, isPlaying: false });
                } else if (state.isLooping) {
                    set({ currentFrameIndex: state.frames.length - 1, isPlaying: false });
                }
            },

            setCourtType: (type) => set({ courtType: type }),

            addRoster: (roster) => set((state) => ({ rosters: [...state.rosters, roster] })),
            deleteRoster: (rosterId) => set((state) => ({ rosters: state.rosters.filter(r => r.id !== rosterId) })),
            addPlayerToRoster: (rosterId, player) => set((state) => ({
                rosters: state.rosters.map(r => r.id === rosterId ? { ...r, players: [...r.players, player] } : r)
            })),
            removePlayerFromRoster: (rosterId, playerId) => set((state) => ({
                rosters: state.rosters.map(r => r.id === rosterId ? { ...r, players: r.players.filter(p => p.id !== playerId) } : r)
            })),

            // Formation Preset Actions
            applyFormationPreset: (presetId) => {
                const preset = formationPresets.find((p) => p.id === presetId);

                if (!preset) return;

                set((state) => {
                    const newFrames = [...state.frames];
                    const currentFrame = newFrames[state.currentFrameIndex];

                    if (!currentFrame) return state;

                    // Create new objects from preset
                    const newObjects: Record<string, PlayObject> = {};

                    preset.objects.forEach((presetObj) => {
                        const id = Math.random().toString(36).substr(2, 9);
                        newObjects[id] = {
                            id,
                            type: presetObj.type,
                            x: presetObj.x,
                            y: presetObj.y,
                            label: presetObj.label,
                            color: presetObj.type === 'player_offense' ? '#ea580c' : '#2563eb',
                        };
                    });

                    // Replace current frame objects with preset objects
                    newFrames[state.currentFrameIndex] = {
                        ...currentFrame,
                        objects: newObjects,
                    };

                    return { frames: newFrames };
                });

                get().saveHistory();
            },

            // Clipboard Actions
            copyObject: (objectId) => {
                const state = get();
                const currentFrame = state.frames[state.currentFrameIndex];
                const objectToCopy = currentFrame?.objects[objectId];
                if (objectToCopy) {
                    set({ copiedObject: JSON.parse(JSON.stringify(objectToCopy)) });
                }
            },

            pasteObject: () => {
                const state = get();
                if (state.copiedObject) {
                    const newObject = {
                        ...JSON.parse(JSON.stringify(state.copiedObject)),
                        id: generateId(),
                        x: state.copiedObject.x + 30,
                        y: state.copiedObject.y + 30,
                    };
                    get().addObject(newObject);
                    set({ selectedObjectIds: [newObject.id] });
                }
            },

            // Multi-select Actions
            selectMultipleObjects: (objectIds) => set({ selectedObjectIds: objectIds }),

            toggleObjectSelection: (objectId) => {
                const state = get();
                const isSelected = state.selectedObjectIds.includes(objectId);
                if (isSelected) {
                    set({ selectedObjectIds: state.selectedObjectIds.filter(id => id !== objectId) });
                } else {
                    set({ selectedObjectIds: [...state.selectedObjectIds, objectId] });
                }
            },

            clearSelection: () => set({ selectedObjectIds: [] }),

            selectAllObjects: () => {
                const state = get();
                const currentFrame = state.frames[state.currentFrameIndex];
                if (currentFrame) {
                    const allObjectIds = Object.keys(currentFrame.objects);
                    set({ selectedObjectIds: allObjectIds });
                }
            },

            deleteSelectedObjects: () => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => {
                        const newObjects = { ...frame.objects };
                        state.selectedObjectIds.forEach(id => {
                            delete newObjects[id];
                        });
                        return {
                            ...frame,
                            objects: newObjects,
                        };
                    });
                    return {
                        frames: newFrames,
                        selectedObjectIds: [],
                    };
                });
                get().saveHistory();
            },

            alignObjects: (alignment) => {
                const state = get();
                const currentFrame = state.frames[state.currentFrameIndex];
                if (!currentFrame || state.selectedObjectIds.length < 2) return;

                const selectedObjects = state.selectedObjectIds
                    .map(id => currentFrame.objects[id])
                    .filter(Boolean);

                if (selectedObjects.length < 2) return;

                let targetValue: number;

                switch (alignment) {
                    case 'left':
                        targetValue = Math.min(...selectedObjects.map(obj => obj.x));
                        selectedObjects.forEach(obj => {
                            get().updateObjectPosition(state.currentFrameIndex, obj.id, targetValue, obj.y);
                        });
                        break;
                    case 'right':
                        targetValue = Math.max(...selectedObjects.map(obj => obj.x));
                        selectedObjects.forEach(obj => {
                            get().updateObjectPosition(state.currentFrameIndex, obj.id, targetValue, obj.y);
                        });
                        break;
                    case 'top':
                        targetValue = Math.min(...selectedObjects.map(obj => obj.y));
                        selectedObjects.forEach(obj => {
                            get().updateObjectPosition(state.currentFrameIndex, obj.id, obj.x, targetValue);
                        });
                        break;
                    case 'bottom':
                        targetValue = Math.max(...selectedObjects.map(obj => obj.y));
                        selectedObjects.forEach(obj => {
                            get().updateObjectPosition(state.currentFrameIndex, obj.id, obj.x, targetValue);
                        });
                        break;
                    case 'center-h':
                        const avgX = selectedObjects.reduce((sum, obj) => sum + obj.x, 0) / selectedObjects.length;
                        selectedObjects.forEach(obj => {
                            get().updateObjectPosition(state.currentFrameIndex, obj.id, avgX, obj.y);
                        });
                        break;
                    case 'center-v':
                        const avgY = selectedObjects.reduce((sum, obj) => sum + obj.y, 0) / selectedObjects.length;
                        selectedObjects.forEach(obj => {
                            get().updateObjectPosition(state.currentFrameIndex, obj.id, obj.x, avgY);
                        });
                        break;
                }
            },

            distributeObjects: (direction) => {
                const state = get();
                const currentFrame = state.frames[state.currentFrameIndex];
                if (!currentFrame || state.selectedObjectIds.length < 3) return;

                const selectedObjects = state.selectedObjectIds
                    .map(id => currentFrame.objects[id])
                    .filter(Boolean);

                if (selectedObjects.length < 3) return;

                if (direction === 'horizontal') {
                    const sorted = [...selectedObjects].sort((a, b) => a.x - b.x);
                    const minX = sorted[0].x;
                    const maxX = sorted[sorted.length - 1].x;
                    const spacing = (maxX - minX) / (sorted.length - 1);

                    sorted.forEach((obj, index) => {
                        const newX = minX + (spacing * index);
                        get().updateObjectPosition(state.currentFrameIndex, obj.id, newX, obj.y);
                    });
                } else {
                    const sorted = [...selectedObjects].sort((a, b) => a.y - b.y);
                    const minY = sorted[0].y;
                    const maxY = sorted[sorted.length - 1].y;
                    const spacing = (maxY - minY) / (sorted.length - 1);

                    sorted.forEach((obj, index) => {
                        const newY = minY + (spacing * index);
                        get().updateObjectPosition(state.currentFrameIndex, obj.id, obj.x, newY);
                    });
                }
            },

            // Shape Actions
            addShape: (shape) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        if (index === state.currentFrameIndex) {
                            return {
                                ...frame,
                                shapes: [...frame.shapes, shape],
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            deleteShape: (shapeId) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        if (index === state.currentFrameIndex) {
                            return {
                                ...frame,
                                shapes: frame.shapes.filter(s => s.id !== shapeId),
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            updateShapeProperties: (shapeId, props) => {
                set((state) => {
                    const newFrames = state.frames.map((frame, index) => {
                        if (index === state.currentFrameIndex) {
                            return {
                                ...frame,
                                shapes: frame.shapes.map(s =>
                                    s.id === shapeId ? { ...s, ...props } : s
                                ),
                            };
                        }
                        return frame;
                    });
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            // Tag & Category Actions
            setPlayCategory: (category) => set({ currentPlayCategory: category }),

            setPlayTags: (tags) => set({ currentPlayTags: tags }),

            addCustomTag: (tag) => {
                const state = get();
                if (!state.availableTags.includes(tag)) {
                    set({ availableTags: [...state.availableTags, tag] });
                }
            },

            updatePlayMetadata: (playId, category, tags) => {
                set((state) => {
                    const newSavedPlays = state.savedPlays.map(play =>
                        play.id === playId
                            ? { ...play, category, tags, updatedAt: Date.now() }
                            : play
                    );
                    return { savedPlays: newSavedPlays };
                });
            },

            // Thumbnail Actions
            setFrameThumbnail: (frameId, dataUrl) => {
                set((state) => ({
                    frameThumbnails: {
                        ...state.frameThumbnails,
                        [frameId]: dataUrl,
                    },
                }));
            },

            clearThumbnailCache: () => set({ frameThumbnails: {} }),

            // Auto-save Actions
            setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),

            triggerAutoSave: () => {
                const state = get();
                if (state.autoSaveEnabled && state.currentPlayId) {
                    get().savePlay();
                    set({ lastAutoSave: Date.now() });
                }
            },

            toggleShortcuts: () => set((state) => ({ showShortcuts: !state.showShortcuts })),
        }),
        {
            name: 'playchalk-storage',
            version: 1,
            migrate: (persistedState: any, version: number) => {
                // Migrate from old state format
                if (version === 0 || !persistedState.selectedObjectIds) {
                    return {
                        ...persistedState,
                        selectedObjectIds: [],
                        shapeFillOpacity: persistedState.shapeFillOpacity ?? 0.3,
                        currentPlayCategory: persistedState.currentPlayCategory ?? 'Other',
                        currentPlayTags: persistedState.currentPlayTags ?? [],
                        availableTags: persistedState.availableTags ?? ['Pick and Roll', 'Zone Offense', 'Man Defense', 'Fast Break', 'Inbound', 'Press Break'],
                        frameThumbnails: {},
                        autoSaveEnabled: persistedState.autoSaveEnabled ?? true,
                        lastAutoSave: 0,
                        // Migrate frames to include shapes array
                        frames: persistedState.frames?.map((frame: any) => ({
                            ...frame,
                            shapes: frame.shapes ?? []
                        })) ?? [createInitialFrame()],
                        // Migrate saved plays to include category and tags
                        savedPlays: persistedState.savedPlays?.map((play: any) => ({
                            ...play,
                            category: play.category ?? 'Other',
                            tags: play.tags ?? []
                        })) ?? []
                    };
                }
                return persistedState;
            },
            partialize: (state) => ({
                frames: state.frames,
                currentFrameIndex: state.currentFrameIndex,
                playName: state.playName,
                annotationColor: state.annotationColor,
                annotationStrokeWidth: state.annotationStrokeWidth,
                shapeFillOpacity: state.shapeFillOpacity,
                textFontSize: state.textFontSize,
                savedPlays: state.savedPlays,
                currentPlayId: state.currentPlayId,
                currentPlayCategory: state.currentPlayCategory,
                currentPlayTags: state.currentPlayTags,
                availableTags: state.availableTags,
                showWelcome: state.showWelcome,
                courtType: state.courtType,
                rosters: state.rosters,
                autoSaveEnabled: state.autoSaveEnabled,
            }),
        }
    )
);
