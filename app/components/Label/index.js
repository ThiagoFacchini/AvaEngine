// @flow

//
//
// Label
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
	type: 'square' | 'trapezoid',
	colour?: string,
	label: string,
	maxWidth?: number,
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	type: 'square',
	colour: '#F2DFC7',
	label: null,
	maxWidth: 100
}
// --------------------------------------------------------

function Label (props: PropTypes) {
	// --------------------------------------------------------
	// HELPER FUNCTIONS & VARIABLES
	// --------------------------------------------------------
	function _getLabelTypeClasses () {
		if (props.type === 'square') {
			return styles.square
		} else if (props.type === 'trapezoid') {
			return styles.trapezoid
		}
	}

	function _getLabelStyle () {
		return {
			color: props.colour,
			maxWidth: props.maxWidth
		}
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT RETURN FUNCTION
	// --------------------------------------------------------
	return (
		<div className={classNames(styles.label, _getLabelTypeClasses())} style={_getLabelStyle()}>
			{props.label}
		</div>
	)
	// --------------------------------------------------------
}

Label.defaultProps = _defaultProps
export default Label
