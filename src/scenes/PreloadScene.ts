import { Scene } from 'phaser'
import { GameScene } from './GameScene'
import { images, sounds } from '../asset-keys'

import beep from '../assets/sounds/beep.ogg'
import peep from '../assets/sounds/peep.ogg'
import plop from '../assets/sounds/plop.ogg'

export class PreloadScene extends Scene {
    constructor() {
        super(PreloadScene.name)
    }

    preload() {
        const graphics = new Phaser.GameObjects.Graphics(this)
        graphics.fillStyle(0xffffff, 1)
        graphics.fillRect(0, 0, 8, 8)
        graphics.generateTexture(images.block, 1, 1)
        graphics.destroy()

        this.load.audio(sounds.beep, beep)
        this.load.audio(sounds.peep, peep)
        this.load.audio(sounds.plop, plop)
    }

    create() {
        this.scene.start(GameScene.name)
    }
}
