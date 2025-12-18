export type PlayerType = 'player_offense' | 'player_defense' | 'ball' | 'screen' | 'cone';

export interface PlayObject {
    id: string;
    type: PlayerType;
    x: number;
    y: number;
    label?: string;
    color?: string;
    rotation?: number;
    width?: number;
    height?: number;
}

export interface DrawingObject {
    id: string;
    type: 'line' | 'arrow' | 'freehand' | 'dashed_line' | 'dashed_arrow' | 'curved_arrow';
    points: number[];
    color: string;
    strokeWidth: number;
    dash?: number[];
}

export interface ShapeObject {
    id: string;
    type: 'rectangle' | 'circle' | 'ellipse';
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    fillOpacity: number;
    stroke: string;
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
    shapes: ShapeObject[];
    textAnnotations: TextAnnotation[];
    duration?: number;
}

export type ToolType = 'select' | 'line' | 'arrow' | 'freehand' | 'text' | 'eraser' | 'dashed_line' | 'dashed_arrow' | 'curved_arrow' | 'rectangle' | 'circle';

export type AlignmentType = 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v';
export type DistributionType = 'horizontal' | 'vertical';

export interface HistoryState {
    frames: Frame[];
    currentFrameIndex: number;
}

export interface SavedPlay {
    id: string;
    name: string;
    frames: Frame[];
    category: string;
    tags: string[];
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
    selectedObjectIds: string[];
    annotationColor: string;
    annotationStrokeWidth: number;
    shapeFillOpacity: number;
    textFontSize: number;
    history: HistoryState[];
    historyIndex: number;
    savedPlays: SavedPlay[];
    currentPlayId: string | null;
    currentPlayCategory: string;
    currentPlayTags: string[];
    availableTags: string[];
    frameThumbnails: Record<string, string>;
    showWelcome: boolean;
    isLooping: boolean;
    courtType: 'full' | 'half';
    rosters: Roster[];
    copiedObject: PlayObject | null;
    showShortcuts: boolean;
    autoSaveEnabled: boolean;
    lastAutoSave: number;
    viewMode: '2d' | '3d';
    cameraRotation: number;
    cameraPitch: number;

    // Actions
    setViewMode: (mode: '2d' | '3d') => void;
    setCameraRotation: (rotation: number) => void;
    setCameraPitch: (pitch: number) => void;
    setFrames: (frames: Frame[]) => void;
    addFrame: () => void;
    deleteFrame: (index: number) => void;
    duplicateFrame: (index: number) => void;
    setCurrentFrame: (index: number) => void;
    setFrameDuration: (index: number, duration: number) => void;
    updateObjectPosition: (frameIndex: number, objectId: string, x: number, y: number) => void;
    updateObjectLabel: (objectId: string, label: string) => void;
    updateObjectColor: (objectId: string, color: string) => void;
    updateObjectRotation: (objectId: string, rotation: number) => void;
    updateObjectSize: (objectId: string, width: number, height: number) => void;
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
    setShapeFillOpacity: (opacity: number) => void;
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

    // Multi-select Actions
    selectMultipleObjects: (objectIds: string[]) => void;
    toggleObjectSelection: (objectId: string) => void;
    clearSelection: () => void;
    selectAllObjects: () => void;
    deleteSelectedObjects: () => void;
    alignObjects: (alignment: AlignmentType) => void;
    distributeObjects: (direction: DistributionType) => void;

    // Shape Actions
    addShape: (shape: ShapeObject) => void;
    deleteShape: (shapeId: string) => void;
    updateShapeProperties: (shapeId: string, props: Partial<ShapeObject>) => void;

    // Tag & Category Actions
    setPlayCategory: (category: string) => void;
    setPlayTags: (tags: string[]) => void;
    addCustomTag: (tag: string) => void;
    updatePlayMetadata: (playId: string, category: string, tags: string[]) => void;

    // Thumbnail Actions
    setFrameThumbnail: (frameId: string, dataUrl: string) => void;
    clearThumbnailCache: () => void;

    // Roster Actions
    addRoster: (roster: Roster) => void;
    deleteRoster: (rosterId: string) => void;
    addPlayerToRoster: (rosterId: string, player: RosterPlayer) => void;
    removePlayerFromRoster: (rosterId: string, playerId: string) => void;

    // Formation Preset Actions
    applyFormationPreset: (presetId: string) => void;

    // Clipboard Actions
    copyObject: (objectId: string) => void;
    pasteObject: () => void;
    toggleShortcuts: () => void;

    // Auto-save Actions
    setAutoSaveEnabled: (enabled: boolean) => void;
    triggerAutoSave: () => void;
}
