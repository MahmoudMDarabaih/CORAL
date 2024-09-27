# ESLint Rules Documentation

This document explains the ESLint rules enforced in our project and the rationale behind each rule. Adhering to these rules helps maintain a consistent code style and promotes best practices.

## Note:
- If you have issues with the code formatting each time you save a file or do a change, you need to stop the formate on save on your code editor.
### in VS Code:
- Go to settings => Text Editor => Formatting => un check the "Formate On Save"
- Save and sync the changes.


## General Rules

### `semi`

- **Description**: Enforces the use of semicolons at the end of statements.
- **Rule**: `semi: ['error', 'always']`
- **Purpose**: Prevents potential errors and enforces consistent syntax.

### `quotes`

- **Description**: Enforces the use of single quotes for strings.
- **Rule**: `quotes: ['error', 'single']`
- **Purpose**: Maintains consistency in string syntax.

### `eqeqeq`

- **Description**: Requires the use of `===` and `!==` instead of `==` and `!=`.
- **Rule**: `eqeqeq: ['error', 'always']`
- **Purpose**: Avoids type coercion issues and potential bugs.

### `curly`

- **Description**: Enforces consistent brace style for all control statements.
- **Rule**: `curly: ['error', 'all']`
- **Purpose**: Enhances code readability and prevents logical errors.

### `no-console`

- **Description**: Warns when `console` statements are used.
- **Rule**: `no-console: 'warn'`
- **Purpose**: Encourages the use of proper logging mechanisms and cleaner code for production.

### `no-debugger`

- **Description**: Disallows the use of `debugger` statements.
- **Rule**: `no-debugger: 'error'`
- **Purpose**: Prevents accidental debugger statements in production code.

### `no-duplicate-imports`

- **Description**: Disallows duplicate imports.
- **Rule**: `no-duplicate-imports: 'error'`
- **Purpose**: Avoids redundancy and potential import conflicts.

### `no-var`

- **Description**: Disallows the use of `var`; prefer `let` or `const`.
- **Rule**: `no-var: 'error'`
- **Purpose**: Encourages the use of block-scoped variables for better code quality.

### `prefer-const`

- **Description**: Suggests using `const` if a variable is not reassigned.
- **Rule**: `prefer-const: 'error'`
- **Purpose**: Promotes immutability and clearer intent.

## Style Rules

### `arrow-parens`

- **Description**: Requires parentheses around arrow function arguments.
- **Rule**: `arrow-parens: ['error', 'always']`
- **Purpose**: Enhances readability and consistency.

### `brace-style`

- **Description**: Enforces consistent brace style (1TBS).
- **Rule**: `brace-style: ['error', '1tbs']`
- **Purpose**: Improves readability and consistency.

### `comma-dangle`

- **Description**: Requires trailing commas in multiline objects and arrays.
- **Rule**: `comma-dangle: ['error', 'always-multiline']`
- **Purpose**: Simplifies adding new elements and improves version control diffs.

### `no-trailing-spaces`

- **Description**: Disallows trailing whitespace at the end of lines.
- **Rule**: `no-trailing-spaces: 'error'`
- **Purpose**: Prevents unnecessary whitespace and ensures cleaner diffs.

### `eol-last`

- **Description**: Enforces at least one newline at the end of files.
- **Rule**: `eol-last: ['error', 'always']`
- **Purpose**: Improves compatibility with various tools and version control systems.

### `space-before-function-paren`

- **Description**: Disallows space before function parentheses.
- **Rule**: `space-before-function-paren: ['error', 'never']`
- **Purpose**: Ensures consistent spacing in function declarations and expressions.

### `keyword-spacing`

- **Description**: Enforces consistent spacing before and after keywords.
- **Rule**: `keyword-spacing: ['error', { 'before': true, 'after': true }]`
- **Purpose**: Enhances readability and consistency.

### `space-infix-ops`

- **Description**: Requires spacing around infix operators.
- **Rule**: `space-infix-ops: 'error'`
- **Purpose**: Ensures readability and consistency in expressions.

### `key-spacing`

- **Description**: Enforces consistent spacing between keys and values in objects.
- **Rule**: `key-spacing: ['error', { 'beforeColon': false, 'afterColon': true }]`
- **Purpose**: Enhances readability and consistency in object literals.

### `object-curly-spacing`

- **Description**: Enforces consistent spacing inside braces of object literals.
- **Rule**: `object-curly-spacing: ['error', 'always']`
- **Purpose**: Improves readability and consistency.

### `array-bracket-spacing`

- **Description**: Disallows spacing inside array brackets.
- **Rule**: `array-bracket-spacing: ['error', 'never']`
- **Purpose**: Ensures consistent array syntax and readability.

## TypeScript-Specific Rules

### `@typescript-eslint/explicit-function-return-type`

- **Description**: Disallows explicit return types on functions.
- **Rule**: `@typescript-eslint/explicit-function-return-type: 'off'`
- **Purpose**: Allows flexibility in return type inference.

### `@typescript-eslint/no-explicit-any`

- **Description**: Warns when `any` type is used.
- **Rule**: `@typescript-eslint/no-explicit-any: 'warn'`
- **Purpose**: Encourages the use of more specific types.

### `@typescript-eslint/no-unused-vars`

- **Description**: Disallows unused variables.
- **Rule**: `@typescript-eslint/no-unused-vars: ['error', { 'argsIgnorePattern': '^_' }]`
- **Purpose**: Prevents clutter in the codebase and potential errors.

### `@typescript-eslint/no-empty-function`

- **Description**: Disallows empty functions.
- **Rule**: `@typescript-eslint/no-empty-function: 'error'`
- **Purpose**: Ensures functions have meaningful implementations.

### `@typescript-eslint/no-inferrable-types`

- **Description**: Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean.
- **Rule**: `@typescript-eslint/no-inferrable-types: 'error'`
- **Purpose**: Encourages type inference and cleaner code.

### `@typescript-eslint/explicit-module-boundary-types`

- **Description**: Warns when function or class method does not have an explicit return type.
- **Rule**: `@typescript-eslint/explicit-module-boundary-types: 'warn'`
- **Purpose**: Promotes explicit type definitions for better code clarity.

---

By following these rules, we ensure our codebase is consistent, maintainable, and adheres to best practices. If you have any questions or suggestions about these rules, please feel free to discuss them with the team.
