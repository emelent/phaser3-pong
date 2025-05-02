import { AiBrain } from './AiBrain'

export class AdeptAiBrain extends AiBrain {
    constructor() {
        super()
        this.pauseDuration = 300
        this.movementDuration = 1800
    }
}

export class UnbeatableAiBrain extends AiBrain {
    constructor() {
        super()
        this.pauseDuration = 100
    }
}
