function createGame(selector) {
    const CELL_SIZE = 37;
    const WALL_CHAR = '*';
    const BRICK_CHAR = '-';
    const bombPixels = 37;


    let canvas = document.querySelector(selector);
    let ctx = canvas.getContext('2d');
    let bomb = document.getElementById('bomb-image');
    let exitGate = new Image();
    let bombarmanEnemy = new Image();
    let door = { x: 1, y: 1, isDoorPlaced: false };
    let bombCordinates = {
        x: 0,
        y: 0
    };

    let wall = document.getElementById('wall-image');
    let brick = document.getElementById('brick-image');
    const bombCanvas = document.getElementById('bomb-canvas'),
        ctxBomb = bombCanvas.getContext('2d');

    bombCanvas.style.backgroundColor = 'green';
    bombCanvas.style.border = '1px solid blue';

    const enemyDefaultSpeed = 1;


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


    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }


    (function putBricksRandomly(matrix) {
        for (let i = 0; i < 70; i += 1) {
            let row = getRandomInt(1, 14);
            let col = getRandomInt(1, 26);
            // check if random brick is in start position of bomberman
            if ((row === 3 && col === 1) || (row === 4 && col === 1) || (row === 3 && col === 2) ||
                (row === 2 && col === 1) || (row === 1 && col === 1) || (row === 1 && col === 2)) {
                i -= 1;
                continue;
            }
            if ((row % 2 === 0 && col % 2 === 0)) {
                i -= 1;
                continue;
            } else {
                matrix[row] = matrix[row].substr(0, col) + BRICK_CHAR + matrix[row].substr(col + 1);
            }

            // place door
            if (door.isDoorPlaced === false) {
                door.x = col;
                door.y = row;
                door.isDoorPlaced = true;
            }
        }
    })(field);

    let nonWalkables = [];

    // render field
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[0].length; j++) {
            let symbol = field[i][j];
            if (symbol === WALL_CHAR) {
                ctxBomb.drawImage(wall, 0, 0, wall.width, wall.height, j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                nonWalkables.push({ x: CELL_SIZE * j, y: CELL_SIZE * i });
            } else if (symbol === BRICK_CHAR) {
                ctxBomb.drawImage(brick, 0, 0, brick.width, brick.height, j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                nonWalkables.push({ x: CELL_SIZE * j, y: CELL_SIZE * i });
            }

        }
    }

    let bomberManPhysicalBody = {
        x: CELL_SIZE,
        y: CELL_SIZE * 3,
        size: CELL_SIZE,
        speed: CELL_SIZE / 4,
        bomb: 3
    };

    const bomberman = createBomberman({
        context: ctx,
        width: CELL_SIZE,
        height: CELL_SIZE
    });

    bomberman.update = function() {};

    let enemy = {
        x: CELL_SIZE,
        y: CELL_SIZE, //TODO : centralize enemy
        size: 15,
        speed: 3,
        moveRight: true,
        moveLeft: false
    };

    let keyCodeDirs = {
        37: 2,
        38: 3,
        39: 0,
        40: 1
    };

    let dirDeltas = [{
            x: +bomberManPhysicalBody.speed,
            y: 0
        },
        {
            x: 0,
            y: +bomberManPhysicalBody.speed
        },
        {
            x: -bomberManPhysicalBody.speed,
            y: 0
        },
        {
            x: 0,
            y: -bomberManPhysicalBody.speed
        }
    ];
    /*
     0 => right
     1 => down
     2 => left
     3 => up
     */
    function checkIfBombermanHitsNonWalkable(bomberman, nonWalkables) {
        for (let i = 0; i < nonWalkables.length; i += 1) {
            if (isCollide(bomberman, nonWalkables[i])) {
                return true;
            }
        }

        return false;
    }

    let dir = 0;
    document.body.addEventListener("keydown", function(ev) {
        if (!keyCodeDirs.hasOwnProperty(ev.keyCode)) {
            return;
        }


        const futureDir = keyCodeDirs[ev.keyCode];

        const futureCoordinates = getFutureCordinates(bomberManPhysicalBody, canvas, dirDeltas, futureDir);

        if (checkIfBombermanHitsNonWalkable(futureCoordinates, nonWalkables)) {
            return;
        }

        bomberman.update = bomberman.lastUpdate;

        dir = keyCodeDirs[ev.keyCode];
        updateBomberManPosition(bomberManPhysicalBody, canvas, dirDeltas, dir);

        bomberman.updateSprite(dir);
    });

    document.body.addEventListener('keyup', function(ev) {
        if (keyCodeDirs.hasOwnProperty(ev.keyCode)) {
            bomberman.update = function() {};
        }
    });

    // placing bombs
    document.body.addEventListener("keydown", function(ev) {
        if (ev.keyCode === 32 && bomberManPhysicalBody.bomb > 0) {
            bomb.src = '../Images/bomb.png';
            //ctxBomb.drawImage(bomb, bomberManPhysicalBody.x, bomberManPhysicalBody.y);
            bomberManPhysicalBody.bomb -= 1;
            bombCordinates.x = bomberManPhysicalBody.x;
            bombCordinates.y = bomberManPhysicalBody.y;

            const bombToPlace = createBomb({
                context: ctxBomb,
                width: CELL_SIZE,
                height: CELL_SIZE,
                x: bomberManPhysicalBody.x,
                y: bomberManPhysicalBody.y
            });

            bombToPlace.render();

            setTimeout(function() {

                alert('boom');
                //TODO BOMB should be reduced cause current the bomb jpeg is bigger then brick
                ctxBomb.clearRect(bombCordinates.x, bombCordinates.y, bombPixels, bombPixels);
            }, 3000);
        }
    });


    function gameLoop() {
        ctx.clearRect(0, 0, 1000, 800);
        bomberman.render({ x: bomberManPhysicalBody.x, y: bomberManPhysicalBody.y }).update();
        //TODO function to be invoked when the block is BLOWN!
        //drawExitGate(exitGate, ctx, door);
        generateEnemy(bombarmanEnemy, ctx, enemy);
        updateEnemyPosition(bombarmanEnemy);
        if (isCollide(bomberManPhysicalBody, enemy)) {
            alert("Game");
            return;
            //TODO to be added a picture how bomberman DIE
        }

        window.requestAnimationFrame(gameLoop);
    }

    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);


    function isCollide(bomberMan, item) {
        if (bomberMan.x < item.x + CELL_SIZE &&
            bomberMan.x + CELL_SIZE > item.x &&
            bomberMan.y < item.y + CELL_SIZE &&
            CELL_SIZE + bomberMan.y > item.y) {

            return true;
        }

        return false;
    }


    function updateEnemyPosition(bombarmanEnemy) {
        bombarmanEnemy.src = '../Images/enemy.png';

        checkForOutOfBoundaries(enemy, nonWalkables);

        if (enemy.moveRight === true && enemy.moveLeft === false) {
            enemy.x += enemyDefaultSpeed;
        }
        if (enemy.moveRight === false && enemy.moveLeft === true) {
            enemy.x -= enemyDefaultSpeed;
        }

        ctx.drawImage(bombarmanEnemy, enemy.x, enemy.y);

        function checkForOutOfBoundaries(enemy, nonWalkables) {
            if (checkIfBombermanHitsNonWalkable(enemy, nonWalkables) && enemy.moveRight) {
                enemy.moveRight = false;
                enemy.moveLeft = true;
            } else if (checkIfBombermanHitsNonWalkable(enemy, nonWalkables) && enemy.moveLeft) {
                enemy.moveRight = true;
                enemy.moveLeft = false;
            }
        }
    }

    return {
        start: gameLoop()
    };
}