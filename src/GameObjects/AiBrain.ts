import { AiPaddle } from './AiPaddle'

export class AiBrain {
    private paddle?: AiPaddle

    protected restX!: number
    protected canMove = true
    protected moveTime = 0
    protected movementDuration = 1300
    protected pauseDuration = 400

    protected movementMeterOutline!: Phaser.GameObjects.Rectangle
    protected movementMeterFill!: Phaser.GameObjects.Rectangle
    protected ballResponseRangeRect!: Phaser.GameObjects.Rectangle
    protected returnTween?: Phaser.Tweens.Tween

    private _ballResponseRange = 0.85
    public get ballResponseRange(): number {
        return this._ballResponseRange
    }

    public set ballResponseRange(value: number) {
        this._ballResponseRange = Math.max(0.1, Math.min(0.9, value))
        const paddle = this.paddle
        if (paddle) {
            this.ballResponseRangeRect.setSize(
                paddle.scene.scale.width,
                this._ballResponseRange * paddle.scene.scale.height
            )
        }
    }

    private _showingDebug = false
    public get showingDebug() {
        return this._showingDebug
    }

    constructor() {}

    public attach(paddle: AiPaddle) {
        this.paddle = paddle
        const { x, y, scene } = paddle
        this.restX = x

        this.movementMeterOutline = scene.add
            .rectangle(
                paddle.x,
                paddle.y + paddle.displayHeight + 20,
                40,
                8,
                0,
                0
            )
            .setOrigin(0.5, 0)
            .setStrokeStyle(1, 0xffffff, 1)
            .setActive(false)
            .setVisible(false)
        this.movementMeterFill = scene.add
            .rectangle(x, y + paddle.displayHeight + 20, 40, 8, 0xff00ff, 1)
            .setOrigin(0.5, 0)
            .setActive(false)
            .setVisible(false)

        this.restX = scene.scale.width / 2
        this.ballResponseRangeRect = scene.add
            .rectangle(
                0,
                0,
                scene.scale.width,
                scene.scale.height * this.ballResponseRange,
                0xff00ff,
                0.2
            )
            .setOrigin(0, 0)
            .setDepth(-2)
            .setActive(false)
            .setVisible(false)
    }

    public showDebug(on: boolean) {
        this._showingDebug = on
        this.movementMeterFill.setActive(on).setVisible(on)
        this.movementMeterOutline.setActive(on).setVisible(on)
        this.ballResponseRangeRect.setActive(on).setVisible(on)
    }

    public update(_time: number, delta: number) {
        const paddle = this.paddle
        if (!paddle) return

        const { ball, scene } = paddle
        if (!ball) return

        const duration = this.canMove
            ? this.movementDuration
            : this.pauseDuration

        if (this._showingDebug) {
            this.movementMeterOutline.x = paddle.x
            this.movementMeterFill.x = paddle.x
            this.movementMeterFill.width = Math.floor(
                (1 - this.moveTime / duration) *
                    this.movementMeterOutline.displayWidth
            )
        }

        if (!ball.inPlay && paddle.x != this.restX) {
            if (!this.returnTween || !this.returnTween.isPlaying()) {
                this.returnTween = scene.tweens.add({
                    targets: paddle,
                    x: this.restX,
                    duration: 1200,
                    ease: 'Cubic.Out',
                })
            }
            return
        }

        if (ball.y > scene.scale.height * this.ballResponseRange) {
            paddle.setVelocity(0)
            return
        }

        this.moveTime += delta

        // move for a bit
        if (this.canMove) {
            const xDiff = ball.x - paddle.x
            const thresh = Math.min((xDiff / scene.scale.width) * 10, 1)
            paddle.setVelocityX(paddle.movementSpeed * thresh)
        }

        // pause for a bit
        if (this.moveTime >= duration) {
            this.canMove = !this.canMove
            this.moveTime = 0
            paddle.setVelocity(0)
        }
    }
}
