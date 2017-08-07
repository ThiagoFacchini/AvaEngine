// @flow
//
//
// CanvasRenderer
//
//

// --------------------------------------------------------
// REACT / REDUX IMPORTS
// --------------------------------------------------------
import React from 'react'
import { cacheAssets, doCache } from './../../utils/assetsLoader'
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
	width?: number,
	height?: number,
	groundMapLayer: Array<Array<string>>,
	groundAssets: Object,
	centerX?: number,
	centerY?: number,
	tileWidth?: number,
	tileHeight?: number,
	canvasId?: string
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	width: 800,
	height: 600,
	groundMapLayer: [],
	groundAssets: {},
	centerX: 1,
	centerY: 1,
	tileWidth: 128,
	tileHeight: 64,
	canvasId: 'canvasRenderer'
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

	_renderableRows: number
	_renderableCols: number

	// The objects below will be used to pre-cache assets preventing
	// the browser to lag while drawing in the canvas
	_groundAssets: Object

	_preCacheAssets: Function
	_calculateRenderableTiles: Function
	// --------------------------------------------------------

	// --------------------------------------------------------
	// COMPONENT HELPER FUNCTIONS
	// --------------------------------------------------------
	_preCacheAssets () {
		// Assiging class reference to temporary variable
		const _this = this
		// Pre loading assets into a internal objects, so the browser
		// won't lag while drawing in the canvas
		// --------------------------------------------------------
		// GROUND ASSETS
		// --------------------------------------------------------
		cacheAssets(this.props.groundAssets, 'image')
		.then(function (cachedObj) {
			_this._groundAssets = cachedObj
			_this.setState({
				assetsCached: true
			})
		})
		.catch(function (error) {
			console.log(error)
		})
		// --------------------------------------------------------

		// Once all the assets are pre-cached, than change state forcing
		// the component to re-render, this time able to run any canvas
		// operation that depends on assets
	}

	_calculateRenderableTiles () {
		if (this.props.height && this.props.tileHeight) {
			this._renderableRows = Math.floor(this.props.height / this.props.tileHeight)
		}
		if (this.props.width && this.props.tileWidth) {
			this._renderableCols = Math.floor(this.props.width / this.props.tileWidth)
		}
		console.log(`Renderable Rows: ${this._renderableRows}`)
		console.log(`Renderable Cols: ${this._renderableCols}`)
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
		this._groundAssets = {}

		// Function bound to the component class
		this._preCacheAssets = this._preCacheAssets.bind(this)
		this._calculateRenderableTiles = this._calculateRenderableTiles.bind(this)
	}

	componentWillMount () {
	}

	render () {
		this._calculateRenderableTiles()

		return (
			<canvas
				id={this.props.canvasId}
				width={this.props.width}
				height={this.props.height}
				className={classNames(styles.canvasrenderer)}
			/>
		)
	}

	componentDidUpdate (prevProps: Object, prevState: Object) {
		// Check if the assets are already cached before
		// proceed with any canvas operation
		if (this.state.assetsCached) {
			console.log(this.state.assetsCached)
			console.log('rendering...')
			const rows = this.props.groundMapLayer.length
			const cols = this.props.groundMapLayer[0].length

			const canvasWidth = this.props.width
			const canvasHeight = this.props.height
			const context = this._canvasContext

			const tileHeight = this.props.tileHeight
			const tileWidth = this.props.tileWidth
			const tileMap = this.props.groundMapLayer

			// Drawing
			if (context && tileHeight && tileWidth && canvasWidth && tileMap) {
				context.clearRect(0, 0, this.props.width, this.props.height)

				for (let currentRow = 0; currentRow < rows; currentRow++) {
					for (let currentCol = 0; currentCol < cols; currentCol++) {
						// Determining X position of the tile, and also centering on the screen
						let tilePositionX = (currentRow - currentCol) * tileHeight
						tilePositionX += (canvasWidth / 2) - (tileWidth /2)

						// Determining Y position of the tile, and also centering on the screen
						const tilePositionY = (currentRow + currentCol) * (tileHeight /2)

						// Getting the current Tile Material
						const tileMaterial = tileMap[currentRow][currentCol]

						// Drawing the tile
						context.drawImage(this._groundAssets[tileMaterial],
							Math.round(tilePositionX),
							Math.round(tilePositionY),
							tileWidth,
							tileHeight
						)
					}
				}
			}
		} else {
			console.log('not ready to render')
		}
	}

	componentDidMount () {
		if (this.props.canvasId) {
			const canvas = document.getElementById(this.props.canvasId)
			if (canvas instanceof HTMLCanvasElement) { // eslint-disable-line no-undef
				this._canvasContext = canvas.getContext('2d')
				console.log('[componentDidMount] - CanvasContext set!')
				this._preCacheAssets()
			}
		}
	}
	// --------------------------------------------------------
}

CanvasRenderer.defaultProps = _defaultProps
export default CanvasRenderer
