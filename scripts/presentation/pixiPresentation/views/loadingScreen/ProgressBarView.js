import { View } from '../View'
import { Graphics } from 'pixi.js'

export class ProgressBarView extends View {
	bar

	constructor({widthInPixels = 150, heightInPixels = 20}) {
		super()

		//background
		this.addChild(new Graphics())
			.beginFill(0x000000)
			.drawRect(0, 0, widthInPixels, heightInPixels)
			.endFill()
		this.bar = this.addChild(new Graphics())
			.beginFill(0xFFFFFF)
			.drawRect(0, 0, widthInPixels, heightInPixels)
			.endFill()
		this.bar.scale.x = 0

		this.setSourceArea({widthInPixels, heightInPixels})
	}

	setProgress(progress = 0.5) {
		this.bar.scale.x = progress
	}
}