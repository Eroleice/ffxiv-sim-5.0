const calc = require("../calculate.js");

module.exports = function cast(name, character) {

    if (name === "debug") {
        // debug

        let gcd = calc.gcd_calc(character, 2800);
        console.log(gcd);

        console.log("Hit debug point, process is stopping right now ...");
        process.exit();

    } else if (name === "cast_malefic_iv") {

        character.mp -= 400;
        let dmg = calc.dmg_calc(250, character);
        character.log.damage.push({
            'time': character.log.time,
            'name': name.substr(5),
            'damage': dmg[0],
            'crit': dmg[1],
            'dh': dmg[2]
        });
        if (character.config.debug_mode) {
            console.log(`[${character.log.time}] ${name.substr(5)} deals ${dmg[0]} damage, ${dmg[1]}, ${dmg[2]}...`);
        }

    } else if (name === "malefic_iv") {

        character.casting = "cast_malefic_iv";
        character.gcd = calc.gcd_calc(character);
        character.cast_timer = calc.gcd_calc(character, 2500);
        character.animation = character.config.animation_block;
        character.log.cast.push({
            'time': character.log.time,
            'name': name
        });
        if (character.config.debug_mode) {
            console.log(`[${character.log.time}] casting ${name} ...`);
        }

    }

};