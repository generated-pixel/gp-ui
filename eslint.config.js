const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', '.angular/**', 'coverage/**', '**/*.d.ts']
  },
  {
    files: ['packages/**/*.ts', 'apps/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      curly: ['error', 'all'],
      'brace-style': 'off', // Turn off so Prettier's newline brace doesn't fail linting
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }]
    }
  },
  {
    files: ['tools/**/*.js', '*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs'
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }]
    }
  }
];
