type PressedKeysMap = { [key: string]: boolean }

export default class KeyboardHandler {
    static keys = {
        alt:        18,
        W:          87,
        A:          65,
        S:          83,
        D:          68,
        equal:      187,
        dash:       189,
        num_add:    107,
        num_sub:    109,
    }

    private pressedKeys: PressedKeysMap = {};

    constructor() {
        $(window).keydown(this.downHandler.bind(this));
        $(window).keyup(this.upHandler.bind(this));
    }

    downHandler(event: JQuery.Event) {
        this.pressedKeys[event.which] = true;
    }

    upHandler(event: JQuery.Event) {
        this.pressedKeys[event.which] = false;
    }

    isPressed(keyCode: string) {
        return this.pressedKeys[keyCode] || false;
    }
}
