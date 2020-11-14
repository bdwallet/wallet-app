let hosturl = 'https://heizuan.oss-cn-shenzhen.aliyuncs.com/web/';

const img1 = require('./image/1.png');
const img2 = require('./image/2.png');
const img3 = require('./image/3.png');
const logoheaderen = require('./image/logoheaderen.png');
const logofooteren = require('./image/logofooteren.png');

export default {
  hzpjewm: `${hosturl}hzpjewm.jpg`,
  kefuewm: `${hosturl}kefuewm.jpg`,
  homeewm: `${hosturl}homeewm.jpg`,
  downewm: `${hosturl}v2/downewm.png`,
  logo: `${hosturl}logo.png`,
  logoTextHeadercn: `${hosturl}v2/logo-text-header.png`,
  logoTextHeaderen: logoheaderen,
  logoTextFootercn: `${hosturl}v2/logo-text-footer.png`,
  logoTextFooteren: logofooteren,
  // cdn
  // conitemImg1: `${hosturl}v2/conitem-img1.png`, 
  // conitemImg2: `${hosturl}v2/conitem-img2.png`,
  // conitemImg3: `${hosturl}v2/conitemImg3.png`,
  // conitemImg4: `${hosturl}v2/conitemImg4.png`,
  // locahost
  conitemImg1: img1,
  conitemImg2: img2,
  conitemImg3: img3,
  conitemImg4: img1,
  conitemPcRoad: `${hosturl}conitem-pc-road.png`,
  conitemWapRoad1: `${hosturl}conitem-wap-road1.png`,
  conitemWapRoad2: `${hosturl}conitem-wap-road2.png`,
  conitemWapRoad3: `${hosturl}conitem-wap-road3.png`,
  conitemWapRoad4: `${hosturl}conitem-wap-road4.png`,
  conitemWapRoad5: `${hosturl}conitem-wap-road5.png`,
  conitemPcH5: `${hosturl}conitem-pc-h5.png`,
  conitemWapH5: `${hosturl}conitem-wap-h5.png`,
  avatar1: `${hosturl}avatar1.png`,
  avatar2: `${hosturl}avatar2.jpg`,
  avatar3: `${hosturl}avatar3.jpg`,
  searchNone: `${hosturl}search-none.png`,
}