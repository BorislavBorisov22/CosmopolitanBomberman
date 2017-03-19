function createGame(selector) {
    const CELL_SIZE = 37;
    const WALL_CHAR = '*';
    const BRICK_CHAR = '-';

    let canvas = document.querySelector(selector);
    let ctx = canvas.getContext('2d');
    let hero = new Image();
    let bomb = document.getElementById('bomb-image');
    let exitGate = new Image();
    let bombarmanEnemy = new Image();

    let wall = document.getElementById('wall-image');
    let brick = document.getElementById('brick-image');
    const bombCanvas = document.getElementById('bomb-canvas'),
        ctxBomb = bombCanvas.getContext('2d');

    bombCanvas.style.backgroundColor = 'green';
    bombCanvas.style.border = '1px solid blue';

    const enemyDefaultSpeed = 1;
    const wallOffset = 20;
    const bombPixels = 60;

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
        for (let i = 0; i < 50; i += 1) {
            let row = getRandomInt(1, 14);
            let col = getRandomInt(1, 26);

            // debugger;
            if (row % 2 === 0 || col % 2 === 0) {
                i -= 1;
            } else {
                matrix[row] = matrix[row].substr(0, col) + BRICK_CHAR + matrix[row].substr(col + 1);
            }
        }
    })(field);
    console.log(field);

    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[0].length; j++) {
            let symbol = field[i][j];
            if (symbol === WALL_CHAR) {
                ctxBomb.drawImage(wall, 0, 0, wall.width, wall.height, j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else if (symbol === BRICK_CHAR) {
                ctxBomb.drawImage(brick, 0, 0, brick.width, brick.height, j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    console.log(brick);

    let bomberMan = {
        x: 30,
        y: 268,
        size: CELL_SIZE,
        speed: CELL_SIZE,
        bomb: 3
    };
    let enemy = {
        x: 60,
        y: 10,
        size: 15,
        speed: 3,
        moveRight: true,
        moveLeft: false
    };

    let dir = 0;
    let keyCodeDirs = {
        37: 2,
        38: 3,
        39: 0,
        40: 1
    };

    let dirDeltas = [{
        x: +bomberMan.speed,
        y: 0
    },
    {
        x: 0,
        y: +bomberMan.speed
    },
    {
        x: -bomberMan.speed,
        y: 0
    },
    {
        x: 0,
        y: -bomberMan.speed
    }
    ];
    /*
     0 => right
     1 => down
     2 => left
     3 => up
     */

    document.body.addEventListener("keydown", function (ev) {
        if (!keyCodeDirs.hasOwnProperty(ev.keyCode)) {
            return;
        }

        dir = keyCodeDirs[ev.keyCode];
        updateBomberManPosition(bomberMan, canvas, dirDeltas, dir);
    });

    document.body.addEventListener("keydown", function (ev) {
        if (ev.keyCode === 32 && bomberMan.bomb > 0) {
            bomb.src = '../Images/bomb.png';
            ctxBomb.drawImage(bomb, bomberMan.x, bomberMan.y);
            bomberMan.bomb -= 1;
            setTimeout(function(){
                //TODO Bomb should explode
                alert('boom')
                ctxBomb.clearRect(0,0,999,555);
            }, 3000);
        }


    });

    function gameLoop() {
        ctx.clearRect(0, 0, 1000, 800);
        drawBomberMan();
        drawExitGate(exitGate, ctx);
        generateEnemy(bombarmanEnemy, ctx, enemy);
        updateEnemyPosition(bombarmanEnemy);
        if (isColide(bomberMan, enemy)) {
            //TODO Game Over
        }
        window.requestAnimationFrame(gameLoop);
    }

    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    function isBetween(item, bound1, bound2) {
        if ((item >= bound1 && item <= bound2) ||
            (item <= bound1 && item >= bound2)) {
            return true;
        }

        return false;
    }

    function isColide(bomberMan, item) {
        if (isBetween(item.x, bomberMan.x + bomberMan.size, bomberMan.x) &&
            isBetween(item.y, bomberMan.y, bomberMan.y + bomberMan.size)) {
            return true;
        }

        return false;
    }

    function drawBomberMan() {
        hero.src = '../Images/bombermanTest.png';
        ctx.drawImage(hero, 0, 18, hero.width, hero.height - 18, bomberMan.x, bomberMan.y, hero.width, hero.height - 18);
    }

    function updateEnemyPosition(bombarmanEnemy) {
        bombarmanEnemy.src = '../Images/enemy.jpg';

        checkForOutOfBoundaries(enemy);

        if (enemy.moveRight === true && enemy.moveLeft === false) {
            enemy.x += enemyDefaultSpeed;
        }
        if (enemy.moveRight === false && enemy.moveLeft === true) {
            enemy.x -= enemyDefaultSpeed;
        }

        ctx.drawImage(bombarmanEnemy, enemy.x, enemy.y);

        function checkForOutOfBoundaries(enemy) {
            if (enemy.x > canvas.width - wallOffset) {
                enemy.moveRight = false;
                enemy.moveLeft = true;
            }
            if (enemy.x < 0) {
                enemy.moveRight = true;
                enemy.moveLeft = false;
            }
        }
    }

    return {
        start: gameLoop(),
        // loadMaze: putBricksRandomly(field)
    };
}