'use strict';

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
    bombPixels = 37,
    NUMBER_OF_ENEMIES = 5,
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
    bombFireImg = document.getElementById('bomb-fire-sprite');