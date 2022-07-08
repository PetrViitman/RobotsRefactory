import { GameLogic } from './scripts/busynessLogic/GameLogic'
//import { ConsolePresentation } from './scripts/presentation/consolePresentation/ConsolePresentation'
import { PixiPresentation } from './scripts/presentation/pixiPresentation/PixiPresentation'
import * as TEMPLATES from './scripts/busynessLogic/assembly/templates'

const gameLogic = new GameLogic()
gameLogic.setPresentation(new PixiPresentation(document.getElementById('applicationContainer')))
gameLogic.init()

