type PressedKeysMap = { [key: string]: boolean }

export interface IKeyboardHandler {
    keys: { [key: string]: number };
    downHandler(event: JQuery.Event): void;
    upHandler(event: JQuery.Event): void;
    isPressed(keyCode: number): boolean;
}

export default class KeyboardHandler implements IKeyboardHandler {
    keys = {
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

    isPressed(keyCode: number) {
        return this.pressedKeys[keyCode] || false;
    }
}
