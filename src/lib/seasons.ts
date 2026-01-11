import fs from 'fs/promises';
import path from 'path';
import type { SeasonData } from '../../types/mission';
import { toKey } from './string_utils';
import { isSeasonData } from './utils';

let cache: Record<string, SeasonData> | null = null;

export async function loadSeasons(opts?: {
    useCache?: boolean;
}): Promise<Record<string, SeasonData>> {
    const useCache = opts?.useCache ?? false;

    if (useCache && cache) return cache;

    const dir = path.join(process.cwd(), 'public', 'seasons');
    let files: string[] = [];
    try {
        files = await fs.readdir(dir);
    } catch (err) {
        console.warn('Could not read seasons directory:', err);
        cache = {};
        return {};
    }

    const seasons: Record<string, SeasonData> = {};

    await Promise.all(
        files
            .filter((file) => file.endsWith('.json'))
            .map(async (file) => {
                const filePath = path.join(dir, file);
                try {
                    const raw = await fs.readFile(filePath, 'utf8');
                    const parsed = JSON.parse(raw);
                    if (isSeasonData(parsed)) {
                        seasons[toKey(parsed.name)] = parsed;
                    } else {
                        console.warn(
                            `Skipping ${file}: does not match SeasonData shape`
                        );
                    }
                } catch (err) {
                    console.warn(`Failed to read/parse ${file}:`, err);
                }
            })
    );

    cache = seasons;
    return seasons;
}

export async function getSeasonByKey(
    key: string
): Promise<SeasonData | undefined> {
    const seasons = await loadSeasons();
    return seasons[key];
}

export function invalidateSeasonsCache(): void {
    cache = null;
}
