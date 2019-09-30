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

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```
