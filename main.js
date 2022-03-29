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




class Sneaker {
  level;

  constructor(level) {
    this.level = level || 5;
  }

  get earningsPerEnergy() {
    return ENERGY[this.level];
  }
}


class Account {
  accountName;
  sneakers;
  gst = 0;
  maxLevel;

  constructor(sneakers, gst, options) {
    this.accountName = `Account ${Account.index}`;
    Account.index++;

    this.sneakers = sneakers;
    this.gst = gst;
    this.maxLevel = options?.maxLevel || 5;
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

    if (sneakerLevel < this.maxLevel && this.gst >= levelingCost) {
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
  logs = {
    earnings: [],
    energy: []
  }

  maxLevel;
  endDate;
  maxEnergy;
  energyLimit;
  maxEarningsPerDay;

  constructor(accountParams, options) {
    this.maxLevel = options.maxLevel || 5;
    this.endDate = options.endDate || 100;
    this.maxEnergy = options.maxEnergy || 26;
    this.energyLimit = options.energyLimit || 24;
    this.maxEarningsPerDay = options.maxEarningsPerDay || 100;

    this.accounts = accountParams.map(accParam => {
      return new Account(accParam.sneakers, accParam.gst, this.maxLevel)
    })
  }

  start() {
    while (true) {
      console.log(`----- Day ${this.day} -----`);
      this.writeLogs();

      this.run();
      this.logEarningsPerDay();
      this.levelUp();
      this.logSumGst();
      this.createNewAccount();
      this.logSumEnergy();

      this.day++;
      if (this.isFinal()) {
        this.finishLog();
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
    if (this.getSumGst() >= COST_OF_NEW_ACCOUNT && this.getSumEnergy() < this.energyLimit) {
      this.spendGst(COST_OF_NEW_ACCOUNT);
      this.accounts.push(new Account([new Sneaker(5)], 0, {maxLevel: this.maxLevel}));
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

  finishLog() {
    console.log('\n====== Finish ======');
    this.accounts.forEach(acc => acc.log());
  }

  writeLogs() {
    this.logs.earnings.push(Math.round(this.getEarningsPerDay() * 100) / 100);
    this.logs.energy.push(this.getSumEnergy());
  }

  isFinal() {
    if (this.getSumEnergy() >= this.maxEnergy) {
      console.log(`%cMax energy achieved: ${this.maxEnergy}`, 'color: red');
      return true;
    } else if (this.day >= this.endDate) {
      console.log(`%cEnd date achieved: ${this.endDate}`, 'color: red');
      return true;
    } else if (this.getEarningsPerDay() >= this.maxEarningsPerDay) {
      console.log(`%cMax earnings achieved: ${this.maxEarningsPerDay}`, 'color: red');
      return true;
    }

    return false;
  }
}


const game1 = new Game([{
  sneakers: [new Sneaker(9), new Sneaker(), new Sneaker()], gst: 72
}, {
  sneakers: [new Sneaker(9)], gst: 68
}, {
  sneakers: [new Sneaker(9)], gst: 7
}], {
  maxLevel: 19,
  endDate: 100,
  maxEnergy: 26,
  energyLimit: 24,
  maxEarningsPerDay: 200
});

game1.start();



const game2 = new Game([{
  sneakers: [new Sneaker(9), new Sneaker(), new Sneaker()], gst: 72
}, {
  sneakers: [new Sneaker(9)], gst: 68
}, {
  sneakers: [new Sneaker(9)], gst: 7
}], {
  maxLevel: 9,
  endDate: 100,
  maxEnergy: 26,
  energyLimit: 24,
  maxEarningsPerDay: 200
});

game2.start();



function generateData(logs) {
  let maxLength = 0;
  let maxIndex = 0;
  logs.forEach((l, i) => {
    if (l.length > maxLength) {
      maxLength = l.length;
      maxIndex = i;
    }
  });

  return {
    labels: logs[maxIndex].map((l, i) => i),
    series: [
      ...logs
    ]
  }

}

const energyData = generateData([game1.logs.energy, game2.logs.energy]);
const earningsData = generateData([game1.logs.earnings, game2.logs.earnings]);


// https://gionkunz.github.io/chartist-js/api-documentation.html
// Our labels and three data series
/*const data = {
  labels: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6'],
  series: [
    [5, 4, 3, 7, 5, 10],
    [3, 2, 9, 5, 4, 6],
    [2, 1, -3, -4, -2, 0]
  ]
};*/

// We are setting a few options for our chart and override the defaults
const options = {
  // Don't draw the line chart points
  showPoint: true,
  // Disable line smoothing
  lineSmooth: true,
  // X-Axis specific configuration
  axisX: {},
  // Y-Axis specific configuration
  axisY: {},
  height: '600px'
};

// All you need to do is pass your configuration as third parameter to the chart function
new Chartist.Line('.energy', energyData, options);
new Chartist.Line('.earnings', earningsData, options);
