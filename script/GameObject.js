import * as PIXI from "pixi.js";
import gsap from "gsap";
import { TextStyle } from "./TextStyle.js";
import { FilterSet } from "./FilterSet.js";
import { addPointerEvent } from "./GameFunction.js";

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
    constructor(manager, url, height = window.innerHeight) {
        super(manager);
        this.url = url;
        this.name = "Background";
        this.container.zIndex = 10;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = this.h / height;
            this.container.addChild(this.sprite);
        }
    }
}
export class linkObject extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "linkObject";
        this.container.zIndex = 20;
        this.scale = 1;
        this.filter = FilterSet.link;
        this.spriteHeight = 100;
        this.textHeight = this.spriteHeight + 10;
        this.x = 0;
        this.y = 0;
        this.url = "image/location.svg";
        this.surl = undefined;
        this.draw = function () {
            let _x = (this.x * this.w);
            let _y = (this.y * this.h);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.text = new PIXI.Text(this.name, this.ts);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50 * -1);
            if (this.surl) {
                this.shadow = PIXI.Sprite.from(this.surl);
                this.shadow.anchor.set(0.5);
                this.shadow.scale.set(this.scale);
                this.container.addChild(this.shadow, this.sprite, this.text);
            }
            else { this.container.addChild(this.sprite, this.text); }
            this.sprite.clickEvent = this.clickEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(_x, _y);
        }
    }
    update() {
        if (this.sprite.isPointerOver) {
            this.sprite.filters = [this.filter];
            gsap.to(this.text, { duration: 1, y: this.textHeight * -1, alpha: 1 });
            gsap.to(this.sprite.scale, { duration: 1, x: this.scale + 0.01, y: this.scale + 0.01 });
        }
        else {
            this.sprite.filters = [];
            gsap.to(this.text, { duration: 0.5, y: this.spriteHeight * -1, alpha: 0 });
            gsap.to(this.sprite.scale, { duration: 1, x: this.scale, y: this.scale });
        }
    }
    clickEvent() {
        alert(`You Click the ${this.name}!`);
    }
}