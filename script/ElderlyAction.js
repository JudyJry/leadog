import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { videoData } from './Data';
import { createSprite } from './GameFunction';

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
export class ElderlyAction_Hair extends Action.ActionPage {
    constructor(manager, obj) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = 0.256;
        this.videoData = videoData.elderly[3];
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Elderly_Hair_Video(this.manager, this, this.videoData.url),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText, "image/video/elderly/elderly_video_sprites.json"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
    clickEvent() {
        if (this.isNotStart) {
            this.isNotStart = false;
            gsap.to(this.container, {
                duration: 1, alpha: 0, onComplete: function () {
                    this.action.removeChild(this.container);
                    this.action.children.video.isStart = true;
                    this.action.children.video.play();
                    this.action.removeChild(this.action.children.video.bg);
                    this.action.children.video.drawBg();
                    this.action.obj.playButton.texture =
                        this.manager.resources["image/video/elderly/elderly_video_sprites.json"].spritesheet.textures["pause.png"];
                }.bind(this)
            });
        }
    }
}
class Elderly_Hair_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "Elderly_Hair_Video";
        this.pauseTime = [0, 3, 8.6, 24.6, 43];
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
                    this.action.children.ui = new Elderly_Hair_UI_Stage(this.manager, this.action, 1);
                    this.action.children.ui.setup();
                    break;
                case 2:
                    console.log(this.currentTime);
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Elderly_Hair_UI_Stage(this.manager, this.action, 2);
                    this.action.children.ui.setup();
                    break;
                case 3:
                    console.log(this.currentTime);
                    this.action.isPlayGame = true;
                    this.onPlayGame();
                    this.action.children.ui = new Elderly_Hair_UI_Stage(this.manager, this.action, 3);
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
class Elderly_Hair_UI_Stage extends Action.ActionUI {
    constructor(manager, action, count) {
        super(manager, action);
        this.name = "Elderly_Hair_UI_Stage";
        this.scale = 1;
        this.choose = ["毛巾", "馬刷", "排梳"];
        this.count = count;
        this.time = [3.334, 8.867, 24.867];
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.countdown.setup();
            const textures = this.manager.resources["image/video/elderly/elderly_video_sprites.json"].spritesheet.textures;
            let title = createSprite(textures[`title_${this.count}.png`], [1, 0.5], this.scale);
            let hint = createSprite(textures[`hint_${this.count}.png`], 0.5, this.scale);
            let button_1 = createSprite(textures["button_1.png"], 0.5, this.scale);
            let button_2 = createSprite(textures["button_2.png"], 0.5, this.scale);
            let button_3 = createSprite(textures["button_3.png"], 0.5, this.scale);

            title.position.set((0.5 * this.w) - 150, (-0.5 * this.h) + 95);

            this.setPosition(hint, -0.284, -0.4);

            button_1.name = this.choose[0];
            this.setPosition(button_1, 0.4, -0.1);

            button_2.name = this.choose[1];
            this.setPosition(button_2, 0.1, 0.4);

            button_3.name = this.choose[2];
            this.setPosition(button_3, -0.35, -0.2);

            this.setInteract(button_1);
            this.setInteract(button_2);
            this.setInteract(button_3);

            this.container.addChild(title, hint, button_1, button_2, button_3);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    clickEvent(e) {
        if (e.name === this.choose[this.count - 1]) {
            this.onClearGame();
            this.action.children.video.onClearGame();
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                this.action.children.video.currentTime = this.time[this.count - 1];
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.manager.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}