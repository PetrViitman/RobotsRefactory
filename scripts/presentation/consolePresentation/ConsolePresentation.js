import { VirtualPresentation } from '../VirtualPresentation'

export class ConsolePresentation extends VirtualPresentation {

	async presentMenuMain(data, reason) {
		this.log('CONTROLS: \n 1 - ' + (data.roundDescriptor ? 'continue' : 'play') + ' \n 2 - sample \n 3 - auto \n 4 - robots \n 5 - options\n')

		return new Promise(resolve => {
			const keysMap = {
				49: 'play',
				50: data.problem ? 'sample' : '',
				51: (data.problem && !data.solution) ? 'auto' : undefined,
				52: 'statistics',
			}
			const listener = document.addEventListener('keydown', (event) => {
				const userInputOption = keysMap[event.keyCode]
				if(userInputOption !== undefined) {
					resolve(userInputOption);
					document.removeEventListener('keydown', listener)
				}
			})
		})
	}

	validateGameplayCountdown(data) {
		const { roundDescriptor: {remainingTime}} = data
		const remainingRoundSeconds = Math.trunc(remainingTime / 1000)
		if(remainingRoundSeconds % 10 === 0)
			 this.log(remainingRoundSeconds + ' seconds left')
	}

	validateAutoSlide(data) {
		const { matrix } = data.assemblyGrid
		let text = 'auto slide:\n'
		matrix.forEach(row => text += row + '\n')
		this.log(text)
	}

	async presentGameplay(data, reason) {
		const { matrix } = data.assemblyGrid
		let text = 'CONTROLS: \n 1|2|3 - to slide rows \n 4|5|6 - to slide columns\n 7 - main menu\nassembly:\n'

		matrix.forEach(row => text += row + '\n')
		this.log(text)

		return new Promise(resolve => {
			const actionsMap = {
				49: {option: 'slide', parameters: {slideTypeId: 0, entryIndex: 0, delta: 1}},
				50: {option: 'slide', parameters: {slideTypeId: 0, entryIndex: 1, delta: 1}},
				51: {option: 'slide', parameters: {slideTypeId: 0, entryIndex: 2, delta: 1}},
				52: {option: 'slide', parameters: {slideTypeId: 1, entryIndex: 0, delta: 1}},
				53: {option: 'slide', parameters: {slideTypeId: 1, entryIndex: 1, delta: 1}},
				54: {option: 'slide', parameters: {slideTypeId: 1, entryIndex: 2, delta: 1}},
				55: {option: 'mainMenu'}
			}

			const listener = document.addEventListener('keydown', (event) => {

				const actionDescriptor = actionsMap[event.keyCode]

				if(actionDescriptor !== undefined) {
					resolve(actionDescriptor);
					document.removeEventListener('keydown', listener)
				}
			})
		})
	}

	async presentCompletion(data, reason) {
		const {
			assembliesCount,
			assemblyGrid: {matrix}
			} = data

		let text = ''
		matrix.forEach(row => text += '\n' + row )
		this.log(text)
		this.log('NEW ROBOT ASSEMBLED!\ntotal assemblies: ' + assembliesCount + '\nCONTROLS: \n 1 - continue')

		return new Promise(resolve => {
			const listener = document.addEventListener('keydown', event => {
				if(event.keyCode === 49) {
					resolve()
					document.removeEventListener('keydown', listener)
				}
			})
		})
	}


	async presentMenuAssembledSample(data, reason) {
		const { matrix } = data.problem

		let text = ''
		matrix.forEach(row => text += '\n' + row )
		this.log('ASSEMBLED SAMPLE:\n' + text + 'press any key to continue')

		return new Promise(resolve => {
			const listener = document.addEventListener('keydown', event => {
				resolve()
				document.removeEventListener('keydown', listener)
			})
		})
	}
}
