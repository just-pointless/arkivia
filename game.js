const VERSION = "0.28"

const gameTitleElement = document.getElementById("game-title")
gameTitleElement.textContent = `Arkivia v${VERSION}`

let money = 0
let time = 420
let oldScene = ""
let currentScene = ""
let sceneText = ""
let prependText = ""
let currentPrependText = ""
let region = "Unknown"
let health = 10
let xp = 0
let playerTitle = "Unknown"
let travelStatus = {
    "destination": null,
    "distance": 0,
    "completed": 0,
    "backwards": false
}
let battleStats = {
    "str": 1,
    "def": 1,
    "spd": 1,
    "dex": 1
}
let combatStatus = {
    "enemy": null,
    "enemyHealth": 0,
    "enemyMaxHealth": 0,
    "enemyStats": {
        "str": 0,
        "def": 0,
        "spd": 0,
        "dex": 0
    },
    "enemyProperties": [],
    "enemyEffects": {}
}
let checks = {}
let dailyChecks = {}
let logAutoScroll = true
let skills = {}
let inventory = {}
let inventoryNonStackable = {}
let inventoryNonStackableIncrement = 0
let storage = {}
let storageNonStackable = {}
let storageAccess = false
let inventoryWeight = 0
let energy = 100
let noSleepTime = 0
let potionCooldown = 0
let effects = {}
let quests = {}
let questProgression = {}
let completedQuests = []
let stats = {
    "playtime": 0,
    "gametime": 0
}
let shopStorage = {}
let knownRecipes = ["strawBasket", "woodenSpear"]
let craftStatus = {
    "recipe": null,
    "goal": 0,
    "completed": 0,
    "required": {},
    "using": [],
    "selected": null,
    "skillXp": 0,
}
let team = "none"
let equipment = {
    "weapon": null,
    "tool": null,
    "head": null,
    "chest": null,
    "arms": null,
    "legs": null,
    "accessory1": null,
    "accessory2": null
}
let exploreStatus = {
    "area": null,
    "goal": 0,
    "completed": 0
}
let processStatus = {
    "type": null,
    "area": null,
    "goal": 0,
    "completed": 0
}
let saveEnabled = true
let craftingSelection = false
let titleScores = {}
let arenaData = {}
let debugEnabled = false
let discardMode = false
let totalSkillLevel = 0

const linkRegex = new RegExp(/\{([^|{}]+)\|([^|{}]+)\|?([^|{}]+)?\|?([^|{}(]+)?\(?([^(){}|]+)?\)?}/g)
const textSplitter = new RegExp(/{[^}]{1,}}/g)
const imageRegex = new RegExp(/!\[(.*?)\]/g)
const enemyData = {
    "strawDummy": {
        "name": "Straw Dummy",
        "health": [40, 50],
        "str": 0,
        "def": [2.5, 3],
        "spd": 0,
        "dex": 0,
        "loot": [
            {"item": "straw", "chances": {
                0: 40,
                1: 50,
                2: 10
            }}
        ],
        "xp": [3, 5]
    },
    "mouse": {
        "name": "Mouse",
        "health": [12, 18],
        "str": [0.15, 0.2],
        "def": [0.2, 0.3],
        "spd": [1.5, 2],
        "dex": [1.5, 2],
        "xp": [3, 5]
    },
    "strawGolem": {
        "name": "Straw Golem",
        "health": 150,
        "str": 1,
        "def": 2,
        "spd": 1,
        "dex": 0.5,
        "loot": [
            {"item": "straw", "chances": {
                1: 25,
                2: 25,
                3: 25,
                4: 25,
            }}
        ],
        "xp": 20
    },
    "woodGolem": {
        "name": "Wood Golem",
        "health": 400,
        "str": 10,
        "def": 10,
        "spd": 5,
        "dex": 2,
        "xp": 60
    },
    "stoneGolem": {
        "name": "Stone Golem",
        "health": 800,
        "str": 40,
        "def": 40,
        "spd": 20,
        "dex": 5,
        "xp": 100
    },
    "coalGolem": {
        "name": "Coal Golem",
        "health": 800,
        "str": 100,
        "def": 100,
        "spd": 50,
        "dex": 30,
        "xp": 150
    },
    "human": {
        "name": "Human"
    },
    "greenSlime": {
        "name": "Green Slime",
        "health": [50, 100],
        "str": [4, 6],
        "def": [1, 2],
        "spd": [2, 3],
        "dex": [3, 4],
        "loot": [
            {"item": "slime", "chances": {
                0: 40,
                1: 50,
                2: 10
            }}
        ],
        "xp": [7, 10],
        "damageModifiers": {
            "unarmed": 0.5,
            "club": 0.5,
            "sword": 1.5
        }
    },
    "blueSlime": {
        "name": "Blue Slime",
        "health": [80, 140],
        "str": [5, 7],
        "def": [1.5, 2.5],
        "spd": [3, 4],
        "dex": [5, 6],
        "loot": [
            {"item": "slime", "chances": {
                0: 20,
                1: 60,
                2: 10,
                3: 10
            }}
        ],
        "xp": [10, 12],
        "damageModifiers": {
            "unarmed": 0.5,
            "club": 0.5,
            "sword": 1.5
        }
    },
    "purpleSlime": {
        "name": "Purple Slime",
        "health": [150, 200],
        "str": [9, 12],
        "def": [4, 6],
        "spd": [5, 7],
        "dex": [7, 9],
        "loot": [
            {"item": "slime", "chances": {
                1: 50,
                2: 30,
                3: 20
            }}
        ],
        "xp": [15, 20],
        "damageModifiers": {
            "unarmed": 0.5,
            "club": 0.5,
            "sword": 1.5
        }
    },
    "lizard": {
        "name": "Lizard",
        "health": [100, 150],
        "str": [4, 5],
        "def": [2, 3],
        "spd": [4, 5],
        "dex": [6, 8],
        "xp": [10, 13]
    },
    "spider": {
        "name": "Spider",
        "health": [80, 110],
        "str": [6, 7],
        "def": [2, 3],
        "spd": [7, 8],
        "dex": [3, 5],
        "xp": [10, 13]
    },
    "venomousSpider": {
        "name": "Venomous Spider",
        "health": [200, 250],
        "str": [6, 7],
        "def": [2, 3],
        "spd": [7, 8],
        "dex": [3, 5],
        "xp": [15, 20],
        "attackExecute": function(dmg) {
            if (dmg > 0) {
                if (Math.random() <= 0.3) {
                    changeEffect("poison", 4, false, {"change": 0.8, "dmg": dmg / 2})
                    insertLog(colorGen(effectData['poison']['color'], `You are poisoned`))
                }
            }
        }
    },
    "death": {
        "name": "Death",
        "health": 1e6,
        "str": 1e12,
        "def": 1e12,
        "spd": 1e12,
        "dex": 1e12,
        "attackExecute": function() {
            insertLog(colorGen("#bb7777", "You aren't supposed to get this far..."))
        }
    },
    "bat": {
        "name": "Bat",
        "health": [100, 150],
        "str": [10, 15],
        "def": [5, 8],
        "spd": [20, 25],
        "dex": [25, 30],
        "xp": [10, 13]
    },
    "wildAnimal": {
        "name": "Wild Animal"
    }
}
const skillData = {
    "walking": {
        "name": "Walking",
        "desc": "Allows you to travel faster while walking",
        "scaling": 1.3,
        "levelExec": function(level) {
            updateArrival()
        }
    },
    "fighting": {
        "name": "Fighting",
        "desc": "Slightly increases damage dealt",
        "scaling": 1.3
    },
    "training": {
        "name": "Training",
        "desc": "Increases stat gains from training",
        "scaling": 1.2
    },
    "crafting": {
        "name": "Crafting",
        "desc": "Increases crafting speed",
        "scaling": 1.2,
        "levelExec": function(level) {
            updateArrival("craft")
        }
    },
    "exploration": {
        "name": "Exploration",
        "desc": "Increases speed of exploring",
        "scaling": 1.3
    },
    "unarmedMastery": {
        "name": "Unarmed Mastery",
        "shortName": "Unarmed M",
        "desc": "Increases damage dealt when unarmed",
        "scaling": 1.3,
    },
    "clubMastery": {
        "name": "Club Mastery",
        "shortName": "Club M",
        "desc": "Increases damage dealt with clubbing weapons",
        "scaling": 1.3,
    },
    "spearMastery": {
        "name": "Spear Mastery",
        "shortName": "Spear M",
        "desc": "Increases damage dealt with spear weapons",
        "scaling": 1.3,
    },
    "knifeMastery": {
        "name": "Knife Mastery",
        "shortName": "Knife M",
        "desc": "Increases damage dealt with knife weapons",
        "scaling": 1.3,
    },
    "swordMastery": {
        "name": "Sword Mastery",
        "shortName": "Sword M",
        "desc": "Increases damage dealt with sword weapons",
        "scaling": 1.3,
    },
    "alchemy": {
        "name": "Alchemy",
        "desc": "Increases speed of alchemy and unlocks more recipes",
        "scaling": 1.2,
        "levelExec": function(level) {
            updateArrival("craft")
            if (level >= 2) {
                discoverRecipe("smallHealthPotion")
                discoverRecipe("smallStrengthPotion")
            }
            if (level >= 5) {
                discoverRecipe("smallExercisePotion")
            }
        }
    },
    "mining": {
        "name": "Mining",
        "desc": "Increases speed of mining",
        "scaling": 1.3
    },
    "felling": {
        "name": "Felling",
        "desc": "Increases speed of chopping down trees",
        "scaling": 1.3
    },
    "sleeping": {
        "name": "Sleeping",
        "desc": "Increases energy regeneration while sleeping",
        "scaling": 1.3
    },
    "hunting": {
        "name": "Hunting",
        "desc": "Increases speed of hunting",
        "scaling": 1.3
    }
}
const itemClasses = {
    "misc": "#cccccc",
    "consumable": "#ffcc22",
    "gear": "#ff8888",
    "tool": "#00bb66"
}
const itemData = {
    "straw": {
        "name": "Strand of Straw",
        "desc": "A strand of straw that came from a training dummy",
        "class": "misc",
        "weight": 0.5,
        "obtainExecute": function() {
            if (inventory['straw'] >= 25) {
                discoverRecipe("strawPendant")
                discoverRecipe("strawHelmet")
                discoverRecipe("strawChestplate")
                discoverRecipe("strawBracers")
                discoverRecipe("strawLeggings")
            }
        }
    },
    "exercisePill": {
        "name": "Exercise Pill",
        "desc": "Increases stat gain from training by 50% for one hour (stackable)",
        "class": "consumable",
        "weight": 1,
        "execute": function() {
            changeEffect("exercisePill", 60)
        }
    },
    "strawBasket": {
        "name": "Straw Basket",
        "desc": "A small basket made of straw",
        "class": "misc",
        "weight": 10,
        "crafting": {
            "complexity": 60,
            "materials": {
                "straw": 20
            }
        }
    },
    "woodenStick": {
        "name": "Wooden Stick",
        "desc": "A blunt wooden stick. Barely better than your fists",
        "class": "gear",
        "subclass": "club",
        "weight": 120,
        "durability": [80, 120],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.2, 1.4]
        }
    },
    "grass": {
        "name": "Blade of Grass",
        "desc": "Can be used to make healing potions",
        "class": "misc",
        "weight": 0.2
    },
    "woodenSpear": {
        "name": "Wooden Spear",
        "desc": "A pointy wooden stick, more durable and does more damage",
        "class": "gear",
        "subclass": "spear",
        "weight": 100,
        "durability": [200, 300],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.4, 1.5]
        },
        "crafting": {
            "complexity": 30,
            "materials": {
                "woodenStick": 1,
                "knife": 0
            }
        }
    },
    "knife": {
        "name": "Knife",
        "desc": "A basic knife made out of stone",
        "class": "gear",
        "subclass": "knife",
        "weight": 300,
        "durability": [800, 1200],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.5, 1.7]
        }
    },
    "slime": {
        "name": "Slime",
        "desc": "It's sticky",
        "class": "misc",
        "weight": 2
    },
    "strawPendant": {
        "name": "Straw Pendant",
        "desc": "Small pendant made out of straw. Increases all stats by 10%",
        "class": "gear",
        "weight": 25,
        "stackable": false,
        "equipment": {
            "class": "accessory",
            "effects": {
                "all": 0.1
            }
        },
        "crafting": {
            "complexity": 60,
            "materials": {
                "straw": 50
            }
        }
    },
    "woodenClub": {
        "name": "Wooden Club",
        "desc": "Medium sized wooden club, delivers a small shock to your enemies",
        "class": "gear",
        "subclass": "club",
        "weight": 500,
        "durability": [300, 500],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.3, 1.5]
        }
    },
    "largeWoodenClub": {
        "name": "Large Wooden Club",
        "desc": "A larger version of the wooden club, hard to swing but has a chance of stunning enemies",
        "class": "gear",
        "subclass": "club",
        "weight": 1500,
        "durability": [800, 1200],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.5, 1.8],
            "effects": {
                "spd": -0.25
            },
            "execute": function(dmg) {
                if (dmg > 0) {
                    if (Math.random() <= 0.1) {
                        changeEnemyEffect("stun", time + 2, true)
                        insertLog(colorGen(effectData['stun']['color'], `${enemyData[combatStatus['enemy']]['name']} is stunned`))
                    }
                }
            }
        }
    },
    "copperSword": {
        "name": "Copper Sword",
        "desc": "A basic sword made out of copper, slightly blunt but cuts well",
        "class": "gear",
        "subclass": "sword",
        "weight": 1000,
        "durability": [1300, 1500],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.7, 2]
        }
    },
    "cauldron": {
        "name": "Cauldron",
        "desc": "Used for crafting potions",
        "class": "tool",
        "weight": 4000,
        "obtainExecute": function() {
            discoverRecipe("basicHealthPotion")
        }
    },
    "basicHealthPotion": {
        "name": "Basic Health Potion",
        "desc": "Simple health potion. Increases your health by +30",
        "class": "consumable",
        "weight": 50,
        "execute": function() {
            if (processPotionCooldown(20)) {
                changeHealth(30)
            } else {
                return false
            }
        },
        "crafting": {
            "type": "alchemy",
            "complexity": 50,
            "materials": {
                "slime": 2,
                "grass": 1,
                "cauldron": 0
            }
        }
    },
    "smallHealthPotion": {
        "name": "Small Health Potion",
        "desc": "Small health potion. Increases your health by +150",
        "class": "consumable",
        "weight": 150,
        "execute": function() {
            if (processPotionCooldown(30)) {
                changeHealth(150)
            } else {
                return false
            }
        },
        "crafting": {
            "type": "alchemy",
            "complexity": 100,
            "materials": {
                "slime": 3,
                "grass": 3,
                "cauldron": 0,
                "waterBottle": 1
            }
        }
    },
    "smallStrengthPotion": {
        "name": "Small Strength Potion",
        "desc": "Small strength potion. Increases your strength by 30% for 60 minutes",
        "class": "consumable",
        "weight": 400,
        "execute": function() {
            if (processPotionCooldown(60)) {
                changeEffect("strength", time + 60, true, {"change": 0.3})
            } else {
                return false
            }
        },
        "crafting": {
            "type": "alchemy",
            "complexity": 100,
            "materials": {
                "stone": 1,
                "waterBottle": 1
            }
        }
    },
    "smallExercisePotion": {
        "name": "Small Exercise Potion",
        "desc": "Small exercise potion. Increases your stat gains by 50% for 4 hours (stackable)",
        "class": "consumable",
        "weight": 200,
        "execute": function() {
            if (processPotionCooldown(60)) {
                if (effects['exercisePotion']) {
                    if (effects['exercisePotion']['properties']['change'] < 0.5) {
                        changeEffect("exercisePotion", null)
                    } else if (effects['exercisePotion']['properties']['change'] > 0.5) {
                        insertLog("You already have a stronger effect")
                        return false
                    }
                }
                changeEffect("exercisePotion", 240, false, {"change": 0.5})
            } else {
                return false
            }
        },
        "crafting": {
            "type": "alchemy",
            "complexity": 120,
            "materials": {
                "exercisePill": 5,
                "waterBottle": 1
            }
        }
    },
    "waterBottle": {
        "name": "Water Bottle",
        "desc": "Bottle of water. Can be used for making potions",
        "class": "misc",
        "weight": 200
    },
    "wood": {
        "name": "Wood",
        "desc": "Can be used as fuel for a fire",
        "class": "misc",
        "weight": 100
    },
    "strawHelmet": {
        "name": "Straw Helmet",
        "desc": "A basic helmet made out of straw",
        "class": "gear",
        "weight": 25,
        "durability": [150, 250],
        "stackable": false,
        "equipment": {
            "class": "head",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 50
            }
        }
    },
    "strawChestplate": {
        "name": "Straw Chestplate",
        "desc": "A basic chestplate made out of straw",
        "class": "gear",
        "weight": 50,
        "durability": [300, 500],
        "stackable": false,
        "equipment": {
            "class": "chest",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 100
            }
        }
    },
    "strawBracers": {
        "name": "Straw Bracers",
        "desc": "Basic bracers made out of straw",
        "class": "gear",
        "weight": 25,
        "durability": [150, 250],
        "stackable": false,
        "equipment": {
            "class": "arms",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 50
            }
        }
    },
    "strawLeggings": {
        "name": "Straw Leggings",
        "desc": "Basic leggings made out of straw",
        "class": "gear",
        "weight": 25,
        "durability": [150, 250],
        "stackable": false,
        "equipment": {
            "class": "legs",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 50
            }
        }
    },
    "woodenPickaxe": {
        "name": "Wooden Pickaxe",
        "desc": "Nobody knows how this is able to mine stone or other materials",
        "class": "gear",
        "subclass": "pickaxe",
        "weight": 300,
        "durability": [90, 120],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "efficiency": 1,
            "equipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.innerHTML = `You are mining for stone and other materials with your pickaxe${processingGen()}`
                }
            },
            "unequipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.textContent = "You will need a pickaxe equipped to mine."
                }
            }
        },
        "crafting": {
            "complexity": 60,
            "materials": {
                "wood": 3
            }
        }
    },
    "stone": {
        "name": "Stone",
        "desc": "Slightly heavy, can be used to craft stronger gear",
        "class": "misc",
        "weight": 300,
        "obtainExecute": function() {
            discoverRecipe("stonePickaxe")
            discoverRecipe("stoneAxe")
        }
    },
    "woodenAxe": {
        "name": "Wooden Axe",
        "desc": "Allows you to cut wood using wood",
        "class": "gear",
        "subclass": "axe",
        "weight": 300,
        "durability": [90, 120],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "equipExecute": generateActions,
            "unequipExecute": generateActions
        },
        "crafting": {
            "complexity": 60,
            "materials": {
                "wood": 3
            }
        }
    },
    "huntersGuildSupplies": {
        "name": "Supply Box",
        "desc": "Supplies for the Hunters' Guild",
        "class": "misc",
        "weight": 10000,
        "undeletable": true
    },
    "strangeTrainingCharm": {
        "name": "Strange Training Charm",
        "desc": "Increases training gains when worn but decreases your health while training",
        "class": "gear",
        "weight": 1000,
        "stackable": false,
        "undeletable": true,
        "equipment": {
            "class": "accessory",
        }
    },
    "stonePickaxe": {
        "name": "Stone Pickaxe",
        "desc": "A pickaxe made out of the same thing you're mining. More durable and faster",
        "class": "gear",
        "subclass": "pickaxe",
        "weight": 1500,
        "durability": [300, 400],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "efficiency": 1.2,
            "equipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.innerHTML = `You are mining for stone and other materials with your pickaxe${processingGen()}`
                }
            },
            "unequipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.textContent = "You will need a pickaxe equipped to mine."
                }
            }
        },
        "crafting": {
            "complexity": 120,
            "materials": {
                "stone": 5
            }
        }
    },
    "stoneAxe": {
        "name": "Stone Axe",
        "desc": "Allows you to cut wood using stone",
        "class": "gear",
        "subclass": "axe",
        "weight": 1500,
        "durability": [300, 400],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "efficiency": 1.2,
            "equipExecute": generateActions,
            "unequipExecute": generateActions
        },
        "crafting": {
            "complexity": 120,
            "materials": {
                "stone": 5
            }
        }
    },
    "apple": {
        "name": "Apple",
        "desc": "Increases energy by 10",
        "class": "consumable",
        "weight": 100,
        "execute": function() {
            changeEnergy(10)
        }
    }
}
const effectData = {
    "sleepDeprived": {
        "name": "Sleep Deprived",
        "desc": "Energy loss per minute increased",
        "color": "#006666"
    },
    "extremeSleepDeprived": {
        "name": "Extreme Sleep Deprivation",
        "desc": "Energy loss per minute increased and energy can go negative",
        "color": "#338888"
    },
    "exercisePill": {
        "name": "Exercise Pill",
        "desc": "Stat gain is increased by 50%",
        "color": "#cccc00"
    },
    "exercisePotion": {
        "name": "Exercise Potion",
        "desc": "Stat gain is increased",
        "color": "#eeee00"
    },
    "wet": {
        "name": "Wet",
        "desc": "Energy loss is increased",
        "color": "#5555ff"
    },
    "stun": {
        "name": "Stunned",
        "desc": "Unable to attack",
        "color": "#995555"
    },
    "poison": {
        "name": "Poison",
        "desc": "Takes damage over time",
        "color": "#990099"
    },
    "potionSickness": {
        "name": "Potion Sickness",
        "desc": "Unable to consume potions",
        "color": "#559955"
    },
    "strength": {
        "name": "Strength",
        "desc": "Effective strength is increased",
        "color": "#bb0000"
    }
}
const questData = {
    "dojoIntro1": {
        "name": "Dojo Introduction 1",
        "desc": "You have been tasked by the instructor to defeat a total of 5 straw dummies and reach 1.5 strength",
        "repeatable": false,
        "goals": {
            "kills": {
                "strawDummy": {
                    "amount": 5,
                    "lifetime": false
                }
            },
            "stats": {
                "str": {
                    "amount": 1.5,
                    "lifetime": true
                }
            }
        }
    },
    "dojoIntro2": {
        "name": "Dojo Introduction 2",
        "desc": "You have been tasked by the instructor to reach 1.5 in every stat",
        "repeatable": false,
        "goals": {
            "stats": {
                "str": {
                    "amount": 1.5,
                    "lifetime": true
                },
                "def": {
                    "amount": 1.5,
                    "lifetime": true
                },
                "spd": {
                    "amount": 1.5,
                    "lifetime": true
                },
                "dex": {
                    "amount": 1.5,
                    "lifetime": true
                }
            }
        }
    },
    "dojoIntro3": {
        "name": "Pest Control",
        "desc": "You have been tasked by the instructor to defeat 10 mice in the alleys",
        "repeatable": false,
        "goals": {
            "kills": {
                "mouse": {
                    "amount": 10,
                    "lifetime": false
                }
            },
        }
    },
    "dojoIntro4": {
        "name": "Dojo Introduction 4",
        "desc": "You have been tasked by the instructor to defeat the golem in the dojo yard",
        "repeatable": false,
        "goals": {
            "kills": {
                "strawGolem": {
                    "amount": 1,
                    "lifetime": false
                }
            },
        }
    },
    "dojoIntro5": {
        "name": "Dojo Introduction 5",
        "desc": "You have been tasked by the instructor to reach 10 in every stat",
        "repeatable": false,
        "goals": {
            "stats": {
                "str": {
                    "amount": 10,
                    "lifetime": true
                },
                "def": {
                    "amount": 10,
                    "lifetime": true
                },
                "spd": {
                    "amount": 10,
                    "lifetime": true
                },
                "dex": {
                    "amount": 10,
                    "lifetime": true
                }
            }
        }
    },
    "els1": {
        "name": "Els's Quest",
        "desc": "Els has requested you to obtain 3 pieces of wood",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "wood": {"amount": 3}
            }
        }
    },
    "els2": {
        "name": "Forest Clearing",
        "desc": "Els has requested you to clear the path in the forest",
        "repeatable": false,
        "goals": {
            "checks": {
                "forestLayer1EnemiesRemaining": {
                    "name": "Cleared",
                    "lifetime": true,
                    "amount": 100,
                    "check": function() {return 100 - (checks['forestLayer1EnemiesRemaining'] ?? 100)}
                }
            }
        }
    },
    "els3": {
        "name": "Hunters' Guild Supplies",
        "desc": "Els has requested you to obtain supplies from the merchant in town and return back to him",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "huntersGuildSupplies": {"amount": 1}
            }
        }
    },
    "els4": {
        "name": "Hunters' Guild Supplies 2",
        "desc": "Els has requested you to obtain 10 pieces of stone",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "stone": {"amount": 10}
            }
        }
    },
    "els5": {
        "name": "Hunters' Guild Supplies 3",
        "desc": "Els has requested you to obtain 20 pieces of wood",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "wood": {"amount": 20}
            }
        }
    },
}
const shopData = {
    "merchant": [
        {"name": "exercisePill", "chance": 100, "quantity": [1, 3], "price": [5, 7]},
        {"name": "knife", "chance": 50, "quantity": [1, 1], "price": [19, 25]},
        {"name": "cauldron", "chance": 30, "quantity": [1, 1], "price": [60, 80]},
        {"name": "apple", "chance": 70, "quantity": [2, 3], "price": [3, 5]},
        {"name": "waterBottle", "chance": 100, "quantity": [4, 10], "price": [3, 5]},
        {"name": "wood", "chance": 50, "quantity": [1, 2], "price": [6, 8]}
    ],
    "weaponShop": [
        {"name": "woodenClub", "chance": 100, "quantity": [1, 1], "price": [10, 15]},
        {"name": "largeWoodenClub", "chance": 50, "quantity": [1, 1], "price": [35, 50]},
        {"name": "copperSword", "chance": 30, "quantity": [1, 1], "price": [35, 50]},
    ]
}
const gyms = {
    "none": {
        "str": 0.01,
        "def": 0.01,
        "spd": 0.01,
        "dex": 0.01
    },
    "nextLevel": {
        "str": 0.02,
        "def": 0.02,
        "spd": 0.02,
        "dex": 0.02
    },
    "forestGymBasic": {
        "str": 0.03,
        "def": 0.03,
        "spd": 0.03,
        "dex": 0.03
    },
    "forestGymAdvanced": {
        "str": 0.05,
        "def": 0.05,
        "spd": 0.05,
        "dex": 0.05
    }
}
const titleData = {
    "athlete": {"name": "Athlete"},
    "fighter": {"name": "Fighter"},
    "disciple": {"name": "Disciple"},
    "seeker": {"name": "Seeker"},
    "crafter": {"name": "Crafter"},
    "sleeper": {"name": "Sleeper"},
    "alchemist": {"name": "Alchemist"},
    "miner": {"name": "Miner"},
    "lumberjack": {"name": "Lumberjack"},
    "walker": {"name": "Walker"}
}
const arenaStatData = [
    {"health": [30, 40], "stats": [4,6], "reward": 10},
    {"health": [60, 80], "stats": [10,15], "reward": 20},
    {"health": [120, 150], "stats": [20,30], "reward": 30},
    {"health": [200, 300], "stats": [50,100], "reward": 50},
    {"health": [400, 600], "stats": [200,300], "reward": 70},
    {"health": [800, 1_000], "stats": [600,800], "reward": 100},
    // {"enemyType": "death", "reward": 0} // Until future content is made
]
const statTypes = ["str", "def", "spd", "dex"]
const tipData = [
    "The chance of weather being foggy increases at night",
    "Enemies can be stunned temporarily using a large wooden club",
    "Going above the weight limit increases energy loss and reduces your walk speed",
    "You can enable the option to automatically repeat crafting in settings",
    "It's recommended to sleep at least 5 in game hours per day",
    "You can create routes to automatically go through a set path in settings"
]

function getDayName(date=null) {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    if (date === null) {
        return getDayName(minutesToDate(time))
    }
    return dayNames[date.getDay()]
}

function minutesToDate(time) {
    const baseDate = new Date(1600, 0, 1)
    baseDate.setMinutes(baseDate.getMinutes() + time)
    return baseDate
}

function formatTime(time, timeOnly=false, customFormat=null) {
    const baseDate = minutesToDate(time)

    const dayName = getDayName(baseDate)
    const timeName = getTimeName(time)

    const year = baseDate.getFullYear()
    const month = String(baseDate.getMonth() + 1).padStart(2, "0")
    const day = String(baseDate.getDate()).padStart(2, "0")

    const hours = String(baseDate.getHours()).padStart(2, "0")
    const minutes = String(baseDate.getMinutes()).padStart(2, "0")

    const timeString = `${hours}:${String(Math.round(minutes)).padStart(2, "0")}`
    if (timeOnly) {
        return timeString
    }
    if (!settings['dateFormat'] && !customFormat) {
        if (!settings['mobileLayout']) {
            return `${dayName} ${capitaliseFirst(timeName)} ${year}-${month}-${day} ${timeString}`
        } else {
            return `${dayName.slice(0, 3)} ${capitaliseFirst(timeName)} ${year}-${month}-${day} ${timeString}`
        }
    } else {
        return formatString(customFormat ?? settings['dateFormat'], {
            "dayName": dayName,
            "shortDayName": dayName.slice(0, 3),
            "timeName": capitaliseFirst(timeName),
            "year": year,
            "month": month,
            "day": day,
            "hours": hours,
            "minutes": minutes
        })
    }
}

