class Sneaker {
  level;

  constructor(level) {
    this.level = level;
  }
}

class Account {
  sneakers;
  gst = 0;

  constructor(sneakers, gst) {
    this.sneakers = sneakers;
    this.gst = gst;
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

  run() {
    this.gst += 5;
  }
}

class Game {
  accounts = [];
  day = 0;

  constructor(accounts) {
  }

  start() {
    while (true) {
      this.nextDay();
      if (this.isFinal()) break;
    }
  }

  nextDay() {
    console.log(`----- ${this.day} -----`);

    this.day++;
  }

  isFinal() {
    return this.day >= 5;
  }
}

const sn1 = new Sneaker(5);
const sn2 = new Sneaker(5);
const sn3 = new Sneaker(5);
const acc1 = new Account([sn1, sn2, sn3], 166);
const sn4 = new Sneaker(5);
const acc2 = new Account([sn4], 3);
const game = new Game([acc1, acc2]);

game.start();
