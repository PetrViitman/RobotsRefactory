import { VirtualPresentation } from '../VirtualPresentation'
import * as TWEEN from 'tween.js'
import * as PIXI from 'pixi.js'
import { sound } from '@pixi/sound'
import { View } from './views/View'
import { InteractiveView } from './views/InteractiveView'
import { GameplayView } from './views/gameplay/GameplayView'
import { MainMenuView } from './views/mainMenu/MainMenuView'
import { SampleMenuView } from './views/sampleMenu/SampleMenuView'
import { StatisticsMenuView } from './views/statisticsMenu/StatisticsMenuView'
import { LoadingScreenView } from './views/loadingScreen/LoadingScreenView'
import { FullScreenMessageView } from './views/fullScreenMessage/FullScreenMessageView'
import { SettingsOverlayView } from './views/settingsOverlay/SettingsOverlayView'
import { SettingsButtonView } from './views/settingsOverlay/SettingsButtonView'


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
PIXI.settings.RESOLUTION = window.devicePixelRatio
PIXI.settings.ROUND_PIXELS = false
PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON
PIXI.settings.RENDER_OPTIONS.antialias = true

const UI_COLORS = [
	0xFF7734,
	0xF9B439,
	0xf5403e,
]

export class PixiPresentation extends VirtualPresentation {
	static color = UI_COLORS[Math.trunc(Math.random() * UI_COLORS.length)]
	static iterateColor = () => { PixiPresentation.color = UI_COLORS[(UI_COLORS.indexOf(PixiPresentation.color) + 1) % UI_COLORS.length]}

	pixiApplication
	mainMenu
	sampleMenu
	statisticsMenu
	gameplayView
	fullScreenMessage
	overlay
	buttonSettings
	settingsOverlay

	constructor(htmlElement) {
		super()
		const pixiApplication = new PIXI.Application({ width: 640, height: 480 })
		htmlElement.appendChild(pixiApplication.view)
		this.pixiApplication = pixiApplication
		PIXI.Ticker.shared.add(()=>{TWEEN.update()})
		window.addEventListener('resize', event => {this.onResize()})
		document.addEventListener('touchend', event => {pixiApplication.view.requestFullscreen().catch(err => {})})
		this.loadingScreen = this.pixiApplication.stage.addChild(new LoadingScreenView())
		this.onResize()
	}

	init() {
		const { stage } = this.pixiApplication
		this.gameplayView = stage.addChild(new GameplayView())
		this.mainMenu = stage.addChild(new MainMenuView())
		this.sampleMenu = stage.addChild(new SampleMenuView())
		this.statisticsMenu = stage.addChild(new StatisticsMenuView())
		this.fullScreenMessage = stage.addChild(new FullScreenMessageView())
		this.initButtonSettings()
		this.initOverlay()
		this.initSettingsOverlay()
		this.onResize()
	}

	initOverlay() {
		const overlay = this.pixiApplication.stage.addChild(new View())
			.setSourceArea({widthInPixels: 100, heightInPixels: 100})
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
			.stretchHorizontally()
			.stretchVertically()

		overlay.addChild(new PIXI.Graphics())
			.beginFill(0x000000)
			.drawRect(0, 0, 100, 100)
			.endFill()
		this.overlay = overlay
	}

	initButtonSettings() {
		this.buttonSettings = new SettingsButtonView()
		this.pixiApplication.stage.addChild(this.buttonSettings)
	}

	initSettingsOverlay() {
		this.settingsOverlay = new SettingsOverlayView()
		this.pixiApplication.stage.addChild(this.settingsOverlay)
		this.buttonSettings.onClick = () => { this.settingsOverlay.show() }
	}

	onResize() {
		const {
			pixiApplication,
			pixiApplication: { view: {clientWidth, clientHeight}}
		} = this

		View.clientWidth = clientWidth
		View.clientHeight = clientHeight

		pixiApplication.renderer.resize(clientWidth, clientHeight)
		pixiApplication.stage.children.forEach(child => child.onResize())
	}

	cleanup() {
		this.sampleMenu.visible = false
		this.statisticsMenu.visible = false
		this.mainMenu.visible = false
		this.gameplayView.visible = false
		this.fullScreenMessage.visible = false
		this.buttonSettings.setColor(PixiPresentation.color)
	}

	wait(milliseconds) {
		return new Promise(resolve => { setTimeout(resolve, milliseconds > 0 ? milliseconds : 0) })
	}

