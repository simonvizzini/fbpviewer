import { EventEmitter } from "events";
import forEach = require("lodash.foreach");
import merge = require("lodash.merge");

const ColorFillShader = require("./pixi/createColorFillShader.js");
import { IFactorioBlueprintReader } from "./factorioBlueprintReader";
import { IAnimationHandler } from "./animationHandler";
import { IKeyboardHandler } from "./keyboardHandler";

export default class BlueprintRenderer extends EventEmitter {
    private DEFAULT_LAYER = 100;
    private OVERLAY_LAYER = 200;

    constructor(
        private factorioBlueprintReader: IFactorioBlueprintReader,
        private animationHandler: IAnimationHandler,
        private keyboardHandler: IKeyboardHandler
    ) {
        super();
    }

    private getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private hashTwoIntegers(a: number, b: number) {
        var A = a >= 0 ? 2 * a : -2 * a - 1;
        var B = b >= 0 ? 2 * b : -2 * b - 1;
        var C = (A >= B ? A * A + A + B : A + B * B) / 2;
        return a < 0 && b < 0 || a >= 0 && b >= 0 ? C : -C - 1;
    }

    private getEntityDrawingSpecForEntity(entity: BlueprintEntity) {
        var entityDrawingSpec = this.factorioBlueprintReader.entities[entity.name];
        if (!entityDrawingSpec) {
            return null;
        }
        if (entity.type && entityDrawingSpec.types) {
            entityDrawingSpec = merge({}, entityDrawingSpec, entityDrawingSpec.types[entity.type]);
        }
        if (entity.direction && entityDrawingSpec.directions && entityDrawingSpec.directions[entity.direction]) {
            entityDrawingSpec = merge({}, entityDrawingSpec, entityDrawingSpec.directions[entity.direction]);
        }

        return entityDrawingSpec;
    }

    createEntityLayers(entityImageSpec: Image, entity?: BlueprintEntity, entitySpec?: any) { // figure out what is entitySpec
        var layerSprites: Dict<PIXI.Sprite> = {};

        if (entityImageSpec.type == 'sprite') {
            layerSprites[entityImageSpec.layer || this.DEFAULT_LAYER] = new PIXI.Sprite(PIXI.Texture.fromFrame(window.FBR_IMAGES_PREFIX + entityImageSpec.path));
        } else if (entityImageSpec.type == 'trim') {
            layerSprites[entityImageSpec.layer || this.DEFAULT_LAYER] = new PIXI.Sprite(PIXI.Texture.fromFrame(window.FBR_IMAGES_PREFIX + entityImageSpec.path + "." + entityImageSpec.number));
        } else if (entityImageSpec.type == 'random_trim') {
            var number = this.getRandomInt(entityImageSpec.from as number, entityImageSpec.to as number);
            layerSprites[entityImageSpec.layer || this.DEFAULT_LAYER] = new PIXI.Sprite(PIXI.Texture.fromFrame(window.FBR_IMAGES_PREFIX + entityImageSpec.path + "." + number));
        } else if (entityImageSpec.type == 'animated') {
            var frames = [];
            for (var i = entityImageSpec.from as number; i <= (entityImageSpec.to as number); i++) {
                frames.push(PIXI.Texture.fromFrame(window.FBR_IMAGES_PREFIX + entityImageSpec.path + "." + i));
                //frames.push(PIXI.utils.TextureCache[window.FBR_IMAGES_PREFIX + entityImageSpec.path + "." + i]);
            }
            if (entityImageSpec.reverse) {
                for (var j = entityImageSpec.to as number; j >= (entityImageSpec.from as number); j--) {
                    frames.push(PIXI.Texture.fromFrame(window.FBR_IMAGES_PREFIX + entityImageSpec.path + "." + j));
                    //frames.push(PIXI.utils.TextureCache[window.FBR_IMAGES_PREFIX + entityImageSpec.path + "." + j]);
                }
            }
            var sprite = new PIXI.extras.AnimatedSprite(frames);
            sprite.animationSpeed = entityImageSpec.animationSpeed || 1;
            sprite.play();
            layerSprites[entityImageSpec.layer || this.DEFAULT_LAYER] = sprite;
        } else if (entityImageSpec.type == 'container' && entityImageSpec.images !== undefined) {
            for (var imageKey in entityImageSpec.images) {
                if (entityImageSpec.images.hasOwnProperty(imageKey)) {
                    var entityLayers = this.createEntityLayers(entityImageSpec.images[imageKey], entity, entitySpec);
                    forEach(entityLayers, (entityLayer: PIXI.Sprite, layer: string) => {
                        // TODO: Proper TS types to avoid this
                        entityLayer.x = (entityImageSpec.images && entityImageSpec.images[imageKey].x as number) || 0;
                        entityLayer.y = (entityImageSpec.images && entityImageSpec.images[imageKey].y as number) || 0;
                        layerSprites[layer] = layerSprites[layer] || new PIXI.Container();
                        layerSprites[layer].addChild(entityLayer);
                    });
                }
            }
        } else {
            throw 'unknown type ' + entityImageSpec.type;
        }

        forEach(layerSprites, (layerSprite: PIXI.Sprite) => {
            if (entityImageSpec.scale) {
                layerSprite.scale.x = entityImageSpec.scale.x;
                layerSprite.scale.y = entityImageSpec.scale.y;
            }

            if (entityImageSpec.anchor) {
                layerSprite.anchor.x = entityImageSpec.anchor.x;
                layerSprite.anchor.y = entityImageSpec.anchor.y;
            }

            if (entityImageSpec.rotation) {
                layerSprite.anchor.set(0.5, 0.5);
                layerSprite.rotation = entityImageSpec.rotation * Math.PI;
            }

            if (entityImageSpec.alpha) {
                layerSprite.alpha = entityImageSpec.alpha;
            }

            if (entityImageSpec.mask) {
                var color = 0xFF0000;
                var alpha = 0.5;
                if (entitySpec && entitySpec.color) {
                    color = ((entitySpec.color.r * 255) << 16) + ((entitySpec.color.g * 255) << 8) + (entitySpec.color.b * 255);
                    alpha = entitySpec.color.a;
                }
                layerSprite.filters = [new ColorFillShader(color)];
                layerSprite.alpha = alpha;
            }

            if (entity) {
                layerSprite.interactive = true;
                layerSprite.on("mousedown", (e: any) => {
                    e.stopped = true;
                    console.log("sprite mousedown: ", e, entity);
                    this.emit("entityclicked", e, entity);
                })
            }
        });

        return layerSprites;
    }

