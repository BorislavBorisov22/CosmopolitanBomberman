function generateEnemies(field, enemiesCount, enemiesContext) {
    const enemies = [];

    while (enemiesCount > 0) {
        const row = (Math.random() * (field.length - 2)) | 0;
        const col = (Math.random() * (field[0].length - 2)) | 0;

        console.log(field);

        if (field[row][col] !== WALL_CHAR && field[row][col] !== BRICK_CHAR) {
            const enemyBody = new PhysicalBody(col * CELL_SIZE, row * CELL_SIZE, (Math.random() * 4) | 0, CELL_SIZE, CELL_SIZE);

            const enemySprite = new Sprite({
                width: CELL_SIZE,
                height: CELL_SIZE,
                context: enemiesContext,
                spriteSheet: enemyImg,
                totalTicksPerFrame: 4,
                totalSprites: 4,
            });

            enemies.push({ body: enemyBody, sprite: enemySprite });

            enemiesCount -= 1;
        }
    }

    return enemies;
}