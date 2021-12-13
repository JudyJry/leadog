import * as PIXI from "pixi.js";

export class PageObject {
    constructor(manager) {
        this.manager = manager;
        this.name = "PageObject";
        this.children = {};
    }
    setup() {
        for (let [_, e] of Object.entries(this.children)) { e.setup(); }
    }
    resize() {
        for (let [_, e] of Object.entries(this.children)) { e.resize(); }
    }
    update() {
        for (let [_, e] of Object.entries(this.children)) { e.update(); }
    }
    reload() {
        for (let [_, e] of Object.entries(this.children)) { this.manager.app.stage.addChild(e.container); }
    }
}

export class GameObject {
    constructor(manager) {
        this.manager = manager;
        this.name = "GameObject"
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite();
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.draw = ()=>{};
    }
    setup() {
        this.draw();
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
    }
    update() {

    }
}