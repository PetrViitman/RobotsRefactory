import { Container, Sprite, Loader } from 'pixi.js'
import * as TEMPLATES from '../../../../../busynessLogic/assembly/templates'

export const PART_ID_EMPTY = 0
export const PART_ID_ARM_LEFT = 1
export const PART_ID_ARM_RIGHT = 2
export const PART_ID_SPIDER_MIDDLE_LEFT = 3
export const PART_ID_SPIDER_MIDDLE_RIGHT = 4
export const PART_ID_SPIDER_TOP_LEFT = 5
export const PART_ID_SPIDER_TOP_RIGHT = 6
export const PART_ID_ARM_UP_LEFT = 7
export const PART_ID_ARM_UP_RIGHT = 8
export const PART_ID_BODY = 9
export const PART_ID_CLAW = 10
export const PART_ID_FIST_LEFT = 11
export const PART_ID_FIST_RIGHT = 12
export const PART_ID_HAND_UP = 13
export const PART_ID_HEAD_ROUND = 14
export const PART_ID_HEAD_SPIDER = 15
export const PART_ID_HEAD = 16
export const PART_ID_HEAD_WIDE = 17
export const PART_ID_LEG_CURVE_LEFT = 18
export const PART_ID_LEG_CURVE_RIGHT = 19
export const PART_ID_LEGS = 20
export const PART_ID_PELVIC = 21
export const PART_ID_PELVIC_TENTACLE = 22
export const PART_ID_TENTACLE_BOTTOM_RIGHT = 23
export const PART_ID_TENTACLE_BOTTOM_LEFT = 24
export const PART_ID_TENTACLE_MIDDLE_LEFT = 25
export const PART_ID_TENTACLE_MIDDLE_RIGHT = 26
export const PART_ID_TENTACLE_TOP_LEFT = 27
export const PART_ID_TENTACLE_TOP_RIGHT = 28

export const ROBOTS_PARTS_DESCIPTORS = {}
ROBOTS_PARTS_DESCIPTORS[PART_ID_EMPTY] = { spriteName: undefined, offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_ARM_LEFT] = { spriteName: 'arm', offsetX: 35, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_ARM_RIGHT] = { spriteName: 'arm', offsetX: -35, offsetY: 0, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_SPIDER_MIDDLE_LEFT] = { spriteName: 'arm_spider_middle', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_SPIDER_MIDDLE_RIGHT] = { spriteName: 'arm_spider_middle', offsetX: 0, offsetY: 0, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_SPIDER_TOP_LEFT] = { spriteName: 'arm_spider_top', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_SPIDER_TOP_RIGHT] = { spriteName: 'arm_spider_top', offsetX: 0, offsetY: 0, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_ARM_UP_LEFT] = { spriteName: 'arm_up', offsetX: 40, offsetY: -55, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_ARM_UP_RIGHT] = { spriteName: 'arm_up', offsetX: -40, offsetY: -55, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_BODY] = { spriteName: 'body', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_CLAW] = { spriteName: 'claw', offsetX: 0, offsetY: 25, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_FIST_LEFT] = { spriteName: 'hand', offsetX: 20, offsetY: -50, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_FIST_RIGHT] = { spriteName: 'hand', offsetX: -20, offsetY: -50, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_HAND_UP] = { spriteName: 'hand_up', offsetX: 30, offsetY: 25, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_HEAD_ROUND] = { spriteName: 'head_round', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_HEAD_SPIDER] = { spriteName: 'head_spider', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_HEAD] = { spriteName: 'head', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_HEAD_WIDE] = { spriteName: 'head_wide', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_LEG_CURVE_LEFT] = { spriteName: 'leg_curve', offsetX: 50, offsetY: -30, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_LEG_CURVE_RIGHT] = { spriteName: 'leg_curve', offsetX: -50, offsetY: -30, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_LEGS] = { spriteName: 'legs', offsetX: 0, offsetY: -25, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_PELVIC] = { spriteName: 'pelvic', offsetX: 0, offsetY: -75, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_PELVIC_TENTACLE] = { spriteName: 'pelvic_tentacle', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_TENTACLE_BOTTOM_LEFT] = { spriteName: 'tentacle_bottom', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_TENTACLE_BOTTOM_RIGHT] = { spriteName: 'tentacle_bottom', offsetX: 0, offsetY: 0, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_TENTACLE_MIDDLE_LEFT] = { spriteName: 'tentacle_middle', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_TENTACLE_MIDDLE_RIGHT] = { spriteName: 'tentacle_middle', offsetX: 0, offsetY: 0, reflected: true}
ROBOTS_PARTS_DESCIPTORS[PART_ID_TENTACLE_TOP_LEFT] = { spriteName: 'tentacle_top', offsetX: 0, offsetY: 0, reflected: false}
ROBOTS_PARTS_DESCIPTORS[PART_ID_TENTACLE_TOP_RIGHT] = { spriteName: 'tentacle_top', offsetX: 0, offsetY: 0, reflected: true}

