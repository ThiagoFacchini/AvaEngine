// @noflow
/* eslint-disable */

const express 			= require('express')
const app 					= express()

const argv 					= require('minimist')(process.argv.slice(2))
const resolve 			= require('path').resolve

const logger 				= require('./logger')
const setup 				= require('./middlewares/frontendMiddleware')
const proxyLoader 	= require('./middlewares/proxyMiddleware')

const proxyMode 		= argv.proxy


if (proxyMode) {
	logger.separator()
	logger.hightlight(' Starting server in proxy mode')
	logger.separator()

	proxyLoader( ( expressRouter ) => {
		logger.info(' Starting server...')
		app.use( expressRouter )
		enableApp()
	})

} else {
	enableApp()
}



// In production we need to pass these values in instead of relying on webpack
function enableApp() {

	setup(app, {
		outputPath: resolve(process.cwd(), 'build'),
		publicPath: '/',
	})

	const customHost 			= argv.host || process.env.HOST
	const host 						= customHost || null
	const prettyHost 			= customHost || 'localhost'
	const port 						= argv.port || process.env.PORT || 3000

	app.listen(port, host, (err) => {
		if (err) {
			return logger.error(err.message)
		}

		logger.appStarted(port, prettyHost)
	})

}
