import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayState, Frame, SavedPlay } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createInitialFrame = (): Frame => ({
    id: generateId(),
    objects: {},
    annotations: [],
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
            selectedObjectId: null,
            annotationColor: '#ffffff',
            annotationStrokeWidth: 2,
            textFontSize: 16,
            history: [],
            historyIndex: -1,
            savedPlays: [],
            currentPlayId: null,
            showWelcome: true,

            setShowWelcome: (show) => set({ showWelcome: show }),

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
                        isPlaying: false,
                        selectedObjectId: null,
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
                    isPlaying: false,
                    selectedObjectId: null,
                    history: [],
                    historyIndex: -1,
                });
            },

            setTool: (tool) => set({ currentTool: tool }),
            setPlayName: (name) => set({ playName: name }),
            setSelectedObject: (objectId) => set({ selectedObjectId: objectId }),
            setAnnotationColor: (color) => set({ annotationColor: color }),
            setAnnotationStrokeWidth: (width) => set({ annotationStrokeWidth: width }),
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
                    const newFrames = [...state.frames];
                    const frame = newFrames[frameIndex];
                    if (frame && frame.objects[objectId]) {
                        frame.objects[objectId] = {
                            ...frame.objects[objectId],
                            x,
                            y,
                        };
                    }
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

            deleteObject: (objectId) => {
                set((state) => {
                    const newFrames = state.frames.map((frame) => {
                        const { [objectId]: _, ...remainingObjects } = frame.objects;
                        return {
                            ...frame,
                            objects: remainingObjects,
                        };
                    });
                    return {
                        frames: newFrames,
                        selectedObjectId: state.selectedObjectId === objectId ? null : state.selectedObjectId,
                    };
                });
                get().saveHistory();
            },

            addAnnotation: (annotation) => {
                set((state) => {
                    const newFrames = [...state.frames];
                    const frame = newFrames[state.currentFrameIndex];
                    if (frame) {
                        frame.annotations = [...frame.annotations, annotation];
                    }
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            deleteAnnotation: (annotationId) => {
                set((state) => {
                    const newFrames = [...state.frames];
                    const frame = newFrames[state.currentFrameIndex];
                    if (frame) {
                        frame.annotations = frame.annotations.filter(a => a.id !== annotationId);
                    }
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            addTextAnnotation: (annotation) => {
                set((state) => {
                    const newFrames = [...state.frames];
                    const frame = newFrames[state.currentFrameIndex];
                    if (frame) {
                        frame.textAnnotations = [...frame.textAnnotations, annotation];
                    }
                    return { frames: newFrames };
                });
                get().saveHistory();
            },

            deleteTextAnnotation: (annotationId) => {
                set((state) => {
                    const newFrames = [...state.frames];
                    const frame = newFrames[state.currentFrameIndex];
                    if (frame) {
                        frame.textAnnotations = frame.textAnnotations.filter(a => a.id !== annotationId);
                    }
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
                    selectedObjectId: null,
                });
                get().saveHistory();
            },
        }),
        {
            name: 'playchalk-storage',
            partialize: (state) => ({
                frames: state.frames,
                currentFrameIndex: state.currentFrameIndex,
                playName: state.playName,
                annotationColor: state.annotationColor,
                annotationStrokeWidth: state.annotationStrokeWidth,
                textFontSize: state.textFontSize,
                savedPlays: state.savedPlays,
                currentPlayId: state.currentPlayId,
                showWelcome: state.showWelcome,
            }),
        }
    )
);
