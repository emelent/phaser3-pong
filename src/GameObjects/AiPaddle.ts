

import { Game, Scene } from "phaser"
import { Paddle } from "./Paddle"


export class AiPaddle extends Paddle {

    private canMove = true
    private moveTime = 0
    private movementDuration = 2300
    private pauseDuration = 500

    // private movementMeterOutline: Phaser.GameObjects.Rectangle
    // private movementMeterFill: Phaser.GameObjects.Rectangle
    private restX: number

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)
        this.movementSpeed = 200
        // this.movementMeterOutline = scene.add.rectangle(x, y + this.displayHeight + 20, 40, 8, 0, 0)
        //     .setOrigin(0.5, 0)
        //     .setStrokeStyle(1, 0xffffff, 1)
        // this.movementMeterFill = scene.add.rectangle(x, y + this.displayHeight + 20, 40, 8, 0xff00ff, 1)
        //     .setOrigin(0.5, 0)
        this.restX = scene.scale.width / 2
    }


    preUpdate(_time: number, delta: number): void {
        const ball = this.ball
        if (!ball) return

        const duration = this.canMove ? this.movementDuration : this.pauseDuration

        // this.movementMeterOutline.x = this.x
        // this.movementMeterFill.x = this.x
        // this.movementMeterFill.width = Math.floor((1 - this.moveTime / duration) * this.movementMeterOutline.displayWidth)

        if (!ball.inPlay) {
            this.setVelocity(0)
            this.moveTime = 0
            const diff = this.restX - this.x
            if (Math.abs(diff) < 10) {
                return
            }
            this.x += diff * 0.01
            return
        }




        this.moveTime += delta
        if (this.canMove) {
            if (ball.x < this.x) {
                this.setVelocity(-this.movementSpeed, 0)
            } else if (ball.x > this.x) {
                this.setVelocity(this.movementSpeed, 0)
            } else if (Math.abs(ball.x - this.x) < 50) {
                this.setVelocity(0)
            }
        }

        if (this.moveTime >= duration) {
            this.canMove = !this.canMove
            this.moveTime = 0
            this.setVelocity(0)
        }


    }
}
