// @flow

export function hexToRgb (hex: string): Object {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

	hex = hex.replace(shorthandRegex, function (r, g, b) {
		return r + r + g + g + b + b
	})

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : {}
}

export function rgbToHex (rgb: Object): string {
	function componentToHex (c) {
		const hex = c.toString(16)
		return hex.length === 1 ? `0${hex}` : hex
	}

	return `#${componentToHex(rgb.r)}${componentToHex(rgb.g)}${componentToHex(rgb.b)}`
}
