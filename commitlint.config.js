module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0, 'always', 100], // Turn off line length restrictions
    'subject-case': [0, 'always'], // Be less strict about case
  },
};
