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
import { logger } from './../../app'
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
	centerX?: number,
	centerY?: number,
	tileWidth?: number,
	tileHeight?: number,
	canvasId?: string,
	debugDisplayCoordinates?: boolean
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
	centerX: 1,
	centerY: 1,
	tileWidth: 64,
	tileHeight: 64,
	canvasId: 'canvasRenderer',
	debugDisplayCoordinates: false
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
	// Object that hold canvas methods, draw, clearRect, etc..
	_canvasContext: any

	// Render will wrap requestAnimationFrame / cancelAnimationFrame
	// browser API
	_renderer: any
	_rendererAnimationSubStep: number

	// Variables below will be use to optimise the rendering
	// processing avoid unecassary use of gpu / processor
	_renderableRows: number
	_renderableCols: number

	// The objects below will be used to store pre-cache assets
	// preventing the browser to lag while drawing in the canvas,
	// playing a song, video, etc...
	_groundLevelAssets: Object

	// Initialisation... TODO - Better categorisation is necessary
	_preCacheAssets: Function
	_calculateRenderableTiles: Function
	_renderFrame: Function
	// --------------------------------------------------------

	// --------------------------------------------------------
	// COMPONENT HELPER FUNCTIONS
	// --------------------------------------------------------
	_calculateRenderableTiles () {
		if (this.props.canvasHeight && this.props.tileHeight) {
			this._renderableRows = Math.floor(this.props.canvasHeight / this.props.tileHeight)
		}
		if (this.props.canvasWidth && this.props.tileWidth) {
			this._renderableCols = Math.floor(this.props.canvasWidth / this.props.tileWidth)
		}
	}

	_preCacheAssets () {
		const _this = this
		// Pre loading assets into a internal objects, so the browser
		// won't lag while drawing in the canvas
		// --------------------------------------------------------
		// GROUNDLEVEL ASSETS
		// --------------------------------------------------------
		generateGroundLevelTiles(this.props.groundLevelAssets)
		.then(function (cachedGroundLevelAssets) {
			_this._groundLevelAssets = cachedGroundLevelAssets
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

	_renderFrame () {
		// logger.log('trace', 1, 'CanvasRenderer: _renderFrame', 'function called! Rendering...')
		// Variable assigining to reduce amount the code and also make it a little
		// more declarative
		function draw () {
			const rows 					= this.props.mapRows
			const cols 					= this.props.mapCols

			const canvasWidth 	= this.props.canvasWidth
			const canvasHeight 	= this.props.canvasHeight
			const context 			= this._canvasContext

			const tileHeight 		= this.props.tileHeight
			const tileWidth 		= this.props.tileWidth

			// Map Layers
			const groundLevelTileMap = this.props.groundLevelMap

			// Restarting animationSubStep
			if (this._rendererAnimationSubStep > 15) {
				console.log('substep looped')
				this._rendererAnimationSubStep = 0
			}

			// Drawing
			if (context && tileHeight && tileWidth && canvasWidth && canvasHeight && groundLevelTileMap) {
				// Clearing the canvas
				context.clearRect(0, 0, canvasWidth, canvasHeight)

				for (let currentCol = 0; currentCol < cols; currentCol++) {
					for (let currentRow = 0; currentRow < rows; currentRow++) {
						// Determining X position of the tile
						const tilePositionX = currentCol * tileWidth
						// Determining Y position of the tile
						const tilePositionY = currentRow * tileHeight
						// Getting the current Tile Material
						const tileMaterial = groundLevelTileMap[currentRow][currentCol]
						// Drawing the tile
						context.shadowBlur=0
						context.drawImage(this._groundLevelAssets[tileMaterial][this._rendererAnimationSubStep],
							Math.round(tilePositionX),
							Math.round(tilePositionY),
							tileWidth,
							tileHeight
						)

						// Displaying coordinates
						if (this.props.debugDisplayCoordinates) {
							context.font = '10px Arial'
							context.fillStyle = 'white'
							context.shadowColor = 'black'
							context.shadowBlur=7
							context.lineWidth=5
							const coordsText = `R: ${currentRow} - C: ${currentCol}`
							const coordsTextSize = context.measureText(coordsText)
							const posX = (tilePositionX + (tileWidth / 2)) - (coordsTextSize.width /2)
							const posY = (tilePositionY + (tileHeight /2)) + (10 /2)

							context.strokeText(coordsText, posX, posY)
							context.fillText(coordsText, posX, posY)
						}
					}
				}

				// Incrementing tileMaterialAnimationFrame
				this._rendererAnimationSubStep++
				requestAnimationFrame(draw()) // eslint-disable-line no-undef
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

		// Pre-cached assets objects
		this._groundLevelAssets = {}

		this._rendererAnimationSubStep = 0

		// Function bound to the component class
		this._calculateRenderableTiles = this._calculateRenderableTiles.bind(this)
		this._preCacheAssets = this._preCacheAssets.bind(this)
		this._renderFrame = this._renderFrame.bind(this)
	}

	componentWillMount () {
	}

	render () {
		this._calculateRenderableTiles()

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
			logger.log('info', 1, 'CanvasRenderer: componentDidUpdate', 'Ready to render. starting...')
			requestAnimationFrame(this._renderFrame) // eslint-disable-line no-undef
		} else {
			logger.log('info', 1, 'CanvasRenderer: componentDidUpdate', 'Not ready to render')
		}
	}

	componentDidMount () {
		if (this.props.canvasId) {
			const canvas = document.getElementById(this.props.canvasId)
			if (canvas instanceof HTMLCanvasElement) { // eslint-disable-line no-undef
				this._canvasContext = canvas.getContext('2d')
				logger.log('info', 1, 'CanvasRenderer: componentDidMount', 'CanvasContext set!')
				this._preCacheAssets()
			}
		}
	}
	// --------------------------------------------------------
}

CanvasRenderer.defaultProps = _defaultProps
export default CanvasRenderer
