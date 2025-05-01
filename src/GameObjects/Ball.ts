import { Scene } from "phaser"
import { images } from "../asset-keys"


export class Ball extends Phaser.Physics.Arcade.Image {
    declare body: Phaser.Physics.Arcade.Body

    public offScreen = false
    public inPlay = false

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, images.block)

        scene.add.existing(this)
        scene.physics.add.existing(this)


        this.setScale(8)
            .setOrigin(0.5, 1)
            .setBounce(1)
            .setCollideWorldBounds(true)
            .setMaxVelocity(300)
            .setTint(0xff0000)

        this.body.onWorldBounds = true
    }

    preUpdate(_time: number, _delta: number): void {
        const camera = this.scene.cameras.main;
        const bounds = this.getBounds();

        this.offScreen =
            bounds.right < camera.worldView.left ||
            bounds.left > camera.worldView.right ||
            bounds.bottom < camera.worldView.top ||
            bounds.top > camera.worldView.bottom;

    }
}
