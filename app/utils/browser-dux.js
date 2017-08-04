// @flow

const browser = require('bowser')

let RE, OS, CG, DE

if (browser.mobile) {
	DE = 'mobile'
} else if (browser.tablet) {
	DE = 'tablet'
} else {
	DE = 'computer'
}

if (browser.blink) {
	RE = 'blink'
} else if (browser.webkit) {
	RE = 'webkit'
} else if (browser.gecko) {
	RE = 'gecko'
} else if (browser.msie) {
	RE = 'msie'
} else if (browser.msedge) {
	RE = 'msedge'
} else {
	RE = 'unknown'
}

if (browser.mac) {
	OS = 'mac'
} else if (browser.windows) {
	OS = 'windows'
} else if (browser.windowsphone) {
	OS = 'windowsphone'
} else if (browser.linux) {
	OS = 'linux'
} else if (browser.android) {
	OS = 'android'
} else if (browser.ios) {
	OS = 'ios'
} else if (browser.blackberry) {
	OS = 'blackberry'
} else if (browser.firefoxos) {
	OS = 'firefoxos'
} else if (browser.webos) {
	OS = 'webos'
} else if (browser.bada) {
	OS = 'bada'
} else if (browser.tizen) {
	OS = 'tizen'
} else if (browser.sailfish) {
	OS = 'sailfish'
} else {
	OS = 'unknown'
}

if (browser.a) {
	CG = 'a'
} else if (browser.b) {
	CG = 'b'
} else if (browser.c) {
	CG = 'c'
} else {
	CG = 'unknown'
}

export const BrowserInfo = {
	device: DE,
	browserName: browser.name,
	browserVersion: browser.version,
	renderingEngine: RE,
	operationalSystem: OS,
	capabilityGrade: CG
}
