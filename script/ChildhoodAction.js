import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { createSprite } from './GameFunction';
import { videoData } from './Data';

export class ChildhoodAction_Kelly extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.videoData = videoData.childhood[0];
        this.videoTextures = this.manager.resources["image/video/childhood/sprites.json"].spritesheet.textures;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Childhood_Kelly_Video(this.manager, this, this.videoData.url),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
}
class Childhood_Kelly_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "Childhood_Kelly_Video";
        this.pauseTime = [0, 9.8, 29.266, 49.533, 57];
        this.isEnd = true;
        this.count = 0;
    }
    update() {
        if (this.currentTime > this.pauseTime[this.count]) {
            switch (this.count) {
                case 0:
                    this.container.alpha = 1;
                    break;
                case 1:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Childhood_Kelly_UI_Stage1(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 2:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Childhood_Kelly_UI_Stage2(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 3:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Childhood_Kelly_UI_Stage3(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 4:
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
class Childhood_Kelly_UI_Stage1 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Childhood_Kelly_UI_Stage1";
        this.scale = 1;
        this.linePoint = [1109, 365, 1196, 446, 1217, 552];
        this.titleUrl = this.action.videoTextures["kelly_1_title.png"];
        this.hintUrl = this.action.videoTextures["kelly_1_hint.png"];
        this.hintPos = [-0.25, 0.05];
    }
}
class Childhood_Kelly_UI_Stage2 extends Action.ActionButtonStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Childhood_Kelly_UI_Stage2";
        this.scale = 1;
        this.titleUrl = this.action.videoTextures["kelly_2_title.png"];
        this.hintUrl = this.action.videoTextures["kelly_2_hint.png"];
        this.hintPos = [-0.25, -0.1];
        this.draw = function () {
            this.button = new Childhood_Kelly_Stage2_Button(manager, action, this);
            this.button.setup();
            this.drawStage();
        }
    }
}
class Childhood_Kelly_Stage2_Button extends Action.ActionUI {
    constructor(manager, action, stage) {
        super(manager, action);
        this.stage = stage;
        this.name = "Childhood_Kelly_Stage2_Button";
        this.count = 0;
        this.draw = function () {
            const textures = this.manager.resources["image/video/actionUI_sprites.json"].spritesheet.textures;
            this.sprite.texture = textures["space.png"];
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);

            this.bar = createSprite(textures["bar.png"], 0.5, 0.7);
            this.fullbar = createSprite(textures["bar_full.png"], 0.5, 0.7);
            this.mask = new PIXI.Graphics();
            this.fullbar.mask = this.mask;

            this.bg = createSprite("image/video/childhood/Kelly_2_img.jpg");
            this.bg.alpha = 0;
            this.action.children.video.container.addChildAt(this.bg, 1);

            this.container.addChild(this.bar, this.fullbar, this.sprite);
            this.setPosition(this.sprite, 0, 0.32);
            this.setPosition(this.bar, 0, 0.18);
            this.setPosition(this.fullbar, 0, 0.18);
            this.setInteract(this.sprite);

            this.barGsap = gsap.timeline()
                .to(this.bg, { duration: 0.1, alpha: 1, ease: "steps(1)" })
                .to([this.bar, this.fullbar], { duration: 0.1, x: -5 }, "<")
                .to([this.bar, this.fullbar], { duration: 0.1, x: 5 })
                .to([this.bar, this.fullbar], { duration: 0.1, x: 0 })
                .to(this.bg, { duration: 0.1, alpha: 0, ease: "steps(1)" }, "<");
            this.barGsap.pause();
        }
    }
    clickEvent() {
        this.count += 20;
        this.barGsap.play(0.001);
    }
    maskUpdate() {
        let b = this.fullbar.getBounds();
        let progress = (b.width / 100) * this.count;
        this.mask.clear();
        this.mask.drawRect(b.x, b.y, progress, b.height);
    }
    onClearGame() {
        this.action.removeChild(this.container);
        this.action.children.video.container.removeChild(this.bg);
    }
    update() {
        if (this.action.isPlayGame) {
            if (this.count > 100) {
                this.action.isPlayGame = false;
                this.action.children.video.onClearGame();
                this.barGsap.kill();
                this.onClearGame();
                this.stage.onClearGame();
            } else if (this.count > 0) { this.count--; this.maskUpdate(); }
        }
    }
}
class Childhood_Kelly_UI_Stage3 extends Action.ActionButtonStage {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Childhood_Kelly_UI_Stage3";
        this.scale = 1;
        this.titleUrl = this.action.videoTextures["kelly_3_title.png"];
        this.hintUrl = this.action.videoTextures["kelly_3_hint.png"];
        this.hintPos = [0.27, -0.2];
        this.draw = function () {
            this.button = new Childhood_Kelly_Stage3_Button(manager, action, this);
            this.button.setup();
            this.drawStage();
        }
    }
}
class Childhood_Kelly_Stage3_Button extends Action.ActionUI {
    constructor(manager, action, stage) {
        super(manager, action);
        this.stage = stage;
        this.name = "Childhood_Kelly_Stage3_Button";
        this.times = 0;
        this.draw = function () {
            const textures = this.manager.resources["image/video/actionUI_sprites.json"].spritesheet.textures;
            this.spriteSheet = [
                textures["wait.png"],
                textures["ok.png"]
            ];
            this.sprite.texture = this.spriteSheet[0];
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.container.addChild(this.sprite);
            this.setPosition(this.sprite, -0.3, 0.1);
            setTimeout(this.wait.bind(this), 1500);
        }
    }
    onClearGame() {
        this.action.removeChild(this.container);
    }
    clickEvent() {
        if (this.action.isPlayGame) {
            this.action.isPlayGame = false;
            this.onClearGame();
            this.action.children.video.onClearGame();
            this.stage.onClearGame();
        }
    }
    wait() {
        this.sprite.texture = this.spriteSheet[1];
        this.setInteract(this.sprite);
    }
}

