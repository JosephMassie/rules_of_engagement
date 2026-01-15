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
                name: 'exclusion zone',
                position: [24, 24],
                size: 8,
                color: 'exclusion-zone',
                shape: 'box',
                hideName: true,
            },
            {
                name: 'center-line',
                position: [0, 24],
                size: 1,
                color: 'bg-black',
                shape: 'horiz-line',
                excludeKey: true,
            },
            {
                name: 'center-line',
                position: [24, 0],
                size: 1,
                color: 'bg-black',
                shape: 'vert-line',
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
                name: 'center-line',
                position: [24, 24],
                size: 1,
                color: 'bg-black',
                shape: 'diag-line',
                excludeKey: true,
            },
            {
                name: 'room',
                position: [24, 24],
                size: 8,
                color: 'obj-room',
                shape: 'box',
                hideName: true,
                excludeKey: true,
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
                length: 24,
                placement: 'left',
                start: [0, 24],
                end: [0, 48],
            },
            {
                length: 24,
                placement: 'top',
                start: [24, 0],
                end: [48, 0],
            },
            {
                length: 12,
                placement: 'right',
                start: [48, 0],
                end: [48, 12],
            },
            {
                length: 8,
                placement: 'bottom',
                start: [48, 48],
                end: [40, 48],
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
