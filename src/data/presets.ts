import type { PlayObject } from '../types';

export interface Preset {
    id: string;
    name: string;
    objects: Partial<PlayObject>[];
}

export const PRESETS: Preset[] = [
    {
        id: '5-out',
        name: '5-Out Open',
        objects: [
            { type: 'player_offense', x: 400, y: 200, label: '1' }, // Top
            { type: 'player_offense', x: 200, y: 300, label: '2' }, // Wing L
            { type: 'player_offense', x: 600, y: 300, label: '3' }, // Wing R
            { type: 'player_offense', x: 100, y: 500, label: '4' }, // Corner L
            { type: 'player_offense', x: 700, y: 500, label: '5' }, // Corner R
        ]
    },
    {
        id: '2-3-zone',
        name: '2-3 Zone Defense',
        objects: [
            { type: 'player_defense', x: 300, y: 250, label: 'X1' }, // Top L
            { type: 'player_defense', x: 500, y: 250, label: 'X2' }, // Top R
            { type: 'player_defense', x: 150, y: 450, label: 'X3' }, // Bot L
            { type: 'player_defense', x: 400, y: 450, label: 'X4' }, // Bot C
            { type: 'player_defense', x: 650, y: 450, label: 'X5' }, // Bot R
        ]
    },
    {
        id: 'horns',
        name: 'Horns Set',
        objects: [
            { type: 'player_offense', x: 400, y: 200, label: '1' }, // PG
            { type: 'player_offense', x: 100, y: 500, label: '2' }, // Corner L
            { type: 'player_offense', x: 700, y: 500, label: '3' }, // Corner R
            { type: 'player_offense', x: 320, y: 350, label: '4' }, // Elbow L
            { type: 'player_offense', x: 480, y: 350, label: '5' }, // Elbow R
        ]
    },
    {
        id: '1-4-high',
        name: '1-4 High',
        objects: [
            { type: 'player_offense', x: 400, y: 180, label: '1' }, // Top
            { type: 'player_offense', x: 150, y: 300, label: '2' }, // Wing L
            { type: 'player_offense', x: 650, y: 300, label: '3' }, // Wing R
            { type: 'player_offense', x: 320, y: 300, label: '4' }, // Elbow L
            { type: 'player_offense', x: 480, y: 300, label: '5' }, // Elbow R
        ]
    }
];
