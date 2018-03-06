// https://wc.yooooo.us/wiki/太阳系

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = HOUR * 23 + 56 * MINUTE; // 一个地球日的秒数
const YEAR = 365.24 * DAY;
const AU = 1.5 * Math.pow(10, 8); // 地球到太阳的距离150,000,000km

let data = {
  sun: {
    equatorialRadius: 696000, // 赤道半径/km
    trackRadius: null || 0, // 轨道半径/AU
    orbitalInclination: null, // 轨道倾角/度（相对地球轨道平面，即黄道）
    semiLongAxis: null || 0, // 半长轴/km
    centrifugationRate: null || 0, // 离心率 
    equatorialInclination: 7.25, // 赤道倾角
    revolutionPeriod: null || 0, // 公转周期
    rotationCycle: 25.38 * DAY // 自转周期
  },
  mercury: {
    equatorialRadius: 2440,
    trackRadius: 0.3871 * AU,
    orbitalInclination: 7.005,
    semiLongAxis: 57909100,
    centrifugationRate: 0.205630,
    equatorialInclination: 0,
    revolutionPeriod: 87.97 * DAY,
    rotationCycle: 59 * DAY
  },
  venus: {
    equatorialRadius: 6052,
    trackRadius: 0.7233 * AU,
    orbitalInclination: 3.395,
    semiLongAxis: 108208000,
    centrifugationRate: 0.0067,
    equatorialInclination: 177.4,
    revolutionPeriod: 225 * DAY,
    rotationCycle: 243 * DAY
  },
  earth: {
    equatorialRadius: 6378,
    trackRadius: 1 * AU,
    orbitalInclination: 0,
    semiLongAxis: 149598023,
    centrifugationRate: 0.0167086,
    equatorialInclination: 23.44,
    revolutionPeriod: YEAR,
    rotationCycle: DAY
  },
  mars: {
    equatorialRadius: 3397,
    trackRadius: 1.5237 * AU,
    orbitalInclination: 1.85,
    semiLongAxis: 227936640,
    centrifugationRate: 0.09341233,
    equatorialInclination: 25.19,
    revolutionPeriod: 687 * DAY,
    rotationCycle: 24 * HOUR + 37 * MINUTE
  },
  jupiter: {
    equatorialRadius: 71492,
    trackRadius: 5.2026 * AU,
    orbitalInclination: 1.303,
    semiLongAxis: 778547200,
    centrifugationRate: 0.048775,
    equatorialInclination: 3.08,
    revolutionPeriod: 11.86 * YEAR,
    rotationCycle: 9 * HOUR + 50 * MINUTE
  },
  saturn: {
    equatorialRadius: 60268,
    trackRadius: 9.5549 * AU,
    orbitalInclination: 2.489,
    semiLongAxis: 1433449370,
    centrifugationRate: 0.055723219,
    equatorialInclination: 26.7,
    revolutionPeriod: 29.46 * YEAR,
    rotationCycle: 10 * HOUR + 39 * MINUTE
  },
  uranus: {
    equatorialRadius: 25559,
    trackRadius: 19.2184 * AU,
    orbitalInclination: 0.773,
    semiLongAxis: 2876679082,
    centrifugationRate: 0.044405586,
    equatorialInclination: 97.9,
    revolutionPeriod: 84.01 * YEAR,
    rotationCycle: 17 * HOUR + 14 * MINUTE
  },
  neptune: {
    equatorialRadius: 24764,
    trackRadius: 30.1104 * AU,
    orbitalInclination: 1.770,
    semiLongAxis: 4503443661,
    centrifugationRate: 0.011214269,
    equatorialInclination: 27.8,
    revolutionPeriod: 164.82 * YEAR,
    rotationCycle: 16 * HOUR + 06 * MINUTE
  }
};

const DATA = {};
for(let d in data){
  DATA[d] = new Proxy(data[d], {
    get: function(target, name){
      switch(name){
        case 'equatorialRadius': return target[name] > 100000? target[name] / data.earth.equatorialRadius / 5: target[name] / data.earth.equatorialRadius;
        case 'trackRadius': return target[name] > 0? 20 + target[name] / data.earth.equatorialRadius / 2000: 0; //target[name] / data.earth.trackRadius * 300;
        case 'orbitalInclination': return target[name];
        case 'semiLongAxis': return target[name] / 100000000 * 60;
        case 'centrifugationRate': return target[name];
        case 'equatorialInclination': return target[name];
        case 'revolutionPeriod': return target[name] / 100000;
        case 'rotationCycle': return target[name] / data.earth.rotationCycle * 100;
        default: return undefined;
      }
    }
  });
}