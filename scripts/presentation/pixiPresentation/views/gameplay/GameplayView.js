import { View } from '../View'
import { InteractiveView } from '../InteractiveView'
import { AssemblyGridView } from './assembly/AssemblyGridView'
import { Graphics, Loader } from 'pixi.js'
import { Tabloid } from '../Tabloid'
import { TextBox } from '../text/TextBox'
import { ButtonView } from '../ButtonView'
import { PixiPresentation } from '../../PixiPresentation'

export class GameplayView extends View {
	assemblyGridView
	countDownTabloid
	buttonMenu
	textBox

	constructor() {
		super()

		this.initBackgroundView()
		this.initAssemblyGridView()
		this.initCountDownTabloid()
		this.initButtons()
		this.initTextBox()
	}

	initButtons(){
		this.buttonMenu = this.addChild(new ButtonView({text: 'me|nu'}))
	}

	initCountDownTabloid() {
		const { resources } = Loader.shared
		this.countDownTabloid = this.addChild(new Tabloid({textures: resources.font.textures}))
	}

	initTextBox() {
		const { resources } = Loader.shared
		this.textBox = this.addChild(new TextBox({}))
			.setFontName(
				'0123456789abcdefghijklmnopqrstuvwxyz.: ',
				resources.font.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setSourceArea({widthInPixels: 300, heightInPixels: 100})
			.setMaximalWidth(300)
			.setMaximalHeight(100)
			.setFontSize(25)
		this.textBox.alpha = 0.38
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

	initAssemblyGridView() {
		const { resources } = Loader.shared
		this.assemblyGridView = this.addChild(new AssemblyGridView(resources))
			.setSourceArea({widthInPixels: 256 * 3, heightInPixels: 256 * 3})
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
	}

	presentAssembly(data) {
		const { color } = PixiPresentation
		const {
			assemblyGrid: { matrix },
			problem: { templateId },
			roundDescriptor: { penalty },
		} = data

		const { assemblyGridView, buttonMenu, textBox } = this

		buttonMenu.setColor(color)
		assemblyGridView.setColor(color)
		assemblyGridView.matrix = matrix
		assemblyGridView.templateId = templateId
		assemblyGridView.dropSlideActionParameters()		
		assemblyGridView.adjust()
		textBox.setText('expenses:' + penalty)
		assemblyGridView.interactive = false
	}

	validateCountDownTabloid(data) {
		const { remainingTime } = data.roundDescriptor

		const renainingMinutes = Math.trunc(remainingTime / 60000)
		const remainingSeconds = Math.trunc(remainingTime / 1000) - renainingMinutes * 60

		this.countDownTabloid.displayText(
			renainingMinutes +
			':' +
			(remainingSeconds < 10 ? '0' : '') +
			remainingSeconds)
	}

	getUserGameplayAction() {
		const {assemblyGridView, buttonMenu} = this
		assemblyGridView.interactive = true

		return Promise.any([
				assemblyGridView.getUserSlideAction(),
				new Promise(resolve => {buttonMenu.onClick = ()=> {resolve({option: 'mainMenu'})}})
			])
	}

	async presentAutoSlide(data, descriptor) {
		const { assemblyGridView } = this
		const { matrix } = data.assemblyGrid

		assemblyGridView.interactive = false
		assemblyGridView.matrix = matrix
		assemblyGridView.adjust()

		await assemblyGridView.presentSlide(descriptor)
	}


	updateTargetArea(sidesRatio) {
		const {
			assemblyGridView,
			countDownTabloid,
			buttonMenu,
			textBox
		} = this

		if(sidesRatio >= 1) {
			//landscape
			assemblyGridView.setTargetArea({x: 0.2, y: 0.05, width: 0.6, height: 0.85})
			textBox.setTargetArea({x: 0.2, y: 0.9, width: 0.6, height: 0.1})
				.stickMiddle()
			countDownTabloid.setTargetArea({x: 0, y: 0.0, width: 0.2, height: 0.2})
			buttonMenu.setTargetArea({x: 0.825, y: 0.4, width: 0.15, height: 0.2})
		} else {
			//portrait
			assemblyGridView.setTargetArea({x: 0.05, y: 0.2, width: 0.9, height: 0.6})
			textBox.setTargetArea({x: 0.2, y: 0.8, width: 0.6, height: 0.2})
				.stickTop()
			countDownTabloid.setTargetArea({x: 0.333, y: 0.025, width: 0.333, height: 0.15})
			buttonMenu.setTargetArea({x: 1 - 0.3, y: 0.025, width: 0.29, height: 0.15})
		}
	}
}