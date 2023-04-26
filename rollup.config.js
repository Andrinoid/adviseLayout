const pkg = require('./package.json');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const externalPeer = require('rollup-plugin-peer-deps-external');

module.exports = {
  input: 'src/Layout/index.js',
  output: [
    {
      file: pkg.main,
      format: 'esm',
      exports: 'named',
      sourcemap: true,
      strict: false,
      dir: 'build'
    }
  ],
  plugins: [babel({ babelHelpers: 'bundled' }), resolve(), commonjs(), externalPeer()],
}