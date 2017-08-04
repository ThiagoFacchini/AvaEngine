// @noflow
import Immutable from 'seamless-immutable'

import { makeSelectLocationState } from 'structural/App/selectors'

describe('makeSelectLocationState', () => {
	it('should select the route as a plain JS object', () => {
		const route = Immutable({
			locationBeforeTransitions: null,
		})
		const mockedState = Immutable({
			route,
		})
		expect(makeSelectLocationState()(mockedState)).toEqual(route)
	})

	it('should return cached js routeState for same concurrent calls', () => {
		const route = Immutable({
			locationBeforeTransitions: null,
		})
		const mockedState = Immutable({
			route,
		})
		const selectLocationState = makeSelectLocationState()

		const firstRouteStateJS = selectLocationState(mockedState)
		expect(selectLocationState(mockedState)).toBe(firstRouteStateJS)
	})
})
