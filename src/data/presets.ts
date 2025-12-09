import type { PlayerType } from '../types';

export interface PresetObject {
    type: PlayerType;
    x: number;
    y: number;
    label?: string;
}

export interface FormationPreset {
    id: string;
    name: string;
    category: 'offense' | 'defense';
    description: string;
    objects: PresetObject[];
}

// Court center is approximately at (400, 300)
// Court dimensions: ~800x600

export const formationPresets: FormationPreset[] = [
    // OFFENSE FORMATIONS
    {
        id: 'offense-1-4-high',
        name: '1-4 High',
        category: 'offense',
        description: 'Point guard at top, 4 players across high post',
        objects: [
            { type: 'player_offense', x: 400, y: 150, label: '1' }, // Point guard at top
            { type: 'player_offense', x: 250, y: 250, label: '2' }, // Left wing
            { type: 'player_offense', x: 350, y: 250, label: '3' }, // Left high post
            { type: 'player_offense', x: 450, y: 250, label: '4' }, // Right high post
            { type: 'player_offense', x: 550, y: 250, label: '5' }, // Right wing
        ],
    },
    {
        id: 'offense-2-3-set',
        name: '2-3 Set',
        category: 'offense',
        description: '2 guards at top, 3 forwards/centers below',
        objects: [
            { type: 'player_offense', x: 350, y: 150, label: '1' }, // Left guard
            { type: 'player_offense', x: 450, y: 150, label: '2' }, // Right guard
            { type: 'player_offense', x: 250, y: 300, label: '3' }, // Left forward
            { type: 'player_offense', x: 400, y: 350, label: '4' }, // Center
            { type: 'player_offense', x: 550, y: 300, label: '5' }, // Right forward
        ],
    },
    {
        id: 'offense-1-3-1',
        name: '1-3-1',
        category: 'offense',
        description: 'Point at top, 3 wings, 1 center at baseline',
        objects: [
            { type: 'player_offense', x: 400, y: 150, label: '1' }, // Point guard
            { type: 'player_offense', x: 250, y: 250, label: '2' }, // Left wing
            { type: 'player_offense', x: 400, y: 250, label: '3' }, // Middle
            { type: 'player_offense', x: 550, y: 250, label: '4' }, // Right wing
            { type: 'player_offense', x: 400, y: 400, label: '5' }, // Center at baseline
        ],
    },
    {
        id: 'offense-horns',
        name: 'Horns',
        category: 'offense',
        description: '2 high post players, 2 corners, 1 point',
        objects: [
            { type: 'player_offense', x: 400, y: 150, label: '1' }, // Point guard
            { type: 'player_offense', x: 320, y: 230, label: '4' }, // Left high post
            { type: 'player_offense', x: 480, y: 230, label: '5' }, // Right high post
            { type: 'player_offense', x: 250, y: 380, label: '2' }, // Left corner
            { type: 'player_offense', x: 550, y: 380, label: '3' }, // Right corner
        ],
    },
    {
        id: 'offense-box',
        name: 'Box',
        category: 'offense',
        description: '4 players in box formation, 1 point at top',
        objects: [
            { type: 'player_offense', x: 400, y: 150, label: '1' }, // Point guard
            { type: 'player_offense', x: 300, y: 280, label: '2' }, // Left high
            { type: 'player_offense', x: 500, y: 280, label: '3' }, // Right high
            { type: 'player_offense', x: 300, y: 380, label: '4' }, // Left low
            { type: 'player_offense', x: 500, y: 380, label: '5' }, // Right low
        ],
    },

    // DEFENSE FORMATIONS
    {
        id: 'defense-2-3-zone',
        name: '2-3 Zone',
        category: 'defense',
        description: '2 guards at top, 3 forwards in paint',
        objects: [
            { type: 'player_defense', x: 350, y: 180, label: '1' }, // Left guard
            { type: 'player_defense', x: 450, y: 180, label: '2' }, // Right guard
            { type: 'player_defense', x: 280, y: 320, label: '3' }, // Left forward
            { type: 'player_defense', x: 400, y: 350, label: '5' }, // Center
            { type: 'player_defense', x: 520, y: 320, label: '4' }, // Right forward
        ],
    },
    {
        id: 'defense-1-3-1-zone',
        name: '1-3-1 Zone',
        category: 'defense',
        description: '1 top, 3 middle, 1 bottom',
        objects: [
            { type: 'player_defense', x: 400, y: 180, label: '1' }, // Top
            { type: 'player_defense', x: 280, y: 280, label: '2' }, // Left wing
            { type: 'player_defense', x: 400, y: 300, label: '3' }, // Middle
            { type: 'player_defense', x: 520, y: 280, label: '4' }, // Right wing
            { type: 'player_defense', x: 400, y: 400, label: '5' }, // Bottom
        ],
    },
    {
        id: 'defense-man-to-man',
        name: 'Man-to-Man',
        category: 'defense',
        description: 'Standard man defense positions',
        objects: [
            { type: 'player_defense', x: 400, y: 180, label: '1' }, // On ball
            { type: 'player_defense', x: 320, y: 250, label: '2' }, // Left wing deny
            { type: 'player_defense', x: 480, y: 250, label: '3' }, // Right wing deny
            { type: 'player_defense', x: 300, y: 350, label: '4' }, // Left post
            { type: 'player_defense', x: 500, y: 350, label: '5' }, // Right post
        ],
    },
    {
        id: 'defense-3-2-zone',
        name: '3-2 Zone',
        category: 'defense',
        description: '3 guards at top, 2 forwards in paint',
        objects: [
            { type: 'player_defense', x: 300, y: 200, label: '1' }, // Left guard
            { type: 'player_defense', x: 400, y: 180, label: '2' }, // Middle guard
            { type: 'player_defense', x: 500, y: 200, label: '3' }, // Right guard
            { type: 'player_defense', x: 330, y: 350, label: '4' }, // Left forward
            { type: 'player_defense', x: 470, y: 350, label: '5' }, // Right forward
        ],
    },
    {
        id: 'defense-1-2-2-zone',
        name: '1-2-2 Zone',
        category: 'defense',
        description: '1 top, 2 wings, 2 low',
        objects: [
            { type: 'player_defense', x: 400, y: 180, label: '1' }, // Top
            { type: 'player_defense', x: 320, y: 270, label: '2' }, // Left wing
            { type: 'player_defense', x: 480, y: 270, label: '3' }, // Right wing
            { type: 'player_defense', x: 330, y: 380, label: '4' }, // Left low
            { type: 'player_defense', x: 470, y: 380, label: '5' }, // Right low
        ],
    },
];