function formatNumberTime(seconds) {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const second = Math.floor(seconds % 60)
    return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${second > 0 ? `${second}s ` : ""}`
}

function getDay(timeNow=time) {
    return Math.ceil((timeNow + 1) / 1440)
}

function xpToLevel(xp, decimals=false, r=1.1) {
    let n = Math.log((xp * (r - 1)) / 50 + 1) / Math.log(r)
    return decimals ? n : Math.floor(n)
}

function levelToXp(level, r=1.1) {
    return 50 * (Math.pow(r, level) - 1) / (r - 1)
}

function xpForLevel(level, r=1.1) {
    return levelToXp(level + 1, r) - levelToXp(level, r)
}

function xpIntoLevel(xp, r=1.1) {
    const level = xpToLevel(xp, false, r)
    const levelStartXp = levelToXp(level, r)
    return Math.max(0, xp - levelStartXp)
}

function calcMaxHp(level=xpToLevel(xp)) {
    return Math.round(2 * level ** 1.5 + level + 10)
}

function getMaxEnergy() {
    return Math.round(100 + (totalSkillLevel * 0.5))
}

const ranks = [
    {"rank": "G-", "max": 5},
    {"rank": "G", "max": 20},
    {"rank": "G+", "max": 100},
    {"rank": "F-", "max": 500},
    {"rank": "F", "max": 2000},
    {"rank": "F+", "max": 10_000},
    {"rank": "E-", "max": 40_000},
    {"rank": "E", "max": 200_000},
    {"rank": "E+", "max": 1_000_000},
    {"rank": "D-", "max": 5_000_000},
    {"rank": "D", "max": 25_000_000},
    {"rank": "D+", "max": 100_000_000},
    {"rank": "C-", "max": 500_000_000},
    {"rank": "C", "max": 2_500_000_000},
    {"rank": "C+", "max": 10_000_000_000},
    {"rank": "B-", "max": 1e11},
    {"rank": "B", "max": 1e12},
    {"rank": "B+", "max": Infinity},
]

function getRank(total) {
    return ranks.find(r => (total ?? getTotalBattlestats()) < r['max'])['rank']
}

let achievements = []

function statAchievement(data) {
    return {
        "name": data['name'],
        "desc": data['desc'],
        "check": function() {return data['check']() >= data['goal']},
        "goal": [data['goal'], data['check']]
    }
}

const achievementData = {
    "firstBlood": statAchievement({
        "name": "First Blood",
        "desc": "Defeat 1 enemy",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 1
    }),
    "hunter": statAchievement({
        "name": "Hunter",
        "desc": "Defeat 10 enemies",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 10
    }),
    "killer": statAchievement({
        "name": "Killer",
        "desc": "Defeat 100 enemies",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 100
    }),
    "exterminator": statAchievement({
        "name": "Exterminator",
        "desc": "Defeat 1,000 enemies",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 1000
    }),
    "collector": statAchievement({
        "name": "Collector",
        "desc": "Discover 10 items",
        "check": function() {return stats['discoveredItems']?.length ?? 0},
        "goal": 10
    }),
    "hoarder": {
        "name": "Hoarder",
        "desc": "Carry 200 or more of a single item at once"
    },
    "flatline": {
        "name": "Flatline",
        "desc": "Defeat an enemy in one hit",
    },
    "overkill": {
        "name": "Overkill",
        "desc": "Deal 3x or more damage than an enemy's max health"
    },
    "discovery": {
        "name": "Discovery",
        "desc": "Unlock a crafting recipe",
    },
    "survivor": {
        "name": "Survivor",
        "desc": "Win a battle with 5% or less health remaining (enemies with attacks only)",
    },
    "insomniac": statAchievement({
        "name": "Insomniac",
        "desc": "Stay awake for 48 hours",
        "check": function() {return (stats['timeAwake'] ?? 0) / 60},
        "goal": 48
    }),
    "money1": statAchievement({
        "name": "Money",
        "desc": "Earn $1",
        "check": function() {return money},
        "goal": 1
    }),
    "money10": statAchievement({
        "name": "Pocket Change",
        "desc": "Earn $10",
        "check": function() {return money},
        "goal": 10
    }),
    "money100": statAchievement({
        "name": "Getting Somewhere",
        "desc": "Earn $100",
        "check": function() {return money},
        "goal": 100
    }),
    "crafter": {
        "name": "Crafter",
        "desc": "Craft an item",
    },
    "skilled": statAchievement({
        "name": "Skilled",
        "desc": "Unlock 10 skills",
        "check": function() {return Object.keys(skills).length},
        "goal": 10
    }),
    "untouchable": {
        "name": "Untouchable",
        "desc": "Win a battle without taking damage (enemies with attacks only)",
    },
    "golemBreaker": {
        "name": "Golem Breaker",
        "desc": "Defeat a golem",
    },
    "wasteful": statAchievement({
        "name": "Wasteful",
        "desc": "Discard 10 items",
        "check": function() {return stats['itemsDeleted'] ?? 0},
        "goal": 10
    }),
    "firstSteps": statAchievement({
        "name": "First Steps",
        "desc": "Travel 5 kilometers",
        "check": function() {return stats['distanceTravelled'] ?? 0},
        "goal": 5000
    }),
    "walker": statAchievement({
        "name": "Walker",
        "desc": "Travel 10 kilometers",
        "check": function() {return stats['distanceTravelled'] ?? 0},
        "goal": 10_000
    }),
    "marathon": statAchievement({
        "name": "Marathon",
        "desc": "Travel 25 kilometers",
        "check": function() {return stats['distanceTravelled'] ?? 0},
        "goal": 25_000
    }),
    "deforestation": statAchievement({
        "name": "Deforestation",
        "desc": "Cut down 100 trees",
        "check": function() {return stats['treesCut'] ?? 0},
        "goal": 100
    })
}

function checkAchievement(achievement) {
    if (!achievements.includes(achievement) && achievementData[achievement]['check'] && achievementData[achievement]['check']()) {
        insertLog(`Achievement Unlocked: ${colorGen("#ffff00", `"${achievementData[achievement]['name']}"`)}`)
        document.getElementById("achievements-button").style.display = ""
        achievements.push(achievement)
        const achievementParent = document.getElementById(`achievement-${achievement}`)
        if (achievementParent) {
            achievementParent.getElementsByClassName("achievement-title")[0].style.color = "#ffff00"
            if (achievementData[achievement]['goal']) {
                const achievementProgress = achievementParent.getElementsByClassName("achievement-progress")[0]
                const achievementBar = achievementParent.getElementsByClassName("achievement-bar")[0]
                if (achievementProgress) {achievementProgress.remove()}
                if (achievementBar) {achievementBar.remove()}
            }
        }
        return true
    } else if (achievementData[achievement]['goal']) {
        const achievementParent = document.getElementById(`achievement-${achievement}`)
        if (achievementParent) {
            const achievementProgress = achievementParent.getElementsByClassName("achievement-progress")[0]
            const achievementBar = achievementParent.getElementsByClassName("achievement-bar")[0]
            if (achievementProgress) {achievementProgress.textContent = `${formatNumber(achievementData[achievement]['goal'][1]())} / ${formatNumber(achievementData[achievement]['goal'][0])}`}
            if (achievementBar) {achievementBar.style.width = `${Math.min(achievementData[achievement]['goal'][1]() / achievementData[achievement]['goal'][0] * 100, 100)}%`}
        }
    }
    return false
}

function checkAchievements(achievements) {
    for (const achievement of achievements) {
        checkAchievement(achievement)
    }
}

function giveAchievement(achievement) {
    if (!achievements.includes(achievement)) {
        insertLog(`Achievement Unlocked: ${colorGen("#ffff00", `"${achievementData[achievement]['name']}"`)}`)
        document.getElementById("achievements-button").style.display = ""
        achievements.push(achievement)
        const achievementParent = document.getElementById(`achievement-${achievement}`)
        if (achievementParent) {
            achievementParent.getElementsByClassName("achievement-title")[0].style.color = "#ffff00"
            if (achievementData[achievement]['goal']) {
                const achievementProgress = achievementParent.getElementsByClassName("achievement-progress")[0]
                const achievementBar = achievementParent.getElementsByClassName("achievement-bar")[0]
                if (achievementProgress) {achievementProgress.remove()}
                if (achievementBar) {achievementBar.remove()}
            }
        }
    }
}

let achievementTableLoaded = false
document.getElementById("achievements-button").addEventListener("click", function() { // For performance reasons, this only generates it on click
    if (achievementTableLoaded === false) {
        achievementTableLoaded = true
        for (const [id, data] of Object.entries(achievementData)) {
            const achievementParent = document.createElement("div")
            achievementParent.className = "achievement-parent"
            achievementParent.id = `achievement-${id}`

            const achievementTitle = document.createElement("div")
            achievementTitle.className = "achievement-title"
            achievementTitle.textContent = achievementData[id]['name']

            const achievementDesc = document.createElement("div")
            achievementDesc.className = "achievement-desc"
            achievementDesc.textContent = achievementData[id]['desc']

            achievementParent.appendChild(achievementTitle)
            achievementParent.appendChild(achievementDesc)
            if (!achievements.includes(id)) {
                if (achievementData[id]['goal']) {
                    if (checkAchievement(id)) {
                        achievementTitle.style.color = "#ffff00"
                    } else {
                        const achievementProgress = document.createElement("div")
                        achievementProgress.className = "achievement-progress"
                        achievementProgress.textContent = `${formatNumber(achievementData[id]['goal'][1]())} / ${formatNumber(achievementData[id]['goal'][0])}`

                        const achievementBar = document.createElement("div")
                        achievementBar.className = "achievement-bar"
                        achievementBar.style.width = `${Math.min(achievementData[id]['goal'][1]() / achievementData[id]['goal'][0] * 100, 100)}%`
                        achievementParent.appendChild(achievementProgress)
                        achievementParent.appendChild(achievementBar)
                    }
                }
            } else {
                achievementTitle.style.color = "#ffff00"
            }

            document.getElementById("achievements-table").appendChild(achievementParent)
        }
    }
})

function updateLevelText(currentXp=xp) {
    document.getElementById("level").textContent = `Level ${xpToLevel(currentXp)} ${getRank()}`
}

const healthbarTextElement = document.getElementById("healthbar-text")
const healthbarFillElement = document.getElementById("healthbar-fill")
const healthbarFillDamageElement = document.getElementById("healthbar-fill-damage")
const energyBarTextElement = document.getElementById("energy-bar-text")
const energyBarFillElement = document.getElementById("energy-bar-fill")
const xpBarTextElement = document.getElementById("xp-bar-text")
const xpBarFillElement = document.getElementById("xp-bar-fill")
const enemyHealthbarTextElement = document.getElementById("enemy-healthbar-text")
const enemyHealthbarFillElement = document.getElementById("enemy-healthbar-fill")
const enemyHealthbarFillDamageElement = document.getElementById("enemy-healthbar-fill-damage")
function updateBar(bar, change=null) {
    if (bar === "health") {
        healthbarTextElement.textContent = `HP: ${formatNumber(health, "round")}/${formatNumber(calcMaxHp(), "round")}`
        healthbarFillElement.style.width = `${health / calcMaxHp() * 100}%`
        if (change !== null) {
            healthbarFillDamageElement.style.left = `${health / calcMaxHp() * 100}%`
            healthbarFillDamageElement.style.width = `${-change / calcMaxHp() * 100}%`
        } else {
            healthbarFillDamageElement.style.width = "0"
        }
    } else if (bar === "energy") {
        energyBarTextElement.textContent = `Energy: ${Math.round(energy)}/${getMaxEnergy()}`
        if (energy > 0) {
            energyBarFillElement.style.width = `${energy / getMaxEnergy() * 100}%`
            energyBarFillElement.style.right = ""
            energyBarFillElement.style.backgroundColor = ""
        } else {
            energyBarFillElement.style.width = `${-energy / 20 * 100}%`
            energyBarFillElement.style.right = "0"
            energyBarFillElement.style.backgroundColor = "#440000"
        }
    } else if (bar === "xp") {
        xpBarTextElement.textContent = `XP: ${formatNumber(xpIntoLevel(xp), "round")}/${formatNumber(xpForLevel(xpToLevel(xp)), "round")}`
        xpBarFillElement.style.width = `${xpIntoLevel(xp) / xpForLevel(xpToLevel(xp)) * 100}%`
        updateLevelText(xp)
    } else if (bar === "enemyHealth") {
        enemyHealthbarTextElement.textContent = `HP: ${formatNumber(combatStatus['enemyHealth'], "round")}/${formatNumber(combatStatus['enemyMaxHealth'], "round")}`
        enemyHealthbarFillElement.style.width = `${combatStatus['enemyHealth'] / combatStatus['enemyMaxHealth'] * 100}%`
        if (change !== null) {
            enemyHealthbarFillDamageElement.style.left = `${combatStatus['enemyHealth'] / combatStatus['enemyMaxHealth'] * 100}%`
            enemyHealthbarFillDamageElement.style.width = `${-change / combatStatus['enemyMaxHealth'] * 100}%`
        } else {
            enemyHealthbarFillDamageElement.style.width = "0"
        }
    }
}

function capitaliseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function camelToTitle(string) {
    const result = string.replace(/([A-Z])/g, " $1")
    return result.charAt(0).toUpperCase() + result.slice(1)
}

function updateBattlestats(statName=null) {
    for (const [stat, value] of Object.entries(battleStats)) {
        if (statName === null || stat === statName) {
            const effectiveStat = value * calcStatModifier(stat)
            const modifierPercentage = effectiveStat / value * 100 - 100
            document.getElementById(`stat-${stat}`).textContent = `${capitaliseFirst(stat)}: ${formatNumber(value, "floor")}${Math.round(modifierPercentage) !== 0 ? ` (${(modifierPercentage > 0 ? "+" : "") + modifierPercentage.toFixed(0)}%)` : ""}`
        }
    }
    document.getElementById(`stat-total`).textContent = `Ttl: ${formatNumber(getTotalBattlestats())}`
}

function updateEnemyBattlestats(statName=null) {
    let total = 0
    for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
        total += value
        if (statName === null || stat === statName) {
            const effectiveStat = value * calcEnemyStatDebuff(stat)
            const modifierPercentage = (effectiveStat / value * 100 - 100) || 0
            document.getElementById(`enemy-stat-${stat}`).textContent = `${capitaliseFirst(stat)}: ${formatNumber(value, "floor", true)}${Math.round(modifierPercentage) !== 0 ? ` (${(modifierPercentage > 0 ? "+" : "") + modifierPercentage.toFixed(0)}%)` : ""}`
        }
    }
    document.getElementById(`enemy-stat-total`).textContent = `Ttl: ${formatNumber(total, "floor", true)}`
}

function colorGen(hex, text, id=null) {
    return `<span ${id !== null ? `id=${id} ` : ""}style="color:${hex}">${text}</span>`
}

function processingGen() {
    return "<span class=main-processing></span>"
}

function darkenHexColor(hex, percent) {
    hex = hex.replace("#", "")

    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)

    r = Math.max(0, r - (r * percent / 100))
    g = Math.max(0, g - (g * percent / 100))
    b = Math.max(0, b - (b * percent / 100))

    r = Math.round(r).toString(16).padStart(2, "0")
    g = Math.round(g).toString(16).padStart(2, "0")
    b = Math.round(b).toString(16).padStart(2, "0")
    return `#${r}${g}${b}`
}

document.getElementById("log").addEventListener("scroll", function() {
    const {scrollTop, scrollHeight, clientHeight} = document.getElementById("log")
    logAutoScroll = scrollHeight - scrollTop - clientHeight < 24
})

let logIncrement = 0
function insertLog(content, tooltip=null, type=null, id=null) {
    if (settings['filterCombatLogs'] && type === "combat") {
        return
    }
    let div
    if (id !== null && id === logIncrement - 1 && document.getElementById(`log-${id}`)) {
        div = document.getElementById(`log-${id}`)
    } else {
        div = document.createElement("div")
        div.className = "log-entry"
        div.id = `log-${logIncrement}`
        logIncrement += 1

        document.getElementById("log").appendChild(div)

        while (document.getElementById("log").children.length > 200) {
            const removed = document.getElementById("log").firstChild
            document.getElementById("log").removeChild(removed)
        }
    }

    if (content.includes("<")) {
        div.innerHTML = content
    } else {
        div.textContent = content
    }

    if (tooltip !== null) {
        div.setAttribute("data-tooltip-title", tooltip[0])
        div.setAttribute("data-tooltip-text", tooltip[1])
    }

    if (logAutoScroll) {document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight}

    if (itemLogStackData['id'] !== null && (id === null || type === "training")) {
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
    }
    return logIncrement - 1
}

function playTransition() {
    if (settings['sceneTransitions'] === false) {return}
    let transition = document.getElementById("main-transition")
    transition.style.zIndex = 2
    transition.style.opacity = 0
    setTimeout(function() {
        transition.style.zIndex = 0
        transition.style.opacity = 1
    }, 300)
}

function randomRange(min, max, decimals=-1) {
    const value = Math.random() * (max - min) + min
    if (decimals === -1) {return value}
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
}

function generateEnemy(enemyName, stats=null) {
    if (combatStatus['enemy'] !== null) {return}
    combatStatus['enemy'] = enemyName
    const enemy = stats || enemyData[enemyName]
    combatStatus['enemyProperties'] = enemy['properties']
    let healthRoll = enemy['health'] ?? 0
    if (Array.isArray(enemy['health'])) {
        healthRoll = randomRange(enemy['health'][0], enemy['health'][1], 0)
        combatStatus['enemyMaxHealth'] = healthRoll
    } else {
        if (!enemy['maxHealth']) {
            combatStatus['enemyMaxHealth'] = enemy['health']
        } else {
            combatStatus['enemyMaxHealth'] = enemy['maxHealth']
        }
    }
    combatStatus['enemyHealth'] = healthRoll

    for (const stat of statTypes) {
        if (Array.isArray(enemy[stat])) {
            combatStatus['enemyStats'][stat] = randomRange(enemy[stat][0], enemy[stat][1], 2)
        } else {
            combatStatus['enemyStats'][stat] = enemy[stat]
        }
    }
    updateEnemyBattlestats()

    document.getElementById("enemy-name").textContent = enemy['name'] || enemyData[enemyName]['name']
    updateBar("enemyHealth")

    document.getElementById("attack-info-left").style.display = ""
    document.getElementById("attack-info-divider").style.display = ""
    document.getElementById("attack-info-right").style.display = ""
    if (settings['mobileLayout']) {
        document.getElementById("attack-info").style.display = "block"
        document.getElementById("center").style.bottom = "225px"
    }
}

function endFight() {
    combatStatus['enemy'] = null
    combatStatus['enemyHealth'] = 0
    combatStatus['enemyMaxHealth'] = 0
    combatStatus['enemyProperties'] = []
    combatStatus['enemyStats'] = {
        "str": 0,
        "def": 0,
        "spd": 0,
        "dex": 0
    }
    combatStatus['onDeath'] = undefined
    for (const [effect, value] of Object.entries(combatStatus['enemyEffects'] || {})) {
        changeEnemyEffect(effect, null)
    }
    combatStatus['enemyEffects'] = {}
    combatStatus['tags'] = undefined

    document.getElementById("enemy-name").textContent = ""
    updateBar("enemyHealth")

    document.getElementById("attack-info-left").style.display = "none"
    document.getElementById("attack-info-divider").style.display = "none"
    document.getElementById("attack-info-right").style.display = "none"
    if (settings['mobileLayout']) {
        document.getElementById("attack-info").style.display = ""
        document.getElementById("center").style.bottom = ""
    }
}

function killEnemy() {
    insertLog(colorGen("#aaaaaa", `${enemyData[combatStatus['enemy']]['name']} died`), null, "combat")

    if (enemyData[combatStatus['enemy']]['loot'] !== undefined) {
        for (const drop of enemyData[combatStatus['enemy']]['loot']) {
            changeInventory(drop['item'], getRandomItem(drop['chances']))
        }
    }

    if (enemyData[combatStatus['enemy']]['xp'] !== undefined) {
        let xpGain = 0
        if (Array.isArray(enemyData[combatStatus['enemy']]['xp'])) {
            xpGain = Math.round(randomRange(enemyData[combatStatus['enemy']]['xp'][0], enemyData[combatStatus['enemy']]['xp'][1], 2))
        } else {
            xpGain = enemyData[combatStatus['enemy']]['xp']
        }
        changeXp(xpGain)
    }

    changeQuestProgress("kills", combatStatus['enemy'], 1)

    if (!stats['kills']) {stats['kills'] = {}}
    stats['kills'][combatStatus['enemy']] = (stats['kills'][combatStatus['enemy']] ?? 0) + 1
    stats['totalKills'] = (stats['totalKills'] ?? 0) + 1
    checkAchievements(["firstBlood", "hunter", "killer", "exterminator"])

    if (combatStatus['onDeath']) {
        onDeathFunctions.get(combatStatus['onDeath'])()
    }

    endFight()
}

function getBaseDamage(strength) {
    const x = Math.log10(Math.max(1, strength))
    return 7 * x ** 2 + x * 2 + 5
}

function calcDamageMitigation(strength, defense) {
    const ratio = defense / strength

    if (ratio >= 14) {return 1}
    if (ratio >= 1 && ratio < 14) {return (50 + (50 / Math.log(14)) * Math.log(ratio)) / 100}
    if (ratio > 1 / 32 && ratio < 1) {return (50 + (50 / Math.log(32)) * Math.log(ratio)) / 100}

    return 0
}

function calcHitChance(speed, dexterity) {
    const ratio = speed / dexterity

    if (ratio > 64) {return 100}
    if (ratio >= 1 && ratio < 64) {return 100 - (50 / 7) * (8 * Math.sqrt(1 / ratio) - 1)}
    if (ratio > 1 / 64 && ratio < 1) {return (50 / 7) * (8 * Math.sqrt(ratio) - 1)}

    return 0
}

function calcArmorMitigation(damage, armor) {
    if (damage <= 0) {return 0.75}
    if (armor <= 0) {return 0}

    const limited = Math.min(Math.log10(armor + 4) / 2, 1)
    const effectiveArmor = (damage * Math.sqrt(armor / damage)) * (0.25 + 0.75 * limited)
    const mitigation = effectiveArmor / (effectiveArmor + damage)

    return Math.min(mitigation, 0.2 + Math.min(Math.log10(armor + 4) / 3, 1) * 0.55)
}

function changeSkill(skill, skillXp) {
    if (skillData[skill] === undefined) {
        insertLog(colorGen("#ff0000", `Attempted to change invalid skill "${skill}"`))
        return
    }
    const scaling = skillData[skill]['scaling']
    const currentLevel = xpToLevel(skills[skill] || 0, false, scaling)


    if (!Number.isInteger(skillXp)) {
        insertLog(colorGen("#ff0000", `Attempted to change skill "${skill}" by invalid amount (${skillXp})`))
        if (Number.isFinite(skillXp)) {
            skillXp = Math.floor(skillXp)
        } else {
            return
        }
    }

    if (skills[skill] === undefined) {
        skills[skill] = skillXp
        const skillbarParent = document.createElement("div")
        skillbarParent.className = "skillbar-parent"
        skillbarParent.id = `skill-${skill}`
        skillbarParent.setAttribute("data-tooltip-title", skillData[skill]['name'])
        skillbarParent.setAttribute("data-tooltip-text", skillData[skill]['desc'])

        const skillbarFill = document.createElement("div")
        skillbarFill.className = "skillbar-fill"
        skillbarFill.style.width = `${xpIntoLevel(skills[skill], scaling) / xpForLevel(xpToLevel(skills[skill], false, scaling), scaling) * 100}%`

        const skillbarText = document.createElement("div")
        skillbarText.className = "skillbar-text"
        skillbarText.textContent = `${skillData[skill]['shortName'] || skillData[skill]['name']} ${xpToLevel(skills[skill], false, scaling)}: ${formatNumber(xpIntoLevel(skills[skill], scaling), "floorAbove1k")}/${formatNumber(xpForLevel(xpToLevel(skills[skill], false, scaling), scaling), "floorAbove1k")}`

        skillbarParent.appendChild(skillbarFill)
        skillbarParent.appendChild(skillbarText)
        document.getElementById("skill-table").appendChild(skillbarParent)
        
        checkAchievement("skilled")
    } else {
        skills[skill] += skillXp
        const skillbarFill = document.getElementById(`skill-${skill}`).getElementsByClassName("skillbar-fill")[0]
        skillbarFill.style.width = `${xpIntoLevel(skills[skill], scaling) / xpForLevel(xpToLevel(skills[skill], false, scaling), scaling) * 100}%`

        const skillbarText = document.getElementById(`skill-${skill}`).getElementsByClassName("skillbar-text")[0]
        skillbarText.textContent = `${skillData[skill]['shortName'] || skillData[skill]['name']} ${xpToLevel(skills[skill], false, scaling)}: ${formatNumber(xpIntoLevel(skills[skill], scaling), "floorAbove1k")}/${formatNumber(xpForLevel(xpToLevel(skills[skill], false, scaling), scaling), "floorAbove1k")}`
    }

    if (currentLevel < xpToLevel(skills[skill], false, scaling)) {
        insertLog(colorGen("#bbbb44", `${skillData[skill]['name']} increased to ${xpToLevel(skills[skill], false, scaling)}`))
    }
    totalSkillLevel += xpToLevel(skills[skill], false, scaling) - currentLevel

    if (skillData[skill]['levelExec']) {
        skillData[skill]['levelExec'](xpToLevel(skills[skill], false, scaling))
    }
}

