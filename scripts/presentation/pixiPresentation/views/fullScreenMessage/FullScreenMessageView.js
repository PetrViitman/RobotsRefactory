import { View } from '../View'
import { InteractiveView } from '../InteractiveView'
import { Sprite, Texture, Loader } from 'pixi.js'
import { TextBox } from '../text/TextBox'
import { Tween } from 'tween.js'
import { PixiPresentation } from '../../PixiPresentation'

export class FullScreenMessageView extends View {
	backgroundView
	backgroundSprite
	textBox

	constructor() {
		super()

		this.initBackgroundView()
		this.initMessageTextBox()
		this.initHintTextBox()
	}

	initBackgroundView() {
		this.backgroundView = this.addChild(new InteractiveView())
			.setSourceArea({widthInPixels: 100, heightInPixels: 100})
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
			.stretchHorizontally()
			.stretchVertically()

		this.backgroundSprite = this.backgroundView.addChild(new Sprite(Texture.WHITE))
		this.backgroundSprite.width = 100
		this.backgroundSprite.height = 100
		this.backgroundSprite.tint = PixiPresentation.color
		this.backgroundView.interactive = false
	}

	initMessageTextBox() {
		const { resources } = Loader.shared
		this.textBox = this.addChild(new TextBox({
			 maximalWidth: 400,
			 maximalHeight: 400}))
			.setSourceArea({widthInPixels: 400, heightInPixels: 400})
			.setTargetArea({x: 0.1, y: 0.2, width: 0.8, height: 0.6})
			.setFontName(
				'abcdefghijklmnopqrstuvwxyz ',
				resources.font_2.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setFontSize(100)
			.setText('game|over')
	}

	initHintTextBox() {
		const { resources } = Loader.shared
		const isTouchScreen = 'ontouchstart' in window || navigator.msMaxTouchPoints
		this.addChild(new TextBox({
			 maximalWidth: 400,
			 maximalHeight: 100}))
			.setSourceArea({widthInPixels: 400, heightInPixels: 100})
			.setTargetArea({x: 0, y: 0.8, width: 1, height: 0.15})
			.setFontName(
				//'0123456789abcdefghijklmnopqrstuvwxyz:. ',
				'abcdefghijklmnopqrstuvwxyz ',
				resources.font_2.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setFontSize(30)
			.setText(isTouchScreen ? 'tap' : 'click')
			.setLetterSpacing(1)
	}

	setText(text) {
		this.backgroundSprite.tint = PixiPresentation.color
		this.textBox.setText(text)
	}

	async waitForUserAction() {
		const { backgroundView, tabloid, progressBar } = this
		backgroundView.interactive = true
		return new Promise(resolve => {backgroundView.onPointerUp = () => {
			resolve()
			backgroundView.interactive = false}})
	}
}