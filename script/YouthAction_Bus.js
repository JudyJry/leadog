import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { videoData } from './Data';

export default class YouthAction_Bus extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.355;
        this.videoData = videoData.youth[0];
        this.videoTextures = this.manager.resources["image/video/youth/sprites.json"].spritesheet.textures;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Youth_Bus_Video(this.manager, this, this.videoData.url),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
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
        this.titleUrl = this.action.videoTextures["bus_1_title.png"];
        this.hintUrl = this.action.videoTextures["bus_1_hint.png"];
        this.hintPos = [0.284, 0.397];

    }
}