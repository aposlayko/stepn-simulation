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
const LEVELING_COST = [0, 1, 2, 3, 4, 10, 6, 7, 8, 9, 30, 11, 12, 13, 14, 15, 16, 17, 18, 19, 80, 21, 22, 23, 24, 25, 26, 27, 28];
const COST_OF_NEW_ACCOUNT = 220;


const MAX_LEVEL = 19;
const END_DATE = 500;
const MAX_ENERGY = 30;
const MAX_EARNINGS_PER_DAY = 1000;
const ENERGY_LIMIT = 24;

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
  accountName;
  sneakers;
  gst = 0;

  constructor(sneakers, gst) {
    this.accountName = `Account ${Account.index}`;
    Account.index++;

    this.sneakers = sneakers;
    this.gst = gst;
  }

  static index = 1;

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

  getEarningsPerEnergy() {
    return this.energy * this.sneakers[0].earningsPerEnergy;
  }

  run() {
    const earnings = this.getEarningsPerEnergy();
    this.gst += earnings
    console.log(`(${this.accountName}) Running... earned ${earnings} GST. Balance ${this.gst} GST`);
  }

  levelUp() {
    const sneakerLevel = this.sneakers[0].level;
    const levelingCost = LEVELING_COST[sneakerLevel + 1];

    if (sneakerLevel < MAX_LEVEL && this.gst >= levelingCost) {
      this.gst -= levelingCost;
      this.sneakers[0].level++;
      console.log(`%c(${this.accountName}) Sneaker level up ${this.sneakers[0].level} level for ${levelingCost} GST. Balance ${this.gst} GST`, 'color: #27ca31');
    }
  }

  log() {
    console.log(this.accountName, `, ${this.gst} GST,`, this.sneakers);
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
      this.logEarningsPerDay();
      this.levelUp();
      this.logSumGst();
      this.createNewAccount();
      this.logSumEnergy();

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

  getEarningsPerDay() {
    return this.accounts.reduce((accum, curr) => accum + curr.getEarningsPerEnergy(), 0);
  }

  logEarningsPerDay() {
    console.log(`%cEarnings per day: ${this.getEarningsPerDay()} GST`, 'color: orange');
  }

  levelUp() {
    this.accounts.forEach(acc => acc.levelUp());
  }

  createNewAccount() {
    if (this.getSumGst() >= COST_OF_NEW_ACCOUNT && this.getSumEnergy() < ENERGY_LIMIT) {
      this.spendGst(COST_OF_NEW_ACCOUNT);
      this.accounts.push(new Account([new Sneaker(5)], 0));
      console.log(`%cCreated ${this.accounts[this.accounts.length - 1].accountName}`, 'color: #ea35e7');

    }
  }

  getSumGst() {
    return this.accounts.reduce((accum, curr) => accum + curr.gst, 0);
  }

  logSumGst() {
    console.log(`%cSum of gst: ${this.getSumGst()}`, 'color: orange');
  }

  getSumEnergy() {
    return this.accounts.reduce((accum, curr) => accum + curr.energy, 0);
  }

  logSumEnergy() {
    console.log(`%cSum of energy: ${this.getSumEnergy()}`, 'color: #64ecff');
  }

  spendGst(amount) {
    let budget = amount;
    this.accounts.forEach(acc => {
      if (acc.gst <= budget) {
        budget -= acc.gst;
        acc.gst = 0;
      } else {
        acc.gst -= budget;
      }
    });
  }

  log() {
    console.log('\n====== Finish ======');
    this.accounts.forEach(acc => acc.log());
  }

  isFinal() {
    if (this.getSumEnergy() >= MAX_ENERGY) {
      console.log(`%cMax energy achieved: ${MAX_ENERGY}`, 'color: red');
      return true;
    } else if (this.day >= END_DATE) {
      console.log(`%cEnd date achieved: ${END_DATE}`, 'color: red');
      return true;
    } else if (this.getEarningsPerDay() >= MAX_EARNINGS_PER_DAY) {
      console.log(`%cMax earnings achieved: ${MAX_EARNINGS_PER_DAY}`, 'color: red');
      return true;
    }

    return false;
  }
}

const acc1 = new Account([
  new Sneaker(9),
  new Sneaker(5),
  new Sneaker(5)
], 0);

const acc2 = new Account([
    new Sneaker(9)
], 0);

const acc3 = new Account([
  new Sneaker(9)
], 0);

const game = new Game([acc1, acc2, acc3]);

game.start();
