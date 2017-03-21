function generateEnemies(context, enemiesCount, width, height, field) {
    const enemies = [];

    for (let i = 0; i < enemiesCount; i += 1) {
        let currentEnemy = createEnemy({
            context: context,
            width: width,
            height: height,
            totalSprites: 3,
            x: width * getRandomInt(1,26),
            y: height * getRandomInt(1,14)
        });

        for (let j = 0; j < field.length; j++) {
            for (let k = 0; k < field.length; k++) {
                //TODO: finish this shit;
                // if (condition) {
                    
                // }
            }
        }

    }
    console.log(enemies.length);
    return enemies;
}

function isCollide(bomberMan, item) {
    if (bomberMan.x < item.x + 37 &&
        bomberMan.x + 37 > item.x &&
        bomberMan.y < item.y + 37 &&
        37 + bomberMan.y > item.y) {

        return true;
    }

    return false;
}

function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }