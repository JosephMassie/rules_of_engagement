import { HTMLProps } from 'react';
import type { DeploymentMap, GameSize, MapPosition } from '../../types/mission';
import clsx from 'clsx';
import { Vector2D } from '@/lib/vector';

type Props = HTMLProps<HTMLDivElement> & {
    map: DeploymentMap | null;
};

const MAP_SIZES = {
    large: 48,
    medium: 32,
    small: 24,
};

const MapBase = ({
    children,
    className,
    dimensions,
    ...props
}: HTMLProps<HTMLDivElement> & { dimensions: MapPosition }) => {
    const [width, height] = dimensions;
    const ratio = width / height;

    return (
        <div
            className={clsx(
                'w-[80vw] max-w-55 2xs:max-w-65 bg-stone-200 text-black border border-black box-content relative overflow-hidden',
                className,
                {
                    'xs:max-w-120': ratio === 1,
                }
            )}
            style={{ aspectRatio: `${width}/${height}` }}
            {...props}>
            {children}
        </div>
    );
};

const determineMapDimensions = (gameSizes: GameSize): MapPosition => {
    switch (gameSizes) {
        case '150P':
            return [MAP_SIZES.small, MAP_SIZES.medium];
        case '200P / 250P':
            return [MAP_SIZES.medium, MAP_SIZES.large];
        case '300P / 350P / 400P':
            return [MAP_SIZES.large, MAP_SIZES.large];
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
        return <MapBase dimensions={[48, 48]} {...props}></MapBase>;
    }

    const dimensions = determineMapDimensions(map.gameSizes);
    const [mapWidth, mapHeight] = dimensions;
    const longestSide = mapWidth >= mapHeight ? mapWidth : mapHeight;

    return (
        <>
            <div className="mb-8">
                <h3 className="font-semibold">{map.gameSizes}</h3>
                <p className="font-extralight text-sm">
                    {`${mapWidth}"`} x {`${mapHeight}"`}
                </p>
            </div>

            <div className="relative">
                <MapBase dimensions={dimensions} {...props}>
                    <div>
                        {map.zones.map(
                            (
                                {
                                    name,
                                    position,
                                    color,
                                    size,
                                    shape,
                                    hideName,
                                },
                                i
                            ) => {
                                const key = `${name}-${i}`;

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
                                                        {name}
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
                                                        (size / mapHeight) * 100
                                                    }%`,
                                                    ...positionToCss(
                                                        position,
                                                        dimensions
                                                    ),
                                                }}>
                                                {!hideName && (
                                                    <div className="absolute w-full top-1/2 left-1/2 -translate-1/2">
                                                        {name}
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
                                                        [size*2, size*2],
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
                                                        {name}
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
                                        length =
                                            (Math.sqrt(
                                                mapWidth * mapWidth +
                                                    mapHeight * mapHeight
                                            ) /
                                                longestSide) *
                                            100;
                                        angle = Math.atan2(mapWidth, mapHeight);
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
                                        length =
                                            (Math.sqrt(
                                                mapWidth * mapWidth +
                                                    mapHeight * mapHeight
                                            ) /
                                                longestSide) *
                                            100;
                                        angle = Math.atan2(mapWidth, mapHeight);
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
                        {map.objects.map(
                            ({ name, position, size, color }, i) => (
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
                            )
                        )}
                    </div>
                </MapBase>
                {map.rulers?.map(({ length, start, end, placement }, i) => {
                    const startVec = new Vector2D(...start);
                    const endVec = new Vector2D(...end);
                    let maxLength = longestSide;

                    /* Apply offset to start and end positions if placement is outside
                     * also determine max length for percentage based calculations
                     */
                    const offSet = 1;
                    switch (placement) {
                        case 'left':
                            startVec.x -= offSet;
                            endVec.x -= offSet;
                            maxLength = mapHeight;
                            break;
                        case 'right':
                            startVec.x += offSet;
                            endVec.x += offSet;
                            maxLength = mapHeight;
                            break;
                        case 'top':
                            startVec.y -= offSet;
                            endVec.y -= offSet;
                            maxLength = mapWidth;
                            break;
                        case 'bottom':
                            startVec.y += offSet;
                            endVec.y += offSet;
                            maxLength = mapWidth;
                            break;
                        case 'inside':
                            // Do nothing as the position is within the map
                            break;
                        default:
                            console.error(
                                'unknown map ruler placement',
                                placement
                            );
                    }

                    const cssPos = positionToCss(
                        startVec.toArray(),
                        dimensions
                    );

                    /* After calculating the CSS position invert start and end y positions
                     * since the relative coordinate system use in the map has +y going down
                     */
                    endVec.y *= -1;
                    startVec.y *= -1;

                    let deltaVect = startVec.subtract(endVec);

                    if (length) {
                        deltaVect = deltaVect
                            .normalize()
                            .multiplyScalar(length);
                    }

                    const rulerLength = deltaVect.magnitude();
                    const rulerAngle =
                        Math.atan2(...deltaVect.toArray()) * (180 / Math.PI);

                    return (
                        <div
                            key={`${length}-${i}`}
                            data-type="ruler"
                            className={clsx('absolute origin-top-left w-0.5', {
                                'bg-black text-black': placement === 'inside',
                                'bg-foreground': placement !== 'inside',
                            })}
                            style={{
                                height: `${(rulerLength / maxLength) * 100}%`,
                                ...cssPos,
                                transform: `rotate(${rulerAngle}deg) translate(${
                                    offSet * (placement === 'inside' ? 10 : 0)
                                }px)`,
                            }}>
                            <div
                                className={clsx(
                                    'absolute top-1/2 -translate-y-1/2 max-w-6 text-xs xs:text-base',
                                    {
                                        'right-2': placement === 'left',
                                        'left-2': placement === 'right',
                                        'left-1': placement === 'bottom',
                                        'left-1.5': placement === 'inside',
                                    }
                                )}
                                style={{
                                    transform: `rotate(${rulerAngle * -1}deg)`,
                                }}>{`${rulerLength.toFixed()}"`}</div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-center text-sm sm:text-base">
                {map.zones
                    .filter(({ excludeLegend }) => !excludeLegend)
                    .map(({ name, color }) => {
                        return (
                            <div
                                key={`zone_legend_${name}`}
                                data-type="zone"
                                className="flex leading-none">
                                <span
                                    className={clsx(
                                        'mr-2 inline-block w-[1em] h-[1em]',
                                        color
                                    )}></span>
                                {name}
                            </div>
                        );
                    })}
                {map.objects
                    .filter(({ excludeLegend }) => !excludeLegend)
                    .filter(
                        ({ name }, index, self) =>
                            self.findIndex((obj) => obj.name === name) === index
                    )
                    .map(({ name, color }) => (
                        <div
                            key={`object_legend_${name}`}
                            data-type="object"
                            className="flex leading-none">
                            <span
                                className={clsx(
                                    'mr-2 inline-block w-[1em] h-[1em] rounded-full',
                                    color
                                )}></span>
                            {name}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default DeploymentMapDisplay;
