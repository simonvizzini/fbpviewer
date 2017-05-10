var FactorioBlueprintReader = FactorioBlueprintReader || {};

FactorioBlueprintReader.icons = {
    prefix: "icons/",
    ICONS:  {
        "accumulator":                       "accumulator.png",
        "advanced-circuit":                  "advanced-circuit.png",
        "arithmetic-combinator":             "arithmetic-combinator.png",
        "assembling-machine-1":              "assembling-machine-1.png",
        "assembling-machine-2":              "assembling-machine-2.png",
        "assembling-machine-3":              "assembling-machine-3.png",
        "atomic-bomb":                       "atomic-bomb.png",
        "battery":                           "battery.png",
        "battery-equipment":                 "battery-equipment.png",
        "battery-mk2-equipment":             "battery-mk2-equipment.png",
        "beacon":                            "beacon.png",
        "big-electric-pole":                 "big-electric-pole.png",
        "boiler":                            "boiler.png",
        "burner-inserter":                   "burner-inserter.png",
        "burner-mining-drill":               "burner-mining-drill.png",
        "cannon-shell":                      "cannon-shell.png",
        "car":                               "car.png",
        "cargo-wagon":                       "cargo-wagon.png",
        "centrifuge":                        "centrifuge.png",
        "chemical-plant":                    "chemical-plant.png",
        "cluster-grenade":                   "cluster-grenade.png",
        "coal":                              "coal-dark-background.png",
        "combat-shotgun":                    "combat-shotgun.png",
        "concrete":                          "concrete.png",
        "constant-combinator":               "constant-combinator.png",
        "construction-robot":                "construction-robot.png",
        "copper-cable":                      "copper-cable.png",
        "copper-ore":                        "copper-ore.png",
        "copper-plate":                      "copper-plate.png",
        "decider-combinator":                "decider-combinator.png",
        "defender-capsule":                  "defender-capsule.png",
        "destroyer-capsule":                 "destroyer-capsule.png",
        "diesel-locomotive":                 "diesel-locomotive.png",
        "distractor-capsule":                "distractor-capsule.png",
        "effectivity-module":                "effectivity-module.png",
        "effectivity-module-2":              "effectivity-module-2.png",
        "effectivity-module-3":              "effectivity-module-3.png",
        "electric-engine-unit":              "electric-engine-unit.png",
        "electric-furnace":                  "electric-furnace.png",
        "electring-mining-drill":            "electric-mining-drill.png",
        "electronic-circuit":                "electronic-circuit.png",
        "energy-shield-equipment":           "energy-shield-equipment.png",
        "energy-shield-mk2-equipment":       "energy-shield-mk2-equipment.png",
        "engine-unit":                       "engine-unit.png",
        "exoskeleton-equipment":             "exoskeleton-equipment.png",
        "explosive-cannon-shell":            "explosive-cannon-shell.png",
        "explosive-rocket":                  "explosive-rocket.png",
        "explosives":                        "explosives.png",
        "explosive-uranium-cannon-shell":    "explosive-uranium-cannon-shell.png",
        "express-splitter":                  "express-splitter.png",
        "express-transport-belt":            "express-transport-belt.png",
        "express-underground-belt":          "express-underground-belt.png",
        "fast-inserter":                     "fast-inserter.png",
        "fast-splitter":                     "fast-splitter.png",
        "fast-transport-belt":               "fast-transport-belt.png",
        "fast-underground-belt":             "fast-underground-belt.png",
        "filter-inserter":                   "filter-inserter.png",
        "firearm-magazine":                  "firearm-magazine.png",
        "flamethrower":                      "flamethrower.png",
        "flamethrower-ammo":                 "flamethrower-ammo.png",
        "flamethrower-turret":               "flamethrower-turret.png",
        "fluid-wagon":                       "fluid-wagon.png",
        "flying-robot-frame":                "flying-robot-frame.png",
        "fusion-reactor-equipment":          "fusion-reactor-equipment.png",
        "gate":                              "gate.png",
        "high-tech-science-pack":            "high-tech-science-pack.png",
        "inserter":                          "inserter.png",
        "iron-axe":                          "iron-axe.png",
        "iron-chest":                        "iron-chest.png",
        "iron-gear-wheel":                   "iron-gear-wheel.png",
        "iron-ore":                          "iron-ore.png",
        "iron-plate":                        "iron-plate.png",
        "iron-stick":                        "iron-stick.png",
        "lab":                               "lab.png",
        "land-mine":                         "land-mine.png",
        "laser-turret":                      "laser-turret.png",
        "light-armor":                       "light-armor.png",
        "logistic-chest-active-provider":    "logistic-chest-active-provider.png",
        "logistic-chest-passive-provider":   "logistic-chest-passive-provider.png",
        "logistic-chest-requester":          "logistic-chest-requester.png",
        "logistic-chest-storage":            "logistic-chest-storage.png",
        "logistic-robot":                    "logistic-robot.png",
        "long-handed-inserter":              "long-handed-inserter.png",
        "medium-electric-pole":              "medium-electric-pole.png",
        "military-science-pack":             "military-science-pack.png",
        "modular-armor":                     "modular-armor.png",
        "night-vision-equipment":            "night-vision-equipment.png",
        "nuclear-reactor":                   "nuclear-reactor.png",
        "offshore-pump":                     "offshore-pump.png",
        "oil-refinery":                      "oil-refinery.png",
        "personal-laser-defense-equipoment": "personal-laser-defense-equipment.png",
        "personal-roboport-equipment":       "personal-roboport-equipment.png",
        "personal-roboport-mk2-equipment":   "personal-roboport-mk2-equipment.png",
        "piercing-rounds-magazine":          "piercing-rounds-magazine.png",
        "piercing-shotgun-shell":            "piercing-shotgun-shell.png",
        "pipe":                              "pipe.png",
        "pipe-to-ground":                    "pipe-to-ground.png",
        "pistol":                            "pistol.png",
        "plastic-bar":                       "plastic-bar.png",
        "poison-capsule":                    "poison-capsule.png",
        "power-armor":                       "power-armor.png",
        "power-armor-mk2":                   "power-armor-mk2.png",
        "power-switch":                      "power-switch.png",
        "processing-unit":                   "processing-unit.png",
        "production-science-pack":           "production-science-pack.png",
        "productivity-module":               "productivity-module.png",
        "productivity-module-2":             "productivity-module-2.png",
        "productivity-module-3":             "productivity-module-3.png",
        "programmable-speaker":              "programmable-speaker.png",
        "pump":                              "pump.png",
        "pumpjack":                          "pumpjack.png",
        "radar":                             "radar.png",
        "rail":                              "rail.png",
        "rail-chain-signal":                 "rail-chain-signal.png",
        "rail-signal":                       "rail-signal.png",
        "raw-wood":                          "raw-wood.png",
        "red-wire":                          "red-wire.png",
        "repair-pack":                       "repair-pack.png",
        "roboport":                          "roboport.png",
        "rocket":                            "rocket.png",
        "rocket-control-unit":               "rocket-control-unit.png",
        "rocket-fuel":                       "rocket-fuel.png",
        "rocket-launcher":                   "rocket-launcher.png",
        "rocket-part":                       "rocket-part.png",
        "rocket-silo":                       "rocket-silo.png",
        "rocket-structure":                  "rocket-structure.png",
        "science-pack-1":                    "science-pack-1.png",
        "science-pack-2":                    "science-pack-2.png",
        "science-pack-3":                    "science-pack-3.png",
        "shotgun":                           "shotgun.png",
        "shotgun-shell":                     "shotgun-shell.png",
        "slowdown-capsule":                  "slowdown-capsule.png",
        "small-electric-pole":               "small-electric-pole.png",
        "small-lamp":                        "small-lamp.png",
        "solar-panel":                       "solar-panel.png",
        "solar-panel-equipment":             "solar-panel-equipment.png",
        "solid-fuel":                        "solid-fuel.png",
        "solid-fuel-from-heavy-oil":         "solid-fuel-from-heavy-oil.png",
        "solid-fuel-from-light-oil":         "solid-fuel-from-light-oil.png",
        "solid-fuel-from-petroleum-gas":     "solid-fuel-from-petroleum-gas.png",
        "space-science-pack":                "space-science-pack.png",
        "speed-module":                      "speed-module.png",
        "speed-module-2":                    "speed-module-2.png",
        "speed-module-3":                    "speed-module-3.png",
        "splitter":                          "splitter.png",
        "stack-filter-inserter":             "stack-filter-inserter.png",
        "stack-inserter":                    "stack-inserter.png",
        "steam-engine":                      "steam-engine.png",
        "steam-turbine":                     "steam-turbine.png",
        "steel-axe":                         "steel-axe.png",
        "steel-chest":                       "steel-chest.png",
        "steel-furnace":                     "steel-furnace.png",
        "steel-plate":                       "steel-plate.png",
        "stone":                             "stone.png",
        "stone-brick":                       "stone-brick.png",
        "stone-furnace":                     "stone-furnace.png",
        "stone-wall":                        "stone-wall.png",
        "storage-tank":                      "storage-tank.png",
        "submachine-gun":                    "submachine-gun.png",
        "substation":                        "substation.png",
        "sulfur":                            "sulfur.png",
        "tank":                              "tank.png",
        "train-stop":                        "train-stop.png",
        "transport-belt":                    "transport-belt.png",
        "underground-belt":                  "underground-belt.png",
        "uranium-235":                       "uranium-235.png",
        "uranium-238":                       "uranium-238.png",
        "uranium-cannon-shell":              "uranium-cannon-shell.png",
        "uranium-fuel-cell":                 "uranium-fuel-cell.png",
        "uranium-ore":                       "uranium-ore.png",
        "uranium-processing":                "uranium-processing.png",
        "uranium-rounds-magazine":           "uranium-rounds-magazine.png",
        "used-up-uranium-fuel-cell":         "used-up-uranium-fuel-cell.png",
        "wood":                              "wood.png",
        "wooden-chest":                      "wooden-chest.png",

        "advanced-oil-processing": "fluid/advanced-oil-processing.png",
        "basic-oil-processing":    "fluid/basic-oil-processing.png",
        "coal-liquefaction":       "fluid/coal-liquefaction.png",
        "crude-oil":               "fluid/crude-oil.png",
        "heavy-oil":               "fluid/heavy-oil.png",
        "heavy-oil-cracking":      "fluid/heavy-oil-cracking.png",
        "light-oil":               "fluid/light-oil.png",
        "light-oil-cracking":      "fluid/light-oil-cracking.png",
        "lubricant":               "fluid/lubricant.png",
        "petroleum-gas":           "fluid/petroleum-gas.png",
        "sulfuric-acid":           "fluid/sulfuric-acid.png",
        "water":                   "fluid/water.png",
        "barrel-empty":            "fluid/barreling/barrel-empty.png",
        "barrel-fill":             "fluid/barreling/barrel-fill.png",
        "empty-barrel":            "fluid/barreling/empty-barrel.png",

        "shape_square":      "signal/shape_square.png",
        "signal_0":          "signal/signal_0.png",
        "signal_1":          "signal/signal_1.png",
        "signal_2":          "signal/signal_2.png",
        "signal_3":          "signal/signal_3.png",
        "signal_4":          "signal/signal_4.png",
        "signal_5":          "signal/signal_5.png",
        "signal_6":          "signal/signal_6.png",
        "signal_7":          "signal/signal_7.png",
        "signal_8":          "signal/signal_8.png",
        "signal_9":          "signal/signal_9.png",
        "signal_A":          "signal/signal_A.png",
        "signal_anything":   "signal/signal_anything.png",
        "signal_B":          "signal/signal_B.png",
        "signal_black":      "signal/signal_black.png",
        "signal_blue":       "signal/signal_blue.png",
        "signal_C":          "signal/signal_C.png",
        "signal_cyan":       "signal/signal_cyan.png",
        "signal_D":          "signal/signal_D.png",
        "signal_E":          "signal/signal_E.png",
        "signal_each":       "signal/signal_each.png",
        "signal_everything": "signal/signal_everything.png",
        "signal_F":          "signal/signal_F.png",
        "signal_G":          "signal/signal_G.png",
        "signal_green":      "signal/signal_green.png",
        "signal_grey":       "signal/signal_grey.png",
        "signal_H":          "signal/signal_H.png",
        "signal_I":          "signal/signal_I.png",
        "signal_J":          "signal/signal_J.png",
        "signal_K":          "signal/signal_K.png",
        "signal_L":          "signal/signal_L.png",
        "signal_M":          "signal/signal_M.png",
        "signal_N":          "signal/signal_N.png",
        "signal_O":          "signal/signal_O.png",
        "signal_P":          "signal/signal_P.png",
        "signal_pink":       "signal/signal_pink.png",
        "signal_Q":          "signal/signal_Q.png",
        "signal_R":          "signal/signal_R.png",
        "signal_red":        "signal/signal_red.png",
        "signal_S":          "signal/signal_S.png",
        "signal_T":          "signal/signal_T.png",
        "signal_U":          "signal/signal_U.png",
        "signal_V":          "signal/signal_V.png",
        "signal_W":          "signal/signal_W.png",
        "signal_white":      "signal/signal_white.png",
        "signal_X":          "signal/signal_X.png",
        "signal_Y":          "signal/signal_Y.png",
        "signal_yellow":     "signal/signal_yellow.png",
        "signal_Z":          "signal/signal_Z.png"
    }
};