'use client';

import { fromKey, toKey } from '@/lib/string_utils';
import { useSeasons } from '@/stores/useSeasons';
import { HTMLProps } from 'react';
import { MissionData } from '../../types/mission';
import Link from 'next/link';

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
                            href={`/seasons/${seasonKey}/missions/${toKey(
                                mission.name
                            )}`}>
                            {mission.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

type Props = HTMLProps<HTMLDivElement> & {
    seasonKey: string;
};

export default function SeasonDisplay({ seasonKey, ...props }: Props) {
    const seasonsData = useSeasons();

    if (!seasonsData.loaded) {
        seasonsData.load();
        return <div {...props}>Loading season data…</div>;
    }

    const season = seasonsData.getSeason(seasonKey);
    if (!season) {
        return <div {...props}>Season {`"${seasonKey}"`} not found.</div>;
    }

    // filter missions based on type
    const itsScenarios = season.missions.filter(
        (m) => m.type === 'ITS Scenario'
    );
    const directActions = season.missions.filter(
        (m) => m.type === 'Direct Action'
    );
    const customMissions = season.missions.filter((m) => m.type === 'Custom');

    return (
        <div {...props}>
            <h1 className="mb-6 text-4xl md:text-6xl font-decorative">
                {fromKey(season.name)}{' '}
                <span className="text-sm text-accent">v{season.version}</span>
            </h1>

            <MissionList
                seasonKey={seasonKey}
                missions={itsScenarios}
                header="ITS Scenarios"
            />

            <MissionList
                seasonKey={seasonKey}
                missions={directActions}
                header="Direct Actions"
            />

            <MissionList
                seasonKey={seasonKey}
                missions={customMissions}
                header="Custom Missions"
            />
        </div>
    );
}
