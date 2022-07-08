import * as TWEEN from 'tween.js'
import { Tween } from 'tween.js'
import { InteractiveView } from '../../InteractiveView'
import { Graphics, Sprite } from 'pixi.js'
import * as TEMPLATES from '../../../../../busynessLogic/assembly/templates'
import { CellView, IDS_MAP }from './CellView'

const SLIDE_ACTION_ID_HORIZONTAL = 0
const SLIDE_ACTION_ID_VERTICAL = 1


export class AssemblyGridView extends InteractiveView {
	cellViews = []
	slideTypeId
	slidableRowIndex
	slidableColumnIndex
	delta = 0
	userInputResolve
	matrix
	templateId
	color
	wiggleAnimation
	maskView

	constructor() {
		super()
		this.sortableChildren = true
		this.addChild(new Graphics())
			.beginFill(0x0000FF, 0.0001)
			.drawRect(0, 0, 256 * 3, 256 * 3)
			.endFill()

		this.initMask()
		this.initWiggleAnimation()
	}

	dropSlideActionParameters() {
		this.slidableRowIndex = undefined
		this.slidableColumnIndex = undefined
		this.slideTypeId = undefined
		this.delta = 0
		this.dropInteraction()
	}

	initMask() {
		this.mask = this.addChild(new Graphics())
			.beginFill(0x0000FF)
			.drawRect(0, -5, 256 * 3, 256 * 3 + 10)
			.endFill()
	}

	initWiggleAnimation() {
		const { cellViews } = this

		this.wiggleAnimation = new Tween({progress: 0})
			.to({progress: 1}, 5000)
			.onUpdate(progress => {
				cellViews.forEach(cell => {
					let offsetProgress = (progress + cell.typeId * 0.2) % 1 * 2
					if(offsetProgress > 1) offsetProgress = 2 - offsetProgress
					cell.pivot.y = offsetProgress * 10
				})


			})
			.repeat(Infinity)
			.start()
	}

	getCellView(typeId) {
		const { cellViews, templateId } = this

		for(const cellView of cellViews) {
			if(cellView.typeId === typeId && !cellView.visible) {
				cellView.visible = true
				return cellView
			}
		}
		cellViews.push(this.addChild( new CellView(typeId)))
		return cellViews.at(-1)
	}

	adjust() {
		const { widthInPixels, heightInPixels } = this.sourceArea
		const { delta, matrix, cellViews, templateId, color } = this
		const TEMPLATE_IDS_MAP = IDS_MAP[templateId]
		const cellSize = widthInPixels / 3
		const { slidableRowIndex, slidableColumnIndex } = this
		const offsets = [-widthInPixels, 0, widthInPixels]

		cellViews.forEach(cellView => cellView.visible = false)
		for( let y = 0; y < 3; y++ ) {
			if(y === slidableRowIndex) continue
			for( let x = 0; x < 3; x++ ) {
				if(x === slidableColumnIndex) continue
				const cell = this.getCellView(TEMPLATE_IDS_MAP[matrix[y][x]])
				cell.x = x * cellSize
				cell.y = y * cellSize
			}
		}

		if(slidableRowIndex !== undefined) {
			offsets.forEach((offset, i) => {
				for( let x = 0; x < 3; x++ ) {
					const cell = this.getCellView(TEMPLATE_IDS_MAP[matrix[slidableRowIndex][x]])
					cell.position.set(
						(x + delta) % 3 * cellSize + offset,
						slidableRowIndex * cellSize)
				}
			})
		} else if(slidableColumnIndex !== undefined) {
			offsets.forEach((offset, i) => {
				for( let y = 0; y < 3; y++ ) {
					const cell = this.getCellView(TEMPLATE_IDS_MAP[matrix[y][slidableColumnIndex]])
					cell.position.set(
						slidableColumnIndex * cellSize,
						(y + delta) % 3 * cellSize + offset)
				}
			})
		}


		cellViews.forEach(cellView => {
			cellView.setBodyColor(color)
			cellView.zIndex = cellView.y / 256
		})

	}

	onDrag(localX1, localY1, localX2, localY2){
		const { widthInPixels, heightInPixels} = this.sourceArea
		const deltaX = localX2 - localX1
		const deltaY = localY2 - localY1
		
		if(this.slideTypeId === undefined) {
			if(Math.abs(deltaX) > Math.abs(deltaY)) {
				this.slideTypeId = SLIDE_ACTION_ID_HORIZONTAL
				this.slidableRowIndex = Math.trunc(localY2 / ( heightInPixels / 3 ))
				this.slidableColumnIndex = undefined
			} else {
				this.slideTypeId = SLIDE_ACTION_ID_VERTICAL
				this.slidableRowIndex = undefined
				this.slidableColumnIndex = Math.trunc(localX2 / ( widthInPixels / 3 ))
			}
		}

		switch(this.slideTypeId) {
			case SLIDE_ACTION_ID_HORIZONTAL:
				this.delta = deltaX / ( widthInPixels / 3 ) % 3
				break
			case SLIDE_ACTION_ID_VERTICAL:
				this.delta = deltaY / ( heightInPixels / 3 ) % 3
				break
		}

		this.adjust()

		TWEEN.update() //prevent synck gap
	}

	onPointerDown(localX, localY) {
		this.slideTypeId = undefined
	}
	onPointerUp(localX, localY) {}
	onDrop(localX, localY) {
		this.interactive = false
		new Tween(this)
			.to({delta: Math.round(this.delta)}, 500 * Math.abs(Math.round(this.delta) - this.delta))
			.onUpdate(() => { this.adjust() })
			.onComplete(()=>{
				this.userInputResolve?.(
				{
					option: 'slide',
					parameters:
					{
						slideTypeId: this.slideTypeId,
						entryIndex: this.slidableRowIndex ?? this.slidableColumnIndex,
						delta: this.delta
					}
				})
				this.dropSlideActionParameters()
			})
			.start()
	}

	getUserSlideAction() {
		this.dropSlideActionParameters()

		return new Promise(resolve => {
			this.userInputResolve = resolve
		})
	}

	presentSlide(descriptor) {
		const { slideTypeId, entryIndex, delta } = descriptor

		switch(slideTypeId) {
			case 0:
				this.slidableRowIndex = entryIndex
				this.slidableColumnIndex = undefined
				break
			case 1:
				this.slidableRowIndex = undefined
				this.slidableColumnIndex = entryIndex
				break
		}

		this.slideTypeId = slideTypeId
	
		return new Promise(resolve => {
			new Tween(this)
			.to({delta}, 250 * Math.abs(delta))
			.onUpdate(() => { this.adjust()})
			.onComplete(()=>{
				this.dropSlideActionParameters()
				resolve()
			}).start()
		})

		this.adjust()
		TWEEN.update() //prevent synck gap
	}

	setColor(color) { this.color = color }
}