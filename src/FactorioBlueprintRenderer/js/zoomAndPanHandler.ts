import { IKeyboardHandler } from "./keyboardHandler";

type MouseListenerCallback = (x: number, y: number) => void;

export default class ZoomAndPanHandler {
    private MAX_SCALE =                             3;
    private minScale =                              1;
    private lastPosition: { x: number, y: number } | null;
    private canvasWidth =                           0;
    private canvasHeight =                          0;
    private pixiContainerWidth =                    0;
    private pixiContainerHeight =                   0;
    private movedBy =                               0;
    private moved: boolean;
    private pixiContainer: PIXI.Container;
    private keyboardHandler: IKeyboardHandler;
    private onMouseClickListener: MouseListenerCallback;
    private onMousePositionChanged: MouseListenerCallback;

    constructor(keyboardHandler: IKeyboardHandler) {
        this.keyboardHandler = keyboardHandler;
    }

    zoom(zoomMultiplier: number, x: number, y: number) {
        var worldPosition = this.getWorldPosition(x, y);
        this.pixiContainer.scale.x *= zoomMultiplier;
        this.pixiContainer.scale.y *= zoomMultiplier;
        this.clampZoom();
        var newScreenPosition = {
            x: worldPosition.x * this.pixiContainer.scale.x + this.pixiContainer.x,
            y: worldPosition.y * this.pixiContainer.scale.y + this.pixiContainer.y
        };
        this.pixiContainer.x -= newScreenPosition.x - x;
        this.pixiContainer.y -= newScreenPosition.y - y;
        this.clampPosition();
    }

    clampZoom() {
        if (this.pixiContainer.scale.x > this.MAX_SCALE) {
            this.pixiContainer.scale.x = this.MAX_SCALE;
        }
        if (this.pixiContainer.scale.x < this.minScale) {
            this.pixiContainer.scale.x = this.minScale;
        }
        if (this.pixiContainer.scale.y > this.MAX_SCALE) {
            this.pixiContainer.scale.y = this.MAX_SCALE;
        }
        if (this.pixiContainer.scale.y < this.minScale) {
            this.pixiContainer.scale.y = this.minScale;
        }
    }

    clampPosition() {
        if (this.pixiContainer.x > 0) {
            this.pixiContainer.x = 0;
        }
        if (this.pixiContainer.y > 0) {
            this.pixiContainer.y = 0;
        }
        var minX = this.canvasWidth - (this.pixiContainerWidth * this.pixiContainer.scale.x);
        var minY = this.canvasHeight - (this.pixiContainerHeight * this.pixiContainer.scale.y);
        if (this.pixiContainer.x < minX) {
            this.pixiContainer.x = minX;
        }
        if (this.pixiContainer.y < minY) {
            this.pixiContainer.y = minY;
        }
    }

    getWorldPosition(mouseX: number, mouseY: number) {
        return {
            x: (mouseX - this.pixiContainer.x) / this.pixiContainer.scale.x,
            y: (mouseY - this.pixiContainer.y) / this.pixiContainer.scale.y
        };
    }

    handleKeyboardPanning() {
        if (!this.pixiContainer) {
            return;
        }

        const keys = this.keyboardHandler.keys;

        if (this.keyboardHandler.isPressed(keys.W)) {
            this.pixiContainer.y += 10;
            if (this.pixiContainer.y > 0) {
                this.pixiContainer.y = 0;
            }
        }
        if (this.keyboardHandler.isPressed(keys.A)) {
            this.pixiContainer.x += 10;
            if (this.pixiContainer.x > 0) {
                this.pixiContainer.x = 0;
            }
        }
        if (this.keyboardHandler.isPressed(keys.S)) {
            this.pixiContainer.y -= 10;
        }
        if (this.keyboardHandler.isPressed(keys.D)) {
            this.pixiContainer.x -= 10;
        }

        if (this.keyboardHandler.isPressed(keys.dash)
            || this.keyboardHandler.isPressed(keys.num_sub)) {
            this.zoom(0.99, this.canvasWidth / 2, this.canvasHeight / 2);
        }

        if (this.keyboardHandler.isPressed(keys.equal)
            || this.keyboardHandler.isPressed(keys.num_add)) {
            this.zoom(1.01, this.canvasWidth / 2, this.canvasHeight / 2);
        }

        // Had to disable this due to weird pixi exceptions, couldn't figure out whats wrong,
        // this.pixiContainer.scale fails because transform is null
        //this.clampZoom();
        //this.clampPosition();
    }

