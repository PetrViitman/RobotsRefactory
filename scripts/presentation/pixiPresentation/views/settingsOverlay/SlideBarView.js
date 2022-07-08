import { InteractiveView } from '../InteractiveView'
import { Graphics, Loader } from 'pixi.js'
import { TextBox } from '../text/TextBox'

export class SlideBarView extends InteractiveView {
	progress
	bar

	constructor({widthInPixels = 150, heightInPixels = 20, text = 'test'}) {
		super()
		const { resources } = Loader.shared
		this.setSourceArea({widthInPixels, heightInPixels})

		//background
		this.addChild(new Graphics())
			.beginFill(0x444444)
			.drawRect(0, 0, widthInPixels, heightInPixels)
			.endFill()
		//background text
		this.addChild(new TextBox({
			maximalWidth: widthInPixels,
			maximalHeight: heightInPixels}))
			.setFontName('abcdefghijklmnopqrstuvwxyz ', resources.font_2.textures)
			.setFontColor(0xFFFFFF)
			.setText(text)
			.setAlignCenter()
			.setAlignMiddle()
			.setFontSize(heightInPixels * 0.75)


		this.bar = this.addChild(new Graphics())
			.beginFill(0xFFFFFF)
			.drawRect(0, 0, widthInPixels, heightInPixels)
			.endFill()

		const barMask = this.bar.addChild(new Graphics())
			.beginFill(0xFFFFFF)
			.drawRect(0, 0, widthInPixels, heightInPixels)
			.endFill()
		this.bar.scale.x = 0

		//foreground text
		const textBox = this.addChild(new TextBox({
			maximalWidth: widthInPixels,
			maximalHeight: heightInPixels}))
			.setFontName('abcdefghijklmnopqrstuvwxyz ', resources.font_2.textures)
			.setFontColor(0x444444)
			.setText(text)
			.setAlignCenter()
			.setAlignMiddle()
			.setFontSize(heightInPixels * 0.75)
		textBox.mask = barMask

		this.setSourceArea({widthInPixels, heightInPixels})
	}


	setProgress(progress = 0.5) {
		const finalProgress = Math.max(0, Math.min(progress, 1))
		this.bar.scale.x = finalProgress
		this.progress = finalProgress
		this.onProgressChange(finalProgress)
	}

	onDrag(localX1, localY1, localX2, localY2){
		const { widthInPixels } = this.sourceArea
		const progress = localX2 / widthInPixels

		this.setProgress(progress)
	}

	onPointerDown(localX, localY) {
		const { widthInPixels } = this.sourceArea
		const progress = localX / widthInPixels

		this.setProgress(progress)
	}

	onProgressChange(progress) {

	}
}