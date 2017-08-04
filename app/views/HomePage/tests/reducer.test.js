// @noflow

import Immutable from 'seamless-immutable'
import homePageReducer from '../reducer'

describe('homePageReducer', () => {
	it('returns the initial state', () => {
		expect(homePageReducer(undefined, {})).toEqual({})
	})
})
