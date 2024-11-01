import { WhenOptions } from ".";

/**
 * @see https://docs.gitlab.com/ee/ci/yaml/#rules
 */
type RulesDefinition<T = WhenOptions> = Array<{
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#rulesif
     */
    if?: string;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#ruleschanges
     */
    changes?: string[];
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#rulesexists
     */
    exists?: string;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#permitted-attributes
     */
    when?: T;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#permitted-attributes
     */
    start_in?: string;
    /**
     * @see https://docs.gitlab.com/ee/ci/yaml/#rulesallow_failure
     */
    allow_failure?: boolean;
}>;

export { RulesDefinition };
