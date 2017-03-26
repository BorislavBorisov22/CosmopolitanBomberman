function createGame(selector) {

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

    const bombermanCanvas = document.querySelector(selector),
        ctx = bombermanCanvas.getContext('2d'),
        bomb = document.getElementById('bomb-image'),
        exitGate = new Image(),
        bombarmanEnemy = new Image();

    let door = { x: 1, y: 1, isDoorPlaced: false };
    let bombCordinates = {
        x: 0,
        y: 0
    };

    const bombs = [];

    const bombCanvas = document.getElementById('bomb-canvas'),
        ctxBomb = bombCanvas.getContext('2d');

    const enemyDefaultSpeed = 1;

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
            if (!door.isDoorPlaced) {
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
                ctxBomb.drawImage(wallImage, 0, 0, wallImage.width, wallImage.height, j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                nonWalkables.push({ x: CELL_SIZE * j, y: CELL_SIZE * i });
            } else if (symbol === BRICK_CHAR) {
                ctxBomb.drawImage(brickImage, 0, 0, brickImage.width, brickImage.height, j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                nonWalkables.push({ x: CELL_SIZE * j, y: CELL_SIZE * i });
            }

        }
    }
    // let bombermanBody = {
    //     x: CELL_SIZE,
    //     y: CELL_SIZE * 3,
    //     size: CELL_SIZE,
    //     speed: CELL_SIZE / 4,
    //     bomb: 3
    // };

    const bombermanBody = new PhysicalBody(CELL_SIZE, CELL_SIZE * 3, 0, CELL_SIZE, CELL_SIZE);

    // const bomberman = createBomberman({
    //     context: ctx,
    //     width: CELL_SIZE,
    //     height: CELL_SIZE
    // });

    const bombermanSprite = new BombermanSprite({
        context: ctx,
        spriteSheet: rightImg,
        totalTicksPerFrame: BOMBERMAN_SPRITE_TICKS_FRAME,
        width: CELL_SIZE,
        height: CELL_SIZE,
        totalSprites: BOMBERMAN_TOTAL_SPRITESHEETS,
    });
    const enemies = generateEnemies(ctx, NUMBER_OF_ENEMIES, CELL_SIZE, CELL_SIZE, field);

    const firstEnemy = createEnemy({
        context: ctx,
        width: CELL_SIZE,
        height: CELL_SIZE,
        totalSprites: 3,
        x: CELL_SIZE,
        y: CELL_SIZE,
    });


    enemies.push(firstEnemy);

    let keyCodeDirs = {
        37: 2,
        38: 3,
        39: 0,
        40: 1
    };

    const speed = CELL_SIZE / 4;

    const dirDeltas = [{
            x: +speed,
            y: 0
        },
        {
            x: 0,
            y: +speed
        },
        {
            x: -speed,
            y: 0
        },
        {
            x: 0,
            y: -speed
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
            if (collidesWith(bomberman, nonWalkables[i])) {
                return true;
            }
        }

        return false;
    }

    document.body.addEventListener("keydown", function(ev) {
        if (!keyCodeDirs.hasOwnProperty(ev.keyCode)) {
            return;
        }

        const futureCoordinates = bombermanBody.getFutureCoordinates(dirDeltas, ev.keyCode, keyCodeDirs);

        if (checkIfBombermanHitsNonWalkable(futureCoordinates, nonWalkables)) {
            return;
        }

        bombermanBody.updateDirection(ev.keyCode, keyCodeDirs);
        bombermanBody.updatePostion(dirDeltas);

        //bomberman.update = bomberman.lastUpdate;
        bombermanSprite.updateSpritesheet(bombermanBody.direction);
    });

    document.body.addEventListener('keyup', function(ev) {
        if (keyCodeDirs.hasOwnProperty(ev.keyCode)) {
            //bomberman.update = function() {};
        }
    });

    let bombsCount = INITIAL_BOMBS_COUNT;

    // placing bombs
    document.body.addEventListener("keydown", function(ev) {

        if (ev.keyCode !== 32 || bombsCount <= 0) {
            return;
        }

        bombsCount -= 1;

        // creating new bomb sprite and coordinates body and adding to the field bombs
        const bombToPlaceSprite = new Sprite({
            context: ctxBomb,
            spriteSheet: bombImg,
            totalTicksPerFrame: 5,
            width: CELL_SIZE,
            height: CELL_SIZE,
            totalSprites: 5,
        });

        const bombToPlaceBody = new PhysicalBody(bombermanBody.x, bombermanBody.y, 0, CELL_SIZE, CELL_SIZE);

        const bombToPlace = getGameObject(bombToPlaceSprite, bombToPlaceBody);

        bombs.push(bombToPlace);

        setInterval(function() {
            bombs.forEach(b => b.sprite.update().render({ x: b.body.x, y: b.body.y }));
        }, 100);

        setTimeout(function() {
            const firstBomb = bombs.shift();
            ctxBomb.clearRect(firstBomb.body.x, firstBomb.body.y, firstBomb.body.width, firstBomb.body.height);

            bombsCount += 1;
        }, 3000);
    });

    let isGameOver = false;

    function gameLoop() {
        ctx.clearRect(0, 0, 1000, 800);
        bombermanSprite.render({ x: bombermanBody.x, y: bombermanBody.y }).update();
        //TODO function to be invoked when the block is BLOWN!
        //drawExitGate(exitGate, ctx, door);
        // generateEnemy(bombarmanEnemy, ctx, enemy);
        // generateEnemy(bombarmanEnemy, ctx, secondEnemy);

        enemies.forEach(x => {
            x.update().render();

            if (collidesWith(bombermanBody, x)) {
                isGameOver = true;
                return;
                //TODO to be added a picture how bomberman DIE
            }

            updateEnemyPosition(x);
        });

        if (isGameOver) {
            //alert('game over');
            return;
        }

        window.requestAnimationFrame(gameLoop);
    }

    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);


    function collidesWith(bomberMan, item) {
        if (bomberMan.x < item.x + CELL_SIZE &&
            bomberMan.x + CELL_SIZE > item.x &&
            bomberMan.y < item.y + CELL_SIZE &&
            CELL_SIZE + bomberMan.y > item.y) {

            return true;
        }

        return false;
    }

    function getGameObject(spriteObj, physicalBodyObj) {
        const gameObject = { sprite: spriteObj, body: physicalBodyObj };

        return gameObject;
    }

    function updateEnemyPosition(enemy) {

        checkForOutOfBoundaries(enemy, nonWalkables);

        if (enemy.moveRight === true && enemy.moveLeft === false && enemy.moveDown === false && enemy.moveUp === false) {
            enemy.x += enemyDefaultSpeed;
        } else if (enemy.moveRight === false && enemy.moveLeft === true && enemy.moveDown === false && enemy.moveUp === false) {
            enemy.x -= enemyDefaultSpeed;
        } else if (enemy.moveRight === false && enemy.moveLeft === false && enemy.moveDown === true && enemy.moveUp === false) {
            enemy.y += enemyDefaultSpeed;
        } else if (enemy.moveRight === false && enemy.moveLeft === false && enemy.moveDown === false && enemy.moveUp === true) {
            enemy.y -= enemyDefaultSpeed;
        }

        function checkForOutOfBoundaries(enemy, nonWalkables) {
            if (checkIfBombermanHitsNonWalkable(enemy, nonWalkables) && enemy.moveRight) {
                enemy.moveRight = false;
                enemy.moveDown = true;
            } else if (checkIfBombermanHitsNonWalkable(enemy, nonWalkables) && enemy.moveDown) {
                enemy.moveDown = false;
                enemy.moveLeft = true;
            } else if (checkIfBombermanHitsNonWalkable(enemy, nonWalkables) && enemy.moveLeft) {
                enemy.moveLeft = false;
                enemy.moveUp = true;
            } else if (checkIfBombermanHitsNonWalkable(enemy, nonWalkables) && enemy.moveUp) {
                enemy.moveUp = false;
                enemy.moveRight = true;
            }
        }
    }
    return {
        start: gameLoop()
    };
}