module.exports = {
  input: {
    path: './src', // only files in this directory are considered for extraction
    include: ['**/*.vue', '**/*.ts', '**/*.js'],
    exclude: [],
    compileTemplate: true, // do not compile <template> tag when its lang is not html
  },
  output: {
    path: './scripts/i18n/gettextOutput/', // output path of all created files
    locales: ['en'],
    flat: true, // don't create subdirectories for locales
    linguas: false, // create a LINGUAS file
  },
}
