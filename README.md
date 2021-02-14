# gitlab-yml

## Usage

### How `extends` work

`node-gitlab-ci` resolves automatically the [`extends`](https://docs.gitlab.com/ee/ci/yaml/#extends) keyword for you so you can fully profit from nested jobs without limitations (e. g. nested `extends` with same keys like `only` are no covered by GitLab CI). This is done a **deep merge** mechanism:

```ts
config.job(
    "only production",
    {
        only: {
            refs: ["master"],
        },
    },
    true
);

config.extends(".only production", "my-job", {
    script: ["echo This job runs only in production!"],
});
```

You can also extend from multiple jobs:

```ts
config.job(
    "common files changed",
    {
        only: {
            changes: ["common/**/*"],
        },
    },
    true
);

config.extends([".only production", ".common files changed"], "my-job", {
    script: ["echo This job runs only in production and when common files got changed!"],
});
```

### How `macro` works

With macros you can define callbacks and consume them with a set of parameters so you can dynamically create jobs with "hard coded" variables. The most excited use case is `only` in a monorepo:

```ts
type EsLintMacroArgs = MacroArgs & {
    prefix: string;
};

config.macro<EsLintMacroArgs>("lint eslint", (self, { prefix }) => {
    config.extends([`.common files changed`, `.lint eslint`], `${prefix} lint eslint`, {
        only: {
            changes: [`packages/${packageName}/{lib,scripts,test}/**/*.{js,jsx,tsx,ts}`],
        },
    });
});
```

And in your package you can use this macro as follow:

```ts
config.from<EsLintMacroArgs>("lint eslint", { prefix: "utils" });
```

### Interact with the GitLab REST API

This package comes with [`@gitbeaker/node`](https://github.com/jdalrymple/gitbeaker) bundled, so you can directly communicate with the [GitLab REST API](https://docs.gitlab.com/ee/api/api_resources.html). The API handler is brought to you with the following functionality:

```typescript
// List last 500 jobs in your project
config.api.Jobs.all(1 /* your project id */, {
    maxPages: 5,
    perPage: 100,
});
```

### Get changed files

If you need to detect changed file while child pipeline generation, you can use the following:

```typescript
const changed = config.hasChanged(); // returns string[]
const specificFileHasChanged = config.hasChanged(/^packages\/my-package\//gm);
```

### Use installed modules

As mentioned previously you can not `import` or `require` any module. If you want to do so, you need to consider the following:

-   Open a Pull Request or Issue [here](https://gitlab.com/devowlio/node-gitlab-ci) and ask to install the module globally in the image
-   Create your own `Dockerfile` with the modules installed globally (e. g. `npm install --global fs-extra`), extended from [this](https://hub.docker.com/r/devowliode/node-gitlab-ci) dockerfile
-   Modify the `ts config` job and install the modules globally or locally

## Todo:

This repository is still in beta phase and the following things should be done:

-   Use [`debug`](https://www.npmjs.com/package/debug) package instead of `console.log`
-   Create GitLab CI with [`semantic-release`](https://www.npmjs.com/package/semantic-release) to automatically publish the package to npmjs.org
-   Create and push docker image through CI instead of hub.docker.com
-   Write Tests

## License

MIT
