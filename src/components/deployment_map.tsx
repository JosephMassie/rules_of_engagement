import { HTMLProps } from 'react';
import type {
    DeploymentMap,
    GameSize,
    MapInsideRuler,
    MapOutsideRuler,
    MapPosition,
} from '../../types/mission';
import clsx from 'clsx';
import { Vector2D } from '@/lib/vector';
import { isInsideMapRuler } from '@/lib/utils';

type Props = HTMLProps<HTMLDivElement> & {
    map: DeploymentMap | null;
    hideGameSize?: boolean;
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
                'w-[80vw] max-w-55 2xs:max-w-65 bg-stone-200 text-black border border-black box-content relative overflow-hidden max-xs:text-xs',
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

const MapRuler = ({
    ruler,
    mapDimensions,
    ...props
}: HTMLProps<HTMLDivElement> & {
    ruler: MapOutsideRuler | MapInsideRuler;
    mapDimensions: MapPosition;
}) => {
    const offSet = 1;
    const [mapWidth, mapHeight] = mapDimensions;
    const longestSide = mapWidth >= mapHeight ? mapWidth : mapHeight;

    if (isInsideMapRuler(ruler)) {
        const { start, end, length } = ruler;

        const startVec = new Vector2D(...start);
        const endVec = new Vector2D(...end);

        const cssPos = positionToCss(startVec.toArray(), mapDimensions);

        /* After calculating the CSS position invert start and end y positions
         * since the relative coordinate system use in the map has +y going down
         */
        endVec.y *= -1;
        startVec.y *= -1;

        let deltaVect = startVec.subtract(endVec);

        // If length is provided set the delta vect's magnitude to it
        if (length) {
            deltaVect = deltaVect.normalize().multiplyScalar(length);
        }

        const rulerLength = deltaVect.magnitude();
        const rulerAngle = Math.atan2(...deltaVect.toArray()) * (180 / Math.PI);

        return (
            <div
                data-type="ruler"
                className="absolute origin-top-left w-0.5 bg-black text-black"
                style={{
                    height: `${(rulerLength / longestSide) * 100}%`,
                    ...cssPos,
                    transform: `rotate(${rulerAngle}deg) translate(${
                        offSet * 10
                    }px)`,
                }}
                {...props}>
                <div
                    className="absolute top-1/2 left-1.5 -translate-y-1/2 max-w-6 text-xs xs:text-base"
                    style={{
                        transform: `rotate(${rulerAngle * -1}deg)`,
                    }}>{`${rulerLength.toFixed()}"`}</div>
            </div>
        );
    }

    /* Apply offset to start and end positions if placement is outside
     * also determine max length for percentage based calculations
     */
    const { placement, start, length } = ruler;
    const isVertical = ['left', 'right'].includes(placement);
    let [x, y] = start;
    let maxLength = longestSide;

    // Style control classes
    let textPlacement = 'right-2';

    switch (placement) {
        case 'left':
            x -= offSet;
            maxLength = mapHeight;
            break;
        case 'right':
            x += offSet;
            maxLength = mapHeight;
            textPlacement = 'left-1';
            break;
        case 'top':
            y -= offSet;
            maxLength = mapWidth;
            textPlacement = 'bottom-0'
            break;
        case 'bottom':
            y += offSet;
            maxLength = mapWidth;
            textPlacement = 'top-0';
            break;
        default:
            console.error('unknown map ruler placement', placement);
    }

    const cssPos = positionToCss([x, y], mapDimensions);
    const cssLength: { width?: string; height?: string } = {};
    if (isVertical) {
        cssLength.height = `${(length / maxLength) * 100}%`;
    } else {
        cssLength.width = `${(length / maxLength) * 100}%`;
    }

    return (
        <div
            data-type="ruler"
            className={clsx('absolute origin-top-left bg-foreground', {
                'w-0.5': isVertical,
                'h-0.5': !isVertical,
            })}
            style={{
                ...cssLength,
                ...cssPos,
            }}
            {...props}>
            <div
                className={clsx(
                    'absolute max-w-6 text-xs xs:text-base',
                    textPlacement,
                    {
                        'top-1/2 -translate-y-1/2': isVertical,
                        'left-1/2 -translate-x-1/2': !isVertical,
                    }
                )}>{`${length.toFixed()}"`}</div>
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

const DeploymentMapDisplay: React.FC<Props> = ({
    map,
    hideGameSize = false,
    ...props
}) => {
    if (!map) {
        return <MapBase dimensions={[48, 48]} {...props}></MapBase>;
    }

    const dimensions = determineMapDimensions(map.gameSizes);
    const [mapWidth, mapHeight] = dimensions;
    const longestSide = mapWidth >= mapHeight ? mapWidth : mapHeight;

    const hasTopRulers =
        map.rulers?.some(({ placement }) => placement === 'top') ?? false;

    return (
        <>
            <div
                className={clsx({
                    'mb-2': !hasTopRulers,
                    'mb-8': hasTopRulers,
                })}>
                {!hideGameSize && (
                    <h3 className="font-semibold">{map.gameSizes}</h3>
                )}
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
                                                        [size * 2, size * 2],
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
                            ({ name, position, size, color }, i) => {
                                console.log(`position`, position);
                                return (
                                    <div
                                        key={`${name}-${i}`}
                                        data-type="object"
                                        className={clsx(
                                            'absolute rounded-full -translate-1/2',
                                            `size-${size}`,
                                            color
                                        )}
                                        style={{
                                            ...positionToCss(
                                                position,
                                                dimensions
                                            ),
                                        }}></div>
                                );
                            }
                        )}
                    </div>
                </MapBase>
                {map.rulers?.map((ruler, i) => (
                    <MapRuler
                        key={`${ruler.length}-${i}`}
                        ruler={ruler}
                        mapDimensions={dimensions}
                    />
                ))}
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
