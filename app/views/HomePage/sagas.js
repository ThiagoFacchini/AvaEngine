// @flow
// import { take, call, put, select } from 'redux-saga/effects'

// Individual exports for testing
export function * defaultSaga (): Generator<any, any, any> {
	return yield
}

// All sagas to be loaded
export default [
	defaultSaga,
]
