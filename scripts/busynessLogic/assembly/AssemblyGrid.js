export class AssemblyGrid {
	invertedActionsDescriptors = []
	matrix = new Array(3).fill(new Array(3).fill(0))

	transposeMatrix() {
		let { matrix } = this
		this.matrix = matrix[0].map((column, i) => matrix.map(row => row[i]))
	}

	slideRow({entryIndex = undefined, delta = 0}) {
		if(entryIndex === undefined) {
			return
		}

		const { matrix } = this

		let row = matrix[entryIndex]
		const { length } = row

		if(delta < 0) {
			delta = length + delta % length
		}

		row.map(element => element).forEach((element, i) => {
			let finalIndex = (i + delta) % length
			row[finalIndex] = element
		})

		return this
	}

	slideColumn({entryIndex = undefined, delta = 0}) {
		this.transposeMatrix()
		this.slideRow({entryIndex, delta})
		this.transposeMatrix()
		return this
	}

	slide({slideTypeId, entryIndex, delta}) {
		if(delta === 0) return this

		switch(slideTypeId) {
			case 0: this.slideRow({entryIndex, delta: delta}); break
			case 1: this.slideColumn({entryIndex, delta: delta}); break
			default: return this
		}

		//recording each slide to history
		const descriptors = this.invertedActionsDescriptors
		if(
			descriptors[0] &&
			descriptors[0].slideTypeId === slideTypeId &&
			descriptors[0].entryIndex === entryIndex
		){//merge matching actions
			descriptors[0].delta = (descriptors[0].delta -delta) % this.matrix.length
			return this
		}

		descriptors.unshift({slideTypeId, entryIndex, delta: -delta })
		return this
	}

	setMatrix(matrix)
	{
		this.matrix = matrix.map(row => row.map(element => element))
		this.invertedActionsDescriptors = []
		return this
	}

	isEqualTo(matrix){
		for( let y = 0; y < matrix.length; y++ ) {
			for( let x = 0; x < matrix.length; x++ ) {
				if(matrix[y][x] !== this.matrix[y][x]) {
					return false
				}
			}
		}

		// console.log(this.matrix, 'matches', matrix)
		return true
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

		return this
	}
}