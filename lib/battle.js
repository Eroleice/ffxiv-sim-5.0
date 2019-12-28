const deepcopy = require('deepcopy');

class Battle {
    constructor(setting, config) {
        this.config = config; // 设定
        this.timer = setting.sim.duration * 100; // 战斗时间倒计时
        this.character = new Character(setting, config); // 角色
        this.cast = require('./spell/' + setting.job + '.js'); // 施法function
        this.rotation = require('./rotation/' + setting.rotation + '.js'); // 循环判定function
    }

    start() {
        
        while (this.timer > 0) {

            this.cast("debug", this.character);

            // 进入一个新的tick，首先更新战斗数据，buff时间，cd时间，gcd时间，etc...
            tick();

            // 判定是否有施法结束的情况
            if (this.character.cast_timer <= 0 && this.character.casting !== "") {
                continue; // 如果角色仍在施法，直接进入下一tick
            } else {
                // 当前施法结束
                this.cast(this.character.casting, this.character); // 法术效果
                this.character.casting = ""; // 重置当前施法为空
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