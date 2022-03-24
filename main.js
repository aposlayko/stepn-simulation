const ENERGY = [
/*0*/2.393,
/*1*/2.393,
/*2*/2.393,
/*3*/2.393,
/*4*/2.393,
/*5*/2.393,
  2.611,
  2.975,
  3.281,
  3.536,
/*10*/3.74,
  4.012,
  4.284,
  4.488,
  4.641,
/*15*/4.845,
  5.117,
  5.338,
  5.542,
  5.746,
/*20*/5.95
];
const MAX_LEVEL = 9;
const LEVELING_COST = [0, 1, 2, 3, 4, 10, 6, 7, 8, 9, 30, 11, 12, 13, 14, 15, 16, 17, 18, 19, 80, 21, 22, 23, 24, 25, 26, 27, 28];


class Sneaker {
  level = 5;

  constructor(level) {
    this.level = level;
  }

  get earningsPerEnergy() {
    return ENERGY[this.level];
  }
}

class Account {
  accountName = 'Default name';
  sneakers;
  gst = 0;

  constructor(accountName, sneakers, gst) {
    this.accountName = accountName;
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
    const earnings = this.energy * this.sneakers[0].earningsPerEnergy;
    this.gst += earnings
    console.log(`(${this.accountName}) Running... earned ${earnings} GST. Balance ${this.gst} GST`);
  }

  levelUp() {
    const sneakerLevel = this.sneakers[0].level;
    const levelingCost = LEVELING_COST[sneakerLevel + 1];

    if (sneakerLevel < MAX_LEVEL && this.gst >= levelingCost) {
      this.gst -= levelingCost;
      this.sneakers[0].level++;
      console.log(`(${this.accountName}) Sneaker level up ${this.sneakers[0].level} level for ${levelingCost} GST. Balance ${this.gst} GST`);
    }
  }

  log() {
    console.log(this.accountName);
    console.log('GST:', this.gst);
    console.log(this.sneakers);
  }
}

class Game {
  accounts = [];
  day = 0;

  constructor(accounts) {
    this.accounts = accounts;
  }

  start() {
    while (true) {
      console.log(`----- Day ${this.day} -----`);

      this.run();
      this.levelUp();

      this.day++;
      if (this.isFinal()) {
        this.log();
        break;
      }
    }
  }

  run() {
    this.accounts.forEach(acc => acc.run());
  }

  levelUp() {
    this.accounts.forEach(acc => acc.levelUp());
  }

  log() {
    console.log('\n====== Finish ======');
    this.accounts.forEach(acc => acc.log());
  }

  isFinal() {
    return this.day >= 10;
  }
}

const sn1 = new Sneaker(5);
const sn2 = new Sneaker(5);
const sn3 = new Sneaker(5);
const acc1 = new Account('Account 1', [sn1, sn2, sn3], 0);
const sn4 = new Sneaker(5);
const acc2 = new Account('Account 2', [sn4], 0);
const game = new Game([acc1, acc2]);

game.start();
