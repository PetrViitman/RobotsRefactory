import { BusynessLogic } from './BusynessLogic'
import { AssemblyGrid } from './assembly/AssemblyGrid'
import * as ASSEMBLY from './assembly/templates'
import { ROBOTS_TEMPLATES, ROUNDS_DESCRIPTORS } from './assembly/templates'
import { Problem } from './assembly/problem/Problem'
import { Solver } from './assembly/solution/Solver'
import { Solution } from './assembly/solution/Solution'

const STATE_ID_LOADING = 'Loading'
const STATE_ID_MENU_MAIN = 'MenuMain'
const STATE_ID_MENU_STATISTICS = 'MenuStatistics'
const STATE_ID_MENU_ASSEMBLED_SAMPLE = 'MenuAssembledSample'
const STATE_ID_GAMEPLAY = 'Gameplay'
const STATE_ID_COMPLETION = 'Completion'
const STATE_ID_PENALTY = 'Penalty'

export class GameLogic extends BusynessLogic {
	data = {
		assembledUnitsCount: 0,
		totalAssembliesCount: 0,
		state: undefined,
		roundDescriptor: null,
		problem: null,
		solution: null,
		assemblyGrid: new AssemblyGrid(),
		roundIndex: 0,
		interval: null,
	}
	solver = new Solver()

	async init() {
		await this.setState(STATE_ID_LOADING)
		this.goToMainMenu()
	}

	resetRound() {
		const { data } = this
		const newRoundDescriptor = ROUNDS_DESCRIPTORS[data.roundIndex]
		newRoundDescriptor.remainingTime = newRoundDescriptor.duration
		newRoundDescriptor.timeStamp = Date.now()
		data.roundDescriptor = newRoundDescriptor
		data.interval = setInterval(() => this.updateRoundTimeFlow(), 300)
	}

	resetProblem() {
		const {
			data,
			data: {assemblyGrid},
			data: {totalAssembliesCount},
			data: {roundDescriptor},
			data: {roundDescriptor: {templatesIds}},
			data: {roundDescriptor: {difficulty}},
		} = this


		const nextRobotIdIndex = totalAssembliesCount % templatesIds.length
		const initialProblemStepIndex = Math.min(totalAssembliesCount, difficulty)

		const templateId = templatesIds[nextRobotIdIndex]
		const problem = new Problem({
			assemblyDescriptor: ROBOTS_TEMPLATES[templateId],
			initialProblemStepIndex})
		const {problemSteps, initialMatrix} = problem
		problem.templateId = templateId
		data.problem = problem
		data.solution = null
		assemblyGrid.setMatrix(initialMatrix)
	}

	async updateRoundTimeFlow() {
		const {
				data,
				data: { state },
				data: { roundIndex },
				data: { roundDescriptor }
			} = this

		const timeStamp = Date.now()
		const elapsedTime = timeStamp - roundDescriptor.timeStamp
		roundDescriptor.timeStamp = timeStamp

		if(state !== STATE_ID_GAMEPLAY) return
		if(data.solution) return
		if(document.visibilityState === 'hidden') return //should not be here

		roundDescriptor.remainingTime -= elapsedTime
		this.kick('GameplayCountdown')
		if(roundDescriptor.remainingTime <= 0) this.finishRound()
	}

	async finishRound() {
		const {
				data,
				data: { roundDescriptor }
			} = this

		clearInterval(data.interval)
		this.unpend()
		await this.setState(STATE_ID_PENALTY)
		data.assembledUnitsCount -= roundDescriptor.penalty
		data.roundDescriptor = null


		if(data.assembledUnitsCount < 0) {
			data.roundIndex = 0
			data.assembledUnitsCount = 0
			data.totalAssembliesCount = 0
			data.roundDescriptor = null
			data.problem = null
			data.solution = null
			this.goToMainMenu()
		} else {
			data.roundIndex = Math.min(data.roundIndex + 1, ROUNDS_DESCRIPTORS.length - 1)
			this.playGame()
		}
	}

	async playGame() {
		const {
			data,
			data: { solution },
			data: { assemblyGrid },
			data: { totalAssembliesCount }} = this

		//setting new gameplay round if needed
		if(!data.roundDescriptor) {
			this.resetRound()
			this.resetProblem()
			this.kick('NextRound')
		}

		const {roundDescriptor, problem} = data
		const gameplayOptions = {
			'mainMenu': async () => {
				this.state = undefined
				await this.kick('GameplayEscapeToMainMenu')
				this.goToMainMenu()
			},
			'slide': assemblyGrid.slide.bind(assemblyGrid),
		}

		if(solution) {
			//auto slide
			const {actionsDescriptors} = solution
			await this.kick('AutoSlide')
			assemblyGrid.slide(actionsDescriptors.shift())
		} else {
			//waiting for user manual action
			const userInput = await this.setState(STATE_ID_GAMEPLAY)
			const {option, parameters} = userInput
			if(data.state !== STATE_ID_GAMEPLAY) return
			//applying user manual action
			await gameplayOptions[option]?.(parameters)
			if(data.state !== STATE_ID_GAMEPLAY) return
		}

		//checking if problem is solved
		if(assemblyGrid.isEqualTo(problem.finalMatrix)) {
			data.totalAssembliesCount++
			data.assembledUnitsCount++
			data.solution = null
			await this.setState(STATE_ID_COMPLETION)
			this.resetProblem()
		}

		this.playGame()
	}

	async goToMainMenu() {
		const mainMenuOptions = {
			'play': () => { this.playGame() },
			'statistics': () => { this.goToStatisticsMenu() },
			'sample': () => { this.goToAssembledSampleMenuOption() },
			'auto': () => {
				const {
					solver,
					data,
					data: {problem},
					data: {problem: {problemSteps}},
					data: {assemblyGrid},
					data: {assemblyGrid: {matrix}},
					data: {assemblyGrid: {invertedActionsDescriptors}}
				} = this

				data.solution = solver
								.getSolutionToProblem({ problem, initialMatrix: matrix})
								??
								new Solution()
								.setActionsDescriptors(invertedActionsDescriptors)
								.appendRevertedProblemSteps({problemSteps})

				this.playGame()
			},
		}

		const userInput = await this.setState(STATE_ID_MENU_MAIN)
		mainMenuOptions[userInput]?.()
	}

	async goToStatisticsMenu() {
		await this.setState(STATE_ID_MENU_STATISTICS)
		this.goToMainMenu()
	}

	async goToAssembledSampleMenuOption() {
		await this.setState(STATE_ID_MENU_ASSEMBLED_SAMPLE)
		this.goToMainMenu()
	}
}