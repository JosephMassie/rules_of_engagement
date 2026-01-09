import { create } from 'zustand';
import type { SeasonData } from '../../types/mission';

type SeasonsMap = Record<string, SeasonData>;

type SeasonsState = {
    seasons: SeasonsMap;
    loaded: boolean;
    load: () => Promise<void>;
    get: (key: string) => SeasonData | undefined;
    setSeasons: (s: SeasonsMap) => void;
};

export const useSeasonsStore = create<SeasonsState>((set, get) => ({
    seasons: {},
    loaded: false,
    setSeasons: (s) => set({ seasons: s }),
    load: async () => {
        if (typeof window === 'undefined') return;
        if (get().loaded) return;
        try {
            const res = await fetch('/api/seasons');
            if (!res.ok)
                throw new Error(`Failed to fetch seasons (${res.status})`);
            const data: SeasonsMap = await res.json();
            set({ seasons: data, loaded: true });
        } catch (err) {
            console.warn('Failed to load seasons from /api/seasons:', err);
        }
    },
    get: (key: string) => get().seasons[key],
}));

export function useSeasons() {
    const seasons = useSeasonsStore((s) => s.seasons);
    const load = useSeasonsStore((s) => s.load);
    const getSeason = useSeasonsStore((s) => s.get);
    const loaded = useSeasonsStore((s) => s.loaded);
    return { seasons, load, getSeason, loaded };
}
