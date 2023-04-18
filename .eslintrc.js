module.exports = {
  root: true,
  extends: ['standard-one/vue', 'standard-one'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        extensions: ['.vue', '.ts', '.tsx', '.d.ts', '.js'],
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {vue: 'never', ts: 'never', tsx: 'never', js: 'never'},
    ],
  },
}
