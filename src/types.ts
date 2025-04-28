
export type Dict<K extends string | number | symbol, T> = {
    [key in K]: T
}

export type PhaserAudio = Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound

export type PhaserInputKeys = Dict<string, Phaser.Input.Keyboard.Key>



