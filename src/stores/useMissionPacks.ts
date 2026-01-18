import { create } from 'zustand';
import type { MissionPackData } from '../../types/mission';

type MissionPacksMap = Record<string, MissionPackData>;

type MissionPacksState = {
    missionPacks: MissionPacksMap;
    loaded: boolean;
    load: () => Promise<void>;
    get: (key: string) => MissionPackData | undefined;
    setMissionPacks: (s: MissionPacksMap) => void;
};

export const useMissionPacksStore = create<MissionPacksState>((set, get) => ({
    missionPacks: {},
    loaded: false,
    setMissionPacks: (s) => set({ missionPacks: s }),
    load: async () => {
        if (typeof window === 'undefined') return;
        if (get().loaded) return;
        try {
            const res = await fetch('/api/mission_packs');
            if (!res.ok)
                throw new Error(
                    `Failed to fetch mission packs (${res.status})`,
                );
            const data: MissionPacksMap = await res.json();
            set({ missionPacks: data, loaded: true });
        } catch (err) {
            console.warn(
                'Failed to load mission packs from /api/mission_packs:',
                err,
            );
        }
    },
    get: (key: string) => get().missionPacks[key],
}));

export function useMissionPacks() {
    const missionPacks = useMissionPacksStore((s) => s.missionPacks);
    const load = useMissionPacksStore((s) => s.load);
    const getSeason = useMissionPacksStore((s) => s.get);
    const loaded = useMissionPacksStore((s) => s.loaded);
    return { missionPacks, load, getSeason, loaded };
}
