import * as PIXI from "pixi.js";

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
        for (let [_, e] of Object.entries(this.children)) { this.manager.app.stage.addChild(e.container); }
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
            fill: 0x666803,
        });
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.draw = () => { };
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