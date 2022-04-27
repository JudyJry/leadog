import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { videoData } from './Data';

export class BornAction_Story1 extends Action.ActionPage {
    constructor(manager, obj, scale = 0.44) {
        super(manager, obj);
        this.name = "BornAction_Story1";
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = scale;
        this.videoData = videoData.born[0];
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Born_Story_Video(this.manager, this, this.videoData.url, this.videoData.endTime),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
}
export class BornAction_Story2 extends BornAction_Story1 {
    constructor(manager, obj, scale = 0.44) {
        super(manager, obj, scale);
        this.videoData = videoData.born[1];
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Born_Story_Video(this.manager, this, this.videoData.url, this.videoData.endTime),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
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