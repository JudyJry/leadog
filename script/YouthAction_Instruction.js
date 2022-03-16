import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { videoData } from './Data';

export default class YouthAction_Instruction extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.355;
        this.videoData = videoData.youth[1];
        this.videoTextures = this.manager.resources["image/video/youth/sprites.json"].spritesheet.textures;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Youth_Instruction_Video(this.manager, this, this.videoData.url),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
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
class Youth_Instruction_UI_Stage1 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage1";
        this.scale = 1;
        this.linePoint = [1014, 410, 1463, 451, 1275, 531];
        this.titleUrl = this.action.videoTextures["instruction_1_title.png"];
        this.hintUrl = this.action.videoTextures["instruction_1_hint.png"];
        this.hintPos = [-0.29, 0.25];
    }
}
class Youth_Instruction_UI_Stage2 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage2";
        this.scale = 1;
        this.linePoint = [1417, 395, 1534, 613, 1423, 803];
        this.titleUrl = this.action.videoTextures["instruction_2_title.png"];
        this.hintUrl = this.action.videoTextures["instruction_2_hint.png"];
        this.hintPos = [-0.25, 0];
    }
}
class Youth_Instruction_UI_Stage3 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage3";
        this.scale = 1;
        this.linePoint = [1122, 509, 1156, 670, 1167, 824];
        this.titleUrl = this.action.videoTextures["instruction_3_title.png"];
        this.hintUrl = this.action.videoTextures["instruction_3_hint.png"];
        this.hintPos = [0.29, 0.29];
    }
}
class Youth_Instruction_UI_Stage4 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage4";
        this.scale = 1;
        this.linePoint = [1101, 431, 1295, 499, 1470, 624];
        this.titleUrl = this.action.videoTextures["instruction_4_title.png"];
        this.hintUrl = this.action.videoTextures["instruction_4_hint.png"];
        this.hintPos = [0.284, -0.18];
    }
}
class Youth_Instruction_UI_Stage5 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Instruction_UI_Stage5";
        this.scale = 1;
        this.linePoint = [1006, 418, 1202, 480, 1369, 580];
        this.titleUrl = this.action.videoTextures["instruction_5_title.png"];
        this.hintUrl = this.action.videoTextures["instruction_5_hint.png"];
        this.hintPos = [0.1, -0.3];

    }
}