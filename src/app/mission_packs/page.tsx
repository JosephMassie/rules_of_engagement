'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { toKey } from '@/lib/string_utils';
import { useMissionPacks } from '../../stores/useMissionPacks';
import { Button } from '@/components/ui/button';
import posthog from 'posthog-js';

export default function Page() {
    const { missionPacks, load, loaded } = useMissionPacks();

    useEffect(() => {
        load();
    }, [load]);

    const packList = Object.values(missionPacks);

    return (
        <div>
            <h1 className="text-xl md:text-2xl font-decorative mb-10">
                Available Mission Packs
            </h1>
            {!loaded && packList.length === 0 ? (
                <p>Loading mission packs…</p>
            ) : packList.length === 0 ? (
                <p>No mission packs found.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {packList.map((s) => (
                        <li key={toKey(s.name)}>
                            <Button
                                asChild
                                onClick={() =>
                                    posthog.capture('mission_pack_selected', {
                                        mission_pack_name: s.name,
                                        mission_pack_version: s.version,
                                        mission_pack_key: toKey(s.name),
                                    })
                                }>
                                <Link href={`/mission_packs/${toKey(s.name)}`}>
                                    {s.name} -{' '}
                                    <span className="italic">v{s.version}</span>
                                </Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
