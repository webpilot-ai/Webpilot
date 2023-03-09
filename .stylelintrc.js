module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-rational-order',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'selector-class-pattern': null,
  },
  overrides: [
    {
      files: ['*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['src/**/*.{ts,tsx}'],
      customSyntax: 'postcss-styled-syntax',
    },
  ],
}
