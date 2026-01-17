import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MapInsideRuler, MissionSkill, SeasonData } from '../../types/mission';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSeasonData(obj: unknown): obj is SeasonData {
    if (typeof obj !== 'object' || obj === null) return false;
    const o = obj as Record<string, unknown>;
    return (
        'name' in o &&
        typeof o.name === 'string' &&
        'version' in o &&
        typeof o.version === 'string' &&
        'missions' in o &&
        Array.isArray(o.missions)
    );
}

export function isMissionSkill(obj: unknown): obj is MissionSkill {
    if (typeof obj !== 'object' || obj === null) return false;
    const o = obj as Record<string, unknown>;
    return (
        'name' in o &&
        typeof o.name === 'string' &&
        'skill_type' in o &&
        typeof o.skill_type === 'string' &&
        'requirements' in o &&
        typeof o.requirements === 'string' &&
        'effects' in o &&
        typeof o.effects === 'string'
    );
}

export function isInsideMapRuler(obj: unknown): obj is MapInsideRuler {
    if (typeof obj !== 'object' || obj === null) return false;
    const o = obj as Record<string, unknown>;
    return (
        'placement' in o &&
        typeof o.placement === 'string' &&
        o.placement === 'inside' &&
        Array.isArray(o.start) &&
        Array.isArray(o.end)
    );
}
