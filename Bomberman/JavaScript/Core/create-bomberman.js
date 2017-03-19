 const leftImg = document.getElementById('left'),
     rightImg = document.getElementById('right'),
     upImg = document.getElementById('up'),
     downImg = document.getElementById('down');

 function createBomberman(options) {

     function render(drawCoordinates, clearCoordinates) {
         const self = this;

         // self.context.clearRect(clearCoordinates.x, clearCoordinates.y, self.width, self.height);

         // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); 
         self.context.drawImage(
             self.spriteSheet,
             self.currentSpriteIndex * self.spriteSheet.width / 4,
             0,
             self.spriteSheet.width / 4,
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
         spriteSheet: rightImg,
         totalTicksPerFrame: 5,
         width: options.width,
         height: options.height,
         totalSprites: 4,
         currentSpriteIndex: 0,
         currentTicks: 0,
         render: render,
         update: update
     };
 }