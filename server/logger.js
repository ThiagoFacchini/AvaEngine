// @noflow
/* eslint-disable */

const chalk = require('chalk')
const ip = require('ip')

const divider = chalk.gray('-----------------------------------')

/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {

  // Called whenever there's an error on the server we want to print
	error: (err) => {
		console.error(chalk.red(err))
	},

  // Called when express.js app starts on given port w/o errors
	appStarted: (port, host, tunnelStarted) => {
		console.log(chalk.white(` ${chalk.green('✓')} Server started!`))

		console.log(`
 ${chalk.bold('Access URLs:')}
${divider}
 Localhost: ${chalk.magenta(`http://${host}:${port}`)}
       LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}
${divider}
 ${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `)
	},

	separator: () => {
		console.log(divider)
	},

	hightlight: (msg) => {
		console.log(`${chalk.bold.white(`${msg}`)}`)
	},

	info: (msg) => {
		console.log(`${chalk.white(`${msg}`)}`)
	},

	infoSub: (msg) => {
		console.log(`  ${chalk.white(`${msg}`)}`)
	},

	success: (msg) => {
		console.log(chalk.white(` ${chalk.green('✓')} ${msg}`))
	},

	successSub: (msg) => {
		console.log(chalk.white(`   ${chalk.green('✓')} ${msg}`))
	},

	warning: (msg) => {
		console.log(chalk.yellow(` • ${msg}`))
	},

	warningSub: (msg) => {
		console.log(chalk.yellow(`   • ${msg}`))
	},

	error: (msg) => {
		console.log(chalk.red(` ${chalk.bold.red('X')} ${msg}`))
	},

	errorSub: (msg) => {
		console.log(chalk.red(`   ${chalk.bold.red('X')} ${msg}`))
	},

	routeIntercepted: (msg) => {
		fullroute = msg.serverAddress + msg.route
		console.log(`${divider}${divider}
 ${chalk.white(`Proxy Server Intercepted: ${chalk.magenta(`[${msg.method}] ${fullroute}`)}`)}
${divider}${divider}`)
	},

	routeBypassed: (msg) => {
		fullroute = msg.serverAddress + msg.route
		console.log(`${divider}${divider}
 ${chalk.white(`Bypassing: ${chalk.magenta(`[${msg.method}] ${fullroute}`)}`)}
${divider}${divider}`)
	}
}

module.exports = logger
