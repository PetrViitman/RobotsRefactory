import { View } from '../View'
import { InteractiveView } from '../InteractiveView'
import { Graphics, Loader } from 'pixi.js'
import { Tabloid } from '../Tabloid'
import { ButtonView } from '../ButtonView'
import { TextBox } from '../text/TextBox'
import { SlideBarView } from './SlideBarView'
import { PixiPresentation } from '../../PixiPresentation'
import { Tween } from 'tween.js'
import { sound } from '@pixi/sound'


export class SettingsOverlayView extends InteractiveView {
	backgroundView
	button
	slideBarMusic
	slideBarSounds

	constructor() {
		super()
		this.initBackgroundView()
		this.initCaption()
		this.initButton()
		this.initSlideBars()
		this.buttonMode = false
		this.alpha = 0
		this.visible = false
	}

	initBackgroundView() {
		this.backgroundView = this.addChild(new View())
			.setSourceArea({widthInPixels: 100, heightInPixels: 100})
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
			.stretchHorizontally()
			.stretchVertically()

		this.backgroundView.addChild(new Graphics())
			.beginFill(0x000000, 0.85)
			.drawRect(0, 0, 100, 100)
			.endFill()
	}

	initCaption() {
		const { resources } = Loader.shared
		const textBox = this.addChild(new TextBox({text: 'vol|ume'}))
		textBox.setFontName(
			'abcdefghijklmnopqrstuvwxyz ',
			resources.font_2.textures)
			.setAlignCenter()
			.setAlignMiddle()
			.setSourceArea({widthInPixels: 200, heightInPixels: 150})
			.setMaximalWidth(200)
			.setMaximalHeight(150)
			.setLetterSpacing(1)
			.setLineSpacing(1)
			.setFontSize(100)

		this.caption = textBox
	}

	initButton(){
		this.button = this.addChild(new ButtonView({text: 'x'}))
		this.button.setColor(0x444444)
		this.button.onClick = () => {this.hide()}
	}

	initSlideBars() {
		this.slideBarMusic = new SlideBarView({
			widthInPixels: 300,
			heightInPixels: 50,
			text: 'music'})
		this.addChild(this.slideBarMusic)
		this.slideBarMusic.setProgress(sound.volumeMusic)
		this.slideBarMusic.onProgressChange = (progress) => {
			sound.volumeMusic = progress
			sound._sounds.music.volume = progress
		}

		this.slideBarSounds = new SlideBarView({
			widthInPixels: 300,
			heightInPixels: 50,
			text: 'sfx'})
		this.addChild(this.slideBarSounds)
		this.slideBarSounds.setProgress(sound.volumeSFX)
		this.slideBarSounds.onProgressChange = (progress) => {
			sound.volumeSFX = progress
		}
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


	show() {
		this.visible = true
		new Tween(this)
			.to({alpha: 1}, 250)
			.start()
	}
	hide() {
		new Tween(this)
			.to({alpha: 0}, 250)
			.onComplete(() => {this.visible = false})
			.start()
	}

	updateTargetArea(sidesRatio) {
		const {
			backgroundView,
			button,
			slideBarMusic,
			slideBarSounds,
			caption,
		} = this

		if(sidesRatio >= 1) {
			//landscape
			caption.setTargetArea({x: 0.05, y: 0.05, width: 0.9, height: 0.3})
			slideBarMusic.setTargetArea({x: 0.05, y: 0.4, width: 0.9, height: 0.1})
			slideBarSounds.setTargetArea({x: 0.05, y: 0.6, width: 0.9, height: 0.1})
				.stickMiddle()
			button.setTargetArea({x: 0.01, y: 0.8, width: 0.2, height: 0.19})
		} else {
			//portrait
			caption.setTargetArea({x: 0.05, y: 0.05, width: 0.9, height: 0.35})
			slideBarMusic.setTargetArea({x: 0.1, y: 0.4, width: 0.8, height: 0.15})
			slideBarSounds.setTargetArea({x: 0.1, y: 0.6, width: 0.8, height: 0.15})
				.stickTop()
			button.setTargetArea({x: 0, y: 0.80, width: 1, height: 0.18})
		}
	}
}