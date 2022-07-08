import { Graphics, Loader } from 'pixi.js'
import { InteractiveView } from './InteractiveView'
import { TextBox } from './text/TextBox'
import { Tween } from 'tween.js'
import { sound } from '@pixi/sound'

export class ButtonView extends InteractiveView {
	color = 0xFFFFFF
	bodyGraphics
	animation
	labelTextBox

	constructor({text = 'me/nnu', sideSize = 256}) {
		super()
		this.setSourceArea({widthInPixels: sideSize, heightInPixels: sideSize})
		this.redrawBody()
		this.initLabel(text)
		this.initAnimation()
	}

	setEnabled(isEnabled = true) {
		this.labelTextBox.alpha = isEnabled ? 1 : 0.38
		this.interactive = isEnabled
		this.buttonMode = isEnabled
	}

	setLabel(text) {
		this.labelTextBox.setText(text)
	}

	initAnimation() {
		this.animation = new Tween({progress: 0})
			.to({progress: 1}, 500)
			.onUpdate((progress) => {
				let alpha = progress * 2
				if(alpha > 1) alpha = 2 - alpha

				this.alpha = 1 - alpha
			})
			.onComplete(() => {
				this.redrawBody()
				this.buttonMode = true
			})
	}

	setColor(color) {
		this.color = color
		this.redrawBody()
	}

	setFontColor(color) {
		this.labelTextBox.setFontColor(color)
	}

	redrawBody() {
		const {color, sourceArea} = this
		const size = sourceArea.widthInPixels
		const halfSize = size * 0.5
		const quarterSize = size * 0.25

		this.bodyGraphics = this.bodyGraphics ?? this.addChild(new Graphics()) 
		this.bodyGraphics.cacheAsBitmap = false
		this.bodyGraphics.clear()
			.beginFill(color)
			.drawRect(quarterSize, 0, halfSize, size)
			.drawRect(0, quarterSize, size, halfSize)
			.drawEllipse(quarterSize, quarterSize, quarterSize, quarterSize)
			.drawEllipse(halfSize + quarterSize, quarterSize, quarterSize, quarterSize)
			.drawEllipse(quarterSize, halfSize + quarterSize, quarterSize, quarterSize)
			.drawEllipse(halfSize + quarterSize, halfSize + quarterSize, quarterSize, quarterSize)
			.endFill()
	}

	initLabel(text) {
		const { resources } = Loader.shared
		const { widthInPixels } = this.sourceArea

		const textBox = this.addChild(
				new TextBox({
					text,
					maximalWidth: widthInPixels * 0.8,
					maximalHeight: widthInPixels * 0.8
				}))

		textBox.position.set(
			widthInPixels * 0.1,
			widthInPixels * 0.1)

		textBox.setFontName(
			'abcdefghijklmnopqrstuvwxyz ',
			resources.font_2.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setFontSize(widthInPixels * 0.62)
			.setLineSpacing(10)
			.setLetterSpacing(10)
			// .setFontColor(0x000000)

		this.labelTextBox = textBox
	}

	onPointerDown(localX, localY) {
		const { animation } = this
		this.buttonMode = false
		this.bodyGraphics.cacheAsBitmap = true
		animation.stop()
		animation.start()
		this.onClick()
		sound.play('UI', {volume: sound.volumeSFX})
	}

	onClick() {

	}
}