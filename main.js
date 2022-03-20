class Sneaker {
    level;
    constructor() {
    }
}

class Account {
    sneakers;
    gst = 0;

    constructor(sneakers) {
        this.sneakers = sneakers;
    }

    get energy() {
        const count = this.sneakers.length;

        if (count < 3) {
            return 2;
        } else if (count < 9) {
            return 4;
        } else if (count < 15) {
            return 9;
        } else if (count < 30) {
            return 12;
        } else if (count >= 30) {
            return 20;
        }
    }
}

class Game {

}
