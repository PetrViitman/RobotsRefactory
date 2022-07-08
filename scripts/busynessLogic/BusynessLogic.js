export class BusynessLogic {
	#isPending
	#presentation
	data = { state: 'undefined' }

	async setState(state) {
		if(this.#isPending) {
			this.log('is pending, can not set state')
			return
		}
		this.log(`state: ${state}`)
		this.data.state = state
		return this.pend()
	}

	pend(reason = '') {
		if(this.#isPending) {
			this.log('is pending allready, can not pend')
			return
		}
		if (!this.#presentation) return
		return this.#presentation.presentData(this.data, reason)
	}

	unpend() {
		this.#isPending = false
	}

	async kick(reason = ''){
		await this.#presentation?.validate(this.data, reason)
	}

	setPresentation(presentation) {
		this.#presentation = presentation
	}

	log(value) {
		console.log(`%c [L]: ${value}`, 'background: #0000FF; color: #FFFFFF')
	}
}