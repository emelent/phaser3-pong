import { AUTO, Scale, Game } from 'phaser'
import './style.css'
import { PreloadScene } from './scenes/PreloadScene'
import { GameScene } from './scenes/GameScene'
import { initPWA } from './pwa'

const config = {
    type: AUTO,
    width: 860,
    height: 480,
    parent: 'game-container',
    backgroundColor: '#000',
    scale: {
        mode: Scale.FIT,
    },
    scene: [PreloadScene, GameScene],
}

const app = document.getElementById('app')!
initPWA(app)

new Game(config)
