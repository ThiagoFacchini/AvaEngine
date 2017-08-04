// @flow
//
// LanguageProvider reducer
//

import Immutable from 'seamless-immutable'

import {
  CHANGE_LOCALE,
	DEFAULT_LOCALE,
} from './constants'

const initialState = Immutable({
	locale: DEFAULT_LOCALE,
})

function languageProviderReducer (state: Object = initialState, action: { type: string, payload: any }) {
	switch (action.type) {
	case CHANGE_LOCALE:
		return state
		.set('locale', action.payload.locale)
	default:
		return state
	}
}

export default languageProviderReducer
