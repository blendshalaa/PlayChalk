export type PlayerType = 'player_offense' | 'player_defense' | 'ball' | 'screen' | 'cone';

export interface PlayObject {
    id: string;
    type: PlayerType;
    x: number;
    y: number;
    label?: string;
    color?: string;
}

export interface DrawingObject {
    id: string;
    type: 'line' | 'arrow' | 'freehand';
    points: number[];
    color: string;
    strokeWidth: number;
}

export interface TextAnnotation {
    id: string;
    type: 'text';
    x: number;
    y: number;
    text: string;
    color: string;
    fontSize: number;
}

export interface Frame {
    id: string;
    objects: Record<string, PlayObject>;
    annotations: DrawingObject[];
    textAnnotations: TextAnnotation[];
    duration?: number;
}

export type ToolType = 'select' | 'line' | 'arrow' | 'freehand' | 'text';

export interface HistoryState {
    frames: Frame[];
    currentFrameIndex: number;
}

export interface SavedPlay {
    id: string;
    name: string;
    frames: Frame[];
    createdAt: number;
    updatedAt: number;
}

export interface RosterPlayer {
    id: string;
    name: string;
    number: string;
    position?: string;
}

export interface Roster {
    id: string;
    name: string;
    color: string;
    players: RosterPlayer[];
}

export interface PlayState {
    frames: Frame[];
    currentFrameIndex: number;
    isPlaying: boolean;
    playbackSpeed: number;
    currentTool: ToolType;
    playName: string;
    selectedObjectId: string | null;
    annotationColor: string;
    annotationStrokeWidth: number;
    textFontSize: number;
    history: HistoryState[];
    historyIndex: number;
    savedPlays: SavedPlay[];
    currentPlayId: string | null;
    showWelcome: boolean;
    isLooping: boolean;
    courtType: 'full' | 'half';
    rosters: Roster[];

    // Actions
    addFrame: () => void;
    deleteFrame: (index: number) => void;
    duplicateFrame: (index: number) => void;
    setCurrentFrame: (index: number) => void;
    setFrameDuration: (index: number, duration: number) => void;
    updateObjectPosition: (frameIndex: number, objectId: string, x: number, y: number) => void;
    updateObjectLabel: (objectId: string, label: string) => void;
    updateObjectColor: (objectId: string, color: string) => void;
    addObject: (object: PlayObject) => void;
    addObjects: (objects: PlayObject[]) => void;
    deleteObject: (objectId: string) => void;
    addAnnotation: (annotation: DrawingObject) => void;
    deleteAnnotation: (annotationId: string) => void;
    addTextAnnotation: (annotation: TextAnnotation) => void;
    deleteTextAnnotation: (annotationId: string) => void;
    togglePlay: () => void;
    setPlaybackSpeed: (speed: number) => void;
    setTool: (tool: ToolType) => void;
    setPlayName: (name: string) => void;
    setSelectedObject: (objectId: string | null) => void;
    setAnnotationColor: (color: string) => void;
    setAnnotationStrokeWidth: (width: number) => void;
    setTextFontSize: (size: number) => void;
    clearCanvas: () => void;
    undo: () => void;
    redo: () => void;
    saveHistory: () => void;
    savePlay: () => void;
    loadPlay: (playId: string) => void;
    deletePlay: (playId: string) => void;
    createNewPlay: () => void;
    setShowWelcome: (show: boolean) => void;
    toggleLoop: () => void;
    stepForward: () => void;
    stepBackward: () => void;
    setCourtType: (type: 'full' | 'half') => void;

    // Roster Actions
    addRoster: (roster: Roster) => void;
    deleteRoster: (rosterId: string) => void;
    addPlayerToRoster: (rosterId: string, player: RosterPlayer) => void;
    removePlayerFromRoster: (rosterId: string, playerId: string) => void;
}
