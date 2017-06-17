import forEach = require("lodash.foreach");

export interface IIconCropper {
    init(domContainer: HTMLElement): void;
    createIconURL(spriteLayers: Dict<PIXI.Sprite>): string;
}

export default class IconCropper implements IIconCropper {
    private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private stage: PIXI.Container;

    init(domContainer: HTMLElement) {
        this.renderer = PIXI.autoDetectRenderer(32, 32, ({antialias: true, forceFXAA: true} as PIXI.WebGLRendererOptions));
        // this.renderer.backgroundColor = 0xFFFFFF;

        domContainer.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.renderer.render(this.stage);
        $(this.renderer.view).hide();
    }

    createIconURL(spriteLayers: Dict<PIXI.Sprite>) {
        var tmpContainer = new PIXI.Container();
        forEach(spriteLayers, function(sprite: any) {
            tmpContainer.addChild(sprite);
        });
        tmpContainer.x = 16;
        tmpContainer.y = 16;
        this.stage.addChild(tmpContainer);
        this.renderer.render(this.stage);

        var src = this.renderer.view.toDataURL();

        this.stage.removeChild(tmpContainer);

        return src;
    }
}
