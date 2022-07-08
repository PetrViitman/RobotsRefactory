import { View } from './View'
import { TextBox } from './text/TextBox'
import { Tween } from 'tween.js'


export class Tabloid extends View {
	textures
	textBoxes = []
	currentTextBox
	animation
	symbols

	constructor({
		textures,
		symbols = '0123456789abcdefghijklmnopqrstuvwxyz.: ',
		maximalWidthInPixels = 200,
		maximalHeightInPixels = 100}) {
		super()
		this.setSourceArea({
			widthInPixels: maximalWidthInPixels,
			heightInPixels: maximalHeightInPixels})
		this.textures = textures
		this.symbols = symbols
		this.initAnimation()
	}

	drop() {
		this.textBoxes.forEach(textBox => {textBox.alpha = 0})
	}

	initAnimation() {
		this.animation = new Tween({progress: 0})
			.to({progress: 1}, 500)
			.onUpdate((progress) => {
				this.textBoxes.forEach(textBox => {
					if(textBox.alpha > 0)
						textBox.alpha *= (1 - progress)
				})
				this.currentTextBox.alpha = progress
			})
	}

	getNextTextBox(){
		const { textBoxes, textures, symbols } = this

		for(const textBox of this.textBoxes) {
			if(textBox.alpha === 0) return textBox
		}
		const textBox = this.addChild(new TextBox({}))
		textBox.setFontName(symbols, textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setFontSize(100)
		textBox.alpha = 0
		textBoxes.push(textBox)
		return textBox
	}

	adjustTextBoxes() {
		const {widthInPixels, heightInPixels} = this.sourceArea

		for(const textBox of this.textBoxes) {
			textBox.setMaximalWidth(widthInPixels)
			textBox.setMaximalHeight(heightInPixels)
		}
	}

	setSourceArea({widthInPixels, heightInPixels}) {
		super.setSourceArea({widthInPixels, heightInPixels})
		this.adjustTextBoxes()
	}

	displayText(text = 'test123') {
		const { currentTextBox, animation } = this
		if(currentTextBox && currentTextBox.text === text) return
		this.currentTextBox = this.getNextTextBox()
		this.currentTextBox.setText(text)
		animation.stop()
		animation.start()
		this.adjustTextBoxes()

		return new Promise(resolve => {animation.onComplete(resolve)})
	}
}