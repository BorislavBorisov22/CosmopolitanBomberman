function createGame(selector) {
    let canvas = document.querySelector(selector);
    let ctx = canvas.getContext('2d');
    let hero = new Image();
    let bombarmanEnemy = new Image();
    const enemyDefaultSpeed = 1;
    const wallOffset = 20;


    const field = [
        "*******************",
        "*                 *",
        "* * * * * * * * * *",
        "*                 *",
        "* * * * * * * * * *",
        "*                 *",
        "* * * * * * * * * *",
        "*                 *",
        "* * * * * * * * * *",
        "*                 *",
        "* * * * * * * * * *",
        "*                 *",
        "*******************"
    ];

    let bomberMan = {
        x: 30,
        y: 268,
        size: 30,
        speed: 20
    };
    let enemy = {
        x:60,
        y:10,
        size:15,
        speed:3,
        moveRight:true,
        moveLeft:false
    };

    let dir = 0;
    let keyCodeDirs = {
        37: 2,
        38: 3,
        39: 0,
        40: 1
    };

    let dirDeltas = [
        {
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


    function gameLoop() {
        ctx.clearRect(0, 0, 1000, 800);
        drawBomberMan();
        generateEnemy(bombarmanEnemy,ctx,enemy);
        updateEnemyPosition(bombarmanEnemy);
        window.requestAnimationFrame(gameLoop)
    }

    function drawBomberMan() {
        hero.src = '../Images/bombermanTest.png';
        ctx.drawImage(hero,bomberMan.x, bomberMan.y);
    }

    function updateEnemyPosition(bombarmanEnemy) {
        bombarmanEnemy.src = '../Images/enemy.jpg';

        checkForOutOfBoundaries(enemy);

        if(enemy.moveRight === true && enemy.moveLeft === false){
            enemy.x += enemyDefaultSpeed;
        }
        if(enemy.moveRight === false && enemy.moveLeft === true){
            enemy.x -= enemyDefaultSpeed;
        }

        ctx.drawImage(bombarmanEnemy,enemy.x, enemy.y);

        function checkForOutOfBoundaries(enemy) {
            if(enemy.x > canvas.width - wallOffset){
                enemy.moveRight = false;
                enemy.moveLeft = true;
            }
            if(enemy.x < 0){
                enemy.moveRight = true;
                enemy.moveLeft = false;
            }
        }
        
    }
    
    return{
        start:gameLoop()
    }

}