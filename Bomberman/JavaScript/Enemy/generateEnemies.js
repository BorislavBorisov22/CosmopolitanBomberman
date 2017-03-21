function generateEnemies(context, enemiesCount, width, height) {
    const enemies = [];

    for (let i = 0; i < enemiesCount; i += 1) {
        enemies.push(createEnemy({
            context: context,
            width: width,
            height: height,
            totalSprites: 3,
            x: width * ((Math.random() * 30) | 0),
            y: height * ((Math.random() * 18) | 0),
        }));
    }

    return enemies;
}