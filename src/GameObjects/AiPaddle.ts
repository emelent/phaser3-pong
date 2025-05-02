import { Scene } from 'phaser'
import { Paddle } from './Paddle'
import { AiBrain } from './AiBrain'

export class AiPaddle extends Paddle {
    private brain?: AiBrain

    constructor(scene: Scene, x: number, y: number, brain?: AiBrain) {
        super(scene, x, y)
        this.brain = brain
        this.setMaxVelocity(this.movementSpeed)
        this.brain = brain
    }

    public attachBrain(brain: AiBrain): AiPaddle {
        brain.attach(this)
        this.brain = brain
        return this
    }

    public showDebug(on: boolean): AiPaddle {
        this.brain?.showDebug(on)
        return this
    }

    preUpdate(_time: number, delta: number): void {
        this.brain?.update(_time, delta)
    }
}
