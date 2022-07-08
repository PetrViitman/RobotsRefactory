import { SolutionsPool } from './SolutionsPool'
import { Solution } from './Solution'
import { AssemblyGrid } from '../AssemblyGrid'

export class Solver {
	getSolutionToProblem({problem, initialMatrix = problem.initialMatrix}) {
		const instantSolution = this.getSolutionToTargetMatrix({
									initialMatrix,
									targetMatrix: problem.finalMatrix})

		if(instantSolution) return instantSolution

		//searching solution from given matrix to any available problem step
		const {problemSteps, finalMatrix} = problem
		for(const step of problemSteps) {
			const solution = this.getSolutionToTargetMatrix({
				initialMatrix,
				targetMatrix: step.matrix})

			if(solution) {
				//adjustment to closest problem step will bring solution to rails 
				return solution.setMatrix(finalMatrix)
								.appendRevertedProblemSteps({
									problemSteps,
									initialStepIndex: 0,
									finalStepIndex: problemSteps.indexOf(step)})
			}
		}

		return null
	}


	getSolutionToTargetMatrix({initialMatrix, targetMatrix}) {
		const solutionsPool = new SolutionsPool()
		const assemblyGrid = new AssemblyGrid()

		//adding first empty solution as a root
		const firstEmptySolution = new Solution()
		firstEmptySolution.setMatrix(initialMatrix)
		solutionsPool.add(firstEmptySolution)

		while(!solutionsPool.isFull()) {

			//getting new solutions around each parent solution for each possible options
			for(const parentSolution of solutionsPool.solutions) {
				for(let slideTypeId = 0; slideTypeId < 2; slideTypeId++ ) {
					for(let entryIndex = 0; entryIndex < initialMatrix.length; entryIndex++ ) {
						for(let delta = 1; delta <= 2; delta++ ) {
							assemblyGrid.setMatrix(parentSolution.matrix)
								.slide({
									slideTypeId,
									entryIndex,
									delta})

							const newSolution = new Solution()

							newSolution.setActionsDescriptors(parentSolution.actionsDescriptors)
								.addActionDescriptor({slideTypeId, entryIndex, delta})
								.setMatrix(assemblyGrid.matrix)
							
							solutionsPool.add(newSolution)

							//checking new solution...
							if(assemblyGrid.isEqualTo(targetMatrix))
								return newSolution.optimize()

							if(solutionsPool.isFull())
								return null
						}
					}
				}

				//deleting redundand parent solution, as every child allready contains it
				solutionsPool.delete(solutionsPool.solutions.indexOf(parentSolution))
			}
		}

		return null
	}

}