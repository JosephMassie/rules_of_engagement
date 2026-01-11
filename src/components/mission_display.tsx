'use client';

import { fromKey } from '@/lib/string_utils';
import { HTMLProps } from 'react';
import { Badge } from './ui/badge';
import { useSeasons } from '@/stores/useSeasons';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertOctagonIcon } from 'lucide-react';
import { isMissionSkill } from '@/lib/utils';

type Props = HTMLProps<HTMLDivElement> & {
    seasonKey: string;
    missionKey: string;
};

export default function MissionDisplay({
    seasonKey,
    missionKey,
    ...props
}: Props) {
    const seasonsData = useSeasons();

    if (!seasonsData.loaded) {
        seasonsData.load();
        return <div {...props}>Loading season data…</div>;
    }

    const season = seasonsData.getSeason(seasonKey);
    if (!season) {
        return <div {...props}>Season {`"${seasonKey}"`} not found.</div>;
    }

    const mission = season.missions.find(
        (m) => m.name.toLowerCase() === fromKey(missionKey).toLowerCase()
    );
    if (!mission) {
        return (
            <div {...props}>
                Mission {`"${missionKey}"`} not found in season{' '}
                {`"${seasonKey}"`}.
            </div>
        );
    }

    return (
        <div {...props}>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-decorative">
                {mission.name}
            </h1>
            <Separator className="my-4" />
            <div className="grid gap-8">
                <div className="flex justify-center gap-2 flex-wrap">
                    <Badge variant="outline">{mission.type}</Badge>
                    {(mission.suitable_for_reinforcements && (
                        <Badge variant="secondary">Reinforcements Ready</Badge>
                    )) || (
                        <Badge variant="destructive">
                            Not Reinforcements Ready
                        </Badge>
                    )}
                    {(mission.tactical_support_options > 0 && (
                        <Badge variant="secondary">
                            {mission.tactical_support_options} Tactical Support
                            Option
                            {mission.tactical_support_options > 1 ? 's' : ''}
                        </Badge>
                    )) || (
                        <Badge variant="destructive">No Tactical Support</Badge>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Mission Objectives
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Array.isArray(mission.mission_objectives) ? (
                            <ul className="list-disc list-inside mt-2 text-left">
                                {mission.mission_objectives.map(
                                    (objective, index) => (
                                        <li key={index}>{objective}</li>
                                    )
                                )}
                            </ul>
                        ) : (
                            Object.entries(mission.mission_objectives).map(
                                ([side, objectives]) => (
                                    <div key={side} className="mb-4">
                                        <h3 className="text-lg font-semibold mb-2">
                                            {fromKey(side)}
                                        </h3>
                                        <ul className="list-disc list-inside text-left">
                                            {objectives.map(
                                                (objective, index) => (
                                                    <li key={index}>
                                                        {objective}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )
                            )
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Forces and Deployment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="mx-auto w-fit table-auto border-collapse mb-4 border-foreground text-sm sm:text-base">
                            <thead>
                                <tr className="bg-accent text-accent-foreground">
                                    <th className="border p-1 sm:px-2 md:px-4">
                                        Army Points
                                    </th>
                                    <th className="border p-1 sm:px-2 md:px-4">
                                        SWC
                                    </th>
                                    <th className="border p-1 sm:px-2 md:px-4">
                                        Table Size
                                    </th>
                                    <th className="border p-1 sm:px-2 md:px-4">
                                        Deployment Zone
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {mission.forces_and_deployment.deployment_table.map(
                                    (entry, index) => (
                                        <tr key={index}>
                                            <td className="border p-1 sm:px-2 md:px-4">
                                                {entry.army_points}
                                            </td>
                                            <td className="border p-1 sm:px-2 md:px-4">
                                                {entry.swc}
                                            </td>
                                            <td className="border p-1 sm:px-2 md:px-4">
                                                {entry.table_size}
                                            </td>
                                            <td className="border p-1 sm:px-2 md:px-4">
                                                {entry.deployment_zone}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                        {mission.forces_and_deployment.special_notes.length >
                            0 && (
                            <Alert className="mx-auto w-fit text-left bg-accent-foreground text-destructive">
                                <AlertOctagonIcon className="h-4 w-4" />
                                <AlertTitle>Special Notes</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside text-destructive">
                                        {mission.forces_and_deployment.special_notes.map(
                                            (note, index) => (
                                                <li key={index}>{note}</li>
                                            )
                                        )}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <h2 className="text-2xl font-decorative">
                    Scenario Special Rules
                </h2>
                <div className="space-y-4 text-left">
                    {Object.entries(mission.scenario_special_rules).map(
                        ([key, value]) => (
                            <div
                                key={key}
                                className="border-l-4 border-accent pl-4">
                                <p className="font-medium">{fromKey(key)}</p>
                                {isMissionSkill(value) ? (
                                    <div className="mt-2 space-y-1">
                                        <p>
                                            <strong>Type:</strong>{' '}
                                            {value.skill_type}
                                        </p>
                                        <p>
                                            <strong>Requirements:</strong>{' '}
                                            {value.requirements}
                                        </p>
                                        <p>
                                            <strong>Effects:</strong>{' '}
                                            {value.effects}
                                        </p>
                                    </div>
                                ) : typeof value === 'string' ? (
                                    <p>{value}</p>
                                ) : (
                                    Object.entries(value).map(
                                        ([subKey, subValue]) => (
                                            <div
                                                key={subKey}
                                                className="mt-2 space-y-1">
                                                <p className="font-semibold">
                                                    {fromKey(subKey)}
                                                </p>
                                                <p>{subValue}</p>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        )
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            End of Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{mission.end_of_mission}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
