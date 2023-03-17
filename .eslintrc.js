module.exports = {
  root: true,
  env: {
    browser: true,
  },
  ignorePatterns: ['!.*.js'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@assets', './assets'],
        ],
        extensions: ['.js,ts,tsx'],
      },
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard-jsx',
    'standard-react',
    'plugin:react/jsx-runtime',
    'standard',
    'plugin:prettier/recommended',
  ],
  globals: {
    chrome: 'readonly',
  },
  rules: {
    'react/prop-types': 'off',
    'react/no-unknown-property': ['error', {ignore: ['jsx', 'global']}],
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        distinctGroup: true,
        pathGroups: [
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
        ],
      },
    ],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        bracketSpacing: false,
        printWidth: 100,
        semi: false,
        singleQuote: true,
      },
    ],
  },
}
