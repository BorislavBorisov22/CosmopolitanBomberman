'use strict';

class CollisionDetector {
    constructor() {

    }

    areColliding(firstBody, secondBody, width, height) {
        const areColliding = (firstBody.x < secondBody.x + width && firstBody.x + width > secondBody.x) &&
            (firstBody.y < secondBody.y + height && firstBody.y + height > secondBody.y);

        return areColliding;
    }
}