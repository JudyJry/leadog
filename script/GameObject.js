import * as PIXI from "pixi.js";
import gsap from "gsap";
import * as gf from "./GameFunction.js";
import { GlowFilter } from 'pixi-filters';
import { ColorSlip } from "./ColorSlip.js";

export class PageObject {
    constructor(manager) {
        this.manager = manager;
        this.name = "PageObject";
        this.children = {};
        this.isfristLoad = true;
    }
    setup() {
        if (this.isfristLoad) {
            for (let [_, e] of Object.entries(this.children)) { e.setup(); }
            this.isfristLoad = false;
        }
        else this.reload();
    }
    resize() {
        for (let [_, e] of Object.entries(this.children)) { e.resize(); }
    }
    update() {
        for (let [_, e] of Object.entries(this.children)) { e.update(); }
    }
    reload() {
        for (let [_, e] of Object.entries(this.children)) { this.manager.addChild(e.container); }
    }
    addKeyEvent(k) {
        for (let [_, e] of Object.entries(this.children)) { e.addKeyEvent(k); }
    }
    addMouseEvent(m) {
        for (let [_, e] of Object.entries(this.children)) { e.addMouseEvent(m); }
    }
}

export class GameObject {
    constructor(manager) {
        this.manager = manager;
        this.name = "GameObject"
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite();
        this.textStyle = new PIXI.TextStyle({
            fontFamily: "GenSenRounded-B",
            fontSize: 30,
            fill: ColorSlip.darkOrange,
        });
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.draw = () => { };
    }
    setup() {
        this.draw();
        this.manager.addChild(this.container);
    }
    resize() {
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
    }
    update() { }
    addKeyEvent(k) { }
    addMouseEvent(m) { }
}

export class linkObject extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "linkObject";
        this.container.zIndex = 20;
        this.scale = 1;
        this.filter = new GlowFilter({
            distance: 10,
            outerStrength: 7,
            innerStrength: 0,
            color: ColorSlip.yellow,
            quality: 0.5
        });
        this.spriteHeight = 100;
        this.textHeight = this.spriteHeight + 10;
        this.x = 0;
        this.y = 0;
        this.url = "image/location.svg";
        this.draw = function () {
            let _x = (this.x * this.w);
            let _y = (this.y * this.h);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.text = new PIXI.Text(this.name, this.textStyle);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50 * -1);
            this.container.position.set(_x, _y);
            this.container.addChild(this.sprite, this.text);
        }
    }
    update() {
        if (this.manager.isUsePlayer) {
            this.manager.arrived(this.name, gf.rectCollision(this.manager.player.container, this.sprite));
        }
        else {
            this.manager.arrived(this.name, gf.pointCollision(this.manager.mouse.position, this.sprite));
        }
        if (this.manager.isArrive(this.name)) {
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
}