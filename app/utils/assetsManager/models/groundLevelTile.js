// @flow

export default class groundLevelTileModel {
	frame1: string
	frame2: string
	frame3: string
	frame4: string
	frame5: string
	frame6: string
	frame7: string
	frame8: string
	frame9: string
	frame10: string
	frame11: string
	frame12: string
	frame13: string
	frame14: string
	frame15: string
	frame16: string

	constructor (rawObject: Object) {
		this.frame1 = rawObject.frame1
		this.frame2 = rawObject.frame2
		this.frame3 = rawObject.frame3
		this.frame4 = rawObject.frame4
		this.frame5 = rawObject.frame5
		this.frame6 = rawObject.frame6
		this.frame7 = rawObject.frame7
		this.frame8 = rawObject.frame8
		this.frame9 = rawObject.frame9
		this.frame10 = rawObject.frame10
		this.frame11 = rawObject.frame11
		this.frame12 = rawObject.frame12
		this.frame13 = rawObject.frame13
		this.frame14 = rawObject.frame14
		this.frame15 = rawObject.frame15
		this.frame16 = rawObject.frame16
	}

	toJson () {
		return {
			frame1: this.frame1,
			frame2: this.frame2,
			frame3: this.frame3,
			frame4: this.frame4,
			frame5: this.frame5,
			frame6: this.frame6,
			frame7: this.frame7,
			frame8: this.frame8,
			frame9: this.frame9,
			frame10: this.frame10,
			frame11: this.frame11,
			frame12: this.frame12,
			frame13: this.frame13,
			frame14: this.frame14,
			frame15: this.frame15,
			frame16: this.frame16,
		}
	}
}
