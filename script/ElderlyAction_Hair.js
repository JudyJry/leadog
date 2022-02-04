import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";
import ElderlyObject from './ElderlyObject';

export class ElderlyAction_Hair extends Action.ActionPage {
    constructor(manager) {
        super(manager);
        this.name = "ElderlyAction_Hair";
        this.offset = 50;
        this.isPlayGame = false;
        this.children = {
            "sound": new Action.ActionSound(this.manager, this, "elderly_hair", "sound/elderly_hair.mp3"),
            "video": new Elderly_Hair_Video(this.manager, this, "video/elderly_hair.mp4"),
            "ui": new Elderly_Hair_UI_Start(this.manager, this, "一起幫助狗狗整理毛髮吧！"),
            "logo": new Action.LogoVideo(this.manager, this)
        }
        this.end = new Elderly_Hair_UI_End(this.manager, this,
            `謝謝你幫助狗狗整理毛髮\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`)
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
            let title = PIXI.Sprite.from(`image/video/elderly/hair/title_${this.count}.png`);
            let hint = PIXI.Sprite.from(`image/video/elderly/hair/hint_${this.count}.png`);
            let button_1 = PIXI.Sprite.from("image/video/elderly/hair/button_1.png");
            let button_2 = PIXI.Sprite.from("image/video/elderly/hair/button_2.png");
            let button_3 = PIXI.Sprite.from("image/video/elderly/hair/button_3.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, -0.284, -0.4);
            button_1.anchor.set(0.5);
            button_1.scale.set(this.scale);
            button_1.name = this.choose[0];
            this.setPosition(button_1, 0.4, -0.1);
            button_2.anchor.set(0.5);
            button_2.scale.set(this.scale);
            button_2.name = this.choose[1];
            this.setPosition(button_2, 0.1, 0.4);
            button_3.anchor.set(0.5);
            button_3.scale.set(this.scale);
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
                this.manager.removeChild(this.container);
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
class Elderly_Hair_UI_Start extends Action.ActionUI {
    constructor(manager, action, text) {
        super(manager, action);
        this.name = "Elderly_Hair_UI_Start";
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
            let textDescribe = new PIXI.Text(text, this.tsm);
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
    update() {
        if (this.sprite.isPointerOver) {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
}
class Elderly_Hair_UI_End extends Action.ActionUI {
    constructor(manager, action, text) {
        super(manager, action);
        this.name = "Elderly_Hair_UI_End";
        this.isNotStart = true;
        this.draw = function () {
            let textTitle = new PIXI.Text("任務完成", this.ts);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text(text, this.tsm);
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
                this.manager.loadPage(new ElderlyObject(this.manager));
            }.bind(this)
        }, "+=2");
    }
}