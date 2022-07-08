import { View } from '../View'
import { InteractiveView } from '../InteractiveView'
import { Graphics, Loader } from 'pixi.js'
import { Tabloid } from '../Tabloid'
import { TextBox } from '../text/TextBox'
import { Tween } from 'tween.js'
import { PixiPresentation } from '../../PixiPresentation'
import { ProgressBarView } from './ProgressBarView'

export class LoadingScreenView extends View {
	caption
	backgroundView
	preloadingAnimation
	tabloid
	progressBar

	constructor() {
		super()

		this.initPreloadingIcon()
	}

	initPreloadingIcon() {
		const icon = this.addChild(new View())
			.setSourceArea({ widthInPixels: 200, heightInPixels: 200 })
			.setTargetArea({ x: 0.4, y: 0.4, width: 0.2, height: 0.2 })

		const graphics = icon.addChild(new Graphics())
			.beginFill(0xFFFFFF)
			.drawEllipse(-100, -100, 100, 100)
			.endFill()
			.beginFill(0x000000)
			.drawEllipse(-100, -100, 62, 62)
			.drawRect(-200, -115, 200, 30)
			.drawRect(-115, -200, 30, 200)
			.endFill()
			.beginFill(0x000000, 0.62)
			.drawRect(-200, -200, 200, 200)
			.endFill()

		graphics.pivot.set(-100)
		graphics.position.set(100)
		

		this.preloadingAnimation = new Tween(graphics)
			.to({rotation: Math.PI * 2}, 500)
			.repeat(Infinity)
	}


	initBackgroundView() {
		this.backgroundView = this.addChild(new InteractiveView())
			.setSourceArea({widthInPixels: 100, heightInPixels: 100})
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
			.stretchHorizontally()
			.stretchVertically()

		this.backgroundView.addChild(new Graphics())
			.beginFill(PixiPresentation.color)
			.drawRect(0, 0, 100, 100)
			.endFill()
		this.backgroundView.interactive = false
	}

	initTabloid() {
		const { resources } = Loader.shared
		this.tabloid = this.addChild(new Tabloid({
			textures: resources.font_2.textures,
			symbols: 'abcdefghijklmnopqrstuvwxyz',
			maximalWidthInPixels: 400,
			maximalHeightInPixels: 400}))
			.setTargetArea({x: 0, y: 0.2, width: 1, height: 0.6})
	}

	initProgressBarView() {
		this.progressBar = this.addChild(new ProgressBarView({}))
			.setTargetArea({x: 0.3, y: 0.8, width: 0.4, height: 0.05})
			.stickTop()
	}

	init() {
		this.initBackgroundView()
		this.initTabloid()
		this.initProgressBarView()
	}

	presentPreloading() {
		this.preloadingAnimation.start()
	}

	async presentLoading() {
		this.preloadingAnimation.stop()
		await this.tabloid.displayText('loa|din|g')
	}

	displayLoadingProgress(progress) {
		this.progressBar.setProgress(progress)
	}
	

	async waitForUserAction() {
		const { backgroundView, tabloid, progressBar } = this
		const isTouchScreen = 'ontouchstart' in window || navigator.msMaxTouchPoints
		new Tween(progressBar).to({alpha: 0}, 250).start()
		await tabloid.displayText( isTouchScreen ? 'tap' : 'cli|ck')
		backgroundView.interactive = true
		return new Promise(resolve => {backgroundView.onPointerUp = () => {
			resolve()
			backgroundView.interactive = false}})
	}
}