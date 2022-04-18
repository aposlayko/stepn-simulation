const ENERGY = [
/*0*/2,
/*1*/2.3,
/*2*/2.3,
/*3*/2.3,
/*4*/2.3,
/*5*/2.3,
  2.69, /*0.39*/
  3,    /*0.31*/
  3.35, /*0.35*/
  3.66, /*0.31*/
/*10*/3.95,/*0.29*/
  4.2,  /*0.25*/
  4.43, /*0.23*/
  4.65, /*0.22*/
  4.85, /*0.2*/
/*15*/5.05,/*0.2*/
  5.25,  /*0.2*/
  5.48,  /*0.23*/
  5.67,  /*0.18*/
  5.85,  /*0.18*/
/*20*/6.02,/*0.17*/
  6.18,  /*0.16*/
  6.34,  /*0.16*/
  6.48,  /*0.14*/
  6.62,  /*0.14*/
/*25*/6.76,/*0.14*/
  6.9,   /*0.14*/
  7.05,  /*0.15*/
  7.2,   /*0.15*/
  7.32,  /*0.12*/
/*30*/7.45 /*0.13*/
];
const LEVELING_COST = [0, 1, 2, 3, 4, 10, 6, 7, 8, 9, 30, 11, 12, 13, 14, 15, 16, 17, 18, 19, 80, 21, 22, 23, 24, 25, 26, 27, 28];
const COST_OF_NEW_ACCOUNT = 220;
const SNEAKER_COST = 8.4 * (93 / 4.1);



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

    this.sneakers = sneakers || [];
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

  getEarningsPerDay() {
    return this.energy * this.sneakers[0].earningsPerEnergy;
  }

  getCapitalization() {
    let capa = 0;
    capa += this.gst;

    this.sneakers.forEach(sn => {
      capa += SNEAKER_COST + SNEAKER_COST * 0.005 * sn.level;
    });

    return capa;
  }

  run() {
    const earnings = this.getEarningsPerDay();
    this.gst += earnings
    // console.log(`(${this.accountName}) Running... earned ${earnings} GST. Balance ${this.gst} GST`);
  }

  levelUp() {
    const sneakerLevel = this.sneakers[0].level;
    const levelingCost = LEVELING_COST[sneakerLevel + 1];

    if (sneakerLevel < this.maxLevel && this.gst >= levelingCost) {
      this.gst -= levelingCost;
      this.sneakers[0].level++;
      // console.log(`%c(${this.accountName}) Sneaker level up ${this.sneakers[0].level} level for ${levelingCost} GST. Balance ${this.gst} GST`, 'color: #27ca31');
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
    energy: [],
    capitalization: [],
  };
  deposit = 0;

  maxLevel;
  endDate;
  maxEnergy;
  energyLimit;
  maxEarningsPerDay;
  maxGST;
  takeMoneyEveryNDay;
  enableLogs;

  constructor(accountParams, options) {
    this.maxLevel = options.maxLevel || 5;
    this.endDate = options.endDate || 100;
    this.maxEnergy = options.maxEnergy || 26;
    this.energyLimit = options.energyLimit || 24;
    this.maxEarningsPerDay = options.maxEarningsPerDay || 100;
    this.takeMoneyEveryNDay = options.takeMoneyEveryNDay || Infinity;
    this.maxGST = options.maxGST || Infinity;
    this.enableLogs = options.enableLogs || false;

    this.accounts = accountParams.map(accParam => {
      return new Account(accParam.sneakers, accParam.gst, this.maxLevel)
    })
  }

  start() {
    while (true) {
      this.enableLogs && console.log(`----- Day ${this.day} -----`);
      this.writeLogs();

      this.run();
      this.enableLogs && this.logEarningsPerDay();
      this.takeMoney();
      this.levelUp();
      this.enableLogs && this.logSumGst();
      this.createNewAccount();
      this.enableLogs && this.logSumEnergy();

      this.day++;
      if (this.isFinal()) {
        break;
      }
    }
  }

  run() {
    this.accounts.forEach(acc => acc.run());
  }

  getEarningsPerDay() {
    return this.accounts.reduce((accum, curr) => accum + curr.getEarningsPerDay(), 0);
  }

  logEarningsPerDay() {
    console.log(`%cEarnings per day: ${this.getEarningsPerDay()} GST`, 'color: orange');
  }

  takeMoney() {
    if (this.day && this.day % this.takeMoneyEveryNDay === 0) {
      this.accounts.forEach(acc => {
        const todayEarnings = acc.getEarningsPerDay();
        acc.gst -= todayEarnings;
        this.deposit += todayEarnings;
      });
    }
  }

  levelUp() {
    this.accounts.forEach(acc => acc.levelUp());
  }

  createNewAccount() {
    if (this.getSumGst() >= COST_OF_NEW_ACCOUNT && this.getSumEnergy() < this.energyLimit) {
      this.spendGst(COST_OF_NEW_ACCOUNT);
      this.accounts.push(new Account([new Sneaker(5)], 0, {maxLevel: this.maxLevel}));
      this.enableLogs && console.log(`%cCreated ${this.accounts[this.accounts.length - 1].accountName}`, 'color: #ea35e7');

    }
  }

  getCapitalization() {
    return this.accounts.reduce((accum, curr) => accum + curr.getCapitalization(), 0);
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
    console.log(`Deposit: ${this.deposit} GST (${this.deposit * 4.3})`);
    console.log(`Capitalization: ${this.getCapitalization()} GST (${this.getCapitalization() * 4.3})`);
  }

  writeLogs() {
    this.logs.earnings.push(Math.round(this.getEarningsPerDay() * 100) / 100);
    this.logs.energy.push(this.getSumEnergy());
    this.logs.capitalization.push(this.getCapitalization());
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
    } else if (this.getSumGst() >= 2000) {
      console.log(`%cMax GST achived: ${this.maxGST} (in ${this.day} days)`, 'color: red');
      return true;
    }

    return false;
  }
}


