import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";

export class BornAction_Story1 extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.name = "BornAction_Story1";
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "born_story", "sound/born_story.mp3", 0),
            "video": new Born_Story_Video(this.manager, this, "video/born_story1.mp4", 46), //46
            "ui": new Action.ActionStart(this.manager, this, "來聽聽剛出生的寶寶都在做什麼吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你聆聽剛出生的狗狗的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
    }
}
export class BornAction_Story2 extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.name = "BornAction_Story2";
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "born_story", "sound/born_story.mp3", 0),
            "video": new Born_Story_Video(this.manager, this, "video/born_story2.mp4", 30),  //30
            "ui": new Action.ActionStart(this.manager, this, "來聽聽剛出生的寶寶都在做什麼吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this,
            `謝謝你聆聽剛出生的狗狗的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
    }
}
class Born_Story_Video extends Action.ActionVideo {
    constructor(manager, action, url, end) {
        super(manager, action, url);
        this.name = "Born_Story_Video";
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
    onEnd() {
        this.drawBg("white");
        gsap.to(this.bg, {
            duration: 3, alpha: 1, onComplete: function () {
                this.action.children.ui = this.action.end;
                this.action.children.ui.setup();
                this.action.children.ui.end();
                this.videoCrol.ontimeupdate = undefined;
                this.pause();
                this.videoCrol.currentTime = 0;
            }.bind(this)
        });
    }
}