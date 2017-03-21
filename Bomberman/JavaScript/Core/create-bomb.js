const bombImg = document.getElementById('bomb-sprite');

function createBomb(options) {

    function render(drawCoordinates, clearCoordinates) {
        const self = this;

        // self.context.clearRect(clearCoordinates.x, clearCoordinates.y, self.width, self.height);
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); 

        self.context.drawImage(
            self.spriteSheet,
            self.currentSpriteIndex * self.spriteSheet.width / self.totalSprites,
            0,
            self.spriteSheet.width / self.totalSprites,
            self.spriteSheet.height,
            drawCoordinates.x,
            drawCoordinates.y,
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
        spriteSheet: bombImg,
        totalTicksPerFrame: 5,
        width: options.width,
        height: options.height,
        totalSprites: 5,
        currentSpriteIndex: 0,
        currentTicks: 0,
        render: render,
        x: options.x,
        y: options.y,
        update: update,
    };
}