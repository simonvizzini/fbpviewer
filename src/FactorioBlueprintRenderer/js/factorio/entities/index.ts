
import circuit_network from "./circuit_network/circuit_network";
import belts from "./logistics/belts";
import combinators from "./circuit_network/combinators";
import splitters from "./logistics/splitters";
import underneathies from "./logistics/underneathies";
import mine from "./military/land-mine";
import radar from "./military/radar";
import rocket_silo from "./military/rocket_silo";
import turrets from "./military/turrets";
import walls from "./military/walls";
import nuclear from "./power/nuclear";
import poles from "./power/poles";
import solar from "./power/solar";
import steam from "./power/steam";
import assemblers from "./assemblers";
import chests from "./chests";
import drills from "./drills";
import furnaces from "./furnaces";
import inserters from "./inserters";
import liquid_handling from "./liquid_handling";
import oil_handling from "./oil_handling";
import other_entities from "./other_entities";
import tracks from "./tracks";

const createEntitiesFunctions: (() => EntityImageMap)[] = [
    circuit_network,
    belts,
    combinators,
    splitters,
    underneathies,
    mine,
    radar,
    rocket_silo,
    turrets,
    walls,
    nuclear,
    poles,
    solar,
    steam,
    assemblers,
    chests,
    drills,
    furnaces,
    inserters,
    liquid_handling,
    oil_handling,
    other_entities,
    tracks,
];

export default createEntitiesFunctions;
