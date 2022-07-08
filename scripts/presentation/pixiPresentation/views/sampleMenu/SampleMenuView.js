import { View } from '../View'
import { InteractiveView } from '../InteractiveView'
import { AssemblyGridView } from '../gameplay/assembly/AssemblyGridView'
import { Graphics, Loader } from 'pixi.js'
import { Tabloid } from '../Tabloid'
import { ButtonView } from '../ButtonView'
import { TextBox } from '../text/TextBox'
import { PixiPresentation } from '../../PixiPresentation'

export class SampleMenuView extends View {
	caption
	assemblyGridView
	buttonBack

	constructor() {
		super()
		this.initBackgroundView()
		this.initAssemblyGridView()
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
		this.buttonBack = this.addChild(new ButtonView({text: 'ba|ck'}))
	}

	initCaption() {
		const { resources } = Loader.shared
		const textBox = this.addChild(new TextBox({text: 'sam|ple'}))
		textBox.setFontName(
			'abcdefghijklmnopqrstuvwxyz ',
			resources.font_2.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setSourceArea({widthInPixels: 200, heightInPixels: 100})
			.setMaximalWidth(200)
			.setMaximalHeight(100)
			.setLetterSpacing(1)
			.setLineSpacing(1)

		this.caption = textBox
	}

	initAssemblyGridView() {
		this.assemblyGridView = this.addChild(new AssemblyGridView())
			.setSourceArea({widthInPixels: 256 * 3, heightInPixels: 256 * 3})
		this.assemblyGridView.interactive = false
	}

	presentAssembledSample(data) {
		const { color } = PixiPresentation
		const {
			finalMatrix,
			templateId
		} = data.problem

		const { assemblyGridView, buttonBack } = this

		buttonBack.setColor(color)
		assemblyGridView.setColor(color)
		assemblyGridView.matrix = finalMatrix
		assemblyGridView.templateId = templateId
		assemblyGridView.adjust()
	}

	waitForUserAction() {
		return new Promise(resolve => {this.buttonBack.onClick = resolve})
	}

	updateTargetArea(sidesRatio) {
		const {
			assemblyGridView,
			buttonBack,
			caption,
		} = this

		if(sidesRatio >= 1) {
			//landscape
			caption.setTargetArea({x: 0.2, y: 0, width: 0.6, height: 0.3})
			assemblyGridView.setTargetArea({x: 0.2, y: 0.3, width: 0.6, height: 0.6})
			buttonBack.setTargetArea({x: 0.01, y: 0.8, width: 0.2, height: 0.19})
				.stickLeft()
		} else {
			//portrait
			caption.setTargetArea({x: 0, y: 0, width: 1, height: 0.25})
			assemblyGridView.setTargetArea({x: 0.05, y: 0.25, width: 0.9, height: 0.5})
			buttonBack.setTargetArea({x: 0, y: 0.80, width: 1, height: 0.18})
				.stickCenter()
		}
	}
}