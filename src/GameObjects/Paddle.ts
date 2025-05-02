import { Scene } from 'phaser'
import { images } from '../asset-keys'
import { Ball } from './Ball'

export abstract class Paddle extends Phaser.Physics.Arcade.Image {
    declare body: Phaser.Physics.Arcade.Body

    public ballOnPaddle = false
    public ball?: Ball
    public launchSpeed = 300
    public movementSpeed = 400

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, images.block)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(108, 12)
            .setOrigin(0.5, 1)
            .setPushable(false)
            .setGravity(0)
            .setCollideWorldBounds(true)
    }

    public launchBall = () => {
        if (!this.ballOnPaddle || !this.ball) return
        // randomise ball launch dir
        const angle = 45 * (Math.floor(Math.random() * 2) == 0 ? 1 : -1)
        const launchVel = new Phaser.Math.Vector2(0, -1)
            .rotate(Phaser.Math.DegToRad(angle))
            .scale(this.launchSpeed)

        this.ball.setVelocity(launchVel.x, launchVel.y)
        this.ball.inPlay = true
        this.ballOnPaddle = false
    }
}