function formatNumber(num, round=false, lowPrecision=false) {
    if (!isFinite(num)) {return "inf"}

    const sign = num < 0 ? "-" : ""
    num = Math.abs(num)

    const units = ["", "k", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"]
    const exp = Math.max(0, Math.floor(Math.log10(num) / 3))

    if (exp >= units.length) {
        return sign + num.toExponential(2).replace("+", "")
    }

    const value = num / 1000 ** exp
    let decimals
    if (lowPrecision === false) {
        decimals = value < 1 ? 3 : value < 10 ? 2 : value < 100 ? 1 : 0
    } else {
        decimals = value < 1 ? 2 : value < 10 ? 1 : 0
    }

    if (round === "floor" || (round === "floorAbove1k" && num >= 1000)) {
        const factor = 10 ** decimals
        const floored = Math.floor(value * factor) / factor
        return sign + floored.toFixed(decimals).replace(/\.0+$/, "") + units[exp]
    } else if (round === "round" || round === "floorAbove1k") {
        return sign + Number(value.toFixed().replace(/\.0+$/, "")) + units[exp]
    } else {
        return sign + Number(value.toFixed(decimals).replace(/\.0+$/, "")) + units[exp]
    }
}

function englishifyNumber(n) {
    const special = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"]
    const deca = ["twent", "thirt", "fort", "fift", "sixt", "sevent", "eight", "ninet"]
    if (n < 20) {return special[n]}
    if (n % 10 === 0) {return deca[Math.floor(n / 10) - 2] + "ieth"}
    return deca[Math.floor(n / 10) - 2] + "y-" + special[n % 10]
}

function formatString(string, values) {
    return string.replace(/\$\{(\w+)\}/g, (_, key) => values[key])
}

function calcMovementSpeed() {
    let inventoryMulti = 1
    if (inventoryWeight > 0) {
        inventoryMulti = Math.min(getMaxWeight() / inventoryWeight, 1)
    }
    return (50 + getSkillLevel("walking") * 5) * inventoryMulti * calcEnergyDebuff(true)
}

function updateArrival(method="travel") {
    const arrivalElem = document.getElementById("text-arrival")
    if (arrivalElem) {
        if (method === "travel" && travelStatus['destination']) {
            const arrival = travelStatus['backwards'] !== true ? Math.ceil(time + Number(travelStatus['distance'] - travelStatus['completed']) / calcMovementSpeed()) : Math.ceil(time + Number(travelStatus['completed']) / calcMovementSpeed())
            arrivalElem.textContent = formatTime(arrival, true)
        } else if (method === "craft" && craftStatus['recipe']) {
            let craftingType = itemData[craftStatus['recipe']]['crafting']['type']
            let arrival
            if (craftingType === undefined) {
                arrival = Math.ceil(time + Number(craftStatus['goal'] - craftStatus['completed']) / getCraftingSpeed())
            } else {
                arrival = Math.ceil(time + Number(craftStatus['goal'] - craftStatus['completed']) / getAlchemySpeed())
            }
            arrivalElem.textContent = formatTime(arrival, true)
        }
    }
}

function getRandomItem(weightedDict) {
    const totalWeight = Object.values(weightedDict).reduce((sum, weight) => sum + weight, 0)
    
    let randomNum = Math.random() * totalWeight
    
    for (let item in weightedDict) {
        randomNum -= weightedDict[item]
        
        if (randomNum <= 0) {
            return isFinite(item) ? Number(item) : item
        }
    }
}

function createItemDiv(item, type="inventory", stackable=true, increment=null, special={}) {
    const isInventory = type === "inventory"

    const idPrefix = isInventory ? "item" : "storage-item"
    const quantitySource = isInventory ? inventory : storage

    const itemParent = document.createElement("div")
    itemParent.className = "item-parent"
    itemParent.id = stackable ? `${idPrefix}-${item}` : `${idPrefix}-${item}_${increment}`
    itemParent.setAttribute("data-tooltip-title", itemData[item]['name'])
    itemParent.setAttribute("data-tooltip-text", itemData[item]['desc'])
    itemParent.setAttribute("data-class", itemData[item]['class'])
    if (itemData[item]['equipment']) {
        itemParent.setAttribute("data-tooltip-special", "equipment")
    } else {
        itemParent.setAttribute("data-tooltip-special", "item")
    }

    const itemText = document.createElement("span")
    itemText.className = "item-text"
    itemText.textContent = itemData[item]['name']
    itemText.style.color = itemClasses[itemData[item]['class']]

    itemParent.appendChild(itemText)

    if (stackable) {
        const itemQuantity = document.createElement("span")
        itemQuantity.className = "item-quantity"
        itemQuantity.textContent = `x${quantitySource[item]}`
        itemParent.appendChild(itemQuantity)
    }
    const targetTable = special['fragment'] ? special['fragment'] : special['targetTable'] ? special['targetTable'] : document.getElementById(isInventory ? "inventory-table" : "storage-table")
    if (special['fragment'] === undefined) {
        for (const child of targetTable.children) {
            if (itemData[item]['class'] < child.getAttribute("data-class") || (itemData[item]['class'] === child.getAttribute("data-class") && itemData[item]['name'] < child.getAttribute("data-tooltip-title"))) {
                targetTable.insertBefore(itemParent, child)
                return
            }
        }
    }
    targetTable.appendChild(itemParent)
}

function genItemLogText(item, amount) {
    return `${amount !== undefined ? colorGen("#ccccff", `x${Math.abs(amount)} `) : ""}${colorGen(itemClasses[itemData[item]['class']], itemData[item]['name'])}`
}

let itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
const inventoryWeightElement = document.getElementById("inventory-weight")
function changeInventory(item, amount, itemId=null, newItemData=null, special={}) {
    let success = true
    if (!itemData[item]) {
        insertLog(colorGen("#ff0000", `Attempted to create invalid item "${item}"`))
        return false
    }
    if (!Number.isInteger(amount)) {
        insertLog(colorGen("#ff0000", `Attempted to change item "${item}" by invalid amount (${amount})`))
        if (Number.isFinite(amount)) {
            amount = Math.floor(amount)
        } else {
            return false
        }
    }

    if (itemData[item]['weight'] && special['ignoreWeightLimit'] !== true && itemData[item]['ignoreWeightLimit'] !== true && itemData[item]['weight'] * amount + inventoryWeight > getMaxWeight() * 3 && amount >= 1) {
        insertLog(colorGen("#ccaaaa", `You can't carry the ${itemData[item]['name']}`))
        return false
    }

    if (itemData[item]['stackable'] !== false) {
        if (inventory[item] === undefined) {
            if (amount <= 0) {return false}
            inventory[item] = amount
            createItemDiv(item, "inventory", true, null, {"fragment": special['fragment']})
        } else {
            if (inventory[item] + amount < 0) {return false}
            inventory[item] += amount

            if (inventory[item] === 0) {
                delete inventory[item]
                document.getElementById(`item-${item}`).remove()
            } else {
                document.getElementById(`item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${inventory[item]}`
            }
        }
        changeQuestProgress("items", item, inventory[item] ?? 0)
        if ((inventory[item] ?? 0) >= 200) {
            giveAchievement("hoarder")
        }
    } else {
        if (amount === 1) {
            if (newItemData === null) {
                newItemData = {"name": item}
                const itemEquipmentData = itemData[item]['equipment']
                if (itemEquipmentData) {
                    if (itemData[item]['durability']) {
                        newItemData['durability'] = randomRange(itemData[item]['durability'][0], itemData[item]['durability'][1], 0)
                        newItemData['maxDurability'] = newItemData['durability']
                    }
                    if (itemEquipmentData['class'] === "weapon") {
                        newItemData['damage'] = randomRange(itemEquipmentData['damage'][0], itemEquipmentData['damage'][1], 2)
                    }
                    if (itemEquipmentData['armor']) {
                        newItemData['armor'] = randomRange(itemEquipmentData['armor'][0], itemEquipmentData['armor'][1], 2)
                    }
                }
            }

            if (itemId === null) {
                inventoryNonStackable[inventoryNonStackableIncrement] = newItemData
                inventoryNonStackableIncrement += 1
                createItemDiv(item, "inventory", false, inventoryNonStackableIncrement - 1, {"fragment": special['fragment']})
            } else {
                inventoryNonStackable[itemId] = newItemData
                createItemDiv(item, "inventory", false, itemId, {"fragment": special['fragment']})
            }
        } else {
            if (itemData[item]['equipment']) {
                const itemClass = itemData[item]['equipment']['class']
                if (itemClass === "accessory") {
                    if (equipment['accessory1'] !== null && itemId === equipment['accessory1'][1]) {
                        changeEquipment(itemId)
                    }
                    if (equipment['accessory2'] !== null && itemId === equipment['accessory2'][1]) {
                        changeEquipment(itemId)
                    }
                } else {
                    if (equipment[itemClass] !== null && itemId === equipment[itemClass][1]) {
                        changeEquipment(itemId)
                    }
                }
            }
            delete inventoryNonStackable[itemId]
            document.getElementById(`item-${item}_${itemId}`).remove()
        }
    }

    if (itemLogStackData['item'] !== item) {
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
    }
    if (amount > 0) {
        if (itemLogStackData['type'] !== "obtain") {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`Obtained ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], "inventoryObtain", itemLogStackData['id'])
        itemLogStackData['type'] = "obtain"
    } else if (special['announceReduction'] === true) {
        if (itemLogStackData['type'] !== "use") {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`Used ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], "inventoryUse", itemLogStackData['id'])
        itemLogStackData['type'] = "use"
    }
    itemLogStackData['item'] = item

    if (itemData[item]['weight']) {
        const maxWeight = getMaxWeight()
        inventoryWeight += itemData[item]['weight'] * amount
        inventoryWeightElement.textContent = `${formatNumber(Math.max(inventoryWeight, 0))}g / ${formatNumber(maxWeight)}g`
        if (inventoryWeight > maxWeight * 3) {
            inventoryWeightElement.style.color = "#ff0000"
        } else if (inventoryWeight > maxWeight * 2) {
            inventoryWeightElement.style.color = "#ff8800"
        } else if (inventoryWeight > maxWeight) {
            inventoryWeightElement.style.color = "#ffff00"
        } else {
            inventoryWeightElement.style.color = ""
        }
    }

    if (itemData[item]['obtainExecute']) {
        itemData[item]['obtainExecute'](amount)
    }

    if (stats['discoveredItems'] === undefined) {
        stats['discoveredItems'] = []
    }

    if (!stats['discoveredItems'].includes(item)) {
        stats['discoveredItems'].push(item)
        insertLog(`${colorGen("#ffff00", "New Item:")} ${genItemLogText(item)}`, [itemData[item]['name'], itemData[item]['desc']])
        checkAchievement("collector")
    }

    return success
}

function discoverRecipe(recipe) {
    if (!knownRecipes.includes(recipe)) {
        knownRecipes.push(recipe)
        giveAchievement("discovery")
        insertLog(`New Recipe: ${genItemLogText(recipe)}`, [itemData[recipe]['name'], itemData[recipe]['desc']])
    }
}

function generateStorageMenu(existing=null, special={}) {
    let storageTable
    if (!existing) {
        storageTable = document.createElement("div")
        storageTable.id = "storage-table"
        mainElement.appendChild(storageTable)
    } else {
        storageTable = existing
    }
    for (const [item, amount] of Object.entries(storage)) {
        createItemDiv(item, "storage", true, null, special)
    }
    for (const [id, data] of Object.entries(storageNonStackable)) {
        const item = data['name']
        createItemDiv(item, "storage", false, id, special)
    }
}

function changeStorage(item, amount, itemId=null, newItemData=null, announce=true, special={}) {
    if (!itemData[item]) {
        insertLog(colorGen("#ff0000", `Attempted to create invalid item "${item}"`))
        return
    }
    if (!Number.isInteger(amount)) {
        insertLog(colorGen("#ff0000", `Attempted to change item "${item}" by invalid amount (${amount})`))
        if (Number.isFinite(amount)) {
            amount = Math.floor(amount)
        } else {
            return
        }
    }

    if (itemData[item]['stackable'] !== false) {
        if (storage[item] === undefined) {
            if (amount <= 0) {return false}
            storage[item] = amount
            if (storageAccess || special['targetTable']) {createItemDiv(item, "storage", true, null, {"targetTable": special['targetTable']})}
        } else {
            if (storage[item] + amount < 0) {return false}
            storage[item] += amount

            const storageItem = document.getElementById(`storage-item-${item}`)
            if (storage[item] === 0) {
                delete storage[item]
                if (storageItem) {storageItem.remove()}
            } else if (storageItem) {
                storageItem.getElementsByClassName("item-quantity")[0].textContent = `x${storage[item]}`
            }
        }
    } else {
        if (amount === 1) {
            storageNonStackable[itemId] = newItemData
            if (storageAccess || special['targetTable']) {createItemDiv(item, "storage", false, itemId, {"targetTable": special['targetTable']})}
        } else {
            delete storageNonStackable[itemId]
            const storageItem = document.getElementById(`storage-item-${item}_${itemId}`)
            if (storageItem) {
                storageItem.remove()
            }
        }
    }
    if (amount > 0 && announce === true) {
        if (itemLogStackData['type'] !== "deposit" || itemLogStackData['item'] !== item) {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`Deposited ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
        itemLogStackData['type'] = "deposit"
        itemLogStackData['item'] = item
    }
}

function changeXp(amount) {
    if (!Number.isInteger(amount)) {
        insertLog(colorGen("#ff0000", `Attempted to change xp by invalid amount (${amount})`))
        if (Number.isFinite(amount)) {
            amount = Math.floor(amount)
        } else {
            return
        }
    }
    const currentLevel = xpToLevel(xp)
    xp += amount
    updateBar("xp")
    updateLevelText(xp)
    insertLog(colorGen("#6666ff", `+${amount} XP`), null, "combat")
    if (currentLevel < xpToLevel(xp)) {
        changeHealth(calcMaxHp() - calcMaxHp(currentLevel))
        updateBar("health")
        insertLog(colorGen("#88ccff", `Levelled up to ${xpToLevel(xp)}`))
    }
}

function getSkillLevel(skill) {
    if (skills[skill] === undefined) {
        return 0
    } else {
        return xpToLevel(skills[skill], false, skillData[skill]['scaling'])
    }
}

function itemClickDetector(e, isStorage=false) {
    let item = undefined
    let itemId = undefined
    if (isStorage === false) {
        if (e.target.id.startsWith("item-")) {
            item = e.target.id.replace("item-", "")
        } else if (e.target.parentElement.id.startsWith("item-")) {
            item = e.target.parentElement.id.replace("item-", "")
        }
    } else if (isStorage === true) {
        if (e.target.id.startsWith("storage-item-")) {
            item = e.target.id.replace("storage-item-", "")
        } else if (e.target.parentElement.id.startsWith("storage-item-")) {
            item = e.target.parentElement.id.replace("storage-item-", "")
        }
    }

    if (item.split("_").length === 2) {
        [item, itemId] = item.split("_")
    }

    if (item !== undefined) {
        if (isStorage === false) {
            const moveCount = itemId !== undefined ? 1 : Math.min(inventory[item], moveMulti)
            if (itemId && moveMulti >= 1e9) {
                for (const [id, values] of Object.entries(inventoryNonStackable)) {
                    if (values['name'] === item) {
                        const newItemData = inventoryNonStackable[id]
                        changeInventory(item, -moveCount, id)
                        changeStorage(item, moveCount, id, newItemData)
                    }
                }
            } else {
                const newItemData = inventoryNonStackable[itemId]
                changeInventory(item, -moveCount, itemId)
                changeStorage(item, moveCount, itemId, newItemData)
            }
        } else if (isStorage === true) {
            const moveCount = itemId !== undefined ? 1 : Math.min(storage[item], moveMulti)
            if (itemId && moveMulti >= 1e9) {
                for (const [id, values] of Object.entries(storageNonStackable)) {
                    if (values['name'] === item) {
                        const newItemData = storageNonStackable[id]
                        if (changeInventory(item, moveCount, id, newItemData)) {
                            changeStorage(item, -moveCount, id)
                        } else {
                            return
                        }
                    }
                }
            } else {
                const newItemData = storageNonStackable[itemId]
                if (changeInventory(item, moveCount, itemId, newItemData)) {
                    changeStorage(item, -moveCount, itemId)
                }
            }
        }
    }
}

function storageClickDetector(e) {
    itemClickDetector(e, true)
}

function toggleStorageAccess(value) {
    if (value === true) {
        storageAccess = true
        document.getElementById("inventory-table").addEventListener("click", itemClickDetector)
        document.getElementById("storage-table").addEventListener("click", storageClickDetector)
    } else {
        storageAccess = false
        document.getElementById("inventory-table").removeEventListener("click", itemClickDetector)
        document.getElementById("storage-table").removeEventListener("click", storageClickDetector)
    }
}

function getMaxWeight(str=battleStats['str']) {
    return Math.round((5000 + Math.pow((str - 1) / 1000000, 0.3) * 95000) / 1000) * 1000
}

function getMaxPotionCooldown() {
    return 300
}

function processPotionCooldown(cooldown) {
    if (potionCooldown > getMaxPotionCooldown()) {
        insertLog(colorGen("#ccaaaa", `You can't drink any more potions`))
        return false
    } else {
        potionCooldown += cooldown
        if (potionCooldown > getMaxPotionCooldown()) {
            changeEffect("potionSickness", Math.max(potionCooldown - getMaxPotionCooldown(), 1))
        }
        return true
    }
}

function changeEnergy(amount) {
    if (!Number.isFinite(amount)) {
        insertLog(colorGen("#ff0000", `Attempted to change energy by invalid amount (${amount})`))
        return
    }
    let oldenergy = energy
    if (!effects['extremeSleepDeprived']) {
        energy = Math.min(Math.max(energy + amount, 0), getMaxEnergy())
    } else {
        energy = Math.min(Math.max(energy + (amount < 0 ? amount * 0.2 : amount), -20), getMaxEnergy())
    }
    if (amount < 0 && oldenergy > 35 && energy < 35) {
        insertLog(colorGen("#aaaaaa", "You start to feel tired"))
    }

    updateBar("energy")
    if (travelStatus['destination']) {updateArrival()}
    if (craftStatus['recipe']) {updateArrival("craft")}
}

let weather = "clear"
let weatherStartTime = time
const weatherData = {
    "clear": {
        "changes": {
            "sunny": {"chance": 40, "check": function() {return ["morning", "afternoon"].includes(getTimeName())}},
            "foggy": {"chance": function() {return getTimeName() === "night" ? 30 : 8}},
            "overcast": {"chance": 15},
            "noChange": {"chance": 10000}
        },
        "minTime": 30
    },
    "sunny": {
        "changes": {
            "clear": {"chance": 40},
            "noChange": {"chance": 10000}
        },
        "minTime": 30,
        "terminate": function() {return !["morning", "afternoon"].includes(getTimeName())}
    },
    "foggy": {
        "changes": {
            "clear": {"chance": 100},
            "noChange": {"chance": 10000}
        },
        "minTime": 20
    },
    "overcast": {
        "changes": {
            "clear": {"chance": 100},
            "rain": {"chance": 200},
            "noChange": {"chance": 10000}
        },
        "minTime": 5
    },
    "rain": {
        "changes": {
            "clear": {"chance": 100},
            "overcast": {"chance": 25},
            "noChange": {"chance": 10000}
        },
        "minTime": 10
    }
}
const weatherAppearance = {
    "clear": {"name": "Clear", "color": "#bbbbbb"},
    "sunny": {"name": "Sunny", "color": "#ffcc00"},
    "foggy": {"name": "Foggy", "color": "#777777", "tooltip": "Speed is reduced by 25%"},
    "overcast": {"name": "Overcast", "color": "#7777aa"},
    "rain": {"name": "Rain", "color": "#5555ff"}
}

function processWeatherWeights(changes, multi=1) {
    const weights = {}

    for (const [weather, data] of Object.entries(changes)) {
        if (data['check'] && !data['check']()) {continue}

        weights[weather] = typeof data['chance'] === "function" ? data['chance']() : data['chance']
    }

    if (weights['noChange']) {
        if (multi === 0) {delete weights['noChange']}
        else {weights['noChange'] = weights['noChange'] / multi}
    }

    return weights
}

function getWeatherChances(changes, multi=1) {
    const weights = processWeatherWeights(changes, multi)
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
    const chances = {}

    for (const [weather, weight] of Object.entries(weights)) {
        chances[weather] = (weight / totalWeight) * 100
    }

    return chances
}

function getRandomWeather(changes, multi=1) {
    const weights = processWeatherWeights(changes, multi)
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    
    let randomNum = Math.random() * totalWeight
    
    for (let item in weights) {
        randomNum -= weights[item]
        
        if (randomNum <= 0) {
            return item
        }
    }

    return "noChange"
}

function changeWeather(newWeather) {
    weather = newWeather
    weatherStartTime = time
    const weatherElem = document.getElementById("weather")
    weatherElem.textContent = weatherAppearance[newWeather]['name']
    weatherElem.style.color = weatherAppearance[newWeather]['color']
    weatherElem.style.backgroundColor = darkenHexColor(weatherAppearance[newWeather]['color'], 70)
    if (weatherAppearance[newWeather]['tooltip']) {
        weatherElem.setAttribute("data-tooltip-title", weatherAppearance[newWeather]['name'])
        weatherElem.setAttribute("data-tooltip-text", weatherAppearance[newWeather]['tooltip'])
    } else {
        weatherElem.removeAttribute("data-tooltip-title")
        weatherElem.removeAttribute("data-tooltip-text")
    }
}

function updateWeather(multi=1) {
    const weatherState = weatherData[weather]
    if (weatherState['terminate'] && weatherState['terminate']()) {
        changeWeather(getRandomWeather(weatherState['changes'], 0))
    } else if (time - weatherStartTime >= weatherState['minTime']) {
        const newWeather = getRandomWeather(weatherState['changes'], multi)
        if (newWeather !== "noChange") {
            changeWeather(newWeather)
        }
    }

    if (debugEnabled) {
        const chances = getWeatherChances(weatherState['changes'], 1)
        const chances60 = getWeatherChances(weatherState['changes'], 60)
        outputText = ""
        for (const [weather, chance] of Object.entries(chances)) {
            outputText += `${weather}: ${chance.toFixed(2)}% (${chances60[weather].toFixed(2)}%)\n`
        }
        document.getElementById("weather-chances").textContent = outputText
    }
}

const timeElement = document.getElementById("time")
function changeTime(amount) {
    const oldTime = time
    time += amount
    if (Math.floor(time / 1440) > Math.floor(oldTime / 1440)) {
        dailyChecks = {}
    }

    stats['gametime'] += amount
    if (currentScene !== "sleep") {
        noSleepTime += amount
        stats['timeAwake'] = (stats['timeAwake'] ?? 0) + amount
        checkAchievement("insomniac")
    } else {
        stats['timeSlept'] = (stats['timeSlept'] ?? 0) + amount
    }

    potionCooldown = Math.max(potionCooldown - amount, 0)

    if (Math.floor((time - amount) / 1440) < Math.floor(time / 1440)) {
        delete checks['arenaParticipated']
    }
    if (sceneProperties[currentScene]) {
        if (sceneProperties[currentScene].includes("outdoors") && weather === "rain") {
            if (!effects['wet'] || effects['wet']['end'] - time < 60) {
                changeEffect("wet", 5)
            }
        }
    }

    if (currentScene !== "sleep") {
        changeEnergy(-0.05 * amount)
        if (noSleepTime >= 1200) {
            changeEnergy(-(noSleepTime - 1200) * 0.0002 * amount)
        }

        if (inventoryWeight > getMaxWeight()) {
            changeEnergy(-0.1 * (inventoryWeight / getMaxWeight() - 1) * amount)
        }
    }

    for (const effect in effects) {
        const handler = effectFunctions.get(effect)
        if (handler) {handler(amount)}
    }
    updateWeather(amount)
    timeElement.textContent = formatTime(time)
}

function getTimeName() {
    const timeOffset = time % 1440
    if (timeOffset < 360) {return "night"} // 00:00 - 05:59
    else if (timeOffset < 720) {return "morning"} // 06:00 - 11:59
    else if (timeOffset < 1080) {return "afternoon"} // 12:00 - 17:59
    else if (timeOffset < 1260) {return "evening"} // 18:00 - 21:59
    else if (timeOffset < 1440) {return "night"} // 22:00 - 23:59
    else {return "???"}
}

function createEffectElement(effect, type="player") {
    const div = document.createElement("div")

    div.className = "effect-icon"
    div.id = type === "enemy" ? `enemy-effect-${effect}` : `effect-${effect}`
    div.style.backgroundColor = effectData[effect]['color']
    div.setAttribute("data-tooltip-title", effectData[effect]['name'])
    div.setAttribute("data-tooltip-text", effectData[effect]['desc'])
    div.setAttribute("data-tooltip-special", type === "enemy" ? "enemyEffect" : "effect")

    return div
}

// function updateEffectTooltip(elem, effect, type="player") {
//     let data = type === "enemy" ? combatStatus['enemyEffects'][effect] : effects[effect]
//     let text = effectData[effect]['desc']

//     if (!data['indefinite']) {
//         text += `<hr>Ends: ${colorGen("#ccccff", formatTime(data['end'], true))}`
//     }

//     elem.setAttribute("data-tooltip-text", text)
// }

function createEffect(duration, absolute, properties) {
    const effect = {
        "indefinite": duration === 0,
        "end": duration === 0 ? null : (absolute ? duration : duration + time)
    }

    if (properties !== null) {
        effect['properties'] = properties
    }

    return effect
}

function changeEffect(effect, duration=0, absolute=false, properties=null) {
    const effectElem = document.getElementById(`effect-${effect}`)
    const existing = effects[effect]

    if (duration === null) {
        if (!existing) {return}

        delete effects[effect]
        effectElem?.remove()
        return
    } else if (!existing) {
        effects[effect] = createEffect(duration, absolute, properties)

        const div = createEffectElement(effect)
        // updateEffectTooltip(div, effect)
        document.getElementById("effects-bar").appendChild(div)
        return
    } else if (duration === 0) {
        existing['indefinite'] = true
        existing['end'] = null

        if (properties) {existing['properties'] = properties}
    } else {
        existing['indefinite'] = false

        if (absolute) {
            existing['end'] = duration
        } else {
            existing['end'] += duration
        }

        if (properties) {existing['properties'] = properties}
    }

    // updateEffectTooltip(document.getElementById(`effect-${effect}`), effect)
}

function changeEnemyEffect(effect, duration=0, absolute=false) {
    const effectElem = document.getElementById(`enemy-effect-${effect}`)
    const existing = combatStatus['enemyEffects'][effect]

    if (duration === null) {
        if (!existing) {return}

        delete combatStatus['enemyEffects'][effect]
        effectElem?.remove()
        return
    } else if (!existing) {
        combatStatus['enemyEffects'][effect] = createEffect(duration, absolute)

        const div = createEffectElement(effect, "enemy")
        // updateEffectTooltip(div, effect, "enemy")
        document.getElementById("enemy-effects-bar").appendChild(div)
        return
    } else if (duration === 0) {
        existing['indefinite'] = true
        existing['end'] = null
    } else {
        existing['indefinite'] = false

        if (absolute) {
            existing['end'] = duration
        } else {
            existing['end'] += duration
        }
    }

    // updateEffectTooltip(document.getElementById(`enemy-effect-${effect}`), effect, "enemy")
}

function calcEnergyDebuff(ignoreUnder=false) {
    if (energy >= 35) {
        return 1
    } else if (ignoreUnder === false) {
        return energy / 70 + 0.5
    } else {
        return Math.max(energy, 0) / 70 + 0.5
    }
}

function getEquipmentStatBuff(equipment, stat) {
    if (equipment !== null) {
        const effects = itemData[equipment[0]]['equipment']['effects']
        if (effects === undefined) {return 0}
        if (effects['all']) {
            return effects['all']
        } else if (effects[stat]) {
            return effects[stat]
        }
    }
    return 0
}

function calcStatModifier(stat=null) {
    let multi = 1
    let equipmentEndNegative = 1
    // Increase
    for (const item of Object.values(equipment)) {
        if (item !== null) {
            change = getEquipmentStatBuff(item, stat)
            if (change > 0) {
                multi += change
            } else (
                equipmentEndNegative *= 1 + change
            )
        }
    }

    if (stat === "str" && effects['strength']) {
        multi += effects['strength']['properties']['change']
    }

    
    // Decrease
    multi *= equipmentEndNegative

    if (energy < 35) {
        multi *= energy / 70 + 0.5
    }
    if (stat === "spd") {
        if (weather === "foggy") {multi *= 0.75}
    }
    return multi
}

function getStatModifierInfo(stat=null) {
    const data = {
        "positive": [],
        "negative": []
    }
    let equipmentEndNegative = 1
    for (const item of Object.values(equipment)) {
        if (item !== null) {
            change = getEquipmentStatBuff(item, stat)
            if (change > 0) {
                data['positive'].push({"source": itemData[item[0]]['name'], "change": change})
            } else if (change < 0) {
                data['negative'].push({"source": itemData[item[0]]['name'], "change": 1 + change})
            }
        }
    }

    if (stat === "str" && effects['strength']) {
        data['positive'].push({"source": "Strength Effect", "change": effects['strength']['properties']['change']})
    }

    if (energy < 35) {
        data['negative'].push({"source": "Energy", "change": energy / 70 + 0.5})
    }
    if (stat === "spd") {
        if (weather === "foggy") {data['negative'].push({"source": "Foggy Weather", "change": 0.75})}
    }
    return data
}

function getStatModifierBreakdown(stat) {
    const data = getStatModifierInfo(stat)
    output = []
    for (const effect of data['positive']) {
        output.push(`${colorGen("#00ff00", `+${formatNumber(effect['change'] * 100, false, true)}%`)} ${effect['source']}`)
    }

    for (const effect of data['negative']) {
        output.push(`${colorGen("#ff0000", `-${formatNumber((1 - effect['change']) * 100, false, true)}%`)} ${effect['source']}`)
    }

    const modifierPercentage = calcStatModifier(stat) * 100 - 100
    output.push(`Total: ${modifierPercentage > 0 ? "+" : ""}${formatNumber(modifierPercentage)}%`)
    return output.join("\n")
}

function calcEnemyStatDebuff(stat=null) {
    let multi = 1
    if (stat === "spd") {
        if (weather === "foggy") {multi *= 0.75}
    }
    return multi
}

function changeHealth(amount) {
    let oldHealth = health
    health = Math.min(Math.max(health + amount, 0), calcMaxHp())

    if (health <= 0) {
        endFight()
        if (currentScene === "theArenaFight") {
            if (arenaData['round'] >= 2) {
                prependText = `${colorGen("#ffee00", `You received $${arenaStatData[arenaData['round'] - 2]['reward']} for participating`)}\n\n`
                changeMoney(arenaStatData[arenaData['round'] - 2]['reward'])
                if (team === "nextLevel") {
                    checks['nextLevelExercisePills'] = Math.round(arenaStatData[arenaData['round'] - 2]['reward'] / 10)
                }
            }
            arenaData = {}
        }
        playTransition()
        if (region === "forest") {
            sceneManager("huntersGuildHeal")
        } else {
            sceneManager("sleep")
        }
        insertLog(colorGen("#ff0000", "You died!"))
        health = 1
        insertLog(colorGen("#bb4444", `${(-energy / 2).toFixed(0)} Energy`))
        changeEnergy(-energy / 2)

        for (const [effect, value] of Object.entries(effects)) {
            changeEffect(effect, null)
        }

        if (document.visibilityState === "hidden") {
            document.title = "Arkivia | DEAD"
        }

        stats['deaths'] = (stats['deaths'] ?? 0) + 1
    }

    updateBar("health", health - oldHealth)
}

function getQuestGoals(questName) {
    let output = {}
    for (const [type, values] of Object.entries(questData[questName]['goals'])) {
        for (const [stat, data] of Object.entries(values)) {
            const questStatData = questData[questName]['goals']?.[type]?.[stat]
            if (output[type] === undefined) {
                output[type] = {}
            }
            if (data['lifetime'] === true) {
                let statValue
                if (type === "stats") {
                    statValue = battleStats[stat]
                } else if (type === "checks" && questStatData['check']) {
                    statValue = questStatData['check']()
                }

                output[type][stat] = {
                    "amount": data['amount'],
                    "completion": statValue
                }
            } else {
                let statValue
                if (!quests[questName]) {
                    statValue = 0
                } else {
                    if (type === "items") {
                        statValue = inventory[stat] || 0
                    } else {
                        statValue = quests[questName]['goals'][type][stat]['completion']
                    }
                }

                output[type][stat] = {
                    "amount": data['amount'],
                    "completion": statValue
                }
            }
        }
    }
    return output
}

const metQuests = {}
function checkCompletion(questName) {
    if (quests[questName] === undefined) {
        return false
    }
    let goals = getQuestGoals(questName)
    for (const [type, values] of Object.entries(goals)) {
        for (const [stat, data] of Object.entries(values)) {
            if (data['amount'] > data['completion']) {
                if (metQuests[questName] === true) {
                    delete metQuests[questName]
                    document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = ""
                }
                return false
            }
        }
    }

    if (!questData[questName]['manualComplete']) {
        delete quests[questName]
        insertLog(`Completed Quest: ${colorGen("#ffff00", `"${questData[questName]['name']}"`)}`)
        if (questData[questName]['repeatable'] === false) {
            completedQuests.push(questName)
        }
        document.getElementById("completed-quests-table").appendChild(document.getElementById(`quest-${questName}`))
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#ffff00"
        document.getElementById("completed-quests-table").style.display = ""
        document.getElementById("completed-quests-header").style.display = ""
    } else if (metQuests[questName] === undefined) {
        insertLog(`Quest Met: ${colorGen("#bbff00", `"${questData[questName]['name']}"`)}`)
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#bbff00"
        metQuests[questName] = true
    }
}

function giveQuest(questName, complete=false) {
    if (!quests[questName] && complete === false) {
        nonLifetime = {}
        for (const [type, values] of Object.entries(questData[questName]['goals'])) {
            for (const [stat, data] of Object.entries(values)) {
                if (data['lifetime'] !== true) {
                    if (nonLifetime[type] === undefined) {
                        nonLifetime[type] = {}
                    }
                    nonLifetime[type][stat] = {
                        "amount": data['amount'],
                        "completion": 0
                    }
                }
            }
        }
        quests[questName] = {
            "goals": nonLifetime
        }
        insertLog(`Received Quest: ${colorGen("#ffff00", `"${questData[questName]['name']}"`)}`)
    }
    if (document.getElementById(`quest-${questName}`) === null) {
        if (document.getElementById("quests-button").style.display === "none") {
            document.getElementById("quests-button").style.display = ""
        }
        const questParent = document.createElement("div")
        questParent.className = "quest-parent"
        questParent.id = `quest-${questName}`

        const questTitle = document.createElement("div")
        questTitle.className = "quest-title"
        questTitle.textContent = questData[questName]['name']

        const questDesc = document.createElement("div")
        questDesc.className = "quest-desc"
        questDesc.textContent = questData[questName]['desc']

        const questGoals = document.createElement("div")
        questGoals.className = "quest-goals"
        
        for (const [type, values] of Object.entries(getQuestGoals(questName))) {
            for (const [stat, data] of Object.entries(values)) {
                const questStatData = questData[questName]['goals']?.[type]?.[stat]
                const goalParent = document.createElement("div")
                goalParent.className = "goal-parent"

                const goal = document.createElement("span")
                goal.className = "quest-goal"
                if (type === "kills") {
                    goal.textContent = `${enemyData[stat]['name']}: `
                } else if (type === "stats") {
                    goal.textContent = `${stat.replace("str", "Strength").replace("def", "Defense").replace("spd", "Speed").replace("dex", "Dexterity")}: ` // Kinda bad but it works for now
                } else if (type === "items") {
                    goal.textContent = `${itemData[stat]['name']}: `
                } else if (type === "checks") {
                    if (questStatData['name'] === undefined) {
                        goal.textContent = `${stat.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}: `
                    } else {
                        goal.textContent = `${questStatData['name']}: `
                    }
                } else {
                    goal.textContent = `${stat}: `
                }

                const goalProgress = document.createElement("span")
                goalProgress.className = "quest-goal-progress"
                goalProgress.id = `quest-${questName}-${stat}`
                if (complete === false) {
                    goalProgress.style.color = data['completion'] < data['amount'] ? "#ff0000" : "#00ff00"
                    goalProgress.textContent = `${formatNumber(data['completion'], "floor")}/${data['amount']}`
                } else {
                    goalProgress.style.color = "#00ff00"
                    goalProgress.textContent = `${formatNumber(data['amount'])}/${data['amount']}`
                }
                
                questGoals.appendChild(goalParent)
                goalParent.appendChild(goal)
                goalParent.appendChild(goalProgress)
            }
        }
        
        questParent.appendChild(questTitle)
        questParent.appendChild(questDesc)
        questParent.appendChild(questGoals)
        document.getElementById("quests-table").appendChild(questParent)
    }

    if (complete === false) {
        checkCompletion(questName)
    } else {
        delete quests[questName]
        if (!completedQuests.includes(questName)) {
            insertLog(`Completed Quest: ${colorGen("#ffff00", `"${questData[questName]['name']}"`)}`)
            if (questData[questName]['repeatable'] === false) {
                completedQuests.push(questName)
            }
        }
        document.getElementById("completed-quests-table").appendChild(document.getElementById(`quest-${questName}`))
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#ffff00"
        document.getElementById("completed-quests-table").style.display = ""
        document.getElementById("completed-quests-header").style.display = ""
    }
}

function changeQuestProgress(type, stat, value=undefined) {
    for (const quest in quests) {
        const questStatData = questData[quest]['goals']?.[type]?.[stat]
        if (questStatData) {
            let newValue
            if (questStatData['lifetime'] === true) {
                if (value === undefined) {
                    newValue = questStatData['check']()
                } else {
                    newValue = value
                }
            } else if (questStatData['lifetime'] === false) {
                newValue = quests[quest]['goals'][type][stat]['completion'] + value
                quests[quest]['goals'][type][stat]['completion'] = newValue
            } else {
                if (type === "items") {
                    newValue = value
                }
            }
            const goalElem = document.getElementById(`quest-${quest}-${stat}`)
            goalElem.textContent = `${formatNumber(newValue, "floor")}/${questStatData['amount']}`
            if (newValue >= questStatData['amount']) {
                checkCompletion(quest)
                goalElem.style.color = "#00ff00"
            } else if (newValue < questStatData['amount']) {
                goalElem.style.color = "#ff0000"
                if (metQuests[quest]) {
                    delete metQuests[quest]
                    document.getElementById(`quest-${quest}`).getElementsByClassName("quest-title")[0].style.color = ""
                }
            }
        }
    }
}

let trainingSession = {
    "logId": null,
    "gain": 0,
    "stat": null
}
function trainingAreaHandler(stat, gymName="none") {
    const gain = changeBattlestat(stat, gyms[gymName][stat])
    changeSkill("training", 1)
    changeTitleXp("athlete", 1)
    changeEnergy(-0.2)
    if (stat !== trainingSession['stat']) {
        trainingSession['stat'] = stat
        trainingSession['logId'] = null
        trainingSession['gain'] = 0
    }
    trainingSession['gain'] += gain
    trainingSession['logId'] = insertLog(`+${formatNumber(trainingSession['gain'])} (+${formatNumber(gain)}/s) ${stat.replace("str", "Strength").replace("def", "Defense").replace("spd", "Speed").replace("dex", "Dexterity")}`, null, "training", trainingSession['logId'])
    if (document.visibilityState === "hidden") {
        document.title = `Arkivia | ${capitaliseFirst(stat)} +${formatNumber(trainingSession['gain'], false, true)} (+${formatNumber(gain, false, true)}/s)`
    }

    if (hasEquipment('strangeTrainingCharm')) {
        changeHealth(-4)
    }
}

function calcTrainingModifier(stat=null) {
    let multi = 1
    // Positive
    multi += getSkillLevel("training") * 0.05

    // Booster Multi
    let boosterMulti = 1
    if (effects['exercisePill']) {boosterMulti += 0.5}
    if (effects['exercisePotion']) {boosterMulti += effects['exercisePotion']['properties']['change']}

    multi *= boosterMulti

    let equipmentMulti = 1
    if (hasEquipment("strangeTrainingCharm")) {equipmentMulti += 0.2}
    
    multi *= equipmentMulti

    // Negative
    if (energy < 35) {
        multi *= energy / 70 + 0.5
    }
    return multi
}

function getTrainingModifierInfo(stat=null) {
    const data = {
        "positive": [],
        "negative": []
    }

    if (getSkillLevel("training") > 0) {
        data['positive'].push({"source": "Training Skill", "change": getSkillLevel("training") * 0.05})
    }

    if (effects['exercisePill']) {data['positive'].push({"source": "Exercise Pill", "change": 0.5, "multi": true})}
    if (effects['exercisePotion']) {data['positive'].push({"source": "Exercise Potion", "change": effects['exercisePotion']['properties']['change'], "multi": true})}

    if (hasEquipment("strangeTrainingCharm")) {data['positive'].push({"source": "Strange Training Charm", "change": 0.2, "multi": true})}

    if (energy < 35) {
        data['negative'].push({"source": "Energy", "change": energy / 70 + 0.5})
    }

    return data
}

function getTrainingModifierBreakdown(stat) {
    const data = getTrainingModifierInfo(stat)
    output = []
    for (const effect of data['positive']) {
        if (!effect['multi']) {
            output.push(`${colorGen("#00ff00", `+${formatNumber(effect['change'] * 100, false, true)}%`)} ${effect['source']}`)
        } else {
            output.push(`${colorGen("#00ff00", `x${formatNumber(effect['change'] + 1, false, true)}`)} ${effect['source']}`)
        }
    }

    for (const effect of data['negative']) {
        output.push(`${colorGen("#ff0000", `-${formatNumber((1 - effect['change']) * 100, false, true)}%`)} ${effect['source']}`)
    }

    const modifierPercentage = calcTrainingModifier(stat) * 100 - 100
    output.push(`Total: ${modifierPercentage > 0 ? "+" : ""}${formatNumber(modifierPercentage)}%`)
    return output.join("\n")
}

function getDamageBreakdown() {
    const effectiveStats = {}
    for (const [stat, value] of Object.entries(battleStats)) {
        effectiveStats[stat] = value * calcStatModifier(stat)
    }

    const enemyEffectiveStats = {}
    if (combatStatus['enemy']) {
        for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
            enemyEffectiveStats[stat] = value * calcEnemyStatDebuff(stat)
        }
    }

    let baseDamage = getBaseDamage(effectiveStats['str'])
    let baseDamageWeapon = baseDamage * (getEquipmentStats("weapon") !== null ? getEquipmentStats("weapon")['damage'] : 1)
    const fightingSkillDamage = baseDamageWeapon * getSkillLevel("fighting") * 0.05
    
    let masteryDamage = 0
    if (equipment['weapon']) {
        masteryDamage = baseDamageWeapon * getSkillLevel(`${itemData[equipment['weapon'][0]]['subclass']}Mastery`) * 0.03
    } else {
        masteryDamage = baseDamageWeapon * getSkillLevel("unarmedMastery") * 0.03
    }

    let afterDamage = baseDamageWeapon + fightingSkillDamage + masteryDamage

    let weaponClassDamage = 0
    let damageMitigated = 0
    if (combatStatus['enemy']) {
        const weaponClass = equipment['weapon'] ? itemData[equipment['weapon'][0]]['subclass'] : "unarmed"
        if (enemyData[combatStatus['enemy']]['damageModifiers'] && enemyData[combatStatus['enemy']]['damageModifiers'][weaponClass]) {
            weaponClassDamage = afterDamage * (enemyData[combatStatus['enemy']]['damageModifiers'][weaponClass] - 1)
        }
        damageMitigated = (afterDamage + weaponClassDamage) * calcDamageMitigation(effectiveStats['str'], enemyEffectiveStats['def'])
    }

    let finalDamage = afterDamage + weaponClassDamage
    if (combatStatus['enemy']) {
        finalDamage *= (1 - calcDamageMitigation(effectiveStats['str'], enemyEffectiveStats['def']))
    }

    output = []
    output.push(`Base Damage: ${colorGen("#00ffff", formatNumber(baseDamage))}`)
    if (getEquipmentStats("weapon") !== null) {output.push(`Weapon: ${colorGen("#00ffff", formatNumber(baseDamageWeapon))}`)}
    if (fightingSkillDamage) {output.push(`Fighting Skill: ${colorGen("#00ff00", `+${formatNumber(fightingSkillDamage)}`)}`)}
    if (masteryDamage) {output.push(`Mastery: ${colorGen("#00ff00", `+${formatNumber(masteryDamage)}`)}`)}
    if (combatStatus['enemy']) {output.push("")}
    if (weaponClassDamage) {output.push(`Weapon Class: ${colorGen(weaponClassDamage < 0 ? "#ff0000" : "#00ff00", `${weaponClassDamage > 0 ? "+" : ""}${formatNumber(weaponClassDamage)}`)}`)}
    if (damageMitigated) {output.push(`Damage Mitigation: ${colorGen("#ff0000", `-${formatNumber(damageMitigated)}`)}`)}
    output.push(`Total: ${colorGen("#ffff00", formatNumber(finalDamage))}`)

    return output.join("\n")
}

function changeBattlestat(stat, amount, absolute=false) {
    if (stat !== "str" || stat !== "def" || stat !== "spd" || stat !== "dex") {
        insertLog(colorGen("#ff0000", `Attempted to change invalid battlestat (${stat})`))
        return
    }
    if (!Number.isFinite(amount)) {
        insertLog(colorGen("#ff0000", `Attempted to change battlestat ${stat} by invalid amount (${amount})`))
        return
    }
    let multi = absolute === false ? calcTrainingModifier() : 1
    const oldRank = getRank()
    battleStats[stat] += amount * multi
    updateBattlestats(stat)
    changeQuestProgress("stats", stat, battleStats[stat])
    updateLevelText()
    const newRank = getRank()
    if (newRank !== oldRank) {
        insertLog(`Rank Changed: ${colorGen("#88bb00", oldRank)} -> ${colorGen("#88bb00", newRank)}`)
    }
    inventoryWeightElement.textContent = `${formatNumber(inventoryWeight)}g / ${formatNumber(getMaxWeight())}g`
    return amount * multi
}

function generateShop(shopName) {
    let shopItems = {}
    if (!shopStorage[shopName] || shopStorage[shopName]['day'] < getDay(time)) {
        for (const item of shopData[shopName]) {
            if (Math.random() < item['chance'] / 100) {
                shopItems[item['name']] = {
                    "price": randomRange(item['price'][0], item['price'][1], 0),
                    "quantity": randomRange(item['quantity'][0], item['quantity'][1], 0)
                }
            }
        }
    } else {
        shopItems = shopStorage[shopName]['items']
    }
    shopStorage[shopName] = {
        "day": getDay(time),
        "items": shopItems
    }

    const shopHolder = document.createElement("div")
    shopHolder.className = "shop-holder"
    mainElement.appendChild(shopHolder)

    for (const [item, data] of Object.entries(shopItems)) {
        const itemParent = document.createElement("div")
        itemParent.className = "item-parent"
        itemParent.id = `shop-item-${item}`
        itemParent.setAttribute("data-tooltip-title", itemData[item]['name'])
        itemParent.setAttribute("data-tooltip-text", itemData[item]['desc'])

        const itemText = document.createElement("span")
        itemText.className = "item-text"
        itemText.textContent = itemData[item]['name']

        const itemQuantity = document.createElement("span")
        itemQuantity.className = "item-quantity"
        itemQuantity.textContent = `x${data['quantity']}`

        const itemPrice = document.createElement("span")
        itemPrice.className = "item-price"
        itemPrice.textContent = `$${data['price']}`

        itemParent.appendChild(itemText)
        itemParent.appendChild(itemQuantity)
        itemParent.appendChild(itemPrice)
        shopHolder.appendChild(itemParent)
    }

    shopHolder.addEventListener("click", function(e) {
        let item = null
        if (e.target.id.startsWith("shop-item-")) {
            item = e.target.id.replace("shop-item-", "")
        } else if (e.target.parentElement.id.startsWith("shop-item-")) {
            item = e.target.parentElement.id.replace("shop-item-", "")
        }

        if (item !== null) {
            if (shopStorage[shopName]['items'][item]['quantity'] <= 0) {
                insertLog(colorGen("#aaaaaa", "Out of stock"))
            } else {
                if (money >= shopStorage[shopName]['items'][item]['price']) {
                    if (changeInventory(item, 1)) {
                        changeMoney(-shopStorage[shopName]['items'][item]['price'])
                        shopStorage[shopName]['items'][item]['quantity'] -= 1
                        document.getElementById(`shop-item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${shopStorage[shopName]['items'][item]['quantity']}`
                    }
                } else {
                    insertLog(colorGen("#aaaaaa", "Not enough money"))
                }
            }
        }
    })
}

let craftStorageReloadNeeded = true
document.getElementById("storage-button").addEventListener("click", function() {
    if (craftStorageReloadNeeded) {
        document.getElementById("storage-table-alt").replaceChildren()
        const fragment = new DocumentFragment()
        generateStorageMenu(fragment, {"fragment": fragment})
        document.getElementById("storage-table-alt").appendChild(fragment)
        craftStorageReloadNeeded = false
    }
})

function beginCrafting(item) {
    if (item !== null) {
        let nonstackablesRequired = {}
        let nonstackableCounts = {}
        for (const item of Object.values(inventoryNonStackable)) {
            nonstackableCounts[item['name']] = (nonstackableCounts[item['name']] ?? 0) + 1
        }

        for (const item of Object.values(storageNonStackable)) {
            nonstackableCounts[item['name']] = (nonstackableCounts[item['name']] ?? 0) + 1
        }

        for (const [craftingItem, amount] of Object.entries(itemData[item]['crafting']['materials'])) {
            if (amount >= 1) {
                if (itemData[craftingItem]['stackable'] !== false) {
                    if (((inventory[craftingItem] ?? 0) + (storage[craftingItem] ?? 0)) < amount) {
                        insertLog(colorGen("#aaaaaa", "Missing materials"))
                        return false
                    }
                } else {
                    if ((nonstackableCounts[craftingItem] ?? 0) < amount) {
                        insertLog(colorGen("#aaaaaa", "Missing materials"))
                        return false
                    }
                    nonstackablesRequired[craftingItem] = amount
                }
            } else {
                if (((inventory[craftingItem] ?? 0) + (storage[craftingItem] ?? 0)) < 1 && nonstackableCounts[craftingItem] < 1) {
                    insertLog(colorGen("#aaaaaa", "Missing materials"))
                    return false
                }
            }
        }

        if (Object.keys(nonstackablesRequired).length === 0) {
            let craftingType = itemData[item]['crafting']['type']
            let arrival
            if (craftingType === undefined) {
                arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getCraftingSpeed())
            } else if (craftingType === "alchemy") {
                arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getAlchemySpeed())
            }
            craftStatus['completed'] = 0
            craftStatus['goal'] = itemData[item]['crafting']['complexity']
            craftStatus['recipe'] = item
            sceneManager("empty")
            processText(`You are crafting "${itemData[item]['name']}". You'll finish at ${colorGen("#ccccff", formatTime(arrival, true), "text-arrival")}${processingGen()}\n\n{Cancel|table|0|cancelCrafting}`)
            playTransition()
        } else {
            sceneManager("empty")
            let outputString = Object.entries(nonstackablesRequired).map(([item, amount]) => `- x${amount} ${itemData[item]['name']}`).join("\n")
            processText(`Choose\n${outputString}\nfrom your inventory or storage\n\n{Cancel|table|0|cancelCrafting}`)
            craftingSelection = true
            craftStatus['required'] = nonstackablesRequired
            craftStatus['selected'] = item
            playTransition()
        }
    }
}