    private drawLayers(destinationLayers: Dict<PIXI.Container>, sourceLayers: Dict<PIXI.Sprite | PIXI.Graphics>, gridX: number, gridY: number, xOffset: number, yOffset: number) {
        forEach(sourceLayers, (spriteLayer: PIXI.Sprite, layerNumber: string) => {
            spriteLayer.x = gridX * window.FBR_PIXELS_PER_TILE + xOffset;
            spriteLayer.y = gridY * window.FBR_PIXELS_PER_TILE + yOffset;
            destinationLayers[layerNumber] = destinationLayers[layerNumber] || new PIXI.Container();
            destinationLayers[layerNumber].addChild(spriteLayer);
        });
    }

    private createIconSprite(imageSpec: Image) {
        var iconLayers = this.createEntityLayers(imageSpec);
        var darkBackground = new PIXI.Sprite(PIXI.Texture.fromFrame(window.FBR_IMAGES_PREFIX + this.factorioBlueprintReader.ImagesUI.INFO_DARK_BACKGROUND));
        darkBackground.anchor.x = 0.5;
        darkBackground.anchor.y = 0.5;
        iconLayers[this.OVERLAY_LAYER - 10] = darkBackground;

        return iconLayers;
    }

    private renderEntityToLayers(layers: Dict<PIXI.Container>, minXY: number, entity: BlueprintEntity) {
        var spriteLayers: Dict<PIXI.Graphics | PIXI.Sprite> = {};
        var sizeW = 0;
        var sizeH = 0;
        var xOffset = 0;
        var yOffset = 0;
        var entityDrawingSpec = this.getEntityDrawingSpecForEntity(entity);

        if (entityDrawingSpec === null) {
            console.log("Unknown entity name", entity.name);
            var sprite = new PIXI.Graphics();
            sprite.beginFill(0xFFFFFF);
            sprite.lineStyle(1, 0x000000);
            sprite.drawRect(0, 0, window.FBR_PIXELS_PER_TILE, window.FBR_PIXELS_PER_TILE);
            spriteLayers[this.DEFAULT_LAYER] = sprite;
            sizeW = 1;
            sizeH = 1;
            xOffset = 0;
            yOffset = 0;
        } else if (entityDrawingSpec.gridSize && entityDrawingSpec.offset) {
            spriteLayers = this.createEntityLayers(entityDrawingSpec.image as Image, entity);
            sizeW = entityDrawingSpec.gridSize.w;
            sizeH = entityDrawingSpec.gridSize.h;
            xOffset = entityDrawingSpec.offset.x;
            yOffset = entityDrawingSpec.offset.y;
        }

        var gridX = Math.floor(entity.position.x - minXY - sizeW / 2);
        var gridY = Math.floor(entity.position.y - minXY - sizeH / 2);
        this.drawLayers(layers, spriteLayers, gridX, gridY, xOffset, yOffset);


        if (entity.recipe) {
            if (!this.factorioBlueprintReader.icons[entity.recipe]) {
                console.log('Can\'t find icon for recipe', entity.recipe);
            } else {
                var iconLayers = this.createIconSprite(this.factorioBlueprintReader.icons[entity.recipe].image as Image);
                xOffset = (sizeW * window.FBR_PIXELS_PER_TILE) / 2;
                yOffset = (sizeH * window.FBR_PIXELS_PER_TILE) / 2;
                this.drawLayers(layers, iconLayers, gridX, gridY, xOffset, yOffset);
            }
        }

        if (entity.items) {
            var itemCount = 0;
            forEach(entity.items, (entityItem) => {
                // apparently items can be an array or an object
                // i.e. either [{name: 'blabla', count:5}] or just {blabla:5}
                itemCount += entityItem.count; // ? entityItem.count : entityItem; // check again
            });
            var startX = (sizeW * window.FBR_PIXELS_PER_TILE - itemCount * this.factorioBlueprintReader.iconSize / 2) / 2;
            // add another half of icon size (which is uses scale 0.5, so a quarter of size) due to anchor being 0.5
            startX += this.factorioBlueprintReader.iconSize / 4;
            var itemNumber = 0;
            forEach(entity.items, (entityItem, itemName: string) => {
                // apparently items can be an array or an object
                // i.e. either [{name: 'blabla', count:5}] or just {blabla:5}
                var count = entityItem.count; // check again
                if (entityItem.item) {
                    itemName = entityItem.item;
                    count = entityItem.count;
                }
                for (var k = 0; k < count; k++) {
                    if (!this.factorioBlueprintReader.icons[itemName]) {
                        console.log('Can\'t find icon for item', itemName);
                    } else {
                        var iconLayers = this.createIconSprite(this.factorioBlueprintReader.icons[itemName].image as Image);
                        forEach(iconLayers, (layerContainer: PIXI.Container) => {
                            layerContainer.scale.x = layerContainer.scale.y = 0.5;
                        });
                        xOffset = startX + this.factorioBlueprintReader.iconSize / 2 * itemNumber;
                        yOffset = (sizeH * window.FBR_PIXELS_PER_TILE) / 2 + this.factorioBlueprintReader.iconSize;
                        this.drawLayers(layers, iconLayers, gridX, gridY, xOffset, yOffset);
                    }
                    itemNumber++;
                }
            });
        }

        var filters: (EntityFilter | EntityRequestFilter)[] = [];
        if (entity.filters) {
            filters = entity.filters;
        } else if (entity.request_filters) {
            filters = entity.request_filters;
        }

        var filterItemNumber = 0;

        forEach(filters, (filterItem: EntityFilter | EntityRequestFilter) => {
            if (!this.factorioBlueprintReader.icons[filterItem.name]) {
                console.log('Can\'t find icon for item', filterItem.name);
            } else {
                var iconLayers = this.createIconSprite(this.factorioBlueprintReader.icons[filterItem.name].image as Image);
                forEach(iconLayers, (layerContainer: PIXI.Container) => {
                    layerContainer.scale.x = layerContainer.scale.y = 0.4;
                });
                xOffset = (filterItemNumber % 2 == 0 ? 0 : 16) + (this.factorioBlueprintReader.iconSize * 0.2);
                yOffset = (Math.floor(filterItemNumber % 4 / 2) * 16) + (this.factorioBlueprintReader.iconSize * 0.2);
                this.drawLayers(layers, iconLayers, gridX, gridY, xOffset, yOffset);
                // if there's more than 4, cycle between them every 2 seconds; also hide if alt is pressed
                var everyNSeconds = 5;
                var currentFilterItemNumber = filterItemNumber;
                this.animationHandler.addOnSecondTickListener((second) => {
                    forEach(iconLayers, (layerContainer: PIXI.Container) => {
                        var altPressed = this.keyboardHandler.isPressed(this.keyboardHandler.keys.alt);
                        layerContainer.visible = (!altPressed) && Math.floor(second / everyNSeconds) % (Math.ceil(filters.length / 4)) == Math.floor(currentFilterItemNumber / 4);
                    });
                });
            }
            filterItemNumber++;
        });

    }

