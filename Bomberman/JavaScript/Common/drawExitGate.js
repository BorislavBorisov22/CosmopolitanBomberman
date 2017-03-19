
function drawExitGate(exitGate, bombcanvas,door) {

    exitGate.src = '../Images/gate.png';


    bombcanvas.drawImage(exitGate, door.x * 37, door.y * 37);
}