function generateCraftingMenu() {
    document.getElementById("storage-button").style.display = ""
    const craftingHolder = document.createElement("div")
    craftingHolder.className = "crafting-holder"
    mainElement.appendChild(craftingHolder)

    let nonstackableCounts = {}
    for (const item of Object.values(inventoryNonStackable)) {
        nonstackableCounts[item['name']] = (nonstackableCounts[item['name']] ?? 0) + 1
    }

    for (const item of Object.values(storageNonStackable)) {
        nonstackableCounts[item['name']] = (nonstackableCounts[item['name']] ?? 0) + 1
    }

    for (const item of knownRecipes) {
        const itemParent = document.createElement("div")
        itemParent.className = "crafting-item-parent"
        itemParent.id = `crafting-item-${item}`
        itemParent.setAttribute("data-tooltip-title", itemData[item]['name'])
        itemParent.setAttribute("data-tooltip-text", itemData[item]['desc'])

        const itemHolder = document.createElement("div")
        itemHolder.className = "crafting-item-holder"

        const craftingType = document.createElement("span")
        craftingType.className = "crafting-type"
        if (itemData[item]['crafting']['type'] === undefined) {
            craftingType.textContent = "C"
            craftingType.style.color = "#ffaa55"
            craftingType.setAttribute("data-tooltip-title", "Crafting")
        } else if (itemData[item]['crafting']['type'] === "alchemy") {
            craftingType.textContent = "A"
            craftingType.style.color = "#aa55aa"
            craftingType.setAttribute("data-tooltip-title", "Alchemy")
        }

        const itemText = document.createElement("span")
        itemText.className = "item-text"
        itemText.textContent = itemData[item]['name']

        const itemComplexity = document.createElement("span")
        itemComplexity.className = "item-complexity"
        itemComplexity.textContent = itemData[item]['crafting']['complexity']

        const requirementsHolder = document.createElement("div")
        requirementsHolder.className = "crafting-item-requirements"

        let i = 0
        const totalItems = Object.keys(itemData[item]['crafting']['materials']).length
        for (const [craftingItem, amount] of Object.entries(itemData[item]['crafting']['materials'])) {
            const materialElement = document.createElement("span")
            if (amount >= 1) {
                materialElement.textContent = `x${amount} ${itemData[craftingItem]['name']}`
                if (((inventory[craftingItem] ?? 0) + (storage[craftingItem] ?? 0)) >= amount || nonstackableCounts[craftingItem] >= amount) {
                    materialElement.style.color = "#aaffaa"
                }
            } else {
                materialElement.textContent = itemData[craftingItem]['name']
                if (((inventory[craftingItem] ?? 0) + (storage[craftingItem] ?? 0)) >= 1 || nonstackableCounts[craftingItem] >= 1) {
                    materialElement.style.color = "#aaffaa"
                }
            }

            requirementsHolder.appendChild(materialElement)

            if (i < totalItems - 1) {
                const dividerElement = document.createElement("span")
                dividerElement.textContent = `, `
                requirementsHolder.appendChild(dividerElement)
            }

            i += 1
        }

        itemHolder.appendChild(craftingType)
        itemHolder.appendChild(itemText)
        itemHolder.appendChild(itemComplexity)
        itemParent.appendChild(itemHolder)
        itemParent.appendChild(requirementsHolder)
        craftingHolder.appendChild(itemParent)
    }

    craftingHolder.addEventListener("click", function(e) {
        let item = e.target.closest("[id^=\"crafting-item-\"]")?.id?.replace("crafting-item-", "")
        beginCrafting(item)
    })
}

function changeMoney(amount) {
    if (!Number.isFinite(amount)) {
        insertLog(colorGen("#ff0000", `Attempted to change money by invalid amount (${amount})`))
        return
    }
    money += amount
    if (amount > 0) {
        insertLog(`Obtained ${colorGen("#cccc55", `$${formatNumber(amount)}`)}`)
    } else {
        insertLog(`Spent ${colorGen("#cccc55", `$${formatNumber(-amount)}`)}`)
    }
    document.getElementById("inventory-money").textContent = `$${formatNumber(money)}`
    checkAchievements(["money1", "money10", "money100"])
}

function getCraftingSpeed() {
    return (1 + (0.05 * getSkillLevel("crafting"))) * calcEnergyDebuff()
}

function getAlchemySpeed() {
    return 1 + (0.05 * getSkillLevel("alchemy"))
}

function getExploreSpeed() {
    return 1 + (0.05 * getSkillLevel("exploration"))
}

function getMiningSpeed() {
    let multi = 1
    if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "pickaxe") {
        if (itemData[equipment['tool'][0]]['equipment']['efficiency']) {
            multi = itemData[equipment['tool'][0]]['equipment']['efficiency']
        }
    }
    return (1 + (0.05 * getSkillLevel("mining"))) * multi * calcEnergyDebuff()
}

function getChoppingSpeed() {
    let multi = 1
    if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "axe") {
        if (itemData[equipment['tool'][0]]['equipment']['efficiency']) {
            multi = itemData[equipment['tool'][0]]['equipment']['efficiency']
        }
    }
    return (1 + (0.05 * getSkillLevel("felling"))) * multi * calcEnergyDebuff()
}

function getHuntingSpeed() {
    return 1 + (0.05 * getSkillLevel("hunting")) * calcEnergyDebuff()
}

function getEquipmentStats(type) {
    if (equipment[type]) {
        return inventoryNonStackable[equipment[type][1]]
    } else {
        return null
    }
}

function changeTitleXp(selectedTitle, amount) {
    titleScores[selectedTitle] = (titleScores[selectedTitle] ?? 0) + amount

    if (amount > 0) {
        for (const title of Object.keys(titleScores)) {
            if (title !== selectedTitle) {
                titleScores[title] *= 0.9999
            }
        }
    }

    const highest = Object.entries(titleScores).reduce((max, current) => current[1] > max[1] ? current : max)
    if (highest[1] >= 50 && playerTitle !== titleData[highest[0]]['name']) {
        changeTitle(titleData[highest[0]]['name'])
    }
}

function startProcess(type, goal, scene=currentScene) {
    if ((processStatus['type'] !== type && processStatus['scene'] !== scene) || processStatus['completed'] >= processStatus['goal']) {
        processStatus['type'] = type
        processStatus['area'] = scene
        processStatus['completed'] = 0
        processStatus['goal'] = goal
    }
}

function stopProcess() {
    processStatus = {
        "type": null,
        "area": null,
        "goal": 0,
        "completed": 0
    }
}

const onDeathFunctions = new Map([
    ["firstTrainingDummy", function() {
        playTransition()
        sceneManager("dojoQuestIntro")
    }],
    ["strawGolem", function() {
        playTransition()
        sceneManager("dojoYard")
        checks['golemMax'] = Math.max(checks['golemMax'] || 0, 1)
        giveAchievement("golemBreaker")
    }],
    ["woodGolem", function() {
        playTransition()
        sceneManager("dojoYard")
        checks['golemMax'] = Math.max(checks['golemMax'] || 0, 2)
    }],
    ["stoneGolem", function() {
        playTransition()
        sceneManager("dojoYard")
        checks['golemMax'] = Math.max(checks['golemMax'] || 0, 3)
    }],
    ["coalGolem", function() {
        playTransition()
        sceneManager("dojoYard")
    }],
    ["arenaWinMatch", function() {
        playTransition()
        arenaData['endTime'] = time + 60
        arenaData['round'] += 1
        sceneManager("theArenaWinMatch")
    }],
    ["forestLayer1Death", function() {
        checks['forestLayer1EnemiesRemaining'] = (checks['forestLayer1EnemiesRemaining'] ?? 100) - 1
        processText(`You are clearing the enemies blocking the pathway in the forest.\n${checks['forestLayer1EnemiesRemaining'] || 100} enemies remain${processingGen()}\n\n{![stop.png]Stop|forestLayer1|0|endFight}`)
        if (checks['forestLayer1EnemiesRemaining'] === 0) {
            prependText = "You have finished clearing the enemies.\n\n"
            playTransition()
            sceneManager("forestLayer1")
        }
        changeQuestProgress("checks", "forestLayer1EnemiesRemaining")
    }],
    ["huntingEnemyDeath", function() {
        checks['huntersGuildMission']['complete'] = true
        playTransition()
        sceneManager("forestLayer1")
    }],
    ["townGatesNorthProveWrong", function() {
        checks['townLeavePerms'] = true
        processText(`"Actually, nevermind, we were wrong about that. You can pass through now."\n\n{Next|townGatesNorth}`)
    }]
])

const sceneTicks = new Map([
    ["trainingGrounds_str", function() {
        trainingAreaHandler("str", "none")
    }],
    ["trainingGrounds_def", function() {
        trainingAreaHandler("def", "none")
    }],
    ["trainingGrounds_spd", function() {
        trainingAreaHandler("spd", "none")
    }],
    ["trainingGrounds_dex", function() {
        trainingAreaHandler("dex", "none")
    }],
    ["dojo_trainingDummy", function() {
        generateEnemy("strawDummy")
    }],
    ["sleep", function() {
        changeTitleXp("sleeper", 1)
        changeSkill("sleeping", 1)
        changeEnergy(2 + getSkillLevel("sleeping") * 0.2)
        if (noSleepTime >= 1440) {
            noSleepTime = noSleepTime * 0.98
        }
        noSleepTime = Math.max(noSleepTime - 40, 0)
    }],
    ["hospital", function() {
        changeHealth(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
    }],
    ["alley", function() {
        if (!quests['dojoIntro3'] && !completedQuests.includes("dojoIntro3")) {
            return
        }
        generateEnemy("mouse")
    }],
    ["trainingGrounds_nextLevel_str", function() {
        trainingAreaHandler("str", "nextLevel")
    }],
    ["trainingGrounds_nextLevel_def", function() {
        trainingAreaHandler("def", "nextLevel")
    }],
    ["trainingGrounds_nextLevel_spd", function() {
        trainingAreaHandler("spd", "nextLevel")
    }],
    ["trainingGrounds_nextLevel_dex", function() {
        trainingAreaHandler("dex", "nextLevel")
    }],
    ["theArenaWinMatch", function() {
        if (time >= arenaData['endTime']) {
            delete arenaData['endTime']
            playTransition()
            sceneManager("theArenaWalkIn")
        }
    }],
    ["theArenaMedbay", function() {
        changeHealth(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
        if (time >= arenaData['endTime']) {
            delete arenaData['endTime']
            playTransition()
            sceneManager("theArenaWalkIn")
        }
    }],
    ["grassPlains", function() {
        if (travelStatus['destination'] === null && (checks['spawnDelay'] === null || checks['spawnDelay'] <= time)) {
            const rng = Math.random()
            if (rng < 0.75) {
                generateEnemy("greenSlime")
            } else if (rng < 0.9) {
                generateEnemy("blueSlime")
            } else {
                generateEnemy("purpleSlime")
            }
        }
    }],
    ["forestLayer1Clear", function() {
        if (combatStatus['enemy'] === null) {
            const rng = Math.random()
            if (rng < 0.3 && getTimeName() === "night") {generateEnemy("bat")}
            else if (rng < 0.45) {generateEnemy("lizard")}
            else if (rng < 0.9) {generateEnemy("spider")}
            else {generateEnemy("venomousSpider")}

            combatStatus['onDeath'] = "forestLayer1Death"
        }
    }],
    ["huntersGuildHeal", function() {
        if (health < calcMaxHp(xpToLevel(xp)) / 3) {
            changeHealth(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
        }
    }],
    ["forestMine", function() {
        if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "pickaxe") {
            startProcess("mining", randomRange(20, 30, 0))
            processStatus['completed'] += getMiningSpeed()

            if (changeEquipmentDurability("tool", -1)) {
                const actionText = document.getElementById("action-text")
                if (actionText) {
                    actionText.textContent = "You will need a pickaxe equipped to mine."
                }
            }

            changeSkill("mining", 1)
            changeTitleXp("miner", 1)
            if (processStatus['completed'] >= processStatus['goal']) {
                startProcess("mining", randomRange(20, 30, 0))
                changeInventory("stone", randomRange(1, 2, 0))
            }
        }
    }],
    ["forestGymBasic_str", function() {
        trainingAreaHandler("str", "forestGymBasic")
    }],
    ["forestGymBasic_def", function() {
        trainingAreaHandler("def", "forestGymBasic")
    }],
    ["forestGymBasic_spd", function() {
        trainingAreaHandler("spd", "forestGymBasic")
    }],
    ["forestGymBasic_dex", function() {
        trainingAreaHandler("dex", "forestGymBasic")
    }],
    ["forestGymAdvanced_str", function() {
        trainingAreaHandler("str", "forestGymAdvanced")
    }],
    ["forestGymAdvanced_def", function() {
        trainingAreaHandler("def", "forestGymAdvanced")
    }],
    ["forestGymAdvanced_spd", function() {
        trainingAreaHandler("spd", "forestGymAdvanced")
    }],
    ["forestGymAdvanced_dex", function() {
        trainingAreaHandler("dex", "forestGymAdvanced")
    }],
    ["forestHunt", function() {
        if (!combatStatus['enemy']) {
            startProcess("hunt", randomRange(20, 30, 0))
            processStatus['completed'] += getHuntingSpeed()
            changeSkill("hunting", 1)
            if (processStatus['completed'] >= processStatus['goal']) {
                generateEnemy(checks['huntersGuildMission']['enemy'], checks['huntersGuildMission']['stats'])
                combatStatus['onDeath'] = "huntingEnemyDeath"
            }
        }
    }]
])

const effectFunctions = new Map([
    ["wet", function(time) {
        changeEnergy(-0.02 * time)
    }],
    ["poison", function(time) {
        effects['poison']['properties']['dmg'] *= effects['poison']['properties']['change']
        insertLog(`You -> ${colorGen("#ff3333", formatNumber(effects['poison']['properties']['dmg'], "round"))} ${colorGen(effectData['poison']['color'], "(Poison)")}`, null, "combat")
        changeHealth(-effects['poison']['properties']['dmg'])
        if (effects['poison']['properties']['dmg'] < 0.5) {
            changeEffect("poision", null)
        }
    }]
])

const explorePools = {
    "parkExplore": {
        "difficulty": [10, 15],
        "loot": {
            "grass": 4,
            "woodenStick": 1
        }
    },
    "forestLayer1Explore": {
        "difficulty": [15, 20],
        "loot": {
            "wood": 2,
            "woodenStick": 1
        }
    }
}

function processPlayerTurn() {
    changeEnergy(-0.05)
    const effectiveStats = {}
    for (const [stat, value] of Object.entries(battleStats)) {
        effectiveStats[stat] = value * calcStatModifier(stat)
    }
    const enemyEffectiveStats = {}
    for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
        enemyEffectiveStats[stat] = value * calcEnemyStatDebuff(stat)
    }

    let turnDmg = getBaseDamage(effectiveStats['str']) * (Math.random() * 0.4 + 0.8) * (getEquipmentStats("weapon") !== null ? getEquipmentStats("weapon")['damage'] : 1)
    let turnDmgMulti = 1
    turnDmgMulti += getSkillLevel("fighting") * 0.05
    if (equipment['weapon']) {
        turnDmgMulti += getSkillLevel(`${itemData[equipment['weapon'][0]]['subclass']}Mastery`) * 0.03
    } else {
        turnDmgMulti += getSkillLevel("unarmedMastery") * 0.03
    }

    const weaponClass = equipment['weapon'] ? itemData[equipment['weapon'][0]]['subclass'] : "unarmed"
    let classDamageModifier = 1
    if (enemyData[combatStatus['enemy']]['damageModifiers'] && enemyData[combatStatus['enemy']]['damageModifiers'][weaponClass]) {
        classDamageModifier = enemyData[combatStatus['enemy']]['damageModifiers'][weaponClass]
    }

    turnDmg = turnDmg * turnDmgMulti * classDamageModifier

    const turnDmgMitigation = calcDamageMitigation(effectiveStats['str'], enemyEffectiveStats['def'])
    const turnHitChance = calcHitChance(effectiveStats['spd'], enemyEffectiveStats['dex'])
    
    const turnActualDmg = Math.round(turnDmg * (1 - turnDmgMitigation))
    const oldEnemyHealth = combatStatus['enemyHealth']
    if (turnHitChance / 100 > Math.random()) {
        insertLog(`You -> ${colorGen("#ff3333", turnActualDmg)}${classDamageModifier > 1 ? ` ${colorGen("#ff9900", "(Weak)")}` : classDamageModifier < 1 ? ` ${colorGen("#00ff99", "(Resist)")}` : ""}`, null, "combat")
        combatStatus['enemyHealth'] -= turnActualDmg
        if (equipment['weapon']) {
            const item = equipment['weapon'][0]
            const itemId = equipment['weapon'][1]
            getEquipmentStats("weapon")['durability'] -= 1
            document.getElementById("equipment-weapon").querySelector(".bar-fill").style.width = `${getEquipmentStats("weapon")['durability'] / getEquipmentStats("weapon")['maxDurability'] * 100}%`
            if (getEquipmentStats("weapon")['durability'] <= 0) {
                insertLog(`${genItemLogText(item, null)} broke`, [itemData[item]['name'], itemData[item]['desc']])
                changeEquipment(itemId)
                changeInventory(item, -1, itemId)
            }

            if (itemData[item]['equipment']['execute']) {
                itemData[item]['equipment']['execute'](turnActualDmg)
            }

            if (skillData[`${itemData[item]['subclass']}Mastery`]) {
                changeSkill(`${itemData[item]['subclass']}Mastery`, 1)
            }
        } else {
            changeSkill("unarmedMastery", 1)
        }
        if (turnActualDmg >= combatStatus['enemyMaxHealth'] * 3) {
            giveAchievement("overkill")
        }
    } else {
        insertLog(colorGen("#aaaaaa", "You missed"), null, "combat")
    }
    changeSkill("fighting", 1)
    if (combatStatus['enemy'] === "strawDummy") {
        changeTitleXp("disciple", 1)
    } else {
        changeTitleXp("fighter", 1)
    }
    updateBar("enemyHealth", combatStatus['enemyHealth'] - oldEnemyHealth)

    if (combatStatus['enemyHealth'] <= 0) {
        if (oldEnemyHealth >= combatStatus['enemyMaxHealth']) {
            giveAchievement("flatline")
        }
        if (combatStatus['enemyStats']['str'] > 0 && combatStatus['enemyStats']['spd'] > 0) {
            if (combatStatus.tags?.['damagingHits'] === undefined) {
                giveAchievement("untouchable")
            }
            if (health / calcMaxHp() <= 0.05) {
                giveAchievement("survivor")
            }
        }
    }
}

function processEnemyTurn() {
    const effectiveStats = {}
    for (const [stat, value] of Object.entries(battleStats)) {
        effectiveStats[stat] = value * calcStatModifier(stat)
    }
    const enemyEffectiveStats = {}
    for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
        enemyEffectiveStats[stat] = value * calcEnemyStatDebuff(stat)
    }

    if (enemyEffectiveStats['str'] > 0 && enemyEffectiveStats['spd'] > 0 && combatStatus['enemyEffects']['stun'] === undefined) {
        let turnDmg = getBaseDamage(enemyEffectiveStats['str']) * (Math.random() * 0.4 + 0.8)

        const turnDmgMitigation = calcDamageMitigation(enemyEffectiveStats['str'], effectiveStats['def'])
        const turnHitChance = calcHitChance(enemyEffectiveStats['spd'], effectiveStats['dex'])
        const hitPart = getRandomItem({
            "head": 2,
            "chest": 3,
            "arms": 2,
            "legs": 1
        })
        const hitArmor = getEquipmentStats(hitPart)
        const turnArmorMitigation = hitArmor !== null ? calcArmorMitigation(turnDmg, hitArmor['armor']) : 0
        const turnActualDmg = Math.round(turnDmg * (1 - turnDmgMitigation) * (1 - turnArmorMitigation))

        if (turnHitChance / 100 > Math.random()) {
            insertLog(`${enemyData[combatStatus['enemy']]['name']} -> ${colorGen("#ff3333", turnActualDmg)}`, null, "combat")
            if (turnActualDmg >= 1) {
                const tags = (combatStatus['tags'] ??= {})
                tags['damagingHits'] = (tags['damagingHits'] ?? 0) + 1
            }

            if (enemyData[combatStatus['enemy']]['attackExecute']) {
                enemyData[combatStatus['enemy']]['attackExecute'](turnActualDmg)
            }
            changeHealth(-turnActualDmg)
            if (equipment[hitPart]) {
                const item = equipment[hitPart][0]
                const itemId = equipment[hitPart][1]
                getEquipmentStats(hitPart)['durability'] -= 1
                document.getElementById(`equipment-${hitPart}`).querySelector(".bar-fill").style.width = `${getEquipmentStats(hitPart)['durability'] / getEquipmentStats(hitPart)['maxDurability'] * 100}%`
                if (getEquipmentStats(hitPart)['durability'] <= 0) {
                    insertLog(`${genItemLogText(item, null)} broke`, [itemData[item]['name'], itemData[item]['desc']])
                    changeEquipment(itemId)
                    changeInventory(item, -1, itemId)
                }
            }
        } else {
            insertLog(colorGen("#aaaaaa", `${enemyData[combatStatus['enemy']]['name']} missed`), null, "combat")
        }
    }
}

