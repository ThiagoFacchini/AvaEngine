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
// --------------------------------------------------------

// --------------------------------------------------------
// COMPONENT PROPERTIES DEFINITION
// --------------------------------------------------------
type PropTypes = {
	size?: 'sm' | 'md' | 'lg',
	icon: string
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	size: 'sm',
	icon: null
}
// --------------------------------------------------------

function IconHolder (props: PropTypes) {
	// --------------------------------------------------------
	// HELPER FUNCTIONS & VARIABLES
	// --------------------------------------------------------
	function _getIconHolderClasses () {
		if (props.size === 'sm') {
			return styles.sm
		} else if (props.size === 'md') {
			return styles.md
		} else if (props.size === 'lg') {
			return styles.lg
		}
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT RETURN FUNCTION
	// --------------------------------------------------------
	return (
		<div className={classNames(styles.iconholder, _getIconHolderClasses())}>
			<div className={classNames(styles.shine)} />
			<img src={props.icon} className={classNames(styles.icon)} />
		</div>
	)
	// --------------------------------------------------------
}

IconHolder.defaultProps = _defaultProps
export default IconHolder
