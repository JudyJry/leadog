import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { ActionPage, ActionUI, ActionVideo, ActionLine, ActionRope, ActionCountDown, ActionGoodjob } from "./Action";

export default class BronAction extends ActionPage {
    constructor(manager) {
        super(manager);
        this.name = "BronAction";
        this.offset = 50;
        this.isPlayGame = false;
        this.children = {
            "video": new childhoodVideo(manager, this, "video/childhood_kelly.mp4"),
            "rope": new ActionRope(manager, this),
            "ui": new UI_Start(manager, this)
        }
    }
}
class childhoodVideo extends ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "childhoodVideo";
        this.pauseTime = [10.5, 20, 30, 40];
        this.uiTime = [
            new UI_Stage1(this.manager, this.action),
            new UI_Stage1(this.manager, this.action),
            new UI_Stage1(this.manager, this.action),
            new UI_Stage1(this.manager, this.action)
        ]
        this.count = 0;
    }
    update() {
        //this.test();
        if (this.currentTime > this.pauseTime[this.count]) {
            this.action.isPlayGame = true;
            this.onPlayGame();
            this.action.children.ui = this.uiTime[this.count];
            this.action.children.ui.setup();
            this.count++;
        }
    }
}
class UI_Start extends ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "UI_Start";
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/video/know.png");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.setPosition(this.sprite, 0, 0.3);
            this.sprite.alpha = 0;

            let textTitle = new PIXI.Text("任務目標", this.UItextStyle);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text("一起幫助狗狗在寄養家庭中習慣人類社會生活吧！", this.UItextStyleSmall);
            textDescribe.anchor.set(0.5);
            this.setPosition(textDescribe, 0, 0);

            this.container.addChild(textTitle, textDescribe, this.sprite);
            this.container.alpha = 0;
            let tl = gsap.timeline();
            tl.to(this.container, { duration: 1, alpha: 1 });
            tl.to(this.sprite, { duration: 1, alpha: 1, onComplete: this.setInteract.bind(this) }, "+=1");
        }
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        if (!this.action.children.video.isStart) {
            this.container.removeChildren();
            this.draw();
        }
    }
    clickEvent() {
        let text = new PIXI.Text("新的一天開始了", this.UItextStyle);
        text.anchor.set(0.5);
        text.alpha = 0;
        this.setPosition(text, 0, 0);

        let tl = gsap.timeline();
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.manager.app.stage.removeChild(this.container);
                this.container.destroy({ children: true });
                this.manager.app.stage.addChild(text);
            }.bind(this)
        });
        tl.to(text, { duration: 0.5, alpha: 1 }, "+=1");
        tl.to(text, {
            duration: 0.5, alpha: 0, onComplete: function () {
                this.manager.app.stage.removeChild(text);
                text.destroy();
                this.action.children.video.isStart = true;
                this.action.children.video.play();
            }.bind(this)
        }, "+=2");
    }
}
class UI_Stage1 extends ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "UI_Start";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new ActionCountDown(manager, action, this);
            this.action.children.line = new Stage1_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/childhood/Kelly/stage_1_title.png");
            let hint = PIXI.Sprite.from("image/video/childhood/Kelly/stage_1_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, -0.25, 0.05);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.manager.app.stage.removeChild(this.container);
                this.manager.app.stage.removeChild(this.action.children.line.container);
                this.container.destroy({ children: true });
                this.action.children.line.container.destroy({ children: true });
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.manager.app.stage.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Stage1_Line extends ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.draw = function () {
            this.sprite.moveTo(1109, 365).bezierCurveTo(1109, 365, 1196, 446, 1217, 552);
            //this.sprite.moveTo(0, 0).bezierCurveTo(0, 0, 87, 81, 108, 187);
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.manager.app.stage.sortChildren();
        }
    }
}

