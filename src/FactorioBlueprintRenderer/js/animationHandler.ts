type ListenerCallback = (currentSecond: number) => void;

export default class AnimationHandler {
    onSecondTickListeners: ListenerCallback[] =         [];
    currentFrame =                                      0;
    currentSecond =                                     0;

    clear() {
        this.onSecondTickListeners = [];
    }

    tick() {
        this.currentFrame++;
        if (this.currentFrame === 60) {
            this.onSecondTickListeners.forEach((listener) => {
                listener(this.currentSecond);
            });
            this.currentSecond++;
            this.currentFrame = 0;
        }
    }

    addOnSecondTickListener(listener: ListenerCallback) {
        this.onSecondTickListeners.push(listener);
    }
}
