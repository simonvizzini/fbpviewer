import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

require("bootstrap");
require("jquery-mousewheel");

import forEach = require("lodash.foreach");
const BootstrapDialog = require("bootstrap3-dialog");
import hljs = require("highlight.js");
import * as PIXI from "pixi.js";
const createDropShadowFilter = require("./pixi/createDropShadowFilter");

import FactorioBlueprintReader from "./factorioBlueprintReader";
import AnimationHandler from "./animationHandler";
import BlueprintRenderer from "./blueprintRenderer";
import IconCropper from "./iconCropper";
import KeyboardHandler from "./keyboardHandler";
import ZoomAndPanHandler from "./zoomAndPanHandler";
import Loader from "./images/loader";

const FBR_DEV = 0;
window.FBR_IMAGES_PREFIX = FBR_DEV ? "/images/factorio/" : "images/factorio/";
window.FBR_PIXELS_PER_TILE = 32;
window.FBR_CANVAS_WIDTH = 0;
window.FBR_CANVAS_HEIGHT = 0;

const FBR_INITIAL_BLUEPRINT = require("../entities.json");

let currentBlueprintIndex = 0;
let currentBlueprintString = ""; // FBR_INITIAL_BLUEPRINT;

$(function () {
    createDropShadowFilter();

    const STATUS_WIDTH = 100;
    const STATUS_HEIGHT = 20;

    window.FBR_CANVAS_WIDTH = $("#main-site-container").width() - 5;
    window.FBR_CANVAS_HEIGHT = $(window).height() - $(".nav").height() - 5;

    var renderer = PIXI.autoDetectRenderer(window.FBR_CANVAS_WIDTH, window.FBR_CANVAS_HEIGHT, { antialias: true, forceFXAA: true } as PIXI.WebGLRendererOptions); // todo: check why the cast is necessary, type definition seems to be incorrect
    // todo: type definition says there is no backgroundColor?
    // renderer.backgroundColor = 0x000000;

    $("#main-site-container").get(0).appendChild(renderer.view);

    const factorioBlueprintReader = new FactorioBlueprintReader();
    factorioBlueprintReader.loadEntities();

    const animationHandler = new AnimationHandler();
    const keyboardHandler = new KeyboardHandler();
    const loader = new Loader(factorioBlueprintReader);

    const zoomAndPanHandler = new ZoomAndPanHandler(keyboardHandler);
    zoomAndPanHandler.init(renderer.view);

    const iconCropper = new IconCropper();
    iconCropper.init($("#main-site-container").get(0));

    const blueprintRenderer = new BlueprintRenderer(factorioBlueprintReader, animationHandler, keyboardHandler);
    blueprintRenderer.on("entityclicked", showEntityDialog);

    var stage = new PIXI.Container();
    var graphics = new PIXI.Graphics();
    stage.addChild(graphics);

    var bottomStatus = new PIXI.Container();
    bottomStatus.x = window.FBR_CANVAS_WIDTH - 100;
    bottomStatus.y = window.FBR_CANVAS_HEIGHT - 20;

    var positionBackground = new PIXI.Graphics();
    positionBackground.beginFill(0xCCCCCC);
    positionBackground.lineStyle(0, 0x000000);
    positionBackground.drawRect(0, 0, STATUS_WIDTH, STATUS_HEIGHT);
    bottomStatus.addChild(positionBackground);

    var statusText = new PIXI.Text("(0, 0)", new PIXI.TextStyle({
        align: 'right',
        fontFamily: 'Arial',
        fontSize: 10
    }));
    statusText.anchor.set(1, 0);
    statusText.x = STATUS_WIDTH - 10;
    statusText.y = 2;
    bottomStatus.addChild(statusText);

    zoomAndPanHandler.setOnMousePositionChanged((x, y) => {
        statusText.text = '(' + Math.floor(x / window.FBR_PIXELS_PER_TILE) + ', ' + Math.floor(y / window.FBR_PIXELS_PER_TILE) + ')';
    });

    var gameContainer = new PIXI.Container();

    PIXI.loader
        .add(FBR_DEV ? loader.getImagesToLoad() : './images/spritesheet.json')
        .on("progress", (loader /*, resource*/) => {

            // var url = resource.url;
            // var name = resource.name;

            graphics.clear();
            graphics.beginFill(0xFFFFFF);
            graphics.lineStyle(5, 0x000000);
            graphics.drawRect(20, window.FBR_CANVAS_HEIGHT / 2 - 20, window.FBR_CANVAS_WIDTH - 40, 40);

            graphics.beginFill(0x0000FF);
            graphics.drawRect(20, window.FBR_CANVAS_HEIGHT / 2 - 20, (window.FBR_CANVAS_WIDTH - 40) / 100 * loader.progress, 40);
        })
        .load(function () {
            stage.removeChild(graphics);
            stage.addChild(gameContainer);
            stage.addChild(bottomStatus);
            graphics.destroy(); // check if this works

            if (FBR_DEV) {
                loader.prepareTrimmedTextures();
            }

            function gameLoop() {
                requestAnimationFrame(gameLoop);
                zoomAndPanHandler.handleKeyboardPanning();
                animationHandler.tick();
                renderer.render(stage);
            }

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

                // factorioBlueprintReader.loadEntities();

                if (blueprintData.data.blueprint) {
                    $("#blueprint-recipe-selector").hide();
                    blueprintContainer = blueprintRenderer.renderBlueprint((blueprintData.data as BlueprintBookEntry));
                } else if (blueprintData.data.blueprint_book) {
                    $("#blueprint-recipe-selector").show();
                    blueprintContainer = blueprintRenderer.renderBlueprint(blueprintData.data.blueprint_book.blueprints[currentBlueprintIndex]);

                    initBlueprintDropdown(
                        factorioBlueprintReader,
                        blueprintData,
                        blueprintRenderer,
                        iconCropper,
                        redraw
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
});

function showEntityDialog(entity: BlueprintEntity) {
    BootstrapDialog.show({
        title: entity.name,
        animate: false,
        message: '<pre class="json">' + JSON.stringify(entity, null, '    ') + '</pre>',
        buttons: [{
            label: 'OK',
            action: (dialogRef: any) => {
                dialogRef.close();
            }
        }],
        onshown: (/*dialogRef: any*/) => {
            $('pre.json').each((_, block) => {
                hljs.highlightBlock(block);
            });
        }
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
    blueprintData: { data: BlueprintData },
    blueprintRenderer: BlueprintRenderer,
    iconCropper: IconCropper,
    redraw: () => void
) {
    $('#blueprint-recipe-selector ul').find('li').remove();
    if (blueprintData.data.blueprint_book) {
        forEach(blueprintData.data.blueprint_book.blueprints, (value, key: number) => { // todo: is key really a number?
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
            option.click(() => {
                currentBlueprintIndex = key; // todo: is key really a number?
                redraw();
            });
            if (key === currentBlueprintIndex) {
                option.addClass('active');
            }
            $('#blueprint-recipe-selector ul').append(option);
        });
    }
}

$(document).on("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.loadingMessageTextVisible = false;
});
