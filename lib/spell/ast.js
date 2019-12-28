

module.exports = function cast(name, character) {

    if (name === "debug") {
        // debug
        character.hp = 10;
        character.debug();
        console.log('Hit debug point, process is stopping right now ...');
        process.exit();
    } else if (name === "cast_malefic_iv") {
        character.mp -= 400;

    } else if (name === "malefic_iv") {

    }

};

function dmg_calc(pot, character) {

}

function crt_check(character) {

}

function dh_check(character) {

}

function dot_calc(pot, character) {

}

function gcd_cal(character) {

}