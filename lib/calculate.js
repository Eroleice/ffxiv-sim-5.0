/**
 * [https://bbs.nga.cn/read.php?tid=19736925]
 * [���˷���][������ʽԤ��]��γ�Ϊ��֮��ѧ�� ��3��
 * by Brecruiser
 * ��ʽ�е�<>��������ȡ��
 * ��ʽ�е�+<>+��������ȡ��
 */

module.exports = {
    "dmg_calc": function (pot, character, force_crit = false, force_dh = false) {
        // D1 = < �������� �� f(������) �� f(����) > /100 > /1000 >
        let D1 = Math.floor(Math.floor(Math.floor(pot * attack_damage_calc(character) * determination_calc(character)) / 100) / 1000);
        // D2 = < D1 �� f(����) > /1000 > �� f(����) > /100 > �� ְҵ���� > /100 >
        let D2 = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(D1 * tenacity_calc(character)) / 1000) * weapon_damage_calc(character)) / 100) * TRAIT[character.job]) / 100);
        //D3 = < D2 �� ����? > /1000 > �� ֱ��? > /100 >
        let crit_c = false;
        let dh_c = false;
        let crit_m = 1000;
        let dh_m = 100;
        if (character.config.expect_mode) {
            // ����ֵģʽ�±�����ֱ��������ֵ����
            if (force_crit) {
                crit_m = critical_calc(character); // �ض�����
                crit_c = true;
            } else {
                let c_p = Math.floor(200 * (character.status.crt - SUB) / DIV + 50) / 1000;
                crit_m = c_p * critical_calc(character) + (1 - c_p) * 1000;
            }
            if (force_dh) {
                dh_m = 125; // �ض�ֱ��
                dh_c = true;
            } else {
                let dh_p = Math.floor(550 * (character.status.dh - SUB) / DIV) / 1000;
                dh_m = dh_p * 125 + (1 - dh_p) * 100;
            }
        } else {
            // ������ֵģʽ�±�����ֱ����������ж�
            if (force_crit) {
                crit_m = critical_calc(character); // �ض�����
                crit_c = true;
            } else {
                crit_c = crt_check(character);
                crit_m = (crit_c) ? critical_calc(character) : 1000;
            }
            if (force_dh) {
                dh_m = 125; // �ض�ֱ��
                dh_c = true;
            } else {
                dh_c = dh_check(character);
                dh_m = (dh_c) ? 125 : 100;
            }
        }
        let D3 = Math.floor(Math.floor(Math.floor(Math.floor(D2 * crit_m) / 1000) * dh_m) / 100);
        // �˺� = < D3 �� rand[95,105] > /100 > �� buff_1 > �� buff_2 >
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
        // GCD1 = < ( 2000 - f(�ٶ�) ) �� ���ܸ��� / 1000 > >[1]
        let GCD1 = Math.floor((2000 - ss_m) * cast_time / 1000);
        // GCD2 = < ( 100 - Type Y ) �� ( 100 - Haste ) / 100 >
        // HasteӦ����ָ������С��Ůbuff���Լ���������»�õļ���buff��dpsģ�ⲻ�漰
        let GCD2 = Math.floor(100 - typeY(character) / 100);
        // GCD3 = ( 100 - Type Z ) / 100
        let GCD3 = (100 - typeZ(character)) / 100;
        // GCD4 = < +< GCD2 �� GCD3 >+ �� GCD1 / 100 > �� Astral_Umbral / 100 >
        let GCD4 = Math.floor(Math.floor(Math.ceil(GCD2 * GCD3) * GCD1) * typeU(character) / 100);
        // GCD���� = GCD4 / 100
        return GCD4 / 1000;
        // ���ص�λ��0.01�룬����gcd��250
    }
};

const MAIN = 340;
const DIV = 3300;
const SUB = 380;

// ְҵattributeϵ���ο�[https://bbs.nga.cn/read.php?tid=19149842] by botpig
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

// ְҵ����
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
    // p(����)= < 200 �� ( ���� - Level{Lv}{SUB})/ Level{Lv}{DIV} + 50 > / 10
    let p = Math.floor(200 * (character.status.crt - SUB) / DIV + 50) / 1000;
    let r = Math.random();
    if (r > p) {
        return false;
    } else {
        return true;
    }
}

function dh_check(character) {
    // p(ֱ��)= < 550 �� ( ֱ�� - Level{Lv}{SUB})/ Level{Lv}{DIV} > / 10
    let p = Math.floor(550 * (character.status.dh - SUB) / DIV) / 1000;
    let r = Math.random();
    if (r > p) {
        return false;
    } else {
        return true;
    }
}

function weapon_damage_calc(character) {
    // f(����) = < ( Level{Lv}{MAIN} �� Job{Job}{Attribute} / 1000 ) + WD >
    return Math.floor(MAIN * ATT[character.job] / 1000 + character.status.wd);
}

function attack_damage_calc(character) {
    if (character.job === "pld" || character.job === "war" || character.job === "drk" || character.job === "gbr") {
        // f(������) = < 115 �� ( ������ - Level{Lv}{MAIN} ) / Level{Lv}{MAIN} > + 100
        return Math.floor(115 * (character.status.ap - MAIN) / MAIN) + 100;
    } else {
        // f(������) = < 165 �� ( ������ - Level{Lv}{MAIN} ) / Level{Lv}{MAIN} > + 100
        return Math.floor(165 * (character.status.ap - MAIN) / MAIN) + 100;
    }  
}

function determination_calc(character) {
    // f(����) = < 130 �� (���� - Level{ Lv } { MAIN } ) / Level{Lv}{DIV} + 1000 >
    return Math.floor(130 * (character.status.det - MAIN) / DIV + 1000);
}

function tenacity_calc(character) {
    if (character.job === "pld" || character.job === "war" || character.job === "drk" || character.job === "gbr") {
        // f(����) = < 100 �� (���� - Level{ Lv } { SUB } ) / Level{Lv}{DIV} + 1000 >
        return Math.floor(100 * (character.status.ten - SUB) / DIV + 1000);
    } else {
        // ��̹��ְҵ�޷���ü��ͼӳ�
        return 1000;
    }
}

function speed_calc(character) {
    // f(�ٶ�) = < 130 �� ( �ٶ� - Level{Lv}{SUB} )/ Level{Lv}{DIV} + 1000 >
    return Math.floor(130 * (character.status.ss - SUB) / DIV + 1000);
}

function critical_calc(character) {
    // f(����) = < 200 �� ( ���� - Level{Lv}{SUB} )/ Level{Lv}{DIV} + 1400 >
    return Math.floor(200 * (character.status.crt - SUB) / DIV + 1400);
}

function auto_calc(character) {
    // f(ƽA) = < ( < Level{Lv}{MAIN} �� Job{Job}{Attribute} / 1000 ) + �������� > �� ( ������� / 3 ) >
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