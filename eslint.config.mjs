import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // General Rules
      'no-unused-expressions': 'error',
      'no-throw-literal': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'no-else-return': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
      'padded-blocks': ['error', 'never'],
      'object-shorthand': 'error',
      'no-useless-return': 'error',
      'no-useless-constructor': 'error',
      'no-useless-concat': 'error',
      'prefer-destructuring': ['error', {
        'array': true,
        'object': true,
      }, {
        'enforceForRenamedProperties': false,
      }],
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      // Style Rules
      'max-len': ['error', { 'code': 100 }],
      'indent': ['error', 2],
      'no-tabs': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'brace-style': ['error', '1tbs'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-infix-ops': 'error',
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'array-bracket-spacing': ['error', 'never'],

      // TypeScript-Specific Rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_|req|res|next|err' },
      ],
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
