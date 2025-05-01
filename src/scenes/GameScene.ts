import { Physics, Scene } from 'phaser'
import { sounds } from '../asset-keys'
import { PhaserAudio } from '../types'
import { Ball } from '../GameObjects/Ball'
import { Paddle } from '../GameObjects/Paddle'
import { PlayerPaddle } from '../GameObjects/PlayerPaddle'


export class GameScene extends Scene {
    ball!: Ball
    player!: Paddle

    playerSpeed = 400

    plop!: PhaserAudio
    roundLost = false


    constructor() {
        super({
            key: GameScene.name,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
        })
    }

    create() {
        // create sounds
        this.plop = this.sound.add(sounds.plop)

        // create player
        this.player = new PlayerPaddle(this, this.scale.width / 2, this.scale.height)

        // create ball
        this.ball = new Ball(this, this.player.x, this.scale.height - this.player.displayHeight)

        // set ball
        this.player.ball = this.ball
        this.player.ballOnPaddle = true

        // setup collisions
        this.physics.world.setBoundsCollision(true, true, true, false)
        this.physics.add.collider(this.player, this.ball, undefined, () => {
            if (!this.ball.offScreen)
                this.plop.play()
        })

        this.physics.world.on('worldbounds', (body: Physics.Arcade.Body) => {
            if (body.gameObject === this.ball) {
                this.plop.play()
            }
        })
    }

    update() {

        if (this.player.ballOnPaddle) {
            this.ball.x = this.player.x
        } else if (!this.roundLost) {
            // game is in progress
            if (this.ball.offScreen) {
                this.roundLost = true
                setTimeout(() => {
                    this.reset()
                }, 1200)
            }
        }
    }

    private reset = () => {
        this.ball.setVelocity(0)
        this.player.setVelocity(0)

        this.player.ballOnPaddle = true
        this.ball.x = this.player.x
        this.ball.y = this.scale.height - this.player.displayHeight
    }

}
