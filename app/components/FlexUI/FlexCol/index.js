// @flow

//
//
// FlexCol
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
	xs?: 'hidden' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20',
	sm?: 'hidden' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20',
	md?: 'hidden' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20',
	lg?: 'hidden' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20',
	xl?: 'hidden' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20',
	offset?: number,
	inset?: number,
	class?: number,
	contentAlignment?: 'left' | 'center' | 'right',
	children: Object
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	xs: 20,
	sm: 20,
	md: 20,
	lg: 20,
	xl: 20,
	offset: null,
	inset: null,
	class: null,
	contentAlignment: null,
	children: null
}
// --------------------------------------------------------

function FlexCol (props: PropTypes) {
	// --------------------------------------------------------
	// HELPER FUNCTIONS & VARIABLES
	// --------------------------------------------------------
	function _getColClasses () {
		const cssClasses = []
		if (props.xs) {
			cssClasses.push(styles.xs)
			if (props.xs === 'hidden') {
				cssClasses.push(styles['xshidden'])
			} else if (props.xs !== undefined) {
				cssClasses.push(styles[`colxs${props.xs}`])
			}
		}
		if (props.sm) {
			cssClasses.push(styles.sm)
			if (props.sm === 'hidden') {
				cssClasses.push(styles['smhidden'])
			} else if (props.sm !== undefined) {
				cssClasses.push(styles[`colsm${props.sm}`])
			}
		}
		if (props.md) {
			cssClasses.push(styles.md)
			if (props.md === 'hidden') {
				cssClasses.push(styles['mdhidden'])
			} else if (props.md !== undefined) {
				cssClasses.push(styles[`colmd${props.md}`])
			}
		}
		if (props.lg) {
			cssClasses.push(styles.lg)
			if (props.lg === 'hidden') {
				cssClasses.push(styles['lghidden'])
			} else if (props.lg !== undefined) {
				cssClasses.push(styles[`collg${props.lg}`])
			}
		}
		if (props.xl) {
			cssClasses.push(styles.xl)
			if (props.xl === 'hidden') {
				cssClasses.push(styles['xlhidden'])
			} else if (props.xl !== undefined) {
				cssClasses.push(styles[`colxl${props.xl}`])
			}
		}
		if (props.class) {
			cssClasses.push(props.class)
		}
		return cssClasses
	}

	function _getColStyles () {
		const cssStyles = {}
		if (props.offset) {
			cssStyles.marginLeft = (props.offset * -1)
			cssStyles.marginRight = (props.offset * -1)
		}
		if (props.inset) {
			cssStyles.paddingLeft = props.inset
			cssStyles.paddingRight = props.inset
		}
		if (props.contentAlignment) {
			if (props.contentAlignment === 'left') {
				cssStyles.justifyContent = 'flex-start'
			} else if (props.contentAlignment === 'right') {
				cssStyles.justifyContent = 'flex-end'
			} else if (props.contentAlignment === 'center') {
				cssStyles.justifyContent = 'center'
			}
		}
		return cssStyles
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT RETURN FUNCTION
	// --------------------------------------------------------
	return (
		<div className={classNames(styles.flexcol, _getColClasses())} style={_getColStyles()}>
			{React.Children.toArray(props.children)}
		</div>
	)
	// --------------------------------------------------------
}

FlexCol.defaultProps = _defaultProps
export default FlexCol
