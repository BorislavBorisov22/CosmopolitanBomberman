const enemyImg = document.getElementById('enemy-sprite');

function createEnemy(options) {
    'use strict';

    function render() {
        const self = this;
        // self.context.clearRect(clearCoordinates.x, clearCoordinates.y, self.width, self.height);
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); 

        self.context.drawImage(
            self.spriteSheet,
            self.currentSpriteIndex * self.spriteSheet.width / self.totalSprites,
            0,
            self.spriteSheet.width / self.totalSprites,
            self.spriteSheet.height,
            self.x,
            self.y,
            self.width,
            self.height
        );

        return self;
    }

    function update() {
        const self = this;

        self.currentTicks += 1;

        if (self.currentTicks >= self.totalTicksPerFrame) {

            self.currentSpriteIndex += 1;

            if (self.currentSpriteIndex >= self.totalSprites) {

                self.currentSpriteIndex = 0;
            }

            self.currentTicks = 0;
        }

        return self;
    }

    return {
        context: options.context,
        spriteSheet: enemyImg,
        totalTicksPerFrame: 5,
        width: options.width,
        height: options.height,
        totalSprites: 4,
        currentSpriteIndex: 0,
        currentTicks: 0,
        render: render,
        x: options.x,
        y: options.y,
        update: update,
        moveRight: true,
        moveLeft: false,
        moveUp: false,
        moveDown: false
    };
}