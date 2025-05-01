import { Physics, Scene } from 'phaser'
import { sounds } from '../asset-keys'
import { PhaserAudio } from '../types'
import { Ball } from '../GameObjects/Ball'
import { PlayerPaddle } from '../GameObjects/PlayerPaddle'
import { AiPaddle } from '../GameObjects/AiPaddle'


export class GameScene extends Scene {
    ball!: Ball
    player!: PlayerPaddle
    ai!: AiPaddle

    playerSpeed = 400

    plop!: PhaserAudio

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

        // create paddles
        this.player = new PlayerPaddle(this, this.scale.width / 2, this.scale.height)
        this.ai = new AiPaddle(this, this.scale.width / 2, 0)
            .setOrigin(0.5, 0)

        // create ball
        this.ball = new Ball(this, this.player.x, this.scale.height - this.player.displayHeight)

        // set ball
        this.ai.ball = this.ball
        this.player.ball = this.ball
        this.player.ballOnPaddle = true

        // setup collisions
        this.physics.world.setBoundsCollision(true, true, false, false)
        this.physics.add.collider(this.player, this.ball, undefined, () => {
            this.plop.play()
        })

        this.physics.add.collider(this.ai, this.ball, undefined, () => {
            this.plop.play()
        })

        this.physics.world.on('worldbounds', (body: Physics.Arcade.Body) => {
            if (body.gameObject === this.ball && !this.ball.inPlay) {
                this.plop.play()
            }
        })
    }

    update() {

        if (this.player.ballOnPaddle) {
            this.ball.x = this.player.x
        } else if (this.ball.inPlay) {
            // game is in progress
            if (this.ball.offScreen) {
                this.ball.inPlay = false
                setTimeout(() => {
                    this.reset()
                }, 1200)
            }
        }
    }

    private reset = () => {
        this.ball.setVelocity(0)
        this.player.setVelocity(0)

        this.ball.x = this.player.x
        this.ball.y = this.scale.height - this.player.displayHeight

        this.player.ballOnPaddle = true
    }

}
