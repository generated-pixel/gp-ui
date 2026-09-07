# gp-analytics migration

The gp-analytics repository was merged into gp-ui from commit
`4f3e9d6` (the local `main` branch). The merge retains the original commit IDs
and both repositories' ancestry; it is not a squash or a rewritten history.

The active library now lives at `../../packages/gp-analytics` and uses the
root npm workspace, Angular configuration, lockfile, build, and test commands.
Its package name remains `gp-analytics` and its version remains `0.1.0`.
It is built and tested with the monorepo, but remains outside the existing
gp-ui suite's synchronized version bumps and publish-all list.

All other tracked files from the old repository are preserved here, including
the demo at `apps/demo`. These are migration reference files, not an active
nested workspace. Their original relative paths to the library are historical.
Do not run npm install, build, or serve from this directory.

From the gp-ui repository root:

```sh
npm ci
npm run build:analytics
npm run test:analytics
```

The build command builds gp-ui and gp-grid before analytics. Output is written
to `dist/packages/gp-analytics`. `npm run build`, `npm test`, and `npm run lint`
also include analytics. Analytics has its own test target because its services
use constructor parameter decorators; its TypeScript configs enable those
without changing the other packages' compiler settings.

The next migration step is to integrate the preserved `apps/demo/src/app` into
`../../apps/gp-ui-demo`, including demo navigation, theme configuration, and
utility CSS generation. The demos have not yet been combined.

History remains accessible from the merged branch:

```sh
git log --all --graph --oneline
git log --full-history -- packages/gp-analytics
git show 4f3e9d6:apps/demo/src/app/app.ts
```

When integrating this migration branch, use a merge or fast-forward. A squash
or rebase would discard the merge ancestry that preserves the second repository.
The original gp-analytics checkout and GitHub repository have not been removed.
