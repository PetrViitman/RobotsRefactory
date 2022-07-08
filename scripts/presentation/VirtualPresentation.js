export class VirtualPresentation {
	resources

	constructor(resources = undefined) {
		this.resources = resources
	}

	findPresentationHandler(prefix, keyWord) {
		return this[prefix + keyWord]?.bind(this)
	}

	async presentData(data, reason = '') {
		const { state } = data
		this.log('presenting ' + state + ' ' + reason)
		return await this.findPresentationHandler('present', state)?.(data, reason)
	}

	async validate(data, reason = '') {
		// this.log('validate ' + reason)
		return await this.findPresentationHandler('validate', reason)?.(data)
	}

	// debug
	log(value) {
		console.log(`%c [P]: ${value}`, 'background: #990066; color: #FFFFFF')
    }
}
