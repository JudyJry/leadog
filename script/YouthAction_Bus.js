import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";

export default class YouthAction_Bus extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.355;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "youth_bus", "sound/youth_bus.wav"),
            "video": new Youth_Bus_Video(this.manager, this, "video/youth_bus.mp4"),
            "rope": new Action.ActionRope(this.manager, this),
            "ui": new Action.ActionStart(this.manager, this, "一起幫助狗狗與訓練師習慣人類生活步調吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
    }
}
class Youth_Bus_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "Youth_Bus_Video";
        this.pauseTime = [0, 16.5, 45];
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
                    this.action.children.ui = new Youth_Bus_UI_Stage1(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 2:
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
class Youth_Bus_UI_Stage1 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.scale = 1;
        this.linePoint = [1527, 601, 1656, 533, 1792, 510];
        this.titleUrl = "image/video/youth/bus/stage_1_title.png";
        this.hintUrl = "image/video/youth/bus/stage_1_hint.png";
        this.hintPos = [0.284, 0.397];
        this.isLast = true;
    }
}