'use client';

import { useState } from 'react';
import type { DeploymentMap } from '../../../types/mission';
import DeploymentMapDisplay from '@/components/deployment_map';
import { Vector2D } from '@/lib/vector';

export default function MapBuilder() {
    const [map, setMap] = useState<DeploymentMap | null>({
        gameSizes: '150P',
        zones: [
            {
                name: 'Deployment Zone A',
                position: [24, 0],
                size: 12,
                color: 'bg-amber-500',
                shape: 'circle',
                excludeLegend: true,
            },
            {
                name: 'Deployment Zone B',
                position: [0, 32],
                size: 12,
                color: 'bg-green-900 text-white',
                shape: 'circle',
                excludeLegend: true,
            },
            {
                name: 'center-line',
                position: [12, 16],
                size: 1,
                color: 'bg-black',
                shape: 'diag-line-flipped',
                excludeLegend: true,
            },
        ],
        objects: [
            {
                name: 'Tech-Coffin',
                position: [7.26, 9.54],
                size: 4,
                color: 'bg-purple-800',
            },
            {
                name: 'Tech-Coffin',
                position: [12, 16],
                size: 4,
                color: 'bg-purple-800',
            },
            {
                name: 'Tech-Coffin',
                position: [16.8, 22.4],
                size: 4,
                color: 'bg-purple-800',
            },
        ],
        rulers: [
            {
                placement: 'bottom',
                start: [0, 32],
                length: 12,
            },
            {
                placement: 'left',
                start: [0, 0],
                length: 16,
            },
            {
                length: 8,
                placement: 'inside',
                start: [12, 16],
                end: [24, 32],
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
