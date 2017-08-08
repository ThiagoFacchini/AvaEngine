// @flow
/*
 *
 * HomePage constants
 *
 */

const BASE_PATH = 'app/views/HomePage'

function genCommsRequestConstants (actionName: string) {
	return {
		ACTION: `${BASE_PATH}/${actionName}/ACTION`,
		SUCCESS: `${BASE_PATH}/${actionName}/SUCCESS`,
		FAILURE: `${BASE_PATH}/${actionName}/FAILURE`,
	}
}

export const DEFAULT_ACTION = `${BASE_PATH}/DEFAULT_ACTION`
