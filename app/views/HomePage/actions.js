// @flow
//
//
// HomePage actions
//
//

import {
	DEFAULT_ACTION,
	SET_FAVOURITE_COLOUR,
} from './constants'

export function defaultAction () {
	return {
		type: DEFAULT_ACTION,
	}
}

export function setFavouriteColour (payload: string) {
	return {
		type: SET_FAVOURITE_COLOUR,
		payload: payload
	}
}
