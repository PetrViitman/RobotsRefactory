import { Solution } from './Solution'

const MAXIMAL_SOLUTIONS_COUNT = 3000

export class SolutionsPool {	
	solutions = []

	add(solution) {
		if(this.isFull()) {
			return this
		}
		this.solutions.push(solution)

		return this
	}

	delete(solutionIndex) {
		this.solutions.splice(solutionIndex, 1)
		return this
	}

	isFull() {
		return this.solutions.length === MAXIMAL_SOLUTIONS_COUNT
	}
}