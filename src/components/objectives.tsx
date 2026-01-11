import { HTMLProps } from 'react';
import { MissionObjectives } from '../../types/mission';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { fromKey } from '@/lib/string_utils';
import clsx from 'clsx';

const ObjectiveCard = ({ children, ...props }: HTMLProps<HTMLDivElement>) => (
    <Card className="max-w-full overflow-x-auto" {...props}>
        <CardHeader>
            <CardTitle className="text-2xl tracking-wide">
                Mission Objectives
            </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const ObjectivesList = ({
    objectives,
    forceUl = false,
    tables,
    ...props
}: {
    objectives: string[];
    forceUl?: boolean;
    tables?: Record<string, Array<Array<string>>>;
} & HTMLProps<HTMLDivElement>) => {
    if (objectives.length === 1 && !forceUl) {
        const obj = objectives[0].trim();

        if (
            /^\[\[objective_table_\d+]]$/.test(obj) &&
            tables &&
            obj in tables
        ) {
            const table = tables[obj];
            return (
                <div {...props}>
                    <table className="border-collapse border border-card-foreground">
                        <thead>
                            <tr className="bg-accent whitespace-nowrap">
                                {table[0].map((header, index) => (
                                    <th
                                        key={index}
                                        className="border p-2 text-accent-foreground border-card-foreground">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {table.slice(1).map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="even:bg-background">
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            colSpan={
                                                row.length < table[0].length &&
                                                cellIndex !== row.length - 1
                                                    ? table[0].length -
                                                      row.length +
                                                      1
                                                    : 1
                                            }
                                            key={cellIndex}
                                            className={clsx('border p-2', {
                                                'bg-secondary text-secondary-foreground border-card-foreground':
                                                    cellIndex ===
                                                    row.length - 1,
                                            })}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return <div {...props}>{obj}</div>;
    }

    return (
        <ul className="list-disc list-inside mt-2 text-left">
            {objectives.map((obj, index) => {
                if (
                    /^\[\[objective_table_\d+]]$/.test(obj) &&
                    tables &&
                    obj in tables
                ) {
                    const table = tables[obj];
                    return (
                        <div
                            className="mt-3 max-w-full overflow-auto border"
                            {...props}
                            key={index}>
                            <table className="border-collapse border-card-foreground">
                                <thead>
                                    <tr className="bg-accent whitespace-nowrap">
                                        {table[0].map((header, index) => (
                                            <th
                                                key={index}
                                                className="border p-2 text-accent-foreground border-card-foreground">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.slice(1).map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className="even:bg-background">
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    colSpan={
                                                        row.length <
                                                            table[0].length &&
                                                        cellIndex !==
                                                            row.length - 1
                                                            ? table[0].length -
                                                              row.length +
                                                              1
                                                            : 1
                                                    }
                                                    key={cellIndex}
                                                    className={clsx(
                                                        'border p-2',
                                                        {
                                                            'bg-secondary text-secondary-foreground border-card-foreground':
                                                                cellIndex ===
                                                                row.length - 1,
                                                        }
                                                    )}>
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
                return <li key={index}>{obj}</li>;
            })}
        </ul>
    );
};

type Props = HTMLProps<HTMLDivElement> & {
    objectivesData: MissionObjectives;
    tables?: Record<string, Array<Array<string>>>;
};

export default function Objectives({
    objectivesData,
    tables,
    ...props
}: Props) {
    if (!objectivesData) return null;

    if (Array.isArray(objectivesData)) {
        return (
            <ObjectiveCard {...props}>
                <ObjectivesList objectives={objectivesData} tables={tables} />
            </ObjectiveCard>
        );
    }

    return (
        <ObjectiveCard {...props}>
            {Object.entries(objectivesData).map(([category, objectives]) => (
                <div key={category} className="mb-4">
                    <h3 className="text-lg font-semibold tracking-wider mb-2">
                        {fromKey(category)}
                    </h3>
                    <ObjectivesList
                        objectives={objectives}
                        tables={tables}
                        forceUl
                    />
                </div>
            ))}
        </ObjectiveCard>
    );
}
