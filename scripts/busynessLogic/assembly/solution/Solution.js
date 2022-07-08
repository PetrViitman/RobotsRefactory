export class Solution {	
	matrix = []
	actionsDescriptors = []

	addActionDescriptor({slideTypeId, entryIndex, delta}) {
		this.actionsDescriptors.push({
			slideTypeId,
			entryIndex,
			delta
		})

		return this
	}

	//will append reverted problem steps as final part of solution.
	//only needed when solver fails to solve problem entirely
	appendRevertedProblemSteps({
		problemSteps,
		initialStepIndex = 0,
		finalStepIndex = problemSteps.length - 1
	}) {
		for(let i = finalStepIndex; i >= initialStepIndex; i-- ) {
			const { actionDescriptor } = problemSteps[i]
			this.addActionDescriptor({
					slideTypeId: actionDescriptor.slideTypeId,
					entryIndex: actionDescriptor.entryIndex,
					delta: -actionDescriptor.delta})
		}
		return this
	}

	setMatrix(matrix) {
		this.matrix = matrix.map(row => row.map(element => element))
		return this
	}

	setActionsDescriptors(actionsDescriptors) {
		this.actionsDescriptors = actionsDescriptors.map(descriptor => descriptor)
		return this
	}

	optimize() {
		const {actionsDescriptors, matrix} = this
		const optimizedActionsDescriptors = [actionsDescriptors.shift()]
		actionsDescriptors.forEach(descriptor => {
			const previousDescriptor = optimizedActionsDescriptors[optimizedActionsDescriptors.length - 1]
			
			if(
				descriptor.slideTypeId === previousDescriptor.slideTypeId
				&& descriptor.entryIndex === previousDescriptor.entryIndex)
			{
				previousDescriptor.delta += descriptor.delta
				previousDescriptor.delta %= matrix.length
			} else {
				optimizedActionsDescriptors.push(structuredClone(descriptor))
			}
		})

		this.actionsDescriptors = optimizedActionsDescriptors

		return this
	}


	print() {
		let text = '\n'

		for(let y = 0; y < 3; y++) {
			for(let x = 0; x < 3; x++) {
				text += this.matrix[y][x] + ' '
			}

			text += '\n'
		}

		console.log(text)
	}
}