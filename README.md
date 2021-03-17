# comment-on-pr

The DARMA-tasking/comment-on-pr/ is a TypeScript action that can add new one or edit existing comment in given PR thread.

## Workflow example

```yml
name: Add warnings/errors comment

on:
  repository_dispatch:
    types: comment-pr

jobs:
  comment-on-pr:
    runs-on: ubuntu-latest
    name: Comment on a PR
    steps:
      - uses: DARMA-tasking/comment-on-pr@master
        with:
          repo_owner: ${{ github.event.repository.owner.login }}
          repo_name: ${{ github.event.repository.name }}
          pr_number: ${{ github.event.client_payload.pr_number }}
          comment_title: ${{ github.event.client_payload.comment_title }}
          comment_content: ${{ github.event.client_payload.comment_content }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Development

Install the dependencies

```bash
$ npm install
```

Run lint

```bash
$ npm run lint

> comment-on-pr@1.0.0 lint
> eslint src/**/*.ts
```

## Distribution

Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules. Packaging the action will create a packaged action in the `dist/` folder.

Run build

```bash
$ npm run build
```

Since the packaged index.js is run from the `dist/` folder, it needs to be added

```bash
$ git add dist/
```

GitHub Actions will run the entry point from the `action.yml`

```yml
runs:
  using: "node12"
  main: "dist/index.js" # <== entry point
```

To do everything at once (lint, reformat code and build package) do

```bash
$ npm run all
```
