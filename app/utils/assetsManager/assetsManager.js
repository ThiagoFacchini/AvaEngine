// @flow
import { logger } from './../../app'

// This promise will iterate through the groundLevel object, passing through all
// materials and generating an array of ImageObjects per Material
export function generateGroundLevelTiles (groundLevelMaterialsObject: Object) {
	return new Promise((resolve, reject) => {
		const groundLevelMaterials 	= {}
		const objectLength 					= Object.keys(groundLevelMaterialsObject).length

		function iterateObject (index: number) {
			if (index < objectLength) {
				const currentKey 		= Object.keys(groundLevelMaterialsObject)[index]
				const currentValues = Object.values(groundLevelMaterialsObject)[index]

				_generateImageAssetsCache(currentValues)
				.then(function (cachedImageAssets) {
					groundLevelMaterials[currentKey] = cachedImageAssets
					index++
					iterateObject(index)
				})
			} else {
				resolve(groundLevelMaterials)
			}
		}

		iterateObject(0)
	})
}


function _generateImageAssetsCache (imageSourcesArray: any) {
	return new Promise((resolve, reject) => {
		const cachedAssets = []

		function iterateArray (index: number) {
			if (index < imageSourcesArray.length) {
				const imageObj = new Image() // eslint-disable-line no-undef
				imageObj.onload = function () {
					cachedAssets.push(imageObj)
					index++
					iterateArray(index)
				}
				imageObj.src = imageSourcesArray[index]
			} else {
				resolve(cachedAssets)
			}
		}

		if (Array.isArray(imageSourcesArray)) {
			iterateArray(0)
		} else {
			reject(Error(`_generateImageAssetsCache: imageSourcesArray must be an array with URLs, instead received ${typeof imageSourcesArray}`))
		}
	})
}
