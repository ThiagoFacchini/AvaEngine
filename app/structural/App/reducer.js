// @flow

import Immutable from 'seamless-immutable'
import { BrowserInfo } from '../../utils/browser-dux'

import {
  DEFAULT_ACTION,
} from './constants'

const initialState = Immutable({
	theme: 'standard',
	browser: BrowserInfo
})

function appReducer (state: Object = initialState, action: { type: string, payload: any }) {
	switch (action.type) {
	case DEFAULT_ACTION:
		return state
	default:
		return state
	}
}

export default appReducer
