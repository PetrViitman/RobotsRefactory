import { View } from '../View'
import { Container, Graphics } from 'pixi.js'
import { TextField } from './TextField'

const ALIGN_MODE_ID_LEFT = 0
const ALIGN_MODE_ID_RIGHT = 1
const ALIGN_MODE_ID_CENTER = 2

const ALIGN_MODE_ID_TOP = 0
const ALIGN_MODE_ID_MIDDLE = 1
const ALIGN_MODE_ID_BOTTOM = 2

/*
universal text box class, presents multiple lines of text
as PixiText, Pixi BitmapText or just textures as text
*/
export class TextBox extends View {
	text
	#areaGraphics
	#contentContainer
	#textFields = []
	#maximalWidth
	#maximalHeight
	#horisontalAlignMode = ALIGN_MODE_ID_LEFT
	#verticalAlignMode = ALIGN_MODE_ID_MIDDLE
	#lineSeparator = '|'
	#anchorX = 0
	#anchorY = 0

	#style = {
		fontColor: 0xFFFFFF,
		fontSize: 40,
		letterSpacing: 0,
		lineSpacing: 0,
	}

	#fontTextures

	constructor({ text = '', maximalWidth = undefined, maximalHeight = undefined }) {
		super()
		this.#contentContainer = this.addChild(new Container())
		this.#maximalWidth = maximalWidth
		this.#maximalHeight = maximalHeight
		this.setText(text)
	}

	getTextField(index) {
		if (!this.#textFields[index]) {
			this.#textFields[index] = this.#contentContainer.addChild(new TextField({}))
		}

		return this.#textFields[index]
	}

	setMaximalWidth(maximalWidth = undefined) {
		this.#maximalWidth = maximalWidth
		return this.adjust()
	}

	setMaximalHeight(maximalHeight = undefined) {
		this.#maximalHeight = maximalHeight
		return this.adjust()
	}

	setLineSeparator(lineSeparator = '/n') {
		this.#lineSeparator = lineSeparator
		return this.adjust()
	}

	setAlignLeft() {
		return this.setHorisontalAlignMode(ALIGN_MODE_ID_LEFT)
	}

	setAlignCenter() {
		return this.setHorisontalAlignMode(ALIGN_MODE_ID_CENTER)
	}

	setAlignRight() {
		return this.setHorisontalAlignMode(ALIGN_MODE_ID_RIGHT)
	}

	setAlignTop() {
		return this.setVerticalAlignMode(ALIGN_MODE_ID_TOP)
	}

	setAlignMiddle() {
		return this.setVerticalAlignMode(ALIGN_MODE_ID_MIDDLE)
	}

	setAlignBottom() {
		return this.setVerticalAlignMode(ALIGN_MODE_ID_BOTTOM)
	}

	setHorisontalAlignMode(horisontalAlignMode = ALIGN_MODE_ID_LEFT) {
		this.#horisontalAlignMode = horisontalAlignMode
		return this.adjust()
	}

	setVerticalAlignMode(verticalAlignMode = ALIGN_MODE_ID_MIDDLE) {
		this.#verticalAlignMode = verticalAlignMode
		return this.adjust()
	}

	setText(text = '') {
		this.text = text
		return this.adjust()
	}

	setFontSize(fontSize = 20) {
		this.#style.fontSize = fontSize
		return this.adjust()
	}

	setFontColor(fontColor = 0xFFFFFF) {
		this.#style.fill = fontColor
		return this.adjust()
	}

	setFontName(fontName = '', textures = undefined) {
		this.#style.fontFamily = fontName
		this.#fontTextures = textures
		return this.adjust()
	}

	setLineSpacing(lineSpacing = 0) {
		this.#style.lineSpacing = lineSpacing
		return this.adjust()
	}

	setLetterSpacing(letterSpacing = 0) {
		this.#style.letterSpacing = letterSpacing
		return this.adjust()
	}

	setDropShadow(dropShadow = true) {
		this.#style.dropShadow = dropShadow
		return this.adjust()
	}

	setDropShadowAlpha(dropShadowAlpha = 1) {
		this.#style.dropShadowAlpha = dropShadowAlpha
		return this.adjust()
	}

	setDropShadowAngle(dropShadowAngle = 0) {
		this.#style.dropShadowAngle = dropShadowAngle
		return this.adjust()
	}

	setDropShadowColor(dropShadowColor = 0x000000) {
		this.#style.dropShadowColor = dropShadowColor
		return this.adjust()
	}

	setDropShadowBlur(dropShadowBlur = 5) {
		this.#style.dropShadowBlur = dropShadowBlur
		return this.adjust()
	}

	setDropShadowDistance(dropShadowDistance = 0) {
		this.#style.dropShadowDistance = dropShadowDistance
		return this.adjust()
	}

	setFontStyle(fontStyle) {
		this.#style.fontStyle = fontStyle
		return this.adjust()
	}

	setFontVariant(fontVariant) {
		this.#style.fontVariant = fontVariant
		return this.adjust()
	}

	setFontWeight(fontWeight) {
		this.#style.fontWeight = fontWeight
		return this.adjust()
	}

	setStyle(style = {}) {
		this.#style = style
		return this.adjust()
	}

	adjust() {
		this.#areaGraphics?.clear()
		this.#contentContainer.pivot.set(0, 0)
		this.#contentContainer.position.set(0, 0)
		this.#contentContainer.scale.set(1)
		const textLines = this.text.split(this.#lineSeparator)
		const linesCount = textLines.length
		const fontSize = this.#style.fontSize ?? 20

		const textFieldHeight = this.#maximalHeight
			? Math.min(fontSize, this.#maximalHeight)
			: fontSize

		//searching for the most compressed text field's height
		let longesLineWidth = 0
		let minimalHeight = textFieldHeight
		for (let index = 0; index < linesCount; index += 1) {
			const line = textLines[index]
			const textField = this.getTextField(index)
				.setFontName(this.#style.fontFamily, this.#fontTextures)
				.setFontSize(fontSize)
				.setFontColor(this.#style.fill)
				.setMaximalWidth(this.#maximalWidth)
				.setMaximalHeight(textFieldHeight)
				.setText(line)
				.setLetterSpacing(this.#style.letterSpacing)
				.setStyle?.(this.#style)

			minimalHeight = Math.min(textField.getTextHeight(), minimalHeight)
			longesLineWidth = Math.max(textField.width, longesLineWidth)
			textField.visible = true
		}

		//power of compression
		const scaleFactor = Math.min(1, minimalHeight / fontSize)

		for (let i = 0; i < linesCount; i += 1) {
			const textField = this.getTextField(i)
				.setMaximalWidth(this.#maximalWidth ?? longesLineWidth)
				.setMaximalHeight(minimalHeight)
			textField.y = i * (textField.height + (this.#style.lineSpacing ?? 0) * scaleFactor)
			switch (this.#horisontalAlignMode) {
				case ALIGN_MODE_ID_CENTER: textField.setAlignCenter(); break
				case ALIGN_MODE_ID_RIGHT: textField.setAlignRight(); break
				default: textField.setAlignLeft(); break
			}
			switch (this.#verticalAlignMode) {
				case ALIGN_MODE_ID_MIDDLE: textField.setAlignMiddle(); break
				case ALIGN_MODE_ID_BOTTOM: textField.setAlignBottom(); break
				default: textField.setAlignTop(); break
			}
		}

		//hiding excess fields
		for (let i = linesCount; i < this.#textFields.length; i += 1) {
			this.#textFields[i].visible = false
		}

		let contentScale = 1 //vertical overflow correction
		if (this.#maximalHeight) {
			contentScale = Math.min(this.#maximalHeight / this.#contentContainer.height, 1)
			this.#contentContainer.scale.set(contentScale)
		}

		const maximalWidth = this.#maximalWidth ?? this.#contentContainer.width
		const maximalHeight = this.#maximalHeight ?? this.#contentContainer.height

		const horisontalAlignMode = this.#maximalWidth ? this.#horisontalAlignMode : ALIGN_MODE_ID_LEFT

		switch (horisontalAlignMode) {
			case ALIGN_MODE_ID_CENTER:
				this.#contentContainer.x = (maximalWidth - maximalWidth * contentScale) / 2
				break
			case ALIGN_MODE_ID_RIGHT:
				this.#contentContainer.x = maximalWidth - maximalWidth * contentScale
				break
			default:
				this.#contentContainer.x = 0
				break
		}

		switch (this.#verticalAlignMode) {
			case ALIGN_MODE_ID_BOTTOM:
				this.#contentContainer.y = maximalHeight - this.#contentContainer.height
				break
			case ALIGN_MODE_ID_MIDDLE:
				this.#contentContainer.y = (maximalHeight - this.#contentContainer.height) / 2
				break
			default:
				this.#contentContainer.y = 0
				break
		}

		this.#contentContainer.pivot.set(
			maximalWidth * this.#anchorX,
			maximalHeight * this.#anchorY,
		)
		if (this.#areaGraphics) {
			this.highlightArea()
		}

		return this
	}

	highlightArea() {
		if (!this.#areaGraphics) {
			this.#areaGraphics = this.addChildAt(new Graphics(), 0)
		}

		this.#areaGraphics.clear()

		const width = this.#maximalWidth ?? this.width
		const height = this.#maximalHeight ?? this.height

		if (this.#maximalWidth || this.#maximalHeight) {
			//red background
			this.#areaGraphics.beginFill(0xFF0000, 0.25)
				.drawRect(0, 0, width, height)
				.endFill()

			//borders top bottom
			this.#areaGraphics.beginFill(this.#maximalHeight ? 0xFF0000 : 0x00FF00, 0.5)
				.drawRect(0, 0, width, 2)
				.drawRect(0, height, width, -2)
				.endFill()

			//borders left right
			this.#areaGraphics.beginFill(this.#maximalWidth ? 0xFF0000 : 0x00FF00, 0.5)
				.drawRect(0, 0, 2, height)
				.drawRect(width, 0, -2, height)
				.endFill()
		}

		this.#areaGraphics.pivot.set(
			width * this.#anchorX,
			height * this.#anchorY,
		)
		return this
	}

	setAnchor(x = 0, y = 0) {
		this.#anchorX = x
		this.#anchorY = y
		return this.adjust()
	}
}
