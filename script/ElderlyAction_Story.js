import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";

export class ElderlyAction_Story1 extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.name = "ElderlyAction_Story1";
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "elderly_story1", "sound/elderly_story1.wav"),
            "video": new Elderly_Story_Video(this.manager, this, "video/elderly_story1.mp4", 178),
            "ui": new Action.ActionStart(this.manager, this, "一起看看狗狗與收養家庭的故事吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
    }
}
export class ElderlyAction_Story2 extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.name = "ElderlyAction_Story2";
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "elderly_story2", "sound/elderly_story2.mp3"),
            "video": new Elderly_Story_Video(this.manager, this, "video/elderly_story2.mp4", 137),
            "ui": new Action.ActionStart(this.manager, this, "一起看看狗狗與收養家庭的故事吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
    }
}
export class ElderlyAction_Story3 extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.name = "ElderlyAction_Story3";
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "elderly_story3", "sound/elderly_story3.wav"),
            "video": new Elderly_Story_Video(this.manager, this, "video/elderly_story3.mp4", 116),
            "ui": new Action.ActionStart(this.manager, this, "一起看看狗狗與收養家庭的故事吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
    }
}
class Elderly_Story_Video extends Action.ActionVideo {
    constructor(manager, action, url, end) {
        super(manager, action, url);
        this.name = "Elderly_Story_Video";
        this.pauseTime = [0, end];
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