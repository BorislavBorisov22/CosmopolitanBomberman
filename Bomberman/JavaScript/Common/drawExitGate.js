
function drawExitGate(exitGate, ctx, door) {

    exitGate.src = '../Images/gate.png';


    ctx.drawImage(exitGate, door.x * 37, door.y * 37);
}