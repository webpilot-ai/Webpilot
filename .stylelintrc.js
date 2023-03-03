module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-rational-order'],
  rules: {
    'selector-class-pattern': null,
  },
  overrides: [
    {
      files: ['*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
}
