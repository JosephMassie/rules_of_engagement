'use client';

import { useState } from 'react';
import type {
    DeploymentMap,
    GameSize,
    MapInsideRuler,
    MapPosition,
    MapRulerPlacement,
    MapShape,
} from '../../../types/mission';
import DeploymentMapDisplay from '@/components/deployment_map';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { FaTrashAlt } from 'react-icons/fa';
import SingleFieldForm from '@/components/single_field_form';
import clsx from 'clsx';
import { Input } from '@/components/ui/input';
import { isInsideMapRuler } from '@/lib/utils';

const availableColors = [
    'bg-red-600',
    'bg-orange-600',
    'bg-amber-600',
    'bg-yellow-600',
    'bg-lime-600',
    'bg-green-600',
    'bg-cyan-600',
    'bg-blue-600',
    'bg-violet-600',
    'bg-fuchsia-600',
    'exclusion-zone',
];

export default function MapBuilder() {
    const [map, setMap] = useState<DeploymentMap>({
        gameSizes: '300P / 350P / 400P',
        zones: [],
        objects: [],
    });

    return (
        <>
            <h1 className="mb-8 text-2xl md:text-3xl font-decorative">
                Deployment Map Builder
            </h1>
            <div className="flex flex-col items-center justify-center">
                <DeploymentMapDisplay map={map} />

                <div className="mt-4 grid gap-4">
                    <div className="flex gap-2">
                        <Label>Game Size(s)</Label>
                        <Select
                            value={map?.gameSizes ?? ''}
                            onValueChange={(value) =>
                                setMap((prev) => ({
                                    ...prev,
                                    gameSizes: value as GameSize,
                                }))
                            }>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Game Size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="150P">150P</SelectItem>
                                <SelectItem value="200P / 250P">
                                    200P / 250P
                                </SelectItem>
                                <SelectItem value="300P / 350P / 400P">
                                    300P / 350P / 400P
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={() =>
                            setMap((prev) => {
                                const zones = prev.zones;

                                return {
                                    ...prev,
                                    zones: [
                                        ...zones,
                                        {
                                            name: 'zone',
                                            color: '',
                                            shape: 'full-width',
                                            size: 1,
                                            position: [0, 0],
                                        },
                                    ],
                                };
                            })
                        }>
                        Add Zone
                    </Button>
                    <div className="grid gap-2">
                        <h2 className="font-decorative tracking-wider">
                            Zones
                        </h2>
                        {map.zones.map((zone, i) => {
                            return (
                                <div
                                    key={`${zone.name}-${i}`}
                                    className="flex gap-2">
                                    <SingleFieldForm
                                        fieldVal={zone.name}
                                        onSubmit={(event) => {
                                            event.preventDefault();

                                            const data = new FormData(
                                                event.target as HTMLFormElement
                                            );

                                            setMap((prev) => {
                                                const zones = prev.zones.map(
                                                    (z, j) => {
                                                        if (j !== i) return z;
                                                        return {
                                                            ...z,
                                                            name: data.get(
                                                                'field_val'
                                                            ) as string,
                                                        };
                                                    }
                                                );

                                                return { ...prev, zones };
                                            });
                                        }}
                                    />

                                    <Label>Shape:</Label>
                                    <Select
                                        value={zone.shape}
                                        onValueChange={(shape: MapShape) =>
                                            setMap((prev) => {
                                                const zones = prev.zones.map(
                                                    (z, j) => {
                                                        if (j !== i) return z;
                                                        return {
                                                            ...z,
                                                            shape,
                                                        };
                                                    }
                                                );

                                                return { ...prev, zones };
                                            })
                                        }>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                'full-width',
                                                'circle',
                                                'box',
                                                'horiz-line',
                                                'vert-line',
                                                'diag-line',
                                                'diag-line-flipped',
                                            ].map((shape) => (
                                                <SelectItem
                                                    key={shape}
                                                    value={shape}>
                                                    {shape}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`z-x-${i}`}>X:</Label>
                                        <Input
                                            id={`z-x-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={zone.position[0]}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const zones =
                                                        prev.zones.map(
                                                            (z, j) => {
                                                                if (j !== i)
                                                                    return z;
                                                                return {
                                                                    ...z,
                                                                    position: [
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                            0,
                                                                        z
                                                                            .position[1],
                                                                    ] as MapPosition,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, zones };
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`z-y-${i}`}>Y:</Label>
                                        <Input
                                            id={`z-y-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={zone.position[1]}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const zones =
                                                        prev.zones.map(
                                                            (z, j) => {
                                                                if (j !== i)
                                                                    return z;
                                                                return {
                                                                    ...z,
                                                                    position: [
                                                                        z
                                                                            .position[0],
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                            0,
                                                                    ] as MapPosition,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, zones };
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`z-size-${i}`}>
                                            Size:
                                        </Label>
                                        <Input
                                            id={`z-size-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={zone.size}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const zones =
                                                        prev.zones.map(
                                                            (z, j) => {
                                                                if (j !== i)
                                                                    return z;
                                                                return {
                                                                    ...z,
                                                                    size:
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                        0,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, zones };
                                                });
                                            }}
                                        />
                                    </div>

                                    <Select
                                        value={zone.color}
                                        onValueChange={(color) => {
                                            setMap((prev) => {
                                                const zones = prev.zones.map(
                                                    (z, j) => {
                                                        if (j !== i) return z;
                                                        return {
                                                            ...z,
                                                            color,
                                                        };
                                                    }
                                                );

                                                return { ...prev, zones };
                                            });
                                        }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pick a Color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableColors.map((color) => (
                                                <SelectItem
                                                    key={color}
                                                    value={color}
                                                    className="">
                                                    <div
                                                        className={clsx(
                                                            'inline-block size-6',
                                                            { [color]: !!color }
                                                        )}></div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setMap((prev) => {
                                                const zones = prev.zones.filter(
                                                    (_, j) => j !== i
                                                );

                                                return { ...prev, zones };
                                            });
                                        }}>
                                        <FaTrashAlt />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        onClick={() =>
                            setMap((prev) => {
                                const objects = prev.objects;

                                return {
                                    ...prev,
                                    objects: [
                                        ...objects,
                                        {
                                            name: 'object',
                                            color: '',
                                            size: 4,
                                            position: [0, 0],
                                        },
                                    ],
                                };
                            })
                        }>
                        Add Object
                    </Button>
                    <div className="grid gap-2">
                        <h2 className="font-decorative tracking-wider">
                            Objects
                        </h2>
                        {map.objects.map((obj, i) => {
                            return (
                                <div
                                    key={`${obj.name}-${i}`}
                                    className="flex gap-2">
                                    <SingleFieldForm
                                        fieldVal={obj.name}
                                        onSubmit={(event) => {
                                            event.preventDefault();

                                            const data = new FormData(
                                                event.target as HTMLFormElement
                                            );

                                            setMap((prev) => {
                                                const objects =
                                                    prev.objects.map((o, j) => {
                                                        if (j !== i) return o;
                                                        return {
                                                            ...o,
                                                            name: data.get(
                                                                'field_val'
                                                            ) as string,
                                                        };
                                                    });

                                                return { ...prev, objects };
                                            });
                                        }}
                                    />

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`x-${i}`}>X:</Label>
                                        <Input
                                            id={`x-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={obj.position[0]}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const objects =
                                                        prev.objects.map(
                                                            (o, j) => {
                                                                if (j !== i)
                                                                    return o;
                                                                return {
                                                                    ...o,
                                                                    position: [
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                            0,
                                                                        o
                                                                            .position[1],
                                                                    ] as MapPosition,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, objects };
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`y-${i}`}>Y:</Label>
                                        <Input
                                            id={`y-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={obj.position[1]}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const objects =
                                                        prev.objects.map(
                                                            (o, j) => {
                                                                if (j !== i)
                                                                    return o;
                                                                return {
                                                                    ...o,
                                                                    position: [
                                                                        o
                                                                            .position[0],
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                            0,
                                                                    ] as MapPosition,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, objects };
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`size-${i}`}>
                                            Size:
                                        </Label>
                                        <Input
                                            id={`size-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={obj.size}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const objects =
                                                        prev.objects.map(
                                                            (o, j) => {
                                                                if (j !== i)
                                                                    return o;
                                                                return {
                                                                    ...o,
                                                                    size:
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                        0,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, objects };
                                                });
                                            }}
                                        />
                                    </div>

                                    <Select
                                        value={obj.color}
                                        onValueChange={(color) => {
                                            setMap((prev) => {
                                                const objects =
                                                    prev.objects.map((o, j) => {
                                                        if (j !== i) return o;
                                                        return {
                                                            ...o,
                                                            color,
                                                        };
                                                    });

                                                return { ...prev, objects };
                                            });
                                        }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pick a Color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableColors.map((color) => (
                                                <SelectItem
                                                    key={color}
                                                    value={color}
                                                    className="">
                                                    <div
                                                        className={clsx(
                                                            'inline-block size-6',
                                                            { [color]: !!color }
                                                        )}></div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setMap((prev) => {
                                                const objects =
                                                    prev.objects.filter(
                                                        (_, j) => j !== i
                                                    );

                                                return { ...prev, objects };
                                            });
                                        }}>
                                        <FaTrashAlt />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        onClick={() =>
                            setMap((prev) => {
                                const rulers = prev.rulers ?? [];

                                return {
                                    ...prev,
                                    rulers: [
                                        ...rulers,
                                        {
                                            length: 1,
                                            start: [0, 0],
                                            placement: 'left',
                                        },
                                    ],
                                };
                            })
                        }>
                        Add Ruler
                    </Button>
                    <div className="grid gap-2">
                        <h2 className="font-decorative tracking-wider">
                            Rulers
                        </h2>
                        {map.rulers?.map((ruler, i) => {
                            return (
                                <div
                                    key={`${ruler.length}-${i}`}
                                    className="flex gap-2">
                                    <Select
                                        value={ruler.placement}
                                        onValueChange={(
                                            place: MapRulerPlacement
                                        ) =>
                                            setMap((prev) => {
                                                const rulers = prev.rulers?.map(
                                                    (r, j) => {
                                                        if (j !== i) return r;

                                                        if (
                                                            place === 'inside'
                                                        ) {
                                                            return {
                                                                ...r,
                                                                placement:
                                                                    place,
                                                                end: !isInsideMapRuler(
                                                                    r
                                                                )
                                                                    ? ([
                                                                          1, 1,
                                                                      ] as MapPosition)
                                                                    : r.end,
                                                            };
                                                        }

                                                        if (
                                                            isInsideMapRuler(r)
                                                        ) {
                                                            const {
                                                                length,
                                                                start,
                                                            } = r;

                                                            return {
                                                                start,
                                                                length:
                                                                    length ?? 1,
                                                                placement:
                                                                    place,
                                                            };
                                                        }

                                                        return {
                                                            ...r,
                                                            placement: place,
                                                        };
                                                    }
                                                );

                                                return { ...prev, rulers };
                                            })
                                        }>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                'inside',
                                                'top',
                                                'bottom',
                                                'left',
                                                'right',
                                            ].map((place) => (
                                                <SelectItem
                                                    key={place}
                                                    value={place}>
                                                    {place}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <SingleFieldForm
                                        fieldVal={ruler.length ?? 0}
                                        onSubmit={(event) => {
                                            event.preventDefault();

                                            const data = new FormData(
                                                event.target as HTMLFormElement
                                            );

                                            setMap((prev) => {
                                                const rulers = prev.rulers?.map(
                                                    (r, j) => {
                                                        if (j !== i) return r;
                                                        return {
                                                            ...r,
                                                            length: parseInt(
                                                                (data.get(
                                                                    'field_val'
                                                                ) as string) ??
                                                                    0
                                                            ) as number,
                                                        };
                                                    }
                                                );

                                                return { ...prev, rulers };
                                            });
                                        }}
                                    />

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`rs-x-${i}`}>SX:</Label>
                                        <Input
                                            id={`rs-x-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={ruler.start[0]}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const rulers =
                                                        prev.rulers?.map(
                                                            (r, j) => {
                                                                if (j !== i)
                                                                    return r;
                                                                return {
                                                                    ...r,
                                                                    start: [
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                            0,
                                                                        r
                                                                            .start[1],
                                                                    ] as MapPosition,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, rulers };
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-0.5">
                                        <Label htmlFor={`rs-y-${i}`}>SY:</Label>
                                        <Input
                                            id={`rs-y-${i}`}
                                            type="number"
                                            className="w-8 px-1 text-sm text-center"
                                            value={ruler.start[1]}
                                            onChange={(event) => {
                                                setMap((prev) => {
                                                    const rulers =
                                                        prev.rulers?.map(
                                                            (r, j) => {
                                                                if (j !== i)
                                                                    return r;
                                                                return {
                                                                    ...r,
                                                                    position: [
                                                                        r
                                                                            .start[0],
                                                                        event
                                                                            .target
                                                                            .valueAsNumber ||
                                                                            0,
                                                                    ] as MapPosition,
                                                                };
                                                            }
                                                        );

                                                    return { ...prev, rulers };
                                                });
                                            }}
                                        />
                                    </div>

                                    {ruler.placement === 'inside' &&
                                        ruler.end && (
                                            <>
                                                <div className="flex gap-0.5">
                                                    <Label
                                                        htmlFor={`re-x-${i}`}>
                                                        EX:
                                                    </Label>
                                                    <Input
                                                        id={`re-x-${i}`}
                                                        type="number"
                                                        className="w-8 px-1 text-sm text-center"
                                                        value={ruler.end[0]}
                                                        onChange={(event) => {
                                                            setMap((prev) => {
                                                                const rulers =
                                                                    prev.rulers?.map(
                                                                        (
                                                                            r,
                                                                            j
                                                                        ) => {
                                                                            if (
                                                                                j !==
                                                                                i
                                                                            )
                                                                                return r;
                                                                            return {
                                                                                ...r,
                                                                                end: [
                                                                                    event
                                                                                        .target
                                                                                        .valueAsNumber ||
                                                                                        0,
                                                                                    (
                                                                                        r as MapInsideRuler
                                                                                    )
                                                                                        .end[1],
                                                                                ] as MapPosition,
                                                                            };
                                                                        }
                                                                    );

                                                                return {
                                                                    ...prev,
                                                                    rulers,
                                                                };
                                                            });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex gap-0.5">
                                                    <Label
                                                        htmlFor={`re-y-${i}`}>
                                                        EY:
                                                    </Label>
                                                    <Input
                                                        id={`re-y-${i}`}
                                                        type="number"
                                                        className="w-8 px-1 text-sm text-center"
                                                        value={ruler.end[1]}
                                                        onChange={(event) => {
                                                            setMap((prev) => {
                                                                const rulers =
                                                                    prev.rulers?.map(
                                                                        (
                                                                            r,
                                                                            j
                                                                        ) => {
                                                                            if (
                                                                                j !==
                                                                                i
                                                                            )
                                                                                return r;
                                                                            return {
                                                                                ...r,
                                                                                position:
                                                                                    [
                                                                                        (
                                                                                            r as MapInsideRuler
                                                                                        )
                                                                                            .end[0],
                                                                                        event
                                                                                            .target
                                                                                            .valueAsNumber ||
                                                                                            0,
                                                                                    ] as MapPosition,
                                                                            };
                                                                        }
                                                                    );

                                                                return {
                                                                    ...prev,
                                                                    rulers,
                                                                };
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}

                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setMap((prev) => {
                                                const rulers =
                                                    prev.rulers?.filter(
                                                        (_, j) => j !== i
                                                    );

                                                return { ...prev, rulers };
                                            });
                                        }}>
                                        <FaTrashAlt />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Collapsible className="mt-4 bg-card text-card-foreground">
                    <CollapsibleTrigger asChild>
                        <Button className="w-full" variant="secondary">
                            See JSON
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-2">
                        <Button
                            className="mb-2"
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    JSON.stringify(map)
                                )
                            }>
                            Copy
                        </Button>
                        <p>{JSON.stringify(map)}</p>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </>
    );
}