    onMouseWheel(event: JQueryMousewheel.JQueryMousewheelEventObject) {
        if (!this.pixiContainer) {
            return;
        }
        var zoomMultiplier = event.deltaY > 0 ? 1.1 : 0.9;
        this.zoom(zoomMultiplier, event.offsetX || 0, event.offsetY || 0); // TODO: offsetX and offsetY can be apparently undefined
    }

    onMouseDown(event: JQuery.Event<HTMLCanvasElement>) {
        let offsetX = event.offsetX;
        let offsetY = event.offsetY;

        if (!offsetX || !offsetY) {
            let target = event.target;
            let rect = target.getBoundingClientRect();
            offsetX = (event.clientX || 0) - rect.left,
            offsetY = (event.clientY || 0) - rect.top;
        }
        this.lastPosition = {x: offsetX, y: offsetY};
        this.movedBy = 0;
    }

    onMouseUp(event: JQuery.Event<HTMLCanvasElement>) {
        let offsetX = event.offsetX;
        let offsetY = event.offsetY;

        if (!offsetX || !offsetY) {
            let target = event.target;
            let rect = target.getBoundingClientRect();
            offsetX = (event.clientX || 0) - rect.left;
            offsetY = (event.clientY || 0) - rect.top;
        }

        if (this.lastPosition && this.movedBy < 40) {
            var worldPosition = this.getWorldPosition(offsetX, offsetY);
            setTimeout(() => {
                this.onMouseClickListener(Math.round(worldPosition.x), Math.round(worldPosition.y));
            }, 100);
        }
        this.lastPosition = null;
    }

    onMouseOut(/*event: JQuery.Event<HTMLCanvasElement>*/) {
        this.lastPosition = null;
        this.moved = true;
    }

    onMouseMove(event: JQuery.Event<HTMLCanvasElement>) {
        let offsetX = event.offsetX;
        let offsetY = event.offsetY;

        if (!offsetX || ! offsetY) {
            let target = event.target;
            let rect = target.getBoundingClientRect();
            offsetX = (event.clientX || 0) - rect.left,
            offsetY = (event.clientY || 0) - rect.top;
        }

        if (!this.pixiContainer) {
            return;
        }

        if (this.lastPosition) {
            this.movedBy += Math.pow(offsetX - this.lastPosition.x, 2) + Math.pow(offsetY - this.lastPosition.y, 2);
            this.pixiContainer.x += (offsetX - this.lastPosition.x);
            this.pixiContainer.y += (offsetY - this.lastPosition.y);
            this.lastPosition = {x: offsetX, y: offsetY};
            this.clampPosition();
        }

        let worldPosition = this.getWorldPosition(offsetX, offsetY);
        this.onMousePositionChanged(Math.round(worldPosition.x), Math.round(worldPosition.y));
    }

    onHammerPinch(event: HammerInput) {
        this.zoom(Math.pow(event.scale, 0.05), event.center.x, event.center.y);
    }

    setContainer(container: PIXI.Container, keepPosition: boolean) {
        this.minScale = container.scale.x;
        this.pixiContainerWidth = container.width / container.scale.x;
        this.pixiContainerHeight = container.height / container.scale.y;

        if (keepPosition && this.pixiContainer) {
            container.x = this.pixiContainer.x;
            container.y = this.pixiContainer.y;
            container.scale.x = this.pixiContainer.scale.x;
            container.scale.y = this.pixiContainer.scale.y;
        }

        this.pixiContainer = container;
    }

    setOnMousePositionChanged(listener: MouseListenerCallback) {
        this.onMousePositionChanged = listener;
    }

    setOnMouseClickListener(listener: MouseListenerCallback) {
        this.onMouseClickListener = listener;
    }

    init(canvas: HTMLCanvasElement) {
        $(canvas).mousewheel(this.onMouseWheel.bind(this));
        $(canvas).on('vmousedown', this.onMouseDown.bind(this));
        $(canvas).on('vmouseup', this.onMouseUp.bind(this));
        $(canvas).on('vmouseout', this.onMouseOut.bind(this));
        $(canvas).on('vmousemove', this.onMouseMove.bind(this));
        var hammertime = new Hammer($(canvas).get(0));
        hammertime.get('pinch').set({ enable: true });
        hammertime.on('pinch', this.onHammerPinch.bind(this));
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
    }
}
