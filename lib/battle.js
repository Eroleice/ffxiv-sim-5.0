class Battle {
    constructor(setting, config) {
        this.config = config; // �趨
        this.timer = setting.sim.duration * 100; // ս��ʱ�䵹��ʱ
        this.character = new Character(setting, config); // ��ɫ
        this.cast = require(`./spell/${setting.job}.js`); // ʩ��function
        this.rotation = require(`./rotation/${setting.rotation}.js`); // ѭ���ж�function
    }

    start() {

        while (this.timer > 0) {

            // this.cast("debug", this.character);

            // ����һ���µ�tick�����ȸ���ս�����ݣ�buffʱ�䣬cdʱ�䣬gcdʱ�䣬etc...
            this.tick();

            // �ж��Ƿ���ʩ�����������
            if (this.character.cast_timer < 0 && this.character.casting !== "none") {
                this.cast(this.character.casting, this.character); // ����Ч��
                this.character.casting = "none"; // ���õ�ǰʩ��Ϊ��
            }

            // ѭ�����ȼ��ж�
            this.character.rotation.action = this.rotation.action(this.character);
            this.character.rotation.ability = this.rotation.ability(this.character);

            // ����ʹ�ü��ܾ�ʹ�ü���
            if (this.character.rotation.action !== "none" && this.character.canAction()) {
                this.cast(this.character.rotation.action, this.character);
            }
            // ����ʹ����������ʹ��������
            if (this.character.rotation.ability !== "none" && this.character.canAbility()) {
                this.cast(this.character.rotation.ability, this.character);
            }

        }


    }

    tick() {
        this.character.tick(this.timer);
        this.timer--;
    }
}

class Character {
    constructor(setting, config) {
        this.job = setting.job;
        this.hp = 10000;
        this.mp = 10000;
        this.gcd = 0;
        this.animation = 0;
        this.cast_timer = 0;
        this.casting = "none";
        this.status = setting.status;
        this.buff = {};
        this.dot = {};
        this.dot_pool = {};
        this.stance = {};
        this.special = {};
        this.cd = {};
        this.rotation = {
            "action": "none",
            "ability": "none"
        };
        this.original = setting;
        this.log = {
            "time": 0,
            "cast": [],
            "damage": []
        };
        this.config = config;
        this.initial(setting.job);
    }

    initial(job) {
        if (job === "ast") {
            this.special = [];
        }
    }

    tick() {
        for (k in this.buff) {
            this.buff.k--;
        }
        for (k in this.dot) {
            this.dot.k--;
        }
        for (k in this.cd) {
            this.cd.k--;
        }
        this.status.ap = this.original.status.ap;
        if (this.buff.potion > 0) {
            this.status.ap += 339;
        }
        this.log.time++;
        this.gcd--;
        this.animation--;
        this.cast_timer--;
    }

    canAction() {
        if (this.gcd < 0 && this.animation < 0 && this.cast_timer < 0) {
            return true;
        } else {
            return false;
        }
    }

    canAbility() {
        if (this.animation < 0 && this.cast_timer < 0) {
            return true;
        } else {
            return false;
        }
    }

    debug() {
        console.log(this.hp);
    }
}

module.exports = Battle;