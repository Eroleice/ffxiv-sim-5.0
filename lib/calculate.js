/**
 * [https://bbs.nga.cn/read.php?tid=19736925]
 * [搬运翻译][大量公式预警]如何成为光之数学家 第3版
 * by Brecruiser
 * 公式中的<>代表向下取整
 * 公式中的+<>+代表向上取整
 */

module.exports = {
    "dmg_calc": function (pot, character, force_crit = false, force_dh = false) {
        // D1 = < 技能威力 × f(攻击力) × f(信念) > /100 > /1000 >
        let D1 = Math.floor(Math.floor(Math.floor(pot * attack_damage_calc(character) * determination_calc(character)) / 100) / 1000);
        // D2 = < D1 × f(坚韧) > /1000 > × f(武器) > /100 > × 职业特性 > /100 >
        let D2 = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(D1 * tenacity_calc(character)) / 1000) * weapon_damage_calc(character)) / 100) * TRAIT[character.job]) / 100);
        //D3 = < D2 × 暴击? > /1000 > × 直击? > /100 >
        let crit_c = false;
        let dh_c = false;
        let crit_m = 1000;
        let dh_m = 100;
        if (character.config.expect_mode) {
            // 期望值模式下暴击、直击以期望值计算
            if (force_crit) {
                crit_m = critical_calc(character); // 必定暴击
                crit_c = true;
            } else {
                let c_p = Math.floor(200 * (character.status.crt - SUB) / DIV + 50) / 1000;
                crit_m = c_p * critical_calc(character) + (1 - c_p) * 1000;
            }
            if (force_dh) {
                dh_m = 125; // 必定直击
                dh_c = true;
            } else {
                let dh_p = Math.floor(550 * (character.status.dh - SUB) / DIV) / 1000;
                dh_m = dh_p * 125 + (1 - dh_p) * 100;
            }
        } else {
            // 非期望值模式下暴击、直击进行随机判定
            if (force_crit) {
                crit_m = critical_calc(character); // 必定暴击
                crit_c = true;
            } else {
                crit_c = crt_check(character);
                crit_m = (crit_c) ? critical_calc(character) : 1000;
            }
            if (force_dh) {
                dh_m = 125; // 必定直击
                dh_c = true;
            } else {
                dh_c = dh_check(character);
                dh_m = (dh_c) ? 125 : 100;
            }
        }
        let D3 = Math.floor(Math.floor(Math.floor(Math.floor(D2 * crit_m) / 1000) * dh_m) / 100);
        // 伤害 = < D3 × rand[95,105] > /100 > × buff_1 > × buff_2 >
        let dmg;
        if (character.config.expect_mode) {
            dmg = buff_calc(D3, character.buff);
        } else {
            dmg = buff_calc(Math.floor(Math.floor(D3 * (Math.random() * 10 + 95)) / 100), character.buff);
        }
        return [dmg, crit_c, dh_c];
    },
    "dot_calc": function (pot, character) {

    },
    "aa_calc": function (pot, character) {

    },
    "gcd_calc": function (character, cast_time = 2500) {
        let ss_m = speed_calc(character);
        // GCD1 = < ( 2000 - f(速度) ) × 技能复唱 / 1000 > >[1]
        let GCD1 = Math.floor((2000 - ss_m) * cast_time / 1000);
        // GCD2 = < ( 100 - Type Y ) × ( 100 - Haste ) / 100 >
        // Haste应该是指曾经的小仙女buff，以及特殊情况下获得的加速buff，dps模拟不涉及
        let GCD2 = Math.floor(100 - typeY(character) / 100);
        // GCD3 = ( 100 - Type Z ) / 100
        let GCD3 = (100 - typeZ(character)) / 100;
        // GCD4 = < +< GCD2 × GCD3 >+ × GCD1 / 100 > × Astral_Umbral / 100 >
        let GCD4 = Math.floor(Math.floor(Math.ceil(GCD2 * GCD3) * GCD1) * typeU(character) / 100);
        // GCD长度 = GCD4 / 100
        return GCD4 / 1000;
        // 返回单位是0.01秒，基础gcd是250
    }
};

const MAIN = 340;
const DIV = 3300;
const SUB = 380;

// 职业attribute系数参考[https://bbs.nga.cn/read.php?tid=19149842] by botpig
const ATT = {
    "pld": 34,
    "gbr": 34,
    "drk": 35,
    "war": 35,
    "mnk": 37,
    "sam": 37,
    "nin": 37,
    "drg": 39,
    "mch": 39,
    "brd": 39,
    "blm": 39,
    "smn": 39,
    "sch": 39,
    "whm": 39,
    "ast": 39,
    "dnc": 39
};

// 职业特性
const TRAIT = {
    "pld": 100,
    "war": 100,
    "drk": 100,
    "gbr": 100,
    "whm": 130,
    "sch": 130,
    "ast": 130,
    "mnk": 100,
    "drg": 100,
    "nin": 100,
    "sam": 100,
    "brd": 120,
    "mch": 120,
    "dnc": 120,
    "blm": 130,
    "smn": 130,
    "rdm": 130
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
    if (character.job === "pld" || character.job === "war" || character.job === "drk" || character.job === "gbr") {
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
    if (character.job === "pld" || character.job === "war" || character.job === "drk" || character.job === "gbr") {
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
    // f(暴击) = < 200 × ( 暴击 - Level{Lv}{SUB} )/ Level{Lv}{DIV} + 1400 >
    return Math.floor(200 * (character.status.crt - SUB) / DIV + 1400);
}

function auto_calc(character) {
    // f(平A) = < ( < Level{Lv}{MAIN} × Job{Job}{Attribute} / 1000 ) + 武器性能 > × ( 攻击间隔 / 3 ) >
    return Math.floor(Math.floor(MAIN * ATT[character.job] / 1000 + character.status.wd) * character.status.delay / 3);
}

function typeY(character) {
    if (character.buff.ley_lines > 0) {
        return 15;
    } else if (character.buff.presence_of_mind > 0) {
        return 20;
    } else if (character.buff.shifu > 0) {
        return 13;
    } else if (character.buff.blood_weapon > 0) {
        return 10;
    } else {
        return 0;
    }
}

function typeZ(character) {
    if (character.buff.huton > 0) {
        return 15;
    } else if (character.buff.greased_lightning_i > 0) {
        return 5;
    } else if (character.buff.greased_lightning_ii > 0) {
        return 10;
    } else if (character.buff.greased_lightning_iii > 0) {
        return 15;
    } else if (character.buff.greased_lightning_iv > 0) {
        return 20;
    } else if (character.buff.repertoire_i > 0) {
        return 4;
    } else if (character.buff.repertoire_ii > 0) {
        return 8;
    } else if (character.buff.repertoire_iii > 0) {
        return 12;
    } else if (character.buff.repertoire_iv > 0) {
        return 16;
    } else {
        return 0;
    }
}

function typeU(character) {
    if (character.job === "blm") {
        return 100;
    }
    if (character.buff.umbral_ice_iii > 0 && (character.casting === "fire_i" || character.casting === "fire_ii" || character.casting === "fire_iii")) {
        return 50;
    } else if (character.buff.umbral_fire_iii > 0 && (character.casting === "ice_i" || character.casting === "ice_ii" || character.casting === "ice_iii")) {
        return 50;
    } else {
        return 100;
    }
}

function buff_calc(dmg, buff) {
    if (buff.the_balance > 0) {
        dmg *= 1.03;
    }
    return dmg;
}