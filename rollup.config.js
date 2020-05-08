export default [
  // CommonJS
  {
    input: 'src/index.js',
    output: { file: 'dist/dispachito.js', format: 'cjs', indent: false },
  },

  // ES
  {
    input: 'src/index.js',
    output: { file: 'dist/dispachito.es.js', format: 'es', indent: false },
  },

  // ES for Browsers
  {
    input: 'src/index.js',
    output: { file: 'dist/dispachito.mjs', format: 'es', indent: false },
  },

  // UMD Development
  {
    input: 'src/index.js',
    output: {
      file: 'dist/dispachito.umd.js',
      format: 'umd',
      name: 'dispachito',
      indent: false,
    },
  },

  // UMD Production
  {
    input: 'src/index.js',
    output: {
      file: 'dist/dispachito.umd.min.js',
      format: 'umd',
      name: 'dispachito',
      indent: false,
    },
  },
];
