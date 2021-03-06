import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { createSprite } from './GameFunction';
import { videoData } from './Data';

export default class YouthAction_Traffic extends Action.ActionPage {
    constructor(manager, obj, scale = 0.355) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = scale;
        this.videoData = videoData.youth[3];
        this.videoTextures = this.manager.resources["image/video/youth/sprites.json"].spritesheet.textures;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, this.videoData.name, this.videoData.soundUrl),
            "video": new Youth_Traffic_Video(this.manager, this, this.videoData.url),
            "ui": new Action.ActionStart(this.manager, this, this.videoData.startText),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Action.ActionEnd(this.manager, this, this.videoData.endText)
    }
}
class Youth_Traffic_Video extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "Youth_Traffic_Video";
        this.pauseTime = [0, 6, 7.5];
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
                    this.action.children.ui = new Youth_Traffic_UI_Stage1(this.manager, this.action);
                    this.action.children.ui.setup();
                    break;
                case 2:
                    this.action.children.video2 = new Youth_Traffic_Video2(this.manager, this.action,
                        `video/youth_traffic_${this.random + 1}.mp4`, this.random);
                    this.action.children.video2.setup();
                    gsap.to(this.container, { duration: 1, alpha: 0 });
                    break;
            }
            this.count++;
        }
    }
}
class Youth_Traffic_UI_Stage1 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Traffic_UI_Stage1";
        this.scale = 1;
        this.dir = ["?????????", "?????????"];
        this.random = Math.floor(Math.random() * 2);
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
            this.sound = new Action.ActionSound(
                this.manager, this,
                `youth_traffic_${this.random + 1}`,
                `sound/youth_traffic_${this.random + 1}.mp3`);
            this.sound.play();

            let title = createSprite(this.action.videoTextures["traffic_1_title.png"], [1, 0.5], this.scale);
            let hint = createSprite(this.action.videoTextures["traffic_1_hint.png"], 0.5, this.scale);
            let choose_1 = createSprite(this.action.videoTextures["traffic_1_choose_1.png"], 0.5, this.scale);
            let choose_2 = createSprite(this.action.videoTextures["traffic_1_choose_2.png"], 0.5, this.scale);
            let button_1 = createSprite(this.action.videoTextures["traffic_1_button_1.png"], 0.5, this.scale);
            let button_2 = createSprite(this.action.videoTextures["traffic_1_button_2.png"], 0.5, this.scale);

            title.position.set((0.5 * this.w) - 150, (-0.5 * this.h) + 95);
            this.setPosition(hint, 0, -0.3);
            this.setPosition(choose_1, 0.35, -0.1);
            this.setPosition(choose_2, -0.35, -0.1);
            button_1.name = this.dir[0];
            this.setPosition(button_1, 0.35, 0.1);
            button_2.name = this.dir[1];
            this.setPosition(button_2, -0.35, 0.1);

            this.setInteract(button_1);
            this.setInteract(button_2);

            this.container.addChild(title, hint, choose_1, choose_2, button_1, button_2);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    clickEvent(e) {
        if (e.name === this.dir[this.random]) {
            this.onClearGame();
            this.action.children.video.onClearGame();
            this.action.children.video.random = this.random;
        }
    }
    onClearGame() {
        this.sound.remove();
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
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
class Youth_Traffic_Video2 extends Action.ActionVideo {
    constructor(manager, action, url, random) {
        super(manager, action, url);
        this.name = "Youth_Traffic_Video2";
        this.pauseTime = random == 0 ? [0, 8] : [0, 16];
        this.isEnd = true;
        this.count = 0;
        this.random = random;
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.container.scale.set(this.manager.canvasScale);
        this.action.addChild(this.container);
        this.action.removeChild(this.bg);
        gsap.to(this.container, { duration: 1, alpha: 1 });
        //this.drawBg();
    }
    update() {
        if (!this.isEnd) {
            this.videoCrol.play();
            this.bg.alpha = 0;
        }
        if (this.currentTime >= this.pauseTime[this.count]) {
            switch (this.count) {
                case 0:
                    this.videoCrol.pause();
                    break;
                case 1:
                    if (!this.isEnd) {
                        this.videoCrol.ontimeupdate = undefined;
                        this.videoCrol.currentTime = 0;
                        this.isEnd = true;
                        this.onEnd();
                    }
                    break;
            }
            this.count++;
        }
    }
}