    renderBlueprint(/*pixiRenderer: any, stage: any,*/ blueprintData: BlueprintBookEntry) {
        var entities = blueprintData.blueprint.entities || [];
        var tiles = blueprintData.blueprint.tiles || [];

        var minXY = 0;
        var maxXY = 0;

        forEach(tiles, (entity) => {
            var x = entity.position.x;
            var y = entity.position.y;
            minXY = Math.min(minXY, x, y);
            maxXY = Math.max(maxXY, x, y);
        });

        var entitiesByYX: {[y:string]: (number[])[]} = {}; // ahem...
        var allYCoordinates: number[] = [];
        forEach(entities, (entity: BlueprintEntity, key: number) => {
            // check again, apparently it's always a number already
            var x = entity.position.x; //parseInt(entity.position.x);
            var y = entity.position.y; //parseInt(entity.position.y);

            entitiesByYX[y] = entitiesByYX[y] || {};
            entitiesByYX[y][x] = entitiesByYX[y][x] || [];
            entitiesByYX[y][x].push(key);

            if (allYCoordinates.indexOf(y) === -1) {
                allYCoordinates.push(y);
            }

            minXY = Math.min(minXY, x, y);
            maxXY = Math.max(maxXY, x, y);
        });
        allYCoordinates.sort((a: number, b: number) => {
            return a - b;
        });

        minXY -= 5;
        maxXY += 5;

        var sizeXY = maxXY - minXY;
        var minScale = Math.min(1, window.FBR_CANVAS_WIDTH / (sizeXY * window.FBR_PIXELS_PER_TILE), window.FBR_CANVAS_HEIGHT / (sizeXY * window.FBR_PIXELS_PER_TILE));

        var blueprintContainer = new PIXI.Container();
        blueprintContainer.scale.x = blueprintContainer.scale.y = minScale;

        var background = new PIXI.extras.TilingSprite(PIXI.Texture.fromFrame(window.FBR_IMAGES_PREFIX + this.factorioBlueprintReader.ImagesUI.BACKGROUND), window.FBR_CANVAS_WIDTH / minScale, window.FBR_CANVAS_HEIGHT / minScale);
        blueprintContainer.addChild(background);

        var isX0InHalfGrid = false;
        var isY0InHalfGrid = false;
        if (entities[0]) {
            var entity = entities[0];
            var xEndsInHalf = entity.position.x - Math.floor(entity.position.x) > 0.4;
            var yEndsInHalf = entity.position.y - Math.floor(entity.position.y) > 0.4;
            var entityDrawingSpec = this.getEntityDrawingSpecForEntity(entity);
            if (entityDrawingSpec) {
                var sizeW = (entityDrawingSpec.gridSize as Size).w;
                var sizeH = (entityDrawingSpec.gridSize as Size).h;
                isX0InHalfGrid = (sizeW % 2 == 0) == xEndsInHalf;
                isY0InHalfGrid = (sizeH % 2 == 0) == yEndsInHalf;
            }
        }

        forEach(tiles, (entity) => {
            var spriteLayers;
            if (this.factorioBlueprintReader.tiles[entity.name]) {
                // overwrite getRandomInt for a moment to make sure tiling stays the same every time
                var prevRandomInt = this.getRandomInt;
                this.getRandomInt = function (min, max) {
                    var number = Math.floor(Math.abs(this.hashTwoIntegers(Math.floor(entity.position.x), Math.floor(entity.position.y))));
                    number = number % (1 + max - min);
                    return number + min;
                };
                spriteLayers = this.createEntityLayers(this.factorioBlueprintReader.tiles[entity.name].image as Image, entity);
                this.getRandomInt = prevRandomInt;
            } else {
                console.log("Unknown tile name", entity.name);
                spriteLayers = new PIXI.Graphics();
                spriteLayers.beginFill(0xFFFFFF);
                spriteLayers.lineStyle(1, 0x333333);
                spriteLayers.drawRect(0, 0, window.FBR_PIXELS_PER_TILE, window.FBR_PIXELS_PER_TILE);
            }
            var gridX = Math.floor(entity.position.x - minXY - (isX0InHalfGrid ? 1 : 0));
            var gridY = Math.floor(entity.position.y - minXY - (isY0InHalfGrid ? 1 : 0));
            forEach(spriteLayers, (sprite: PIXI.Sprite) => {
                sprite.x = gridX * window.FBR_PIXELS_PER_TILE;
                sprite.y = gridY * window.FBR_PIXELS_PER_TILE;
                blueprintContainer.addChild(sprite);
            });
        });

        var layers: Dict<PIXI.Container> = {};

        forEach(allYCoordinates, (y: number) => {
            forEach(entitiesByYX[y], (entitiesForYX: number[]) => {
                forEach(entitiesForYX, (entityKey: number) => {
                    this.renderEntityToLayers(layers, minXY, entities[entityKey]);
                });
            });
        });

        forEach(layers, (layer: PIXI.Container) => {
            if (layer) {
                blueprintContainer.addChild(layer);
            }
        });

        var circuitryLayer = new PIXI.Graphics();
        circuitryLayer.alpha = 0.5;

        const getCircuitXYTargetFromEntity = (entity: BlueprintEntity, circuitId: number) => {
            var sizeW = 1;
            var sizeH = 1;
            var entityDrawingSpec = this.getEntityDrawingSpecForEntity(entity);
            if (entityDrawingSpec) {
                sizeW = (entityDrawingSpec.gridSize as Size).w;
                sizeH = (entityDrawingSpec.gridSize as Size).h;
            }
            var gridX = Math.floor(entity.position.x - minXY - sizeW / 2);
            var gridY = Math.floor(entity.position.y - minXY - sizeH / 2);
            var x = gridX * window.FBR_PIXELS_PER_TILE;
            var y = gridY * window.FBR_PIXELS_PER_TILE;


            var xOffset = 16;
            var yOffset = 16;
            if (entityDrawingSpec && entityDrawingSpec.circuitEndpoints && entityDrawingSpec.circuitEndpoints[circuitId]) {
                xOffset = entityDrawingSpec.circuitEndpoints[circuitId].x;
                yOffset = entityDrawingSpec.circuitEndpoints[circuitId].y;
            } else if (entityDrawingSpec) {
                xOffset = window.FBR_PIXELS_PER_TILE * (entityDrawingSpec.gridSize as Size).w / 2;
                yOffset = window.FBR_PIXELS_PER_TILE * (entityDrawingSpec.gridSize as Size).h / 2;
            }

            return {x: x + xOffset, y: y + yOffset};
        }

        const drawCircuitLine = (fromEntityNumber: number, startPosition: Coords, connection: EntityConnection) => {
            var targetEntityId = connection.entity_id;
            if (targetEntityId < fromEntityNumber || (targetEntityId == fromEntityNumber && connection.circuit_id == 1)) {
                return;
            }
            var targetCircuitId = connection.circuit_id || 1;
            var targetEntity = entities[targetEntityId - 1];
            if (targetEntity.entity_number != targetEntityId) {
                console.log("Circuit target entity id conflict", targetEntity.entity_number, targetEntityId);
                return;
            }
            var targetPosition = getCircuitXYTargetFromEntity(targetEntity, targetCircuitId);
            circuitryLayer.moveTo(startPosition.x, startPosition.y);
            circuitryLayer.bezierCurveTo(startPosition.x - 10, startPosition.y + 10, targetPosition.x + 10, targetPosition.y + 10, targetPosition.x, targetPosition.y);
        }

        forEach(entities, (entity) => {
            if (!entity.connections) {
                return;
            }
            var entity_number = entity.entity_number;
            forEach(entity.connections, (connections: EntityConnections, circuitId) => {
                var startPosition = getCircuitXYTargetFromEntity(entity, parseInt(circuitId));
                circuitryLayer.lineStyle(2, 0xff0000);
                forEach(connections.red, (connection) => {
                    drawCircuitLine(entity_number, startPosition, connection);
                });
                circuitryLayer.lineStyle(2, 0x00ff00);
                forEach(connections.green, (connection) => {
                    drawCircuitLine(entity_number, startPosition, connection);
                });
            });
        });

        blueprintContainer.addChild(circuitryLayer);

        return blueprintContainer;
    }
}
