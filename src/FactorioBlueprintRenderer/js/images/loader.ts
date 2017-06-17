import forEach = require("lodash.foreach");
import merge = require("lodash.merge");
import includes = require("lodash.includes");
import * as PIXI from "pixi.js";

import { IFactorioBlueprintReader } from "../factorioBlueprintReader";

const FBR_IMAGES_PREFIX = (window as any)["FBR_IMAGES_PREFIX"];

export default class Loader {
    constructor(private factorioBlueprintReader: IFactorioBlueprintReader) {
    }

    _prepareTrimmedTexture(imagePath: string, rows: number, cols: number, number: number) {
        if (PIXI.utils.TextureCache[imagePath + "." + number]) {
            return;
        }

        var textureWidth = PIXI.utils.TextureCache[imagePath].frame.width;
        var textureHeight = PIXI.utils.TextureCache[imagePath].frame.height;
        var w = textureWidth / cols;
        var h = textureHeight / rows;
        var row = Math.floor(number / cols);
        var col = number % cols;

        var rect = new PIXI.Rectangle(w * col, h * row, w, h);
        PIXI.utils.TextureCache[imagePath + "." + number] = new PIXI.Texture(PIXI.utils.TextureCache[imagePath].baseTexture, rect, rect.clone());
    }

    _prepareTrimmedTexturesFromImageData(imageData: Image) {
        var imagePath = FBR_IMAGES_PREFIX + imageData.path;
        if (imageData.type == 'trim' && imageData.rows && imageData.cols && imageData.number) { // todo: there is a TS feature that can handle this... have to find out which
            this._prepareTrimmedTexture(imagePath, imageData.rows, imageData.cols, imageData.number);
        } else if (imageData.type == 'animated' || imageData.type == 'random_trim') { // todo
            for (var k = imageData.from as number; k <= (imageData.to as number); k++) {
                this._prepareTrimmedTexture(imagePath, imageData.rows as number, imageData.cols as number, k);
            }
        }
    }

    _prepareTrimmedTexturesFromEntityData(/*entityKey: string,*/ entityData: EntityImage) {
        if (entityData.image && entityData.image.path) {
            this._prepareTrimmedTexturesFromImageData(entityData.image);
        } else if (entityData.image && entityData.image.type == 'container') {
            forEach(entityData.image.images, (imageData) => {
                this._prepareTrimmedTexturesFromImageData(imageData);
            });
        }
    }

    prepareTrimmedTextures() {
        var prepareTrimmedTexturesHelper = (entityData: EntityImage, entityKey: string) => {
            if (entityData.types) {
                forEach(entityData.types, function(typeSpecificEntityData) {
                    prepareTrimmedTexturesHelper(typeSpecificEntityData, entityKey);
                });

                return;
            }
            if (entityData.directions) {
                forEach(entityData.directions, (directionSpecificEntityData: EntityImage) => {
                    var combinedEntityData = merge({}, entityData, directionSpecificEntityData);
                    this._prepareTrimmedTexturesFromEntityData(combinedEntityData);
                })
            }
            this._prepareTrimmedTexturesFromEntityData(entityData);
        };

        forEach(this.factorioBlueprintReader.entities, prepareTrimmedTexturesHelper);

        forEach(this.factorioBlueprintReader.tiles, (entityData) => {
            this._prepareTrimmedTexturesFromEntityData(entityData);
        });
    }

    getImagesToLoad() {
        var imagesToLoad: string[] = [];

        function addEntityImageToLoader(entityData: EntityImage) {
            if (entityData.image && entityData.image.path) { // todo
                var fullPath = FBR_IMAGES_PREFIX + entityData.image.path;
                if (!includes(imagesToLoad, fullPath)) {
                    imagesToLoad.push(fullPath);
                }
            } else if (entityData.image && entityData.image.type == 'container') { // todo
                forEach(entityData.image.images, (imageData) => {
                    var imageFullPath = FBR_IMAGES_PREFIX + imageData.path;
                    if (!includes(imagesToLoad, imageFullPath)) {
                        imagesToLoad.push(imageFullPath);
                    }
                });
            }
        }

        forEach(this.factorioBlueprintReader.icons, (iconData) => {
            if (iconData.image) {
                addEntityImageToLoader(iconData);
            }
        });

        forEach(this.factorioBlueprintReader.entities, (entityData) => {
            if (entityData.types) {
                forEach(entityData.types, (typeSpecificEntityData) => {
                    if (typeSpecificEntityData.directions) {
                        forEach(typeSpecificEntityData.directions, (directionSpecificEntityData) => {
                            var combinedEntityData = merge({}, typeSpecificEntityData, directionSpecificEntityData);
                            addEntityImageToLoader(combinedEntityData);
                        })
                    }

                    if (typeSpecificEntityData.image) {
                        addEntityImageToLoader(typeSpecificEntityData);
                    }
                });
            } else {
                if (entityData.directions) {
                    forEach(entityData.directions, (directionSpecificEntityData) => {
                        var combinedEntityData = merge({}, entityData, directionSpecificEntityData);
                        addEntityImageToLoader(combinedEntityData);
                    })
                }

                if (entityData.image) {
                    addEntityImageToLoader(entityData);
                }
            }
        });

        forEach(this.factorioBlueprintReader.tiles, (entityData) => {
            addEntityImageToLoader(entityData);
        });

        forEach(this.factorioBlueprintReader.ImagesUI, (imageUiPath) => {
           imagesToLoad.push(FBR_IMAGES_PREFIX + imageUiPath);
        });

        return imagesToLoad;
    }
}
