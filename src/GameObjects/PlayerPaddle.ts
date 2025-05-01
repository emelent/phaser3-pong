
import { Scene } from "phaser"
import { Paddle } from "./Paddle"
import { PhaserInputKeys } from "../types"


export class PlayerPaddle extends Paddle {

    inputKeys!: PhaserInputKeys

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y)

        this.inputKeys = scene.input.keyboard!.addKeys(
            'a,d,s,left,right,down,space'
        ) as PhaserInputKeys
        this.inputKeys.s.on('down', this.launchBall)
        this.inputKeys.down.on('down', this.launchBall)
    }


    preUpdate(_time: number, _delta: number): void {
        // handle player movement
        const { a, d, left, right } = this.inputKeys
        let dir =
            a.isDown || left.isDown ? -1 : d.isDown || right.isDown ? 1 : 0

        this.setVelocityX(dir * this.movementSpeed)
    }
}
