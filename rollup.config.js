import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
// import VuePlugin from 'rollup-plugin-vue'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		dir: 'public/bundles/',
		format: 'es', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		!production && livereload('public'),
		postcss({
			extract: true,
      plugins: [
				require('tailwindcss'),
				require('autoprefixer')
			]
    }),
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		// VuePlugin(),
		production && replace({ 'process.env.NODE_ENV': `'production'` }),
		!production && replace({ 'process.env.NODE_ENV': `'development'` }),
		production && terser() // minify, but only in production
	]
};
