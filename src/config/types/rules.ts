import { WhenOptions } from ".";

/**
 * @see https://docs.gitlab.com/ee/ci/yaml/#rules
 */
type RulesDefinition<T = WhenOptions> = Array<{
    /**
     * @see https://docs.gitlab.com/ci/yaml/#rulesif
     */
    if?: string;
    /**
     * @see https://docs.gitlab.com/ci/yaml/#ruleschanges
     */
    changes?: string[];
    /**
     * @see https://docs.gitlab.com/ci/yaml/#rulesexists
     */
    exists?: string;
    /**
     * @see https://docs.gitlab.com/ci/yaml/#ruleswhen
     */
    when?: T;
    /**
     * @see https://docs.gitlab.com/ci/yaml/#rulesallow_failure
     */
    allow_failure?: boolean;
}>;

export { RulesDefinition };
