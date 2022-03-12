import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { Page } from './Data';

export default class YouthAction_Instruction2 extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.355;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "youth_instruction2", "sound/youth_instruction2.wav"),
            "video": new Youth_Instruction2_Video(this.manager, this, "video/youth_instruction2.mp4"),
            "rope": new Action.ActionRope(this.manager, this),
            "ui": new Action.ActionStart(this.manager, this, "一起幫助狗狗與訓練師習慣人類生活步調吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
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
}
class Youth_Instruction2_UI_Stage1 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_UI_Stage1";
        this.scale = 1;
        this.linePoint = [886, 442, 743, 527, 1057, 571];
        this.titleUrl = "image/video/youth/instruction2/stage_1_title.png";
        this.hintUrl = "image/video/youth/instruction2/stage_1_hint.png";
        this.hintPos = [-0.3, 0];
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
}
class Youth_Instruction2_UI_Stage2 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_UI_Stage2";
        this.scale = 1;
        this.linePoint = [671, 619, 444, 535, 344, 718];
        this.titleUrl = "image/video/youth/instruction2/stage_2_title.png";
        this.hintUrl = "image/video/youth/instruction2/stage_2_hint.png";
        this.hintPos = [0.3, 0.35];
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
}