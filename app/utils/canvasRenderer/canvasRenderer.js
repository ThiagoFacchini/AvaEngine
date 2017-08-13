// @flow
//
type MapLayersType = {
	groundLevel: Array<string>
}

type CachedAssetsType = {
	groundLevel: Array<Object>
}

type DebugType = {
	displayCoordinates: boolean,
	displayFPS: boolean
}

type SettingsType = {
	mapRows: number,
	mapCols: number,
	canvasWidth: number,
	canvasHeight: number,
	canvasContext: any,
	tileWidth: number,
	tileHeight: number,
	mapLayers: MapLayersType,
	cachedAssets: CachedAssetsType,
	debugSettings: DebugType,
	animationFpsCap: number
}

export default function CanvasRendererModule () {
	return {
		props: {},
		configureRenderer: function (settings: SettingsType, callback: Function) {
			this.props.mapRows 								= settings.mapRows
			this.props.mapCols 								= settings.mapCols
			this.props.canvasWidth 						= settings.canvasWidth
			this.props.canvasHeight 					= settings.canvasHeight
			this.props.canvasContext 					= settings.canvasContext
			this.props.tileWidth 							= settings.tileWidth
			this.props.tileHeight 						= settings.tileHeight
			this.props.mapLayers 							= settings.mapLayers
			this.props.cachedAssets 					= settings.cachedAssets
			this.props.debugSettings					= settings.debugSettings
			this.props.animationFpsCap				= settings.animationFpsCap
			this.props.animationInterval			= Math.ceil(1000 / this.props.animationFpsCap)
			// Not dynamic Yet
			this.props.canRender							= false
			this.props.animationCurrentFrame	= 0
			this.props.animationNow						= null
			this.props.animationLast					= 0
			this.props.animationDelta					= null
			// RealTime Statistics Purpose
			this.props.stats = {
				currentFPSCount: 0,
				lastFPSCount: 0,
				currentFPSCapacity: 0,
				lastFPSCapacity: 0,
				statisticsTimer: null
			}
			// Once configuration is done, than execute the passed callback
			callback()
		},

		renderStart: function () {
			this.props.canRender = true

			// Starting the timer which resets currentFPSCount & currentFPSCapacity
			// every second.
			const _this = this

			this.props.stats.statisticsTimer = setInterval(function () {
				_this.props.stats.lastFPSCount = _this.props.stats.currentFPSCount
				_this.props.stats.currentFPSCount = 1
				_this.props.stats.lastFPSCapacity = _this.props.stats.currentFPSCapacity
				_this.props.stats.currentFPSCapacity = 1
			}, 1000)

			this.render()
		},

		renderStop: function () {
			this.props.canRender = false

			// Stopping the timer which resets currentFPSCount & currentFPSCapacity
			// every second.
			this.props.stats.lastFPSCount = 0
			this.props.stats.currentFPSCount = 0
			this.props.stats.lastFPSCapacity = 0
			this.props.stats.currentFPSCapacity = 0
			clearInterval(this.props.stats.statisticsTimer)
		},

		render: function () {
			if (this.props.canRender) {
				// Controls animation speed based on maximum frames per second
				// It basicaly divides a second per an amount of frames (this.props.animationFpsCap)
				// which will result in an interval (time) that canvas draw function will wait till
				// the next drawing operation
				this.props.animationNow = Date.now()
				this.props.animationDelta = (this.props.animationNow - this.props.animationLast)

				// If the time passed (animationDelta) since the last draw operation is greater than
				// the interval necessary to do not surpass the maximum fps (animationFpsCap), then
				// trigger the whole canvas drawing operation
				if (this.props.animationDelta >= this.props.animationInterval) {
					// Restarting animationCurrentFrame when it reaches the animation maximum frames
					// per second so the animation can loop through its cycle
					// IMPORTANT: this.props.animationFpsCap not only control animation speed but also
					// related to the maximum amount of frames per that will be rendered per material
					// IMPORTANT2: animationFpsCap needs to be decreased by 1 since the position 0
					// of the array counts as a frame
					if (this.props.animationCurrentFrame > (this.props.animationFpsCap -1)) {
						this.props.animationCurrentFrame = 0
					}

					// Clearing the canvas
					this.props.canvasContext.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight)
					// Initialising the loop variables outside the loop, which will make the loop
					// faster, since it doesn't need to instantiate variables possibly more than 1000 times
					let currentCol = 0
					let currentRow = 0

					for (currentCol = 0; currentCol < this.props.mapCols; currentCol++) {
						for (currentRow = 0; currentRow < this.props.mapRows; currentRow++) {
							// -------------------------------------------------------
							// STARTING THE RENDERING PROCCESS
							// ORDER OF WHAT WILL BE RENDERED IS VERY IMPORTANT
							// -------------------------------------------------------
							// 1 - Render Ground Tiles
							this.renderGroundTiles(currentRow, currentCol)

							// 2 - Should display debug Coordinates?
							.then(this.renderDebugCoordinates(currentRow, currentCol))

							// 3 - Should display debug FPS Statistics?
							.then(this.renderDebugDisplayFPS())

							// Any error? How do we handle it?
							.catch(() => {
								// error, do something else
							})
							// -------------------------------------------------------
						}
					}

					// Update the time when the last canvas drawing operation happened right after
					// the render loop finishes so no function, method, etc will mess the FPS control
					this.props.animationLast = Date.now()

					// Incrementing tileMaterialAnimationFrame so the animations can happen
					this.props.animationCurrentFrame++

					// Incrementing currentFPSCount & currentFPSCapacity if the debugSetting.displayFPS
					this.props.stats.currentFPSCount++
					this.props.stats.currentFPSCapacity++

				// To early to re render, the invertal (animationDelta) since the last canvas drawing
				// operation is to short to meet maximum amount of frames per second (animationFpsCap)
				} else {
					// Incrementing currentFPSCapacity since for this statistic it doesn't matter if
					// the render process happened or not, the purpose is to display how many FPS the
					// user machine could possible render.
					this.props.stats.currentFPSCapacity++
				}
				requestAnimationFrame(this.render.bind(this)) // eslint-disable-line no-undef
			}
		},

		renderGroundTiles: function (row: number, col: number) {
			return new Promise((resolve, reject) => {
				// Determining X position of the tile
				const tilePositionX = col * this.props.tileWidth
				// Determining Y position of the tile
				const tilePositionY = row * this.props.tileHeight

				// Getting the current Tile Material
				const tileMaterial = this.props.mapLayers.groundLevel[row][col]

				// Check if the current tileMaterial is animated and has the number of frames
				// that the animationCurrentFrame is at.
				let TileToBeRendered = null
				if (this.props.cachedAssets.groundLevel[tileMaterial][this.props.animationCurrentFrame]) {
					TileToBeRendered = this.props.cachedAssets.groundLevel[tileMaterial][this.props.animationCurrentFrame]
				} else {
					TileToBeRendered = this.props.cachedAssets.groundLevel[tileMaterial][0]
				}

				// Drawing the tile
				this.props.canvasContext.shadowBlur = 0
				this.props.canvasContext.drawImage(
					TileToBeRendered,
					Math.round(tilePositionX),
					Math.round(tilePositionY),
					this.props.tileWidth,
					this.props.tileHeight
				)

				// Tile rendered, resolve the promise...
				resolve()
			})
		},

		renderDebugCoordinates: function (row: number, col: number) {
			return new Promise((resolve, reject) => {
				if (this.props.debugSettings.displayCoordinates) {
					const tilePositionX = col * this.props.tileWidth
					const tilePositionY = row * this.props.tileHeight

					this.props.canvasContext.font = '10px Arial'
					this.props.canvasContext.fillStyle = 'white'
					this.props.canvasContext.shadowColor = 'black'
					this.props.canvasContext.shadowBlur=7
					this.props.canvasContext.lineWidth=5

					const coordsText = `R: ${row} - C: ${col}`
					const coordsTextSize = this.props.canvasContext.measureText(coordsText)
					const posX = (tilePositionX + (this.props.tileWidth / 2)) - (coordsTextSize.width /2)
					const posY = (tilePositionY + (this.props.tileHeight /2)) + (10 /2)

					this.props.canvasContext.strokeText(coordsText, posX, posY)
					this.props.canvasContext.fillText(coordsText, posX, posY)

					// Tile coordinates rendered, resolve the promise
					resolve()

				// Nothing to do, resolve the promise
				} else {
					resolve()
				}
			})
		},

		renderDebugDisplayFPS: function () {
			return new Promise((resolve, reject) => {
				if (this.props.debugSettings.displayFPS) {
					this.props.canvasContext.font = '10px Arial'
					this.props.canvasContext.fillStyle = 'white'
					this.props.canvasContext.shadowColor = 'black'
					this.props.canvasContext.shadowBlur=7
					this.props.canvasContext.lineWidth=5

					const fpsText = `Current FPS: ${this.props.stats.lastFPSCount} / Capable of ${this.props.stats.lastFPSCapacity} FPS`
					const fpsTextSize = this.props.canvasContext.measureText(fpsText)
					const posX = (this.props.canvasWidth - fpsTextSize.width) - 20
					const posY = 20

					this.props.canvasContext.strokeText(fpsText, posX, posY)
					this.props.canvasContext.fillText(fpsText, posX, posY)
					// FPS statistics diplayed, resolve the promise
					resolve()

				// Nothing to do, resolve the promise
				} else {
					resolve()
				}
			})
		}
	}
}
