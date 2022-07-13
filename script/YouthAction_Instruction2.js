import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { videoData } from './Data';

export default class YouthAction_Instruction2 extends Action.ActionPage {
    constructor(manager, obj, scale = 0.355) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = scale;
        this.videoData = videoData.youth[2];
        this.videoTextures = this.manager.resources["image/video/youth/sprites.json"].spritesheet.textures;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Youth_Instruction2_Video(this.manager, this, this.videoData.url),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
}
class Youth_Instruction2_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "Youth_Instruction2_Video";
        this.pauseTime = [0, 10.5, 27, 29];
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
        this.titleUrl = this.action.videoTextures["instruction2_1_title.png"];
        this.hintUrl = this.action.videoTextures["instruction2_1_hint.png"];
        this.hintPos = [-0.3, 0];
    }
}
class Youth_Instruction2_UI_Stage2 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction2_UI_Stage2";
        this.scale = 1;
        this.linePoint = [671, 619, 444, 535, 344, 718];
        this.titleUrl = this.action.videoTextures["instruction2_2_title.png"];
        this.hintUrl = this.action.videoTextures["instruction2_2_hint.png"];
        this.hintPos = [0.3, 0.35];

    }
}