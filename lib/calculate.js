module.exports = {
    "dmg_calc": function (pot, character) {
        // D1 = < �������� �� f(������) �� f(����) > /100 > /1000 >
        let D1 = Math.floor(Math.floor(Math.floor(pot * weapon_damage_calc(character) * determination_calc(character)) / 100) / 1000);
        // D2 = < D1 �� f(����) > /1000 > �� f(����) > /100 > �� ְҵ���� > /100 >
        let D2 = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(D1 * tenacity_calc(character)) / 1000) * weapon_damage_calc(character)) / 100) * TRAIT[character.job]) / 100);
        //D3 = < D2 �� ����? > /1000 > �� ֱ��? > /100 >
        let D3 = Math.floor(Math.floor(D2 * (Math.random() * 10 + 95)) / 100);
        let crit_c = false;
        let dh_c = false;
        let crit_m = 1000;
        let dh_m = 100;
        if (charact.expect_mode) {
            // ����ֵģʽ�±�����ֱ��������ֵ����
            let c_p = Math.floor(200 * (character.status.crt - SUB) / DIV + 50) / 1000;
            let dh_p = Math.floor(550 * (character.status.dh - SUB) / DIV) / 1000;
            crit_m = c_p * critical_calc(character) + (1 - c_p) * 1000;
            dh_m = dh_p * 125 + (1 - dh_p) * 100;
        } else {
            // ������ֵģʽ�±�����ֱ����������ж�
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

// ְҵattributeϵ���ο�[https://bbs.nga.cn/read.php?tid=19149842] by botpig
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

// ְҵ����
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
    if (character.job === 'pld' || character.job === 'war' || character.job === 'drk' || character.job === 'gbr') {
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
    if (character.job === 'pld' || character.job === 'war' || character.job === 'drk' || character.job === 'gbr') {
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
    // f(����) = < 2000 �� ( ���� - Level{Lv}{SUB} )/ Level{Lv}{DIV} + 1400 >
    return Math.floor(2000 * (character.status.crt - SUB) / DIV + 1400);
}

function auto_calc(character) {
    // f(ƽA) = < ( < Level{Lv}{MAIN} �� Job{Job}{Attribute} / 1000 ) + �������� > �� ( ������� / 3 ) >
    return Math.floor(Math.floor(MAIN * ATT[character.job] / 1000 + character.status.wd) * character.status.delay / 3);
}

/**
 * https://bbs.nga.cn/read.php?tid=19736925
 * [���˷���][������ʽԤ��]��γ�Ϊ��֮��ѧ�� ��3��
 * by Brecruiser
 * ��ʽ�е�<>��������ȡ��
 * ��ʽ�е�+<>+��������ȡ��
 */
