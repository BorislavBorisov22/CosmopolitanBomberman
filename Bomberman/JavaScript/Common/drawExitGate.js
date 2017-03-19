
function drawExitGate(exitGate, ctxBomb,door) {

    exitGate.src = '../Images/gate.png';


    ctxBomb.drawImage(exitGate, door.x * 37, door.y * 37);
}