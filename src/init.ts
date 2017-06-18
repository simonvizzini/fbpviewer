import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

require("bootstrap");
require("jquery-mousewheel");

import forEach = require("lodash.foreach");
const BootstrapDialog = require("bootstrap3-dialog");
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
const FBR_INITIAL_BLUEPRINT = window.FBR_INITIAL_BLUEPRINT // is currently the blueprintbook as object, convert back to string later
let currentBlueprintIndex = 0;
let currentBlueprintString = "";

function initUi() {
    createDropShadowFilter();

    const navbar = document.getElementsByClassName("navbar")[0] as HTMLElement;
    const view_size: Size = { w: window.innerWidth, h: window.innerHeight - navbar.offsetHeight };
    const view_ratio = view_size.w / view_size.h;
    const status_size = { w: 100, h: 20 };

    const container = document.getElementById("fbpviewer") as HTMLElement;
    const view: HTMLCanvasElement = document.getElementById("fbp-canvas") as HTMLCanvasElement;

    var renderer = PIXI.autoDetectRenderer(view_size.w, view_size.h, { view, antialias: true, forceFXAA: true } as PIXI.WebGLRendererOptions); // todo: check why the cast is necessary, type definition seems to be incorrect
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

    var bottomStatus = new PIXI.Container();
    bottomStatus.x = view.width - 100;
    bottomStatus.y = view.height - 20;

    var positionBackground = new PIXI.Graphics();
    positionBackground.beginFill(0xCCCCCC);
    positionBackground.lineStyle(0, 0x000000);
    positionBackground.drawRect(0, 0, status_size.w, status_size.h);
    bottomStatus.addChild(positionBackground);

    var statusText = new PIXI.Text("(0, 0)", new PIXI.TextStyle({
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

    var gameContainer = new PIXI.Container();
    var stage = new PIXI.Container();
    var graphics = new PIXI.Graphics();
    stage.addChild(graphics);

    function resize() {
        const navbar = document.getElementsByClassName("navbar")[0] as HTMLElement;
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

            // var url = resource.url;
            // var name = resource.name;
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

            function gameLoop() {
                requestAnimationFrame(gameLoop);
                zoomAndPanHandler.handleKeyboardPanning();
                blueprintRenderer.tick();
                renderer.render(stage);
            }

            resize();
            gameLoop();

            var blueprintData = { data: FBR_INITIAL_BLUEPRINT as BlueprintData }; //factorioBlueprintReader.parse(currentBlueprintString);
            var blueprintContainer = new PIXI.Container();
            zoomAndPanHandler.setContainer(blueprintContainer);
            gameContainer.addChild(blueprintContainer);

            function redraw() {
                const containerToDestroy = blueprintContainer;

                setTimeout(() => {
                    gameContainer.removeChild(containerToDestroy);
                    containerToDestroy.destroy({ children: true });
                }, 0);

                if (blueprintData.data.blueprint) {
                    $("#blueprint-recipe-selector").hide();
                    blueprintContainer = blueprintRenderer.renderBlueprint((blueprintData.data as BlueprintBookEntry));
                } else if (blueprintData.data.blueprint_book) {
                    $("#blueprint-recipe-selector").show();
                    blueprintContainer = blueprintRenderer.renderBlueprint(blueprintData.data.blueprint_book.blueprints[currentBlueprintIndex]);

                    initBlueprintDropdown(
                        factorioBlueprintReader,
                        blueprintData.data.blueprint_book,
                        blueprintRenderer,
                        iconCropper,
                        (index: number) => {
                            currentBlueprintIndex = index;
                            redraw();
                        }
                    );
                }

                zoomAndPanHandler.setContainer(blueprintContainer);
                gameContainer.addChild(blueprintContainer);
            }

            setTimeout(() => {
                redraw();
            }, 0);

            initButtons(
                factorioBlueprintReader,
                blueprintData,
                redraw
            );
        });
}

$(function () {
    initUi();
});

function showEntityDialog(_: PIXI.interaction.InteractionEvent, entity: BlueprintEntity) {
    BootstrapDialog.show({
        title: entity.name,
        animate: false,
        message: '<pre class="json">' + JSON.stringify(entity, null, 4) + '</pre>',
        buttons: [{
            label: 'OK',
            action: (dialogRef: any) => {
                dialogRef.close();
            }
        }]
    });
}

function initButtons(
    factorioBlueprintReader: FactorioBlueprintReader,
    blueprintData: { data: BlueprintData },
    redraw: () => void
) {
    $("#show-blueprint-string-button").click(() => {
        BootstrapDialog.show({
            title: "Blueprint string",
            message: '<div class="form-group"><textarea id="factorio-blueprint-output" class="form-control" onClick="this.setSelectionRange(0, this.value.length)" rows="5"></textarea></div>',
            onshown: () => {
                $('#factorio-blueprint-output')
                    .val(factorioBlueprintReader.stringify(blueprintData))
                    .focus()
                    .select();
            }
        });
    });
    $("#load-blueprint-button").click(() => {
        BootstrapDialog.show({
            title: "Paste blueprint",
            message: '<div class="input-group">' +
            '<span class="input-group-addon">BP</span>' +
            '<input id="factorio-blueprint-input" type="text" class="form-control" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Paste your blueprint here">' +
            '</div>',
            buttons: [{
                label: 'Render',
                action: (dialogRef: any) => {
                    var blueprintString = $("#factorio-blueprint-input").val();
                    try {
                        var parsed = factorioBlueprintReader.parse(blueprintString as string);
                    } catch (e) {
                        alert("Failed parsing the blueprint!");
                        return;
                    }
                    if (!parsed) {
                        alert("Failed parsing the blueprint!");
                        return;
                    }
                    if (blueprintData.data.blueprint_book && blueprintData.data.blueprint_book.blueprints.length == 0) {
                        alert("You can't import an empty book!");
                        return;
                    }
                    dialogRef.close();
                    blueprintData = parsed;
                    currentBlueprintIndex = 0;
                    currentBlueprintString = blueprintString as string;
                    redraw();
                }
            }, {
                label: 'Cancel',
                action: (dialogRef: any) => {
                    dialogRef.close();
                }
            }],
            onshown: () => {
                $('#factorio-blueprint-input').focus();
                $('#factorio-blueprint-input').select();
            }
        });
    });
}

function initBlueprintDropdown(
    factorioBlueprintReader: FactorioBlueprintReader,
    blueprintBook: BlueprintBook,
    blueprintRenderer: BlueprintRenderer,
    iconCropper: IconCropper,
    onClick: (key: number) => void
) {
    $('#blueprint-recipe-selector ul').find('li').remove();
    const options = createBlueprintbookOptions(
        factorioBlueprintReader,
        blueprintBook,
        blueprintRenderer,
        iconCropper,
        onClick
    );
    forEach(options, (option) => $('#blueprint-recipe-selector ul').append(option));
}

function createBlueprintbookOptions(
    factorioBlueprintReader: FactorioBlueprintReader,
    blueprintBook: BlueprintBook,
    blueprintRenderer: BlueprintRenderer,
    iconCropper: IconCropper,
    onClick: (key: number) => void
) {
    return blueprintBook.blueprints.map((value, key: number) => {
        var icons = '';
        for (var k = 0; k < 4; k++) {
            var icon = value.blueprint.icons[k];
            if (icon) {
                var signalName = icon.signal.name;
                if (factorioBlueprintReader.icons[signalName]) {
                    var imageSpec = factorioBlueprintReader.icons[signalName].image;
                    var iconSprites = blueprintRenderer.createEntityLayers(imageSpec as Image);
                    var iconSrc = iconCropper.createIconURL(iconSprites);
                    icons += '<img src="' + iconSrc + '" />';
                    continue;

                    /*if (imageSpec.type == 'sprite') {
                        icons += '<img src="' + FBR_IMAGES_PREFIX + imageSpec.path + '" />';
                        continue;
                        } else {
                        console.log('Icon complex', signalName);
                        }*/
                } else {
                    console.log('Icon not found', signalName);
                }
            } else {
                icons += '<span style="margin-right: 32px;"></span>';
            }
        }
        var option = $('<li><a href="#">' + icons + ' ' + value.blueprint.label + '</a></li>');
        option.click(() => onClick(key));

        if (key === currentBlueprintIndex) {
            option.addClass('active');
        }
        return option;
    });
}

$(document).on("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.loadingMessageTextVisible = false;
});
