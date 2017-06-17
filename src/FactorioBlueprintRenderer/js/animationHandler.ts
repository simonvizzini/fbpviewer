type ListenerCallback = (currentSecond: number) => void;

export interface IAnimationHandler {
    clear(): void;
    tick(): void;
    addOnSecondTickListener(listener: ListenerCallback): void;
}

export default class AnimationHandler implements IAnimationHandler {
    private currentFrame =      0;
    private currentSecond =     0;
    private onSecondTickListeners: ListenerCallback[] = [];

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
