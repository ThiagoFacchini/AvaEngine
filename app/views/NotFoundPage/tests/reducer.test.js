// @noflow

import Immutable from 'seamless-immutable'
import notFoundPageReducer from '../reducer'

describe('notFoundPageReducer', () => {
	it('returns the initial state', () => {
		expect(notFoundPageReducer(undefined, {})).toEqual({})
	})
})
