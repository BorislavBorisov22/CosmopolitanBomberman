function createGame(selector) {
    let canvas = document.querySelector(selector);
    let ctx = canvas.getContext('2d');
    let hero = new Image();
    let bombarmanEnemy = new Image();



    let bomberMan = {
        x: 30,
        y: 30,
        size: 30,
        speed: 5
    };
    let enemy = {
        x:300,
        y:400,
        size:15,
        speed:3
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
        },
    ]
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
    })


    function gameLoop() {
        ctx.clearRect(0, 0, 1000, 800);
        drawBomberMan();
        generateEnemy(bombarmanEnemy,ctx,enemy);
        updateBomberManPosition(bomberMan, canvas, dirDeltas, dir);
        window.requestAnimationFrame(gameLoop)
    }

    function drawBomberMan() {
        hero.src = '../Images/bombermanTest.png';
        ctx.drawImage(hero,bomberMan.x, bomberMan.y);
    }
    
    return{
        start:gameLoop()
    }

}