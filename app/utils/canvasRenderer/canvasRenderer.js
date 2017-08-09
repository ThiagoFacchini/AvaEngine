// @flow
//
type MapLayersType = {
	groundLevel: Array<string>
}

type DebugType = {
	displayCoordinates: boolean,
	displayFPS: boolean
}

type CachedAssetsType = {
	groundLevel: Array<Object>
}

export default function CanvasRendererModule () {
	return {
		props: {
			canRender: false,
			animationSubStep: 0,
			animationFpsCap: 30,
			animationNow: Date.now(),
			animationInterval: (1000 / this.props.animationFpsCap),
		},
		configureRenderer: function (
			mapRows: number,
			mapCols: number,
			canvasWidth: number,
			canvasHeight: number,
			canvasContext: any,
			tileHeight: number,
			tileWidth: number,
			mapLayers: MapLayersType,
			cachedAssets: CachedAssetsType,
			debug: DebugType,
			callback: Function
		) {
			this.props.mapRows 				= mapRows
			this.props.mapCols 				= mapCols
			this.props.canvasWidth 		= canvasWidth
			this.props.canvasHeight 	= canvasHeight
			this.props.canvasContext 	= canvasContext
			this.props.tileHeight 		= tileHeight
			this.props.tileWidth 			= tileWidth
			this.props.mapLayers 			= mapLayers
			this.props.cachedAssets 	= cachedAssets
			this.props.debug 					= debug
			callback()
		},
		renderStart: function () {
			this.props.canRender = true
			this.render()
		},
		renderStop: function () {
			this.props.canRender = false
		},
		render: function () {
			// Restarting animationSubStep
			if (this.props.animationSubStep > 15) {
				console.log('substep looped')
				this.props.animationSubStep = 0
			}

			// Clearing the canvas
			this.props.canvasContext.clearRect(0, 0, this.props.canvasWidth, this.props.canvasHeight)
			let currentCol = 0
			let currentRow = 0

			for (currentCol = 0; currentCol < this.props.mapCols; currentCol++) {
				for (currentRow = 0; currentRow < this.props.mapRows; currentRow++) {
					// Determining X position of the tile
					const tilePositionX = currentCol * this.props.tileWidth
					// Determining Y position of the tile
					const tilePositionY = currentRow * this.props.tileHeight
					// Getting the current Tile Material
					const tileMaterial = this.props.mapLayers.groundLevel[currentRow][currentCol]
					// Drawing the tile
					this.props.canvasContext.shadowBlur = 0
					this.props.canvasContext.drawImage(
						this.props.cachedAssets.groundLevel[tileMaterial][this.props.animationSubStep],
						Math.round(tilePositionX),
						Math.round(tilePositionY),
						this.props.tileWidth,
						this.props.tileHeight
					)

					// Displaying coordinates
					if (this.props.debug.displayCoordinates) {
						this.props.canvasContext.font = '10px Arial'
						this.props.canvasContext.fillStyle = 'white'
						this.props.canvasContext.shadowColor = 'black'
						this.props.canvasContext.shadowBlur=7
						this.props.canvasContext.lineWidth=5

						const coordsText = `R: ${currentRow} - C: ${currentCol}`
						const coordsTextSize = this.props.canvasContext.measureText(coordsText)
						const posX = (tilePositionX + (this.props.tileWidth / 2)) - (coordsTextSize.width /2)
						const posY = (tilePositionY + (this.props.tileHeight /2)) + (10 /2)

						this.props.canvasContext.strokeText(coordsText, posX, posY)
						this.props.canvasContext.fillText(coordsText, posX, posY)
					}
				}
			}

			// Incrementing tileMaterialAnimationFrame
			this.props.animationSubStep++
			requestAnimationFrame(this.render.bind(this)) // eslint-disable-line no-undef
		}
	}
}
