function createGame(selector) {
    const bombermanCanvas = document.querySelector(selector),
        ctxBomberman = bombermanCanvas.getContext('2d'),
        bomb = document.getElementById('bomb-image'),
        bombCanvas = document.getElementById('bomb-canvas'),
        ctxBomb = bombCanvas.getContext('2d');

    generateStones(field);
    const nonWalkables = drawGameField(field, ctxBomb);

    const collisionDetector = new CollisionDetector();
    const bombs = [];

    const bombermanBody = new PhysicalBody(CELL_SIZE, CELL_SIZE * 3, 0, CELL_SIZE, CELL_SIZE),
        bombermanSprite = new BombermanSprite({
            context: ctxBomberman,
            spriteSheet: rightImg,
            totalTicksPerFrame: BOMBERMAN_SPRITE_TICKS_FRAME,
            width: CELL_SIZE,
            height: CELL_SIZE,
            totalSprites: BOMBERMAN_TOTAL_SPRITESHEETS,
        });

    const bomberman = getGameObject(bombermanSprite, bombermanBody),
        enemies = generateEnemies(field, 10, ctxBomberman);

    bomberman.bombsCount = INITIAL_BOMBS_COUNT;

    const bombFireSprite = new Sprite({
        context: ctxBomb,
        spritesheet: bombFireImg,
        totalTicksPerFrame: 5,
        totalSprites: 6,
        width: CELL_SIZE,
        height: CELL_SIZE
    });

    const bombFireBody = new PhysicalBody(CELL_SIZE * 2, CELL_SIZE * 2, 0, CELL_SIZE, CELL_SIZE);

    const bombFire = getGameObject(bombFireSprite, bombFireBody);

    // 0 => right 1 => down 2 => left 3 => up 
    const keyCodeDirs = {
            37: 2,
            38: 3,
            39: 0,
            40: 1
        },
        speed = CELL_SIZE / 4,
        enemyDirDeltas = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }],
        bombermanDirDeltas = [{ x: +speed, y: 0 }, { x: 0, y: +speed }, { x: -speed, y: 0 }, { x: 0, y: -speed }];

    function BodyHitsNonWalkable(bomberman, nonWalkables) {
        for (let i = 0; i < nonWalkables.length; i += 1) {

            if (collisionDetector.areColliding(bomberman, nonWalkables[i], CELL_SIZE, CELL_SIZE)) {
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

        const futureCoordinates = bomberman.body.getFutureCoordinates(bombermanDirDeltas, ev.keyCode, keyCodeDirs);

        if (BodyHitsNonWalkable(futureCoordinates, nonWalkables)) {
            return;
        }

        bomberman.body.updateDirection(ev.keyCode, keyCodeDirs);
        bomberman.body.updatePostion(bombermanDirDeltas);

        bomberman.sprite.updateSpritesheet(bombermanBody.direction);
    });

    // placing bombs event
    document.body.addEventListener("keydown", function(ev) {

        if (ev.keyCode !== 32 || bomberman.bombsCount <= 0) {
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

        const bombToPlaceBody = new PhysicalBody(bombermanBody.x, bombermanBody.y, 0, CELL_SIZE, CELL_SIZE),
            bombToPlace = getGameObject(bombToPlaceSprite, bombToPlaceBody);

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

    function gameLoop() {
        ctxBomberman.clearRect(0, 0, 1000, 800);
        bomberman.sprite.render({ x: bombermanBody.x, y: bombermanBody.y }).update();

        bombFire.sprite.render({ x: bombFireSprite.body.x, y: bombFire.body.y }).update();

        updateEnemies(enemies);

        if (isGameOver()) {
            return;
        }

        window.requestAnimationFrame(gameLoop);
    }

    function isGameOver() {
        let isBombermanDead = enemies.some(e => collisionDetector.areColliding(bomberman.body, e.body, CELL_SIZE, CELL_SIZE));

        return isBombermanDead;
    }

    function getGameObject(spriteObj, physicalBodyObj) {
        const gameObject = { sprite: spriteObj, body: physicalBodyObj };

        return gameObject;
    }

    function updateEnemies(enemies) {
        enemies.forEach(enemy => {
            enemy.sprite.render({ x: enemy.body.x, y: enemy.body.y }).update();
            enemy.body.updatePostion(enemyDirDeltas);

            if (BodyHitsNonWalkable(enemy.body, nonWalkables)) {
                enemy.body.direction = enemy.body.direction + 1 >= enemyDirDeltas.length ? 0 : enemy.body.direction + 1;
            }
        });
    }

    return {
        start: gameLoop
    };
}