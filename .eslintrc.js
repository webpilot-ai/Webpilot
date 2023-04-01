module.exports = {
  root: true,
  env: {
    browser: true,
  },
  ignorePatterns: ['!.*.js'],
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
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
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
