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
	size?: 'sm' | 'md' | 'lg',
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
	size: 'sm',
	label: null,
	maxWidth: 100
}
// --------------------------------------------------------

function Label (props: PropTypes) {
	// --------------------------------------------------------
	// HELPER FUNCTIONS & VARIABLES
	// --------------------------------------------------------
	function _getLabelTypeClasses () {
		const labelClasses = []

		if (props.type === 'square') {
			labelClasses.push(styles.square)
		} else if (props.type === 'trapezoid') {
			labelClasses.push(styles.trapezoid)
		}

		if (props.size === 'sm') {
			labelClasses.push(styles.sm)
		} else if (props.size === 'md') {
			labelClasses.push(styles.md)
		} else if (props.size === 'lg') {
			labelClasses.push(styles.lg)
		}

		return labelClasses
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
