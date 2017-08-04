// @flow
import { createSelector } from 'reselect'

/**
 * Direct selector to the homePage state domain
 */
const selectHomePageDomain = () => (state: Object) => state.homePage

/**
 * Other specific selectors
 */


/**
 * Default selector used by HomePage
 */

const makeSelectHomePage = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate
)

const selectFavouriteColour = () => createSelector(
	selectHomePageDomain(),
	(substate) => substate.favouriteColour
)

export default makeSelectHomePage
export {
  selectHomePageDomain,
	selectFavouriteColour,
}
