function updateBomberManPosition(bomberMan, canvas, dirDeltas, dir) {

    const lastCoordinates = { x: bomberMan.y, y: bomberMan.y };

    bomberMan.x = (bomberMan.x + canvas.width) % canvas.width;
    bomberMan.y = (bomberMan.y + canvas.height) % canvas.height;
    bomberMan.x += dirDeltas[dir].x;
    bomberMan.y += dirDeltas[dir].y;

    return lastCoordinates;
}