'use strict';

let PLAYER_USERNAME;
let isPlayerDead = false;

const field = [
    "***************************",
    "*                         *",
    "* * * * * * * * * * * * * *",
    "*                         *",
    "* * * * * * * * * * * * * *",
    "*                         *",
    "* * * * * * * * * * * * * *",
    "*                         *",
    "* * * * * * * * * * * * * *",
    "*                         *",
    "* * * * * * * * * * * * * *",
    "*                         *",
    "* * * * * * * * * * * * * *",
    "*                         *",
    "***************************"
];

// constants
const CELL_SIZE = 37,
    WALL_CHAR = '*',
    BRICK_CHAR = '-',
    INITIAL_BOMBS_COUNT = 3,
    FREE_SPACE_CHAR = ' ';

// bomberman sprite constants
const BOMBERMAN_SPRITE_TICKS_FRAME = 5,
    BOMBERMAN_TOTAL_SPRITESHEETS = 4;

// images and sprites
const wallImage = document.getElementById('wall-image'),
    brickImage = document.getElementById('brick-image'),
    leftImg = document.getElementById('left'),
    rightImg = document.getElementById('right'),
    upImg = document.getElementById('up'),
    downImg = document.getElementById('down'),
    bombImg = document.getElementById('bomb-sprite'),
    enemyImg = document.getElementById('enemy-sprite'),
    leftFireImg = document.getElementById('left-fire-sprite'),
    rightFireImg = document.getElementById('right-fire-sprite'),
    upFireImg = document.getElementById('up-fire-sprite'),
    downFireImg = document.getElementById('down-fire-sprite'),
    exitDoor = document.getElementById('exit-door'),
    georgeRight = document.getElementById('george-right'),
    georgeLeft = document.getElementById('george-left'),
    georgeUp = document.getElementById('george-up'),
    georgeDown = document.getElementById('george-down');


let numberOfReloads = 0;

let numberOfBricks = 70;
let numberOfEnemies = 5 + numberOfReloads;