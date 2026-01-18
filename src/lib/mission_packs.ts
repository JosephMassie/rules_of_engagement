import fs from 'fs/promises';
import path from 'path';
import type { MissionPackData } from '../../types/mission';
import { toKey } from './string_utils';
import { isMissionPackData } from './utils';

let cache: Record<string, MissionPackData> | null = null;

export async function loadMissionPacks(opts?: {
    useCache?: boolean;
}): Promise<Record<string, MissionPackData>> {
    const useCache = opts?.useCache ?? false;

    if (useCache && cache) return cache;

    const dir = path.join(process.cwd(), 'public', 'mission_packs');
    let files: string[] = [];
    try {
        files = await fs.readdir(dir);
    } catch (err) {
        console.warn('Could not read seasons directory:', err);
        cache = {};
        return {};
    }

    const missionPacks: Record<string, MissionPackData> = {};

    await Promise.all(
        files
            .filter((file) => file.endsWith('.json'))
            .map(async (file) => {
                const filePath = path.join(dir, file);
                try {
                    const raw = await fs.readFile(filePath, 'utf8');
                    const parsed = JSON.parse(raw);
                    if (isMissionPackData(parsed)) {
                        missionPacks[toKey(parsed.name)] = parsed;
                    } else {
                        console.warn(
                            `Skipping ${file}: does not match MissionPackData shape`,
                        );
                    }
                } catch (err) {
                    console.warn(`Failed to read/parse ${file}:`, err);
                }
            }),
    );

    cache = missionPacks;
    return missionPacks;
}

export async function getMissionPackByKey(
    key: string,
): Promise<MissionPackData | undefined> {
    const missionPacks = await loadMissionPacks();
    return missionPacks[key];
}

export function invalidateMissionPacksCache(): void {
    cache = null;
}
