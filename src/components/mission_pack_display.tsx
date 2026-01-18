'use client';

import { fromKey, toKey } from '@/lib/string_utils';
import { useMissionPacks } from '@/stores/useMissionPacks';
import { HTMLProps } from 'react';
import { MissionData } from '../../types/mission';
import Link from 'next/link';
import posthog from 'posthog-js';

function MissionList({
    seasonKey,
    missions,
    header,
}: {
    seasonKey: string;
    missions: Array<MissionData>;
    header: string;
}) {
    if (missions.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl mb-4 font-decorative">{header}</h2>
            <div className="flex flex-col gap-4">
                {missions.map((mission) => {
                    return (
                        <Link
                            key={toKey(mission.name)}
                            href={`/mission_packs/${seasonKey}/missions/${toKey(
                                mission.name,
                            )}`}
                            onClick={() =>
                                posthog.capture('mission_selected', {
                                    mission_name: mission.name,
                                    mission_type: mission.type,
                                    mission_key: toKey(mission.name),
                                    season_key: seasonKey,
                                })
                            }>
                            {mission.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

type Props = HTMLProps<HTMLDivElement> & {
    packKey: string;
};

export default function MissionPackDisplay({ packKey, ...props }: Props) {
    const missionPacksData = useMissionPacks();

    if (!missionPacksData.loaded) {
        missionPacksData.load();
        return <div {...props}>Loading season data…</div>;
    }

    const missionPack = missionPacksData.getSeason(packKey);
    if (!missionPack) {
        return <div {...props}>Mission Pack {`"${packKey}"`} not found.</div>;
    }

    // filter missions based on type
    const itsScenarios = missionPack.missions.filter(
        (m) => m.type === 'ITS Scenario',
    );
    const directActions = missionPack.missions.filter(
        (m) => m.type === 'Direct Action',
    );
    const customMissions = missionPack.missions.filter((m) => m.type === 'Custom');

    return (
        <div {...props}>
            <h1 className="mb-6 text-4xl md:text-6xl font-decorative">
                {fromKey(missionPack.name)}{' '}
                <span className="text-sm text-accent">v{missionPack.version}</span>
            </h1>

            <MissionList
                seasonKey={packKey}
                missions={itsScenarios}
                header="ITS Scenarios"
            />

            <MissionList
                seasonKey={packKey}
                missions={directActions}
                header="Direct Actions"
            />

            <MissionList
                seasonKey={packKey}
                missions={customMissions}
                header="Custom Missions"
            />
        </div>
    );
}
