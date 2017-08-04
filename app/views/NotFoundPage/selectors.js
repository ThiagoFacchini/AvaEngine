// @flow
import { createSelector } from 'reselect'

//
// Direct selector to the notFoundPage state domain
//
const selectNotFoundPageDomain = () => (state: Object) => state.notFoundPage

//
// Other specific selectors
//


//
// Default selector used by NotFoundPage
//

const makeSelectNotFoundPage = () => createSelector(
  selectNotFoundPageDomain(),
  (substate) => substate
)

export default makeSelectNotFoundPage
export {
  selectNotFoundPageDomain,
}
