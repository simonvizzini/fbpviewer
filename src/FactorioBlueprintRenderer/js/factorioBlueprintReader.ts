const forEach = require("lodash.foreach");

import { iconSize, icons } from "./factorio/icons";
import { tiles } from "./factorio/tiles";
import { ImagesUI } from "./factorio/ui";
import { parse, stringify, TEST_CASES } from "./factorio/blueprints";
import createEntitiesFunctions from "./factorio/entities/index";

export class FactorioBlueprintReader {
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