const game1 = new Game([{
  sneakers: [new Sneaker(12), new Sneaker(), new Sneaker()], gst: 0
}, {
  sneakers: [new Sneaker(11)], gst: 9
}, {
  sneakers: [new Sneaker(11)], gst: 9
}, {
  sneakers: [new Sneaker(9)], gst: 9
}, {
  sneakers: [new Sneaker(9)], gst: 9
}, {
  sneakers: [new Sneaker(5)], gst: 0
}], {
  maxLevel: 9,
  endDate: 100,
  maxEnergy: 38,
  energyLimit: 36,
  maxEarningsPerDay: 300,
  takeMoneyEveryNDay: 7,
  maxGST: 2861,
});

game1.start();



const game2 = new Game([{
  sneakers: [new Sneaker(12), new Sneaker(), new Sneaker()], gst: 0
}, {
  sneakers: [new Sneaker(11)], gst: 9
}, {
  sneakers: [new Sneaker(11)], gst: 9
}, {
  sneakers: [new Sneaker(9)], gst: 9
}, {
  sneakers: [new Sneaker(9)], gst: 9
}, {
  sneakers: [new Sneaker(5)], gst: 0
}], {
  maxLevel: 9,
  endDate: 100,
  maxEnergy: 26,
  energyLimit: 14,
  maxEarningsPerDay: 300,
  takeMoneyEveryNDay: 7,
  maxGST: 441 + 220*22,
});

game2.start();

// game1.finishLog();
// game2.finishLog();


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
const capitalizationData = generateData([game1.logs.capitalization, game2.logs.capitalization]);


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
  axisY: {
    onlyInteger: true,
  },
  height: '500px',
};

// All you need to do is pass your configuration as third parameter to the chart function
new Chartist.Line('.energy', energyData, options);
new Chartist.Line('.earnings', earningsData, options);
new Chartist.Line('.capa', capitalizationData, options);
