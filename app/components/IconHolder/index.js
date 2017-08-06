// @flow

//
//
// IconHolder
//
//

// --------------------------------------------------------
// REACT / REDUX IMPORTS
// --------------------------------------------------------
import React from 'react'
// --------------------------------------------------------

// --------------------------------------------------------
// STYLING IMPORTS
// --------------------------------------------------------
import classNames from 'classnames'
import styles from './styles.css'

import upperShine from './assets/shine_up.png'
import bottomShine from './assets/shine_down.png'
import defaultIcon from './assets/default_icon.png'
// --------------------------------------------------------

// --------------------------------------------------------
// COMPONENT PROPERTIES DEFINITION
// --------------------------------------------------------
type PropTypes = {
	icon: string
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	icon: null
}
// --------------------------------------------------------

function IconHolder (props: PropTypes) {
	// --------------------------------------------------------
	// HELPER FUNCTIONS & VARIABLES
	// --------------------------------------------------------
	function _getIconSource () {
		if (props.icon) {
			return props.icon
		} else {
			return defaultIcon
		}
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT RETURN FUNCTION
	// --------------------------------------------------------
	return (
		<div className={classNames(styles.iconholder)}>
			<img src={upperShine} className={classNames(styles.upperShine)} />
			<img src={bottomShine} className={classNames(styles.bottomShine)} />
			<img src={_getIconSource()} className={classNames(styles.icon)} />
		</div>
	)
	// --------------------------------------------------------
}

IconHolder.defaultProps = _defaultProps
export default IconHolder
