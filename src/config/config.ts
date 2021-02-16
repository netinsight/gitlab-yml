import { GitLabCi } from ".";
import merge from "deepmerge";
import { execSync } from "child_process";

type MacroArgs = {};

Object.defineProperty(RegExp.prototype, "toJSON", {
    value: RegExp.prototype.toString,
});

/**
 * A global OOP-style GitLab CI configurator.
 */
class Config {
    /**
     * Holding the complete GitLab CI configuration as plain object instead
     * of classes so all is done within this class.
     */
    private plain: GitLabCi = {};

    /**
     * `stages` is used to define stages that can be used by jobs and is defined globally.
     *
     * @see https://devowl.io/knowledge-base/success-message-but-when-reloading-the-page-i-do-not-see-a-new-item/
     */
    public stages(...stages: string[]) {
        if (!this.plain.stages) {
            this.plain.stages = [];
        }
        this.plain.stages.push(...stages);
    }

    /**
     * Some parameters can be set globally as the default for all jobs using the `default:` keyword.
     * Default parameters can then be overridden by job-specific configuration.
     *
     * @see https://docs.gitlab.com/ee/ci/yaml/#global-defaults
     */
    public defaults(defaults: GitLabCi["default"]) {
        if (!this.plain.default) {
            this.plain.default = {};
        }
        this.plain.default = merge(this.plain.default, defaults);
    }

    /**
     * GitLab CI/CD allows you to define variables inside .gitlab-ci.yml that are then passed in the job environment.
     * They can be set globally and per-job. When the variables keyword is used on a job level, it will override the global YAML
     * variables and predefined ones of the same name.
     *
     * @see https://docs.gitlab.com/ee/ci/yaml/#variables
     */
    public variable(key: string, value: GitLabCi["variables"][0]) {
        if (!this.plain.variables) {
            this.plain.variables = {};
        }
        this.plain.variables[key] = value;
    }

    /**
     * Get variable from job.
     */
    public getVariable(job: string, key: string) {
        const jobVariable = this.plain.jobs[job]?.variables[key];
        if (jobVariable !== undefined) {
            return jobVariable;
        }

        return this.plain.variables?.[key];
    }

    /**
     * A job is defined as a list of parameters that define the job’s behavior.
     *
     * @see https://docs.gitlab.com/ee/ci/yaml/#configuration-parameters
     * @param name The new job name
     * @param job Job definition
     * @param hidden See https://docs.gitlab.com/ee/ci/yaml/#hide-jobs for more infos
     */
    public job(name: string, job: GitLabCi["jobs"][0], hidden = false) {
        if (!this.plain.jobs) {
            this.plain.jobs = {};
        }

        const useName = hidden && !name.startsWith(".") ? `.${name}` : name;

        if (!this.plain.jobs[useName]) {
            this.plain.jobs[useName] = job;
            // console.log(`Job "${useName}" created successfully!`);
        } else {
            // console.info(`Job "${useName}" already exists, skipping...`);
        }
    }

    /**
     * Get the whole configuration as yaml-serializable object.
     */
    public getPlainObject() {
        let copy = JSON.parse(JSON.stringify(this.plain)) as GitLabCi;

        // Move jobs to root
        copy = {
            ...copy,
            ...copy.jobs,
        };
        delete copy.jobs;

        return copy;
    }
    /**
     * Check if files got changed by a commit by a regexp. E. g. `^\.vscode\/launch\.json$`.
     */
    public async hasChanged(regexp?: RegExp, sha?: string, cwd = process.cwd()) {
        const useSha =
            sha ||
            process.env.CI_COMMIT_SHA ||
            execSync("git rev-parse HEAD", {
                encoding: "utf-8",
                cwd,
            });
        const list = execSync("git diff-tree --no-commit-id --name-only -r " + useSha, {
            encoding: "utf-8",
            cwd,
        }).toString();

        if (!regexp) {
            return list.split("\n");
        }

        return regexp.test(list);
    }
}

type CreateConfigFunction = () => Promise<Config>;
type ExtendConfigFunction = (config: Config) => void;

export { Config, CreateConfigFunction, ExtendConfigFunction, MacroArgs };
