'use client';

import { useState } from 'react';
import type { DeploymentMap } from '../../../types/mission';
import DeploymentMapDisplay from '@/components/deployment_map';

export default function MapBuilder() {
    const [map, setMap] = useState<DeploymentMap | null>({
        gameSizes: '300P / 350P / 400P',
        zones: [
            {
                name: 'Deployment Zone A',
                position: [48, 0],
                size: 48,
                color: 'bg-amber-500',
                shape: 'circle',
            },
            {
                name: 'Deployment Zone B',
                position: [0, 48],
                size: 48,
                color: 'bg-green-900 text-white',
                shape: 'circle',
                excludeKey: true,
            },
            {
                name: 'center-line',
                position: [24, 24],
                size: 1,
                color: 'bg-black',
                shape: 'diag-line-flipped',
                excludeKey: true,
            },
            {
                name: 'exclusion-zone',
                position: [0, 20],
                size: 8,
                color: 'exclusion-zone',
                shape: 'full-width',
                hideName: true,
            },
        ],
        objects: [
            {
                name: 'Beacon A',
                position: [24, 12],
                size: 2,
                color: 'bg-pink-500',
            },
            {
                name: 'Antenna',
                position: [24, 24],
                size: 4,
                color: 'bg-green-300',
            },
        ],
        rulers: [
            {
                placement: 'left',
                start: [0, 24],
                end: [0, 48],
            },
            {
                placement: 'top',
                start: [24, 0],
                end: [48, 0],
            },
            {
                placement: 'right',
                start: [48, 0],
                end: [48, 12],
            },
            {
                placement: 'bottom',
                start: [48, 48],
                end: [40, 48],
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