function tick() {
    stats['playtime'] += 1
    const oldTime = time
    changeTime(currentScene !== "sleep" ? 1 : 10)
    updateBar("health")

    if (travelStatus['destination'] !== null) {
        travelStatus['completed'] += travelStatus['backwards'] !== true ? calcMovementSpeed() : -calcMovementSpeed()
        stats['distanceTravelled'] = (stats['distanceTravelled'] ?? 0) + calcMovementSpeed()
        checkAchievements(["firstSteps", "walker", "marathon"])
        changeSkill("walking", 1)
        changeTitleXp("walker", 2)
        if ((travelStatus['completed'] >= travelStatus['distance'] && travelStatus['backwards'] !== true) || (travelStatus['completed'] <= 0 && travelStatus['backwards'] === true)) {
            sceneManager(travelStatus['destination'])
            playTransition()
            travelStatus['destination'] = null
            travelStatus['distance'] = 0
            travelStatus['completed'] = 0
            travelStatus['backwards'] = false
        }
    }

    if (craftStatus['recipe'] !== null) {
        let craftingType = itemData[craftStatus['recipe']]['crafting']['type']
        if (craftingType === undefined) {
            craftStatus['completed'] += getCraftingSpeed()
            changeSkill("crafting", 1)
            changeTitleXp("crafter", 2)
        } else if (craftingType === "alchemy") {
            craftStatus['completed'] += getAlchemySpeed()
            changeSkill("alchemy", 1)
            changeTitleXp("alchemist", 2)
        }
        craftStatus['skillXp'] += 1
        if (craftStatus['completed'] >= craftStatus['goal']) {
            playTransition()
            for (const [craftingItem, amount] of Object.entries(itemData[craftStatus['recipe']]['crafting']['materials'])) {
                if (itemData[craftingItem]['stackable'] !== false) {
                    const fromInventory = Math.min(inventory[craftingItem] ?? 0, amount)
                    const fromStorage = amount - fromInventory
                    if (fromInventory > 0) {changeInventory(craftingItem, -fromInventory)}
                    if (fromStorage > 0) {changeStorage(craftingItem, -fromStorage)}
                }
            }

            for (const item of craftStatus['using']) {
                if (item['source'] === "inventory") {
                    changeInventory(inventoryNonStackable[item['id']]['name'], -1, item['id'])
                } else if (item['source'] === "storage") {
                    changeStorage(storageNonStackable[item['id']]['name'], -1, item['id'])
                }
            }

            changeInventory(craftStatus['recipe'], 1, null, null, {"ignoreWeightLimit": true})
            if (inventoryWeight > getMaxWeight() * 3) {
                const newItemData = inventoryNonStackable[inventoryNonStackableIncrement - 1]
                changeInventory(craftStatus['recipe'], -1, inventoryNonStackableIncrement - 1)
                changeStorage(craftStatus['recipe'], 1, inventoryNonStackableIncrement - 1, newItemData, true, {"targetTable": document.getElementById("storage-table-alt")})
            }
            const storedRecipe = craftStatus['recipe']
            craftStatus['recipe'] = null
            craftStatus['completed'] = 0
            craftStatus['goal'] = 0
            craftStatus['using'] = []
            craftStatus['skillXp'] = 0
            giveAchievement("crafter")
            if (!settings['autoRepeatCrafting']) {
                sceneManager("table")
            } else {
                if (beginCrafting(storedRecipe) === false) {
                    sceneManager("table")
                }
            }
        }
    }

    if (explorePools[currentScene] !== undefined) {
        if (exploreStatus['area'] === null || exploreStatus['area'] !== currentScene) {
            exploreStatus['area'] = currentScene
            exploreStatus['goal'] = randomRange(explorePools[currentScene]['difficulty'][0], explorePools[currentScene]['difficulty'][1], 0)
        }
        exploreStatus['completed'] += getExploreSpeed()
        changeSkill("exploration", 1)
        changeTitleXp("seeker", 1)
        if (exploreStatus['completed'] >= exploreStatus['goal']) {
            exploreStatus['completed'] = 0
            exploreStatus['goal'] = randomRange(explorePools[currentScene]['difficulty'][0], explorePools[currentScene]['difficulty'][1], 0)
            changeInventory(getRandomItem(explorePools[currentScene]['loot']), 1)
        }
    }

    for (const [effect, value] of Object.entries(effects)) {
        if (Number.isInteger(value['end'])) {
            if (value['end'] <= time) {
                changeEffect(effect, null)
            }
        }
    }

    // Combat
    if (combatStatus['enemy'] !== null) {
        for (const [effect, value] of Object.entries(combatStatus['enemyEffects'] || {})) {
            if (Number.isInteger(value['end'])) {
                if (value['end'] <= time) {
                    changeEnemyEffect(effect, null)
                }
            }
        }

        const effectiveStats = {}
        for (const [stat, value] of Object.entries(battleStats)) {
            effectiveStats[stat] = value * calcStatModifier(stat)
        }
        const enemyEffectiveStats = {}
        for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
            enemyEffectiveStats[stat] = value * calcEnemyStatDebuff(stat)
        }
        const playerFirst = effectiveStats['spd'] >= enemyEffectiveStats['spd']

        if (combatStatus['enemyHealth'] > 0) {
            if (playerFirst) {
                processPlayerTurn()

                if (combatStatus['enemyHealth'] <= 0) {
                    killEnemy()
                } else {
                    processEnemyTurn()
                }
            } else {
                processEnemyTurn()
                if (combatStatus['enemy']) {
                    processPlayerTurn()
                    if (combatStatus['enemyHealth'] <= 0) {
                        killEnemy()
                    }
                }
            }
        } else {
            killEnemy()
        }

        if (document.visibilityState === "hidden") {
            document.title = `Arkivia | L${xpToLevel(xp)} (${Math.floor(xpIntoLevel(xp) / xpForLevel(xpToLevel(xp)) * 100)}%) ${formatNumber(health, "round")}hp`
        }

        if (settings['mobileLayout']) {
            document.getElementById("attack-info").style.display = "block"
            document.getElementById("center").style.bottom = "225px"
        }
    } else {
        if (settings['mobileLayout']) {
            document.getElementById("attack-info").style.display = ""
            document.getElementById("center").style.bottom = ""
        }
    }

    if (noSleepTime >= 1200) {
        if (noSleepTime >= 4320) {
            changeEffect("sleepDeprived", null)
            changeEffect("extremeSleepDeprived")
        } else {
            changeEffect("sleepDeprived")
            changeEffect("extremeSleepDeprived", null)
        }
    } else {
        changeEffect("sleepDeprived", null)
        changeEffect("extremeSleepDeprived", null)
    }

    const handler = sceneTicks.get(currentScene)
    if (handler) {handler()}

    updateBattlestats()
    if (combatStatus['enemy'] !== null) {updateEnemyBattlestats()}

    for (const [action, value] of Object.entries(activeActions)) {
        if (actionData[action]['tick']) {
            actionData[action]['tick']()
        }
    }

    updateTooltip()
}

window.addEventListener("focus", function() {
    document.title = "Arkivia"
})

let tickDelay = 1000
let lastTickTime = performance.now()
function tickLoop() {
    const now = performance.now()
    const elapsed = now - lastTickTime

    if (elapsed >= tickDelay) {
        let missedTicks = Math.min(Math.floor(elapsed / tickDelay), 1000)

        for (let i = 0; i < missedTicks; i++) {
            tick()
        }

        lastTickTime = now - (elapsed % tickDelay)
    }

    setTimeout(tickLoop, Math.max(0, tickDelay - (performance.now() - lastTickTime)))
}
tickLoop()
// setInterval(tick, 1000)

setInterval(function() {
    if (saveEnabled === true && currentScene !== "intro1") {
        saveToLocal(makeSave())
        document.getElementById("last-save").textContent = `Last Save: ${new Date().toLocaleTimeString()}`
    }
}, 10000)

document.getElementById("manual-save").addEventListener("click", function() {
    if (saveEnabled === true) {
        saveToLocal(makeSave())
        document.getElementById("last-save").textContent = `Last Save: ${new Date().toLocaleTimeString()}`
    }
})

for (const elem of document.getElementById("menu-buttons-holder").children) {
    elem.addEventListener("click", function() {
        for (const elem2 of document.getElementsByClassName("sidebar-menu")) {
            if (elem2.id.replace("sidebar-menu-", "") === elem.id.replace("-button", "")) {
                elem2.style.display = "block"
            } else {
                elem2.style.display = "none"
            }
        }
        for (const elem of document.getElementById("menu-buttons-holder").children) {
            elem.style.borderColor = ""
        }
        elem.style.borderColor = "#7777cc"
    })
}

let activeTarget = null

function updateTooltip() {
    if (activeTarget) {
        const tooltipTitle = activeTarget.getAttribute("data-tooltip-title")
        let tooltipText = activeTarget.getAttribute("data-tooltip-text")
        const tooltipSpecial = activeTarget.getAttribute("data-tooltip-special")
        if (tooltipSpecial === "equipment") {
            const [item, itemId] = activeTarget.id.replace("item-", "").split("_")
            const tooltipItemData = inventoryNonStackable[itemId] || storageNonStackable[itemId]
            if (tooltipItemData !== undefined) {
                tooltipText += "<hr>"
                if (tooltipItemData['damage']) {tooltipText += `Dmg: ${colorGen("#ff0000", tooltipItemData['damage'])}\n`}
                if (tooltipItemData['durability']) {tooltipText += `Durability: ${colorGen("#ffff00", tooltipItemData['durability'])}\n`}
                if (tooltipItemData['armor']) {tooltipText += `Armor: ${colorGen("#00ffff", tooltipItemData['armor'])}\n`}
                if (itemData[item]) {tooltipText += `Weight: ${colorGen("#00ff00", `${formatNumber(itemData[item]['weight'])}g`)}\n`}
            }
        } else if (tooltipSpecial === "stat") {
            const stat = activeTarget.id.replace("stat-", "")
            const statModBreakdown = getStatModifierBreakdown(stat)
            const trainingModBreakdown = getTrainingModifierBreakdown(stat)
            if (statModBreakdown) {
                tooltipText += `<hr><b>Stat Modifiers</b>\n${statModBreakdown}`
            }
            if (trainingModBreakdown && trainingModBreakdown !== "Total: 0%") {
                tooltipText += `<hr><b>Training Modifiers</b>\n${trainingModBreakdown}`
            }

            if (stat === "str") {
                const damageBreakdown = getDamageBreakdown()
                tooltipText += `<hr><b>Damage</b>\n${damageBreakdown}`
            }
        } else if (tooltipSpecial === "item") {
            const item = activeTarget.id.replace("item-", "")
            const tooltipItemData = inventory[item] || storage[item]
            if (tooltipItemData !== undefined) {
                tooltipText += "<hr>"
                if (itemData[item]) {tooltipText += `Weight: ${colorGen("#00ff00", `${formatNumber(itemData[item]['weight'])}g`)}\n`}
            }
        } else if (tooltipSpecial === "effect") {
            const effect = activeTarget.id.replace("effect-", "")
            if (effects[effect] && effects[effect]['end']) {
                tooltipText += `<hr>Ends: ${colorGen("#ccccff", effects[effect]['end'] - time)}`
            } else if (effect === "sleepDeprived" || effect === "extremeSleepDeprived") {
                tooltipText += `<hr>Time: ${colorGen("#ccccff", formatNumber(noSleepTime))}`
            }
        } else if (tooltipSpecial === "enemyEffect") {
            const effect = activeTarget.id.replace("enemy-effect-", "")
            if (combatStatus['enemyEffects'][effect] && combatStatus['enemyEffects'][effect]['end']) {
                tooltipText += `<hr>Ends: ${colorGen("#ccccff", combatStatus['enemyEffects'][effect]['end'] - time)}`
            }
        }

        document.getElementById("tooltip-title").textContent = tooltipTitle

        if (tooltipText && tooltipText.includes("<")) {
            document.getElementById("tooltip-text").innerHTML = tooltipText
        } else {
            document.getElementById("tooltip-text").textContent = tooltipText
        }

        if (tooltipText === undefined) {
            document.getElementById("tooltip-hr").style.display = "none"
        } else {
            document.getElementById("tooltip-hr").style.display = ""
        }
    }
}

const tooltipElement = document.getElementById("tooltip")
document.addEventListener("mouseover", function(e) {
    const elem = e.target.closest("[data-tooltip-title]")
    if (!elem) return
    
    activeTarget = elem
    updateTooltip()

    const offset = 14

    const tooltipWidth = tooltipElement.offsetWidth
    const tooltipHeight = tooltipElement.offsetHeight

    let left = e.clientX + offset
    let top = e.clientY + offset

    if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - offset
    }

    if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - offset
    }

    tooltipElement.style.left = `${left}px`
    tooltipElement.style.top = `${top}px`
    tooltipElement.style.opacity = "1"
})

document.addEventListener("mouseout", function(e) {
    if (activeTarget !== undefined) {
        activeTarget = null
        tooltipElement.style.opacity = "0"
    }
})

document.addEventListener("mousemove", function(e) {
    if (!activeTarget) return

    const offset = 14

    const tooltipWidth = tooltipElement.offsetWidth
    const tooltipHeight = tooltipElement.offsetHeight

    let left = e.clientX + offset
    let top = e.clientY + offset

    if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - offset
    }

    if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - offset
    }

    tooltipElement.style.left = `${left}px`
    tooltipElement.style.top = `${top}px`
})

// Font size calc
const span = document.createElement("span")
span.textContent = "A"
span.style.fontFamily = "monospace"
span.style.fontSize = "16px"
span.style.position = "absolute"
span.style.visibility = "hidden"
document.body.appendChild(span)
const fontCharWidth = span.offsetWidth
document.body.removeChild(span)

function changeEquipment(itemId) {
    const item = inventoryNonStackable[itemId]['name']
    let itemClass = itemData[item]['equipment']['class']
    if (itemClass === "accessory") {
        if ((equipment['accessory1'] === null || equipment['accessory1'][1] === itemId) && (equipment['accessory2'] === null || equipment['accessory2'][1] !== itemId)) {itemClass = "accessory1"}
        else {itemClass = "accessory2"}
    }

    const equipmentElem = document.getElementById(`equipment-${itemClass}`)
    const textElem = equipmentElem.querySelector(".equipment-item-text")
    if (equipment[itemClass] === null || itemId !== equipment[itemClass][1]) {
        if (equipment[itemClass] !== null && itemId !== equipment[itemClass][1]) {
            document.getElementById(`item-${equipment[itemClass][0]}_${equipment[itemClass][1]}`).querySelector(".item-equipped").remove()
            if (itemData[item]['equipment']['unequipExecute']) {itemData[item]['equipment']['unequipExecute']()}
        }
        equipment[itemClass] = [item, itemId]
        if (itemData[item]['name'].length * fontCharWidth > 140) {
            textElem.style.fontSize = `${Math.floor(16 * (144 / (itemData[item]['name'].length * fontCharWidth)))}px`
        }
        textElem.textContent = itemData[item]['name']
        textElem.style.color = "var(--color)"
        equipmentElem.querySelector(".bar-fill").style.width = `${inventoryNonStackable[itemId]['durability'] / inventoryNonStackable[itemId]['maxDurability'] * 100}%`
        const inventorySlot = document.getElementById(`item-${item}_${itemId}`)
        if (inventorySlot) {
            const itemEquipped = document.createElement("span")
            itemEquipped.className = "item-equipped"
            itemEquipped.textContent = "E"

            inventorySlot.appendChild(itemEquipped)
        }

        if (itemData[item]['equipment']['equipExecute']) {itemData[item]['equipment']['equipExecute']()}
    } else {
        equipment[itemClass] = null
        textElem.textContent = equipmentElem.getAttribute("data-tooltip-title")
        textElem.style.fontSize = ""
        textElem.style.color = ""
        equipmentElem.querySelector(".bar-fill").style.width = "0"

        document.getElementById(`item-${item}_${itemId}`).querySelector(".item-equipped").remove()
        if (itemData[item]['equipment']['unequipExecute']) {itemData[item]['equipment']['unequipExecute']()}
    }
}

function hasEquipment(item) {
    const itemClass = itemData[item]?.['equipment']?.['class']
    if (!itemClass) {return false}
    if (itemClass === "accessory") {
        if (equipment['accessory1']?.[0] === item || equipment['accessory2']?.[0] === item) {
            return true
        }
    } else {
        if (equipment[itemClass]?.[0] === item) {
            return true
        }
    }

    return false
}

let moveMulti = 1

function setMulti(newMulti) {
    if (newMulti !== moveMulti) {
        moveMulti = newMulti
        return true
    } else {
        moveMulti = 1
        return false
    }
}

document.getElementById("inventory-10x").addEventListener("click", function() {
    for (const element of document.getElementById("multi-holder").children) {
        element.classList.remove("selected")
    }
    this.classList.toggle("selected", setMulti(10))
})

document.getElementById("inventory-100x").addEventListener("click", function() {
    for (const element of document.getElementById("multi-holder").children) {
        element.classList.remove("selected")
    }
    this.classList.toggle("selected", setMulti(100))
})

document.getElementById("inventory-all").addEventListener("click", function() {
    for (const element of document.getElementById("multi-holder").children) {
        element.classList.remove("selected")
    }
    this.classList.toggle("selected", setMulti(1e9))
})

function craftingClickHandler(item, itemId, source) {
    if (craftStatus['required'][item] !== undefined) {
        const inventorySlot = document.getElementById(`${source === "storage" ? "storage-" : ""}item-${item}_${itemId}`)
        const selectedIndex = craftStatus['using'].findIndex(selected => selected['id'] === itemId)
        if (selectedIndex === -1) {
            if (craftStatus['required'][item] > 0) {
                if (itemData[item]['equipment']) {
                    if (equipment[itemData[item]['equipment']['class']] !== undefined && equipment[itemData[item]['equipment']['class']] && equipment[itemData[item]['equipment']['class']][1] === itemId) {
                        return
                    }
                }

                if (inventorySlot) {
                    const itemSelected = document.createElement("span")
                    itemSelected.className = "item-selected"
                    itemSelected.textContent = "S"

                    inventorySlot.appendChild(itemSelected)
                }
                craftStatus['using'].push({
                    "source": source,
                    "id": itemId
                })
                craftStatus['required'][item] -= 1
            }
        } else {
            craftStatus['using'].splice(selectedIndex, 1)
            craftStatus['required'][item] += 1
            inventorySlot.getElementsByClassName("item-selected")[0].remove()
        }
        let outputString = Object.entries(craftStatus['required']).filter(([item, amount]) => amount > 0).map(([item, amount]) => `- x${amount} ${itemData[item]['name']}`).join("\n")
        if (outputString !== "") {
            processText(`Choose\n${outputString}\nfrom your inventory or storage\n\n{Cancel|table|0|cancelCrafting}`)
        } else {
            processText(`{Confirm|craftConfirm}\n\n{Cancel|table|0|cancelCrafting}`)
        }
    }
}

