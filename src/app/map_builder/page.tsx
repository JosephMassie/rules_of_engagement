'use client';

import { useState } from 'react';
import type { DeploymentMap } from '../../../types/mission';
import DeploymentMapDisplay from '@/components/deployment_map';
import { Vector2D } from '@/lib/vector';

export default function MapBuilder() {
    const [map, setMap] = useState<DeploymentMap | null>({
        gameSizes: '300P / 350P / 400P',
        zones: [
            {
                name: 'Deployment Zone A',
                position: [48, 0],
                size: 24,
                color: 'bg-amber-500',
                shape: 'circle',
                excludeLegend: true,
            },
            {
                name: 'Deployment Zone B',
                position: [0, 48],
                size: 24,
                color: 'bg-green-900 text-white',
                shape: 'circle',
                excludeLegend: true,
            },
            {
                name: 'center-line',
                position: [24, 24],
                size: 1,
                color: 'bg-black',
                shape: 'diag-line-flipped',
                excludeLegend: true,
            },
        ],
        objects: [
            {
                name: 'Tech-Coffin',
                position: new Vector2D(23, 23)
                    .subtract(new Vector2D(24, 24))
                    .normalize()
                    .multiplyScalar(16)
                    .add(new Vector2D(24, 24))
                    .toArray(),
                size: 4,
                color: 'bg-purple-800',
            },
            {
                name: 'Tech-Coffin',
                position: [24, 24],
                size: 4,
                color: 'bg-purple-800',
            },
            {
                name: 'Tech-Coffin',
                position: new Vector2D(25, 25)
                    .subtract(new Vector2D(24, 24))
                    .normalize()
                    .multiplyScalar(16)
                    .add(new Vector2D(24, 24))
                    .toArray(),
                size: 4,
                color: 'bg-purple-800',
            },
        ],
        rulers: [
            {
                placement: 'bottom',
                start: [24, 48],
                end: [0, 48],
            },
            {
                length: 16,
                placement: 'inside',
                start: [24, 24],
                end: [25, 25],
            },
        ],
    });

    return (
        <>
            <h1 className="mb-8 text-2xl md:text-3xl font-decorative">
                Deployment Map Builder
            </h1>
            <div className="flex flex-col items-center justify-center">
                <DeploymentMapDisplay map={map} />
            </div>
        </>
    );
}
