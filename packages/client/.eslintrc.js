module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:svelte/recommended'],
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  settings: {
    'svelte3/typescript': () => require('typescript')
  }
};