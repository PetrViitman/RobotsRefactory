import { Graphics, Loader } from 'pixi.js'
import { View } from '../View'
import { ButtonView } from '../ButtonView'
import { TextBox } from '../text/TextBox'
import { PixiPresentation } from '../../PixiPresentation'

const BUTTONS_SPACING = 20

export class MainMenuView extends View {
	logo
	buttonsPanel
	buttonPlay
	buttonAuto
	buttonSample
	buttonStats
	buttons
	scoreIndicator

	constructor() {
		super()

		this.initBackgroundView()
		this.initButtonsPanel()
		this.initLogo()
		this.initScoreIndicator()
	}

	initScoreIndicator() {
		const { resources } = Loader.shared
		const textBox = this.addChild(new TextBox({text: 'score: 123'}))
		textBox.setFontName(
			'0123456789abcdefghijklmnopqrstuvwxyz.: ',
			resources.font.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setSourceArea({widthInPixels: 300, heightInPixels: 100})
			.setMaximalWidth(300)
			.setMaximalHeight(100)
			.setFontSize(15)


		textBox.alpha = 0.38
		this.scoreIndicator = textBox
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


	initButtonsPanel() {
		const { resources } = Loader.shared
		const panel = this.addChild(new View())

		this.buttonsPanel = panel
		this.buttonPlay = panel.addChild(new ButtonView({text: 'pl|ay'}))
		this.buttonAuto = panel.addChild(new ButtonView({text: 'au|to'}))
		this.buttonSample = panel.addChild(new ButtonView({text: 'sam|ple'}))
		this.buttonStats = panel.addChild(new ButtonView({text: 're|po'}))
		this.buttons = [
			this.buttonPlay,
			this.buttonAuto,
			this.buttonSample,
			this.buttonStats,
		]
	}

	initLogo() {
		const { resources } = Loader.shared
		const textBox = this.addChild(new TextBox({text: 'ref|act|ory'}))
		textBox.setFontName(
			'abcdefghijklmnopqrstuvwxyz ',
			resources.font_2.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setSourceArea({widthInPixels: 100, heightInPixels: 100})
			.setMaximalWidth(100)
			.setMaximalHeight(100)
			.setLetterSpacing(1)
			.setLineSpacing(1)

		this.logo = textBox
	}

	updateTargetArea(sidesRatio) {
		const {
			buttonsPanel,
			buttonPlay,
			buttonAuto,
			buttonSample,
			buttonStats,
			buttons,
			logo,
			scoreIndicator,
		} = this

		const buttonSpaceSize = buttonPlay.sourceArea.widthInPixels + BUTTONS_SPACING
		const offsetX = BUTTONS_SPACING * 0.5
		
		if(sidesRatio >= 1) { //landscape
			logo.setTargetArea({x: 0.1, y: 0.1, width: 0.8, height: 0.35})

			buttonsPanel.setSourceArea({
				widthInPixels: buttonSpaceSize * 4,
				heightInPixels: buttonSpaceSize})

			buttonsPanel.setTargetArea({x: 0.1, y: 0.55, width: 0.8, height: 0.25})
			buttons.forEach((button, i) => {
				button.y = 0
				button.x = i * buttonSpaceSize + offsetX
			})

			scoreIndicator.setTargetArea({x: 0.2, y: 0.8, width: 0.6, height: 0.2})

		} else { //wide portrait
			logo.setTargetArea({x: 0.1, y: 0.1, width: 0.8, height: 0.35})


			buttonsPanel.setSourceArea({
				widthInPixels: buttonSpaceSize * 2,
				heightInPixels: buttonSpaceSize * 2})

			buttonsPanel.setTargetArea({x: 0.1, y: 0.5, width: 0.8, height: 0.35})
			buttonPlay.position.set(offsetX, 0)
			buttonAuto.position.set(offsetX + buttonSpaceSize, 0)
			buttonSample.position.set(offsetX, buttonSpaceSize)
			buttonStats.position.set(offsetX + buttonSpaceSize, buttonSpaceSize)

			scoreIndicator.setTargetArea({x: 0.2, y: 0.85, width: 0.6, height: 0.15})
		}
	}

	present(data) {
		const {
			buttonPlay,
			buttonAuto,
			buttonSample,
			scoreIndicator,
			buttons,
		} = this

		const { color } = PixiPresentation
		const isRoundInProgress = !!data.problem

		buttons.forEach(button => button.setColor(color))
		buttonPlay.setLabel(isRoundInProgress ? 'con|tin|ue  ' : 'pl|ay')
		buttonAuto.setEnabled(isRoundInProgress)
		buttonSample.setEnabled(isRoundInProgress)

		scoreIndicator.setText('score:' + (data.totalAssembliesCount * 15))
	}


	getUserAction(data) {
		const {
			buttonPlay,
			buttonAuto,
			buttonSample,
			buttonStats,
			scoreIndicator,
		} = this

		return Promise.any([
				new Promise(resolve => buttonPlay.onClick = () => { resolve('play') }),
				new Promise(resolve => buttonSample.onClick = () => { resolve('sample') }),
				new Promise(resolve => buttonStats.onClick = () => { resolve('statistics') }),
				new Promise(resolve => buttonAuto.onClick = () => { resolve('auto') }),
			])

	}
}