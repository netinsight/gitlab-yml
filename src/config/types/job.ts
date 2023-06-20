import {
    VariablesDefinition,
    OnlyExpression,
    ExceptExpression,
    ScriptDefinition,
    NeedsDefinition,
    WhenDefinition,
    EnvironmentDefinition,
    TriggerDefinition,
    RulesDefinition,
    GitLabCi,
    ParallelClass,
} from ".";

type JobDefinition = GitLabCi["default"] & {
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#inherit
     */
    inherit?: {
        default?: boolean | string[];
        variables?: boolean | string[];
    };
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#stage
     */
    stage?: string | ".pre" | ".post";
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#extends
     */
    extends?: string[];
    rules?: RulesDefinition;
    variables?: VariablesDefinition;
    script?: ScriptDefinition;

    /** @deprecated not being actively developed. rules is the preferred keyword to control when to add jobs to pipelines. https://docs.gitlab.com/ee/ci/yaml/#only--except */
    only?: OnlyExpression;

    /** @deprecated not being actively developed. rules is the preferred keyword to control when to add jobs to pipelines. https://docs.gitlab.com/ee/ci/yaml/#only--except */
    except?: ExceptExpression;

    needs?: NeedsDefinition;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#dependencies
     */
    dependencies?: string[];
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#allow_failure
     */
    allow_failure?: boolean;
    when?: WhenDefinition;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#whendelayed
     */
    start_in?: string;
    environment?: EnvironmentDefinition;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#coverage
     */
    coverage?: string;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#parallel
     */
    parallel?: ParallelClass | number;
    trigger?: TriggerDefinition;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#resource_group
     */
    resource_group?: string;
};

export { JobDefinition };
