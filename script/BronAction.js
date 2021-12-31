import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { ActionPage, ActionUI, ActionVideo, ActionLine, ActionRope } from "./Action";
export default class BronAction extends ActionPage {
    constructor(manager) {
        super(manager);
        this.name = "BronAction";
        this.offset = 50;
        this.isPlayGame = false;
        this.children = {
            "video": new childhoodVideo(manager, this, "video/childhood_kelly.mp4"),
            "ui_start": new UI_Start(manager, this)
        }
        //this.children.line.drawLine = (e) => { e.moveTo(50, 50).bezierCurveTo(50, 50, 200, 100, 100, 100); }
    }

}

class childhoodVideo extends ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "childhoodVideo";
        this.pauseTime = [10.5,20,30,40];
        this.count = 0;
    }
    update() {
        this.test();
        if (this.currentTime > this.pauseTime[this.count]) {
            this.action.isPlayGame = true;
            this.onPlayGame();
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
                this.container.destroy();
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