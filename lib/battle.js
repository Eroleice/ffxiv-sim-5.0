const deepcopy = require('deepcopy');

class Battle {
    constructor(setting, config) {
        this.config = config; // �趨
        this.timer = setting.sim.duration * 100; // ս��ʱ�䵹��ʱ
        this.character = new Character(setting, config); // ��ɫ
        this.cast = require('./spell/' + setting.job + '.js'); // ʩ��function
        this.rotation = require('./rotation/' + setting.rotation + '.js'); // ѭ���ж�function
    }

    start() {
        
        while (this.timer > 0) {

            this.cast("debug", this.character);

            // ����һ���µ�tick�����ȸ���ս�����ݣ�buffʱ�䣬cdʱ�䣬gcdʱ�䣬etc...
            tick();

            // �ж��Ƿ���ʩ�����������
            if (this.character.cast_timer <= 0 && this.character.casting !== "") {
                continue; // �����ɫ����ʩ����ֱ�ӽ�����һtick
            } else {
                // ��ǰʩ������
                this.cast(this.character.casting, this.character); // ����Ч��
                this.character.casting = ""; // ���õ�ǰʩ��Ϊ��
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
        this.hp = 10000;
        this.mp = 10000;
        this.gcd = 0;
        this.animation = 0;
        this.cast_timer = 0;
        this.casting = "";
        this.status = deepcopy(setting.status);
        this.buff = {};
        this.dot = {};
        this.dot_pool = {};
        this.stance = {};
        this.special = {};
        this.cd = {};
        this.next_spell = "none";
        this.original = deepcopy(setting);
        this.log = {
            "spell": {};
        };
        this.force_crt = false;
        this.force_dh = false;
        this.expect_mode = config.expect_mode;
        this.initial(setting.job);
    }

    initial(job) {
        if (job === "ast") {
            this.special = [];
        }
    }

    tick(timer) {
        for (k in this.buff) {
            this.buff.k--;
        }
        for (k in this.dot) {
            this.dot.k--;
        }
        for (k in this.cd) {
            this.cd.k--;
        }
    }

    debug() {
        console.log(this.hp);
    }
}

module.exports = Battle;