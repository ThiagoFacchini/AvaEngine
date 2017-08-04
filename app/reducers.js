// @flow

import { combineReducers } from 'redux-seamless-immutable'
import Immutable from 'seamless-immutable'
import { LOCATION_CHANGE } from 'react-router-redux'

import languageProviderReducer from './structural/LanguageProvider/reducer'
import appReducer from './structural/App/reducer'

// Initial routing state
const routeInitialState = Immutable({
	locationBeforeTransitions: null,
})

/**
 * Merge route into the global application state
 */
function routeReducer (state = routeInitialState, action) {
	switch (action.type) {
    /* istanbul ignore next */
	case LOCATION_CHANGE:
		return state.merge({
			locationBeforeTransitions: action.payload,
		})
	default:
		return state
	}
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer (asyncReducers?: Object) {
	return combineReducers({
		route: routeReducer,
		globals: appReducer,
		language: languageProviderReducer,
		...asyncReducers,
	})
}