export const IDS_MAP = {}
IDS_MAP[TEMPLATES.ROBOT_ID_HUMAN] = {
	0: PART_ID_EMPTY,
	1: undefined,			2: PART_ID_HEAD,	3: undefined,
	4: PART_ID_ARM_LEFT,	5: PART_ID_BODY,	6: PART_ID_ARM_RIGHT,
	7: PART_ID_FIST_LEFT,	8: PART_ID_LEGS,	9: PART_ID_FIST_RIGHT,
}
IDS_MAP[TEMPLATES.ROBOT_ID_HUMAN_2] = {
	0: PART_ID_EMPTY,
	1: PART_ID_HAND_UP,		2: PART_ID_HEAD,	3: undefined,
	4: PART_ID_ARM_UP_LEFT,	5: PART_ID_BODY,	6: PART_ID_ARM_RIGHT,
	7: undefined,			8: PART_ID_LEGS,	9: PART_ID_FIST_RIGHT,
}
IDS_MAP[TEMPLATES.ROBOT_ID_BIRD] = {
	0: PART_ID_EMPTY,
	1: undefined,						2: PART_ID_HEAD_ROUND,	3: undefined,
	4: PART_ID_TENTACLE_MIDDLE_LEFT,	5: PART_ID_BODY,		6: PART_ID_TENTACLE_MIDDLE_RIGHT,
	7: PART_ID_LEG_CURVE_LEFT,			8: PART_ID_PELVIC,		9: PART_ID_LEG_CURVE_RIGHT,
} 
IDS_MAP[TEMPLATES.ROBOT_ID_CRAB] = {
	0: PART_ID_EMPTY,
	1: PART_ID_CLAW,			2: PART_ID_HEAD_WIDE,	3: PART_ID_CLAW,
	4: PART_ID_ARM_UP_LEFT,		5: PART_ID_BODY,		6: PART_ID_ARM_UP_RIGHT,
	7: PART_ID_LEG_CURVE_LEFT,	8: PART_ID_PELVIC,		9: PART_ID_LEG_CURVE_RIGHT,
}
IDS_MAP[TEMPLATES.ROBOT_ID_OCTOPUS] = {
	0: PART_ID_EMPTY,
	1: PART_ID_TENTACLE_TOP_LEFT,		2: PART_ID_HEAD_ROUND,			3: PART_ID_TENTACLE_TOP_RIGHT,
	4: PART_ID_TENTACLE_MIDDLE_LEFT,	5: PART_ID_BODY,				6: PART_ID_TENTACLE_MIDDLE_RIGHT,
	7: PART_ID_TENTACLE_BOTTOM_LEFT,	8: PART_ID_PELVIC_TENTACLE,		9: PART_ID_TENTACLE_BOTTOM_RIGHT,
}
IDS_MAP[TEMPLATES.ROBOT_ID_SPIDER] = {
	0: PART_ID_EMPTY,
	1: PART_ID_SPIDER_TOP_LEFT,		2: PART_ID_HEAD_SPIDER,		3: PART_ID_SPIDER_TOP_RIGHT,
	4: PART_ID_SPIDER_MIDDLE_LEFT,	5: PART_ID_BODY,			6: PART_ID_SPIDER_MIDDLE_RIGHT,
	7: PART_ID_LEG_CURVE_LEFT,		8: PART_ID_PELVIC,			9: PART_ID_LEG_CURVE_RIGHT,
}

export class CellView extends Container {
	body
	typeId
	constructor(typeId) {
		super()
		this.typeId = typeId
		const descriptor = ROBOTS_PARTS_DESCIPTORS[typeId]
		this.initPlatform()
		this.initBody(descriptor)
	}

	initPlatform() {
		const { resources } = Loader.shared
		this.addChild(new Sprite(resources.objects.textures['platform']))
	}

	initBody(descriptor) {
		const { resources } = Loader.shared
		const { spriteName, offsetX, offsetY, reflected } = descriptor
		const { textures } = resources.objects

		if(!spriteName) return

		const shadow = this.addChild(new Sprite(textures[spriteName]))
		shadow.anchor.set(0.5)
		shadow.position.set(128 + offsetX, 128 + offsetY + 25)
		shadow.scale.x = reflected ? -1 : 1
		shadow.tint = 0x000000
		shadow.alpha = 0.5


		this.body = this.addChild(new Sprite(textures[spriteName]))
		this.body.anchor.set(0.5)
		this.body.position.set(128 + offsetX, 128 + offsetY)
		this.body.scale.x = reflected ? -1 : 1
		
		/*
		const reflection = this.addChild(new Sprite(textures[spriteName + '_reflection']))
		reflection.anchor.set(0.5)
		reflection.position.set(128 + offsetX, 128 + offsetY)
		reflection.scale.x = reflected ? -1 : 1
		*/
	}

	setBodyColor(color) {
		if(!this.body) return
		this.body.tint = color
	}
}