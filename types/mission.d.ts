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
    };
    scenario_special_rules: Record<string, ScenarioSpecialRule>;
    end_of_mission: string;
};

export type SeasonData = {
    name: string;
    version: string;
    missions: Array<MissionData>;
};
