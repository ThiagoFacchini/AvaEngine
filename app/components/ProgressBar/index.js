// @flow

//
//
// ProgressBar
//
//

// --------------------------------------------------------
// REACT / REDUX IMPORTS
// --------------------------------------------------------
import React from 'react'
import { hexToRgb, rgbToHex } from './../../utils/colours'
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
	maxVal: number,
	val: number,
	barColour?: string,
	label?: boolean,
	labelMode?: 'percentage' | 'value',
	labelColour?: string,
	labelAlignment?: 'left' | 'center' | 'right',
	progressMarkers?: boolean,
	progressMarkersMode?: 'percentage' | 'value',
	progressMarkersStep?: number
}
// --------------------------------------------------------

// --------------------------------------------------------
// DEFINES COMPONENT DEFAULT PROPERTIES
// --------------------------------------------------------
const _defaultProps = {
	width: 100,
	maxVal: null,
	val: null,
	barColour: '#ffe328',
	label: true,
	labelMode: 'percentage',
	labelColour: '#ffffff',
	labelAlignment: 'right',
	progressMarkers: false,
	progressMarkersMode: null,
	progressMarkersStep: null
}
// --------------------------------------------------------

function ProgressBar (props: PropTypes) {
	// --------------------------------------------------------
	// HELPER FUNCTIONS & VARIABLES
	// --------------------------------------------------------
	const _componentBorder = 6

	function _getProgressBarStyles () {
		const pbStyle = {}
		const width = props.width

		if (width) {
			pbStyle.maxWidth = `${width.toString()}px`
			pbStyle.minWidth = `${width.toString()}px`
			pbStyle.width = `${width.toString()}px`
		}

		return pbStyle
	}

	function _renderProgressBarCurrentVal (barPart: string) {
		let progressWidth
		const width = props.width
		const pbStyle = {}

		// Calculating width
		if (width) {
			if (props.val > props.maxVal) {
				progressWidth = width - (_componentBorder * 2)
			} else {
				progressWidth = (props.val * ((width - (_componentBorder * 2)) / props.maxVal))
			}
		}

		if (progressWidth) {
			pbStyle.minWidth = `${progressWidth}px`
			pbStyle.maxWidth = `${progressWidth}px`
			pbStyle.width = `${progressWidth}px`
		}

		// Adjusting colours
		if (barPart === 'top' && props.barColour) {
			const topBorderColour = getBarBorderColour(hexToRgb(props.barColour))
			if (topBorderColour) {
				const hexBorderColour = rgbToHex(topBorderColour)
				pbStyle.borderTop = `1px solid ${hexBorderColour}`
				pbStyle.borderLeft = `1px solid ${hexBorderColour}`
				pbStyle.borderRight = `1px solid ${hexBorderColour}`
			}
			pbStyle.backgroundColor = props.barColour
		} else if (barPart === 'bottom' && props.barColour) {
			const barColour = props.barColour
			const bottomBorderColour = getBarBorderColour(hexToRgb(barColour))
			const backgroundColour = getDarkerColour(hexToRgb(barColour))
			if (bottomBorderColour) {
				const hexBorderColour = rgbToHex(bottomBorderColour)
				pbStyle.borderBottom = `1px solid ${hexBorderColour}`
				pbStyle.borderLeft = `1px solid ${hexBorderColour}`
				pbStyle.borderRight = `1px solid ${hexBorderColour}`
			}
			if (backgroundColour) {
				const hexBackgroundColour = rgbToHex(backgroundColour)
				pbStyle.backgroundColor = hexBackgroundColour
			}
		}
		return pbStyle

		// Generate a slight lighter colour
		function getBarBorderColour (rgb: Object) {
			if (rgb.r && rgb.r <= 245)	{
				rgb.r = rgb.r + 10
			} else if (rgb && rgb.r) {
				rgb.r = 255
			}
			if (rgb.g && rgb.g <= 245)	{
				rgb.g = rgb.g + 10
			} else if (rgb && rgb.g) {
				rgb.g = 255
			}
			if (rgb.b && rgb.b <= 245)	{
				rgb.b = rgb.b + 10
			} else if (rgb && rgb.b) {
				rgb.b = 255
			}
			return rgb
		}

		// Generate a moderated darker colour
		function getDarkerColour (rgb: Object) {
			if (rgb.r && rgb.r >= 20)	{
				rgb.r = rgb.r - 20
			} else if (rgb && rgb.r) {
				rgb.r = 0
			}
			if (rgb.g && rgb.g >= 20)	{
				rgb.g = rgb.g - 20
			} else if (rgb && rgb.g) {
				rgb.g = 0
			}
			if (rgb.b && rgb.b >= 20)	{
				rgb.b = rgb.b - 20
			} else if (rgb && rgb.b) {
				rgb.b = 0
			}
			return rgb
		}
	}

	function _getLabelStyles () {
		const labelStyles = {}
		labelStyles.color = props.labelColour
		labelStyles.textAlign = props.labelAlignment
		return labelStyles
	}

	function _renderProgressBarLabel () {
		if (props.label) {
			if (props.labelMode === 'percentage') {
				if (props.val > props.maxVal) {
					return '100%'
				} else {
					const percent = (props.maxVal / 100)
					const percentage = (props.val / percent)
					return `${percentage}%`
				}
			//
			} else if (props.labelMode === 'value') {
				if (props.val > props.maxVal) {
					return `${props.maxVal} / ${props.maxVal}`
				} else {
					return `${props.val} / ${props.maxVal}`
				}
			}
		}
	}

	function _renderProgressMarkers () {
		if (props.progressMarkers) {
			if (props.progressMarkersMode && props.progressMarkersStep && props.width) {
				const markers = []
				const totalArea = props.width - (_componentBorder * 2)

				if (props.progressMarkersMode === 'percentage' && props.progressMarkersStep < 100) {
					const pixelPercent = (totalArea / 100)
					const markersNumber = Math.floor(100/ props.progressMarkersStep)

					for (let i = 0; i < markersNumber; i++) {
						if (props.progressMarkersStep) {
							if (((i+1) * props.progressMarkersStep) < 100) {
								const posLeft = (pixelPercent * ((i+1) * props.progressMarkersStep)) + _componentBorder
								const style = {
									left: `${posLeft}px`
								}
								markers.push(<div className={classNames(styles.marker)} style={style} key={i}/>)
							}
						}
					}
					return markers
					//
				} else if (props.progressMarkersMode === 'value' && props.progressMarkersStep < props.maxVal && props.width) {
					const pixelValue = ((props.width - (_componentBorder * 2)) / props.maxVal)
					const markersNumber = Math.floor(props.maxVal/ props.progressMarkersStep)

					for (let i = 0; i < markersNumber; i++) {
						if (props.progressMarkersStep) {
							if (((i+1) * props.progressMarkersStep) < props.maxVal) {
								const posLeft = (pixelValue * ((i+1) * props.progressMarkersStep)) + _componentBorder
								const style = {
									left: `${posLeft}px`
								}
								markers.push(<div className={classNames(styles.marker)} style={style} key={i}/>)
							}
						}
					}
					return markers
				}
			}
		}
	}
	// --------------------------------------------------------
	// --------------------------------------------------------
	// REACT RETURN FUNCTION
	// --------------------------------------------------------
	return (
		<div className={classNames(styles.progressbar)} style={_getProgressBarStyles()}>
			<div
				className={classNames(styles.valTop)}
				style={_renderProgressBarCurrentVal('top')}
			/>
			<div
				className={classNames(styles.valBottom)}
				style={_renderProgressBarCurrentVal('bottom')}
			/>
			<div className={classNames(styles.label)} style={_getLabelStyles()}>
				{_renderProgressBarLabel()}
			</div>
			<div className={classNames(styles.markersWrapper)}>
				{ _renderProgressMarkers() }
			</div>
		</div>
	)
	// --------------------------------------------------------
}

ProgressBar.defaultProps = _defaultProps
export default ProgressBar
