// @flow
/*
 *
 * HomePage
 *
 */

// --------------------------------------------------------
// REACT / REDUX IMPORTS
// --------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import homePageSelectors from './selectors'
import homePageActions from './actions'

import {
	selectTheme,
	selectBrowsingDevice,
} from './../../structural/App/selectors'

import CanvasRenderer from './../../components/CanvasRenderer'

// --------------------------------------------------------

// --------------------------------------------------------
// INTERNATIONALISATION SUPPORT
// --------------------------------------------------------
import { injectIntl } from 'react-intl'
import messages from './messages'
// --------------------------------------------------------

// --------------------------------------------------------
// STYLING IMPORTS
// --------------------------------------------------------
import classNames from 'classnames'
import styles from './styles.css'

import assets from './../../styles/assets'
// --------------------------------------------------------

// --------------------------------------------------------
// COMPONENT / CONTAINER IMPORTS
// --------------------------------------------------------
import Helmet from 'react-helmet'
// --------------------------------------------------------

// --------------------------------------------------------
// COMPONENT PROPERTIES DEFINITION
// --------------------------------------------------------
type PropTypes = {}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {}
// --------------------------------------------------------

export class HomePage extends React.Component {
	propTypes: PropTypes

	static defaultProps: PropTypes

	// --------------------------------------------------------
	// DECLARATION FOR HELPER FUNCTIONS
	// --------------------------------------------------------
	_getBrowsingDevice: Function
	_setFavouriteColour: Function

	// Mock / Temporary
	_genRandomMap: Function
	_map: Object
	// --------------------------------------------------------

	// --------------------------------------------------------
	// HELPER FUNCTIONS
	// --------------------------------------------------------
	_genRandomMap (rows: number, cols: number) {
		function generateGroundTiles () {
			const tileMaterial = Math.floor(Math.random() * (4 - 0) + 1)

			switch (tileMaterial) {
			case 1:
				return 'water01'
			case 2:
				return 'water01'
			case 3:
				return 'water01'
			case 4:
				return 'water01'
			}
		}

		const groundMapLayer = []

		for (let currentRow = 0; currentRow < rows; currentRow++) {
			groundMapLayer[currentRow] = []
			for (let currentCol = 0; currentCol < cols; currentCol++) {
				groundMapLayer[currentRow][currentCol] = generateGroundTiles()
			}
		}

		return {
			rows: rows,
			cols: cols,
			groundMapLayer: groundMapLayer
		}
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT CONSTRUCTOR
	// --------------------------------------------------------
	constructor (props: Object) {
		super(props)

		this._map = this._genRandomMap(1, 1)
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT LIFE CYCLES
	// --------------------------------------------------------
	componentWillMount () {}

	render () {
		return (
      <div className={classNames(styles.homepage, styles[this.props.selectorTheme], styles[this.props.selectorBrowsingDevice])}>
				<CanvasRenderer
					// General Definitions
					canvasWidth={900}
					canvasHeight={900}
					// Map Definitions
					mapRows={this._map.rows}
					mapCols={this._map.cols}
					// Base map layer
					groundLevelMap={this._map.groundMapLayer}
					groundLevelAssets={assets.materials.groundlevel}
					// Player Related
					centerPosX={1}
					centerPosY={1}
					// Debug Options
					debugDisplayCoordinates={true}
					debugDisplayFPS={true}
				/>
			</div>
		)
	}

	componentDidMount () {}
	// --------------------------------------------------------
}

// --------------------------------------------------------
// ACTIONS MAP
// --------------------------------------------------------
function mapDispatchToProps (dispatch) {
	return {
		actions: {
			dispatch,
		}
	}
}

// --------------------------------------------------------
// SELECTORS MAP
// --------------------------------------------------------
const mapStateToProps = createStructuredSelector({
	selectorTheme: selectTheme(),
	selectorBrowsingDevice: selectBrowsingDevice()
})

// --------------------------------------------------------
// SETTING CONTAINER.DEFAULTPROPS
// --------------------------------------------------------
HomePage.defaultProps = _defaultProps
// --------------------------------------------------------


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomePage))
