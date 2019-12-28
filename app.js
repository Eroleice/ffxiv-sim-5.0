const fs = require('fs');
const Battle = require('./lib/battle.js');

let setting = JSON.parse(fs.readFileSync('setting.json'));
let battle = new Battle(setting);
battle.start();