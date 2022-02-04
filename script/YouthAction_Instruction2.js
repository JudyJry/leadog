import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import YouthObject from './YouthObject';

export default class YouthAction_Instruction2 extends Action.ActionPage {
    constructor(manager) {
        super(manager);
        this.name = "YouthAction";
        this.offset = 50;
        this.isPlayGame = false;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "youth_instruction2", "sound/youth_instruction2.wav"),
            "video": new Youth_Instruction2_Video(this.manager, this, "video/youth_instruction2.mp4"),
            "rope": new Action.ActionRope(this.manager, this),
            "ui": new Youth_Instruction2_UI_Start(this.manager, this),
            "logo": new Action.LogoVideo(this.manager, this)
        }
    }
}
class Youth_Instruction2_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "Youth_Instruction2_Video";
        this.pauseTime = [0, 9.5, 26.5, 29];
        this.isEnd = true;
        this.count = 0;
        this.scale = 0.5;
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
                    this.action.children.ui = new Youth_Instruction2_UI_Stage1(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 2:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Youth_Instruction2_UI_Stage2(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 3:
                    if (!this.isEnd) {
                        this.isEnd = true;
                        this.onEnd();
                    }
                    break;
            }
            this.count++;
        }

    }
    onEnd() {
        this.drawBg("white");
        gsap.to(this.bg, {
            duration: 3, alpha: 1, onComplete: function () {
                this.action.children.ui = new Youth_Instruction2_UI_End(this.manager, this.action);
                this.action.children.ui.setup();
                this.action.children.ui.end();
                this.videoCrol.ontimeupdate = undefined;
                this.pause();
                this.videoCrol.currentTime = 0;
            }.bind(this)
        });
    }
}
class Youth_Instruction2_UI_Start extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_UI_Start";
        this.isNotStart = true;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/video/know.png");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.setPosition(this.sprite, 0, 0.3);
            this.sprite.alpha = 0;

            let textTitle = new PIXI.Text("任務目標", this.ts);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text("一起幫助狗狗與訓練師習慣人類生活步調吧！", this.tsm);
            textDescribe.anchor.set(0.5);
            this.setPosition(textDescribe, 0, 0);

            this.container.addChild(textTitle, textDescribe, this.sprite);
            this.container.alpha = 0;
        }
    }
    start() {
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 }, 1);
        tl.to(this.sprite, {
            duration: 1, alpha: 1,
            onComplete: function () { this.setInteract(this.sprite); }.bind(this)
        }, "+=0.5");
    }
    clickEvent() {
        if (this.isNotStart) {
            this.isNotStart = false;
            gsap.to(this.container, {
                duration: 1, alpha: 0, onComplete: function () {
                    this.manager.removeChild(this.container);
                    this.action.children.video.isStart = true;
                    this.action.children.video.play();
                }.bind(this)
            });
        }
    }
    update() {
        if (this.sprite.isPointerOver) {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
}
class Youth_Instruction2_UI_Stage1 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_UI_Stage1";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Youth_Instruction2_Stage1_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/youth/instruction2/stage_1_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/instruction2/stage_1_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, -0.3, 0);

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
                this.manager.removeChild(this.container);
                this.manager.removeChild(this.action.children.line.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.manager.removeChild(this.countdown.container);
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
class Youth_Instruction2_Stage1_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_Stage1_Line"
        this.draw = function () {
            this.sprite.moveTo(886, 442).bezierCurveTo(886, 442, 743, 527, 1057, 571);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.manager.app.stage.sortChildren();
        }
    }
}
class Youth_Instruction2_UI_Stage2 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_UI_Stage2";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Youth_Instruction2_Stage2_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/youth/instruction2/stage_2_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/instruction2/stage_2_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.34, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, 0.3, 0.35);

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
                this.manager.removeChild(this.container);
                this.manager.removeChild(this.action.children.line.container);
                this.manager.removeChild(this.action.children.rope.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.rope;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.manager.removeChild(this.countdown.container);
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
class Youth_Instruction2_Stage2_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_Stage2_Line"
        this.draw = function () {
            this.sprite.moveTo(671, 619).bezierCurveTo(671, 619, 444, 535, 344, 718);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.manager.app.stage.sortChildren();
        }
    }
}
class Youth_Instruction2_UI_End extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_UI_End";
        this.isNotStart = true;
        this.draw = function () {
            let textTitle = new PIXI.Text("任務完成", this.ts);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text(
                `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
                this.tsm);
            textDescribe.anchor.set(0.5);
            this.setPosition(textDescribe, 0, 0);

            this.container.addChild(textTitle, textDescribe);
            this.container.alpha = 0;
        }
    }
    draw2() {
        this.sprite.texture = PIXI.Texture.from("image/TGDAlogo.png");
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(1.5);
        this.setPosition(this.sprite, -0.018, -0.012);

        this.container.removeChildren();
        let text1 = new PIXI.Text("感謝", this.tsm);
        text1.anchor.set(0.5);
        this.setPosition(text1, -0.156, 0);
        let text2 = new PIXI.Text("協助拍攝", this.tsm);
        text2.anchor.set(0.5);
        this.setPosition(text2, 0.146, 0);
        this.container.addChild(text1, text2, this.sprite);
        this.container.alpha = 0;
    }
    end() {
        this.action.children.sound.isEnd = true;
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.draw2();
            }.bind(this)
        }, "+=2");
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.manager.removeChild(this.container);
                delete this.action.children.ui;
                this.manager.loadPage(new YouthObject(this.manager));
            }.bind(this)
        }, "+=2");
    }
}