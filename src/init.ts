require("jquery-mousewheel");

// import forEach = require("lodash.foreach");
import * as PIXI from "pixi.js";
const createDropShadowFilter = require("./pixi/createDropShadowFilter");

import FactorioBlueprintReader from "./factorioBlueprintReader";
import BlueprintRenderer from "./blueprintRenderer";
import IconCropper from "./iconCropper";
import KeyboardHandler from "./keyboardHandler";
import ZoomAndPanHandler from "./zoomAndPanHandler";
import Loader from "./images/loader";

const FBR_DEV = 0;
window.FBR_IMAGES_PREFIX = FBR_DEV ? "/web/images/factorio/" : "images/factorio/";
window.FBR_PIXELS_PER_TILE = 32;
window.FBR_CANVAS_WIDTH = 0;
window.FBR_CANVAS_HEIGHT = 0;
let currentBlueprintData = { data: window.FBR_INITIAL_BLUEPRINT, version: "1" }; // is currently the blueprintbook as object, convert back to string later
let currentBlueprintIndex = 0;
let currentBlueprintString = "";

function initUi() {
    createDropShadowFilter();

    const navbar = document.getElementById("navbar") as HTMLElement;
    const view_size: Size = { w: window.innerWidth, h: window.innerHeight - navbar.offsetHeight };
    const view_ratio = view_size.w / view_size.h;
    const status_size = { w: 100, h: 20 };

    const container = document.getElementById("fbpviewer") as HTMLElement;
    const view: HTMLCanvasElement = document.getElementById("fbp-canvas") as HTMLCanvasElement;

    const renderer = PIXI.autoDetectRenderer(view_size.w, view_size.h, { view, antialias: true, forceFXAA: true } as PIXI.WebGLRendererOptions); // todo: check why the cast is necessary, type definition seems to be incorrect
    container.appendChild(view);
    // todo: type definition says there is no backgroundColor?
    // renderer.backgroundColor = 0x000000;

    // for debug purposes
    (window as any)._renderer = renderer;
    window.FBR_CANVAS_WIDTH = view.width;
    window.FBR_CANVAS_HEIGHT = view.height;

    const factorioBlueprintReader = new FactorioBlueprintReader();
    factorioBlueprintReader.loadEntities();

    const keyboardHandler = new KeyboardHandler();
    const loader = new Loader(factorioBlueprintReader);

    const iconCropper = new IconCropper();
    iconCropper.init(container);

    const blueprintRenderer = new BlueprintRenderer(factorioBlueprintReader, keyboardHandler);
    blueprintRenderer.on("entityclicked", showEntityDialog);

    const bottomStatus = new PIXI.Container();
    bottomStatus.x = view.width - 100;
    bottomStatus.y = view.height - 20;

    const positionBackground = new PIXI.Graphics();
    positionBackground.beginFill(0xCCCCCC);
    positionBackground.lineStyle(0, 0x000000);
    positionBackground.drawRect(0, 0, status_size.w, status_size.h);
    bottomStatus.addChild(positionBackground);

    const statusText = new PIXI.Text("(0, 0)", new PIXI.TextStyle({
        align: 'right',
        fontFamily: 'Arial',
        fontSize: 10
    }));

    statusText.anchor.set(1, 0);
    statusText.x = status_size.w - 10;
    statusText.y = 2;
    bottomStatus.addChild(statusText);

    const zoomAndPanHandler = new ZoomAndPanHandler(keyboardHandler);
    zoomAndPanHandler.init(view);
    zoomAndPanHandler.setOnMousePositionChanged((x, y) => {
        statusText.text = '(' + Math.floor(x / window.FBR_PIXELS_PER_TILE) + ', ' + Math.floor(y / window.FBR_PIXELS_PER_TILE) + ')';
    });

    const gameContainer = new PIXI.Container();
    const stage = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    stage.addChild(graphics);

    function resize() {
        const navbar = document.getElementById("navbar") as HTMLElement;
        const target_height = window.innerHeight - navbar.offsetHeight;

        if (window.innerWidth / target_height >= view_ratio) {
            var w = target_height * view_ratio;
            var h = target_height;
        } else {
            var w = target_height;
            var h = target_height / view_ratio;
        }

        window.FBR_CANVAS_WIDTH = w;
        window.FBR_CANVAS_HEIGHT = h;
        renderer.view.style.width = w + 'px';
        renderer.view.style.height = h + 'px';
    }

    window.addEventListener("resize", (_) => {
        resize();
    });

    PIXI.loader
        .add(FBR_DEV ? loader.getImagesToLoad() : './images/spritesheet.json')
        .on("progress", (loader /*, resource*/) => {
            // Somehow no progress is visible, investigate what's wrong
            // console.log("progress: ", loader.progress)
            graphics.clear();
            graphics.beginFill(0xFFFFFF);
            graphics.lineStyle(5, 0x000000);
            graphics.drawRect(20, renderer.view.height / 2 - 20, renderer.view.width - 40, 40);

            graphics.beginFill(0x0000FF);
            graphics.drawRect(20, renderer.view.height / 2 - 20, (renderer.view.width - 40) / 100 * loader.progress, 40);
        })
        .load(() => {
            stage.removeChild(graphics);
            stage.addChild(gameContainer);
            stage.addChild(bottomStatus);
            graphics.destroy();

            if (FBR_DEV) {
                loader.prepareTrimmedTextures();
            }

            let blueprintContainer: PIXI.Container | undefined;

            const dropdown = initBlueprintDropdown(
                "blueprint-recipe-selector",
                (index: number) => {
                    currentBlueprintIndex = index;
                    redraw();
                }
            );

            if (currentBlueprintData.data.blueprint_book) {
                dropdown.setItems(currentBlueprintData.data.blueprint_book.blueprints);
            }

            function redraw() {
                if (blueprintContainer) {
                    gameContainer.removeChild(blueprintContainer);
                    blueprintContainer.destroy({ children: true });
                }

                if (currentBlueprintData.data.blueprint) {
                    dropdown.hide();
                    blueprintContainer = blueprintRenderer.renderBlueprint(currentBlueprintData.data.blueprint);
                } else if (currentBlueprintData.data.blueprint_book) {
                    dropdown.show();
                    blueprintContainer = blueprintRenderer.renderBlueprint(currentBlueprintData.data.blueprint_book.blueprints[currentBlueprintIndex].blueprint);
                }

                if (blueprintContainer) {
                    zoomAndPanHandler.setContainer(blueprintContainer);
                    gameContainer.addChild(blueprintContainer);
                }
            }

            function gameLoop() {
                requestAnimationFrame(gameLoop);
                zoomAndPanHandler.handleKeyboardPanning();
                blueprintRenderer.tick();
                renderer.render(stage);
            }

            redraw();
            gameLoop();

            initShowStringButton(factorioBlueprintReader);
            initLoadBlueprintButton(factorioBlueprintReader,redraw);
        });
}

