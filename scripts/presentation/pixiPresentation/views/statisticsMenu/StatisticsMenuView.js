import { View } from '../View'
import { InteractiveView } from '../InteractiveView'
import { StatisticsGridView } from './StatisticsGridView'
import { Graphics, Loader } from 'pixi.js'
import { Tabloid } from '../Tabloid'
import { ButtonView } from '../ButtonView'
import { TextBox } from '../text/TextBox'
import { PixiPresentation } from '../../PixiPresentation'

export class StatisticsMenuView extends View {
	caption
	statisticsGridView
	button

	constructor() {
		super()
		this.initBackgroundView()
		this.initStatisticsGridView()
		this.initButtons()
		this.initCaption()
	}

	initBackgroundView() {
		const backgroundView = this.addChild(new View())
			.setSourceArea({widthInPixels: 100, heightInPixels: 100})
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
			.stretchHorizontally()
			.stretchVertically()

		backgroundView.addChild(new Graphics())
			.beginFill(0x000000)
			.drawRect(0, 0, 100, 100)
			.endFill()
	}

	initButtons(){
		this.button = this.addChild(new ButtonView({text: 'ba|ck'}))
	}

	initCaption() {
		const { resources } = Loader.shared
		const textBox = this.addChild(new TextBox({text: 're|po'}))
		textBox.setFontName(
			'abcdefghijklmnopqrstuvwxyz ',
			resources.font_2.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setSourceArea({widthInPixels: 200, heightInPixels: 200})
			.setMaximalWidth(200)
			.setMaximalHeight(200)
			.setFontSize(100)
			.setLetterSpacing(2)
			.setLineSpacing(2)

		this.caption = textBox
	}

	initStatisticsGridView() {
		this.statisticsGridView = this.addChild(new StatisticsGridView())
	}

	presentStatistics(data) {
		this.presentUnits(data)
	}

	presentUnits(data, offsetUnitsCount = 0) {
		const { assembledUnitsCount } = data
		const { statisticsGridView, button, caption } = this
		const { color } = PixiPresentation

		button.setColor(color)
		statisticsGridView.setUnitsColor(color)
		statisticsGridView.presentUnits(assembledUnitsCount)

		for(let i = assembledUnitsCount + offsetUnitsCount; i < assembledUnitsCount; i++ ) {
			statisticsGridView.fadeUnit({index: i, duration: 0})
		}

	}

	async presentNewUnit(data) {
		const { assembledUnitsCount } = data
		const { statisticsGridView } = this
		await statisticsGridView.fadeUnit({index: assembledUnitsCount - 1, targetAlpha: 1})
	}

	async presentUnitsLost(data) {
		const { statisticsGridView } = this
		const {
			assembledUnitsCount,
			roundDescriptor: {penalty}
		} = data


		for(let i = assembledUnitsCount - 1;
			i >= assembledUnitsCount - penalty && i >= 0;
			i-- ) {
			await statisticsGridView.fadeUnit({index: i})
		}
	}

	waitForUserAction() {
		return new Promise(resolve => {this.button.onClick = resolve})
	}

	updateTargetArea(sidesRatio) {
		const {
			statisticsGridView,
			button,
			caption,
		} = this

		if(sidesRatio >= 1) {
			//landscape
			caption.setTargetArea({x: 0.2, y: 0.02, width: 0.6, height: 0.28})
			statisticsGridView.setTargetArea({x: 0.2, y: 0.35, width: 0.6, height: 0.55})
			button.setTargetArea({x: 0.01, y: 0.8, width: 0.2, height: 0.19})
				.stickLeft()
		} else {
			//portrait
			caption.setTargetArea({x: 0.05, y: 0.075, width: 0.9, height: 0.225})
			statisticsGridView.setTargetArea({x: 0.05, y: 0.35, width: 0.9, height: 0.4})
			button.setTargetArea({x: 0, y: 0.80, width: 1, height: 0.18})
				.stickCenter()
		}
	}
}