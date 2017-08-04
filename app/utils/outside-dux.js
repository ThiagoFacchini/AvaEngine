// @flow
/**
 * Collection of utilities to access / change the store from outside redux loop
 * @namespace outsideDux
 */
import { store } from '../app'
import { IntlProvider } from 'react-intl'
import { translationMessages } from '../i18n'

const intlCache = {}

/**
 * [Dispatch any action]
 * @param {Object} action A redux action with / without paremeters
  * @function dispatchActionOutsideComponent
 * @memberof outsideDux
 */
export function dispatchActionOutsideComponent (action: Object) {
	// dispatc the ation against the instantiated redux store
	store.dispatch(action)
}

/**
 * [Executes any selector]
 * @param {Function} selector A redux selector
 * @return {Any}          Whatever the selector is meant to return
 * @function getStateOutsideComponent
 * @memberof outsideDux
 */
export function getStateOutsideComponent (selector: (state: Object) => any) {
	return selector(store.getState())
}

/**
 * [Format a message]
 * @param {String} locale  Locale
 * @param {Object} message The message object
 * @return {String}         Formatted message based on locale
 * @function formatMessageOutsideComponent
 * @memberof outsideDux
 */
export function formatMessageOutsideComponent (locale: string, message: Object) {
	if (intlCache[locale] == null) {
		const { intl } = new IntlProvider(
			{
				locale: locale,
				messages: translationMessages[locale]
			},
			{}
		).getChildContext()
		intlCache[locale] = intl
	}

	return intlCache[locale].formatMessage(message)
}
