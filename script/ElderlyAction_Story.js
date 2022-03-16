import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { videoData } from './Data';

export class ElderlyAction_Story1 extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.videoData = videoData.elderly[0];
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Elderly_Story_Video(this.manager, this, this.videoData.url, this.videoData.endTime),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
}
export class ElderlyAction_Story2 extends ElderlyAction_Story1 {
    constructor(manager, obj) {
        super(manager, obj);
        this.videoData = videoData.elderly[1];
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Elderly_Story_Video(this.manager, this, this.videoData.url, this.videoData.endTime),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
}
export class ElderlyAction_Story3 extends ElderlyAction_Story1 {
    constructor(manager, obj) {
        super(manager, obj);
        this.videoData = videoData.elderly[2];
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Elderly_Story_Video(this.manager, this, this.videoData.url, this.videoData.endTime),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
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