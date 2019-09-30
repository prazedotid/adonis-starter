# Adonis Custom Starter

This is a customized boilerplate of Adonis.js API blueprint. This boilerplate comes with:
1. CRUD Service
2. Lucid Model Integration with Validation
3. Soft Delete Implementation
4. Starter File Generator Commands
5. Standardized Response w/ Internationalization
6. Basic Exception Handlers
7. Request Logger Middleware
8. Custom Providers
9. Conventional Commit Hooks

## Setup

1. Clone the repo using git and run `npm install` or `yarn install`.
2. Generate app key using `adonis key:generate`.
3. Create model with validation `adonis starter:model <modelName>` example : `adonis starter:model profile`
4. Create generate crud controller `adonis starter:crud <modelName>` example : `adonis starter:crud profile` 

## Conventional Commit

1. fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in semantic versioning).
2. feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in semantic versioning).
3. BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in semantic versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the the Angular convention) recommends build:, chore:, ci:',docs:,style:,refactor:,perf:,test:, and others.
4. footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.

example: `git commit`

fix: fix error login user

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```
