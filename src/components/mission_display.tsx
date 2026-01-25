'use client';

import { fromKey } from '@/lib/string_utils';
import { HTMLProps, useState } from 'react';
import { Badge } from './ui/badge';
import { useMissionPacks } from '@/stores/useMissionPacks';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertOctagonIcon } from 'lucide-react';
import ScenarioRule from './scenario_rule';
import Objectives from './objectives';
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from './ui/select';
import DeploymentMapDisplay from './deployment_map';
import posthog from 'posthog-js';

type Props = HTMLProps<HTMLDivElement> & {
    packKey: string;
    missionKey: string;
};

export default function MissionDisplay({
    packKey,
    missionKey,
    ...props
}: Props) {
    const missionPacksData = useMissionPacks();

    const [gameSize, setGameSize] = useState(0);

    if (!missionPacksData.loaded) {
        missionPacksData.load();
        return <div {...props}>Loading mission pack data…</div>;
    }

    const missionPack = missionPacksData.getSeason(packKey);
    if (!missionPack) {
        return <div {...props}>Mission Pack {`"${packKey}"`} not found.</div>;
    }

    const mission = missionPack.missions.find(
        (m) => m.name.toLowerCase() === fromKey(missionKey).toLowerCase(),
    );
    if (!mission) {
        return (
            <div {...props}>
                Mission {`"${missionKey}"`} not found in mission pack{' '}
                {`"${packKey}"`}.
            </div>
        );
    }

    return (
        <div className="max-w-full" {...props}>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-decorative">
                {mission.name}
            </h1>
            <Separator className="my-4" />
            <div className="grid gap-8 w-full">
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

                <Objectives
                    objectivesData={mission.mission_objectives}
                    tables={mission.tables}
                />

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
                                    <th className="border p-1 sm:px-2 md:px-4 border-card-foreground">
                                        Army Points
                                    </th>
                                    <th className="border p-1 sm:px-2 md:px-4 border-card-foreground">
                                        SWC
                                    </th>
                                    <th className="border p-1 sm:px-2 md:px-4 border-card-foreground">
                                        Table Size
                                    </th>
                                    <th className="border p-1 sm:px-2 md:px-4 border-card-foreground">
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
                                    ),
                                )}
                            </tbody>
                        </table>

                        {mission.forces_and_deployment.maps && (
                            <div className="mb-4 w-full grid justify-center items-center gap-4">
                                {mission.forces_and_deployment.maps.length >
                                    1 && (
                                    <Select
                                        value={gameSize.toFixed()}
                                        onValueChange={(value) => {
                                            const newGameSize = parseInt(value);
                                            setGameSize(newGameSize);
                                            const selectedMap =
                                                mission.forces_and_deployment
                                                    .maps?.[newGameSize];
                                            posthog.capture(
                                                'game_size_changed',
                                                {
                                                    mission_name: mission.name,
                                                    mission_key: missionKey,
                                                    season_key: packKey,
                                                    game_size_index:
                                                        newGameSize,
                                                    game_sizes_label:
                                                        selectedMap?.gameSizes,
                                                },
                                            );
                                        }}>
                                        <SelectTrigger className="m-auto">
                                            <SelectValue placeholder="Select a Game Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mission.forces_and_deployment.maps?.map(
                                                ({ gameSizes }, i) => (
                                                    <SelectItem
                                                        key={gameSizes}
                                                        value={i.toFixed()}>
                                                        {gameSizes}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}

                                <div>
                                    <DeploymentMapDisplay
                                        map={
                                            mission.forces_and_deployment.maps[
                                                gameSize
                                            ]
                                        }
                                        hideGameSize
                                    />
                                </div>
                            </div>
                        )}

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
                                            ),
                                        )}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Scenario Special Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 sm:space-y-10 text-left">
                            {Object.entries(mission.scenario_special_rules).map(
                                ([key, value]) => (
                                    <ScenarioRule
                                        name={fromKey(key)}
                                        ruleData={value}
                                        key={key}
                                    />
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>

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