export class ChildhoodAction_Dora extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.44;
        this.videoData = videoData.childhood[1];
        this.videoTextures = this.manager.resources["image/video/childhood/sprites.json"].spritesheet.textures;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Childhood_Dora_Video(this.manager, this, this.videoData.url),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
}
class Childhood_Dora_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.pauseTime = [0, 4.1, 36.8, 54.8, 85.532, 94];
        this.isEnd = true;
        this.count = 0;
    }
    update() {
        if (this.currentTime > this.pauseTime[this.count]) {
            switch (this.count) {
                case 0:
                    this.container.alpha = 1;
                    break;
                case 1:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Childhood_Dora_UI_Stage1(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 2:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Childhood_Dora_UI_Stage2(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 3:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Childhood_Dora_UI_Stage3(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 4:
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Childhood_Dora_UI_Stage4(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 5:
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
class Childhood_Dora_UI_Stage1 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.scale = 1;
        this.linePoint = [1218, 669, 1330, 761, 1341, 899];
        this.titleUrl = this.action.videoTextures["dora_1_title.png"];
        this.hintUrl = this.action.videoTextures["dora_1_hint.png"];
        this.hintPos = [-0.25, 0.35];
    }
}
class Childhood_Dora_UI_Stage2 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.scale = 1;
        this.linePoint = [487, 886, 555, 763, 635, 695];
        this.titleUrl = this.action.videoTextures["dora_2_title.png"];
        this.hintUrl = this.action.videoTextures["dora_2_hint.png"];
        this.hintPos = [0.25, 0.35];
    }
}
class Childhood_Dora_UI_Stage3 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.scale = 1;
        this.linePoint = [665, 545, 561, 638, 497, 787];
        this.titleUrl = this.action.videoTextures["dora_3_title.png"];
        this.hintUrl = this.action.videoTextures["dora_3_hint.png"];
        this.hintPos = [-0.2, 0.38];
    }
}
class Childhood_Dora_UI_Stage4 extends Action.ActionLinsStage {
    constructor(manager, action) {
        super(manager, action);
        this.scale = 1;
        this.linePoint = [1078, 643, 1116, 789, 1147, 925];
        this.titleUrl = this.action.videoTextures["dora_4_title.png"];
        this.hintUrl = this.action.videoTextures["dora_4_hint.png"];
        this.hintPos = [-0.32, 0];
    }
}