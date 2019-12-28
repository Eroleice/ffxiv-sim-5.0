module.exports = {
    "dmg_calc": function (pot, character) {
        // D1 = < 技能威力 × f(攻击力) × f(信念) > /100 > /1000 >
        let D1 = Math.floor(Math.floor(Math.floor(pot * weapon_damage_calc(character) * determination_calc(character)) / 100) / 1000);
        // D2 = < D1 × f(坚韧) > /1000 > × f(武器) > /100 > × 职业特性 > /100 >
        let D2 = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(D1 * tenacity_calc(character)) / 1000) * weapon_damage_calc(character)) / 100) * TRAIT[character.job]) / 100);
        //D3 = < D2 × 暴击? > /1000 > × 直击? > /100 >
        let D3 = Math.floor(Math.floor(D2 * (Math.random() * 10 + 95)) / 100);
        let crit_c = false;
        let dh_c = false;
        let crit_m = 1000;
        let dh_m = 100;
        if (charact.expect_mode) {
            // 期望值模式下暴击、直击以期望值计算
            let c_p = Math.floor(200 * (character.status.crt - SUB) / DIV + 50) / 1000;
            let dh_p = Math.floor(550 * (character.status.dh - SUB) / DIV) / 1000;
            crit_m = c_p * critical_calc(character) + (1 - c_p) * 1000;
            dh_m = dh_p * 125 + (1 - dh_p) * 100;
        } else {
            // 非期望值模式下暴击、直击进行随机判定
            crit_c = crt_check(character);
            dh_c = dh_check(character);
            crit_m = (crit_c) ? critical_calc(character) : 1000;
            dh_m = (dh_c) ? 125 : 100;
        }
        let dmg = Math.floor(Math.floor(Math.floor(Math.floor(D3 * crit_m) / 1000) * dh_m) / 100);
        return [dmg, crit_c, dh_c];
    },
    "dot_calc": function (pot, character) {

    },
    "aa_calc": function (pot, character) {

    }
};

const MAIN = 340;
const DIV = 3300;
const SUB = 380;

// 职业attribute系数参考[https://bbs.nga.cn/read.php?tid=19149842] by botpig
const ATT = {
    'pld': 34,
    'gbr': 34,
    'drk': 35,
    'war': 35,
    'mnk': 37,
    'sam': 37,
    'nin': 37,
    'drg': 39,
    'mch': 39,
    'brd': 39,
    'blm': 39,
    'smn': 39,
    'sch': 39,
    'whm': 39,
    'ast': 39,
    'dnc': 39
};

// 职业特性
const TRAIT = {
    'pld': 1,
    'war': 1,
    'drk': 1,
    'gbr': 1,
    'whm': 1.3,
    'sch': 1.3,
    'ast': 1.3,
    'mnk': 1,
    'drg': 1,
    'nin': 1,
    'sam': 1,
    'brd': 1.2,
    'mch': 1.2,
    'dnc': 1.2,
    'blm': 1.3,
    'smn': 1.3,
    'rdm': 1.3
};


function crt_check(character) {
    // p(暴击)= < 200 × ( 暴击 - Level{Lv}{SUB})/ Level{Lv}{DIV} + 50 > / 10
    let p = Math.floor(200 * (character.status.crt - SUB) / DIV + 50) / 1000;
    let r = Math.random();
    if (r > p) {
        return false;
    } else {
        return true;
    }
}

function dh_check(character) {
    // p(直击)= < 550 × ( 直击 - Level{Lv}{SUB})/ Level{Lv}{DIV} > / 10
    let p = Math.floor(550 * (character.status.dh - SUB) / DIV) / 1000;
    let r = Math.random();
    if (r > p) {
        return false;
    } else {
        return true;
    }
}

function weapon_damage_calc(character) {
    // f(武器) = < ( Level{Lv}{MAIN} × Job{Job}{Attribute} / 1000 ) + WD >
    return Math.floor(MAIN * ATT[character.job] / 1000 + character.status.wd);
}

function attack_damage_calc(character) {
    if (character.job === 'pld' || character.job === 'war' || character.job === 'drk' || character.job === 'gbr') {
        // f(攻击力) = < 115 × ( 攻击力 - Level{Lv}{MAIN} ) / Level{Lv}{MAIN} > + 100
        return Math.floor(115 * (character.status.ap - MAIN) / MAIN) + 100;
    } else {
        // f(攻击力) = < 165 × ( 攻击力 - Level{Lv}{MAIN} ) / Level{Lv}{MAIN} > + 100
        return Math.floor(165 * (character.status.ap - MAIN) / MAIN) + 100;
    }  
}

function determination_calc(character) {
    // f(信念) = < 130 × (信念 - Level{ Lv } { MAIN } ) / Level{Lv}{DIV} + 1000 >
    return Math.floor(130 * (character.status.det - MAIN) / DIV + 1000);
}

function tenacity_calc(character) {
    if (character.job === 'pld' || character.job === 'war' || character.job === 'drk' || character.job === 'gbr') {
        // f(坚韧) = < 100 × (坚韧 - Level{ Lv } { SUB } ) / Level{Lv}{DIV} + 1000 >
        return Math.floor(100 * (character.status.ten - SUB) / DIV + 1000);
    } else {
        // 非坦克职业无法获得坚韧加成
        return 1000;
    }
}

function speed_calc(character) {
    // f(速度) = < 130 × ( 速度 - Level{Lv}{SUB} )/ Level{Lv}{DIV} + 1000 >
    return Math.floor(130 * (character.status.ss - SUB) / DIV + 1000);
}

function critical_calc(character) {
    // f(暴击) = < 2000 × ( 暴击 - Level{Lv}{SUB} )/ Level{Lv}{DIV} + 1400 >
    return Math.floor(2000 * (character.status.crt - SUB) / DIV + 1400);
}

function auto_calc(character) {
    // f(平A) = < ( < Level{Lv}{MAIN} × Job{Job}{Attribute} / 1000 ) + 武器性能 > × ( 攻击间隔 / 3 ) >
    return Math.floor(Math.floor(MAIN * ATT[character.job] / 1000 + character.status.wd) * character.status.delay / 3);
}

/**
 * https://bbs.nga.cn/read.php?tid=19736925
 * [搬运翻译][大量公式预警]如何成为光之数学家 第3版
 * by Brecruiser
 * 公式中的<>代表向下取整
 * 公式中的+<>+代表向上取整
 */
