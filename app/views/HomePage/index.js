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

import FlexRow from './../../components/FlexRow'
import FlexCol from './../../components/FlexCol'
import FlexGlyph from './../../components/FlexGlyph'

// --------------------------------------------------------

// --------------------------------------------------------
// INTERNATIONALISATION SUPPORT
// --------------------------------------------------------
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'
// --------------------------------------------------------

// --------------------------------------------------------
// STYLING IMPORTS
// --------------------------------------------------------
import classNames from 'classnames'
import styles from './styles.css'

import { images } from './../../styles/assets'
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
	// --------------------------------------------------------

	// --------------------------------------------------------
	// HELPER FUNCTIONS
	// --------------------------------------------------------
	_getBrowsingDevice () {
		switch (this.props.selectorBrowsingDevice) {
		case 'tablet':
			return images.tabletScreen
		case 'mobile':
			return images.mobileScreen
		default:
			return images.computerScreen
		}
	}

	_setFavouriteColour () {
		this.props.actions.setFavouriteColour('blue')
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT CONSTRUCTOR
	// --------------------------------------------------------
	constructor (props: Object) {
		super(props)

		this._getBrowsingDevice = this._getBrowsingDevice.bind(this)
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
        <Helmet
          title="HomePage"
          meta={[ { name: 'description', content: 'Description of HomePage' } ]}
        />
				<div className={classNames(styles.welcomeMessage)}>
					<img src={this._getBrowsingDevice()}/>
					<div className={classNames(styles.title)} onClick={ this._setFavouriteColour }>
						Welcome!!!<br/>
					</div>
					<div className={classNames(styles.subtitle)}>
						This is the HomePage stylised by { this.props.selectorTheme } theme.<br/><br/>
						You are browsing this page using a { this.props.selectorBrowsingDevice }
						<br/>
						{ this.props.selectFavouriteColour }
					</div>
					<FlexRow
						class={styles.rowClass}
						offset={10}
					>
						<FlexCol xs='20' sm='10' md='6' lg='5' xl='4' inset={10}>
							Mobile
						</FlexCol>
						<FlexCol xs='hidden' sm='10' md='7' lg='5' xl='4' inset={10}>
							Big Mobile
						</FlexCol>
						<FlexCol xs='hidden' sm='hidden' md='7' lg='5' xl='4' inset={10}>
							Tablet
						</FlexCol>
						<FlexCol xs='hidden' sm='hidden' md='hidden' lg='5' xl='4' inset={10}>
							Screen
						</FlexCol>
						<FlexCol xs='hidden' sm='hidden' md='hidden' lg='hidden' xl='4' inset={10}>
							Big Screen
						</FlexCol>
					</FlexRow>

					<FlexRow
						xs='hidden'
						sm='hidden'
						md='hidden'
						lg='hidden'
					>
						<FlexCol>
							<FlexGlyph name='home2'/>
						</FlexCol>
					</FlexRow>
				</div>
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
