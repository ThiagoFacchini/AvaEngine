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
import {
	selectFavouriteColour,
} from './selectors'

import {
	setFavouriteColour
} from './actions'

import {
	selectTheme,
	selectBrowsingDevice,
} from './../../structural/App/selectors'

import Label from './../../components/Label'
import IconHolder from './../../components/IconHolder'
import ProgressBar from './../../components/ProgressBar'
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

	_genRandomMap: Function
	// --------------------------------------------------------

	// --------------------------------------------------------
	// HELPER FUNCTIONS
	// --------------------------------------------------------
	_setFavouriteColour () {
		this.props.actions.setFavouriteColour('blue')
	}

	_genRandomMap (rows: number, cols: number) {
		function generateRnd () {
			const tileMaterial = Math.floor(Math.random() * (4 - 0) + 1)

			switch (tileMaterial) {
			case 1:
				return 'grass'
			case 2:
				return 'sand'
			case 3:
				return 'dirt'
			case 4:
				return 'gravel'
			}
		}
		const tileMap = []

		for (let currentRow = 0; currentRow < rows; currentRow++) {
			tileMap[currentRow] = []
			for (let currentCol = 0; currentCol < cols; currentCol++) {
				tileMap[currentRow][currentCol] = generateRnd()
			}
		}

		return tileMap
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT CONSTRUCTOR
	// --------------------------------------------------------
	constructor (props: Object) {
		super(props)

		this._setFavouriteColour = this._setFavouriteColour.bind(this)
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT LIFE CYCLES
	// --------------------------------------------------------
	componentWillMount () {}

	render () {
		return (
      <div className={classNames(styles.homepage, styles[this.props.selectorTheme], styles[this.props.selectorBrowsingDevice])}>
        {/* <Helmet
          title="HomePage"
          meta={[ { name: 'description', content: 'Description of HomePage' } ]}
        />
				<Label
					size='sm'
					type='square'
					label='&nbsp;&nbsp;My enchanted left nut'
					maxWidth={170}
				/>

				<IconHolder
					size='lg'
					icon={assets.images.icons.yellowFire}
				/>

				<ProgressBar
					width={800}
					maxVal={200}
					val={100}
					size='md'
					barColour='#0a0ac8'
					label={true}
					labelMode='percentage'
					labelColour='#ffffff'
					labelAlignment='center'
					progressMarkers={true}
					progressMarkersMode='percentage'
					progressMarkersStep={12.5}
				/> */}

				<CanvasRenderer
					width={500}
					height={500}
					groundMapLayer={this._genRandomMap(5, 4)}
					groundAssets={assets.images.tiles}
					centerX={1}
					centerY={1}
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
			setFavouriteColour: (args) => dispatch(setFavouriteColour(args)),
			dispatch,
		}
	}
}

// --------------------------------------------------------
// SELECTORS MAP
// --------------------------------------------------------
const mapStateToProps = createStructuredSelector({
	selectorTheme: selectTheme(),
	selectorBrowsingDevice: selectBrowsingDevice(),
	selectFavouriteColour: selectFavouriteColour()
})

// --------------------------------------------------------
// SETTING CONTAINER.DEFAULTPROPS
// --------------------------------------------------------
HomePage.defaultProps = _defaultProps
// --------------------------------------------------------


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomePage))
