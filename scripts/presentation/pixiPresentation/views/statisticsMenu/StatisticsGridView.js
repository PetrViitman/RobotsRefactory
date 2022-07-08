import { View } from '../View'
import { Container, Sprite, Loader } from 'pixi.js'
import { Tween } from 'tween.js'
import { TextBox } from '../text/TextBox'

export class StatisticsGridView extends View {
	units = []
	color = 0xFFFFFF
	wiggleAnimation

	constructor() {
		super()
		this.initWiggleAnimation()
	}

	initWiggleAnimation() {
		const { units } = this

		this.wiggleAnimation = new Tween({progress: 0})
			.to({progress: 1}, 5000)
			.onUpdate(progress => {
				units.forEach((unit, i) => {
					let offsetProgress = (progress + i * 0.2) % 1 * 2
					if(offsetProgress > 1) offsetProgress = 2 - offsetProgress
					unit.pivot.y = offsetProgress * 20
				})


			})
			.repeat(Infinity)
			.start()
	}

	presentUnits(assembledUnitsCount) {
		const unitsCount = assembledUnitsCount || 1
		const { units, color } = this
		let unitsPerWidth = Math.trunc(Math.sqrt(unitsCount))
		let excessUnits = unitsCount - unitsPerWidth * unitsPerWidth
		if(excessUnits > 0) unitsPerWidth += 1
		const unitsPerHeight = unitsPerWidth * unitsPerWidth - unitsCount >= unitsPerWidth ? unitsPerWidth - 1: unitsPerWidth

		this.setSourceArea({
			widthInPixels: 512 * unitsPerWidth,
			heightInPixels: 512 * unitsPerHeight
		})

		let index = 0
		for(let y = 0; y < unitsPerWidth; y++ ) {
			for(let x = 0; x < unitsPerWidth; x++ ) {
				if(index === unitsCount) break
				const unitView = this.getUnit(index)
				unitView.visible = true
				unitView.children[1].tint = color
				unitView.x = 512 * x
				unitView.y = 512 * y
				unitView.children[1].alpha = 1
				index++
			}
		}

		for( let i = index; i < units.length; i++ ) {
			units[i].visible = false
		}

		//if only platform needs to be presented
		if(assembledUnitsCount === 0)
			units[unitsCount - 1].children[1].alpha = 0
	}

	getUnit(index) {
		const { units, } = this
		const {
			resources,
			resources: { interface: {textures}}
		} = Loader.shared

		if(!units[index]) {
			const container = this.addChild(new Container())
			container.addChild(new Sprite(textures['robot_icon_platform']))
			const body = container.addChild(new Sprite(textures['robot_icon']))
			body.y = -20
			const textField = new TextBox({ text:  (index + 1) + '', maximalWidth: 200, maximalHeight: 200 })
					.setFontSize(150)
					.setFontName('0123456789', resources.font.textures)
					.setAlignCenter()
					.setAlignMiddle()

			textField.position.set(156, 125)

			body.addChild(textField)
			units[index] = container
		}

		return units[index];
	}

	fadeUnit({index, targetAlpha = 0, duration = 500}) {
		return new Promise(resolve => {
			new Tween(this.units[index].children[1])
			.to({alpha: targetAlpha}, duration)
			.onComplete(resolve)
			.start()
		})
	}

	setUnitsColor(color) { this.color = color }
}