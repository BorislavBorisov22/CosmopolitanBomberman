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
        bombCanvas = document.getElementById('bomb-canvas'),
        ctxBomb = bombCanvas.getContext('2d');

    generateStones(field);
    const nonWalkables = drawGameField(field, ctxBomb);

    const exitGate = new Image(),
        bombarmanEnemy = new Image();

    const bombs = [];
    const enemyDefaultSpeed = 1;

    const bombermanBody = new PhysicalBody(CELL_SIZE, CELL_SIZE * 3, 0, CELL_SIZE, CELL_SIZE);

    const bombermanSprite = new BombermanSprite({
        context: ctx,
        spriteSheet: rightImg,
        totalTicksPerFrame: BOMBERMAN_SPRITE_TICKS_FRAME,
        width: CELL_SIZE,
        height: CELL_SIZE,
        totalSprites: BOMBERMAN_TOTAL_SPRITESHEETS,
    });

    const bomberman = getGameObject(bombermanSprite, bombermanBody);
    bomberman.bombsCount = INITIAL_BOMBS_COUNT;

    const enemies = []; //generateEnemies(ctx, NUMBER_OF_ENEMIES, CELL_SIZE, CELL_SIZE, field);

    const firstEnemyBody = new PhysicalBody(CELL_SIZE, CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
    const firstEnemySprite = new Sprite({
        context: ctx,
        spriteSheet: enemyImg,
        totalTicksPerFrame: 5,
        width: CELL_SIZE,
        height: CELL_SIZE,
        totalSprites: 4,
    });

    const firstEnemy = getGameObject(firstEnemySprite, firstEnemyBody);

    enemies.push(firstEnemy);

    const keyCodeDirs = {
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

    // moving bomberman logic
    document.body.addEventListener("keydown", function(ev) {
        if (!keyCodeDirs.hasOwnProperty(ev.keyCode)) {
            return;
        }

        const futureCoordinates = bomberman.body.getFutureCoordinates(dirDeltas, ev.keyCode, keyCodeDirs);

        if (checkIfBombermanHitsNonWalkable(futureCoordinates, nonWalkables)) {
            return;
        }

        bomberman.body.updateDirection(ev.keyCode, keyCodeDirs);
        bomberman.body.updatePostion(dirDeltas);

        //bomberman.update = bomberman.lastUpdate;
        bomberman.sprite.updateSpritesheet(bombermanBody.direction);
    });

    document.body.addEventListener('keyup', function(ev) {
        if (keyCodeDirs.hasOwnProperty(ev.keyCode)) {
            //bomberman.update = function() {};
        }
    });

    let bombsCount = INITIAL_BOMBS_COUNT;

    // placing bombs event
    document.body.addEventListener("keydown", function(ev) {

        if (ev.keyCode !== 32 || bombsCount <= 0) {
            return;
        }

        bomberman.bombsCount -= 1;

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

            bomberman.bombsCount += 1;
        }, 3000);
    });

    let isGameOver = false;

    function gameLoop() {
        ctx.clearRect(0, 0, 1000, 800);
        bomberman.sprite.render({ x: bombermanBody.x, y: bombermanBody.y }).update();
        //TODO function to be invoked when the block is BLOWN!
        //drawExitGate(exitGate, ctx, door);
        // generateEnemy(bombarmanEnemy, ctx, enemy);
        // generateEnemy(bombarmanEnemy, ctx, secondEnemy);

        enemies.forEach(enemy => {
            enemy.sprite.render({ x: enemy.body.x, y: enemy.body.y }).update();

            if (collidesWith(bomberman.body, enemy.body)) {
                isGameOver = true;
                return;
                //TODO to be added a picture how bomberman DIE
            }

            updateEnemyPosition(enemy);
            //enemy.body.updatePostion(dirDeltas);
        });

        if (isGameOver) {
            //alert('game over');
            return;
        }

        window.requestAnimationFrame(gameLoop);
    }

    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);


    function collidesWith(firstBody, secondBody) {
        const isColliding = (firstBody.x < secondBody.x + CELL_SIZE && firstBody.x + CELL_SIZE > secondBody.x) &&
            (firstBody.y < secondBody.y + CELL_SIZE && firstBody.y + CELL_SIZE > secondBody.y);

        return isColliding;
    }

    function getGameObject(spriteObj, physicalBodyObj) {
        const gameObject = { sprite: spriteObj, body: physicalBodyObj };

        return gameObject;
    }

    function updateEnemyPosition(enemy) {

        const enemyDirDeltas = [{
            x: 1,
            y: 0
        }, {
            x: 0,
            y: 1
        }, {
            x: -1,
            y: 0
        }, {
            x: 0,
            y: -1
        }];

        enemy.body.updatePostion(enemyDirDeltas);

        const diffs = [-1, 1];
        if (checkIfBombermanHitsNonWalkable(enemy.body, nonWalkables)) {
            enemy.body.direction = enemy.body.direction + 1 >= dirDeltas.length ? 0 : enemy.body.direction + 1;
        }
    }

    return {
        start: gameLoop()
    };
}