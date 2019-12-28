const deepcopy = require('deepcopy');

class Character {
    constructor(setting) {
        this.hp = 10000;
        this.mp = 10000;
        this.status = deepcopy(setting.status);
        this.buff = {};
        this.dot = {};
        this.stance = {};
        this.cd = {};
        this.next_spell = "none";
        this.original = deepcopy(setting);
    }

}

module.exports = Character;