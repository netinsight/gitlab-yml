"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var deepmerge_1 = __importDefault(require("deepmerge"));
var child_process_1 = require("child_process");
Object.defineProperty(RegExp.prototype, "toJSON", {
    value: RegExp.prototype.toString,
});
/**
 * A global OOP-style GitLab CI configurator.
 */
var Config = /** @class */ (function () {
    function Config() {
        /**
         * Holding the complete GitLab CI configuration as plain object instead
         * of classes so all is done within this class.
         */
        this.plain = {};
    }
    /**
     * `stages` is used to define stages that can be used by jobs and is defined globally.
     *
     * @see https://devowl.io/knowledge-base/success-message-but-when-reloading-the-page-i-do-not-see-a-new-item/
     */
    Config.prototype.stages = function () {
        var _a;
        var stages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stages[_i] = arguments[_i];
        }
        if (!this.plain.stages) {
            this.plain.stages = [];
        }
        (_a = this.plain.stages).push.apply(_a, stages);
    };
    /**
     * Some parameters can be set globally as the default for all jobs using the `default:` keyword.
     * Default parameters can then be overridden by job-specific configuration.
     *
     * @see https://docs.gitlab.com/ee/ci/yaml/#global-defaults
     */
    Config.prototype.defaults = function (defaults) {
        if (!this.plain.default) {
            this.plain.default = {};
        }
        this.plain.default = deepmerge_1.default(this.plain.default, defaults);
    };
    /**
     * GitLab CI/CD allows you to define variables inside .gitlab-ci.yml that are then passed in the job environment.
     * They can be set globally and per-job. When the variables keyword is used on a job level, it will override the global YAML
     * variables and predefined ones of the same name.
     *
     * @see https://docs.gitlab.com/ee/ci/yaml/#variables
     */
    Config.prototype.variable = function (key, value) {
        if (!this.plain.variables) {
            this.plain.variables = {};
        }
        this.plain.variables[key] = value;
    };
    /**
     * Get variable from job.
     */
    Config.prototype.getVariable = function (job, key) {
        var _a, _b;
        var jobVariable = (_a = this.plain.jobs[job]) === null || _a === void 0 ? void 0 : _a.variables[key];
        if (jobVariable !== undefined) {
            return jobVariable;
        }
        return (_b = this.plain.variables) === null || _b === void 0 ? void 0 : _b[key];
    };
    /**
     * A job is defined as a list of parameters that define the job’s behavior.
     *
     * @see https://docs.gitlab.com/ee/ci/yaml/#configuration-parameters
     * @param name The new job name
     * @param job Job definition
     * @param hidden See https://docs.gitlab.com/ee/ci/yaml/#hide-jobs for more infos
     */
    Config.prototype.job = function (name, job, hidden) {
        if (hidden === void 0) { hidden = false; }
        if (!this.plain.jobs) {
            this.plain.jobs = {};
        }
        var useName = hidden && !name.startsWith(".") ? "." + name : name;
        if (!this.plain.jobs[useName]) {
            this.plain.jobs[useName] = job;
            // console.log(`Job "${useName}" created successfully!`);
        }
        else {
            // console.info(`Job "${useName}" already exists, skipping...`);
        }
    };
    /**
     * Get the whole configuration as yaml-serializable object.
     */
    Config.prototype.getPlainObject = function () {
        var copy = JSON.parse(JSON.stringify(this.plain));
        // Move jobs to root
        copy = __assign(__assign({}, copy), copy.jobs);
        delete copy.jobs;
        return copy;
    };
    /**
     * Check if files got changed by a commit by a regexp. E. g. `^\.vscode\/launch\.json$`.
     */
    Config.prototype.hasChanged = function (regexp, sha, cwd) {
        if (cwd === void 0) { cwd = process.cwd(); }
        return __awaiter(this, void 0, void 0, function () {
            var useSha, list;
            return __generator(this, function (_a) {
                useSha = sha ||
                    process.env.CI_COMMIT_SHA ||
                    child_process_1.execSync("git rev-parse HEAD", {
                        encoding: "utf-8",
                        cwd: cwd,
                    });
                list = child_process_1.execSync("git diff-tree --no-commit-id --name-only -r " + useSha, {
                    encoding: "utf-8",
                    cwd: cwd,
                }).toString();
                if (!regexp) {
                    return [2 /*return*/, list.split("\n")];
                }
                return [2 /*return*/, regexp.test(list)];
            });
        });
    };
    return Config;
}());
exports.Config = Config;
