const forEach = require("lodash.foreach");
import * as pako from"pako";

import { icons } from "./factorio/icons";
import { tiles } from "./factorio/tiles";
import createEntitiesFunctions from "./factorio/entities/index";

export interface IFactorioBlueprintReader {
    iconSize:   number;
    icons:      EntityImageMap;
    tiles:      EntityImageMap;
    ImagesUI:   { INFO_DARK_BACKGROUND: string, BACKGROUND: string }
    entities:   { [name: string]: EntityImage };
    createEntitiesFunctions: (() => EntityImageMap)[];
    parse(blueprintString: string): { data: any, version: string }
    stringify(blueprintData: { data: BlueprintData, version: string }): string;
}

export default class FactorioBlueprintReader implements IFactorioBlueprintReader {
    iconSize = 32
    icons = icons;
    tiles = tiles;
    createEntitiesFunctions = createEntitiesFunctions;
    entities: { [name: string]: EntityImage };
    ImagesUI = {
        INFO_DARK_BACKGROUND: "core/entity-info-dark-background.png",
        BACKGROUND:           "background.png"
    };

    loadEntities() {
        this.entities = {};

        this.createEntitiesFunctions.forEach((func) => {
            forEach(func(), (entitySpec: EntityImage, entityKey: string) => {
                this.entities[entityKey] = entitySpec;
            });
        });
    }

    parse(blueprintString: string) {
        var version = blueprintString[0];
        blueprintString = blueprintString.substr(1);
        blueprintString = atob(blueprintString); // base64 decode
        blueprintString = pako.inflate(blueprintString, {to: 'string'});
        var blueprintData: BlueprintData = JSON.parse(blueprintString);
        return { data: blueprintData, version: version };
    }

    stringify(blueprintData: { data: BlueprintData, version: string }) {
        var blueprintString = JSON.stringify(blueprintData);
        blueprintString = pako.deflate(blueprintString, {to: 'string'});
        blueprintString = btoa(blueprintString); // base64 encode
        return blueprintData.version + blueprintString;
    }
}
