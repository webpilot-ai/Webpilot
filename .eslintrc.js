module.exports = {
  root: true,
  env: {webextensions: true},
  extends: ['standard-one/vue', 'standard-one'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'import/no-unresolved': [2, {ignore: ['data-url:', 'data-base64:']}],
  },
}
