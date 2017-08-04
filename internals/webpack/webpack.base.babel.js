// @noflow
/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')

// PostCSS plugins
const cssnext = require('postcss-cssnext')
const postcssFocus = require('postcss-focus')
const postcssReporter = require('postcss-reporter')
const postcssImport = require('postcss-partial-import')
const postcssNesting = require('postcss-nesting')

const generateClassName = (localName, resourcePath) => {
	const componentType = resourcePath.split('/').slice(-3, -2)
	const componentName = resourcePath.split('/').slice(-2, -1)
	return componentType + '_' + componentName + '_' + localName // eslint-disable-line
}

module.exports = (options) => ({
	entry: options.entry,
	output: Object.assign({ // Compile into js/build.js
		path: path.resolve(process.cwd(), 'build'),
		publicPath: '/',
	}, options.output), // Merge with env dependent settings
	module: {
		rules: [
			{
				test: /\.js$/, // Transform all .js files required somewhere with Babel
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: options.babelQuery,
			}, {
				test: /\.css$/,
				include: [/node_modules/, /app/],
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: '[path]__[local]',
							getLocalIdent: (context, localIdentName, localName, options) =>
								generateClassName(localName, context.resourcePath)
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: function () {
								return [
									postcssImport(),
									postcssNesting(),
									postcssFocus(),
									cssnext({
										browsers: ['last 2 versions', 'IE >= 10'],
									}),
									postcssReporter({
										clearMessages: true,
									})
								]
							}
						}
					}
				],
			}, {
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader',
			}, {
				test: /\.(jpg|png|gif)$/,
				loaders: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						query: {
							progressive: true,
							optimizationLevel: 7,
							interlaced: false,
							pngquant: {
								quality: '65-90',
								speed: 4,
							},
						},
					},
				],
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
			},
			{
				test: /\.(mp4|webm)$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
				},
			}
		],
	},
	plugins: options.plugins.concat([
		new webpack.ProvidePlugin({
      // make fetch available
			fetch: 'exports-loader?self.fetch!whatwg-fetch',
		}),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),
		new webpack.NamedModulesPlugin(),
	]),
	resolve: {
		modules: ['app', 'node_modules'],
		extensions: [
			'.js',
			'.jsx',
			'.react.js',
		],
		mainFields: [
			'browser',
			'jsnext:main',
			'main',
		],
	},
	devtool: options.devtool,
	target: 'web', // Make web variables accessible to webpack, e.g. window
	performance: options.performance || {},
})
