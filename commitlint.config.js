export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only changes
        'style',    // Changes that don't affect code meaning (formatting, etc)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvements
        'test',     // Adding or updating tests
        'chore',    // Changes to build process or auxiliary tools
        'ci',       // CI/CD changes
        'build',    // Changes affecting build system or dependencies
        'revert',   // Reverts a previous commit
      ],
    ],
  },
}
