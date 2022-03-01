import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import { Page } from './Data';

export default class YouthAction_Traffic extends Action.ActionPage {
    constructor(manager) {
        super(manager);
        this.name = "YouthAction";
        this.offset = 50;
        this.isPlayGame = false;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "youth_traffic", "sound/youth_traffic.wav"),
            "video": new Youth_Traffic_Video(this.manager, this, "video/youth_traffic.mp4"),
            "ui": new Youth_Traffic_UI_Start(this.manager, this),
            "logo": new Action.LogoVideo(this.manager, this)
        }
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
                    break;
            }
            this.count++;
        }

    }
}
class Youth_Traffic_UI_Start extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Traffic_UI_Start";
        this.isNotStart = true;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/video/know.png");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.setPosition(this.sprite, 0, 0.3);
            this.sprite.alpha = 0;

            let textTitle = new PIXI.Text("任務目標", this.ts);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text("一起幫助狗狗帶領訓練師平安度過挑戰吧！", this.tsm);
            textDescribe.anchor.set(0.5);
            this.setPosition(textDescribe, 0, 0);

            this.container.addChild(textTitle, textDescribe, this.sprite);
            this.container.alpha = 0;
        }
    }
    start() {
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 }, 1);
        tl.to(this.sprite, {
            duration: 1, alpha: 1,
            onComplete: function () { this.setInteract(this.sprite); }.bind(this)
        }, "+=0.5");
    }
    clickEvent() {
        if (this.isNotStart) {
            this.isNotStart = false;
            gsap.to(this.container, {
                duration: 1, alpha: 0, onComplete: function () {
                    this.manager.removeChild(this.container);
                    this.action.children.video.isStart = true;
                    this.action.children.video.play();
                }.bind(this)
            });
        }
    }
}
class Youth_Traffic_UI_Stage1 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Traffic_UI_Stage1";
        this.scale = 1;
        this.dir = ["東西向", "南北向"];
        this.dirSound = ["sound/youth_traffic_1.mp3", "sound/youth_traffic_2.mp3"];
        this.random = Math.floor(Math.random() * 2);
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
            this.sound = new Action.ActionSound(this.manager, this, `youth_traffic_${this.random + 1}`, this.dirSound[this.random]);
            this.sound.play();

            let title = PIXI.Sprite.from("image/video/youth/traffic/stage_1_title.png");
            let hint = PIXI.Sprite.from("image/video/youth/traffic/stage_1_hint.png");
            let choose_1 = PIXI.Sprite.from("image/video/youth/traffic/stage_1_choose_1.png");
            let choose_2 = PIXI.Sprite.from("image/video/youth/traffic/stage_1_choose_2.png");
            let button_1 = PIXI.Sprite.from("image/video/youth/traffic/stage_1_button_1.png");
            let button_2 = PIXI.Sprite.from("image/video/youth/traffic/stage_1_button_2.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, 0, -0.3);
            choose_1.anchor.set(0.5);
            choose_1.scale.set(this.scale);
            this.setPosition(choose_1, 0.35, -0.1);
            choose_2.anchor.set(0.5);
            choose_2.scale.set(this.scale);
            this.setPosition(choose_2, -0.35, -0.1);
            button_1.anchor.set(0.5);
            button_1.scale.set(this.scale);
            button_1.name = this.dir[0];
            this.setPosition(button_1, 0.35, 0.1);
            button_2.anchor.set(0.5);
            button_2.scale.set(this.scale);
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
        this.sound.pause();
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.manager.removeChild(this.container);
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
class Youth_Traffic_Video2 extends Action.ActionVideo {
    constructor(manager, action, url, random) {
        super(manager, action, url);
        this.name = "Youth_Traffic_Video2";
        this.pauseTime = random === 0 ? [0, 9] : [0, 17];
        this.isEnd = true;
        this.count = 0;
        this.random = random;
    }
    update() {
        this.videoCrol.play().then(function () { gsap.to(this.container, { duration: 1, alpha: 1 }); }.bind(this));
        if (this.currentTime >= this.pauseTime[this.count]) {
            switch (this.count) {
                case 0:
                    this.action.children.video.pause();
                    break;
                case 1:
                    if (!this.isEnd) {
                        this.action.children.video.videoCrol.ontimeupdate = undefined;
                        this.action.children.video.videoCrol.currentTime = 0;
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
            duration: 1 + this.random, alpha: 1, onComplete: function () {
                this.action.children.ui = new Youth_Traffic_UI_End(this.manager, this.action);
                this.action.children.ui.setup();
                this.action.children.ui.end();
                this.videoCrol.ontimeupdate = undefined;
                this.pause();
                this.videoCrol.currentTime = 0;
            }.bind(this)
        });
    }
}
class Youth_Traffic_UI_End extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Youth_Traffic_UI_End";
        this.isNotStart = true;
        this.draw = function () {
            let textTitle = new PIXI.Text("任務完成", this.ts);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text(
                `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
                this.tsm);
            textDescribe.anchor.set(0.5);
            this.setPosition(textDescribe, 0, 0);

            this.container.addChild(textTitle, textDescribe);
            this.container.alpha = 0;
        }
    }
    draw2() {
        this.sprite.texture = PIXI.Texture.from("image/TGDAlogo.png");
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(1.5);
        this.setPosition(this.sprite, -0.018, -0.012);

        this.container.removeChildren();
        let text1 = new PIXI.Text("感謝", this.tsm);
        text1.anchor.set(0.5);
        this.setPosition(text1, -0.156, 0);
        let text2 = new PIXI.Text("協助拍攝", this.tsm);
        text2.anchor.set(0.5);
        this.setPosition(text2, 0.146, 0);
        this.container.addChild(text1, text2, this.sprite);
        this.container.alpha = 0;
    }
    end() {
        this.action.children.sound.isEnd = true;
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.draw2();
            }.bind(this)
        }, "+=2");
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.manager.removeChild(this.container);
                delete this.action.children.ui;
                this.manager.toOtherPage(Page.youth);
            }.bind(this)
        }, "+=2");
    }
}