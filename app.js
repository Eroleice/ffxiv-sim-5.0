const fs = require("fs");
const Battle = require("./lib/battle.js");

let setting = JSON.parse(fs.readFileSync("setting.json"));
let config = JSON.parse(fs.readFileSync("config.json"));
let battle = new Battle(setting, config);

battle.start();