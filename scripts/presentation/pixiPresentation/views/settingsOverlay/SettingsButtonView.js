import { ButtonView } from '../ButtonView'

const LAYOUT_ID_MENU_MAIN = 0
const LAYOUT_ID_MENU_SAMPLE = 1
const LAYOUT_ID_MENU_STATISTICS = 2
const LAYOUT_ID_GAMEPLAY = 3

const LANDSCAPE_AREAS = {}
LANDSCAPE_AREAS[LAYOUT_ID_MENU_MAIN] = {x: 0.85, y: 0.05, width: 0.1, height: 0.1}
LANDSCAPE_AREAS[LAYOUT_ID_MENU_SAMPLE] = {x: 0.85, y: 0.05, width: 0.1, height: 0.1}
LANDSCAPE_AREAS[LAYOUT_ID_MENU_STATISTICS] = {x: 0.85, y: 0.05, width: 0.1, height: 0.1}
LANDSCAPE_AREAS[LAYOUT_ID_GAMEPLAY] = LANDSCAPE_AREAS[LAYOUT_ID_MENU_MAIN]

const PORTRAIT_AREAS = {}
PORTRAIT_AREAS[LAYOUT_ID_MENU_MAIN] = {x: 0.825, y: 0.01, width: 0.15, height: 0.08}
PORTRAIT_AREAS[LAYOUT_ID_MENU_SAMPLE] = PORTRAIT_AREAS[LAYOUT_ID_MENU_MAIN]
PORTRAIT_AREAS[LAYOUT_ID_MENU_STATISTICS] = PORTRAIT_AREAS[LAYOUT_ID_MENU_MAIN]
PORTRAIT_AREAS[LAYOUT_ID_GAMEPLAY] = {x: 0.075 / 2, y: 0.05 - 0.05/2, width: 0.3 - 0.075, height: 0.1 + 0.05}

export class SettingsButtonView extends ButtonView {
	alignModeId = LAYOUT_ID_MENU_MAIN

	constructor() {
		super({text:'o'})
	}

	setAlignMode(modeId) {
		this.alignModeId = modeId
		this.onResize()
	}

	setAlignModeGameplay() { this.setAlignMode(LAYOUT_ID_GAMEPLAY) }
	setAlignModeMainMenu() { this.setAlignMode(LAYOUT_ID_MENU_MAIN) }
	setAlignModeSampleMenu() { this.setAlignMode(LAYOUT_ID_MENU_SAMPLE) }
	setAlignModeStatisticsMenu() { this.setAlignMode(LAYOUT_ID_MENU_STATISTICS) }

	updateTargetArea(sidesRatio) {
		const { alignModeId } = this

		if(sidesRatio >= 1) {
			this.setTargetArea(LANDSCAPE_AREAS[alignModeId])
		} else {
			this.setTargetArea(PORTRAIT_AREAS[alignModeId])
		}
	}

}