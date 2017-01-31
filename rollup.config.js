import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
	entry: "src/app.js",
	format: "cjs",
	dest: "dist/app.js",
	format: "iife",
	sourceMap: true,
	plugins: [
		nodeResolve(),
		commonjs(),
		babel({
			babelrc: false,
			exclude: "node_modules/**",
			presets: "es2015-rollup"
		})
	]
}