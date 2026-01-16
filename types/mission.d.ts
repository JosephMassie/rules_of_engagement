export type GameSize = '150P' | '200P / 250P' | '300P / 350P / 400P';

export type MapPosition = [number, number];

export type DeploymentMap = {
    zones: Array<{
        name: string;
        color: string;
        position: MapPosition;
        size: number;
        shape:
            | 'full-width'
            | 'circle'
            | 'box'
            | 'horiz-line'
            | 'vert-line'
            | 'diag-line'
            | 'diag-line-flipped';
        excludeLegend?: boolean;
        hideName?: boolean;
    }>;
    objects: Array<{
        name: string;
        position: MapPosition;
        size: number;
        color: string;
        excludeLegend?: boolean;
    }>;
    gameSizes: GameSize;
    rulers?: Array<{
        length?: number;
        placement: 'left' | 'right' | 'top' | 'bottom' | 'inside';
        start: MapPosition;
        end: MapPosition;
    }>;
};

export type DeploymentTableEntry = {
    army_points: number;
    swc: number;
    table_size: string;
    deployment_zone: string;
};

export type MissionSkill = {
    name: string;
    skill_type: string;
    requirements: string;
    effects: string;
};

export type ScenarioSpecialRule =
    | string
    | MissionSkill
    | Record<string, string>;

export type MissionObjectives = Record<string, Array<string>> | Array<string>;

export type MissionData = {
    name: string;
    type: 'ITS Scenario' | 'Direct Action' | 'Custom';
    tables: Record<string, Array<Array<string>>>;
    tactical_support_options: number;
    suitable_for_reinforcements: boolean;
    mission_objectives: MissionObjectives;
    forces_and_deployment: {
        sides: string;
        deployment_table: Array<DeploymentTableEntry>;
        special_notes: Array<string>;
        maps?: Array<DeploymentMap>;
    };
    scenario_special_rules: Record<string, ScenarioSpecialRule>;
    end_of_mission: string;
};

export type SeasonData = {
    name: string;
    version: string;
    missions: Array<MissionData>;
};
