import { HTMLProps } from 'react';
import type { DeploymentMap, GameSize, MapPosition } from '../../types/mission';
import clsx from 'clsx';

type Props = HTMLProps<HTMLDivElement> & {
    map: DeploymentMap | null;
};

const MapBase = ({
    children,
    className,
    ...props
}: HTMLProps<HTMLDivElement>) => (
    <div
        className={clsx(
            'w-[320px] h-120 bg-stone-200 text-black border border-black box-content relative overflow-hidden',
            className
        )}
        {...props}>
        {children}
    </div>
);

const determineMapDimensions = (gameSizes: GameSize): MapPosition => {
    switch (gameSizes) {
        case '150P':
            return [24, 32];
        case '200P / 250P':
            return [32, 48];
        case '300P / 350P / 400P':
            return [48, 48];
        default:
            throw new TypeError('Invalid game size');
    }
};

const positionToCss = (position: MapPosition, dimensions: MapPosition) => {
    const [x, y] = position;
    const [width, height] = dimensions;

    return {
        top: `${(y / height) * 100}%`,
        left: `${(x / width) * 100}%`,
    };
};

const sizeToCss = (objSize: MapPosition, dimensions: MapPosition) => {
    const [width, height] = objSize;
    const [mapWidth, mapHeight] = dimensions;

    return {
        height: `${(height / mapHeight) * 100}%`,
        width: `${(width / mapWidth) * 100}%`,
    };
};

const DeploymentMapDisplay: React.FC<Props> = ({ map, ...props }) => {
    if (!map) {
        return <MapBase {...props}></MapBase>;
    }

    const dimensions = determineMapDimensions(map.gameSizes);
    const [width, height] = dimensions;

    return (
        <div className="relative">
            <h3 className="font-semibold">{map.gameSizes}</h3>
            <MapBase {...props}>
                <div>
                    {map.zones.map(
                        (
                            {
                                name,
                                shortName,
                                position,
                                color,
                                size,
                                shape,
                                hideName,
                            },
                            i
                        ) => {
                            const key = `${name}-${i}`;
                            let longestSide = 0;
                            let length = 0;
                            let angle = 0;

                            switch (shape) {
                                case 'box':
                                    return (
                                        <div
                                            key={key}
                                            data-type="zone"
                                            className={clsx(
                                                'absolute -translate-1/2',
                                                color
                                            )}
                                            style={{
                                                ...positionToCss(
                                                    position,
                                                    dimensions
                                                ),
                                                ...sizeToCss(
                                                    [size, size],
                                                    dimensions
                                                ),
                                            }}>
                                            {color.includes('obj-room') && (
                                                <>
                                                    <div className="absolute -left-0.75 top-1/2 -translate-y-1/2 h-4 w-0.75 bg-cyan-400"></div>
                                                    <div className="absolute -right-0.75 top-1/2 -translate-y-1/2 h-4 w-0.75 bg-cyan-400"></div>
                                                    <div className="absolute left-1/2 -top-0.75 -translate-x-1/2 h-0.75 w-4 bg-cyan-400"></div>
                                                    <div className="absolute left-1/2 -bottom-0.75 -translate-x-1/2 h-0.75 w-4 bg-cyan-400"></div>
                                                </>
                                            )}
                                            {!hideName && (
                                                <div className="absolute w-full top-1/2 left-1/2 -translate-1/2">
                                                    {shortName ?? name}
                                                </div>
                                            )}
                                        </div>
                                    );
                                case 'full-width':
                                    return (
                                        <div
                                            key={key}
                                            data-type="zone"
                                            className={clsx(
                                                'absolute w-full',
                                                color
                                            )}
                                            style={{
                                                height: `${
                                                    (size / height) * 100
                                                }%`,
                                                ...positionToCss(
                                                    position,
                                                    dimensions
                                                ),
                                            }}>
                                            {!hideName && (
                                                <div className="absolute w-full top-1/2 left-1/2 -translate-1/2">
                                                    {shortName ?? name}
                                                </div>
                                            )}
                                        </div>
                                    );
                                case 'circle':
                                    return (
                                        <div
                                            key={key}
                                            data-type="zone"
                                            className={clsx(
                                                'absolute rounded-full -translate-1/2',
                                                color
                                            )}
                                            style={{
                                                ...positionToCss(
                                                    position,
                                                    dimensions
                                                ),
                                                ...sizeToCss(
                                                    [size, size],
                                                    dimensions
                                                ),
                                            }}>
                                            {!hideName && (
                                                <div
                                                    className={clsx(
                                                        'absolute w-1/3',
                                                        {
                                                            'left-[53%]':
                                                                position[0] <=
                                                                24,
                                                            'right-[53%]':
                                                                position[0] >
                                                                24,
                                                            'top-[53%]':
                                                                position[1] <=
                                                                24,
                                                            'bottom-[53%]':
                                                                position[1] >
                                                                24,
                                                        }
                                                    )}>
                                                    {shortName ?? name}
                                                </div>
                                            )}
                                        </div>
                                    );
                                case 'horiz-line':
                                    return (
                                        <div
                                            key={key}
                                            data-type="zone"
                                            className={clsx(
                                                'absolute w-full h-px',
                                                color
                                            )}
                                            style={{
                                                ...positionToCss(
                                                    position,
                                                    dimensions
                                                ),
                                            }}></div>
                                    );
                                case 'vert-line':
                                    return (
                                        <div
                                            key={key}
                                            datatype="zone"
                                            className={clsx(
                                                'absolute h-full w-px',
                                                color
                                            )}
                                            style={{
                                                ...positionToCss(
                                                    position,
                                                    dimensions
                                                ),
                                            }}></div>
                                    );
                                case 'diag-line':
                                    longestSide =
                                        width >= height ? width : height;
                                    length =
                                        (Math.sqrt(
                                            width * width + height * height
                                        ) /
                                            longestSide) *
                                        100;
                                    angle = Math.atan2(width, height);
                                    return (
                                        <div
                                            key={key}
                                            datatype="zone"
                                            className={clsx(
                                                'absolute w-px -translate-1/2',
                                                color
                                            )}
                                            style={{
                                                height: `${length}%`,
                                                ...positionToCss(
                                                    position,
                                                    dimensions
                                                ),
                                                transform: `rotate(${angle}rad)`,
                                            }}></div>
                                    );
                                case 'diag-line-flipped':
                                    longestSide =
                                        width >= height ? width : height;
                                    length =
                                        (Math.sqrt(
                                            width * width + height * height
                                        ) /
                                            longestSide) *
                                        100;
                                    angle = Math.atan2(width, height);
                                    return (
                                        <div
                                            key={key}
                                            datatype="zone"
                                            className={clsx(
                                                'absolute w-px -translate-1/2',
                                                color
                                            )}
                                            style={{
                                                height: `${length}%`,
                                                ...positionToCss(
                                                    position,
                                                    dimensions
                                                ),
                                                transform: `rotate(-${angle}rad)`,
                                            }}></div>
                                    );
                                default:
                                    console.error('invalid shape');
                                    return null;
                            }
                        }
                    )}
                </div>
                <div className="z-10">
                    {map.objects.map(({ name, position, size, color }, i) => (
                        <div
                            key={`${name}-${i}`}
                            data-type="object"
                            className={clsx(
                                'absolute rounded-full -translate-1/2',
                                `size-${size}`,
                                color
                            )}
                            style={{
                                ...positionToCss(position, dimensions),
                            }}></div>
                    ))}
                </div>
            </MapBase>
        </div>
    );
};

export default DeploymentMapDisplay;
