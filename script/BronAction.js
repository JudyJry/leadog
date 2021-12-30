import * as PIXI from 'pixi.js';
import { ActionPage, ActionUI, ActionVideo, ActionLine, ActionRope } from "./Action";
export default class BronAction extends ActionPage {
    constructor(manager) {
        super(manager);
        this.name = "BronAction";
        this.offset = 50;
        this.isPlayGame = false;
        this.children = {
            "video": new ActionVideo(manager, this, "video/childhood_kelly.mp4"),
            //"line": new ActionLine(manager, this),
            //"rope": new ActionRope(manager, this),
            "ui_start": new UI_Start(manager, this)
        }
        //this.children.line.drawLine = (e) => { e.moveTo(50, 50).bezierCurveTo(50, 50, 200, 100, 100, 100); }
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
            this.container.addChild(this.sprite);
            this.setPosition(0, 0.3, 0.5);
            this.setInteract();
        }
    }
    clickEvent() {
        console.log("click " + this.name);
        this.action.children.video.play();
        this.container.destroy();
    }
}