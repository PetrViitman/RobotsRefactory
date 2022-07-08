import { Container, Graphics } from 'pixi.js'

const STICK_MODE_ID_TOP = 0
const STICK_MODE_ID_MIDDLE = 1
const STICK_MODE_ID_BOTTOM = 2
const STICK_MODE_ID_LEFT = 3
const STICK_MODE_ID_CENTER = 4
const STICK_MODE_ID_RIGHT = 5
const STICK_MODE_ID_STRETCH = 6

export class View extends Container {
	static clientWidth
	static clientHeight

	graphics
	sourceArea
	targetArea
	horizontalStickModeId = STICK_MODE_ID_CENTER
	verticalStickModeId = STICK_MODE_ID_MIDDLE

	constructor() {
		super()
	}

	setSourceArea({widthInPixels, heightInPixels}) {
		this.sourceArea = {
			widthInPixels,
			heightInPixels,
		}
		return this.adjustToTargetArea()
	}

	setTargetArea({x = 0, y = 0, width = 1, height = 1}){
		this.targetArea = { x, y, width, height }
		return this.adjustToTargetArea()
	}

	highlight() {
		if(!this.sourceArea) return this

		const {widthInPixels, heightInPixels} = this.sourceArea

		this.graphics = this.graphics ?? this.addChild(new Graphics())
			.clear()
			.beginFill(0xFF0000, 0.5)
			.drawRect(0, 0, widthInPixels, heightInPixels)
			.drawRect(0, 0, widthInPixels / 2, heightInPixels / 2)
			.drawRect(widthInPixels / 2, heightInPixels / 2, widthInPixels / 2, heightInPixels / 2)
			.endFill()

		return this.adjustToTargetArea()
	}

	stickTop() { this.verticalStickModeId = STICK_MODE_ID_TOP; return this.adjustToTargetArea()}
	stickMiddle() { this.verticalStickModeId = STICK_MODE_ID_MIDDLE; return this.adjustToTargetArea()}
	stickBottom() { this.verticalStickModeId = STICK_MODE_ID_BOTTOM; return this.adjustToTargetArea()}
	stickLeft() { this.horizontalStickModeId = STICK_MODE_ID_LEFT; return this.adjustToTargetArea()}
	stickCenter() { this.horizontalStickModeId = STICK_MODE_ID_CENTER; return this.adjustToTargetArea()}
	stickRight() { this.horizontalStickModeId = STICK_MODE_ID_RIGHT; return this.adjustToTargetArea()}
	stretchHorizontally() { this.horizontalStickModeId = STICK_MODE_ID_STRETCH; return this.adjustToTargetArea()}
	stretchVertically() { this.verticalStickModeId = STICK_MODE_ID_STRETCH; return this.adjustToTargetArea()}


	onResize() {
		const {clientWidth, clientHeight} = View
		this.updateTargetArea(clientWidth / clientHeight)
		this.adjustToTargetArea()
		this.children.forEach(child => child.onResize?.())
	}

	updateTargetArea(sidesRatio) { }

	adjustToTargetArea(){
		const { sourceArea, targetArea } = this
		if(sourceArea && targetArea) {
			const {clientWidth, clientHeight} = View
			const targetWidthInPixels = clientWidth * targetArea.width
			const targetHeightInPixels = clientHeight * targetArea.height
			const scaleX = targetWidthInPixels / sourceArea.widthInPixels
			const scaleY = targetHeightInPixels /sourceArea.heightInPixels
			const commonScale = Math.min(scaleX, scaleY)
			const targetXInPixels = targetArea.x * clientWidth
			const targetYInPixels = targetArea.y * clientHeight
			const offsetX = Math.max(0, targetWidthInPixels - sourceArea.widthInPixels * commonScale)
			const offsetY = Math.max(0, targetHeightInPixels - sourceArea.heightInPixels * commonScale)
			
			this.x = targetArea.x * clientWidth
			this.y = targetArea.y * clientHeight

			switch(this.horizontalStickModeId) {
				case STICK_MODE_ID_LEFT:
					this.scale.x = commonScale
					break
				case STICK_MODE_ID_CENTER:
					this.scale.x = commonScale
					this.x += offsetX * 0.5
					break
				case STICK_MODE_ID_RIGHT:
					this.scale.x = commonScale
					this.x += offsetX
					break
				case STICK_MODE_ID_STRETCH:
					this.scale.x = scaleX
					break
			}

			switch(this.verticalStickModeId) {
				case STICK_MODE_ID_TOP:
					this.scale.y = commonScale
					break
				case STICK_MODE_ID_MIDDLE:
					this.scale.y = commonScale
					this.y += offsetY * 0.5
					break
				case STICK_MODE_ID_BOTTOM:
					this.scale.y = commonScale
					this.y += offsetY
					break
				case STICK_MODE_ID_STRETCH:
					this.scale.y = scaleY
					break
			}
		}

		this.children.forEach(child => child.adjustToTargetArea?.())
		return this
	}
}