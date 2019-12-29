class Battle {
    constructor(setting, config) {
        this.config = config; // 设定
        this.timer = setting.sim.duration * 100; // 战斗时间倒计时
        this.character = new Character(setting, config); // 角色
        this.cast = require(`./spell/${setting.job}.js`); // 施法function
        this.rotation = require(`./rotation/${setting.rotation}.js`); // 循环判定function
    }

    start() {

        while (this.timer > 0) {

            // this.cast("debug", this.character);

            // 进入一个新的tick，首先更新战斗数据，buff时间，cd时间，gcd时间，etc...
            this.tick();

            // 判定是否有施法结束的情况
            if (this.character.cast_timer < 0 && this.character.casting !== "none") {
                this.cast(this.character.casting, this.character); // 法术效果
                this.character.casting = "none"; // 重置当前施法为空
            }

            // 循环优先级判定
            this.character.rotation.action = this.rotation.action(this.character);
            this.character.rotation.ability = this.rotation.ability(this.character);

            // 可以使用技能就使用技能
            if (this.character.rotation.action !== "none" && this.character.canAction()) {
                this.cast(this.character.rotation.action, this.character);
            }
            // 可以使用能力技就使用能力技
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