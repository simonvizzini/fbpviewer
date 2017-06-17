const forEach = require("lodash.foreach");

import { iconSize, icons } from "./factorio/icons";
import { tiles } from "./factorio/tiles";
import { ImagesUI } from "./factorio/ui";
import { parse, stringify, TEST_CASES } from "./factorio/blueprints";
import createEntitiesFunctions from "./factorio/entities/index";

export interface IFactorioBlueprintReader {
    iconSize:   number;
    icons:      EntityImageMap;
    tiles:      EntityImageMap;
    ImagesUI:   { INFO_DARK_BACKGROUND: string, BACKGROUND: string }
    entities:   { [name: string]: EntityImage };
    TEST_CASES: any;
    createEntitiesFunctions: (() => EntityImageMap)[];
    parse(blueprintString: string): { data: any, version: string }
    stringify(blueprintData: any): string;
}

export class FactorioBlueprintReader implements IFactorioBlueprintReader {
    iconSize = iconSize;
    icons = icons;
    tiles = tiles;
    ImagesUI = ImagesUI;
    parse = parse;
    stringify = stringify;
    TEST_CASES = TEST_CASES;
    createEntitiesFunctions = createEntitiesFunctions;
    entities: { [name: string]: EntityImage };

    loadEntities() {
        this.entities = {};

        this.createEntitiesFunctions.forEach((func) => {
            forEach(func(), (entitySpec: EntityImage, entityKey: string) => {
                this.entities[entityKey] = entitySpec;
            });
        });
    }
}
