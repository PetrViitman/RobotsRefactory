import { View } from './View'

export class InteractiveView extends View {
	#interactionStartLocalPosition

	constructor() {
		super()
		this.interactive = true;
		this.buttonMode = true;

		this.on('pointerdown', e => { this.#handlePointerDown(e) });
		this.on('pointerup', e => { this.#handlePointerUp(e) });
		this.on('pointerupoutside', e => { this.#handlePointerUp(e) });
		this.on('pointermove', e => { this.#handlePointerMove(e) });
	}

	dropInteraction() {
		this.#interactionStartLocalPosition = null
	}

	getGlobalScaleX(scaleFactor = 1) {
		if(this.parent && this.parent.getGlobalScaleX) {
			return this.parent.getGlobalScaleX(this.scale.x * scaleFactor)
		}

		return this.scale.x * scaleFactor
	}

	#getLocalPointerPosition(e) {
		const pointerGlobalX = e.data.global.x
		const pointerGlobalY = e.data.global.y
		const ownGlobalPosition = this.getGlobalPosition()
		const ownGlobalX = ownGlobalPosition.x
		const ownGlobalY = ownGlobalPosition.y
		const ownGlobalScale = this.getGlobalScaleX()
		return {
			x: (pointerGlobalX - ownGlobalX) / ownGlobalScale,
			y: (pointerGlobalY - ownGlobalY) / ownGlobalScale,
		}
	}

	#handlePointerDown(e){
		this.#interactionStartLocalPosition = this.#getLocalPointerPosition(e)
		this.onPointerDown(
			this.#interactionStartLocalPosition.x,
			this.#interactionStartLocalPosition.y)
	}
	
	#handlePointerUp(e){
		const {x, y} = this.#getLocalPointerPosition(e)

		this.onPointerUp(x, y)

		if(this.#interactionStartLocalPosition) {
			this.onDrop(x, y)
			this.onSlide(
				this.#interactionStartLocalPosition.x,
				this.#interactionStartLocalPosition.y,
				x,
				y)
		}

		this.#interactionStartLocalPosition = null
	}

	#handlePointerMove(e) {
		if(!this.#interactionStartLocalPosition) return
		const {x, y} = this.#getLocalPointerPosition(e)
		this.onDrag(
			this.#interactionStartLocalPosition.x,
			this.#interactionStartLocalPosition.y,
			x,
			y)
	}

	onPointerDown(localX, localY) {}
	onPointerUp(localX, localY) {}
	onSlide(localX1, localY1, localX2, localY2) {}
	onDrop(localX, localY) {}
	onDrag(localX1, localY1, localX2, localY2){}
}