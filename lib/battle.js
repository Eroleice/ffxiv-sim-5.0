const Character = require('./character.js');

class Battle {
    constructor(setting) {
        this.character = new Character(setting);
        this.cast = require('./spell/' + setting.job + '.js');

    }

    start() {
        this.cast("test", this);
        console.log(this.character.next_spell);
    }
}

module.exports = Battle;