type ImageType = "sprite" | "trim" | "container" | "animated" | "random_trim";

type Image = {
    type:       ImageType;
    path?:      string;
    anchor?:    Coords;
    scale?:     Coords;
    x?:         number;
    y?:         number;
    layer?:     number;
    rotation?:  number;
    number?:    number;
    cols?:      number;
    rows?:      number;
    from?:      number;
    to?:        number;
    alpha?:     number;
    animationSpeed?: number;
    images?:    Image[];
    mask?:      boolean;
    reverse?:   boolean; // doesn't seem to be used
};

type EntityImage = {
    image?:      Image;
    types?:      EntityImageMap;
    directions?: { [dir: number]: EntityImage };
    gridSize?:   Size;
    offset?:     Coords;
    circuitEndpoints?: EntityCircuitEndpoints;
}

type EntityImageDirection = {
    directions?: { [dir: number]: EntityImage };
}

type EntityCircuitEndpoints = {
    [num: string]: Coords;
}

type EntityImageMap = {
    [name: string]: EntityImage;
}

type BlueprintIcon = {
    signal: {
        type: string;
        name: string;
    }
    index: number;
}

type EntityFilter = {index: number, name: string}
type EntityRequestFilter = EntityFilter & {count: number}

type EntityControlBehavior = {
    circuit_condition: {
        first_signal: {
            type: string;
            name: string;
        }
        constant: number;
        comparator: string;
    };
    use_colors?: boolean;
}

type EntityConnection = {
    entity_id:   number;
    circuit_id?: number;
}

type EntityConnections = {
    red?:   EntityConnection[]
    green?: EntityConnection[]
}

type BlueprintEntity = {
    name:             string;
    entity_number:    number;
    position:         Coords;
    type?:            string;
    direction?:       number;
    recipe?:          string;
    items?:           {item: string, count: number}[];
    filters?:         EntityFilter[];
    request_filters?: EntityRequestFilter[];
    connections:      {[index: string]: EntityConnections};
    control_behavior?: EntityControlBehavior;
}

// type BlueprintTile = {
//     name:     string;
//     position: Coords;
// }

type Blueprint = {
    item:     string;
    label:    string;
    version:  number;
    icons:    BlueprintIcon[];
    entities: BlueprintEntity[];
    tiles?:   BlueprintEntity[];
}

type BlueprintBookEntry = {
    blueprint: Blueprint;
    index?:    number;
}

type BlueprintData = {
    blueprint_book?: {
        blueprints: BlueprintBookEntry[];
    }
    blueprint?: Blueprint;
}

type Coords = {
    x: number;
    y: number;
}

type Size = {
    w: number;
    h: number;
}

type Dict<T> = {
    [key: string]: T;
}

interface Window {
    FBR_IMAGES_PREFIX: string;
    FBR_PIXELS_PER_TILE: number;
    Hammer: HammerStatic;
    FBR_CANVAS_WIDTH: number;
    FBR_CANVAS_HEIGHT: number;
    FBR_INITIAL_BLUEPRINT: string;
    $: JQueryStatic;
    jQuery: JQueryStatic
}
