const VERSION = "0.23"

document.getElementById("game-title").textContent = `Arkivia v${VERSION}`

var money = 0
var time = 420
var oldScene = ""
var currentScene = ""
var sceneText = ""
var prependText = ""
var region = "Unknown"
var health = 10
var xp = 0
var playerTitle = "Unknown"
var travelInfo = {
    "destination": null,
    "distance": 0,
    "completed": 0,
}
var battleStats = {
    "str": 1,
    "def": 1,
    "spd": 1,
    "dex": 1
}
var combatData = {
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
var checks = {}
var logAutoScroll = true
var skills = {}
var inventory = {}
var inventoryNonStackable = {}
var inventoryNonStackableIncrement = 0
var storage = {}
var storageNonStackable = {}
var storageAccess = false
var inventoryWeight = 0
var energy = 100
var noSleepTime = 0
var effects = {}
var quests = {}
var questProgression = {}
var completedQuests = []
var stats = {
    "playtime": 0,
    "gametime": 0,
    "kills": {},
    "totalKills": 0,
    "discoveredItems": [],
}
var shopStorage = {}
var knownRecipes = ["strawBasket", "woodenSpear"]
var craftInfo = {
    "recipe": null,
    "goal": 0,
    "completed": 0,
    "required": {},
    "using": [],
    "selected": null,
    "skillXp": 0,
}
var team = "none"
var equipment = {
    "weapon": null,
    "tool": null,
    "head": null,
    "chest": null,
    "arms": null,
    "legs": null,
    "accessory1": null,
    "accessory2": null
}
var exploreData = {
    "area": null,
    "goal": 0,
    "completed": 0
}
var saveEnabled = true
var craftingSelection = false
var titleScores = {}
var arenaData = {}
var debugEnabled = false
var discardMode = false

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
        "xp": [7, 10]
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
        "xp": [10, 12]
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
        "xp": [15, 20]
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
}
const skillData = {
    "walking": {
        "name": "Walking",
        "desc": "Allows you to travel faster while walking",
        "scaling": 1.3
    },
    "fighting": {
        "name": "Fighting",
        "desc": "Slightly increases damage dealt",
        "scaling": 1.3
    },
    "training": {
        "name": "Training",
        "desc": "Increases stat gains from training",
        "scaling": 1.3
    },
    "crafting": {
        "name": "Crafting",
        "desc": "Increases crafting speed",
        "scaling": 1.2
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
        "scaling": 1.2
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
        "desc": "Increases stat gain from training by 50% for one hour",
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
        "combat": {
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
        "combat": {
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
        "combat": {
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
        "desc": "Small pendant made out of straw",
        "class": "gear",
        "weight": 25,
        "stackable": false,
        "combat": {
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
        "combat": {
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
        "combat": {
            "class": "weapon",
            "damage": [1.5, 1.8],
            "effects": {
                "spd": -0.25
            },
            "execute": function(dmg) {
                if (dmg > 0) {
                    if (Math.random() <= 0.1) {
                        changeEnemyEffect("stun", time + 2, true)
                        insertLog(colorGen(effectData['stun']['color'], `${enemyData[combatData['enemy']]['name']} is stunned`))
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
        "combat": {
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
        "desc": "Small and simple health potion. Increases your health by +30",
        "class": "consumable",
        "weight": 50,
        "execute": function() {
            changeHp(30)
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
        "combat": {
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
        "combat": {
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
        "combat": {
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
        "combat": {
            "class": "legs",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 50
            }
        }
    }
}
const effectData = {
    "sleepDeprived": {
        "name": "Sleep Deprived",
        "desc": "Energy loss per minute increased",
        "color": "#006666"
    },
    "exercisePill": {
        "name": "Exercise Pill",
        "desc": "Stat gain is increased by 50%",
        "color": "#cccc00"
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
    }
}
const shopData = {
    "merchant": [
        {"name": "exercisePill", "chance": 100, "quantity": [1, 3], "price": [5, 7]},
        {"name": "knife", "chance": 50, "quantity": [1, 1], "price": [19, 25]},
        {"name": "cauldron", "chance": 30, "quantity": [1, 1], "price": [60, 80]}
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
    }
}
const titleData = {
    "athlete": {"name": "Athlete"},
    "fighter": {"name": "Fighter"},
    "disciple": {"name": "Disciple"},
    "seeker": {"name": "Seeker"},
    "crafter": {"name": "Crafter"},
    "sleeper": {"name": "Sleeper"},
    "alchemist": {"name": "Alchemist"}
}
const arenaStatData = [
    {"health": [30, 40], "stats": [4,6], "reward": 10},
    {"health": [60, 80], "stats": [10,15], "reward": 20},
    {"health": [120, 150], "stats": [20,30], "reward": 30},
    {"health": [200, 300], "stats": [50,100], "reward": 50},
    {"health": [400, 600], "stats": [200,300], "reward": 70},
    {"health": [800, 1_000], "stats": [600,800], "reward": 100},
    {"enemyType": "death", "reward": 0} // Until future content is made
]
const statTypes = ["str", "def", "spd", "dex"]

function getDayName(date=null) {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    if (date == null) {
        return getDayName(minutesToDate(time))
    }
    return dayNames[date.getDay()]
}

function minutesToDate(time) {
    const baseDate = new Date(1600, 0, 1)
    baseDate.setMinutes(baseDate.getMinutes() + time)
    return baseDate
}

function formatTime(time, timeOnly=false) {
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
    if (!settings['dateFormat']) {
        if (!settings['mobileLayout']) {
            return `${dayName} ${capitaliseFirst(timeName)} ${year}-${month}-${day} ${timeString}`
        } else {
            return `${dayName.slice(0, 3)} ${capitaliseFirst(timeName)} ${year}-${month}-${day} ${timeString}`
        }
    } else {
        return formatString(settings['dateFormat'], {
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

const ranks = [
    {"rank": "G-", "max": 5},
    {"rank": "G", "max": 20},
    {"rank": "G+", "max": 100},
    {"rank": "E-", "max": 500},
    {"rank": "E", "max": 2000},
    {"rank": "E+", "max": 10_000},
    {"rank": "D-", "max": 40_000},
    {"rank": "D", "max": 200_000},
    {"rank": "D+", "max": 1_000_000},
    {"rank": "C-", "max": 5_000_000},
    {"rank": "C", "max": 25_000_000},
    {"rank": "C+", "max": 100_000_000},
    {"rank": "B-", "max": 500_000_000},
    {"rank": "B", "max": 2_500_000_000},
    {"rank": "B+", "max": 10_000_000_000},
    {"rank": "A-", "max": 1e11},
    {"rank": "A", "max": 1e12},
    {"rank": "A+", "max": Infinity},
]

function getRank() {
    return ranks.find(r => getTotalBattlestats() < r['max'])['rank']
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
        "check": function() {return stats['totalKills']},
        "goal": 1
    }),
    "hunter": statAchievement({
        "name": "Hunter",
        "desc": "Defeat 10 enemies",
        "check": function() {return stats['totalKills']},
        "goal": 10
    }),
    "killer": statAchievement({
        "name": "Killer",
        "desc": "Defeat 100 enemies",
        "check": function() {return stats['totalKills']},
        "goal": 100
    }),
    "exterminator": statAchievement({
        "name": "Exterminator",
        "desc": "Defeat 1,000 enemies",
        "check": function() {return stats['totalKills']},
        "goal": 1000
    }),
    "collector": statAchievement({
        "name": "Collector",
        "desc": "Discover 10 items",
        "check": function() {return stats['discoveredItems'].length},
        "goal": 10
    }),
    "flatline": {
        "name": "Flatline",
        "desc": "Defeat an enemy in one hit",
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
    if (achievementTableLoaded == false) {
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

function updateBar(bar, change=null) {
    if (bar == "health") {
        document.getElementById("healthbar-text").textContent = `HP: ${formatNumber(health, "round")}/${formatNumber(calcMaxHp(), "round")}`
        document.getElementById("healthbar-fill").style.width = `${health / calcMaxHp() * 100}%`
        if (change != null) {
            document.getElementById("healthbar-fill-damage").style.left = `${health / calcMaxHp() * 100}%`
            document.getElementById("healthbar-fill-damage").style.width = `${-change / calcMaxHp() * 100}%`
        } else {
            document.getElementById("healthbar-fill-damage").style.width = "0"
        }
    } else if (bar == "energy") {
        document.getElementById("energy-bar-text").textContent = `Energy: ${Math.round(energy)}/100`
        document.getElementById("energy-bar-fill").style.width = `${energy / 100 * 100}%`
    } else if (bar == "xp") {
        document.getElementById("xp-bar-text").textContent = `XP: ${formatNumber(xpIntoLevel(xp), "round")}/${formatNumber(xpForLevel(xpToLevel(xp)), "round")}`
        document.getElementById("xp-bar-fill").style.width = `${xpIntoLevel(xp) / xpForLevel(xpToLevel(xp)) * 100}%`
        updateLevelText(xp)
    } else if (bar == "enemyHealth") {
        document.getElementById("enemy-healthbar-text").textContent = `HP: ${formatNumber(combatData['enemyHealth'], "round")}/${formatNumber(combatData['enemyMaxHealth'], "round")}`
        document.getElementById("enemy-healthbar-fill").style.width = `${combatData['enemyHealth'] / combatData['enemyMaxHealth'] * 100}%`
        if (change != null) {
            document.getElementById("enemy-healthbar-fill-damage").style.left = `${combatData['enemyHealth'] / combatData['enemyMaxHealth'] * 100}%`
            document.getElementById("enemy-healthbar-fill-damage").style.width = `${-change / combatData['enemyMaxHealth'] * 100}%`
        } else {
            document.getElementById("enemy-healthbar-fill-damage").style.width = "0"
        }
    }
}

function capitaliseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function updateBattlestats(statName=null) {
    for (const [stat, value] of Object.entries(battleStats)) {
        if (statName == null || stat == statName) {
            const effectiveStat = value * calcStatModifier(stat)
            const modifierPercentage = effectiveStat / value * 100 - 100
            document.getElementById(`stat-${stat}`).textContent = `${capitaliseFirst(stat)}: ${formatNumber(value, "floor")}${Math.round(modifierPercentage) != 0 ? ` (${(modifierPercentage > 0 ? "+" : "") + modifierPercentage.toFixed(0)}%)` : ""}`
        }
    }
    document.getElementById(`stat-total`).textContent = `Ttl: ${formatNumber(getTotalBattlestats())}`
}

function updateEnemyBattlestats(statName=null) {
    let total = 0
    for (const [stat, value] of Object.entries(combatData['enemyStats'])) {
        total += value
        if (statName == null || stat == statName) {
            const effectiveStat = value * calcEnemyStatDebuff(stat)
            const modifierPercentage = (effectiveStat / value * 100 - 100) || 0
            document.getElementById(`enemy-stat-${stat}`).textContent = `${capitaliseFirst(stat)}: ${formatNumber(value, "floor", true)}${Math.round(modifierPercentage) != 0 ? ` (${(modifierPercentage > 0 ? "+" : "") + modifierPercentage.toFixed(0)}%)` : ""}`
        }
    }
    document.getElementById(`enemy-stat-total`).textContent = `Ttl: ${formatNumber(total, "floor", true)}`
}

function colorGen(hex, text) {
    return "<span style=\"color: " + hex + "\">" + text + "</span>"
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

var logIncrement = 0
function insertLog(content, tooltip=null, id=null, type=null) {
    let div
    if (id != null && id == logIncrement - 1 && document.getElementById(`log-${id}`)) {
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

    if (tooltip != null) {
        div.setAttribute("data-tooltip-title", tooltip[0])
        div.setAttribute("data-tooltip-text", tooltip[1])
    }

    if (logAutoScroll) {document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight}

    if (itemLogStackData['id'] != null && (id == null || type == "training")) {
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
    }
    return logIncrement - 1
}

// function getFuture(time, day, increase) {
//     const totalMinutes = time + increase

//     const newTime = ((totalMinutes % 1440) + 1440) % 1440
//     const newDay = day + Math.floor(totalMinutes / 1440)

//     return [newTime, newDay]
// }

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
    if (decimals == -1) {return value}
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
}

function generateEnemy(enemyName, stats=null) {
    if (combatData['enemy'] != null) {return}
    combatData['enemy'] = enemyName
    const enemy = stats || enemyData[enemyName]
    combatData['enemyProperties'] = enemy['properties']
    if (Array.isArray(enemy['health'])) {
        combatData['enemyMaxHealth'] = randomRange(enemy['health'][0], enemy['health'][1], 0)
    } else {
        combatData['enemyMaxHealth'] = enemy['health']
    }
    combatData['enemyHealth'] = combatData['enemyMaxHealth']

    for (const stat of statTypes) {
        if (Array.isArray(enemy[stat])) {
            combatData['enemyStats'][stat] = randomRange(enemy[stat][0], enemy[stat][1], 2)
        } else {
            combatData['enemyStats'][stat] = enemy[stat]
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
    combatData['enemy'] = null
    combatData['enemyHealth'] = 0
    combatData['enemyMaxHealth'] = 0
    combatData['enemyProperties'] = []
    combatData['enemyStats'] = {
        "str": 0,
        "def": 0,
        "spd": 0,
        "dex": 0
    }
    combatData['onDeath'] = undefined
    for (const [effect, value] of Object.entries(combatData['enemyEffects'] || {})) {
        changeEnemyEffect(effect, null)
    }
    combatData['enemyEffects'] = {}
    combatData['tags'] = undefined

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
    insertLog(colorGen("#aaaaaa", `${enemyData[combatData['enemy']]['name']} died`))

    if (enemyData[combatData['enemy']]['loot'] != undefined) {
        for (const drop of enemyData[combatData['enemy']]['loot']) {
            changeInventory(drop['item'], getRandomItem(drop['chances']))
        }
    }

    if (enemyData[combatData['enemy']]['xp'] != undefined) {
        let xpGain = 0
        if (Array.isArray(enemyData[combatData['enemy']]['xp'])) {
            xpGain = Math.round(randomRange(enemyData[combatData['enemy']]['xp'][0], enemyData[combatData['enemy']]['xp'][1], 2))
        } else {
            xpGain = enemyData[combatData['enemy']]['xp']
        }
        changeXp(xpGain)
    }

    changeQuestProgress("kills", combatData['enemy'], 1)
    stats['kills'][combatData['enemy']] = (stats['kills'][combatData['enemy']] ?? 0) + 1
    stats['totalKills'] += 1
    checkAchievements(["firstBlood", "hunter", "killer", "exterminator"])

    if (combatData['onDeath']) {
        onDeathFunctions.get(combatData['onDeath'])()
    }

    endFight()
}

function getBaseDamage(strength) {
    const x = Math.log10(strength)
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
    const scaling = skillData[skill]['scaling']
    const currentLevel = xpToLevel(skills[skill] || 0, false, scaling)

    if (skills[skill] == undefined) {
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
        skillbarText.textContent = `${skillData[skill]['shortName'] || skillData[skill]['name']} ${xpToLevel(skills[skill], false, scaling)}: ${formatNumber(xpIntoLevel(skills[skill], scaling), "round")}/${formatNumber(xpForLevel(xpToLevel(skills[skill], false, scaling), scaling), "round")}`

        skillbarParent.appendChild(skillbarFill)
        skillbarParent.appendChild(skillbarText)
        document.getElementById("skill-table").appendChild(skillbarParent)
        
        checkAchievement("skilled")
    } else {
        skills[skill] += skillXp
        const skillbarFill = document.getElementById(`skill-${skill}`).getElementsByClassName("skillbar-fill")[0]
        skillbarFill.style.width = `${xpIntoLevel(skills[skill], scaling) / xpForLevel(xpToLevel(skills[skill], false, scaling), scaling) * 100}%`

        const skillbarText = document.getElementById(`skill-${skill}`).getElementsByClassName("skillbar-text")[0]
        skillbarText.textContent = `${skillData[skill]['shortName'] || skillData[skill]['name']} ${xpToLevel(skills[skill], false, scaling)}: ${formatNumber(xpIntoLevel(skills[skill], scaling), "round")}/${formatNumber(xpForLevel(xpToLevel(skills[skill], false, scaling), scaling), "round")}`
    }

    if (currentLevel < xpToLevel(skills[skill], false, scaling)) {
        insertLog(colorGen("#bbbb44", `${skillData[skill]['name']} increased to ${xpToLevel(skills[skill], false, scaling)}`))
    }
}

function formatNumber(num, round=false, lowPrecision=false) {
    if (!isFinite(num)) return "inf"

    const sign = num < 0 ? "-" : ""
    num = Math.abs(num)

    const units = ["", "k", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"]
    const exp = Math.max(0, Math.floor(Math.log10(num) / 3))

    if (exp >= units.length) {
        return sign + num.toExponential(2).replace("+", "")
    }

    const value = num / 1000 ** exp
    let decimals
    if (lowPrecision == false) {
        decimals = value < 1 ? 3 : value < 10 ? 2 : value < 100 ? 1 : 0
    } else {
        decimals = value < 1 ? 2 : value < 10 ? 1 : 0
    }
    
    if (round == "floor") {
        const factor = 10 ** decimals
        const floored = Math.floor(value * factor) / factor
        return sign + floored.toFixed(decimals).replace(/\.0+$/, "") + units[exp]
    } else if (round == "round") {
        return sign + Number(value.toFixed().replace(/\.0+$/, "")) + units[exp]
    } else {
        return sign + Number(value.toFixed(decimals).replace(/\.0+$/, "")) + units[exp]
    }
}

function englishifyNumber(n) {
    var special = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"]
    var deca = ["twent", "thirt", "fort", "fift", "sixt", "sevent", "eight", "ninet"]
    if (n < 20) return special[n]
    if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + "ieth"
    return deca[Math.floor(n / 10) - 2] + "y-" + special[ n% 10]
}

function formatString(string, values) {
    return string.replace(/\$\{(\w+)\}/g, (_, key) => values[key])
}

function getMovementSpeed() {
    let inventoryMulti = 1
    if (inventoryWeight > 0) {
        inventoryMulti = Math.min(getMaxWeight() / inventoryWeight, 1)
    }
    return (50 + getSkillLevel("walking") * 3) * inventoryMulti * calcEnergyDebuff()
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

function createItemDiv(item, type="inventory", stackable=true, increment=null) {
    const isInventory = type === "inventory"

    const idPrefix = isInventory ? "item" : "storage-item"
    const quantitySource = isInventory ? inventory : storage

    const itemParent = document.createElement("div")
    itemParent.className = "item-parent"
    itemParent.id = stackable ? `${idPrefix}-${item}` : `${idPrefix}-${item}_${increment}`
    itemParent.setAttribute("data-tooltip-title", itemData[item]['name'])
    itemParent.setAttribute("data-tooltip-text", itemData[item]['desc'])
    itemParent.setAttribute("data-class", itemData[item]['class'])
    if (itemData[item]['combat']) {itemParent.setAttribute("data-tooltip-special", "equipment")}

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
    const targetTable = document.getElementById(isInventory ? "inventory-table" : "storage-table")
    for (const child of targetTable.children) {
        if (itemData[item]['class'] < child.getAttribute("data-class") || (itemData[item]['class'] === child.getAttribute("data-class") && itemData[item]['name'] < child.getAttribute("data-tooltip-title"))) {
            targetTable.insertBefore(itemParent, child)
            return
        }
    }
    targetTable.appendChild(itemParent)
}

function genItemLogText(item, amount) {
    return `${amount != null ? colorGen("#ccccff", `x${Math.abs(amount)} `) : ""}${colorGen(itemClasses[itemData[item]['class']], itemData[item]['name'])}`
}

let itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
function changeInventory(item, amount, announceReduction=false, itemId=null, newItemData=null) {
    if (itemData[item]['stackable'] !== false) {
        if (inventory[item] == undefined) {
            if (amount <= 0) {return false}
            inventory[item] = amount
            createItemDiv(item)
        } else {
            if (inventory[item] + amount < 0) {return false}
            inventory[item] += amount

            if (inventory[item] == 0) {
                delete inventory[item]
                document.getElementById(`item-${item}`).remove()
            } else {
                document.getElementById(`item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${inventory[item]}`
            }
        }
        changeQuestProgress("items", item, inventory[item])
    } else {
        if (amount == 1) {
            if (newItemData == null) {
                newItemData = {"name": item}
                const itemCombatData = itemData[item]['combat']
                if (itemCombatData) {
                    if (itemData[item]['durability']) {
                        newItemData['durability'] = randomRange(itemData[item]['durability'][0], itemData[item]['durability'][1], 0)
                        newItemData['maxDurability'] = newItemData['durability']
                    }
                    if (itemCombatData['class'] == "weapon") {
                        newItemData['damage'] = randomRange(itemCombatData['damage'][0], itemCombatData['damage'][1], 2)
                    }
                    if (itemCombatData['armor']) {
                        newItemData['armor'] = randomRange(itemCombatData['armor'][0], itemCombatData['armor'][1], 2)
                    }
                }
            }

            if (itemId == null) {
                inventoryNonStackable[inventoryNonStackableIncrement] = newItemData
                inventoryNonStackableIncrement += 1
                createItemDiv(item, "inventory", false, inventoryNonStackableIncrement - 1)
            } else {
                inventoryNonStackable[itemId] = newItemData
                createItemDiv(item, "inventory", false, itemId)
            }
        } else {
            if (itemData[item]['combat']) {
                const itemClass = itemData[item]['combat']['class']
                if (equipment[itemClass] != null && itemId == equipment[itemClass][1]) {
                    changeEquipment(itemId)
                }
            }
            delete inventoryNonStackable[itemId]
            document.getElementById(`item-${item}_${itemId}`).remove()
        }
    }

    if (itemLogStackData['item'] != item) {
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
    }
    if (amount > 0) {
        if (itemLogStackData['type'] != "obtain") {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`Obtained ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
        itemLogStackData['type'] = "obtain"
    } else if (announceReduction == true) {
        if (itemLogStackData['type'] != "use") {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`Used ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
        itemLogStackData['type'] = "use"
    }
    itemLogStackData['item'] = item

    if (itemData[item]['weight']) {
        const maxWeight = getMaxWeight()
        inventoryWeight += itemData[item]['weight'] * amount
        document.getElementById("inventory-weight").textContent = `${formatNumber(inventoryWeight)}g / ${formatNumber(maxWeight)}g`
        if (inventoryWeight > maxWeight * 4) {
            document.getElementById("inventory-weight").style.color = "#ff0000"
        } else if (inventoryWeight > maxWeight * 2) {
            document.getElementById("inventory-weight").style.color = "#ff8800"
        } else if (inventoryWeight > maxWeight) {
            document.getElementById("inventory-weight").style.color = "#ffff00"
        } else {
            document.getElementById("inventory-weight").style.color = ""
        }
    }

    if (itemData[item]['obtainExecute']) {
        itemData[item]['obtainExecute'](amount)
    }

    if (stats['discoveredItems'] == undefined) {
        stats['discoveredItems'] = []
    }

    if (!stats['discoveredItems'].includes(item)) {
        stats['discoveredItems'].push(item)
        insertLog(`${colorGen("#ffff00", "New Item:")} ${genItemLogText(item)}`, [itemData[item]['name'], itemData[item]['desc']])
        checkAchievement("collector")
    }
}

function discoverRecipe(recipe) {
    if (!knownRecipes.includes(recipe)) {
        knownRecipes.push(recipe)
        giveAchievement("discovery")
        insertLog(`New Recipe: ${genItemLogText(recipe)}`, [itemData[recipe]['name'], itemData[recipe]['desc']])
    }
}

function generateStorageMenu() {
    const storageTable = document.createElement("div")
    storageTable.id = "storage-table"
    document.getElementById("main").appendChild(storageTable)
    for (const [item, amount] of Object.entries(storage)) {
        // changeStorage(item, amount)
        createItemDiv(item, "storage")
    }
    for (const [id, data] of Object.entries(storageNonStackable)) {
        const item = data['name']
        // changeStorage(item, 1, id, data)
        createItemDiv(item, "storage", false, id)
    }
}

function changeStorage(item, amount, itemId=null, newItemData=null, announce=true) {
    if (itemData[item]['stackable'] !== false) {
        if (storage[item] == undefined) {
            if (amount <= 0) {return false}
            storage[item] = amount
            if (storageAccess) {createItemDiv(item, "storage")}
        } else {
            if (storage[item] + amount < 0) {return false}
            storage[item] += amount

            if (storage[item] == 0) {
                delete storage[item]
                document.getElementById(`storage-item-${item}`).remove()
            } else {
                document.getElementById(`storage-item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${storage[item]}`
            }
        }
    } else {
        if (amount == 1) {
            storageNonStackable[itemId] = newItemData
            if (storageAccess) {createItemDiv(item, "storage", false, itemId)}
        } else {
            delete storageNonStackable[itemId]
            document.getElementById(`storage-item-${item}_${itemId}`).remove()
        }
    }
    if (amount > 0 && announce == true) {
        if (itemLogStackData['type'] != "deposit" || itemLogStackData['item'] != item) {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`Deposited ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
        itemLogStackData['type'] = "deposit"
        itemLogStackData['item'] = item
    }
}

function changeXp(amount) {
    const currentLevel = xpToLevel(xp)
    xp += amount
    updateBar("xp")
    updateLevelText(xp)
    insertLog(colorGen("#6666ff", `+${amount} XP`))
    if (currentLevel < xpToLevel(xp)) {
        changeHp(calcMaxHp() - calcMaxHp(currentLevel))
        updateBar("health")
        insertLog(colorGen("#88ccff", `Levelled up to ${xpToLevel(xp)}`))
    }
}

function getSkillLevel(skill) {
    if (skills[skill] == undefined) {
        return 0
    } else {
        return xpToLevel(skills[skill], false, skillData[skill]['scaling'])
    }
}

function itemClickDetector(e, storage=false) {
    let item = null
    let itemId = null
    if (storage == false) {
        if (e.target.id.startsWith("item-")) {
            item = e.target.id.replace("item-", "")
        } else if (e.target.parentElement.id.startsWith("item-")) {
            item = e.target.parentElement.id.replace("item-", "")
        }
    } else if (storage == true) {
        if (e.target.id.startsWith("storage-item-")) {
            item = e.target.id.replace("storage-item-", "")
        } else if (e.target.parentElement.id.startsWith("storage-item-")) {
            item = e.target.parentElement.id.replace("storage-item-", "")
        }
    }

    if (item.split("_").length == 2) {
        [item, itemId] = item.split("_")
    }

    if (item != null) {
        if (storage == false) {
            const newItemData = inventoryNonStackable[itemId]
            changeInventory(item, -1, false, itemId)
            changeStorage(item, 1, itemId, newItemData)
        } else if (storage == true) {
            const newItemData = storageNonStackable[itemId]
            changeStorage(item, -1, itemId)
            changeInventory(item, 1, false, itemId, newItemData)
        }
    }
}

function storageClickDetector(e) {
    itemClickDetector(e, true)
}

function toggleStorageAccess(value) {
    if (value == true) {
        storageAccess = true
        document.getElementById("inventory-table").addEventListener("click", itemClickDetector)
        document.getElementById("storage-table").addEventListener("click", storageClickDetector)
    } else {
        storageAccess = false
        document.getElementById("inventory-table").removeEventListener("click", itemClickDetector)
        document.getElementById("storage-table").removeEventListener("click", storageClickDetector)
    }
}

function getMaxWeight() {
    return 5000
}

function changeEnergy(amount) {
    let oldenergy = energy
    energy = Math.min(Math.max(energy + amount, 0), 100)
    if (amount < 0 && oldenergy > 35 && energy < 35) {
        insertLog(colorGen("#aaaaaa", "You start to feel tired"))
    }

    updateBar("energy")
}

var weather = "clear"
var weatherStartTime = time
const weatherData = {
    "clear": {
        "changes": {
            "sunny": {"chance": 40, "check": function() {return ["morning", "afternoon"].includes(getTimeName())}},
            "foggy": {"chance": function() {return getTimeName() == "night" ? 30 : 8}},
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

        weights[weather] = typeof data['chance'] == "function" ? data['chance']() : data['chance']
    }

    if (weights['noChange']) {
        if (multi == 0) {delete weights['noChange']}
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
        if (newWeather != "noChange") {
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

function changeTime(amount) {
    time += amount
    stats['gametime'] += amount
    if (currentScene != "sleep") {
        noSleepTime = Math.min(noSleepTime + amount, 1440)
        stats['timeAwake'] = (stats['timeAwake'] ?? 0) + amount
        checkAchievement("insomniac")
    } else {
        stats['totalTimeSlept'] = (stats['timeSlept'] ?? 0) + amount
    }

    if (Math.floor((time - amount) / 1440) < Math.floor(time / 1440)) {
        delete checks['arenaParticipated']
    }
    if (sceneProperties[currentScene]) {
        if (sceneProperties[currentScene].includes("outdoors") && weather == "rain") {
            if (!effects['wet'] || effects['wet']['duration'] - time < 60) {
                changeEffect("wet", 5)
            }
        }
    }

    if (currentScene != "sleep") {changeEnergy(-0.05 * amount)}

    for (const effect in effects) {
        const handler = effectFunctions.get(effect)
        if (handler) {handler(amount)}
    }
    updateWeather(amount)
    document.getElementById("time").textContent = formatTime(time)
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
    div.id = type == "enemy" ? `enemy-effect-${effect}` : `effect-${effect}`
    div.style.backgroundColor = effectData[effect]['color']
    div.setAttribute("data-tooltip-title", effectData[effect]['name'])

    return div
}

function updateEffectTooltip(elem, effect, type="player") {
    let data = type == "enemy" ? combatData['enemyEffects'][effect] : effects[effect]
    let text = effectData[effect]['desc']

    if (!data['indefinite']) {
        text += `<hr>Ends: ${colorGen("#ccccff", formatTime(data['duration'], true))}`
    }

    elem.setAttribute("data-tooltip-text", text)
}

function createEffect(duration, absolute, properties) {
    const effect = {
        "indefinite": duration == 0,
        "duration": duration == 0 ? null : (absolute ? duration : duration + time)
    }

    if (properties != null) {
        effect['properties'] = properties
    }

    return effect
}

function changeEffect(effect, duration=0, absolute=false, properties=null) {
    const effectElem = document.getElementById(`effect-${effect}`)
    const existing = effects[effect]

    if (duration == null) {
        if (!existing) {return}

        delete effects[effect]
        effectElem?.remove()
        return
    } else if (!existing) {
        effects[effect] = createEffect(duration, absolute, properties)

        const div = createEffectElement(effect)
        updateEffectTooltip(div, effect)
        document.getElementById("effects-bar").appendChild(div)
        return
    } else if (duration == 0) {
        existing['indefinite'] = true
        existing['duration'] = null

        if (properties) {existing['properties'] = properties}
    } else {
        existing['indefinite'] = false

        if (absolute) {
            existing['duration'] = duration
        } else {
            existing['duration'] += duration
        }

        if (properties) {existing['properties'] = properties}
    }

    updateEffectTooltip(document.getElementById(`effect-${effect}`), effect)
}

function changeEnemyEffect(effect, duration=0, absolute=false) {
    const effectElem = document.getElementById(`enemy-effect-${effect}`)
    const existing = combatData['enemyEffects'][effect]

    if (duration == null) {
        if (!existing) {return}

        delete combatData['enemyEffects'][effect]
        effectElem?.remove()
        return
    } else if (!existing) {
        combatData['enemyEffects'][effect] = createEffect(duration, absolute)

        const div = createEffectElement(effect, "enemy")
        updateEffectTooltip(div, effect, "enemy")
        document.getElementById("enemy-effects-bar").appendChild(div)
        return
    } else if (duration == 0) {
        existing['indefinite'] = true
        existing['duration'] = null
    } else {
        existing['indefinite'] = false

        if (absolute) {
            existing['duration'] = duration
        } else {
            existing['duration'] += duration
        }
    }

    updateEffectTooltip(document.getElementById(`enemy-effect-${effect}`), effect, "enemy")
}

function calcEnergyDebuff() {
    if (energy >= 35) {
        return 1
    } else {
        return energy / 70 + 0.5
    }
}

function getEquipmentStatBuff(equipment, stat) {
    if (equipment != null) {
        const effects = itemData[equipment[0]]['combat']['effects']
        if (effects == undefined) {return 0}
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
        if (item != null) {
            change = getEquipmentStatBuff(item, stat)
            if (change > 0) {
                multi += change
            } else (
                equipmentEndNegative *= 1 + change
            )
        }
    }

    
    // Decrease
    multi *= equipmentEndNegative

    if (energy < 35) {
        multi *= energy / 70 + 0.5
    }
    if (stat == "spd") {
        if (weather == "foggy") {multi *= 0.75}
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
        if (item != null) {
            change = getEquipmentStatBuff(item, stat)
            if (change > 0) {
                data['positive'].push({"source": itemData[item[0]]['name'], "change": change})
            } else if (change < 0) {
                data['negative'].push({"source": itemData[item[0]]['name'], "change": 1 + change})
            }
        }
    }

    if (energy < 35) {
        data['negative'].push({"source": "Energy", "change": energy / 70 + 0.5})
    }
    if (stat == "spd") {
        if (weather == "foggy") {data['negative'].push({"source": "Foggy Weather", "change": 0.75})}
    }
    return data
}

function getStatModifierBreakdown(stat) {
    const data = getStatModifierInfo(stat)
    output = []
    for (const effect of data['positive']) {
        output.push(`${colorGen("#00ff00", `+${formatNumber(effect['change'] * 100, false, true)}%`)} ${effect['source']}`)
    }
    // if (data['positive'].length > 0 && data['negative'].length > 0) {
    //     output.push("")
    // }
    for (const effect of data['negative']) {
        output.push(`${colorGen("#ff0000", `-${formatNumber((1 - effect['change']) * 100, false, true)}%`)} ${effect['source']}`)
    }

    const modifierPercentage = calcStatModifier(stat) * 100 - 100
    output.push(`Total: ${modifierPercentage > 0 ? "+" : ""}${formatNumber(modifierPercentage)}%`)
    return output.join("\n")
}

function calcEnemyStatDebuff(stat=null) {
    let multi = 1
    if (stat == "spd") {
        if (weather == "foggy") {multi *= 0.75}
    }
    return multi
}

function changeHp(amount) {
    let oldHealth = health
    health = Math.min(Math.max(health + amount, 0), calcMaxHp())

    if (health <= 0) {
        endFight()
        if (currentScene == "theArenaFight") {
            if (arenaData['round'] >= 2) {
                prependText = `${colorGen("#ffee00", `You received $${arenaStatData[arenaData['round'] - 2]['reward']} for participating`)}\n\n`
                changeMoney(arenaStatData[arenaData['round'] - 2]['reward'])
                if (team == "nextLevel") {
                    checks['nextLevelExercisePills'] = Math.round(arenaStatData[arenaData['round'] - 2]['reward'] / 10)
                }
            }
            arenaData = {}
        }
        playTransition()
        if (region == "forest") {
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

        if (document.visibilityState == "hidden") {
            document.title = "Arkivia | DEAD"
        }
    }

    updateBar("health", health - oldHealth)
}

function getQuestGoals(questName) {
    let output = {}
    for (const [type, values] of Object.entries(questData[questName]['goals'])) {
        for (const [stat, data] of Object.entries(values)) {
            if (output[type] == undefined) {
                output[type] = {}
            }
            if (data['lifetime'] == true) {
                let statValue
                if (type == "stats") {
                    statValue = battleStats[stat]
                }

                output[type][stat] = {
                    "amount": data['amount'],
                    "completion": statValue
                }
            } else if (data['lifetime'] == false) {
                let statValue
                if (!quests[questName]) {
                    statValue = 0
                } else {
                    statValue = quests[questName]['goals'][type][stat]['completion']
                }

                output[type][stat] = {
                    "amount": data['amount'],
                    "completion": statValue
                }
            } else if (data['lifetime'] == undefined) {
                let statValue
                if (type == "items") {
                    statValue = inventory[stat] || 0
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
    if (quests[questName] == undefined) {
        return false
    }
    let goals = getQuestGoals(questName)
    for (const [type, values] of Object.entries(goals)) {
        for (const [stat, data] of Object.entries(values)) {
            if (data['amount'] > data['completion']) {
                if (metQuests[questName] == true) {
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
        if (questData[questName]['repeatable'] == false) {
            completedQuests.push(questName)
        }
        document.getElementById("completed-quests-table").appendChild(document.getElementById(`quest-${questName}`))
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#ffff00"
        document.getElementById("completed-quests-table").style.display = ""
        document.getElementById("completed-quests-header").style.display = ""
    } else if (metQuests[questName] == undefined) {
        insertLog(`Quest Met: ${colorGen("#bbff00", `"${questData[questName]['name']}"`)}`)
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#bbff00"
        metQuests[questName] = true
    }
}

function giveQuest(questName, complete=false) {
    if (!quests[questName] && complete == false) {
        nonLifetime = {}
        for (const [type, values] of Object.entries(questData[questName]['goals'])) {
            for (const [stat, data] of Object.entries(values)) {
                if (data['lifetime'] == false) {
                    if (nonLifetime[type] == undefined) {
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
    if (document.getElementById(`quest-${questName}`) == undefined) {
        if (document.getElementById("quests-button").style.display == "none") {
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
                const goalParent = document.createElement("div")
                goalParent.className = "goal-parent"

                const goal = document.createElement("span")
                goal.className = "quest-goal"
                if (type == "kills") {
                    goal.textContent = `${enemyData[stat]['name']}: `
                } else if (type == "stats") {
                    goal.textContent = `${stat.replace("str", "Strength").replace("def", "Defense").replace("spd", "Speed").replace("dex", "Dexterity")}: ` // Kinda bad but it works for now
                } else if (type == "items") {
                    goal.textContent = `${itemData[stat]['name']}: `
                } else {
                    goal.textContent = `${stat}: `
                }

                const goalProgress = document.createElement("span")
                goalProgress.className = "quest-goal-progress"
                goalProgress.id = `quest-${questName}-${stat}`
                if (complete == false) {
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

    if (complete == false) {
        checkCompletion(questName)
    } else {
        delete quests[questName]
        if (!completedQuests.includes(questName)) {
            insertLog(`Completed Quest: ${colorGen("#ffff00", `"${questData[questName]['name']}"`)}`)
            if (questData[questName]['repeatable'] == false) {
                completedQuests.push(questName)
            }
        }
        document.getElementById("completed-quests-table").appendChild(document.getElementById(`quest-${questName}`))
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#ffff00"
        document.getElementById("completed-quests-table").style.display = ""
        document.getElementById("completed-quests-header").style.display = ""
    }
}

function changeQuestProgress(type, stat, value) {
    for (const quest in quests) {
        const questStatData = questData[quest]['goals']?.[type]?.[stat]
        if (questStatData) {
            let newValue
            if (questStatData['lifetime'] == true) {
                newValue = value
            } else if (questStatData['lifetime'] == false) {
                newValue = quests[quest]['goals'][type][stat]['completion'] + value
                quests[quest]['goals'][type][stat]['completion'] = newValue
            } else {
                if (type == "items") {
                    newValue = value
                }
            }
            const goalElem = document.getElementById(`quest-${quest}-${stat}`)
            goalElem.textContent = `${formatNumber(newValue, "floor")}/${questStatData['amount']}`
            if (newValue >= questStatData['amount']) {
                goalElem.style.color = "#00ff00"
                checkCompletion(quest)
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

var trainingSession = {
    "logId": null,
    "gain": 0,
    "stat": null
}
function trainingAreaHandler(stat, gymName="none") {
    const gain = changeBattlestat(stat, gyms[gymName][stat])
    changeSkill("training", 1)
    changeTitleXp("athlete", 1)
    changeEnergy(-0.2)
    if (stat != trainingSession['stat']) {
        trainingSession['stat'] = stat
        trainingSession['logId'] = null
        trainingSession['gain'] = 0
    }
    trainingSession['gain'] += gain
    trainingSession['logId'] = insertLog(`+${formatNumber(trainingSession['gain'])} (+${formatNumber(gain)}/s) ${stat.replace("str", "Strength").replace("def", "Defense").replace("spd", "Speed").replace("dex", "Dexterity")}`, null, trainingSession['logId'], "training")
    if (document.visibilityState == "hidden") {
        document.title = `Arkivia | ${capitaliseFirst(stat)} +${formatNumber(trainingSession['gain'], false, true)} (+${formatNumber(gain, false, true)}/s)`
    }
}

function calcTrainingModifier(stat=null) {
    let multi = 1
    // Positive
    multi += getSkillLevel("training") * 0.02
    if (effects['exercisePill']) {multi += 0.5}

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
        data['positive'].push({"source": "Training Skill", "change": getSkillLevel("training") * 0.02})
    }

    if (effects['exercisePill']) {data['positive'].push({"source": "Exercise Pill", "change": 0.5})}

    if (energy < 35) {
        data['negative'].push({"source": "Energy", "change": energy / 70 + 0.5})
    }

    return data
}

function getTrainingModifierBreakdown(stat) {
    const data = getTrainingModifierInfo(stat)
    output = []
    for (const effect of data['positive']) {
        output.push(`${colorGen("#00ff00", `+${formatNumber(effect['change'] * 100, false, true)}%`)} ${effect['source']}`)
    }
    // if (data['positive'].length > 0 && data['negative'].length > 0) {
    //     output.push("")
    // }
    for (const effect of data['negative']) {
        output.push(`${colorGen("#ff0000", `-${formatNumber((1 - effect['change']) * 100, false, true)}%`)} ${effect['source']}`)
    }

    const modifierPercentage = calcTrainingModifier(stat) * 100 - 100
    output.push(`Total: ${modifierPercentage > 0 ? "+" : ""}${formatNumber(modifierPercentage)}%`)
    return output.join("\n")
}

function changeBattlestat(stat, amount, absolute=false) {
    let multi = absolute == false ? calcTrainingModifier() : 1
    const oldRank = getRank()
    battleStats[stat] += amount * multi
    updateBattlestats(stat)
    changeQuestProgress("stats", stat, battleStats[stat])
    updateLevelText()
    const newRank = getRank()
    if (newRank != oldRank) {
        insertLog(`Rank Changed: ${colorGen("#88bb00", oldRank)} -> ${colorGen("#88bb00", newRank)}`)
    }
    return amount * multi
}

function generateShop(shopName) {
    let shopItems = {}
    if (shopStorage[shopName] == null || shopStorage[shopName]['day'] < getDay(time)) {
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
    document.getElementById("main").appendChild(shopHolder)

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

        if (item != null) {
            if (shopStorage[shopName]['items'][item]['quantity'] <= 0) {
                insertLog(colorGen("#aaaaaa", "Out of stock"))
            } else {
                if (money >= shopStorage[shopName]['items'][item]['price']) {
                    changeMoney(-shopStorage[shopName]['items'][item]['price'])
                    shopStorage[shopName]['items'][item]['quantity'] -= 1
                    document.getElementById(`shop-item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${shopStorage[shopName]['items'][item]['quantity']}`
                    changeInventory(item, 1)
                } else {
                    insertLog(colorGen("#aaaaaa", "Not enough money"))
                }
            }
        }
    })
}

function beginCrafting(item) {
    if (item != null) {
        let nonstackablesRequired = {}
        let nonstackableCounts = {}
        for (const item of Object.values(inventoryNonStackable)) {
            nonstackableCounts[item['name']] = (nonstackableCounts[item['name']] ?? 0) + 1
        }

        for (const [craftingItem, amount] of Object.entries(itemData[item]['crafting']['materials'])) {
            if (itemData[craftingItem]['stackable'] !== false) {
                if (inventory[craftingItem] < amount || inventory[craftingItem] == undefined) {
                    insertLog(colorGen("#aaaaaa", "Missing materials"))
                    return false
                }
            } else {
                if (nonstackableCounts[craftingItem] < amount || nonstackableCounts[craftingItem] == undefined) {
                    insertLog(colorGen("#aaaaaa", "Missing materials"))
                    return false
                }
                if (amount >= 1) {
                    nonstackablesRequired[craftingItem] = amount
                }
            }
        }

        if (Object.keys(nonstackablesRequired).length == 0) {
            let craftingType = itemData[item]['crafting']['type']
            let arrival
            if (craftingType == undefined) {
                arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getCraftingSpeed())
            } else if (craftingType == "alchemy") {
                arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getAlchemySpeed())
            }
            craftInfo['completed'] = 0
            craftInfo['goal'] = itemData[item]['crafting']['complexity']
            craftInfo['recipe'] = item
            sceneManager("empty")
            processText(`You are crafting "${itemData[item]['name']}". You'll finish at ${colorGen("#ccccff", formatTime(arrival, true))}\n\n{Cancel|table|0|cancelCrafting}`)
            playTransition()
        } else {
            sceneManager("empty")
            let outputString = Object.entries(nonstackablesRequired).map(([item, amount]) => `- x${amount} ${itemData[item]['name']}`).join("\n")
            processText(`Choose\n${outputString}\nfrom your inventory\n\n{Cancel|table|0|cancelCrafting}`)
            craftingSelection = true
            craftInfo['required'] = nonstackablesRequired
            craftInfo['selected'] = item
            playTransition()
        }
    }
}

function generateCraftingMenu() {
    const craftingHolder = document.createElement("div")
    craftingHolder.className = "crafting-holder"
    document.getElementById("main").appendChild(craftingHolder)

    let nonstackableCounts = {}
    for (const item of Object.values(inventoryNonStackable)) {
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
        if (itemData[item]['crafting']['type'] == undefined) {
            craftingType.textContent = "C"
            craftingType.style.color = "#ffaa55"
            craftingType.setAttribute("data-tooltip-title", "Crafting")
        } else if (itemData[item]['crafting']['type'] == "alchemy") {
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
            } else {
                materialElement.textContent = itemData[craftingItem]['name']
            }
            if (inventory[craftingItem] >= amount || nonstackableCounts[craftingItem] >= amount) {
                materialElement.style.color = "#aaffaa"
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
    money += amount
    if (amount > 0) {
        insertLog(`Obtained ${colorGen("#cccc55", `$${formatNumber(amount)}`)}`)
    }
    document.getElementById("inventory-money").textContent = `$${formatNumber(money)}`
    checkAchievements(["money1", "money10", "money100"])
}

function getCraftingSpeed() {
    return 1 + (0.05 * getSkillLevel("crafting"))
}

function getAlchemySpeed() {
    return 1 + (0.05 * getSkillLevel("alchemy"))
}

function getExploreSpeed() {
    return 1 + (0.05 * getSkillLevel("exploration"))
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
            if (title != selectedTitle) {
                titleScores[title] *= 0.9999
            }
        }
    }

    const highest = Object.entries(titleScores).reduce((max, current) => current[1] > max[1] ? current : max)
    if (highest[1] >= 50 && playerTitle != titleData[highest[0]]['name']) {
        changeTitle(titleData[highest[0]]['name'])
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
        sceneManager("theArenaWinMatch")
    }],
    ["forestLayer1Death", function() {
        checks['forestLayer1EnemiesRemaining'] = (checks['forestLayer1EnemiesRemaining'] ?? 100) - 1
        processText(`You are clearing the enemies blocking the pathway in the forest.\n${checks['forestLayer1EnemiesRemaining'] || 100} enemies remain.\n\n{![stop.png]Stop|forestLayer1|0|endFight}`)
        if (checks['forestLayer1EnemiesRemaining'] === 0) {
            prependText = "You have finished clearing the enemies.\n\n"
            playTransition()
            sceneManager("forestLayer1")
        }
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
        changeEnergy(2)
        noSleepTime = Math.max(noSleepTime - 40, 0)
        changeTitleXp("sleeper", 1)
    }],
    ["hospital", function() {
        changeHp(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
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
        changeHp(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
        if (time >= arenaData['endTime']) {
            delete arenaData['endTime']
            playTransition()
            sceneManager("theArenaWalkIn")
        }
    }],
    ["grassPlains", function() {
        if (travelInfo['destination'] == null && (checks['spawnDelay'] == null || checks['spawnDelay'] <= time)) {
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
        if (combatData['enemy'] == null) {
            const rng = Math.random()
            if (rng < 0.3 && getTimeName() == "night") {generateEnemy("bat")}
            else if (rng < 0.45) {generateEnemy("lizard")}
            else if (rng < 0.9) {generateEnemy("spider")}
            else {generateEnemy("venomousSpider")}

            combatData['onDeath'] = "forestLayer1Death"
        }
    }],
    ["huntersGuildHeal", function() {
        if (health < calcMaxHp(xpToLevel(xp)) / 3) {
            changeHp(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
        }
    }],
])

const effectFunctions = new Map([
    ["sleepDeprived", function(time) {
        if (currentScene != "sleep") {
            changeEnergy(-0.1 * time)
        }
    }],
    ["wet", function(time) {
        changeEnergy(-0.02 * time)
    }],
    ["poison", function(time) {
        effects['poison']['properties']['dmg'] *= effects['poison']['properties']['change']
        insertLog(`You -> ${colorGen("#ff3333", formatNumber(effects['poison']['properties']['dmg'], "round"))} ${colorGen(effectData['poison']['color'], "(Poison)")}`)
        changeHp(-effects['poison']['properties']['dmg'])
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

function tick() {
    stats['playtime'] += 1
    changeTime(currentScene != "sleep" ? 1 : 10)
    updateBar("health")

    if (travelInfo['destination'] != null) {
        // if ((travelInfo['arrival'][0] <= time && travelInfo['arrival'][1] <= day) || travelInfo['arrival'][1] < day) {
        //     sceneManager(travelInfo['destination'])
        //     playTransition()
        //     travelInfo['destination'] = null
        //     travelInfo['arrival'] = [0, 0]
        // }
        travelInfo['completed'] += getMovementSpeed()
        changeSkill("walking", 1)
        if (travelInfo['completed'] >= travelInfo['distance']) {
            sceneManager(travelInfo['destination'])
            playTransition()
            travelInfo['destination'] = null
            travelInfo['distance'] = 0
            travelInfo['completed'] = 0
        }
    }

    if (craftInfo['recipe'] != null) {
        let craftingType = itemData[craftInfo['recipe']]['crafting']['type']
        if (craftingType == undefined) {
            craftInfo['completed'] += getCraftingSpeed()
            changeSkill("crafting", 1)
            changeTitleXp("crafter", 2)
        } else if (craftingType == "alchemy") {
            craftInfo['completed'] += getAlchemySpeed()
            changeSkill("alchemy", 1)
            changeTitleXp("alchemist", 2)
        }
        craftInfo['skillXp'] += 1
        if (craftInfo['completed'] >= craftInfo['goal']) {
            playTransition()
            for (const [craftingItem, amount] of Object.entries(itemData[craftInfo['recipe']]['crafting']['materials'])) {
                if (itemData[craftingItem]['stackable'] != false) {
                    changeInventory(craftingItem, -amount)
                }
            }

            for (const item of craftInfo['using']) {
                changeInventory(inventoryNonStackable[item]['name'], -1, false, item)
            }

            changeInventory(craftInfo['recipe'], 1)
            const storedRecipe = craftInfo['recipe']
            craftInfo['recipe'] = null
            craftInfo['completed'] = 0
            craftInfo['goal'] = 0
            craftInfo['using'] = []
            craftInfo['skillXp'] = 0
            giveAchievement("crafter")
            if (!settings['autoRepeatCrafting']) {
                sceneManager("table")
            } else {
                if (beginCrafting(storedRecipe) == false) {
                    sceneManager("table")
                }
            }
        }
    }

    if (explorePools[currentScene] != null) {
        if (exploreData['area'] == null || exploreData['area'] != currentScene) {
            exploreData['area'] = currentScene
            exploreData['goal'] = randomRange(explorePools[currentScene]['difficulty'][0], explorePools[currentScene]['difficulty'][1], 0)
        }
        exploreData['completed'] += getExploreSpeed()
        changeSkill("exploration", 1)
        changeTitleXp("seeker", 1)
        if (exploreData['completed'] >= exploreData['goal']) {
            exploreData['completed'] = 0
            exploreData['goal'] = randomRange(explorePools[currentScene]['difficulty'][0], explorePools[currentScene]['difficulty'][1], 0)
            changeInventory(getRandomItem(explorePools[currentScene]['loot']), 1)
        }
    }

    for (const [effect, value] of Object.entries(effects)) {
        if (Number.isInteger(value['duration'])) {
            if (value['duration'] <= time) {
                changeEffect(effect, null)
            }
        }
    }

    // Combat
    if (combatData['enemy'] != null) {
        for (const [effect, value] of Object.entries(combatData['enemyEffects'] || {})) {
            if (Number.isInteger(value['duration'])) {
                if (value['duration'] <= time) {
                    changeEnemyEffect(effect, null)
                }
            }
        }

        if (combatData['enemyHealth'] > 0) {
            changeEnergy(-0.05)
            const effectiveStats = {}
            for (const [stat, value] of Object.entries(battleStats)) {
                effectiveStats[stat] = value * calcStatModifier(stat)
            }
            const enemyStats = {}
            for (const [stat, value] of Object.entries(combatData['enemyStats'])) {
                enemyStats[stat] = value * calcEnemyStatDebuff(stat)
            }

            let turnDmg = getBaseDamage(effectiveStats['str']) * (Math.random() * 0.4 + 0.8) * (getEquipmentStats("weapon") != null ? getEquipmentStats("weapon")['damage'] : 1)
            let turnDmgMulti = 1
            turnDmgMulti += getSkillLevel("fighting") * 0.05
            if (equipment['weapon']) {
                turnDmgMulti += getSkillLevel(`${itemData[equipment['weapon'][0]]['subclass']}Mastery`) * 0.03
            } else {
                turnDmgMulti += getSkillLevel("unarmedMastery") * 0.03
            }
            turnDmg = turnDmg * turnDmgMulti

            const turnDmgMitigation = calcDamageMitigation(effectiveStats['str'], enemyStats['def'])
            const turnHitChance = calcHitChance(effectiveStats['spd'], enemyStats['dex'])
            
            const turnActualDmg = Math.round(turnDmg * (1 - turnDmgMitigation))
            const oldEnemyHealth = combatData['enemyHealth']
            if (turnHitChance / 100 > Math.random()) {
                insertLog(`You -> ${colorGen("#ff3333", turnActualDmg)}`)
                combatData['enemyHealth'] -= turnActualDmg
                if (equipment['weapon']) {
                    const item = equipment['weapon'][0]
                    const itemId = equipment['weapon'][1]
                    getEquipmentStats("weapon")['durability'] -= 1
                    document.getElementById("equipment-weapon").querySelector(".bar-fill").style.width = `${getEquipmentStats("weapon")['durability'] / getEquipmentStats("weapon")['maxDurability'] * 100}%`
                    if (getEquipmentStats("weapon")['durability'] <= 0) {
                        insertLog(`${genItemLogText(item, null)} broke`, [itemData[item]['name'], itemData[item]['desc']])
                        changeEquipment(itemId)
                        changeInventory(item, -1, false, itemId)
                    }

                    if (itemData[item]['combat']['execute']) {
                        itemData[item]['combat']['execute'](turnActualDmg)
                    }

                    if (skillData[`${itemData[item]['subclass']}Mastery`]) {
                        changeSkill(`${itemData[item]['subclass']}Mastery`, 1)
                    }
                } else {
                    changeSkill("unarmedMastery", 1)
                }
            } else {
                insertLog(colorGen("#aaaaaa", "You missed"))
            }
            changeSkill("fighting", 1)
            if (combatData['enemy'] == "strawDummy") {
                changeTitleXp("disciple", 1)
            } else {
                changeTitleXp("fighter", 1)
            }

            if (combatData['enemyHealth'] <= 0) {
                if (oldEnemyHealth >= combatData['enemyMaxHealth']) {
                    giveAchievement("flatline")
                }
                if (enemyStats['str'] > 0 && enemyStats['spd'] > 0) {
                    if (combatData.tags?.['hits'] == undefined) {
                        giveAchievement("untouchable")
                    }
                    if (health / calcMaxHp() <= 0.05) {
                        giveAchievement("survivor")
                    }
                }
                killEnemy()
            } else {
                if (enemyStats['str'] > 0 && enemyStats['spd'] > 0 && combatData['enemyEffects']['stun'] == undefined) {
                    let turnDmg = getBaseDamage(enemyStats['str']) * (Math.random() * 0.4 + 0.8)

                    const turnDmgMitigation = calcDamageMitigation(enemyStats['str'], effectiveStats['def'])
                    const turnHitChance = calcHitChance(enemyStats['spd'], effectiveStats['dex'])
                    const hitPart = getRandomItem({
                        "head": 2,
                        "chest": 3,
                        "arms": 2,
                        "legs": 1
                    })
                    const hitArmor = getEquipmentStats(hitPart)
                    const turnArmorMitigation = hitArmor != null ? calcArmorMitigation(turnDmg, hitArmor['armor']) : 0
                    const turnActualDmg = Math.round(turnDmg * (1 - turnDmgMitigation) * (1 - turnArmorMitigation))

                    if (turnHitChance / 100 > Math.random()) {
                        insertLog(`${enemyData[combatData['enemy']]['name']} -> ${colorGen("#ff3333", turnActualDmg)}`)
                        const tags = (combatData['tags'] ??= {})
                        tags['hits'] = (tags['hits'] ?? 0) + 1

                        if (enemyData[combatData['enemy']]['attackExecute']) {
                            enemyData[combatData['enemy']]['attackExecute'](turnActualDmg)
                        }
                        changeHp(-turnActualDmg)
                        if (equipment[hitPart]) {
                            const item = equipment[hitPart][0]
                            const itemId = equipment[hitPart][1]
                            getEquipmentStats(hitPart)['durability'] -= 1
                            document.getElementById(`equipment-${hitPart}`).querySelector(".bar-fill").style.width = `${getEquipmentStats(hitPart)['durability'] / getEquipmentStats(hitPart)['maxDurability'] * 100}%`
                            if (getEquipmentStats(hitPart)['durability'] <= 0) {
                                insertLog(`${genItemLogText(item, null)} broke`, [itemData[item]['name'], itemData[item]['desc']])
                                changeEquipment(itemId)
                                changeInventory(item, -1, false, itemId)
                            }
                        }
                    } else {
                        insertLog(colorGen("#aaaaaa", `${enemyData[combatData['enemy']]['name']} missed`))
                    }
                }
                updateBar("enemyHealth", combatData['enemyHealth'] - oldEnemyHealth)
            }
        } else {
            killEnemy()
        }

        if (document.visibilityState == "hidden" && combatData['enemy'] != null) {
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
        changeEffect("sleepDeprived")
    } else {
        changeEffect("sleepDeprived", null)
    }

    const handler = sceneTicks.get(currentScene)
    if (handler) {handler()}

    // updateBar("energy") No longer needed as changeenergy function updates it
    // updateBar("xp") No longer needed as changexp function updates it
    updateBattlestats()
    if (combatData['enemy'] != null) {updateEnemyBattlestats()}

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
    if (saveEnabled == true && currentScene != "intro1") {
        saveToLocal(makeSave())
        document.getElementById("last-save").textContent = `Last Save: ${new Date().toLocaleTimeString()}`
    }
}, 10000)

for (const elem of document.getElementById("menu-buttons-holder").children) {
    elem.addEventListener("click", function() {
        for (const elem2 of document.getElementsByClassName("sidebar-menu")) {
            if (elem2.id.replace("sidebar-menu-", "") == elem.id.replace("-button", "")) {
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
        if (tooltipSpecial == "equipment") {
            const [item, itemId] = activeTarget.id.replace("item-", "").split("_")
            const tooltipItemData = inventoryNonStackable[itemId] || storageNonStackable[itemId]
            if (tooltipItemData != undefined) {
                if (tooltipItemData['damage']) {tooltipText += `<hr>Dmg: ${colorGen("#ff0000", tooltipItemData['damage'])}`}
                if (tooltipItemData['durability']) {tooltipText += `\nDurability: ${colorGen("#ffff00", tooltipItemData['durability'])}`}
                if (tooltipItemData['armor']) {tooltipText += `\nArmor: ${colorGen("#00ffff", tooltipItemData['armor'])}`}
            }
        } else if (tooltipSpecial == "stat") {
            const stat = activeTarget.id.replace("stat-", "")
            const statModBreakdown = getStatModifierBreakdown(stat)
            const trainingModBreakdown = getTrainingModifierBreakdown(stat)
            if (statModBreakdown) {
                tooltipText += `<hr><b>Stat Modifiers</b>\n${statModBreakdown}`
            }
            if (trainingModBreakdown && trainingModBreakdown != "Total: 0%") {
                tooltipText += `<hr><b>Training Modifiers</b>\n${trainingModBreakdown}`
            }
        }

        document.getElementById("tooltip-title").textContent = tooltipTitle

        if (tooltipText != undefined && tooltipText.includes("<")) {
            document.getElementById("tooltip-text").innerHTML = tooltipText
        } else {
            document.getElementById("tooltip-text").textContent = tooltipText
        }

        if (tooltipText == undefined) {
            document.getElementById("tooltip-hr").style.display = "none"
        } else {
            document.getElementById("tooltip-hr").style.display = ""
        }
    }
}

document.addEventListener("mouseover", function(e) {
    const elem = e.target.closest("[data-tooltip-title]")
    if (!elem) return
    
    activeTarget = elem
    updateTooltip()

    const tooltip = document.getElementById("tooltip")
    const offset = 14

    const tooltipWidth = tooltip.offsetWidth
    const tooltipHeight = tooltip.offsetHeight

    let left = e.clientX + offset
    let top = e.clientY + offset

    if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - offset
    }

    if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - offset
    }

    tooltip.style.left = `${left}px`
    tooltip.style.top = `${top}px`
    tooltip.style.opacity = "1"
})

document.addEventListener("mouseout", function(e) {
    if (activeTarget != undefined) {
        activeTarget = null
        document.getElementById("tooltip").style.opacity = "0"
    }
})

document.addEventListener("mousemove", function (e) {
    if (!activeTarget) return

    const tooltip = document.getElementById("tooltip")
    const offset = 14

    const tooltipWidth = tooltip.offsetWidth
    const tooltipHeight = tooltip.offsetHeight

    let left = e.clientX + offset
    let top = e.clientY + offset

    if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - offset
    }

    if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - offset
    }

    tooltip.style.left = `${left}px`
    tooltip.style.top = `${top}px`
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
    let itemClass = itemData[item]['combat']['class']
    if (itemClass == 'accessory') {
        if ((equipment['accessory1'] == null || equipment['accessory1'][1] == itemId) && (equipment['accessory2'] == null || equipment['accessory2'][1] != itemId)) {itemClass = "accessory1"}
        else {itemClass = "accessory2"}
    }

    const equipmentElem = document.getElementById(`equipment-${itemClass}`)
    const textElem = equipmentElem.querySelector(".equipment-item-text")
    if (equipment[itemClass] == null || itemId != equipment[itemClass][1]) {
        if (equipment[itemClass] != null && itemId != equipment[itemClass][1]) {
            document.getElementById(`item-${equipment[itemClass][0]}_${equipment[itemClass][1]}`).querySelector(".item-equipped").remove()
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
    } else {
        equipment[itemClass] = null
        textElem.textContent = equipmentElem.getAttribute("data-tooltip-title")
        textElem.style.fontSize = ""
        textElem.style.color = ""
        equipmentElem.querySelector(".bar-fill").style.width = "0"

        document.getElementById(`item-${item}_${itemId}`).querySelector(".item-equipped").remove()
    }
}

document.getElementById("inventory-table").addEventListener("click", function(e) {
    if (storageAccess) {return}
    let [item, itemId] = e.target.closest("[id^=\"item-\"]").id.replace("item-", "").split("_")

    if (discardMode == true) {
        if (item != null) {
            changeInventory(item, -1, false, itemId)
            if (itemLogStackData['type'] != "discard" || itemLogStackData['item'] != item) {
                itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
            }
            itemLogStackData['amount'] += 1
            itemLogStackData['id'] = insertLog(`Discarded ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
            itemLogStackData['type'] = "discard"
            itemLogStackData['item'] = item

            stats['itemsDeleted'] = (stats['itemsDeleted'] ?? 0) + 1
            checkAchievement("wasteful")
        }
        return
    }

    if (craftingSelection == true) {
        if (craftInfo['required'][item] != undefined) {
            const inventorySlot = document.getElementById(`item-${item}_${itemId}`)
            if (!craftInfo['using'].includes(itemId)) {
                if (craftInfo['required'][item] > 0) {
                    if (itemData[item]['combat']) {
                        if (equipment[itemData[item]['combat']['class']] != undefined && equipment[itemData[item]['combat']['class']][1] == itemId) {
                            return
                        }
                    }

                    if (inventorySlot) {
                        const itemSelected = document.createElement("span")
                        itemSelected.className = "item-selected"
                        itemSelected.textContent = "S"

                        inventorySlot.appendChild(itemSelected)
                    }
                    craftInfo['using'].push(itemId)
                    craftInfo['required'][item] -= 1
                }
            } else {
                craftInfo['using'].splice(craftInfo['using'].indexOf(itemId), 1)
                craftInfo['required'][item] += 1
                inventorySlot.getElementsByClassName("item-selected")[0].remove()
            }
            let outputString = Object.entries(craftInfo['required']).filter(([item, amount]) => amount > 0).map(([item, amount]) => `- x${amount} ${itemData[item]['name']}`).join("\n")
            if (outputString != "") {
                processText(`Choose\n${outputString}\nfrom your inventory\n\n{Cancel|table|0|cancelCrafting}`)
            } else {
                processText(`{Confirm|craftConfirm}\n\n{Cancel|table|0|cancelCrafting}`)
            }
        }
        return
    }

    if (item != null) {
        if (itemData[item]['execute']) {
            itemData[item]['execute']()
            changeInventory(item, -1, true)
        } else if (itemData[item]['combat']) {
            changeEquipment(itemId)
        }
    }
})

document.getElementById("inventory-discard").addEventListener("click", function(e) {
    if (discardMode == false) {
        discardMode = true
        document.getElementById("inventory-discard").style.backgroundColor = "#ff0000"
        document.getElementById("inventory-discard").style.color = "#000000"
    } else {
        discardMode = false
        document.getElementById("inventory-discard").style.backgroundColor = ""
        document.getElementById("inventory-discard").style.color = ""
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
        if ((completedQuests.includes(questList[i]['quest']) || metQuests[questList[i]['quest']]) && (questProgression[checkId] == undefined || questProgression[checkId] < i)) {
            const quest = questList[i]

            if (metQuests[questList[i]['quest']]) {
                delete metQuests[questList[i]['quest']]
                giveQuest(questList[i]['quest'], true)
            }

            questProgression[checkId] = i
            if (questList[i + 1] != undefined) {
                giveQuest(questList[i + 1]['quest'])
            }
            if (questList[i]['rewards']) {
                for (const [item, amount] of Object.entries(questList[i]['rewards'])) {
                    changeInventory(item, amount)
                }
            }
            if (questList[i]['money']) {
                changeMoney(questList[i]['money'])
            }


            if (questList[i]['consumed']) {
                for (const [item, amount] of Object.entries(questList[i]['consumed'])) {
                    changeInventory(item, -amount)
                }
            }

            return quest['message']
        }
    }
    if (allComplete == false) {
        return actionTexts['none']
    } else {
        return actionTexts['allComplete'] || actionTexts['none']
    }
}

const sceneProperties = {
    "housingArea": ["outdoors"],
    "townCenter": ["outdoors"],
    "noticeBoard": ["outdoors"],
    "trainingGrounds": ["outdoors"],
    "trainingGroundsInstructor": ["outdoors"],
    "trainingGroundsInstructorAskStats": ["outdoors"],
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
    "forestLayer1Clear": ["outdoors"],
    "forestLayer2": ["outdoors"],
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
}

class scenes {
    static empty() {
        return ``
    }

    static craftConfirm() {
        const item = craftInfo['selected']
        craftInfo['selected'] = null
        craftingSelection = false
        let craftingType = itemData[item]['crafting']['type']
        let arrival
        if (craftingType == undefined) {
            arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getCraftingSpeed())
        } else if (craftingType == "alchemy") {
            arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getAlchemySpeed())
        }
        craftInfo['completed'] = 0
        craftInfo['goal'] = itemData[item]['crafting']['complexity']
        craftInfo['recipe'] = item
        return `You are crafting "${itemData[item]['name']}". You'll finish at ${colorGen("#ccccff", formatTime(arrival, true))}\n\n{Cancel|table|0|cancelCrafting}`
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
        return `You are currently sleeping. Time passes faster...\n\n{![leave.png]Get up|home}`
    }

    static storage() {
        // toggleStorageAccess(true)
        return `You can store items here for future use.\n\n{![leave.png]Leave|home|0|leaveStorage}`
    }

    static table() {
        return `You are able to craft items here.\n\n{![leave.png]Leave|home}`
    }

    static housingArea() {
        return `You are in the housing area of the town. You can access your home or other areas from here.\n\n{![enter.png]Home|home}\n\n{![town_center.png]Town Center|townCenter|250}`
    }

    static townCenter() {
        return `You are at the center of the town. Many people rush by hastily.\n\n{![poster.png]Notice Board|noticeBoard}\n{![dumbbells.png]Training Grounds|trainingGrounds}\n{![training_dummy.png]Dojo|dojo}\n\n{![hospital.png]Hospital|hospital}\n{![dollar.png]Merchant|merchant}\n\n{![alley.png]Alley|alley}\n\n{![wood_door.png]Housing Area|housingArea|250}\n{![arrow_up.png]Town North|townNorth|250}`
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
        if (checks['trainingGroundsTeamIntro'] && team != "nextLevel") {
            r += `\n\n{![tick.png]Join Team|trainingGroundsTeamIntro1}`
        }
        
        if (team == "nextLevel") {
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
        return `You are doing push-ups in the training grounds.\n\n{![stop.png]Stop|trainingGrounds}`
    }

    static trainingGrounds_def() {
        return `You are practicing bracing in the training grounds.\n\n{![stop.png]Stop|trainingGrounds}`
    }

    static trainingGrounds_spd() {
        return `You are practicing speed punching in the training grounds.\n\n{![stop.png]Stop|trainingGrounds}`
    }

    static trainingGrounds_dex() {
        return `You are balancing on a beam in the training grounds.\n\n{![stop.png]Stop|trainingGrounds}`
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
        changeInventory("exercisePill", 4)
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
        return `You are lifting weights in your team's tent.\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_def() {
        return `You are practicing sparring against a team member.\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_spd() {
        return `You are practicing spot jogging in your team's tent.\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_dex() {
        return `You are practicing dodging punches from a team member.\n\n{![stop.png]Stop|trainingGrounds_nextLevel}`
    }

    static dojo() {
        if (checks['dojo'] == undefined) {
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
        if (checks['firstDummy'] != true) {combatData['onDeath'] = "firstTrainingDummy"}
        return `You are practicing fighting against training dummies.\n\n{![stop.png]Stop|dojo|0|endFight}`
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
        return `You are fighting a golem.\n\n{![leave.png]Return|dojoYard|0|endFight}`
    }

    static hospital() {
        if (health < calcMaxHp()) {
            return `You are getting healed by a doctor...\n\n{![leave.png]Leave|townCenter}`
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
        return `"Welcome! I'm the main supplier of various goods in this town. I can also buy any straw baskets that you may have. Feel free to look around."\n\n{![dollar.png]Sell|merchantSell}\n\n{![leave.png]Leave|townCenter}`
    }

    static merchantSell() {
        if (inventory['strawBasket'] == undefined) {
            return `"It appears that you don't have any straw baskets to sell. Come back when you get some, I pay $5 for each."\n\n{![leave.png]Return|merchant}`
        } else {
            return `"Would you like to sell all your straw baskets for a total of ${colorGen("#cccc55", `$${inventory['strawBasket'] * 5}`)}?"\n\n{![tick.png]Yes|merchant|0|merchantSell}\n\n{![leave.png]Return|merchant}`
        }
    }

    static townNorth() {
        return `You are at the north of the town. This area is commonly used for entertainment activites.\n\n{![park.png]Park|park}\n{![sword.png]Weapon Shop|weaponShop}\n{![sword.png]The Arena|theArenaEntrance}\n\n{![leave.png]Town Gates|townGatesNorth|250}\n{![town_center.png]Town Center|townCenter|250}`
    }

    static park() {
        return `You are in the park. Various trees and plants are scattered around.\n\n{![search.png]Explore|parkExplore}\n\n{![leave.png]Leave|townNorth}`
    }

    static parkExplore() {
        return `You are searching for valuable objects in the park.\n\n{![stop.png]Stop|park}`
    }

    static weaponShop() {
        return `"Welcome to my weapon shop, I craft and import weapons from various places. Don't think about stealing, you are in a weapon shop after all."\n\n{![leave.png]Leave|townNorth}`
    }

    static theArenaEntrance() {
        arenaData = {}
        let r = `You are in the entrance of the arena.`
        r += getDayName() == "Sunday" ? ` It's quite crowded with many people rushing to join the queue for tickets.${checks['arenaParticipated'] == undefined ? "\n\n{![sword.png]Participate|theArenaSignup}" : ""}` : " It's quite empty, more people would be here on a Sunday."
        r += `\n\n{![leave.png]Leave|townNorth}`
        return r
    }

    static theArenaSignup() {
        let r = `You join the signup queue and patiently wait for your turn.\n\n`
        r += getTotalBattlestats() >= 20 ? `"Hello, would you like to participate in the matches?"\n\n{![tick.png]Yes|theArenaSignupIntro1}\n{![cross.png]No|theArenaEntrance}` : `"Unfortunately you do not meet the minimum requirements. Come back when you have a rank of ${colorGen("#88bb00", "G-")} or higher."\n\n{![leave.png]Leave|theArenaEntrance}`
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
        return `You walk into the arena and prepare to fight your opponent.\n\nThe organiser shouts, "This is round ${arenaData['round']}, get ready."\n\n{![sword.png]Fight|theArenaFight}`
    }

    static theArenaFight() {
        const newStats = arenaStatData[arenaData['round'] - 1]
        if (newStats['enemyType'] == undefined) {
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
        combatData['onDeath'] = "arenaWinMatch"
        return `You are currently fighting your opponent in The Arena.`
    }

    static theArenaWinMatch() {
        let r = ""
        if (team == "nextLevel" && checks['nextLevelCongrats'] == false) {
            r += `A member of your team runs towards you\n\n"Congrats on winning your first match, you did great in there"\n\n`
            checks['nextLevelCongrats'] = true
        } else {
            r += `"Good job contestant on winning your ${englishifyNumber(arenaData['round'])} round, the next round will begin shortly."`
        }
        r += `\n\n{![enter.png]Begin Immediately|theArenaWalkIn}\n\n{![hospital.png]Medbay|theArenaMedbay}\n\n{![leave.png]Resign|theArenaEntrance|0|theArenaResign}`
        arenaData['endTime'] = time + 60
        arenaData['round'] += 1
        return r
    }

    static theArenaMedbay() {
        let r = ""
        if (health < calcMaxHp()) {
            r += `You are getting healed by a doctor...`
        } else {
            r += `You are already at maximum health.`
        }
        r += `\n\n{![leave.png]Leave|theArenaWinMatch}`
        return r
    }

    static townGatesNorth() {
        let r = `You are standing in front of the town gates.\n\n`
        r += completedQuests.includes("dojoIntro5") ? `"You have permission to leave the town if you wish. You can come back at any time."\n\n{![leave.png]Leave the town|townGatesNorthExterior}` : `"You're too weak to leave the town on your own, it would be reckless of us to let you through."`
        r += `\n\n{![arrow_up.png]Town North|townNorth|250}`
        return r
    }

    static townGatesNorthExterior() {
        return `You are standing in front of the exterior of the town gates.\n\n{![enter.png]Enter the town|townGatesNorth}\n{![park.png]Grass Plains|grassPlains|500}`
    }

    static grassPlains() {
        return `You are standing in the grass plains. You notice some slimes jumping around.\n\n{![leave.png]Escape|grassPlains|0|grassPlainsEscape}\n\n{![enter.png]Town Gates|townGatesNorthExterior|500|endFight}\n{![forest.png]Forest|forestLayer1|1000|endFight}`
    }

    static forestLayer1() {
        let r =  `You are standing near the entrance of the forest. The nearby trees provide some shade.`
        if (checks['forestLayer1EnemiesRemaining'] !== 0) {r += ` Some monsters are blocking the path to the deeper layers.`}
        r += `\n\n{![search.png]Explore|forestLayer1Explore}`
        if (checks['forestLayer1EnemiesRemaining'] !== 0) {r += `\n{![sword.png]Clear path|forestLayer1Clear}`}
        r += `\n\n{![sword_shield.png]Hunters' Guild|huntersGuild}\n\n`
        if (checks['forestLayer1EnemiesRemaining'] === 0) {r += `{![arrow_right.png]Walk towards the center|forestLayer2|300(Forest Center)}\n`}
        r += `{![park.png]Grass Plains|grassPlains|1000}`
        return r
    }

    static forestLayer1Explore() {
        return `You are searching for items in the forest.\n\n{![stop.png]Stop|forestLayer1}`
    }

    static forestLayer1Clear() {
        return `You are clearing the enemies blocking the pathway in the forest.\n${checks['forestLayer1EnemiesRemaining'] || 100} enemies remain.\n\n{![stop.png]Stop|forestLayer1|0|endFight}`
    }

    static huntersGuild() {
        if (!checks['huntersGuildIntro']) {
            return `You slowly walk into the hunters' guild, the occupants appear to be having a discussion about enemies in the forest. You stand around for a minute until one of them invites you to listen.\n\nYou couldn't understand anything.\n\n{Next|huntersGuildIntro}`
        } else {
            return `You are in the hunters' guild. A group of hunters gather around the fireplace.\n\n{![fire.png]Fireplace|huntersGuildFireplace}\n\n{![leave.png]Leave|forestLayer1}`
        }
    }

    static huntersGuildIntro() {
        checks['huntersGuildIntro'] = true
        return `"Sorry if that was a bit rushed or hard to understand. We had to prepare an emergency plan due to an imminent threat in the forest."\n\nHe reaches out and firmly shakes your hand.\n\n"My name's Els and I'm the leader of this guild. We focus on discovering, researching and hunting the various creatures in this forest."\n\n"If you would like to know more, come talk to me near the fireplace."\n\n{Next|huntersGuild}`
    }

    static huntersGuildFireplace() {
        return `You are sitting on a chair near the fireplace in the hunters' guild.\n\n{![chat.png]Talk to Els|huntersGuildEls}\n\n{![leave.png]Leave|huntersGuild}`
    }

    static huntersGuildEls() {
        let r = `"Hello, what do you need today?"`
        if (checks['huntersGuildAskQuest']) {
            if (questProgression['els'] == undefined && !quests['els1']) {
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
        if (questProgression['els'] == undefined && !quests['els1']) {
            giveQuest("els1")
            return `"We've been needing some firewood lately in order to keep the fireplace burning. Obtain 3 pieces of wood by searching in the forest. Come back when you're done."\n\n{![leave.png]Return|huntersGuildEls}`
        } else {
            return genQuestGiver("els", {"none": `"You haven't fulfilled my quest."\n\n{![leave.png]Return|huntersGuildEls}`, "allComplete": `"You've completed all my quests for now."\n\n{![leave.png]Return|huntersGuildEls}`}, [
                {
                    "quest": "els1",
                    "money": 10,
                    "consumed": {
                        "wood": 3
                    },
                    "message": `"Thanks for the firewood, this should help extend the duration of the fire for a few hours."\n\n{![leave.png]Return|huntersGuildEls}`
                }
            ])
        }
    }

    static huntersGuildEls_askGuild() {
        return `"The hunters' guild was founded years ago by a small group of people who wished to research the forest. I was appointed as the leader a short while after the guild was founded."\n\n"The forest is quite vast making exploration difficult. We still aren't aware of all the creatures in the forest."\n\n{![leave.png]Return|huntersGuildEls}`
    }

    static huntersGuildEls_askForest() {
        return `"The forest is home to many creatures. Some harmless, some extremely dangerous. Generally the outskirts of the forest are safe so I suggest refraining from going in too deep unless you're strong enough."\n\n{![leave.png]Return|huntersGuildEls}`
    }

    static huntersGuildEls_askQuests() {
        checks['huntersGuildAskQuest'] = true
        return `"Quests?"\n\n"I could probably give you a few quests to collect resources, obviously you'll be paid for them. Talk to me again if you're interested."\n\n{![leave.png]Return|huntersGuildEls}`
    }

    static huntersGuildHeal() {
        let r = `You are in a room located in the hunters' guild.\n\n"Our resources are a bit limited here so we're unable to heal you completely. Head back to the hospital in town when you're ready."\n\n`
        if (getTimeName() == "night") {r += `Right before Els walks out of the room, he says, "Reminder that the forest is more dangerous at night"\n\n`}
        r += `{![leave.png]Return|huntersGuild}`
        return r
    }

    static forestLayer2() {
        return `You can see the entrance of the forest in the distance.\n\n{![arrow_left.png]Walk towards the exit|forestLayer1|300(Forest Entrance)}`
    }
}

class sceneFunctions {
    static endFight() {
        endFight()
    }

    static leaveStorage() {
        toggleStorageAccess(false)
    }

    static merchantSell() {
        changeMoney(inventory['strawBasket'] * 5)
        changeInventory("strawBasket", -inventory['strawBasket'])
    }

    static cancelCrafting() {
        craftingSelection = false
        if (craftInfo['recipe']) {
            let craftingType = itemData[craftInfo['recipe']]['crafting']['type']
            if (craftingType == undefined) {
                changeSkill("crafting", -craftInfo['skillXp'])
                changeTitleXp("crafter", -craftInfo['skillXp'] * 2)
            } else if (craftingType == "alchemy") {
                changeSkill("alchemy", -craftInfo['skillXp'])
                changeTitleXp("alchemist", -craftInfo['skillXp'] * 2)
            }
        }
        craftInfo['recipe'] = null
        craftInfo['completed'] = 0
        craftInfo['goal'] = 0
        craftInfo['using'] = []
        craftInfo['skillXp'] = 0

        for (const elem of document.querySelectorAll(".item-selected")) {
            elem.remove()
        }
    }

    static generateEnemy(args) {
        let enemy, onDeath
        if (typeof args == "string") {
            enemy = args
        } else {
            [enemy, onDeath] = args
        }
        generateEnemy(enemy)
        if (onDeath) {
            combatData['onDeath'] = onDeath
        }
    }

    static theArenaResign() {
        prependText = `You resigned from The Arena\n\n${colorGen("#ffee00", `You received $${arenaStatData[arenaData['round'] - 2]['reward']} for participating`)}\n\n`
        changeMoney(arenaStatData[arenaData['round'] - 2]['reward'])
        if (team == "nextLevel") {
            checks['nextLevelExercisePills'] = Math.round(arenaStatData[arenaData['round'] - 2]['reward'] / 10)
        }
        arenaData = {}
    }

    static nextLevelClaimExercisePill() {
        changeInventory("exercisePill", checks['nextLevelExercisePills'])
        delete checks['nextLevelExercisePills']
    }

    static grassPlainsEscape() {
        endFight()
        checks['spawnDelay'] = time + 5
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

function processText(text) {
    sceneText = text
    while (document.getElementById("main").lastChild) {
        document.getElementById("main").removeChild(document.getElementById("main").lastChild)
    }
    const splitText = text.split(textSplitter)
    const splitLinks = [...text.matchAll(linkRegex)]
    
    splitText.forEach(function(item, num) {
        let div = document.createElement("div")
        div.className = "main-text"
        
        let parts = item.split(imageRegex)
        parts.forEach(function(part, index) {
            if (index % 2 == 0) {
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
        
        document.getElementById("main").appendChild(div)
        
        if (num < splitLinks.length) {
            let button = document.createElement("button")
            let labelParts = splitLinks[num][1].split(imageRegex)
            if (labelParts.length > 1) {
                labelParts.forEach(function(part, index) {
                    if (index % 2 == 0) {
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
                if (splitLinks[num][4] != undefined) {
                    let params = splitLinks[num][5] ? (splitLinks[num][5].includes(",") ? splitLinks[num][5].split(",") : splitLinks[num][5]) : undefined
                    sceneFunctions[splitLinks[num][4]](params)
                }
                if (splitLinks[num][3] == undefined || splitLinks[num][3] == 0) {
                    sceneManager(splitLinks[num][2])
                } else {
                    const distance = Number(splitLinks[num][3].split("(")[0])
                    let walkTextOverride
                    if (splitLinks[num][3].includes("(")) {walkTextOverride = splitLinks[num][3].split("(")[1].slice(0, -1)}
                    let arrival = Math.ceil(time + Number(distance) / getMovementSpeed())
                    processText(`You are walking towards the ${colorGen("#99bbee", walkTextOverride || splitLinks[num][1].replace(imageRegex, ""))}. You'll arrive at ${colorGen("#ccccff", formatTime(arrival, true))}`)
                    travelInfo['destination'] = splitLinks[num][2]
                    travelInfo['distance'] = Number(distance)
                }
                playTransition()
            })
            document.getElementById("main").appendChild(button)
        }
    })
}

function sceneManager(selected) {
    const selectedScene = scenes[selected]()
    if (sceneRegions[selected]) {
        region = sceneRegions[selected]
    }
    processText((prependText || "") + selectedScene)
    prependText = ""
    if (sceneEndFunctions[selected]) {sceneEndFunctions[selected]()}
    oldScene = currentScene
    currentScene = selected
    
    trainingSession = {
        "logId": null,
        "gain": 0,
        "stat": null
    }
}

// Settings
let settingsMenuLoaded = false
var settings = loadFromLocal("arkivia-settings") || {}
const eventListenerStorage = {}
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
    "dateFormat": {
        "type": "text",
        "text": "Date Format",
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
            "mobileLayout"
        ]
    },
    "accessibility": {
        "name": "Accessibility",
        "settings": [
            "keyboardNavigation"
        ]
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
            "theme_bottombarBackground"
        ]
    }
}

for (const [setting, value] of Object.entries(settings)) {
    if (settingsData[setting]) {
        if (value != settingsData[setting]['default']) {
            if (settingsData[setting]['type'] == "toggle") {
                if (value == true && settingsData[setting]['on']) {
                    settingsData[setting]['on']()
                } else if (value == false && settingsData[setting]['off']) {
                    settingsData[setting]['off']()
                }
            } else if (settingsData[setting]['type'] == "color") {
                settingsData[setting]['execute'](value)
            }
        }
    }
}

document.getElementById("settings-button").addEventListener("click", function() {
    if (settingsMenuLoaded == false) {
        settingsMenuLoaded = true
        for (const [submenu, data] of Object.entries(settingsCategories)) {
            const category = document.createElement("button")
            category.className = "settings-category"
            category.textContent = data['name']

            category.addEventListener("click", function() {
                const settingsOptionsElem = document.getElementById("settings-options")
                settingsOptionsElem.replaceChildren()
                
                const settingsOptionsTitle = document.createElement("div")
                settingsOptionsTitle.className = "settings-options-title"
                settingsOptionsTitle.textContent = data['name']
                settingsOptionsElem.appendChild(settingsOptionsTitle)

                for (const option of data['settings']) {
                    if (option === "") {
                        settingsOptionsElem.appendChild(document.createElement("br"))
                        continue
                    } else if (typeof option == "object") {
                        if (option['type'] == "text") {
                            const text = document.createElement("div")
                            text.textContent = option['text']
                            settingsOptionsElem.appendChild(text)
                        }
                        continue
                    }
                    
                    const values = settingsData[option]
                    const holder = document.createElement("div")
                    holder.className = "settings-option-holder"
                    if (values['type'] == "toggle") {
                        const toggle = document.createElement("input")
                        toggle.type = "checkbox"
                        toggle.className = "settings-option-checkbox"
                        toggle.checked = settings[option] != undefined ? settings[option] : values['default'] || false

                        toggle.addEventListener("change", function() {
                            if (toggle.checked != values['default']) {
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
                        holder.appendChild(text)
                    } else if (values['type'] == "text") {
                        const text = document.createElement("span")
                        text.textContent = values['text']
                        holder.appendChild(text)
                        
                        const textInput = document.createElement("input")
                        textInput.type = "text"
                        textInput.className = "settings-option-text-input"
                        textInput.value = settings[option] != undefined ? settings[option] : values['default'] || false

                        function finish(mode) {
                            if (textInput.value != values['default']) {
                                settings[option] = textInput.value
                                text.style.color = "#ffeeaa"
                            } else {
                                delete settings[option]
                                text.style.color = ""
                            }

                            if (mode == "key") {textInput.blur()}

                            saveToLocal(settings, "arkivia-settings")
                        }

                        textInput.addEventListener("keydown", function(e) {
                            if (e.key == "Enter") {textInput.blur()}
                        })
                        textInput.addEventListener("blur", finish)

                        holder.appendChild(textInput)
                    } else if (values['type'] == "color") {
                        const text = document.createElement("span")
                        text.textContent = values['text']
                        holder.appendChild(text)
                        
                        const colorInput = document.createElement("input")
                        colorInput.type = "color"
                        colorInput.className = "settings-option-color-input"
                        colorInput.value = settings[option] != undefined ? settings[option] : values['default'] || "#000000"

                        colorInput.addEventListener("change", function() {
                            if (colorInput.value != values['default']) {
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
                    settingsOptionsElem.appendChild(holder)   
                }
            })

            document.getElementById("settings-categories").appendChild(category)
        }
    }

    const settingsElem = document.getElementById("settings")
    if (settingsElem.style.display == "none") {
        settingsElem.style.display = ""
    } else {
        settingsElem.style.display = "none"
    }
})

function objectEmpty(obj) {
    return Object.keys(obj).length === 0
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
    document.getElementById("game-title").textContent = `v${VERSION}`

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
    document.getElementById("game-title").textContent = `Arkivia v${VERSION}`
}

if (!settings['run']) {
    if (window.screen.width < 1000 && window.screen.height * 1.5 > window.screen.width) {
        mobileLayout()
        settings['mobileLayout'] = true
        insertLog("It appears that you're using a mobile device. The layout has automatically been changed. You can revert this in this configuration menu.")
    }
}

// Saves
function makeSave() { // Optimisation at all costs
    function removeEmpty(key, obj) {
        if (objectEmpty(obj[key])) {obj[key] = undefined}
    }

    let base = {
        money, time, health, xp, playerTitle, battleStats, skills, energy, noSleepTime, effects, titleScores, achievements, // Stats
        inventory, inventoryNonStackable, inventoryNonStackableIncrement, storage, storageNonStackable, storageAccess, shopStorage, // Inventory
        combatData, equipment, team, arenaData, // Combat
        oldScene, currentScene, sceneText, region, // Scenes
        quests, completedQuests, checks, questProgression, // Quests
        stats, // Stats
        knownRecipes, craftInfo, craftingSelection, // Crafting
        exploreData, travelInfo, // Exploration
        debugEnabled, // Debug
        weather, weatherStartTime // Environment
    }
    base['version'] = VERSION
    // Stats
    if (base['money'] == 0) {delete base['money']}
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

    // Combat
    if (base['combatData']['enemy'] == null) {base['combatData'] = undefined}
    base['equipment'] = Object.fromEntries(Object.entries(base['equipment']).filter(([key, value]) => value !== null))
    removeEmpty("equipment", base)
    if (base['team'] == "none") {base['team'] = undefined}
    removeEmpty("arenaData", base)
    
    // Inventory
    removeEmpty("inventory", base)
    removeEmpty("inventoryNonStackable", base)
    removeEmpty("storage", base)
    removeEmpty("storageNonStackable", base)
    if (base['storageAccess'] == false) {base['storageAccess'] = undefined}
    removeEmpty("shopStorage", base)

    // Quests
    removeEmpty("quests", base)
    removeEmpty("completedQuests", base)
    removeEmpty("checks", base)
    removeEmpty("questProgression", base)

    // Crafting
    if (base['craftInfo']['recipe'] == null && base['craftInfo']['selected'] == null) {base['craftInfo'] = undefined}
    if (base['craftingSelection'] == false) {base['craftingSelection'] = undefined}

    // Exploration
    if (base['exploreData']['area'] == null) {base['exploreData'] = undefined}
    if (base['travelInfo']['destination'] == null) {base['travelInfo'] = undefined}

    // Debug
    if (base['debugEnabled'] == false) {base['debugEnabled'] = undefined}

    // Environment
    if (base['weather'] == "clear") {
        base['weather'] = undefined
        base['weatherStartTime'] = undefined
    }

    base = Object.fromEntries(Object.entries(base).filter(([key, value]) => value !== undefined))
    return base
}

function saveToLocal(dict, slot="arkivia-save1") {
    const msgpackData = MessagePack.encode(dict)
    const packed = LZString.compressToBase64(String.fromCharCode.apply(null, msgpackData))
    localStorage.setItem(slot, packed)
}

function exportDict(dict, filename="Arkivia.sav") {
    const msgpackData = MessagePack.encode(dict)
    const packed = LZString.compressToUint8Array(String.fromCharCode.apply(null, msgpackData))
    const blob = new Blob([packed], {type: "application/octet-stream"})

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

async function importDict() {
    const [fileHandle] = await window.showOpenFilePicker({
        types: [{description: "Arkivia Save", accept: {"application/octet-stream": [".sav"]}}]
    })
    const file = await fileHandle.getFile()
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
    try {
        // Migrations
        if (versionCompare(dict['version'], "0.17")) {
            combatData['enemyEffects'] ??= []
        }
        if (versionCompare(dict['version'], "0.19")) {
            dict['stats']['totalKills'] = Object.values(dict['stats']['kills']).reduce((acc, val) => acc + val, 0)
        }
        if (versionCompare(dict['version'], "0.20")) {
            if (dict.checks?.dojoQuestIndex) {
                dict['questProgression'] = {"dojo": dict['checks']['dojoQuestIndex']}
                delete dict['checks']['dojoQuestIndex']
            }
            if (dict['combatData']) {
                dict['combatData']['enemyEffects'] = {}
            }
        }
        if (versionCompare(dict['version'], "0.23")) {
            delete dict['equipment']['shield']
            dict['equipment']['tool'] = null
        }
        
        // Stats
        time = dict['time'] ?? time
        battleStats = dict['battleStats'] ?? battleStats
        energy = dict['energy'] ?? energy
        noSleepTime = dict['noSleepTime'] ?? noSleepTime
        for (const [title, score] of Object.entries(dict['titleScores'] ?? {})) {
            if (Number.isNaN(score)) {
                delete dict['titleScores'][title]
            }
        }
        titleScores = dict['titleScores'] ?? titleScores
        stats = dict['stats'] ?? stats
        if (dict['playerTitle'] != "Unknown") {changeTitle(dict['playerTitle'])}

        changeXp(dict['xp'])
        changeMoney(dict['money'] || 0)
        health = dict['health']
        updateBar("health")
        updateBar("energy")
        document.getElementById("time").textContent = formatTime(time)

        if (dict['skills']) {
            for (const [skill, xp] of Object.entries(dict['skills'])) {
                if (!Number.isNaN(xp)) {
                    changeSkill(skill, xp)
                }
            }
        }

        if (dict['effects']) {
            for (const [effect, data] of Object.entries(dict['effects'])) {
                changeEffect(effect, data['duration'] || 0, true, data['properties'] || null)
            }
        }
        achievements = dict['achievements'] ?? achievements
        if (dict['achievements']) {document.getElementById("achievements-button").style.display = ""}
        
        // Inventory
        inventoryNonStackableIncrement = dict['inventoryNonStackableIncrement'] ?? inventoryNonStackableIncrement
        shopStorage = dict['shopStorage'] ?? shopStorage
        for (const [item, amount] of Object.entries(dict['inventory'] ?? {})) {
            changeInventory(item, amount)
        }
        for (const [item, amount] of Object.entries(dict['storage'] ?? {})) {
            changeStorage(item, amount)
        }

        for (const [id, data] of Object.entries(dict['inventoryNonStackable'] ?? {})) {
            const item = data['name']
            changeInventory(item, 1, false, id, data)
        }
        for (const [id, data] of Object.entries(dict['storageNonStackable'] ?? {})) {
            const item = data['name']
            changeStorage(item, 1, id, data)
        }

        for (const [item, data] of Object.entries(dict['equipment'] ?? {})) {
            if (data != null) {
                changeEquipment(data[1])
            }
        }

        // if (dict['storageAccess'] == true) {toggleStorageAccess(true)}
        
        // Combat
        combatData = dict['combatData'] ?? combatData
        team = dict['team'] ?? team
        arenaData = dict['arenaData'] ?? arenaData

        if (combatData['enemy'] != null) {
            let total = 0
            for (const stat of statTypes) {
                total += combatData['enemyStats'][stat]
                document.getElementById(`enemy-stat-${stat}`).textContent = `${capitaliseFirst(stat)}: ${formatNumber(combatData['enemyStats'][stat], "floor", true)}`
            }
            document.getElementById(`enemy-stat-total`).textContent = `Ttl: ${formatNumber(total, "floor", true)}`

            document.getElementById("enemy-name").textContent = enemyData[combatData['enemy']]['name']
            updateBar("enemyHealth")

            document.getElementById("attack-info-left").style.display = ""
            document.getElementById("attack-info-divider").style.display = ""
            document.getElementById("attack-info-right").style.display = ""

            if (combatData['enemyEffects']) {
                for (const [effect, data] of Object.entries(dict['combatData']['enemyEffects'])) {
                    delete combatData['enemyEffects'][effect]
                    changeEnemyEffect(effect, data['duration'] || 0, true)
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
        craftInfo = dict['craftInfo'] ?? craftInfo
        craftingSelection = dict['craftingSelection'] ?? craftingSelection

        if (dict['craftInfo']) {
            for (const itemId of dict['craftInfo']['using']) {
                const inventorySlot = document.getElementById(`item-${inventoryNonStackable[itemId]['name']}_${itemId}`)
                if (inventorySlot) {
                    const itemSelected = document.createElement("span")
                    itemSelected.className = "item-selected"
                    itemSelected.textContent = "S"

                    inventorySlot.appendChild(itemSelected)
                }
            }
        }

        // Exploration
        exploreData = dict['exploreData'] ?? exploreData
        travelInfo = dict['travelInfo'] ?? travelInfo

        // Debug
        if (dict['debugEnabled']) {toggleDebug(true)}

        // Environment
        if (dict['weather']) {
            changeWeather(dict['weather'])
            weatherStartTime = dict['weatherStartTime']
        }

        // End
        processText(sceneText)
        if (sceneEndFunctions[currentScene]) {sceneEndFunctions[currentScene]()}

        document.getElementById("log").replaceChildren()
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}

        insertLog(colorGen("#aaaaaa", `Loaded in ${(performance.now() - startTime).toFixed()}ms`))
    } catch (error) {
        saveEnabled = false
        insertLog(colorGen("#ff0000", `Loading failed: ${error}`))
        throw error
    }
}

document.getElementById("delete-save").addEventListener("click", function() {
    let confirm = prompt("THIS WILL DELETE YOUR SAVE. TYPE CONFIRM TO CONFIRM")
    if (confirm.toLowerCase() == "confirm") {
        saveEnabled = false
        localStorage.removeItem("arkivia-save1")
        localStorage.removeItem("save1") // Remove this later
        window.location.reload()
    } else if (confirm.toLowerCase() == "confirm to confirm") {
        alert(`I meant "confirm" not "confirm to confirm"`)
    }
})

document.getElementById("export").addEventListener("click", function() {
    exportDict(makeSave())
})

document.getElementById("import").addEventListener("click", function() {
    importDict().then(dict => {
        saveToLocal(dict, "arkivia-savetemp")
        window.location.reload()
    })
})
if (localStorage.getItem("arkivia-savetemp") == undefined) {
    if (localStorage.getItem("arkivia-save1") == undefined && localStorage.getItem("save1") == undefined) {
        sceneManager("intro1")
    } else {
        let save = loadFromLocal()
        if (save == undefined) {save = loadFromLocal("save1")}
        loadSave(save)
    }
} else {
    loadSave(loadFromLocal("arkivia-savetemp"))
    localStorage.removeItem("arkivia-savetemp")
}

window.addEventListener("beforeunload", function() {
    if (saveEnabled == true && currentScene != "intro1") {
        saveToLocal(makeSave())
    }
})

// Debug
function toggleDebug(value) {
    if (value == true) {
        document.getElementById("debug-button").style.display = ""
        debugEnabled = true
    } else {
        document.getElementById("debug-button").style.display = "none"
        if (document.getElementById("sidebar-menu-debug").style.display != "none") {
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

const allScenes = Object.getOwnPropertyNames(scenes).filter(prop => typeof scenes[prop] == "function")
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
    // if (query) {
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
    // }
})

function updateSelection(suggestions) {
    suggestions.forEach(function(suggestion, index) {
        suggestion.classList.remove("selected")
        if (index == selectedIndex) {
            suggestion.classList.add("selected")
        }
    })
}

sceneJumpInput.addEventListener("keydown", function(e) {
    const suggestions = document.querySelectorAll(".suggestion")

    if (e.key == "ArrowDown") {
        if (selectedIndex < suggestions.length - 1) {
            selectedIndex += 1
            updateSelection(suggestions)
        }
    } else if (e.key == "ArrowUp") {
        if (selectedIndex > 0) {
            selectedIndex -= 1
            updateSelection(suggestions)
        }
    } else if (e.key == "Enter" && selectedIndex >= 0) {
        sceneJumpInput.value = suggestions[selectedIndex].textContent
        suggestionsContainer.innerHTML = ""
        selectedIndex = -1
    } else if (e.key == "Enter") {
        playTransition()
        sceneManager(sceneJumpInput.value)
        sceneJumpInput.value = ""
        suggestionsContainer.replaceChildren()
    }
})

document.getElementById("debug-settings-tickDelay").addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
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