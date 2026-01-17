'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { toKey } from '@/lib/string_utils';
import { useSeasons } from '../../stores/useSeasons';
import { Button } from '@/components/ui/button';
import posthog from 'posthog-js';

export default function Page() {
    const { seasons, load, loaded } = useSeasons();

    useEffect(() => {
        load();
    }, [load]);

    const seasonList = Object.values(seasons);

    return (
        <div>
            <h1 className="text-xl md:text-2xl font-decorative mb-10">
                Available Seasons
                <br /> and Mission Packs
            </h1>
            {!loaded && seasonList.length === 0 ? (
                <p>Loading seasons…</p>
            ) : seasonList.length === 0 ? (
                <p>No seasons found.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {seasonList.map((s) => (
                        <li key={toKey(s.name)}>
                            <Button
                                asChild
                                onClick={() =>
                                    posthog.capture('season_selected', {
                                        season_name: s.name,
                                        season_version: s.version,
                                        season_key: toKey(s.name),
                                    })
                                }>
                                <Link href={`/seasons/${toKey(s.name)}`}>
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
