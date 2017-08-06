// @flow

//
//
// MultiUsageProgressBar
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
// --------------------------------------------------------

// --------------------------------------------------------
// COMPONENT PROPERTIES DEFINITION
// --------------------------------------------------------
type PropTypes = {
	icon?: string,
	label?: string,
	width?: number,
	maxValue: number,
	currentValue: number,
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	icon: null,
	label: null,
	width: 212,
	maxValue: 100,
	currentValue: 0
}
// --------------------------------------------------------

function MultiUsageProgressBar (props: PropTypes) {
	// --------------------------------------------------------
	// HELPER FUNCTIONS & VARIABLES
	// --------------------------------------------------------
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT RETURN FUNCTION
	// --------------------------------------------------------
	return (
		<div className={classNames(styles.multiusageprogressbar)}>
		</div>
	)
	// --------------------------------------------------------
}

MultiUsageProgressBar.defaultProps = _defaultProps
export default MultiUsageProgressBar