document.getElementById("inventory-table").addEventListener("click", function(e) {
    if (storageAccess) {return}
    let [item, itemId] = e.target.closest("[id^=\"item-\"]").id.replace("item-", "").split("_")

    if (discardMode === true) {
        if (item !== null) {
            if (itemData[item]['undeletable']) {
                insertLog("You probably shouldn't throw this away")
                return
            }
            const deleteCount = itemId !== undefined ? 1 : Math.min(inventory[item], moveMulti)
            changeInventory(item, -deleteCount, itemId)
            if (itemLogStackData['type'] !== "discard" || itemLogStackData['item'] !== item) {
                itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
            }
            itemLogStackData['amount'] += deleteCount
            itemLogStackData['id'] = insertLog(`Discarded ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
            itemLogStackData['type'] = "discard"
            itemLogStackData['item'] = item

            stats['itemsDeleted'] = (stats['itemsDeleted'] ?? 0) + deleteCount
            checkAchievement("wasteful")
        }
        return
    }

    if (craftingSelection === true) {
        craftingClickHandler(item, itemId, "inventory")
        return
    }

    if (item !== null) {
        if (itemData[item]['execute']) {
            if (itemData[item]['execute']() !== false) {
                changeInventory(item, -1, null, null, {"announceReduction": true})
            }
        } else if (itemData[item]['equipment']) {
            changeEquipment(itemId)
        }
    }
})

document.getElementById("storage-table-alt").addEventListener("click", function(e) {
    let [item, itemId] = e.target.closest("[id^=\"storage-item-\"]").id.replace("storage-item-", "").split("_")
    if (craftingSelection === true) {
        craftingClickHandler(item, itemId, "storage")
    }
})

document.getElementById("inventory-discard").addEventListener("click", function(e) {
    if (discardMode === false) {
        discardMode = true
        document.getElementById("inventory-discard").style.backgroundColor = "#ff0000"
        document.getElementById("inventory-discard").style.color = "#000000"
        document.getElementById("inventory-table").style.setProperty("--hover-background", "#aa4444")
    } else {
        discardMode = false
        document.getElementById("inventory-discard").style.backgroundColor = ""
        document.getElementById("inventory-discard").style.color = ""
        document.getElementById("inventory-table").style.removeProperty("--hover-background")
    }
})

function getTotalBattlestats() {
    return battleStats['str'] + battleStats['def'] + battleStats['spd'] + battleStats['dex']
}

function changeTitle(newTitle) {
    playerTitle = newTitle
    document.getElementById("title").textContent = playerTitle
    insertLog(`Title Changed: ${colorGen("#dd8833", `"${playerTitle}"`)}`)
}

function genTrainingAreaText(target) {
    return `{![dumbbells.png]Train Strength|${target}_str}\n{![shield.png]Train Defense|${target}_def}\n{![treadmill.png]Train Speed|${target}_spd}\n{![dexterity.png]Train Dexterity|${target}_dex}`
}

function genQuestGiver(checkId, actionTexts, questList) {
    let allComplete = true
    for (let i = 0; i < questList.length; i++) {
        if (!completedQuests.includes(questList[i]['quest'])) {
            allComplete = false
        }
        
        if ((completedQuests.includes(questList[i]['quest']) || metQuests[questList[i]['quest']]) && (questProgression[checkId] === undefined || questProgression[checkId] < i)) {
            const quest = questList[i]

            if (metQuests[quest['quest']]) {
                delete metQuests[quest['quest']]
                giveQuest(quest['quest'], true)
            }

            questProgression[checkId] = i
            if (questList[i + 1] !== undefined && questList[i + 1]['introMessage'] === undefined) {
                giveQuest(questList[i + 1]['quest'])
            }
            if (quest['rewards']) {
                for (const [item, amount] of Object.entries(quest['rewards'])) {
                    changeInventory(item, amount, null, null, {"ignoreWeightLimit": true})
                }
            }
            if (quest['money']) {
                changeMoney(quest['money'])
            }

            if (quest['consumed']) {
                for (const [item, amount] of Object.entries(quest['consumed'])) {
                    changeInventory(item, -amount)
                }
            }

            if (quest['completeExecute']) {
                quest['completeExecute']()
            }

            return quest['message']
        } else if (questList[i]['introMessage'] !== undefined && (i === 0 || completedQuests.includes(questList[i - 1]['quest'])) && !quests[questList[i]['quest']] && !completedQuests.includes(questList[i]['quest'])) {
            const quest = questList[i]
            if (quest['requirements']) {
                for (const requirement of quest['requirements']) {
                    if (!requirement['check']()) {
                        return requirement['message']
                    }
                }
            }
            giveQuest(quest['quest'])
            return quest['introMessage']
        }
    }
    if (allComplete === false) {
        return actionTexts['none']
    } else {
        return actionTexts['allComplete'] || actionTexts['none']
    }
}

function changeEquipmentDurability(selected, change) {
    const item = equipment[selected][0]
    const itemId = equipment[selected][1]
    getEquipmentStats(selected)['durability'] -= 1
    document.getElementById(`equipment-${selected}`).querySelector(".bar-fill").style.width = `${getEquipmentStats(selected)['durability'] / getEquipmentStats(selected)['maxDurability'] * 100}%`
    if (getEquipmentStats(selected)['durability'] <= 0) {
        insertLog(`${genItemLogText(item)} broke`, [itemData[item]['name'], itemData[item]['desc']])
        changeEquipment(itemId)
        changeInventory(item, -1, itemId)
        return true
    }
}

function changePrependText(text) {
    let prependTextElement = document.getElementById("prepend-text")

    if (text === "" || text === undefined && prependTextElement) {
        currentPrependText = text
        prependTextElement.remove()
        return
    }

    if (prependTextElement === null) {
        prependTextElement = document.createElement("div")
        prependTextElement.id = "prepend-text"
        prependTextElement.className = "main-text"
        mainElement.prepend(prependTextElement)
    }
    if (currentPrependText !== text) {
        currentPrependText = text
        prependTextElement.innerHTML = text
    }
}

let activeActions = {}
const actionData = {
    "chopTrees": {
        "name": "Chop Trees",
        "enable": function() {
            startProcess("chop", randomRange(20, 30, 0))
            changePrependText(`You are chopping a tree${processingGen()}\n\n`)
        },
        "disable": function() {
            if (processStatus['type'] === "chop") {
                stopProcess()
                changePrependText()
            }
        },
        "tick": function() {
            if (processStatus['type'] === "chop") {
                if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "axe") {
                    changePrependText(`You are chopping a tree${processingGen()}\n\n`)
                    processStatus['completed'] += getChoppingSpeed()
                    changeEquipmentDurability("tool", -1)

                    changeSkill("felling", 1)
                    changeTitleXp("lumberjack", 1)

                    if (processStatus['completed'] >= processStatus['goal']) {
                        startProcess("chop", randomRange(20, 30, 0))
                        changeInventory("wood", randomRange(1, 2, 0))
                        if (randomRange(1, 10, 0) === 1) {
                            changeInventory("apple", 1)
                        }
                        stats['treesCut'] = (stats['treesCut'] ?? 0) + 1
                        checkAchievement("deforestation")
                    }
                } else {
                    changePrependText(`You need an axe to chop trees.\n\n`)
                }
            }
        }
    }
}

function generateActions() {
    const actions = []
    const possibleActions = []
    const routes = []
    if (currentScene === "forestLayer1") {
        if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "axe") {
            actions.push("chopTrees")
        } else {
            for (const tool of Object.values(inventoryNonStackable)) {
                if (itemData[tool['name']]['subclass'] === "axe") {
                    possibleActions.push("chopTrees")
                    break
                }
            }
        }
    }

    if (settings['routeRecordings'] && !settings['skipTravel']) {
        for (let i = 0; i < settings['routeRecordings'].length; i++) {
            const route = settings['routeRecordings'][i]
            if (currentScene === route[0] || currentScene === route.at(-1) || i === routeData['routeIndex']) {
                routes.push({
                    "route": route,
                    "enabled": i === routeData['routeIndex'],
                    "routeIndex": i
                })
            }
        }
    }

    document.getElementById("center-bottom").replaceChildren()
    for (const action of actions) {
        const actionButton = document.createElement("button")
        actionButton.className = "action-button"
        actionButton.textContent = actionData[action]['name']

        actionButton.addEventListener("click", function() {
            if (activeActions[action] === undefined) {
                activeActions[action] = true
                actionData[action]['enable']()
                actionButton.classList.add("enabled")
            } else {
                delete activeActions[action]
                actionData[action]['disable']()
                actionButton.classList.remove("enabled")
            }
        })

        if (activeActions[action]) {
            actionButton.classList.add("enabled")
        }

        document.getElementById("center-bottom").appendChild(actionButton)
    }

    for (const action of possibleActions) {
        const actionButton = document.createElement("button")
        actionButton.className = "action-button disabled"
        actionButton.textContent = actionData[action]['name']

        document.getElementById("center-bottom").appendChild(actionButton)
    }

    for (const route of routes) {
        const actionButton = document.createElement("button")
        actionButton.className = "route-button"
        actionButton.textContent = currentScene === route['route'][0] ? camelToTitle(route['route'].at(-1)) : camelToTitle(route['route'][0])
        
        actionButton.addEventListener("click", function() {
            if (routeData['routeIndex'] === route['routeIndex']) {
                endRoute()
                actionButton.classList.remove("enabled")
                if (currentScene !== route['route'][0] && currentScene !== route['route'].at(-1)) {
                    actionButton.remove()
                }
            } else if (!travelStatus['destination'] && (currentScene === route['route'][0] || currentScene === route['route'].at(-1))) {
                routeData['enabled'] = true
                routeData['route'] = currentScene === route['route'][0] ? route['route'] : [...route['route']].reverse()
                routeData['routeIndex'] = route['routeIndex']
                routeData['index'] = 0
                actionButton.classList.add("enabled")
                const splitLinks = [...sceneText.matchAll(linkRegex)]
                for (const splitLink of splitLinks) {
                    if (splitLink[2] === routeData['route'][routeData['index'] + 1]) {
                        processLinkClick(...splitLink.slice(1, 6))
                        routeData['index'] += 1
                    }
                }
            }
        })
        
        if (route['enabled']) {
            actionButton.classList.add("enabled")
        }
        document.getElementById("center-bottom").appendChild(actionButton)
    }
}

const sceneProperties = {
    "housingArea": ["outdoors"],
    "townCenter": ["outdoors"],
    "noticeBoard": ["outdoors"],
    "trainingGrounds": ["outdoors"],
    "trainingGroundsInstructor": ["outdoors"],
    "trainingGroundsInstructor_askStats": ["outdoors"],
    "trainingGrounds_str": ["outdoors"],
    "trainingGrounds_def": ["outdoors"],
    "trainingGrounds_spd": ["outdoors"],
    "trainingGrounds_dex": ["outdoors"],
    "trainingGroundsTeamIntro1": ["outdoors"],
    "dojoYard": ["outdoors"],
    "dojoGolems": ["outdoors"],
    "dojo_golemFight": ["outdoors"],
    "alley": ["outdoors"],
    "townNorth": ["outdoors"],
    "park": ["outdoors"],
    "parkExplore": ["outdoors"],
    "townGatesNorth": ["outdoors"],
    "townGatesNorthExterior": ["outdoors"],
    "grassPlains": ["outdoors"],
    "forestLayer1": ["outdoors"],
    "forestLayer1Explore": ["outdoors"],
    "forestHunt": ["outdoors"],
    "forestLayer1Clear": ["outdoors"],
    "forestLayer2": ["outdoors"],
    "forestMineEntrance": ["outdoors"]
}

const sceneRegions = {
    "intro1": "starterTown",
    "home": "starterTown",
    "sleep": "starterTown",
    "storage": "starterTown",
    "table": "starterTown",
    "housingArea": "starterTown",
    "townCenter": "starterTown",
    "noticeBoard": "starterTown",
    "trainingGrounds": "starterTown",
    "dojo": "starterTown",
    "dojoYard": "starterTown",
    "hospital": "starterTown",
    "alley": "starterTown",
    "merchant": "starterTown",
    "townNorth": "starterTown",
    "park": "starterTown",
    "weaponShop": "starterTown",
    "theArenaEntrance": "starterTown",
    "townGatesNorth": "starterTown",
    "townGatesNorthExterior": "wilderness",
    "grassPlains": "wilderness",
    "forestLayer1": "forest",
    "huntersGuild": "forest",
    "huntersGuildHeal": "forest",
    "forestLayer2": "forest",
    "forestMine": "forest",
    "forestGym": "forest"
}

class scenes {
    static empty() {
        return ``
    }

    static craftConfirm() {
        const item = craftStatus['selected']
        craftStatus['selected'] = null
        craftingSelection = false
        let craftingType = itemData[item]['crafting']['type']
        let arrival
        if (craftingType === undefined) {
            arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getCraftingSpeed())
        } else if (craftingType === "alchemy") {
            arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getAlchemySpeed())
        }
        craftStatus['completed'] = 0
        craftStatus['goal'] = itemData[item]['crafting']['complexity']
        craftStatus['recipe'] = item
        return `You are crafting "${itemData[item]['name']}". You'll finish at ${colorGen("#ccccff", formatTime(arrival, true))}${processingGen()}\n\n{Cancel|table|0|cancelCrafting}`
    }

    static intro1() {
        return `"Hello?"\n\n{Next|intro2}`
    }

    static intro2() {
        return `"You all right?"\n\n{Get up|intro3}`
    }

    static intro3() {
        return `"Oh good, you're awake... You might feel a bit disorientated. That's expected."\n\n{Next|intro4}`
    }

    static intro4() {
        return `"There has been an incident occurring recently which caused humans from other dimensions to warp here. We haven't identified the cause yet and I'm afraid you're stuck here for now."\n\n{Next|intro5}`
    }

    static intro5() {
        return `"Not to worry as the leader of our town offers housing to all affected by this incident."\n\n{Next|intro6}`
    }

    static intro6() {
        return `"I have others to check on. Someone else will take you from here."\n\nThey gesture toward a man of average height in a gray coat.\n\n{Approach the man|intro7}`
    }

    static intro7() {
        return `You approach the man.\n\nHe gives a brief nod.\n\n"Name's Alan. I'll show you where you're staying."\n\n{Follow him|intro8}`
    }

    static intro8() {
        return `You follow Alan until he reaches a small wooden house. He gestures for you to head inside.\n\n{![enter.png]Enter|intro9}`
    }

    static intro9() {
        changeTitle("Newcomer")
        return `The house is small.\n\nThin walls. Wooden floor. One bed. One table.\n\n"It's yours. Nothing much but it's better than nothing."\n\n{Next|intro10}`
    }

    static intro10() {
        return `"You can walk around town if you want. Just don't go past the outer fence. It's not safe."\n\nHe leaves without waiting.\n\n{Next|home}`
    }

    static home() {
        return `You are in your home. You can rest here.\n\n{![bed.png]Sleep|sleep}\n{![storage.png]Storage|storage}\n{![table.png]Crafting Table|table}\n\n{![leave.png]Leave|housingArea}`
    }

    static sleep() {
        stats['timeAwake'] = 0
        return `You are currently sleeping. Time passes faster${processingGen()}\n\n{![leave.png]Get up|home}`
    }

    static storage() {
        return `You can store items here for future use.\n\n{![leave.png]Leave|home|0|leaveStorage}`
    }

    static table() {
        return `You are able to craft items here.\n${colorGen("#cccccc", `(You can enable bulk crafting for most items in the settings menu under gameplay)`)}\n\n{![leave.png]Leave|home|0|leaveCrafting}`
    }

    static housingArea() {
        return `You are in the housing area of the town. You can access your home or other areas from here.\n\n{![enter.png]Home|home}\n\n{![town_center.png]Town Center|townCenter|250}`
    }

    static townCenter() {
        return `You are at the center of the town. Many people rush by hastily.\n\n{![poster.png]Notice Board|noticeBoard}\n{![dumbbells.png]Training Grounds|trainingGrounds}\n{![training_dummy.png]Dojo|dojo}\n\n{![hospital.png]Hospital|hospital}\n{![dollar.png]Merchant|merchant}\n\n{![alley.png]Alley|alley}\n\n{![arrow_up.png]Town North|townNorth|250}\n{![wood_door.png]Housing Area|housingArea|250}`
    }

    static noticeBoard() {
        return `There is nothing of interest to you here.\n\n{![leave.png]Return|townCenter}`
    }

    static trainingGrounds() {
        if (!checks['trainingGroundsTeamIntro'] && getTotalBattlestats() >= 10) {
            checks['trainingGroundsTeamIntro'] = true
            return `"Hi! we're an up-and-coming fighting team for matches in The Arena. If you're willing to represent our team, we'll give you various supplies and equipment to help you improve your stats quickly. Sounds good?"\n\n{![tick.png]Yes|trainingGroundsTeamIntro1}\n\n{![cross.png]Maybe Later|trainingGrounds}`
        }

        let r = `You are in the training grounds. You are able to improve your strength, defense, speed or dexterity here.\n\n{![chat.png]Training Instructor|trainingGroundsInstructor}`
        if (checks['trainingGroundsTeamIntro'] && team !== "nextLevel") {
            r += `\n\n{![tick.png]Join Team|trainingGroundsTeamIntro1}`
        }
        
        if (team === "nextLevel") {
            r += `\n\n{Team Tent|trainingGrounds_nextLevel}`
        } else {
            r += `\n\n${genTrainingAreaText("trainingGrounds")}`
        }
        r += `\n\n{![leave.png]Leave|townCenter}`
        return r
    }

    static trainingGroundsInstructor() {
        return `{![chat.png]Ask about stats|trainingGroundsInstructor_askStats}\n\n{![leave.png]Return|trainingGrounds}`
    }

    static trainingGroundsInstructor_askStats() {
        return `"Everyone has four main stats. Strength increases the damage you deal, Defense reduces the damage you take, Speed increases your chances of hitting and Dexterity increases the chance of dodging attacks."\n\n{![leave.png]Return|trainingGroundsInstructor}`
    }

    static trainingGrounds_str() {
        return `You are doing push-ups in the training grounds${processingGen()}\n\n{![stop.png]Stop|trainingGrounds}`
    }

    static trainingGrounds_def() {
        return `You are practicing bracing in the training grounds${processingGen()}\n\n{![stop.png]Stop|trainingGrounds}`
    }

    static trainingGrounds_spd() {
        return `You are practicing speed punching in the training grounds${processingGen()}\n\n{![stop.png]Stop|trainingGrounds}`
    }

    static trainingGrounds_dex() {
        return `You are balancing on a beam in the training grounds${processingGen()}\n\n{![stop.png]Stop|trainingGrounds}`
    }

    static trainingGroundsTeamIntro1() {
        return `"Awesome! I'll tell you everything you need to know. Follow me."\n\n{Next|trainingGroundsTeamIntro2}`
    }

    static trainingGroundsTeamIntro2() {
        return `You follow the young man in to a large tent on the field.\n\n"This is the tent with all our special training equipment and staff. Training here would be double as effective than the public equipment."\n\n{Next|trainingGroundsTeamIntro3}`
    }

    static trainingGroundsTeamIntro3() {
        return `"We give rewards like exercise pills depending on how well you place in the weekly arena matches. On top of that, you also gain money from the competition organisers themselves."\n\n{Next|trainingGroundsTeamIntro4}`
    }

    static trainingGroundsTeamIntro4() {
        changeInventory("exercisePill", 4, null, null, {"ignoreWeightLimit": true})
        team = "nextLevel"
        return `"Arena matches always run on a Sunday, I suggest beginning your training now. Here are 4 exercise pills as a thanks for joining us."\n\n{Next|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel() {
        let r = `You are inside your team's tent.`
        if (checks['nextLevelExercisePills']) {r += `\n\n{Claim Exercise Pills|trainingGrounds_nextLevel|0|nextLevelClaimExercisePill}`}
        r += `\n\n${genTrainingAreaText("trainingGrounds_nextLevel")}\n\n{![leave.png]Leave|trainingGrounds}`
        return r
    }

    static trainingGrounds_nextLevel_str() {
        return `You are lifting weights in your team's tent${processingGen()}\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_def() {
        return `You are practicing sparring against a team member${processingGen()}\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_spd() {
        return `You are practicing spot jogging in your team's tent${processingGen()}\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_dex() {
        return `You are practicing dodging punches from a team member${processingGen()}\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static dojo() {
        if (checks['dojo'] === undefined) {
            checks['dojo'] = true
            return `As you walk into the dojo, an old man greets you.\n\n"Welcome to the dojo. This is the main place in town where fighters of all classes come to train their fighting skills."\n\n{Next|dojo}`
        } else {
            let r = `You are in the dojo.\n\n{![chat.png]Dojo Instructor|dojoInstructor}\n{![sword.png]Practice fighting a training dummy|dojo_trainingDummy}\n\n` 
            if (quests['dojoIntro4'] || completedQuests.includes("dojoIntro4")) {r += `{![park.png]Yard|dojoYard}`}
            r += `\n{![leave.png]Leave|townCenter}`
            return r
        }
    }

    static dojo_trainingDummy() {
        generateEnemy("strawDummy")
        if (checks['firstDummy'] !== true) {combatStatus['onDeath'] = "firstTrainingDummy"}
        return `You are practicing fighting against training dummies${processingGen()}\n\n{![stop.png]Stop|dojo|0|endFight}`
    }

    static dojoQuestIntro() {
        checks['firstDummy'] = true
        return `As you defeat your first training dummy, the instructor walks towards you.\n\n"You're not from around here are you? You seem like you're from another world but I can see potential."\n\n{Next|dojoQuestIntro2}`
    }

    static dojoQuestIntro2() {
        giveQuest("dojoIntro1")
        if (battleStats['str'] < 1.5) {
            return `"I'm willing to guide you in order to become stronger. But first, you need to reach the goal of 1.5 strength and destroy 5 straw dummies. Come talk to me again once you're done."\n\n{![leave.png]Return|dojo}`
        } else {
            return `"I'm willing to guide you in order to become stronger. But first, you need to destroy 5 straw dummies. Come talk to me again once you're done."\n\n{![leave.png]Return|dojo}`
        }
    }

    static dojoInstructor() {
        return `"Need something?"\n\n{![poster.png]Quest Completion|dojoInstructorQuest}\n\n{![leave.png]Return|dojo}`
    }

    static dojoInstructorQuest() {
        return genQuestGiver("dojo", {"none": `"You don't seem to have completed any new quests."\n\n{![leave.png]Return|dojoInstructor}`}, [
            {
                "quest": "dojoIntro1",
                "rewards": {
                    "exercisePill": 1
                },
                "message": `"Good job, you've proven that you're able to do some basic fighting. Unlike real enemies, these dummies don't fight back or move. For your next task: get all your battle stats to 1.5. Then I can give you some real enemies to fight."\n\n{![leave.png]Return|dojo}`
            },
            {
                "quest": "dojoIntro2",
                "rewards": {
                    "exercisePill": 1
                },
                "message": `"You now have some decent stats, still below the average human in this world but you should now be able do my next quest without issue. Your goal is to defeat 10 mice in the alleys. Visit the hospital if your health drops too low. If you struggle to defeat the mice, I suggest training a bit more."\n\n{![leave.png]Return|dojo}`
            },
            {
                "quest": "dojoIntro3",
                "rewards": {
                    "exercisePill": 2
                },
                "message": `"Good job, you've proven that you're able to fight real enemies now. Although only small ones, it's still progress. Your next task is to defeat the wooden golem located in the dojo yard. This is significantly harder than the mice but you'll only have to defeat one of them."\n\n{![leave.png]Return|dojo}`
            },
            {
                "quest": "dojoIntro4",
                "rewards": {
                    "exercisePill": 5
                },
                "message": `"Congratulations on beating the golem, there are more available for you to fight if you wish. For my final quest: I want you to reach 10 in every stat. Upon completion you'll gain permission to explore outside of the town. This may take you a while and I wouldn't expect you to complete it quickly. You can continue exploring other areas inside the town while working your way towards completion."\n\n{![leave.png]Return|dojo}`
            },
            {
                "quest": "dojoIntro5",
                "rewards": {
                    "exercisePill": 7
                },
                "message": `"This is the end of my questline for now, you are free to explore outside the town but be careful as there are stronger enemies around."\n\n{![leave.png]Return|dojo}`
            }
        ])
    }

    static dojoYard() {
        return `You are in the yard of the dojo.\n\n{![training_dummy.png]Golems|dojoGolems}\n\n{![leave.png]Return|dojo}`
    }

    static dojoGolems() {
        const golemText = [
            `{Wood Golem|dojo_golemFight|0|generateEnemy(woodGolem,woodGolem)}\n`,
            `{Stone Golem|dojo_golemFight|0|generateEnemy(stoneGolem,stoneGolem)}\n`,
            `{Coal Golem|dojo_golemFight|0|generateEnemy(coalGolem,coalGolem)}\n`
        ]
        let r = `{Straw Golem|dojo_golemFight|0|generateEnemy(strawGolem,strawGolem)}\n`
        for (let i = 0; i < checks['golemMax'] || 0; i++) {
            r += golemText[i]
        }
        r += `\n{![leave.png]Return|dojoYard}`
        return r
    }

    static dojo_golemFight() {
        return `You are fighting a golem${processingGen()}\n\n{![leave.png]Return|dojoYard|0|endFight}`
    }

    static hospital() {
        if (health < calcMaxHp()) {
            return `You are getting healed by a doctor${processingGen()}\n\n{![leave.png]Leave|townCenter}`
        } else {
            return `You are already at maximum health.\n\n{![leave.png]Leave|townCenter}`
        }
    }

    static alley() {
        if (!quests['dojoIntro3'] && !completedQuests.includes("dojoIntro3")) {
            return `"Sorry, no civilians allowed here. We have an infestation problem."\n\n{![leave.png]Leave|townCenter}`
        } else {
            generateEnemy("mouse")
            return `You are in the alley. There are mice and rats everywhere.\n\n{![leave.png]Leave|townCenter|0|endFight}`
        }
    }

    static merchant() {
        let r = `"Welcome! I'm the main supplier of various goods in this town. I can also buy any straw baskets that you may have. Feel free to look around."`
        if (quests['els3'] && !metQuests['els3']) {r += `\n\n{![chat.png]Request for supplies|merchantGuildQuestSupplies}`}
        r +=  `\n\n{![dollar.png]Sell|merchantSell}\n\n{![leave.png]Leave|townCenter}`
        return r
    }

    static merchantSell() {
        if (inventory['strawBasket'] === undefined) {
            return `"It appears that you don't have any straw baskets to sell. Come back when you get some, I pay $5 for each."\n\n{![leave.png]Return|merchant}`
        } else {
            return `"Would you like to sell all your straw baskets for a total of ${colorGen("#cccc55", `$${inventory['strawBasket'] * 5}`)}?"\n\n{![tick.png]Yes|merchant|0|merchantSell}\n\n{![leave.png]Return|merchant}`
        }
    }

    static merchantGuildQuestSupplies() {
        changeInventory("huntersGuildSupplies", 1, null, null, {"ignoreWeightLimit": true})
        return `"Ah, Els sent you right? Here, take this."\n\nYou pick up the heavy box the merchant hands you.\n\n{Next|merchant}`
    }

    static townNorth() {
        return `You are at the north of the town. This area is commonly used for entertainment activites.\n\n{![park.png]Park|park}\n{![sword.png]Weapon Shop|weaponShop}\n{![sword.png]The Arena|theArenaEntrance}\n\n{![leave.png]Town Gates|townGatesNorth|250}\n{![town_center.png]Town Center|townCenter|250}`
    }

    static park() {
        return `You are in the park. Various trees and plants are scattered around.\n\n{![search.png]Explore|parkExplore}\n\n{![leave.png]Leave|townNorth}`
    }

    static parkExplore() {
        return `You are searching for valuable objects in the park${processingGen()}\n\n{![stop.png]Stop|park}`
    }

    static weaponShop() {
        return `"Welcome to my weapon shop, I craft and import weapons from various places. Don't think about stealing, you are in a weapon shop after all."\n\n{![leave.png]Leave|townNorth}`
    }

    static theArenaEntrance() {
        arenaData = {}
        let r = `You are in the entrance of the arena.`
        r += getDayName() === "Sunday" ? ` It's quite crowded with many people rushing to join the queue for tickets.${checks['arenaParticipated'] === undefined ? "\n\n{![sword.png]Participate|theArenaSignup}" : ""}` : " It's quite empty, more people would be here on a Sunday."
        r += `\n\n{![leave.png]Leave|townNorth}`
        return r
    }

    static theArenaSignup() {
        let r = `You join the signup queue and patiently wait for your turn.\n\n`
        r += getTotalBattlestats() >= 20 ? `"Hello, would you like to participate in the matches?"\n\n{![tick.png]Yes|theArenaSignupIntro1}\n{![cross.png]No|theArenaEntrance}` : `"Unfortunately you do not meet the minimum requirements. Come back when you have a rank of ${colorGen("#88bb00", "G+")} or higher."\n\n{![leave.png]Leave|theArenaEntrance}`
        return r
    }

    static theArenaSignupIntro1() {
        return `"Great, please head towards the doors over there."\n\n{![enter.png]Enter|theArenaSignupIntro2}`
    }

    static theArenaSignupIntro2() {
        arenaData['round'] = 1
        checks['arenaParticipated'] = true
        return `"Welcome to The Arena, fighter. You will be participating in a series of matches against opponents that get increasingly stronger with one loss resulting in elimination. This is the biggest event in this town with hundreds of participants and thousands of spectators. You get up to a 60 minute break after every match. Best of luck, you can begin when you're ready."\n\n{![enter.png]Begin|theArenaWalkIn}`
    }

    static theArenaWalkIn() {
        delete arenaData['endTime']
        if (arenaData['round'] > arenaStatData.length) {
            return `While walking in to the arena, the organiser stops you with his arm. "This is the end currently, it would be ill advised to proceed. The person who built this place has stated that there is nothing remaining to achieve for now."\n\n{![leave.png]Resign|theArenaEntrance|0|theArenaResign}`
        } else {
            return `You walk into the arena and prepare to fight your opponent.\n\nThe organiser shouts, "This is round ${arenaData['round']}, get ready."\n\n{![sword.png]Fight|theArenaFight}`
        }
    }

    static theArenaFight() {
        const newStats = arenaStatData[arenaData['round'] - 1]
        if (newStats['enemyType'] === undefined) {
            generateEnemy("human", {
                "health": newStats['health'],
                "str": newStats['stats'],
                "def": newStats['stats'],
                "spd": newStats['stats'],
                "dex": newStats['stats']
            })
        } else {
            generateEnemy(newStats['enemyType'])
        }
        combatStatus['onDeath'] = "arenaWinMatch"
        return `You are currently fighting your opponent in The Arena${processingGen()}\n\n{![shield.png]Surrender|theArenaEntrance|0|theArenaResign}`
    }

    static theArenaWinMatch() {
        let r = ""
        if (team === "nextLevel" && checks['nextLevelCongrats'] === false) {
            r += `A member of your team runs towards you\n\n"Congrats on winning your first match, you did great in there"\n\n`
            checks['nextLevelCongrats'] = true
        } else {
            r += `"Good job contestant on winning your ${englishifyNumber(arenaData['round'])} round, the next round will begin shortly."`
        }
        r += `\n\n{![enter.png]Begin Immediately|theArenaWalkIn}\n\n{![hospital.png]Medbay|theArenaMedbay}\n\n{![leave.png]Resign|theArenaEntrance|0|theArenaResign}`
        return r
    }

    static theArenaMedbay() {
        let r = ""
        if (health < calcMaxHp()) {
            r += `You are getting healed by a doctor${processingGen()}`
        } else {
            r += `You are already at maximum health.`
        }
        r += `\n\n{![leave.png]Leave|theArenaWinMatch}`
        return r
    }

    static townGatesNorth() {
        let r = `You are standing in front of the town gates.\n\n`
        r += completedQuests.includes("dojoIntro5") || checks['townLeavePerms'] ? `"You have permission to leave the town if you wish. You can come back at any time."\n\n{![leave.png]Leave the town|townGatesNorthExterior}` : `"You're too weak to leave the town on your own, it would be reckless of us to let you through."`
        if (getTotalBattlestats() >= 100 && !(completedQuests.includes("dojoIntro5") || checks['townLeavePerms'])) {r += `\n\n{Prove them wrong|townGatesNorthProveWrong}`}
        r += `\n\n{![arrow_up.png]Town North|townNorth|250}`
        return r
    }

    static townGatesNorthProveWrong() {
        generateEnemy("human", {
            "str": 40,
            "def": 100,
            "spd": 30,
            "dex": 30,
            "health": 500
        })
        combatStatus['onDeath'] = "townGatesNorthProveWrong"
        return `You are fighting the guard guarding the gate${processingGen()}\n\n{![leave.png]Escape|townGatesNorth|0|endFight}`
    }

    static townGatesNorthExterior() {
        return `You are standing in front of the exterior of the town gates.\n\n{![park.png]Grass Plains|grassPlains|500}\n{![enter.png]Enter the town|townGatesNorth}`
    }

    static grassPlains() {
        return `You are standing in the grass plains. You notice some slimes jumping around.\n\n{![leave.png]Escape|grassPlains|0|grassPlainsEscape}\n\n{![forest.png]Forest|forestLayer1|1000|endFight}\n{![enter.png]Town Gates|townGatesNorthExterior|500|endFight}`
    }

    static forestLayer1() {
        discoverRecipe("woodenAxe")
        let r =  `You are standing near the entrance of the forest. The nearby trees provide some shade.`
        if (checks['forestLayer1EnemiesRemaining'] !== 0) {r += ` Some monsters are blocking the path to the deeper layers.`}
        r += `\n\n{![search.png]Explore|forestLayer1Explore}`
        if (checks['forestLayer1EnemiesRemaining'] !== 0) {r += `\n{![sword.png]Clear path|forestLayer1Clear}`}
        if (checks['huntersGuildMission'] && !checks['huntersGuildMission']['complete']) {r += `\n{![sword.png]Hunt|forestHunt}`}
        r += `\n\n{![sword_shield.png]Hunters' Guild|huntersGuild}\n\n`
        if (checks['forestLayer1EnemiesRemaining'] === 0) {r += `{![arrow_right.png]Walk towards the center|forestLayer2|300(Forest Center)}\n`}
        r += `{![park.png]Grass Plains|grassPlains|1000}`
        return r
    }

    static forestLayer1Explore() {
        return `You are searching for items in the forest${processingGen()}\n\n{![stop.png]Stop|forestLayer1}`
    }

    static forestLayer1Clear() {
        return `You are clearing the enemies blocking the pathway in the forest.\n${checks['forestLayer1EnemiesRemaining'] || 100} enemies remain${processingGen()}\n\n{![stop.png]Stop|forestLayer1|0|endFight}`
    }

    static huntersGuild() {
        if (!checks['huntersGuildIntro']) {
            return `You slowly walk into the Hunters' guild, the occupants appear to be having a discussion about enemies in the forest. You stand around for a minute until one of them invites you to listen.\n\nYou couldn't understand anything.\n\n{Next|huntersGuildIntro}`
        } else {
            let r = `You are in the Hunters' guild. A group of hunters gather around the fireplace.\n\n{![fire.png]Fireplace|huntersGuildFireplace}`
            if (completedQuests.includes("els5")) {r += `\n{![poster.png]Hunting Missions|huntersGuildMissions}`} 
            r += `\n\n{![leave.png]Leave|forestLayer1}`
            return r
        }
    }

    static huntersGuildIntro() {
        checks['huntersGuildIntro'] = true
        return `"Sorry if that was a bit rushed or hard to understand. We had to prepare an emergency plan due to an imminent threat in the forest."\n\nHe reaches out and firmly shakes your hand.\n\n"My name's Els and I'm the leader of this guild. We focus on discovering, researching and hunting the various creatures in this forest."\n\n"If you would like to know more, come talk to me near the fireplace."\n\n{Next|huntersGuild}`
    }

    static huntersGuildFireplace() {
        return `You are sitting on a chair near the fireplace in the Hunters' guild.\n\n{![chat.png]Talk to Els|huntersGuildEls}\n\n{![leave.png]Leave|huntersGuild}`
    }

    static huntersGuildEls() {
        let r = `"Hello, what do you need today?"`
        if (checks['huntersGuildAskQuest']) {
            if (!["els1", "els2", "els3", "els4", "els5"].some(key => quests[key])) {
                r += `\n\n{![poster.png]Receive Quest|huntersGuildElsQuest}`
            } else {
                r += `\n\n{![poster.png]Quest Completion|huntersGuildElsQuest}`
            }
        }
        r += `\n\n{![chat.png]Ask about the guild|huntersGuildEls_askGuild}\n{![chat.png]Ask about creatures|huntersGuildEls_askForest}`
        if (!checks['huntersGuildAskQuest']) {r += `\n{![chat.png]Ask about quests|huntersGuildEls_askQuests}`}
        r += `\n\n{![leave.png]Leave|huntersGuildFireplace}`
        return r
    }

    static huntersGuildElsQuest() {
        return genQuestGiver("els", {"none": `"You haven't fulfilled my quest."\n\n{![leave.png]Return|huntersGuildEls}`, "allComplete": `"You've completed all my quests for now."\n\n{![leave.png]Return|huntersGuildEls}`}, [
            {
                "quest": "els1",
                "money": 10,
                "consumed": {
                    "wood": 3
                },
                "introMessage": `"We've been needing some firewood lately in order to keep the fireplace burning. Obtain 3 pieces of wood by searching in the forest. Come back when you're done."\n\n{![leave.png]Return|huntersGuildEls}`,
                "message": `"Thanks for the firewood, this should help extend the duration of the fire for a few hours."\n\n{![leave.png]Return|huntersGuildEls}`
            },
            {
                "quest": "els2",
                "money": 20,
                "introMessage": `"We're planning on expanding our search operation into a new area of the forest. Go to the forest path and clear the enemies there."\n\n{![leave.png]Return|huntersGuildEls}`,
                "message": `"Thanks for your help, I'll be sending a few of our guys to explore deeper in to the forest. I'll let you know if we find anything."\n\n{![leave.png]Return|huntersGuildEls}`
            },
            {
                "quest": "els3",
                "money": 10,
                "consumed": {
                    "huntersGuildSupplies": 1
                },
                "completeExecute": function() {
                    checks['elsQuestlineCooldown'] = time + 1440 * 2
                },
                "introMessage": `"We've been running a bit low on supplies lately and we're planning on setting up a new area in this building. Would you be able to fetch some supplies from the merchant in town? Just tell the merchant that I've sent you. The package may be a little heavy."\n\n{![leave.png]Return|huntersGuildEls}`,
                "message": `"Thanks again, this should be good for now. I'll be able to give you another quest in around 2 days from now"\n\n{![leave.png]Return|huntersGuildEls}`,
            },
            {
                "quest": "els4",
                "money": 30,
                "consumed": {
                    "stone": 10
                },
                "requirements": [
                    {"check": function() {return time >= checks['elsQuestlineCooldown']}, "message": `"We're not quite ready yet, come back on ${formatTime(checks['elsQuestlineCooldown'] ?? 0, false, "${dayName} ${hours}:${minutes}")}."\n\n{![leave.png]Return|huntersGuildEls}`}
                ],
                "introMessage": `"We're going to need some stone for our project. Go to the mine deeper in the forest and collect 10 stones. Come back when you're done."\n\n{![leave.png]Return|huntersGuildEls}`,
                "message": `"Thanks for the stone, we're closer to finishing our project."\n\n{![leave.png]Return|huntersGuildEls}`
            },
            {
                "quest": "els5",
                "money": 20,
                "consumed": {
                    "wood": 20
                },
                "introMessage": `"This should be the final requirement for our project. We need quite a bit of wood, around 20 to be precise. I suggest using an axe to chop down a few trees."\n\n{![leave.png]Return|huntersGuildEls}`,
                "message": `"That should be all, give me a few moments."\n\nYou patiently wait while he gives the wood you just delivered to a few guild members.\n\nHe jogs back to you.\n\n"Yep, that's all we needed. I'm proud to announce that we now have a dedicated area for hunting missions. All members of the guild will now be able to take on small missions to hunt down creatures for pay. We should have our first few missions up shortly."\n\n{![leave.png]Return|huntersGuildEls}`
            }
        ])
    }

    static huntersGuildEls_askGuild() {
        return `"The Hunters' guild was founded years ago by a small group of people who wished to research the forest. I was appointed as the leader a short while after the guild was founded."\n\n"The forest is quite vast making exploration difficult. We still aren't aware of all the creatures in the forest."\n\n{![leave.png]Return|huntersGuildEls}`
    }

    static huntersGuildEls_askForest() {
        return `"The forest is home to many creatures. Some harmless, some extremely dangerous. Generally the outskirts of the forest are safe so I suggest refraining from going in too deep unless you're strong enough."\n\n{![leave.png]Return|huntersGuildEls}`
    }

    static huntersGuildEls_askQuests() {
        checks['huntersGuildAskQuest'] = true
        return `"Quests?"\n\n"I could probably give you a few quests to collect resources, obviously you'll be paid for them. Talk to me again if you're interested."\n\n{![leave.png]Return|huntersGuildEls}`
    }

    static huntersGuildHeal() {
        let r = `You are in a room located in the Hunters' guild.\n\n"Our resources are a bit limited here so we're unable to heal you completely. Head back to the hospital in town when you're ready."\n\n`
        if (getTimeName() === "night") {r += `Right before Els walks out of the room, he says, "Reminder that the forest is more dangerous at night"\n\n`}
        r += `{![leave.png]Return|huntersGuild}`
        return r
    }

    static huntersGuildMissions() {
        let r = `You look at the mission board in the Hunters' Guild.`
        
        let missions = dailyChecks['huntersGuildMissions'] ?? []
        if (!dailyChecks['huntersGuildMissions']) {
            for (let i = 0; i < randomRange(1, 2, 0); i++) {
                let minStats = randomRange(30, 100, 0)
                let maxStats = minStats + randomRange(25, 50, 0)
                missions.push({
                    "enemy": "wildAnimal",
                    "stats": [minStats, maxStats],
                    "reward": randomRange(10, 15, 0),
                    "health": randomRange(300, 600, 0)
                })
            }
            dailyChecks['huntersGuildMissions'] = missions
        }

        let missionTexts = []
        for (let i = 0; i < missions.length; i++) {
            let mission = missions[i]
            let rankText = colorGen("#88bb00", getRank(mission['stats'][0] * 4))
            if (getRank(mission['stats'][0] * 4) !== getRank(mission['stats'][1] * 4)) {
                rankText = `${colorGen("#88bb00", getRank(mission['stats'][0] * 4))} to ${colorGen("#88bb00", getRank(mission['stats'][1] * 4))}`
            }
            missionTexts.push(`{Claim|huntersGuild|0|huntersGuildClaimMission(${i})} - ${enemyData[mission['enemy']]['name']} ${colorGen("#cccc55", `$${mission['reward']}`)} ${rankText}`)
        }
        r += missionTexts.length > 0 ? "\n\n" : "\n\nThere are no available missions today."
        r += missionTexts.join("\n")
        
        if (checks['huntersGuildMission']) {
            if (checks['huntersGuildMission']['complete']) {
                r += "\n\n{![dollar.png]Claim Reward|huntersGuild|0|huntersGuildClaimMission(-1)}"
            } else {
                r += "\n\n{![cross.png]Abandon Mission|huntersGuild|0|huntersGuildClaimMission(-1)}"
            }
        }

        r += "\n\n{![leave.png]Leave|huntersGuild}"
        return r
    }

    static forestHunt() {
        return `You are hunting for the target${processingGen()}\n\n{![stop.png]Stop|forestLayer1|0|endHunt}`
    }

    static forestLayer2() {
        return `You can see the entrance of the forest in the distance.\n\n{![alley.png]Mine|forestMineEntrance}\n{![dumbbells.png]Forest Gym|forestGym}\n\n{![arrow_left.png]Walk towards the exit|forestLayer1|300(Forest Entrance)}`
    }

    static forestMineEntrance() {
        return `You are at the entrance of the mine. It appears to be abandoned.\n\n{![enter.png]Enter|forestMine}\n\n{![forest.png]Forest|forestLayer2}`
    }

    static forestMine() {
        discoverRecipe("woodenPickaxe")
        let r = `You are in the mine.\n`
        r += equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "pickaxe" ? `<span id=action-text>You are mining for stone and other materials with your pickaxe${processingGen()}</span>` : `<span id=action-text>You will need a pickaxe equipped to mine.</span>`
        r += `\n\n{![leave.png]Leave|forestMineEntrance}`
        return r
    }

    static forestGym() {
        return `You are in the forest gym. It appears to be a membership only gym.${checks['forestGymMembership2'] ? `\n\nYou have an advanced membership.\n\n${genTrainingAreaText("forestGymAdvanced")}` : checks['forestGymMembership1'] ? `\n\nYou have a basic membership.\n\n${genTrainingAreaText("forestGymBasic")}` : ""}\n\n{![chat.png]Trainer|forestGymTrainer}\n\n{![leave.png]Leave|forestLayer2}`
    }

    static forestGymTrainer() {
        let r = `"Welcome to the forest gym, I built this facility by hand in order to fully optimise training. It was originally made for my own use but I've decided to start selling memberships."`
        if (!checks['forestGymMembership1'] || !checks['forestGymMembership2']) {r += `\n\n{![chat.png]Ask about membership|forestGymTrainerMembershipAsk}`}
        if (checks['forestGymMembership2'] && !checks['forestGymCharmPurchase']) {r += `\n\n{![chat.png]Ask about the charm he's wearing|forestGymTrainerCharmAsk}`}
        r += `\n\n{![leave.png]Leave|forestGym}`
        return r
    }

    static forestGymTrainerMembershipAsk() {
        let r = `"I offer 2 levels of membership. The basic membership costs $100, which gives you access to the basic equipment. The advanced membership costs $400, which includes the perks of the basic membership and gives you access to experimental equipment that I use myself. The price is a bit steep but it's really good value for money."`
        if (!checks['forestGymMembership1'] && !checks['forestGymMembership2']) {r += `\n\n{Basic Membership ($100)|forestGym|0|forestGymMembershipPurchase(basic)}`}
        if (!checks['forestGymMembership2']) {r += `${checks['forestGymMembership1'] ? "\n\n" : "\n"}{Advanced Membership ($400)|forestGym|0|forestGymMembershipPurchase(advanced)}`}
        r += `\n\n{![leave.png]Leave|forestGym}`
        return r
    }

    static forestGymTrainerCharmAsk() {
        return `"I occasionally wear this charm while training. I can't use it very often though as it physically hurts when I use it. But it does make my training slightly more effective. If you want I could sell it to you for $200."\n\n{Buy Charm ($200)|forestGym|0|forestGymCharmPurchase}\n\n{![leave.png]Leave|forestGym}`
    }

    static forestGymBasic_str() {
        return `You are lifting weights in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
    }

    static forestGymBasic_def() {
        return `You are practicing blocking in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
    }

    static forestGymBasic_spd() {
        return `You are running on a track in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
    }

    static forestGymBasic_dex() {
        return `You are practicing movement in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
    }

    static forestGymAdvanced_str() {
        return `You are lifting rocks in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
    }

    static forestGymAdvanced_def() {
        let r = ""
        if (!checks['forestGymAdvancedDefFirst']) {
            r += `You question the trainer about this training technique.\n\n"It worked for me so it should work for everyone else too."\n\n`
            checks['forestGymAdvancedDefFirst'] = true
        }
        r += `You are practicing running in to a wall in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
        return r
    }

    static forestGymAdvanced_spd() {
        return `You are running up slopes in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
    }

    static forestGymAdvanced_dex() {
        return `You are practicing jumping over rods in the forest gym${processingGen()}\n\n{![stop.png]Stop|forestGym}`
    }
}

class sceneFunctions {
    static endFight() {
        endFight()
    }

    static leaveStorage() {
        toggleStorageAccess(false)
    }

    static leaveCrafting() {
        craftStorageReloadNeeded = true
        document.getElementById("storage-button").style.display = "none"
        if (document.getElementById("sidebar-menu-storage").style.display !== "none") {
            document.getElementById("sidebar-menu-storage").style.display = "none"
            document.getElementById("sidebar-menu-inventory").style.display = ""
            document.getElementById("inventory-button").style.borderColor = "#7777cc"
            document.getElementById("storage-button").style.borderColor = ""
        }
    }

    static merchantSell() {
        changeMoney(inventory['strawBasket'] * 5)
        changeInventory("strawBasket", -inventory['strawBasket'])
    }

    static cancelCrafting() {
        craftingSelection = false
        if (craftStatus['recipe']) {
            let craftingType = itemData[craftStatus['recipe']]['crafting']['type']
            if (craftingType === undefined) {
                changeSkill("crafting", -craftStatus['skillXp'])
                changeTitleXp("crafter", -craftStatus['skillXp'] * 2)
            } else if (craftingType === "alchemy") {
                changeSkill("alchemy", -craftStatus['skillXp'])
                changeTitleXp("alchemist", -craftStatus['skillXp'] * 2)
            }
        }
        craftStatus['recipe'] = null
        craftStatus['completed'] = 0
        craftStatus['goal'] = 0
        craftStatus['using'] = []
        craftStatus['skillXp'] = 0

        for (const elem of document.querySelectorAll(".item-selected")) {
            elem.remove()
        }
    }

    static generateEnemy(args) {
        let enemy, onDeath
        if (typeof args === "string") {
            enemy = args
        } else {
            [enemy, onDeath] = args
        }
        generateEnemy(enemy)
        if (onDeath) {
            combatStatus['onDeath'] = onDeath
        }
    }

    static theArenaResign() {
        endFight()
        if (arenaStatData[arenaData['round'] - 2]) {
            prependText = `You resigned from The Arena.\n\n${colorGen("#ffee00", `You received $${arenaStatData[arenaData['round'] - 2]['reward']} for participating`)}\n\n`
            changeMoney(arenaStatData[arenaData['round'] - 2]['reward'])
            if (team === "nextLevel") {
                checks['nextLevelExercisePills'] = Math.round(arenaStatData[arenaData['round'] - 2]['reward'] / 10)
            }
        } else {
            prependText = `You resigned from The Arena.\n\n`
        }
        arenaData = {}
    }

    static nextLevelClaimExercisePill() {
        changeInventory("exercisePill", checks['nextLevelExercisePills'], null, null, {"ignoreWeightLimit": true})
        delete checks['nextLevelExercisePills']
    }

    static grassPlainsEscape() {
        endFight()
        checks['spawnDelay'] = time + 5
    }

    static forestGymMembershipPurchase(tier) {
        if (tier === "basic") {
            if (money >= 100) {
                changeMoney(-100)
                checks['forestGymMembership1'] = true
                prependText = `You purchased a basic membership for ${colorGen("#cccc55", "$100")}.\n\n`
            } else {
                prependText = "You do not have enough money to purchase this.\n\n"
            }
        } else if (tier === "advanced") {
            if (money >= 400) {
                changeMoney(-400)
                checks['forestGymMembership2'] = true
                prependText = `You purchased an advanced membership for ${colorGen("#cccc55", "$400")}.\n\n`
            } else {
                prependText = "You do not have enough money to purchase this.\n\n"
            }
        }
    }

    static forestGymCharmPurchase() {
        if (money >= 200) {
            if (changeInventory("strangeTrainingCharm", 1)) {
                changeMoney(-200)
                checks['forestGymCharmPurchase'] = true
                prependText = `You purchased a training charm for ${colorGen("#cccc55", "$200")}.\n\n`
            }
        } else {
            prependText = "You do not have enough money to purchase this.\n\n"
        }
    }

    static huntersGuildClaimMission(arg) {
        let i = Number(arg)
        if (i === -1) {
            if (checks['huntersGuildMission']['complete']) {
                prependText = `You received ${colorGen("#cccc55", `$${checks['huntersGuildMission']['reward']}`)} for completing the mission.\n\n`
                changeMoney(checks['huntersGuildMission']['reward'])
            } else {
                prependText = "You abandoned your mission.\n\n"
            }
            delete checks['huntersGuildMission']
            return
        }

        if (!checks['huntersGuildMission']) {
            if (!dailyChecks['huntersGuildMissions']) {
                prependText = "This mission has expired.\n\n"
                return
            }
            const mission = dailyChecks['huntersGuildMissions'][i]
            checks['huntersGuildMission'] = {
                "enemy": mission['enemy'],
                "stats": {
                    "maxHealth": mission['health'],
                    "health": mission['health'],
                    "str": randomRange(mission['stats'][0], mission['stats'][1], 0),
                    "def": randomRange(mission['stats'][0], mission['stats'][1], 0),
                    "spd": randomRange(mission['stats'][0], mission['stats'][1], 0),
                    "dex": randomRange(mission['stats'][0], mission['stats'][1], 0),
                },
                "reward": mission['reward']
            }
            delete dailyChecks['huntersGuildMissions'].splice(i, 1)
        } else {
            prependText = "You already have a mission active.\n\n"
        }
    }

    static endHunt() {
        checks['huntersGuildMission']['stats']['health'] = combatStatus['enemyHealth']
        endFight()
    }

    static walkBack() {
        travelStatus['backwards'] = true
        travelStatus['destination'] = currentScene
        let arrival = Math.ceil(time + Number(travelStatus['completed']) / calcMovementSpeed())
        processText(`You are walking back. You'll arrive at ${colorGen("#ccccff", formatTime(arrival, true), "text-arrival")}${processingGen()}`)
    }
}

class sceneEndFunctions {
    static merchant() {
        generateShop("merchant")
    }

    static table() {
        generateCraftingMenu()
    }

    static weaponShop() {
        generateShop("weaponShop")
    }

    static storage() {
        generateStorageMenu()
        toggleStorageAccess(true)
    }
}

const mainElement = document.getElementById("main")

function processLinkClick(text, scene, distance, func, params) {
    for (const [action, value] of Object.entries(activeActions)) {
        delete activeActions[action]
        if (actionData[action]['disable']) {
            actionData[action]['disable']()
        }
    }
    if (routeRecording['enabled']) {
        const numberDistance = distance ? (distance.includes("(") ? Number(distance.split("(")[0]) : Number(distance)) : 0
        if (numberDistance !== 0 || allowedRoutingScenes.includes(scene)) {
            routeRecording['route'].push(scene)
        } else {
            insertLog(colorGen("#00ffff", "Route recording ended due to moving to an invalid location"))
            saveRouteRecording()
        }
    }
    if (func !== undefined) {
        sceneFunctions[func](params ? (params.includes(",") ? params.split(",") : params) : undefined)
    }
    if (distance === undefined || Number(distance) === 0) {
        sceneManager(scene)
    } else {
        const numberDistance = Number(distance.split("(")[0])
        let walkTextOverride
        if (distance.includes("(")) {walkTextOverride = distance.split("(")[1].slice(0, -1)}
        let arrival = Math.ceil(time + numberDistance / calcMovementSpeed())
        if (settings['skipTravel'] >= arrival - time) {
            if (dailyChecks['skippedTravelTicks'] === undefined || dailyChecks['skippedTravelTicks'] < 720) {
                if (dailyChecks['skippedTravelTicks'] === undefined) {
                    dailyChecks['skippedTravelTicks'] = 0
                }
                if (dailyChecks['skippedTravelTicks'] + arrival - time > 720) {
                    changeSkill("walking", 720 - dailyChecks['skippedTravelTicks'])
                    dailyChecks['skippedTravelTicks'] = 720
                } else {
                    changeSkill("walking", arrival - time)
                    dailyChecks['skippedTravelTicks'] += arrival - time
                }

                if (inventoryWeight > getMaxWeight()) {
                    changeEnergy(-0.1 * (inventoryWeight / getMaxWeight() - 1) * (arrival - time))
                }

                changeEnergy(-0.05 * (arrival - time))
            }
            stats['distanceTravelled'] = (stats['distanceTravelled'] ?? 0) + numberDistance
            sceneManager(scene)
        } else {
            processText(`You are walking towards the ${colorGen("#99bbee", walkTextOverride || text.replace(imageRegex, ""))}. You'll arrive at ${colorGen("#ccccff", formatTime(arrival, true), "text-arrival")}${processingGen()}\n\n{![arrow_left.png]Walk Back|noChange|0|walkBack}`)
            travelStatus['destination'] = scene
            travelStatus['distance'] = numberDistance
        }
    }
    playTransition()
}

function processText(text) {
    sceneText = text
    while (mainElement.lastChild) {
        mainElement.removeChild(mainElement.lastChild)
    }
    const splitText = text.split(textSplitter)
    const splitLinks = [...text.matchAll(linkRegex)]
    
    splitText.forEach(function(item, num) {
        let div = document.createElement("div")
        div.className = "main-text"
        
        let parts = item.split(imageRegex)
        parts.forEach(function(part, index) {
            if (index % 2 === 0) {
                let span = document.createElement("span")
                span.innerHTML = part
                div.appendChild(span)
            } else {
                let img = document.createElement("img")
                img.src = "img/" + part
                img.style.display = "inline-block"
                img.style.width = "1.5em"
                img.style.height = "1.5em"
                img.style.marginRight = "6px"
                img.style.verticalAlign = "middle"
                div.appendChild(img)
            }
        })
        
        mainElement.appendChild(div)
        
        if (num < splitLinks.length) {
            let button = document.createElement("button")
            let labelParts = splitLinks[num][1].split(imageRegex)
            if (labelParts.length > 1) {
                labelParts.forEach(function(part, index) {
                    if (index % 2 === 0) {
                        if (part.length > 0) {
                            let span = document.createElement("span")
                            if (!settings['keyboardNavigation']) {
                                span.innerHTML = part
                            } else {
                                span.innerHTML = `(${num + 1}) ${part}`
                            }
                            button.appendChild(span)
                        }
                    } else {
                        if (settings['sceneImages'] !== false) {
                            let img = document.createElement("img")
                            img.src = "img/" + part
                            img.style.display = "inline-block"
                            img.style.width = "1.5em"
                            img.style.height = "1.5em"
                            img.style.marginRight = "6px"
                            img.style.verticalAlign = "middle"
                            button.appendChild(img)
                        }
                    }
                })
            } else {
                if (!settings['keyboardNavigation']) {
                    button.innerHTML = splitLinks[num][1]
                } else {
                    button.innerHTML = `(${num + 1}) ${splitLinks[num][1]}`
                }
            }

            button.className = "main-link"
            button.id = "button" + num
            button.addEventListener("click", function() {
                processLinkClick(...splitLinks[num].slice(1, 6))
                endRoute()
            })

            if (routeData['enabled'] && currentScene === routeData['route'][routeData['index']]) {
                if (splitLinks[num][2] === routeData['route'][routeData['index'] + 1]) {
                    const numberDistance = splitLinks[num][3] ? (splitLinks[num][3].includes("(") ? Number(splitLinks[num][3].split("(")[0]) : Number(splitLinks[num][3])) : 0
                    if (numberDistance !== 0 || allowedRoutingScenes.includes(splitLinks[num][2])) {
                        setTimeout(function() {
                            if (currentScene === routeData['route'][routeData['index']] && !travelStatus['destination']) {
                                routeData['index'] += 1
                                processLinkClick(...splitLinks[num].slice(1, 6))
                                if (routeData['index'] >= routeData['route'].length - 1) {
                                    endRoute()
                                }
                            } else {
                                endRoute()
                            }
                        }, 1000)
                    } else {
                        endRoute()
                    }
                }
            }

            mainElement.appendChild(button)
        }
    })
}

function sceneManager(selected) {
    if (selected === "noChange") {return}

    const selectedScene = scenes[selected]()
    if (sceneRegions[selected]) {
        region = sceneRegions[selected]
    }
    
    oldScene = currentScene
    currentScene = selected
    processText((prependText || "") + selectedScene)
    prependText = ""
    currentPrependText = ""
    if (sceneEndFunctions[selected]) {sceneEndFunctions[selected]()}
    
    trainingSession = {
        "logId": null,
        "gain": 0,
        "stat": null
    }

    generateActions()
}

// Settings
let settingsMenuLoaded = false
let settings = loadFromLocal("arkivia-settings") || {}
const eventListenerStorage = {}
let settingsCategory = null

const allowedRoutingScenes = ["townGatesNorth", "townGatesNorthExterior"]
let routeRecording = {
    "enabled": false,
    "route": []
}
let routeData = {
    "enabled": false,
    "route": [],
    "routeIndex": -1,
    "index": -1
}

const settingsData = {
    "sceneTransitions": {
        "type": "toggle",
        "text": "Scene Transitions",
        "default": true
    },
    "sceneImages": {
        "type": "toggle",
        "text": "Scene Images",
        "default": true
    },
    "keyboardNavigation": {
        "type": "toggle",
        "text": "Keyboard Navigation",
        "default": false,
        "on": function() {
            if (!eventListenerStorage['keyboardNavigation']) {
                eventListenerStorage['keyboardNavigation'] = function(e) {
                    if (e.repeat || e.ctrlKey) {return}
                    if (!isNaN(parseInt(e.key))) {
                        const target = document.getElementById(`button${parseInt(e.key) - 1}`)
                        if (target) {
                            target.click()
                        }
                    }
                }

                document.addEventListener("keydown", eventListenerStorage['keyboardNavigation'])
            }
        },
        "off": function() {
            if (eventListenerStorage['keyboardNavigation']) {
                document.removeEventListener("keydown", eventListenerStorage['keyboardNavigation'])
                delete eventListenerStorage['keyboardNavigation']
            }
        }
    },
    "mobileLayout": {
        "type": "toggle",
        "text": "Mobile Layout",
        "default": false,
        "on": function() {
            mobileLayout()
            insertLog("Swipe right to access your inventory and skills")
        },
        "off": function() {
            desktopLayout()
        }
    },
    "autoRepeatCrafting": {
        "type": "toggle",
        "text": "Auto Repeat Crafting",
        "default": false
    },
    "skipTravel": {
        "type": "number",
        "text": "Skip Travel Under",
        "tooltip": "Travel that takes shorter than the specified minutes will be skipped.\n\nIt is somewhat cheaty to put this on a very high number but nothing stops you.",
        "default": "0"
    },
    "dateFormat": {
        "type": "text",
        "text": "Date Format",
        "tooltip": "Allows for configuration of the date format. Placeholders are specified using ${name}.\n\nAvailable placeholders: dayName, shortDayName, timeName, year, month, day, hours, minutes.\n\ne.g. ${hours}:${minutes} -> 12:34",
        "default": "${dayName} ${timeName} ${year}-${month}-${day} ${hours}:${minutes}"
    },
    // Theme stuff
    "theme_background": {
        "type": "color",
        "text": "Background Color",
        "default": "#222244",
        "execute": function(value) {
            document.documentElement.style.setProperty("--background", value)
        }
    },
    "theme_color": {
        "type": "color",
        "text": "Text Color",
        "default": "#ffffff",
        "execute": function(value) {
            document.documentElement.style.setProperty("--color", value)
        }
    },
    "theme_foregroundBackground": {
        "type": "color",
        "text": "Foreground Background Color",
        "default": "#333333",
        "execute": function(value) {
            document.documentElement.style.setProperty("--foreground-background", value)
        }
    },
    "theme_foregroundBackgroundDark": {
        "type": "color",
        "text": "Foreground Background Dark Color",
        "default": "#282828",
        "execute": function(value) {
            document.documentElement.style.setProperty("--foreground-background-dark", value)
        }
    },
    "theme_backgroundBackground": {
        "type": "color",
        "text": "Background Background Color",
        "default": "#222222",
        "execute": function(value) {
            document.documentElement.style.setProperty("--background-background", value)
        }
    },
    "theme_centerBackground": {
        "type": "color",
        "text": "Center Background Color",
        "default": "#222222",
        "execute": function(value) {
            document.documentElement.style.setProperty("--center-background", value)
        }
    },
    "theme_centerTopBackground": {
        "type": "color",
        "text": "Center Topbar Background Color",
        "default": "#332233",
        "execute": function(value) {
            document.documentElement.style.setProperty("--center-top-background", value)
        }
    },
    "theme_centerTopColor": {
        "type": "color",
        "text": "Center Topbar Text Color",
        "default": "#ccccff",
        "execute": function(value) {
            document.documentElement.style.setProperty("--center-top-color", value)
        }
    },
    "theme_equipmentBackground": {
        "type": "color",
        "text": "Equipment Background Color",
        "default": "#333344",
        "execute": function(value) {
            document.documentElement.style.setProperty("--equipment-background", value)
        }
    },
    "theme_equipmentBorder": {
        "type": "color",
        "text": "Equipment Border Color",
        "default": "#444499",
        "execute": function(value) {
            document.documentElement.style.setProperty("--equipment-border", value)
        }
    },
    "theme_equipmentDurabilityBackground": {
        "type": "color",
        "text": "Equipment Durability Background Color",
        "default": "#555577",
        "execute": function(value) {
            document.documentElement.style.setProperty("--equipment-durability-background", value)
        }
    },
    "theme_tooltipBackground": {
        "type": "color",
        "text": "Tooltip Background Color",
        "default": "#111111",
        "execute": function(value) {
            document.documentElement.style.setProperty("--tooltip-background", value)
        }
    },
    "theme_tooltipColor": {
        "type": "color",
        "text": "Tooltip Text Color",
        "default": "#ffffff",
        "execute": function(value) {
            document.documentElement.style.setProperty("--tooltip-color", value)
        }
    },
    "theme_menuButtonBackground": {
        "type": "color",
        "text": "Menu Button Background Color",
        "default": "#444444",
        "execute": function(value) {
            document.documentElement.style.setProperty("--menu-button-background", value)
        }
    },
    "theme_menuButtonBackgroundHover": {
        "type": "color",
        "text": "Menu Button Hover Color",
        "default": "#555555",
        "execute": function(value) {
            document.documentElement.style.setProperty("--menu-button-background-hover", value)
        }
    },
    "theme_bottombarBackground": {
        "type": "color",
        "text": "Bottombar Background Color",
        "default": "#999999",
        "execute": function(value) {
            document.documentElement.style.setProperty("--bottombar-background", value)
        }
    },
    "theme_skillbarFill": {
        "type": "color",
        "text": "Skillbar Background Color",
        "default": "#888844",
        "execute": function(value) {
            document.documentElement.style.setProperty("--skillbar-background", value)
        }
    },
    "theme_healthbarFill": {
        "type": "color",
        "text": "Healthbar Background Color",
        "default": "#449944",
        "execute": function(value) {
            document.documentElement.style.setProperty("--healthbar-background", value)
        }
    },
    "theme_energybarFill": {
        "type": "color",
        "text": "Energy Bar Background Color",
        "default": "#bb4444",
        "execute": function(value) {
            document.documentElement.style.setProperty("--energy-bar-background", value)
        }
    },
    "theme_xpbarFill": {
        "type": "color",
        "text": "XP Bar Background Color",
        "default": "#4444bb",
        "execute": function(value) {
            document.documentElement.style.setProperty("--xp-bar-background", value)
        }
    },
    "saveName": {
        "type": "text",
        "text": "Save Name",
        "tooltip": "Allows for changing of the save name when exporting. Do not use characters that are restricted by your file system as it may cause issues, these may include: < > : \" / \\ | ? * .\n\nPlaceholders are specified using ${name}.\n\nAvailable placeholders: realYear, realMonth, realDay, realHours, realMinutes, realSeconds, timestamp, day, version",
        "default": "Arkivia.sav"
    },
    "filterCombatLogs": {
        "type": "toggle",
        "text": "Filter Combat Logs",
        "default": false
    }
}
const settingsCategories = {
    "interface": {
        "name": "Interface",
        "settings": [
            "sceneTransitions",
            "sceneImages",
            "",
            "dateFormat",
            "",
            "mobileLayout",
            "filterCombatLogs"
        ]
    },
    "accessibility": {
        "name": "Accessibility",
        "settings": [
            "keyboardNavigation"
        ]
    },
    "routes": {
        "name": "Routes",
        "execute": function(settingsOptionsElement) {
            settingsOptionsElement.textContent = "You can define routes here. Upon creating a route, you have the option to go through the route to the other side in game. Routes only work on links that take time to walk with a few exceptions. Routes do not work when the skip travel cheat is enabled.\n"
            const createRoute = document.createElement("button")
            createRoute.textContent = "Create"
            createRoute.addEventListener("click", function() {
                if (routeRecording['enabled'] === false) {
                    routeRecording['enabled'] = true
                    routeRecording['route'] = []
                    document.getElementById("settings").style.display = "none"
                    insertLog(colorGen("#00ffff", "Route recording started"))
                    routeRecording['route'].push(currentScene)
                    createRoute.textContent = "Stop"
                } else {
                    saveRouteRecording()
                    createRoute.textContent = "Create"
                }
            })
            settingsOptionsElement.appendChild(createRoute)

            if (settings['routeRecordings']) {
                for (let i = 0; i < settings['routeRecordings'].length; i++) {
                    settingsOptionsElement.appendChild(createRouteRecordingElement(settings['routeRecordings'][i], i))
                }
            }
        }
    },
    "gameplay": {
        "name": "Gameplay",
        "settings": [
            "autoRepeatCrafting"
        ]
    },
    "theme": {
        "name": "Theme",
        "settings": [
            {"type": "text", "text": "These features are experimental and incomplete"},
            "",
            "theme_background",
            "theme_color",
            "theme_foregroundBackground",
            "theme_foregroundBackgroundDark",
            "theme_backgroundBackground",
            "theme_centerBackground",
            "theme_centerTopBackground",
            "theme_centerTopColor",
            "theme_equipmentBackground",
            "theme_equipmentBorder",
            "theme_equipmentDurabilityBackground",
            "theme_tooltipBackground",
            "theme_tooltipColor",
            "theme_menuButtonBackground",
            "theme_menuButtonBackgroundHover",
            "theme_bottombarBackground",
            "theme_skillbarFill",
            "theme_healthbarFill",
            "theme_energybarFill",
            "theme_xpbarFill"
        ]
    },
    "misc": {
        "name": "Miscellaneous",
        "settings": [
            "saveName"
        ]
    },
    "cheats": {
        "name": "Cheats",
        "settings": [
            {"type": "text", "text": "Skip travel was moved here because it felt a bit too cheaty."},
            "",
            "skipTravel"
        ]
    },
    "stats": {
        "name": "Stats",
        "execute": function(settingsOptionsElement) {
            let text = ""
            text += `Playtime: ${formatNumberTime(stats['playtime'])}\n`
            text += `Game Time: ${formatNumberTime(stats['gametime'] * 60)}\n\n`

            text += `Quests: ${completedQuests.length}/${Object.keys(questData).length}\n`
            text += `Items: ${(stats['discoveredItems'] ?? []).length}/${Object.keys(itemData).length}\n`
            text += `Skills: ${Object.keys(skills).length}/${Object.keys(skillData).length}\n`
            text += `Achievements: ${achievements.length}/${Object.keys(achievementData).length}\n\n`

            text += `Deaths: ${stats['deaths'] ?? 0}\n`
            if (stats['distanceTravelled']) {text += `Distance Travelled: ${formatNumber(stats['distanceTravelled'])}m\n`}
            if (stats['timeSlept']) {text += `Time Slept: ${formatNumberTime(stats['timeSlept'] * 60)}\n`}
            if (stats['itemsDeleted']) {text += `Items Deleted: ${stats['itemsDeleted']}\n`}

            if (stats['kills'] && Object.keys(stats['kills']).length > 0) {
                text += `\nKills:\n`
                for (const [enemy, count] of Object.entries(stats['kills'])) {
                    text += ` - ${enemyData[enemy]['name']}: ${count}\n`
                }
                text += "\n"
            }
            if (stats['totalKills']) {text += `Total Kills: ${stats['totalKills']}`}
            settingsOptionsElement.textContent = text
        }
    },
    "exportImport": {
        "name": "Export / Import",
        "execute": function(settingsOptionsElement) {
            settingsOptionsElement.textContent = "You can use these options to export or import your save configuration.\n"
            const exportButton = document.createElement("button")
            exportButton.textContent = "Export"
            exportButton.addEventListener("click", function() {
                const blob = new Blob([JSON.stringify(settings)], {"type": "application/json"})
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "ArkiviaSettings.json"
                a.click()
                URL.revokeObjectURL(url)
            })
            settingsOptionsElement.appendChild(exportButton)

            const importButton = document.createElement("button")
            importButton.textContent = "Import"
            importButton.addEventListener("click", async function() {
                let file
                if ("showOpenFilePicker" in window) {
                    const [fileHandle] = await window.showOpenFilePicker({
                        "types": [{"description": "Arkivia Settings", "accept": {"application/json": [".json"]}}]
                    })
                    file = await fileHandle.getFile()
                } else {
                    file = await new Promise(function(resolve, reject) {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = ".json"
                        input.click()
                        input.addEventListener("change", function() {
                            resolve(input.files[0])
                        })
                    })
                }

                const text = await file.text()
                settings = JSON.parse(text)
                saveToLocal(settings, "arkivia-settings")
                window.location.reload()
            })
            settingsOptionsElement.appendChild(importButton)
        }
    },
    "saves": {
        "name": "Backup Saves",
        "execute": function(settingsOptionsElement) {
            settingsOptionsElement.textContent = "These are only meant to be used as backups for when your main save breaks. A new backup save is created whenever the version changes. Loading these saves will overwrite your main save so make sure to back up your current one as well."
            for (let i = 1; i <= 3; i++) {
                const save = loadFromLocal(`arkivia-save-backup${i}`)
                
                if (save) {
                    const saveHolder = document.createElement("div")
                    saveHolder.className = "settings-save-holder"

                    const saveTitle = document.createElement("div")
                    saveTitle.className = "settings-save-title"
                    saveTitle.textContent = `Backup ${i} - v${save['version']}`
                    saveHolder.appendChild(saveTitle)

                    const saveData = document.createElement("div")
                    saveData.classNamem = "settings-save-data"
                    let text = ""
                    if (save['timestamp']) {
                        text += `${new Date(save['timestamp'] * 1000).toLocaleString()}\n`
                    }

                    text += `Level ${xpToLevel(save['xp'])} ${getRank(save['battleStats']['str'] + save['battleStats']['def'] + save['battleStats']['spd'] + save['battleStats']['dex'])} ${save['playerTitle']}\n`
                    saveData.textContent = text
                    saveHolder.appendChild(saveData)

                    const downloadButton = document.createElement("button")
                    downloadButton.className = "settings-save-download"
                    downloadButton.textContent = "Download"
                    downloadButton.addEventListener("click", function() {
                        exportDict(save, "ArkiviaBackup.sav")
                    })
                    saveHolder.appendChild(downloadButton)

                    settingsOptionsElement.appendChild(saveHolder)
                }
            }
        }
    },
    "info": {
        "name": "Links & Info",
        "execute": function(settingsOptionsElement) {
            settingsOptionsElement.innerHTML = "Solo developed by Pointless\n\nDiscord Server: <a href=https://discord.gg/R3DV8ZX5NE target=\"_blank\" rel=\"noopener\">https://discord.gg/R3DV8ZX5NE</a>"
        }
    },
    "close": {
        "name": "Close Menu",
        "special": {
            "noChangeMenu": true
        },
        "execute": function() {
            document.getElementById("settings").style.display = "none"
        }
    }
}

for (const [setting, value] of Object.entries(settings)) {
    if (settingsData[setting]) {
        if (value !== settingsData[setting]['default']) {
            if (settingsData[setting]['type'] === "toggle") {
                if (value === true && settingsData[setting]['on']) {
                    settingsData[setting]['on']()
                } else if (value === false && settingsData[setting]['off']) {
                    settingsData[setting]['off']()
                }
            } else if (settingsData[setting]['type'] === "color") {
                settingsData[setting]['execute'](value)
            }
        }
    }
}

document.getElementById("settings-button").addEventListener("click", function() {
    if (settingsMenuLoaded === false) {
        settingsMenuLoaded = true
        for (const [submenu, data] of Object.entries(settingsCategories)) {
            const category = document.createElement("button")
            category.className = "settings-category"
            category.textContent = data['name']

            category.addEventListener("click", function() {
                if (data['special'] && data['special']['noChangeMenu']) {
                    if (data['execute']) {
                        data['execute']()
                    }
                    return
                }

                settingsCategory = submenu

                const settingsOptionsElement = document.getElementById("settings-options")
                settingsOptionsElement.replaceChildren()
                
                const settingsOptionsTitle = document.createElement("div")
                settingsOptionsTitle.className = "settings-options-title"
                settingsOptionsTitle.textContent = data['name']
                settingsOptionsElement.appendChild(settingsOptionsTitle)

                if (data['settings']) {
                    function getSettingValue(option) {
                        return settings[option] !== undefined ? settings[option] : settingsData[option]['default'] || false
                    }

                    function checkModified(option) {
                        return settings[option] !== undefined
                    }

                    for (const option of data['settings']) {
                        if (option === "") {
                            settingsOptionsElement.appendChild(document.createElement("br"))
                            continue
                        } else if (typeof option === "object") {
                            if (option['type'] === "text") {
                                const text = document.createElement("div")
                                text.textContent = option['text']
                                settingsOptionsElement.appendChild(text)
                            }
                            continue
                        }
                        
                        const values = settingsData[option]
                        const holder = document.createElement("div")
                        holder.className = "settings-option-holder"
                        if (values['type'] === "toggle") {
                            const toggle = document.createElement("input")
                            toggle.type = "checkbox"
                            toggle.className = "settings-option-checkbox"
                            toggle.checked = getSettingValue(option)

                            toggle.addEventListener("change", function() {
                                if (toggle.checked !== values['default']) {
                                    settings[option] = toggle.checked
                                    text.style.color = "#ffeeaa"
                                } else {
                                    delete settings[option]
                                    text.style.color = ""
                                }

                                if (toggle.checked && values['on']) {values['on']()}
                                if (!toggle.checked && values['off']) {values['off']()}
                                saveToLocal(settings, "arkivia-settings")
                            })

                            holder.appendChild(toggle)

                            const text = document.createElement("span")
                            text.textContent = values['text']
                            if (checkModified(option)) {text.style.color = "#ffeeaa"}
                            holder.appendChild(text)
                        } else if (values['type'] === "text" || values['type'] === "number") {
                            const text = document.createElement("span")
                            text.textContent = values['text']
                            if (checkModified(option)) {text.style.color = "#ffeeaa"}
                            if (values['tooltip']) {
                                text.setAttribute("data-tooltip-title", values['text'])
                                text.setAttribute("data-tooltip-text", values['tooltip'])
                            }
                            holder.appendChild(text)
                            
                            const textInput = document.createElement("input")
                            textInput.type = "text"
                            textInput.className = values['type'] === "number" ? "settings-option-number-input" : "settings-option-text-input"
                            textInput.value = getSettingValue(option)
                            if (values['type'] === "number") {
                                textInput.type = "number"
                            }

                            function finish(mode) {
                                if (textInput.value !== values['default']) {
                                    settings[option] = values['type'] === "number" ? Number(textInput.value) : textInput.value
                                    text.style.color = "#ffeeaa"
                                } else {
                                    delete settings[option]
                                    text.style.color = ""
                                }

                                if (mode === "key") {textInput.blur()}

                                saveToLocal(settings, "arkivia-settings")
                            }

                            textInput.addEventListener("keydown", function(e) {
                                if (e.key === "Enter") {textInput.blur()}
                            })
                            textInput.addEventListener("blur", finish)

                            holder.appendChild(textInput)
                        } else if (values['type'] === "color") {
                            const text = document.createElement("span")
                            text.textContent = values['text']
                            if (checkModified(option)) {text.style.color = "#ffeeaa"}
                            holder.appendChild(text)
                            
                            const colorInput = document.createElement("input")
                            colorInput.type = "color"
                            colorInput.className = "settings-option-color-input"
                            colorInput.value = getSettingValue(option) || "#000000"

                            colorInput.addEventListener("change", function() {
                                if (colorInput.value !== values['default']) {
                                    settings[option] = colorInput.value
                                    text.style.color = "#ffeeaa"
                                } else {
                                    delete settings[option]
                                    text.style.color = ""
                                }
                                if (values['execute']) {values['execute'](colorInput.value)}
                                saveToLocal(settings, "arkivia-settings")
                            })

                            colorInput.addEventListener("input", function() {
                                if (values['execute']) {values['execute'](colorInput.value)}
                            })

                            holder.appendChild(colorInput)

                            const resetButton = document.createElement("button")
                            resetButton.textContent = "Reset"

                            resetButton.addEventListener("click", function() {
                                colorInput.value = values['default']
                                delete settings[option]
                                text.style.color = ""
                                if (values['execute']) {values['execute'](colorInput.value)}
                                saveToLocal(settings, "arkivia-settings")
                            })

                            holder.appendChild(resetButton)
                        }
                        settingsOptionsElement.appendChild(holder)   
                    }
                }

                if (data['execute']) {
                    data['execute'](settingsOptionsElement)
                }
            })

            document.getElementById("settings-categories").appendChild(category)
        }
    }

    const settingsElem = document.getElementById("settings")
    if (settingsElem.style.display === "none") {
        settingsElem.style.display = ""
    } else {
        settingsElem.style.display = "none"
    }
})

function objectEmpty(obj) {
    return Object.keys(obj).length === 0
}

function createRouteRecordingElement(route, i) {
    const holder = document.createElement("div")
    holder.className = "settings-route-recording-holder"
    
    const routeText = document.createElement("span")
    routeText.className = "settings-route-recording-text"
    routeText.textContent = `${camelToTitle(route[0])} <-> ${camelToTitle(route.at(-1))}`
    holder.appendChild(routeText)

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener("click", function() {
        settings['routeRecordings'].splice(i, 1)
        holder.remove()
        saveToLocal(settings, "arkivia-settings")
    })
    holder.appendChild(deleteButton)

    return holder
}

function saveRouteRecording() {
    routeRecording['enabled'] = false
    if (routeRecording['route'].length < 3) {
        insertLog(colorGen("#00ffff", "Route was not saved due to being too short"))
        routeRecording['route'] = []
        return
    } else {
        insertLog(colorGen("#00ffff", `Saved route ${camelToTitle(routeRecording['route'][0])} <-> ${camelToTitle(routeRecording['route'].at(-1))}`))
    }

    if (!settings['routeRecordings']) {
        settings['routeRecordings'] = []
    }

    settings['routeRecordings'].push(routeRecording['route'])
    saveToLocal(settings, "arkivia-settings")
    
    if (settingsCategory === "routes") {
        document.getElementById("settings-options").appendChild(createRouteRecordingElement(routeRecording['route'], settings['routeRecordings'].length - 1))
    }
    routeRecording['route'] = []
    generateActions()
}

function endRoute() {
    routeData['enabled'] = false
    routeData['route'] = []
    routeData['routeIndex'] = -1
    routeData['index'] = -1
}

// Mobile
function mobileLayout() {
    document.getElementById("mobile-meta").setAttribute("content", "width=device-width, initial-scale=1")
    const link = document.createElement("link")
    link.id = "mobile-layout"
    link.rel = "stylesheet"
    link.href = "mobile.css"
    document.head.appendChild(link)

    document.getElementById("delete-save").textContent = "Del"
    document.getElementById("settings-button").textContent = "Conf"
    gameTitleElement.textContent = `v${VERSION}`

    const sidebar = document.getElementById("sidebar")
    let startX = 0
    let startY = 0
    let sidebarOpen = false
    eventListenerStorage['mobileTouchstart'] = document.addEventListener("touchstart", function(e) {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
    })

    eventListenerStorage['mobileTouchmove'] = document.addEventListener("touchmove", function(e) {
        sidebar.style.transition = "none"
        if (!sidebarOpen) {
            sidebar.style.transform = `translateX(${Math.max(0, e.touches[0].clientX - startX) - sidebar.offsetWidth}px)`
        } else {
            sidebar.style.transform = `translateX(${Math.min(0, e.touches[0].clientX - startX)}px)`
        }
    })

    eventListenerStorage['mobileTouchend'] = document.addEventListener("touchend", function(e) {
        const endX = e.changedTouches[0].clientX
        const endY = e.changedTouches[0].clientY

        const deltaX = endX - startX
        const deltaY = endY - startY

        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
            if (sidebarOpen) {
                sidebar.style.transform = "translateX(0%)"
            } else {
                sidebar.style.transform = "translateX(-100%)"
            }
            return
        }

        sidebar.style.transition = "transform 250ms ease-out"

        if (deltaX > 0) {
            sidebarOpen = true
            sidebar.style.transform = "translateX(0%)"
        } else {
            sidebarOpen = false
            sidebar.style.transform = "translateX(-100%)"
        }
    })
}

function desktopLayout() {
    document.getElementById("mobile-layout").remove()
    document.getElementById("mobile-meta").setAttribute("content", "width=1000")
    sidebar.style.transform = ""
    sidebar.style.transition = ""
    document.getElementById("delete-save").textContent = "Delete"
    document.getElementById("settings-button").textContent = "Settings"
    gameTitleElement.textContent = `Arkivia v${VERSION}`
}

if (!settings['run']) {
    if (window.screen.width < 1000 && window.screen.height * 1.5 > window.screen.width) {
        mobileLayout()
        settings['mobileLayout'] = true
        insertLog("It appears that you're using a mobile device. The layout has automatically been changed. You can revert this in this configuration menu.")
        insertLog("Swipe right to access your inventory and skills")
    }
}

// Saves
function makeSave() { // Optimisation at all costs
    function removeEmpty(key, obj) {
        if (objectEmpty(obj[key])) {obj[key] = undefined}
    }

    let base = {
        money, time, health, xp, playerTitle, battleStats, skills, energy, noSleepTime, potionCooldown, effects, titleScores, achievements, processStatus, // Stats
        inventory, inventoryNonStackable, inventoryNonStackableIncrement, storage, storageNonStackable, storageAccess, shopStorage, // Inventory
        combatStatus, equipment, team, arenaData, // Combat
        oldScene, currentScene, sceneText, region, currentPrependText, // Scenes
        quests, completedQuests, checks, dailyChecks, questProgression, // Quests
        stats, // Stats
        knownRecipes, craftStatus, craftingSelection, // Crafting
        exploreStatus, travelStatus, // Exploration
        debugEnabled, // Debug
        weather, weatherStartTime, // Environment
        processStatus, activeActions // Processes
    }
    base['version'] = VERSION
    // Stats
    if (base['money'] === 0) {delete base['money']}
    for (const [stat, value] of Object.entries(base['battleStats'])) {
        base['battleStats'][stat] = Math.round(value * 1000) / 1000
    }
    base['energy'] = Math.round(base['energy'] * 1000) / 1000
    removeEmpty("skills", base)
    removeEmpty("effects", base)
    for (const [title, value] of Object.entries(base['titleScores'])) {
        base['titleScores'][title] = Math.round(value * 1000) / 1000
    }
    removeEmpty("titleScores", base)
    removeEmpty("achievements", base)
    if (base['processStatus']['type'] === null) {base['processStatus'] = undefined}
    if (!base['currentPrependText']) {base['currentPrependText'] = undefined}

    // Combat
    if (base['combatStatus']['enemy'] === null) {base['combatStatus'] = undefined}
    base['equipment'] = Object.fromEntries(Object.entries(base['equipment']).filter(([key, value]) => value !== null))
    removeEmpty("equipment", base)
    if (base['team'] === "none") {base['team'] = undefined}
    removeEmpty("arenaData", base)
    
    // Inventory
    removeEmpty("inventory", base)
    removeEmpty("inventoryNonStackable", base)
    removeEmpty("storage", base)
    removeEmpty("storageNonStackable", base)
    if (base['storageAccess'] === false) {base['storageAccess'] = undefined}
    if (base['inventoryNonStackableIncrement'] === 0) {base['inventoryNonStackableIncrement'] = undefined}
    if (base['knownRecipes'].length <= 2) {base['knownRecipes'] = undefined} // Hopefully shouldn't break anything
    removeEmpty("shopStorage", base)

    // Quests
    removeEmpty("quests", base)
    removeEmpty("completedQuests", base)
    removeEmpty("checks", base)
    removeEmpty("dailyChecks", base)
    removeEmpty("questProgression", base)

    // Crafting
    if (base['craftStatus']['recipe'] === null && base['craftStatus']['selected'] === null) {base['craftStatus'] = undefined}
    if (base['craftingSelection'] === false) {base['craftingSelection'] = undefined}

    // Exploration
    if (base['exploreStatus']['area'] === null) {base['exploreStatus'] = undefined}
    if (base['travelStatus']['destination'] === null) {base['travelStatus'] = undefined}

    // Debug
    if (base['debugEnabled'] === false) {base['debugEnabled'] = undefined}

    // Environment
    if (base['weather'] === "clear") {
        base['weather'] = undefined
        // base['weatherStartTime'] = undefined
    }

    // Processes
    if (processStatus['type'] === null) {
        base['processStatus'] = undefined
    }
    removeEmpty("activeActions", base)

    // Misc
    base['timestamp'] = Math.round(Date.now() / 1000)

    base = Object.fromEntries(Object.entries(base).filter(([key, value]) => value !== undefined))
    return base
}

function bytesToBinary(bytes) {
    let result = ""
    for (let i = 0; i < bytes.length; i += 16384) {
        result += String.fromCharCode(...bytes.subarray(i, i + 16384))
    }
    return result
}

function saveToLocal(dict, slot="arkivia-save1") {
    const msgpackData = MessagePack.encode(dict)
    const packed = LZString.compressToBase64(bytesToBinary(msgpackData))
    localStorage.setItem(slot, packed)
}

function exportDict(dict, filename="Arkivia.sav") {
    const msgpackData = MessagePack.encode(dict)
    const packed = LZString.compressToUint8Array(bytesToBinary(msgpackData))
    const blob = new Blob([packed], {"type": "application/octet-stream"})

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

async function importDict() {
    let file
    if ("showOpenFilePicker" in window) {
        const [fileHandle] = await window.showOpenFilePicker({
            "types": [{"description": "Arkivia Save", "accept": {"application/octet-stream": [".sav"]}}]
        })
        file = await fileHandle.getFile()
    } else {
        file = await new Promise(function(resolve, reject) {
            const input = document.createElement("input")
            input.type = "file"
            input.accept = ".sav"
            input.click()
            input.addEventListener("change", function() {
                resolve(input.files[0])
            })
        })
    }
    const arrayBuffer = await file.arrayBuffer()
    const compressed = new Uint8Array(arrayBuffer)
    const str = LZString.decompressFromUint8Array(compressed)
    const bytes = new Uint8Array(str.split("").map(c => c.charCodeAt(0)))
    const dict = MessagePack.decode(bytes)
    return dict
}

function loadFromLocal(slot="arkivia-save1") {
    let save = localStorage.getItem(slot)
    if (!save) {return undefined}
    const decompressed = LZString.decompressFromBase64(save)
    const bytes = new Uint8Array(decompressed.split("").map(char => char.charCodeAt(0)))
    const dict = MessagePack.decode(bytes)
    return dict
}

function versionCompare(v1, v2) {
    return v1.localeCompare(v2, undefined, {"numeric": true}) < 0
}

function loadSave(dict) {
    const startTime = performance.now()
    let hasUpdate = false
    try {
        if (versionCompare(dict['version'], VERSION)) {
            for (let i = 3; i > 1; i--) {
                const previous = localStorage.getItem(`arkivia-save-backup${i - 1}`)
        
                if (previous) {
                    localStorage.setItem(`arkivia-save-backup${i}`, previous)
                }
            }
            saveToLocal(dict, "arkivia-save-backup1")
            gameTitleElement.textContent = `Arkivia v${VERSION} (Update)`
            gameTitleElement.classList.add("update")
            gameTitleElement.addEventListener("click", function() {
                gameTitleElement.textContent = `Arkivia v${VERSION}`
                gameTitleElement.classList.remove("update")
            }, {"once": true})
            setTimeout(function() {
                gameTitleElement.textContent = `Arkivia v${VERSION}`
                gameTitleElement.classList.remove("update")
            }, 20000)
            hasUpdate = true
        }

        // Migrations
        if (versionCompare(dict['version'], "0.17")) {
            combatStatus['enemyEffects'] ??= []
        }
        if (versionCompare(dict['version'], "0.19")) {
            dict['stats']['totalKills'] = Object.values(dict['stats']['kills']).reduce((acc, val) => acc + val, 0)
        }
        if (versionCompare(dict['version'], "0.20")) {
            if (dict.checks?.dojoQuestIndex) {
                dict['questProgression'] = {"dojo": dict['checks']['dojoQuestIndex']}
                delete dict['checks']['dojoQuestIndex']
            }
            if (dict['combatStatus']) {
                dict['combatStatus']['enemyEffects'] = {}
            }
        }
        if (versionCompare(dict['version'], "0.23")) {
            delete dict['equipment']['shield']
            dict['equipment']['tool'] = null
        }
        if (versionCompare(dict['version'], "0.24")) {
            dict['travelStatus'] = dict['travelInfo']
            dict['combatStatus'] = dict['combatData']
            dict['craftStatus'] = dict['craftInfo']
            dict['exploreStatus'] = dict['exploreData']
        } if (versionCompare(dict['version'], "0.27")) {
            for (const [effect, data] of Object.entries(dict['effects'] ?? {})) {
                if (data['duration'] !== undefined) {
                    data['end'] = data['duration']
                    delete data['duration']
                }
            }

            if (dict['combatStatus'] && dict['combatStatus']['enemyEffects']) {
                for (const [effect, data] of Object.entries(dict['combatStatus']['enemyEffects'])) {
                    if (data['duration'] !== undefined) {
                        data['end'] = data['duration']
                        delete data['duration']
                    }
                }
            }

            // console.log(dict['arenaData']['round'] >= 7)
            if (dict['arenaData'] && dict['arenaData']['round'] >= 7) {
                dict['arenaData'] = {}
                dict['currentScene'] = "empty"
                dict['sceneText'] = `${colorGen("#ff99ff", "You have been teleported out of the arena due to a bug in the previous versions that caused softlocks")}\n\n{Continue|theArenaEntrance}`
            }
        } if (versionCompare(dict['version'], "0.28")) {
            if (dict['stats']) {
                delete dict['stats']['totalTimeSlept']
            }

            if (dict['completedQuests']) {
                const huntersGuildQuests = ["els1", "els2", "els3", "els4", "els5"]
                let complete = false
                for (let i = huntersGuildQuests.length - 1; i >= 0; i--) {
                    if (dict['completedQuests'].includes(huntersGuildQuests[i])) {
                        complete = true
                    } else if (complete === false) {
                        if (dict['quests'] && dict['quests'][huntersGuildQuests[i]]) {
                            delete dict['quests'][huntersGuildQuests[i]]
                        }
                    } else if (complete === true) {
                        dict['completedQuests'].push(huntersGuildQuests[i])
                    }
                }
            }
        }
        
        // Stats
        time = dict['time'] ?? time
        battleStats = dict['battleStats'] ?? battleStats
        energy = dict['energy'] ?? energy
        noSleepTime = dict['noSleepTime'] ?? noSleepTime
        potionCooldown = dict['potionCooldown'] ?? potionCooldown
        for (const [title, score] of Object.entries(dict['titleScores'] ?? {})) {
            if (Number.isNaN(score)) {
                delete dict['titleScores'][title]
            }
        }
        titleScores = dict['titleScores'] ?? titleScores
        stats = dict['stats'] ?? stats
        if (dict['playerTitle'] !== "Unknown") {changeTitle(dict['playerTitle'])}
        processStatus = dict['processStatus'] ?? processStatus

        changeXp(dict['xp'])
        changeMoney(dict['money'] || 0)
        health = dict['health']
        updateBar("health")
        timeElement.textContent = formatTime(time)

        if (dict['skills']) {
            for (const [skill, xp] of Object.entries(dict['skills'])) {
                if (!Number.isNaN(xp)) {
                    changeSkill(skill, xp)
                }
            }
        }

        updateBar("energy")

        if (dict['effects']) {
            for (const [effect, data] of Object.entries(dict['effects'])) {
                changeEffect(effect, data['end'] || 0, true, data['properties'] || null)
            }
        }
        achievements = dict['achievements'] ?? achievements
        if (dict['achievements']) {document.getElementById("achievements-button").style.display = ""}
        
        // Inventory
        inventoryNonStackableIncrement = dict['inventoryNonStackableIncrement'] ?? inventoryNonStackableIncrement
        shopStorage = dict['shopStorage'] ?? shopStorage
        
        const inventoryCombined = [
            ...Object.entries(dict['inventory'] ?? {}).map(([item, amount]) => ({item, amount, "id": null, "data": null})),
            ...Object.entries(dict['inventoryNonStackable'] ?? {}).map(([id, data]) => ({"item": data['name'], "amount": 1, id, data}))
        ]

        const storageCombined = [
            ...Object.entries(dict['storage'] ?? {}).map(([item, amount]) => ({item, amount, "id": null, "data": null})),
            ...Object.entries(dict['storageNonStackable'] ?? {}).map(([id, data]) => ({"item": data['name'], "amount": 1, id, data}))
        ]

        inventoryCombined.sort(function(a, b) {
            const itemA = itemData[a['item']]
            const itemB = itemData[b['item']]
            return itemA['class'] < itemB['class'] ? -1 : itemA['class'] > itemB['class'] ? 1 : itemA['name'] < itemB['name'] ? -1 : itemA['name'] > itemB['name'] ? 1 : 0
        })

        storageCombined.sort(function(a, b) {
            const itemA = itemData[a['item']]
            const itemB = itemData[b['item']]
            return itemA['class'] < itemB['class'] ? -1 : itemA['class'] > itemB['class'] ? 1 : itemA['name'] < itemB['name'] ? -1 : itemA['name'] > itemB['name'] ? 1 : 0
        })

        const fragment = new DocumentFragment()
        for (const item of inventoryCombined) {
            changeInventory(item['item'], item['amount'], item['id'], item['data'], {"fragment": fragment, "ignoreWeightLimit": true})
        }
        document.getElementById("inventory-table").appendChild(fragment)

        // for (const [item, amount] of Object.entries(dict['inventory'] ?? {})) {
        //     changeInventory(item, amount)
        // }
        // for (const [item, amount] of Object.entries(dict['storage'] ?? {})) {
        //     changeStorage(item, amount)
        // }

        // for (const [id, data] of Object.entries(dict['inventoryNonStackable'] ?? {})) {
        //     const item = data['name']
        //     changeInventory(item, 1, id, data)
        // }
        // for (const [id, data] of Object.entries(dict['storageNonStackable'] ?? {})) {
        //     const item = data['name']
        //     changeStorage(item, 1, id, data)
        // }

        for (const item of storageCombined) {
            changeStorage(item['item'], item['amount'], item['id'], item['data'])
        }

        for (const [item, data] of Object.entries(dict['equipment'] ?? {})) {
            if (data !== null) {
                changeEquipment(data[1])
            }
        }
        
        // Combat
        combatStatus = dict['combatStatus'] ?? combatStatus
        team = dict['team'] ?? team
        arenaData = dict['arenaData'] ?? arenaData

        if (combatStatus['enemy'] !== null) {
            let total = 0
            for (const stat of statTypes) {
                total += combatStatus['enemyStats'][stat]
                document.getElementById(`enemy-stat-${stat}`).textContent = `${capitaliseFirst(stat)}: ${formatNumber(combatStatus['enemyStats'][stat], "floor", true)}`
            }
            document.getElementById(`enemy-stat-total`).textContent = `Ttl: ${formatNumber(total, "floor", true)}`

            document.getElementById("enemy-name").textContent = enemyData[combatStatus['enemy']]['name']
            updateBar("enemyHealth")

            document.getElementById("attack-info-left").style.display = ""
            document.getElementById("attack-info-divider").style.display = ""
            document.getElementById("attack-info-right").style.display = ""

            if (combatStatus['enemyEffects']) {
                for (const [effect, data] of Object.entries(dict['combatStatus']['enemyEffects'])) {
                    delete combatStatus['enemyEffects'][effect]
                    changeEnemyEffect(effect, data['end'] || 0, true)
                }
            }
        }

        // Scenes
        oldScene = dict['oldScene'] ?? oldScene
        currentScene = dict['currentScene'] ?? currentScene
        sceneText = dict['sceneText'] ?? sceneText
        region = dict['region'] ?? region

        // Quests
        quests = dict['quests'] ?? quests
        completedQuests = dict['completedQuests'] ?? completedQuests
        checks = dict['checks'] ?? checks
        dailyChecks = dict['dailyChecks'] ?? dailyChecks
        questProgression = dict['questProgression'] ?? questProgression

        if (dict['quests']) {
            for (const quest in dict['quests']) {
                giveQuest(quest)
            }
        }

        if (dict['completedQuests']) {
            for (const quest of dict['completedQuests']) {
                giveQuest(quest, complete=true)
            }
        }

        // Crafting
        knownRecipes = dict['knownRecipes'] ?? knownRecipes
        craftStatus = dict['craftStatus'] ?? craftStatus
        craftingSelection = dict['craftingSelection'] ?? craftingSelection

        if (dict['craftStatus']) {
            for (const itemId of dict['craftStatus']['using']) {
                if (inventoryNonStackable[itemId]) {
                    const inventorySlot = document.getElementById(`item-${inventoryNonStackable[itemId]['name']}_${itemId}`)
                    if (inventorySlot) {
                        const itemSelected = document.createElement("span")
                        itemSelected.className = "item-selected"
                        itemSelected.textContent = "S"

                        inventorySlot.appendChild(itemSelected)
                    }
                }
            }
        }

        // Exploration
        exploreStatus = dict['exploreStatus'] ?? exploreStatus
        travelStatus = dict['travelStatus'] ?? travelStatus

        // Debug
        if (dict['debugEnabled']) {toggleDebug(true)}

        // Environment
        if (dict['weather']) {
            changeWeather(dict['weather'])
        }
        if (dict['weatherStartTime']) {
            weatherStartTime = dict['weatherStartTime']
        }

        // Processes
        activeActions = dict['activeActions'] ?? activeActions

        // End
        processText(sceneText)
        generateActions()
        if (dict['currentPrependText']) {
            changePrependText(dict['currentPrependText'])
        }
        if (sceneEndFunctions[currentScene]) {sceneEndFunctions[currentScene]()}

        document.getElementById("log").replaceChildren()
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}

        insertLog(colorGen("#aaaaaa", `Loaded in ${(performance.now() - startTime).toFixed()}ms`))
        insertLog(`Tip: ${tipData[Math.floor(Math.random() * tipData.length)]}`)
        if (hasUpdate) {
            insertLog(colorGen("#ffff00", `The game has been updated from v${dict['version']} to v${VERSION}. Restore a backup save in settings if any issues occur.`))
            insertLog(colorGen("#cccc00", "The game is still in the testing stage so please export your save frequently"))
        }
    } catch (error) {
        saveEnabled = false
        insertLog(colorGen("#ff0000", `Loading failed: ${error}`))
        throw error
    }
}

document.getElementById("delete-save").addEventListener("click", function() {
    let confirm = prompt("THIS WILL DELETE YOUR SAVE. TYPE CONFIRM TO CONFIRM")
    if (confirm) {
        if (confirm.toLowerCase() === "confirm") {
            saveEnabled = false
            localStorage.removeItem("arkivia-save1")
            localStorage.removeItem("save1") // Remove this later
            window.location.reload()
        } else if (confirm.toLowerCase() === "confirm to confirm") {
            alert(`I meant "confirm" not "confirm to confirm"`)
        }
    }
})

document.getElementById("export").addEventListener("click", function() {
    if (!settings['saveName']) {
        exportDict(makeSave())
    } else {
        exportDict(makeSave(), formatString(settings['saveName'], {
            "realYear": new Date().getFullYear(),
            "realMonth": String(new Date().getMonth() + 1).padStart(2, "0"),
            "realDay": String(new Date().getDate()).padStart(2, "0"),
            "realHours": String(new Date().getHours()).padStart(2, "0"),
            "realMinutes": String(new Date().getMinutes()).padStart(2, "0"),
            "realSeconds": String(new Date().getSeconds()).padStart(2, "0"),
            "timestamp": Math.floor(Date.now() / 1000),
            "day": getDay(),
            "version": VERSION.replaceAll(".", "")
        }))
    }
})

document.getElementById("import").addEventListener("click", function() {
    importDict().then(dict => {
        saveToLocal(dict, "arkivia-savetemp")
        window.location.reload()
    })
})

let firstDebugEnable = true // Putting this here so it doesn't break

if (localStorage.getItem("arkivia-savetemp") === null) {
    if (localStorage.getItem("arkivia-save1") === null && localStorage.getItem("save1") === null) {
        sceneManager("intro1")
    } else {
        let save = loadFromLocal()
        if (save === undefined) {save = loadFromLocal("save1")}
        loadSave(save)
    }
} else {
    loadSave(loadFromLocal("arkivia-savetemp"))
    localStorage.removeItem("arkivia-savetemp")
}

window.addEventListener("beforeunload", function() {
    if (saveEnabled === true && currentScene !== "intro1") {
        saveToLocal(makeSave())
    }
})

// Debug
function toggleDebug(value) {
    if (value === true) {
        document.getElementById("debug-button").style.display = ""
        debugEnabled = true
        if (firstDebugEnable) {
            document.addEventListener("keydown", function(e) {
                if (e.key === "Shift" && !e.repeat) {
                    tickDelay = 100
                }
            })

            document.addEventListener("keyup", function(e) {
                if (e.key === "Shift") {
                    tickDelay = document.getElementById("debug-settings-tickDelay").value
                }
            })
        }
        firstDebugEnable = false
    } else {
        document.getElementById("debug-button").style.display = "none"
        if (document.getElementById("sidebar-menu-debug").style.display !== "none") {
            document.getElementById("sidebar-menu-debug").style.display = "none"
            document.getElementById("sidebar-menu-inventory").style.display = ""
            document.getElementById("inventory-button").style.borderColor = "#7777cc"
            document.getElementById("debug-button").style.borderColor = ""
        }
        debugEnabled = false
    }
}

for (const stat of statTypes) {
    document.getElementById(`debug-change-${stat}`).addEventListener("click", function() {
        changeBattlestat(stat, Number(document.getElementById("debug-stat-input").value), true)
    })
}

document.getElementById("debug-reload-scene").addEventListener("click", function() {
    playTransition()
    sceneManager(currentScene)
})

const allScenes = Object.getOwnPropertyNames(scenes).filter(prop => typeof scenes[prop] === "function")
const suggestionsContainer = document.getElementById("debug-scene-jump-autocomplete-suggestions")
const sceneJumpInput = document.getElementById("debug-scene-jump-input")
let selectedIndex = -1

sceneJumpInput.addEventListener("input", function(e) {
    const query = sceneJumpInput.value.toLowerCase()
    if (suggestionsContainer.firstChild) {
        while (suggestionsContainer.firstChild) {
            suggestionsContainer.removeChild(suggestionsContainer.lastChild)
        }
    }

    selectedIndex = -1
    const filteredData = allScenes.filter(item => item.toLowerCase().includes(query))
    let i = 0
    for (const item of filteredData) {
        const suggestion = document.createElement("div")
        suggestion.className = "suggestion"
        suggestion.textContent = item

        suggestion.addEventListener("click", function() {
            sceneJumpInput.value = item
            suggestionsContainer.replaceChildren()
        })

        suggestionsContainer.appendChild(suggestion)
        i += 1
        if (i >= 20) {
            break
        }
    }
})

function updateSelection(suggestions) {
    suggestions.forEach(function(suggestion, index) {
        suggestion.classList.remove("selected")
        if (index === selectedIndex) {
            suggestion.classList.add("selected")
        }
    })
}

sceneJumpInput.addEventListener("keydown", function(e) {
    const suggestions = document.querySelectorAll(".suggestion")

    if (e.key === "ArrowDown") {
        if (selectedIndex < suggestions.length - 1) {
            selectedIndex += 1
            updateSelection(suggestions)
        }
    } else if (e.key === "ArrowUp") {
        if (selectedIndex > 0) {
            selectedIndex -= 1
            updateSelection(suggestions)
        }
    } else if (e.key === "Enter" && selectedIndex >= 0) {
        sceneJumpInput.value = suggestions[selectedIndex].textContent
        suggestionsContainer.innerHTML = ""
        selectedIndex = -1
    } else if (e.key === "Enter") {
        playTransition()
        sceneManager(sceneJumpInput.value)
        sceneJumpInput.value = ""
        suggestionsContainer.replaceChildren()
    }
})

document.getElementById("debug-settings-tickDelay").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        tickDelay = this.value
        this.blur()
    }
})

updateBar("health")
updateBar("xp")
updateBattlestats()
if (!settings['run']) {
    settings['run'] = true
    saveToLocal(settings, "arkivia-settings")
}