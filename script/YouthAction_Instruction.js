import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { Page } from './Data';

export default class YouthAction_Instruction extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.355;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "youth_instruction", "sound/youth_instruction.wav"),
            "video": new Youth_Instruction_Video(this.manager, this, "video/youth_instruction.mp4"),
            "rope": new Action.ActionRope(this.manager, this),
            "ui": new Action.ActionStart(this.manager, this, "一起幫助狗狗認識指令並成功做到吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你幫助狗狗完成指令訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
    }
}
class Youth_Instruction_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "Youth_Instruction_Video";
        this.pauseTime = [0, 4, 10, 16, 26.2, 52.5, 65];
        this.isEnd = true;
        this.count = 0;
    }
    update() {
        if (this.currentTime > this.pauseTime[this.count]) {
            switch (this.count) {
                case 0:
                    gsap.to(this.container, { duration: 1, alpha: 1 });
                    break;
                case 1:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Youth_Instruction_UI_Stage1(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 2:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Youth_Instruction_UI_Stage2(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 3:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Youth_Instruction_UI_Stage3(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 4:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Youth_Instruction_UI_Stage4(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 5:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Youth_Instruction_UI_Stage5(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 6:
                    if (!this.isEnd) {
                        this.isEnd = true;
                        this.onEnd();
                    }
                    break;
            }
            this.count++;
        }

    }
}
class Youth_Instruction_UI_Stage1 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage1";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Youth_Instruction_Stage1_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/youth/instruction/stage_1_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/instruction/stage_1_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, -0.29, 0.25);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                this.action.removeChild(this.action.children.line.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Youth_Instruction_Stage1_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Bus_Stage1_Line"
        this.draw = function () {
            this.sprite.moveTo(1014, 410).bezierCurveTo(1014, 410, 1463, 451, 1275, 531);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.action.container.sortChildren();
        }
    }
}
class Youth_Instruction_UI_Stage2 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage2";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Youth_Instruction_Stage2_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/youth/instruction/stage_2_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/instruction/stage_2_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, -0.25, 0);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                this.action.removeChild(this.action.children.line.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Youth_Instruction_Stage2_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Bus_Stage1_Line"
        this.draw = function () {
            this.sprite.moveTo(1417, 395).bezierCurveTo(1417, 395, 1534, 613, 1423, 803);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.action.container.sortChildren();
        }
    }
}
class Youth_Instruction_UI_Stage3 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage3";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Youth_Instruction_Stage3_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/youth/instruction/stage_3_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/instruction/stage_3_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, 0.29, 0.29);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                this.action.removeChild(this.action.children.line.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Youth_Instruction_Stage3_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Bus_Stage1_Line"
        this.draw = function () {
            this.sprite.moveTo(1122, 509).bezierCurveTo(1122, 509, 1156, 670, 1167, 824);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.action.container.sortChildren();
        }
    }
}
class Youth_Instruction_UI_Stage4 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage4";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Youth_Instruction_Stage4_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/youth/instruction/stage_4_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/instruction/stage_4_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.36, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, 0.284, -0.18);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                this.action.removeChild(this.action.children.line.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Youth_Instruction_Stage4_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Bus_Stage1_Line"
        this.draw = function () {
            this.sprite.moveTo(1101, 431).bezierCurveTo(1101, 431, 1295, 499, 1470, 624);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.action.container.sortChildren();
        }
    }
}
class Youth_Instruction_UI_Stage5 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage5";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Youth_Instruction_Stage5_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/youth/instruction/stage_5_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/instruction/stage_5_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.37, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, 0.1, -0.3);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                this.action.removeChild(this.action.children.line.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Youth_Instruction_Stage5_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Bus_Stage1_Line"
        this.draw = function () {
            this.sprite.moveTo(1006, 418).bezierCurveTo(1006, 418, 1202, 480, 1369, 580);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.action.container.sortChildren();
        }
    }
}