$(function () {
    initUi();
});

function showEntityDialog(_: PIXI.interaction.InteractionEvent, entity: BlueprintEntity) {
    alert(JSON.stringify(entity, null, 4));
}

function initShowStringButton(factorioBlueprintReader: FactorioBlueprintReader) {
    (document.getElementById("show-blueprint-string-button") as HTMLElement).addEventListener("click", () => {
        if (currentBlueprintData) {
            prompt("current blueprint string:", factorioBlueprintReader.stringify(currentBlueprintData));
        }
    });
}

function initLoadBlueprintButton(
    factorioBlueprintReader: FactorioBlueprintReader,
    redraw: () => void
) {
    (document.getElementById("load-blueprint-button") as HTMLElement).addEventListener("click", () => {
        var blueprintString = prompt("Paste your blueprint string below:");

        if (!blueprintString) {
            return;
        }

        let parsed;

        try {
            parsed = factorioBlueprintReader.parse(blueprintString);
        } catch (e) {
            alert("Failed parsing the blueprint!");
            return;
        }

        if (parsed.data.blueprint_book && parsed.data.blueprint_book.blueprints.length === 0) {
            alert("You can't import an empty book!");
            return;
        }

        currentBlueprintData = parsed;
        currentBlueprintIndex = 0;
        currentBlueprintString = blueprintString as string;
        redraw();
    });
}

function initBlueprintDropdown(elementId: string, onChange: (index: number) => void) {
    const dropdown = document.getElementById(elementId);

    if (!dropdown) {
        throw new Error("select not found: " + elementId);
    }

    const setItems = (blueprints: BlueprintBookEntry[]) => {
        const options = blueprints
            .map((value, key: number) => `<option value="${key}">${value.blueprint.label}</option>`)
            .join("");

        dropdown.innerHTML = options;
    }

    dropdown.addEventListener("change", (event) => {
        const value = parseInt((event.target as HTMLOptionElement).value);
        onChange(value);
    });

    return {
        setItems,
        hide: () => dropdown.style.display = "none",
        show: () => dropdown.style.display = "inline-block"
    }
}
