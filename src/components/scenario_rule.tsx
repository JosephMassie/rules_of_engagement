import { HTMLProps } from 'react';
import { ScenarioSpecialRule } from '../../types/mission';
import { isMissionSkill } from '@/lib/utils';
import { fromKey } from '@/lib/string_utils';
import { Badge } from './ui/badge';
import clsx from 'clsx';

type Props = HTMLProps<HTMLDivElement> & {
    name: string;
    ruleData: ScenarioSpecialRule;
};

export default function ScenarioRule({ name, ruleData, ...props }: Props) {
    if (!ruleData) return null;

    if (isMissionSkill(ruleData)) {
        const isShortSkill = ruleData.skill_type
            .toLowerCase()
            .includes('short skill');

        if (
            !isShortSkill &&
            !ruleData.skill_type.toLowerCase().includes('long skill')
        ) {
            console.error(
                `ScenarioRule: skill_type for "${name}" does not include "short skill" or "long skill":`,
                ruleData.skill_type
            );
        }

        return (
            <div
                className={clsx('p-4', {
                    'bg-secondary text-secondary-foreground': isShortSkill,
                    'bg-accent text-accent-foreground': !isShortSkill,
                })}
                {...props}>
                <h4 className="text-xl font-semibold capitalize">
                    {name}{' '}
                    <span className="text-sm uppercase tracking-wider">
                        : {isShortSkill ? 'Short Skill' : 'Long Skill'}
                    </span>
                </h4>
                <div className="mt-2 space-y-1">
                    <div className="space-x-2">
                        {ruleData.skill_type.split(',').map((type) => {
                            const trimmedType = type.trim().toLowerCase();

                            if (
                                !trimmedType ||
                                ['short skill', 'long skill'].includes(
                                    trimmedType
                                )
                            ) {
                                return null;
                            }

                            return (
                                <Badge
                                    key={trimmedType}
                                    className={clsx(
                                        'capitalize font-semibold tracking-widest',
                                        {
                                            'bg-muted text-muted-foreground':
                                                trimmedType === 'scenario',
                                            'not-dark:bg-red-600 not-dark:text-black':
                                                trimmedType === 'attack',
                                        }
                                    )}>
                                    {trimmedType}
                                </Badge>
                            );
                        })}
                    </div>
                    <div>
                        <div className="font-bold tracking-wider">
                            Requirements:
                        </div>
                        {ruleData.requirements.includes('•') ? (
                            <ul className="list-disc list-inside">
                                {ruleData.requirements
                                    .split('•')
                                    .map((req) => req.trim())
                                    .filter((req) => req)
                                    .map((req, idx) => (
                                        <li key={idx} className="indent-4">
                                            {req}
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <div>{ruleData.requirements}</div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold tracking-wider">Effects:</div>
                        {ruleData.effects.includes('•') ? (
                            <ul className="list-disc list-inside">
                                {ruleData.effects
                                    .split('•')
                                    .map((effect) => effect.trim())
                                    .filter((effect) => effect)
                                    .map((effect, idx) => (
                                        <li key={idx} className="indent-4">
                                            {effect}
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <div>{ruleData.effects}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-l-4 border-accent pl-4" {...props}>
            <h4 className="text-xl font-semibold tracking-wide capitalize">{name}</h4>
            {typeof ruleData === 'string' ? (
                <p className="">{ruleData}</p>
            ) : (
                Object.entries(ruleData).map(([subKey, subValue]) => (
                    <div key={subKey} className="mt-2 space-y-1">
                        <p className="font-semibold">{fromKey(subKey)}</p>
                        <p>{subValue}</p>
                    </div>
                ))
            )}
        </div>
    );
}
