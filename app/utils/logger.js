// @flow
type LogType = 'info' | 'warning' | 'error' | 'trace'
type LogLevel = 1 | 2 | 3

export default function configureLogger (userSettings: Object) {
	const _defaultSettings = {
		info: false,
		warning: 1,
		error: 2,
		trace: true
	}

	const settings = Object.assign(_defaultSettings, userSettings)

	return {
		props: settings,
		log: function (type: LogType, priority: LogLevel, origin: string, message: string) {
			switch (type) {
			case 'info':
				if (this.props.info && priority <= this.props.info) {
					return console.log(`%c[${origin}(${priority})] - ${message}`, 'color: #727374; padding:8px; line-height:23px')
				}
				break

			case 'warning':
				if (this.props.warning && priority <= this.props.warning) {
					return console.log(`%c[${origin}(${priority})] - ${message}`, 'color: #333; background: #ffc84b; padding:8px; line-height:23px')
				}
				break

			case 'error':
				if (this.props.error && priority <= this.props.error) {
					return console.log(`%c[${origin}(${priority})] - ${message}`, 'color: #FFF; background: #cf000f; padding:8px; line-height:23px')
				}
				break

			case 'trace':
				if (this.props.trace) {
					return console.log(`%c[${origin}(${priority})] - ${message}`, 'color: #FFF; background: #333; padding:8px; line-height:23px')
				}
				break

			default:
				break
			}
		}
	}
}