	async presentLoading() {
		const { loadingScreen } = this

		loadingScreen.presentPreloading()

		// loading resources to present loading screnn itself
		await new Promise(resolve => {
			PIXI.Loader.shared
				.add('font_2', './assets/spritesheets/font_2.json')
				.load()
				.onComplete.add(resolve)
		})

		loadingScreen.init()
		await loadingScreen.presentLoading()
		this.onResize()

		//loading the rest of resources
		await new Promise(resolve => {
			const loader = PIXI.Loader.shared
			loader
				.add('font', './assets/spritesheets/font.json')
				.add('interface', './assets/spritesheets/interface.json')
				.add('objects', './assets/spritesheets/objects.json')
				.add('music', './assets/audio/music.wav')
				.add('game_over', './assets/audio/game_over.wav')
				.add('success', './assets/audio/success.wav')
				.add('next_round', './assets/audio/next_round.wav')
				.add('time_is_out', './assets/audio/time_is_out.wav')
				.add('UI', './assets/audio/UI.wav')
				.load()

			loader.onLoad.add(() => {loadingScreen.displayLoadingProgress(loader.progress / 100)})
			loader.onComplete.add(resolve)
		})
		await loadingScreen.waitForUserAction()
		sound.volumeMusic = 1
		sound.volumeSFX = 1
		document.addEventListener('visibilitychange', () => {
			switch(document.visibilityState) {
				case 'visible': sound.resumeAll(); break
				case 'hidden': sound.pauseAll(); break
			}
		})

		this.init()
		sound.play('music', {loop: true})
		//sound.pauseAll()
		// console.log(sound)
	}


	async presentMenuMain(data, reason) {
		const {
			mainMenu,
			gameplayView,
			buttonSettings,
		} = this

		this.cleanup()
		buttonSettings.setAlignModeMainMenu()
		mainMenu.visible = true
		mainMenu.present(data)
		await this.fadeOverlay(0)
		const userAction = await mainMenu.getUserAction(data)
		await this.fadeOverlay(1)
		return userAction
	}

	async presentMenuAssembledSample(data, reason) {
		const { sampleMenu, buttonSettings } = this

		this.cleanup()
		buttonSettings.setAlignModeSampleMenu()
		sampleMenu.visible = true
		sampleMenu.presentAssembledSample(data)
		await this.fadeOverlay(0)
		const resolution = await sampleMenu.waitForUserAction(data)
		await this.fadeOverlay(1)
		return resolution
	}

	async presentMenuStatistics(data, reason) {
		const { statisticsMenu, buttonSettings } = this
		this.cleanup()
		buttonSettings.setAlignModeStatisticsMenu()
		statisticsMenu.visible = true
		statisticsMenu.presentStatistics(data)
		await this.fadeOverlay(0)
		const resolution = await statisticsMenu.waitForUserAction()
		await this.fadeOverlay(1)
		return resolution
	}

	async presentGameplay(data, reason) {
		const {
			mainMenu,
			gameplayView,
			buttonSettings,
		} = this
		this.cleanup()
		buttonSettings.setAlignModeGameplay()
		gameplayView.visible = true
		gameplayView.presentAssembly(data)
		await this.fadeOverlay(0)
		return await gameplayView.getUserGameplayAction()
	}

	async validateAutoSlide(data) {
		const {
			gameplayView,
			buttonSettings,
		} = this
		buttonSettings.setAlignModeGameplay()
		this.cleanup()
		gameplayView.visible = true
		await this.fadeOverlay(0)
		await gameplayView.presentAutoSlide(
				data,
				data.solution.actionsDescriptors[0])
	}

	validateGameplayCountdown(data) {
		this.gameplayView.validateCountDownTabloid(data)
	}

	async presentCompletion(data) {
		const { statisticsMenu, buttonSettings } = this

		await this.fadeOverlay(1)
		this.cleanup()
		buttonSettings.setAlignModeStatisticsMenu()
		statisticsMenu.visible = true
		statisticsMenu.presentUnits(data, -1)
		await this.fadeOverlay(0)
		sound.play('success', {volume: sound.volumeSFX})
		await statisticsMenu.presentNewUnit(data)
		await statisticsMenu.waitForUserAction()
		await this.fadeOverlay(1)
		PixiPresentation.iterateColor()
	}

	async presentPenalty(data) {
		const {
			statisticsMenu,
			fullScreenMessage,
			buttonSettings,
		} = this
		const {
			assembledUnitsCount,
			roundDescriptor: { penalty }
		} = data
		const isRoundLost = assembledUnitsCount - penalty < 0
		sound.play('time_is_out', {volume: sound.volumeSFX})
		await this.fadeOverlay(1)
		this.cleanup()
		buttonSettings.setAlignModeStatisticsMenu()
		statisticsMenu.visible = true
		statisticsMenu.presentUnits(data)
		await this.fadeOverlay(0)
		await statisticsMenu.presentUnitsLost(data)
		if(isRoundLost) {
			await this.wait(1000)
			await this.fadeOverlay(1)
			fullScreenMessage.setText('game|over')
			fullScreenMessage.visible = true
			sound.play('game_over', {volume: sound.volumeSFX})
			await this.fadeOverlay(0)
			await fullScreenMessage.waitForUserAction()
		} else {
			await statisticsMenu.waitForUserAction()
		}
		PixiPresentation.iterateColor()
		await this.fadeOverlay(1)
	}

	async validateGameplayEscapeToMainMenu(data) {
		await this.fadeOverlay(1)
	}

	validateNextRound() {
		sound.play('next_round', {volume: sound.volumeSFX})
	}

	fadeOverlay(targetAlpha = 1) {
		return new Promise(resolve => {
			new TWEEN.Tween(this.overlay)
			.to({alpha: targetAlpha}, 250)
			.onComplete(resolve)
			.start()
		})
	}
}