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
    [num: number]: Coords;
}

type EntityImageMap = {
    [name: string]: EntityImage;
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
    FBR_REDRAW_FUNC(): void;
    $: JQueryStatic;
    jQuery: JQueryStatic
}
