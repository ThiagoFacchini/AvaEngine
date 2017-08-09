// @flow
//
//
// CanvasRenderer
//
//
// TODO
// - Draw coordinates on top of the canvas ( boolean )

// --------------------------------------------------------
// REACT / REDUX IMPORTS
// --------------------------------------------------------
import React from 'react'
import { generateGroundLevelTiles } from './../../utils/assetsManager/assetsManager'
// Custom Imports
import { logger } from './../../app'
import CanvasRendererModule from './../../utils/canvasRenderer/canvasRenderer'
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
	canvasWidth?: number,
	canvasHeight?: number,
	mapRows: number,
	mapCols: number,
	groundLevelMap: Array<Array<string>>,
	groundLevelAssets: Object,
	centerPosX?: number,
	centerPosY?: number,
	zoomLevel?: number,
	tileWidth?: number,
	tileHeight?: number,
	canvasId?: string,
	debugDisplayCoordinates?: boolean,
	debugDisplayFPS?: boolean
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	canvasWidth: 800,
	canvasHeight: 600,
	mapRows: null,
	mapCols: null,
	groundLevelMap: [],
	groundLevelAssets: {},
	centerPosX: 1,
	centerPosY: 1,
	zoomLevel: 100,
	tileWidth: 64,
	tileHeight: 64,
	canvasId: 'canvasRenderer',
	debugDisplayCoordinates: false,
	debugDisplayFPS: false
}
// --------------------------------------------------------


class CanvasRenderer extends React.Component {
	// --------------------------------------------------------
	// ASSIGINING TYPE TO COMPONENT.PROPS
	// --------------------------------------------------------
	propTypes: PropTypes
	// --------------------------------------------------------
	// ASSIGINING TYPE TO COMPONENT.DEFAULTPROPS
	// --------------------------------------------------------
	static defaultProps: PropTypes
	// --------------------------------------------------------
	// COMPONENT CONTEXT DEFINITION
	// --------------------------------------------------------
	static contextTypes = {}
	// --------------------------------------------------------
	// COMPONENT STATE DEFINITION
	// --------------------------------------------------------
	state = {}
	// --------------------------------------------------------
	// --------------------------------------------------------
	// COMPONENT STATE DEFINITION
	// --------------------------------------------------------
	state: {
		assetsCached: boolean
	}
	// --------------------------------------------------------
	// FUNCTION DECLARATION FOR HELPER FUNCTIONS
	// --------------------------------------------------------
	// Instance of canvasRederer library
	_canvasRendererModule: Object

	// The objects below will be used to store pre-cache assets
	// preventing the browser to lag while drawing in the canvas,
	// playing a song, video, etc...
	_cachedAssets: Object

	// Initialisation... TODO - Better categorisation is necessary
	_preCacheAssets: Function
	_configureCanvasRendererModule: Function
	// --------------------------------------------------------

	// --------------------------------------------------------
	// COMPONENT HELPER FUNCTIONS
	// --------------------------------------------------------
	_preCacheAssets () {
		const _this = this
		// Pre loading assets into a internal objects, so the browser
		// won't lag while drawing in the canvas
		// --------------------------------------------------------
		// GROUNDLEVEL ASSETS
		// --------------------------------------------------------
		generateGroundLevelTiles(this.props.groundLevelAssets)
		.then(function (cachedGroundLevelAssets) {
			_this._cachedAssets.groundLevel = cachedGroundLevelAssets
			_this.setState({
				assetsCached: true
			})
		})
		.catch(function (error) {
			logger.log('error', 1, 'CanvasRenderer - _preCacheAssets', `Error! Description: ${error}`)
		})
		// --------------------------------------------------------
		// Once all the assets are pre-cached, than change state forcing
		// the component to re-render, this time able to run any canvas
		// operation that depends on assets
	}

	_configureCanvasRendererModule () {
		const _this = this
		if (this.props.canvasId) {
			const canvas = document.getElementById(this.props.canvasId)
			if (canvas instanceof HTMLCanvasElement) { // eslint-disable-line no-undef
				// Component has been mounted, time to configure canvasRendererModule
				const settings = {
					mapRows: this.props.mapRows,
					mapCols: this.props.mapCols,
					canvasWidth: this.props.canvasWidth,
					canvasHeight: this.props.canvasHeight,
					canvasContext: canvas.getContext('2d'),
					tileWidth: this.props.tileWidth,
					tileHeight: this.props.tileHeight,
					mapLayers: {
						groundLevel: this.props.groundLevelMap
					},
					cachedAssets: this._cachedAssets,
					debugSettings: {
						displayCoordinates: this.props.debugDisplayCoordinates,
						displayFPS: this.props.debugDisplayFPS
					},
					animationFpsCap: 16
				}

				this._canvasRendererModule.configureRenderer(settings, function () {
					// Once the canvasRenderer is configured, then start to render
					_this._canvasRendererModule.renderStart()
				})
			}
		}
	}
	// --------------------------------------------------------

	// --------------------------------------------------------
	// REACT LIFECYCLE METHODS
	// --------------------------------------------------------
	constructor (props: PropTypes) {
		super(props)

		this.state = {
			assetsCached: false
		}

		// Instatiating canvasRenderer
		this._canvasRendererModule = new CanvasRendererModule()
		// Pre-cached assets objects
		this._cachedAssets = {}
		// Function bound to the component class
		this._preCacheAssets = this._preCacheAssets.bind(this)
		this._configureCanvasRendererModule = this._configureCanvasRendererModule.bind(this)
	}

	componentWillMount () {}

	render () {
		return (
			<canvas
				id={this.props.canvasId}
				width={this.props.canvasWidth}
				height={this.props.canvasHeight}
				className={classNames(styles.canvasrenderer)}
			/>
		)
	}

	componentDidUpdate (prevProps: Object, prevState: Object) {
		// Check if the assets are already cached before
		// proceed with any canvas operation
		if (this.state.assetsCached) {
			logger.log('trace', 1, 'CanvasRenderer: componentDidUpdate', 'Configuring Renderer Module')
			this._configureCanvasRendererModule()
		} else {
			logger.log('info', 1, 'CanvasRenderer: componentDidUpdate', 'Not ready to render, waiting for assets to be cached')
		}
	}

	componentDidMount () {
		// All the necessary components are now mounted
		// Time to start pre-cache all the assets
		this._preCacheAssets()
	}
	// --------------------------------------------------------
}

CanvasRenderer.defaultProps = _defaultProps
export default CanvasRenderer
