import { View } from '../View'
import { Graphics, Text, BitmapText } from 'pixi.js'
import { AtlasText } from './AtlasText'

const ALIGN_MODE_ID_LEFT = 0
const ALIGN_MODE_ID_CENTER = 1
const ALIGN_MODE_ID_RIGHT = 2

const ALIGN_MODE_ID_TOP = 0
const ALIGN_MODE_ID_MIDDLE = 1
const ALIGN_MODE_ID_BOTTOM = 2

/*
universal text field class, presents single line of text
as PixiText, Pixi BitmapText or just textures as text
*/
export class TextField extends View {
	#text
	#maximalWidth
	#maximalHeight

	#style = {
		familyName: undefined,
		fontSize: 20,
		fontColor: 0xFFFFFF,
		letterSpacing: 0,
	}

	#areaGraphics
	#horisontalAlignMode = ALIGN_MODE_ID_LEFT
	#verticalAlignMode = ALIGN_MODE_ID_TOP
	#paddingLeft = 0
	#paddingRight = 0
	#paddingBottom = 0
	#paddingTop = 0

	#vectorText
	#bitmapText
	#atlasText
	#textView
	#anchorX = 0
	#anchorY = 0

	constructor({ text = '', maximalWidth = undefined, maximalHeight = undefined }) {
		super()

		this.#maximalWidth = maximalWidth
		this.#maximalHeight = maximalHeight
		this.setFontName()
		this.setText(text)
	}

	highlightArea() {
		if (!this.#areaGraphics) {
			this.#areaGraphics = this.addChildAt(new Graphics(), 0)
		}

		const width = this.#maximalWidth ?? this.width
		const height = this.#maximalHeight ?? this.height

		this.#areaGraphics
			.clear()
			.beginFill(0xFFFFFF, 0.25)
			.drawRect(
				0,
				0,
				width,
				height,
			)
			.drawRect(
				this.#paddingLeft,
				this.#paddingTop,
				width - this.#paddingLeft - this.#paddingRight,
				height - this.#paddingBottom - this.#paddingTop,
			)
			.endFill()

		this.#areaGraphics.pivot.set(
			width * this.#anchorX,
			height * this.#anchorY,
		)
		return this
	}

	setText(text = '') {
		this.#text = text
		this.#textView.text = text
		if (this.#atlasText) {
			this.#atlasText.setText(text)
		}
		return this.adjust()
	}

	setMaximalWidth(maximalWidth = undefined) {
		this.#maximalWidth = maximalWidth
		return this.adjust()
	}

	setMaximalHeight(maximalHeight = undefined) {
		this.#maximalHeight = maximalHeight
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

	setHorisontalAlignMode(horisontalAlignMode) {
		if (this.#horisontalAlignMode === horisontalAlignMode) {
			return this
		}

		this.#horisontalAlignMode = horisontalAlignMode
		this.adjust()
		return this
	}

	setVerticalAlignMode(verticalAlignMode) {
		if (this.#verticalAlignMode === verticalAlignMode) {
			return this
		}

		this.#verticalAlignMode = verticalAlignMode
		this.adjust()
		return this
	}

	adjust() {
		this.#areaGraphics?.clear()
		this.#textView.pivot.set(0, 0)
		this.#textView.scale.set(1)
		this.#textView.visible = true

		const textFullWidth = this.#textView.width
		const textFullHeight = this.#textView.height

		const maximalWidth = (this.#maximalWidth ?? textFullWidth) - this.#paddingLeft - this.#paddingRight
		const maximalHeight = (this.#maximalHeight ?? textFullHeight) - this.#paddingTop - this.#paddingBottom

		let scaleX = 1
		let scaleY = 1

		if (maximalWidth) {
			scaleX = Math.min(1, maximalWidth / textFullWidth)
		}

		if (textFullHeight) {
			scaleY = Math.min(1, maximalHeight / textFullHeight)
		}

		const scale = Math.min(scaleX, scaleY)

		this.#textView.scale.set(scale)

		let x = 0
		let y = 0

		switch (this.#horisontalAlignMode) {
			case ALIGN_MODE_ID_CENTER:
				x = this.#paddingLeft + (maximalWidth - textFullWidth * scale) * 0.5
				break
			case ALIGN_MODE_ID_RIGHT:
				x = this.#paddingLeft + (maximalWidth - textFullWidth * scale)
				break
			default:
				x = this.#paddingLeft
				break
		}

		switch (this.#verticalAlignMode) {
			case ALIGN_MODE_ID_TOP:
				y = this.#paddingTop
				break
			case ALIGN_MODE_ID_BOTTOM:
				y = this.#paddingTop + (maximalHeight - textFullHeight * scaleY)
				break
			default:
				y = this.#paddingTop + (maximalHeight - textFullHeight * scaleY) * 0.5
				break
		}

		this.#textView.position.set(x, y)

		this.#textView.pivot.set(
			maximalWidth * this.#anchorX,
			maximalHeight * this.#anchorY,
		)

		if (this.#areaGraphics) {
			this.highlightArea()
		}
		return this
	}

	// text height itself, excluding highlight area
	getTextHeight() {
		return this.#textView.height
	}

	setPaddingTop(padding = 0) {
		this.#paddingTop = padding
		this.adjust()
		return this
	}

	setPaddingRight(padding = 0) {
		this.#paddingRight = padding
		this.adjust()
		return this
	}

	setPaddingBottom(padding = 0) {
		this.#paddingBottom = padding
		this.adjust()
		return this
	}

	setPaddingLeft(padding = 0) {
		this.#paddingLeft = padding
		this.adjust()
		return this
	}

	setPadding(descriptor = { top: 0, right: 0, bottom: 0, left: 0 }) {
		this.#paddingTop = descriptor.top
		this.#paddingRight = descriptor.right
		this.#paddingBottom = descriptor.bottom
		this.#paddingLeft = descriptor.left
		this.adjust()
		return this
	}

	setLetterSpacing(letterSpacing = 0) {
		this.#style.letterSpacing = letterSpacing

		if (this.#vectorText) {
			this.#vectorText.style.letterSpacing = letterSpacing
		} else if (this.#bitmapText) {
			this.#bitmapText.letterSpacing = letterSpacing
		} else if (this.#atlasText) {
			this.#atlasText.setLetterSpacing(letterSpacing)
		}

		this.adjust()
		return this
	}

	setFontName(fontName = '', textures = undefined) {
		if (this.#style.familyName === fontName && !textures) {
			return this
		}

		this.#style.familyName = fontName
		if (this.#textView) {
			this.removeChild(this.#textView)
			this.#textView.destroy()
			this.#textView = null
		}

		// atlas font case
		if (textures && fontName) {
			this.#atlasText = new AtlasText({
				availableCharacters: fontName,
				textures,
			})
			this.#bitmapText = null
			this.#vectorText = null
			this.#textView = this.#atlasText
		}

		// bitmap font as second highest priority
		if (!this.#textView) {
			try {
				this.#atlasText = null
				this.#bitmapText = new BitmapText('', { fontName })
				this.#vectorText = null
				this.#textView = this.#bitmapText
				// eslint-disable-next-line no-empty
			} catch (e) { }
		}

		// vector font else
		if (!this.#textView) {
			this.#atlasText = null
			this.#bitmapText = null
			this.#vectorText = new Text('')
			this.#vectorText.style.fontFamily = fontName
			this.#textView = this.#vectorText
		}

		this.addChild(this.#textView)

		return this.setFontSize(this.#style.fontSize)
			.setFontColor(this.#style.fontColor)
			.setLetterSpacing(this.#style.letterSpacing)
			.setHorisontalAlignMode(this.#horisontalAlignMode)
			.setVerticalAlignMode(this.#verticalAlignMode)
			.setText(this.#text)
	}

	setFontSize(fontSize) {
		this.#style.fontSize = fontSize

		if (this.#vectorText) {
			this.#vectorText.style.fontSize = `${fontSize}px`
		} else if (this.#bitmapText) {
			this.#bitmapText.fontSize = fontSize
		} else if (this.#atlasText) {
			this.#atlasText.setFontSize(fontSize)
		}

		return this.adjust()
	}

	setFontColor(color) {
		this.#style.fontColor = color

		if (this.#vectorText) {
			this.#vectorText.style.fill = color
		} else if (this.#atlasText) {
			this.#atlasText.setColor(color)
		}
		return this.adjust()
	}

	setFillGradientType(fillGradientType = undefined) {
		this.#style.fillGradientType = fillGradientType
		return this.adjust()
	}

	setFillGradientStops(fillGradientStops = undefined) {
		this.#style.fillGradientStops = fillGradientStops
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

	setDropShadowDistance(dropShadowDistance = 5) {
		this.#style.dropShadowBlur = dropShadowDistance
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

	setStyle(style = undefined) {
		if (!style) {
			return this
		}

		if (!this.#vectorText) {
			return this
		}

		this.#vectorText.style = style
		return this.adjust()
	}

	setAnchor(x = 0, y = 0) {
		this.#anchorX = x
		this.#anchorY = y
		return this.adjust()
	}
}
