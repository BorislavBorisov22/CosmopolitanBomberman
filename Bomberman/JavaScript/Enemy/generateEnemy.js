function generateEnemy(bombarmanEnemy, ctx, enemy) {
    bombarmanEnemy.src = '../Images/enemy.jpg';
    ctx.drawImage(bombarmanEnemy, enemy.x, enemy.y);
}