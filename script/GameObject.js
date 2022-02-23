import * as PIXI from "pixi.js";
import gsap from "gsap";
import { TextStyle } from "./TextStyle.js";
import { FilterSet } from "./FilterSet.js";
import { addPointerEvent } from "./GameFunction.js";
import { Cancel } from "./UI.js";
import { math } from "./math.js";


export class PageObject {
    constructor(manager) {
        this.manager = manager;
        this.name = "PageObject";
        this.container = new PIXI.Container();
        this.children = {};
    }
    setup() {
        return new Promise(function (resolve, _) {
            for (let [_, e] of Object.entries(this.children)) { e.setup(); }
            this.manager.app.stage.addChild(this.container);
            resolve();
        }.bind(this))
    }
    resize() {
        for (let [_, e] of Object.entries(this.children)) { e.resize(); }
    }
    update() {
        for (let [_, e] of Object.entries(this.children)) { e.update(); }
    }
    addChild(...e) {
        this.container.addChild(...e);
        this.container.sortChildren();
    }
    removeChild(...e) {
        if (e.length === 0) { this.container.removeChildren(); }
        else { this.container.removeChild(...e); }
    }
    destroy() {
        if (this.children) {
            for (let [_, e] of Object.entries(this.children)) { e.destroy(); }
        }
        for (const prop of Object.getOwnPropertyNames(this)) delete this[prop];
    }
}
export class GameObject {
    constructor(manager) {
        this.manager = manager;
        this.name = "GameObject"
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite();
        this.scale = 1;
        this.ts = TextStyle.link;
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.draw = () => { };
    }
    setup() {
        this.draw();
        this.container.scale.set(this.manager.canvasScale);
        this.manager.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
        this.container.scale.set(this.manager.canvasScale);
    }
    update() { }
    destroy() {
        for (const prop of Object.getOwnPropertyNames(this)) delete this[prop];
    }
}
export class Background extends GameObject {
    constructor(manager, page, url, height = window.innerHeight) {
        super(manager);
        this.page = page;
        this.url = url;
        this.name = "Background";
        this.container.zIndex = 10;
        this.space = 300;
        this.speed = 5;
        this.wall = {
            "right": (-this.w / 2) + ((this.space / 10) + this.speed),
            "left": (this.w / 2) - ((this.space / 10) + this.speed)
        }
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = this.h / height;
            this.container.addChild(this.sprite);
            this.page.container.position.x = this.wall.left;
        }
    }
    update() {
        if (!this.page.isZoomIn) {
            const frame = this.page.container;
            if (this.manager.mouse.x > this.w - this.space && frame.position.x > this.wall.right) {
                let distance = (this.space - (this.w - this.manager.mouse.x)) / 10;
                frame.position.x -= this.speed + distance;
            }
            if (this.manager.mouse.x < this.space && frame.position.x < this.wall.left) {
                let distance = (this.space - this.manager.mouse.x) / 10;
                frame.position.x += this.speed + distance;
            }
        }
    }
}
export class linkObject extends GameObject {
    constructor(manager, page) {
        super(manager);
        this.page = page;
        this.name = "linkObject";
        this.container.zIndex = 20;
        this.x = 0;
        this.y = 0;
        this.url = "image/building/know/billboard.png";
        this.aurl = undefined;
        this.spriteHeight = 250;
        this.zoomIn = 2;
        this.fadeText = "點擊認識"
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            if (this.aurl) {
                this.blink = FilterSet.blink_alpha();
                this.alphaSprite = PIXI.Sprite.from(this.aurl);
                this.alphaSprite.anchor.set(0.5);
                this.alphaSprite.scale.set(this.scale);
                this.alphaSprite.filters = [this.blink.filter];
                this.blink.knockout = true;
                this.container.addChild(this.alphaSprite);
            }
            else {
                this.blink = FilterSet.blink();
                this.sprite.filters = [this.blink.filter];
            }
            this.text = new PIXI.Text(this.fadeText, this.ts);
            this.text.anchor.set(0.5);
            this.textHeight = this.spriteHeight + 10;

            this.container.addChild(this.sprite, this.text);

            this.sprite.clickEvent = this.clickEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
    update() {
        if (this.sprite.isPointerOver) {
            this.blink.outerStrength = 5;
            gsap.to(this.text, { duration: 1, y: this.textHeight * -1, alpha: 1 });
        }
        else if (!this.page.isZoomIn) {
            this.blink.effect();
            gsap.to(this.text, { duration: 0.5, y: this.spriteHeight * -1, alpha: 0 });
        }
        else { this.blink.outerStrength = 0; }
        if (this.cancel) { this.cancel.update(); }
    }
    clickEvent() {
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn });
        tl.to(this.page.container, { duration: 0.5, x: -this._x * this.zoomIn, y: -this._y * this.zoomIn }, 0);
        this.page.isZoomIn = true;
        this.drawCancel();
    }
    drawCancel() {
        let ch = this.sprite.height / 2;
        let cw = this.sprite.width / 2;
        this.cancel = new Cancel(this.manager,
            this._x + cw + 50, this._y - ch + 60,
            function () { this.cancelEvent() }.bind(this));
        this.cancel.setup();
    }
    cancelEvent() {
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.page.isZoomIn = false;
        this.cancel.remove();
    }
}
export class Player extends GameObject {
    constructor(manager, page) {
        super(manager);
        this.page = page;
        this.name = "Player";
        this.mouse = this.manager.mouse;
        this.container.zIndex = 90;
        this.scale = 0.5;
        this.x = -0.412;
        this.y = 0.119;
        this.speed = 25;
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from("image/player.svg");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.container.addChild(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
    update() {
        let mx = math.Map(this.mouse.x, 0, this.w, -this.w / 2, this.w / 2) - this.page.container.position.x;
        if (mx > this.container.position.x + 50) {
            gsap.to(this.container, { duration: 0.5, x: "+=" + this.speed });
            this.sprite.scale.set(this.scale, this.scale);
        }
        else if (mx < this.container.position.x - 50) {
            gsap.to(this.container, { duration: 0.5, x: "-=" + this.speed });
            this.sprite.scale.set(-this.scale, this.scale);
        }
        else {
            gsap.to(this.container, { duration: 0.5, x: "+=0" });
        }
    }
}