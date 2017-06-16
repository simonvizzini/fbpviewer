type ImageType = "sprite" | "trim" | "container" | "animated";

type Image = {
    type:       ImageType;
    path?:      string;
    anchor?:    { x: number, y: number };
    layer?:     number;
    x?:         number;
    y?:         number;
    rotation?:  number;
    number?:    number;
    cols?:      number;
    rows?:      number;
    from?:      number;
    to?:        number;
    scale?:     { x: number, y: number };
    images?:    Image[];
    mask?:      boolean;
    alpha?:     number;
    animationSpeed?: number;
};

type EntityImage = {
    image?:      Image;
    types?:      EntityImageMap;
    directions?: { [dir: number]: EntityImage | {} };
    gridSize?:   { w: number, h: number };
    offset?:     { x: number, y: number };
    circuitEndpoints?: EntityCircuitEndpoints;
}

type EntityImageDirection = {
    directions?: { [dir: number]: EntityImage };
}

type EntityCircuitEndpoints = {
    [num: number]: { x: number, y: number };
}

type EntityImageMap = {
    [name: string]: EntityImage | EntityImageDirection;
}
