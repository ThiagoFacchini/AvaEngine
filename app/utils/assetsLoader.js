// @flow

// This promise will loop through the provided object when resolved will return
// another object containing assets as per requested through assetType argument
// IMPORTANT: The object MUST BE only one level deep
export function cacheAssets (assetsObj: Object, assetType: string) {
	return new Promise((resolve, reject) => {
		const cachedAssetsObj 	= {}
		const objectSize 				= Object.keys(assetsObj).length
		let 	currIndex 				= 0

		function cacheAsset (index: number) {
			if (currIndex < objectSize) {
				// Checking what is the asset type
				switch (assetType) {

				// ASSET TYPE IMAGE
				case 'image':
					const imageAsset = new Image() // eslint-disable-line no-undef
					imageAsset.onload = function () {
						const assetName = Object.keys(assetsObj)[currIndex]
						cachedAssetsObj[assetName] = imageAsset
						currIndex++
						cacheAsset(currIndex)
					}
					imageAsset.src = String(Object.values(assetsObj)[currIndex])
					break

				// UNKNOW ASSET TYPE - Reject the promise
				default:
					reject(Error(`Asset type ${assetType} not defined`))
				}

			// Looped through the whole object, time to resolve the promise
			} else {
				resolve(cachedAssetsObj)
			}
		}

		// Kick of the tammed loop
		cacheAsset(currIndex)
	})
}
