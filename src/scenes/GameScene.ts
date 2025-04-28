import { Physics, Scene } from 'phaser'
import { images, sounds } from '../asset-keys'
import { PhaserAudio, PhaserInputKeys } from '../types'


export class GameScene extends Scene {
    ball!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    inputKeys!: PhaserInputKeys
    player!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

    playerSpeed = 400
    ballOnPaddle = true

    beep!: PhaserAudio
    peep!: PhaserAudio
    plop!: PhaserAudio

    trailPositions = []
    trailImages = []
    trailLength = 40

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
        this.beep = this.sound.add(sounds.beep)
        this.peep = this.sound.add(sounds.peep)
        this.plop = this.sound.add(sounds.plop)

        // create player
        this.player = this.physics.add
            .image(this.scale.width / 2, this.scale.height, images.block)
            .setScale(108, 12)
            .setOrigin(0.5, 1)
            .setPushable(false)
            .setGravity(0)
            .setCollideWorldBounds(true)

        // create ball
        this.ball = this.physics.add
            .image(
                this.player.x,
                this.scale.height - this.player.displayHeight,
                images.block
            )
            .setScale(8)
            .setOrigin(0.5, 1)
            .setBounce(1)
            .setCollideWorldBounds(true)
            .setMaxVelocity(300)
            .setTint(0xff0000)

        this.ball.body.onWorldBounds = true

        // setup collisions
        this.physics.world.setBoundsCollision(true, true, true, false)
        this.physics.add.collider(this.player, this.ball, undefined, () => {
            this.plop.play()
        })

        this.physics.world.on('worldbounds', (body: Physics.Arcade.Body) => {
            if (body.gameObject === this.ball) {
                this.plop.play()
            }
        })

        // setup input
        this.inputKeys = this.input.keyboard!.addKeys(
            'a,d,s,left,right,down,space'
        ) as PhaserInputKeys
        this.inputKeys.s.on('down', this.launchBall)
        this.inputKeys.down.on('down', this.launchBall)
    }

    update() {
        // handle player movement
        const { a, d, left, right } = this.inputKeys
        let dir =
            a.isDown || left.isDown ? -1 : d.isDown || right.isDown ? 1 : 0
        this.player.setVelocityX(dir * this.playerSpeed)

        const loseCondition =
            this.ball.y > this.scale.height + this.ball.displayHeight

        if (this.ballOnPaddle) {
            this.ball.x = this.player.x
        } else {
            // game is in progress
            if (loseCondition) this.reset()
        }
    }

    private reset = () => {
        this.ball.setVelocity(0)
        this.ballOnPaddle = true
        this.player.setVelocity(0)

        // delay before bringing ball back to screen
        setTimeout(() => {
            this.player.x = this.scale.width / 2
            this.ball.y = this.scale.height - this.player.displayHeight
        }, 1200)
    }

    private launchBall = () => {
        if (!this.ballOnPaddle) return
        const angle = 45 * (Math.floor(Math.random() * 2) == 0 ? 1 : -1)
        const launchVel = new Phaser.Math.Vector2(0, -1)
            .rotate(Phaser.Math.DegToRad(angle))
            .scale(300)
        this.ballOnPaddle = false
        this.ball.setVelocity(launchVel.x, launchVel.y)
    }
}
