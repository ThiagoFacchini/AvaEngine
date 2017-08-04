// @flow
//
//
// NotFoundPage reducer
//
//

import Immutable from 'seamless-immutable'
import {REHYDRATE} from 'redux-persist/constants'

import {
  DEFAULT_ACTION,
} from './constants'

const initialState = Immutable({})

function notFoundPageReducer (state: Object = initialState, action: { type: string, payload: any }) {
	switch (action.type) {
	case DEFAULT_ACTION:
		return state

	case REHYDRATE:
		const incoming = action.payload.homePage
		if (incoming) return { ...state, ...incoming }
		return

	default:
		return state
	}
}

export default notFoundPageReducer
