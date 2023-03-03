module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
  },
  ignorePatterns: ['!.*.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {version: 'detect'},
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
  // plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard',
    'standard-jsx',
    'standard-react',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
  ],
  globals: {
    chrome: 'readonly',
  },
  rules: {
    'react/prop-types': 'off',
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
