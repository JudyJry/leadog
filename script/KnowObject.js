import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door } from './GameObject.js';
import { FilterSet } from './FilterSet.js';
import { addPointerEvent } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class KnowObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "KnowObject";
        this.container = new PIXI.Container();
        this.isZoomIn = false;
        this.children = {
            "background": new Background(this.manager, this, "image/building/know/bg.png"),
            "door": new Door(this.manager, this, -0.411, -0.054, "image/building/know/door.png"),
            "billboard": new Billboard(this.manager, this),
            "blackboard": new Blackboard(this.manager, this),
            "gashapon": new Gashapon(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Billboard extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "寄養家庭條件";
        this.x = -0.189;
        this.y = 0.017;
        this.url = "image/building/know/billboard.png";
        this.zoomIn = 2;
    }
}
class Blackboard extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "收養家庭條件";
        this.x = -0.017;
        this.y = -0.095;
        this.url = "image/building/know/blackboard.png";
        this.zoomIn = 2;
    }
}
class Gashapon extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "收養家庭條件";
        this.x = 0.259;
        this.y = -0.05;
        this.url = "image/building/know/gashapon.png";
        this.aurl = "image/building/know/gashapon_alpha.png";
        this.zoomIn = 1.2;
        this.fadeText = "開始遊戲";
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);

            this.blink = FilterSet.blink_alpha();
            this.alphaSprite = PIXI.Sprite.from(this.aurl);
            this.alphaSprite.anchor.set(0.5);
            this.alphaSprite.scale.set(this.scale);
            this.alphaSprite.filters = [this.blink.filter];
            this.blink.knockout = true;
            this.container.addChild(this.alphaSprite);

            this.text = new PIXI.Text(this.fadeText, this.ts);
            this.text.anchor.set(0.5);
            this.textHeight = this.spriteHeight + 10;
            this.text.position.y = -this.spriteHeight;
            this.text.alpha = 0;
            this.container.addChild(this.sprite, this.text);

            this.sprite.clickEvent = this.clickEvent.bind(this);
            this.sprite.overEvent = this.overEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
    clickEvent() {
        this.sprite.interactive = false;
        this.blink.outerStrength = 0;
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn });
        tl.to(this.page.container, { duration: 0.5, x: -this._x * this.zoomIn, y: -this._y * this.zoomIn }, 0);
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
    }
    cancelEvent() {
        this.alphaSprite.filters = [this.blink.filter];
        let tl = gsap.timeline({
            onComplete: function () {
                this.sprite.interactive = true;
            }.bind(this)
        });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
    }
}

